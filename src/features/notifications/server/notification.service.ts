import { db } from '@/shared/server/db';
import { AppError } from '@/shared/lib/errors';
import { NotificationType, Prisma } from '@prisma/client';

export type { NotificationType };

export interface CreateNotificationParams {
  userId: string;
  title: string;
  message: string;
  type?: NotificationType;
  linkUrl?: string;
}

export const NotificationService = {
  /**
   * Mengambil daftar notifikasi milik pengguna dengan fitur pagination & filter.
   */
  async getNotifications(userId: string, params?: {
    page?: number;
    limit?: number;
    type?: NotificationType;
    isUnreadOnly?: boolean;
  }) {
    const page = params?.page || 1;
    const limit = params?.limit || 10;
    const skip = (page - 1) * limit;

    const where: Prisma.NotificationWhereInput = { userId };
    if (params?.type) where.type = params.type;
    if (params?.isUnreadOnly) where.readAt = null;

    const [items, total] = await Promise.all([
      db.notification.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      db.notification.count({ where }),
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
   * Mengambil jumlah notifikasi yang belum dibaca (unread counter) untuk badge.
   */
  async getUnreadCount(userId: string): Promise<number> {
    return await db.notification.count({
      where: {
        userId,
        readAt: null,
      },
    });
  },

  /**
   * Tandai satu notifikasi tertentu sebagai telah dibaca.
   */
  async markAsRead(userId: string, notificationId: string) {
    const notification = await db.notification.findUnique({
      where: { id: notificationId },
    });

    if (!notification || notification.userId !== userId) {
      throw new AppError('NOT_FOUND', 'Notifikasi tidak ditemukan');
    }

    if (notification.readAt) return notification;

    return await db.notification.update({
      where: { id: notificationId },
      data: { readAt: new Date() },
    });
  },

  /**
   * Tandai seluruh notifikasi pengguna sebagai telah dibaca secara efisien.
   */
  async markAllAsRead(userId: string) {
    return await db.notification.updateMany({
      where: {
        userId,
        readAt: null,
      },
      data: {
        readAt: new Date(),
      },
    });
  },
};
