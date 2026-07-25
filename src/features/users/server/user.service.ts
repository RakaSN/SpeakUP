import { db } from '@/shared/server/db';
import { AppError } from '@/shared/lib/errors';
import { eventBus } from '@/shared/events/event-bus';
import { UserStatus, Prisma } from '@prisma/client';
import bcrypt from 'bcryptjs';

export type { UserStatus };

export interface CreateUserData {
  name: string;
  email: string;
  password?: string;
  status?: UserStatus;
  roleIds?: string[];
}

export interface UpdateUserData {
  name?: string;
  email?: string;
  status?: UserStatus;
  roleIds?: string[];
}

export const UserService = {
  /**
   * Mengambil daftar pengguna terpaginasi dengan filter opsi (role, status, search).
   */
  get getUsers() {
    return this.listUsers;
  },

  async listUsers(params: {
    page?: number;
    limit?: number;
    search?: string;
    status?: UserStatus;
    roleId?: string;
  }) {
    const page = params.page || 1;
    const limit = params.limit || 10;
    const skip = (page - 1) * limit;

    const where: Prisma.UserWhereInput = { deletedAt: null };
    if (params.status) where.status = params.status;
    if (params.roleId) {
      where.userRoles = {
        some: { roleId: params.roleId },
      };
    }
    if (params.search) {
      where.OR = [
        { name: { contains: params.search, mode: 'insensitive' } },
        { email: { contains: params.search, mode: 'insensitive' } },
      ];
    }

    const [items, total] = await Promise.all([
      db.user.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          userRoles: {
            include: { role: true },
          },
        },
      }),
      db.user.count({ where }),
    ]);

    return {
      items,
      meta: {
        totalItems: total,
        totalPages: Math.ceil(total / limit),
        currentPage: page,
        itemsPerPage: limit,
      },
    };
  },

  /**
   * Detail pengguna berdasarkan ID.
   */
  async getUser(id: string) {
    const user = await db.user.findUnique({
      where: { id, deletedAt: null },
      include: {
        userRoles: {
          include: { role: true },
        },
      },
    });

    if (!user) throw new AppError('NOT_FOUND', 'Pengguna tidak ditemukan');
    return user;
  },

  /**
   * Membuat pengguna baru beserta role assignment & audit log.
   */
  async createUser(data: CreateUserData, adminId: string) {
    const existing = await db.user.findUnique({ where: { email: data.email } });
    if (existing) throw new AppError('DUPLICATE_RESOURCE', 'Email sudah terdaftar');

    const defaultPassword = data.password || 'SpeakUp2026!';
    const hashedPassword = await bcrypt.hash(defaultPassword, 10);

    return await db.transaction(async (tx) => {
      const user = await tx.user.create({
        data: {
          name: data.name,
          email: data.email,
          password: hashedPassword,
          status: data.status || 'ACTIVE',
        },
      });

      if (data.roleIds && data.roleIds.length > 0) {
        await tx.userRole.createMany({
          data: data.roleIds.map((roleId) => ({
            userId: user.id,
            roleId,
          })),
        });
      }

      await eventBus.publish({
        type: 'USER_ROLE_CHANGED',
        payload: { userId: user.id, roles: data.roleIds || [], adminId },
      });

      return user;
    });
  },

  /**
   * Memperbarui informasi pengguna, status akun, atau roles.
   */
  async updateUser(id: string, data: UpdateUserData, adminId: string) {
    return await db.transaction(async (tx) => {
      const currentUser = await tx.user.findUnique({ where: { id } });
      if (!currentUser) throw new AppError('NOT_FOUND', 'Pengguna tidak ditemukan');

      const updatedUser = await tx.user.update({
        where: { id },
        data: {
          ...(data.name && { name: data.name }),
          ...(data.email && { email: data.email }),
          ...(data.status && { status: data.status }),
        },
      });

      if (data.status && data.status !== currentUser.status) {
        await eventBus.publish({
          type: 'USER_STATUS_CHANGED',
          payload: { userId: id, newStatus: data.status, adminId },
        });
      }

      if (data.roleIds) {
        await tx.userRole.deleteMany({ where: { userId: id } });
        if (data.roleIds.length > 0) {
          await tx.userRole.createMany({
            data: data.roleIds.map((roleId) => ({
              userId: id,
              roleId,
            })),
          });
        }
        await eventBus.publish({
          type: 'USER_ROLE_CHANGED',
          payload: { userId: id, roles: data.roleIds, adminId },
        });
      }

      return updatedUser;
    });
  },

  /**
   * Reset Password manual oleh Admin.
   */
  async resetPassword(id: string, adminId: string): Promise<string> {
    const tempPassword = `Reset${Math.random().toString(36).slice(-6)}!`;
    const hashedPassword = await bcrypt.hash(tempPassword, 10);

    await db.user.update({
      where: { id },
      data: { password: hashedPassword },
    });

    await eventBus.publish({
      type: 'AUTH_PASSWORD_RESET',
      payload: { userId: id, adminId },
    });

    return tempPassword;
  },

  /**
   * Ubah Password mandiri oleh pengguna (Profile).
   */
  async changePassword(userId: string, oldPass: string, newPass: string) {
    const user = await db.user.findUnique({ where: { id: userId } });
    if (!user) throw new AppError('NOT_FOUND', 'Pengguna tidak ditemukan');

    const isValid = await bcrypt.compare(oldPass, user.password);
    if (!isValid) throw new AppError('INVALID_CREDENTIALS', 'Password lama Anda salah');

    const hashedPassword = await bcrypt.hash(newPass, 10);
    return await db.user.update({
      where: { id: userId },
      data: { password: hashedPassword },
    });
  },
};
