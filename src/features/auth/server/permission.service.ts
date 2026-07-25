import { db } from '@/shared/server/db';
import { appLogger } from '@/shared/server/logger/app.logger';

export class PermissionService {
  /**
   * Mengecek apakah user memiliki kode izin (permissionCode) tertentu.
   * Resolusi: User -> UserRole -> Role -> RolePermission -> Permission.
   */
  async hasPermission(userId: string, permissionCode: string): Promise<boolean> {
    try {
      const user = await db.user.findUnique({
        where: { id: userId },
        include: {
          userRoles: {
            include: {
              role: {
                include: {
                  permissions: {
                    include: {
                      permission: true,
                    },
                  },
                },
              },
            },
          },
        },
      });

      if (!user) return false;

      // Ekstraksi seluruh kode izin (flatten) dari semua peran (roles) yang dimiliki user
      const userPermissionCodes = user.userRoles.flatMap((ur) =>
        ur.role.permissions.map((rp) => rp.permission.code)
      );

      return userPermissionCodes.includes(permissionCode);
    } catch (error) {
      appLogger.error(`[PermissionService] Gagal memverifikasi izin ${permissionCode} untuk user ${userId}`, error);
      return false;
    }
  }

  /**
   * Mendapatkan seluruh izin (permissions) yang dimiliki seorang user.
   */
  async getUserPermissions(userId: string): Promise<string[]> {
    try {
      const user = await db.user.findUnique({
        where: { id: userId },
        include: {
          userRoles: { include: { role: { include: { permissions: { include: { permission: true } } } } } },
        },
      });

      if (!user) return [];

      const codes = user.userRoles.flatMap((ur) =>
        ur.role.permissions.map((rp) => rp.permission.code)
      );
      
      // Return unique permissions
      return Array.from(new Set(codes));
    } catch (error) {
      appLogger.error(`[PermissionService] Gagal mengambil daftar izin user ${userId}`, error);
      return [];
    }
  }
}
