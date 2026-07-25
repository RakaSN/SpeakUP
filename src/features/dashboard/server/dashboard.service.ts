import { db } from '@/shared/server/db';
import { IDashboardStrategy, DashboardData } from '../strategies/dashboard.strategy';
import { AdminDashboardStrategy } from '../strategies/admin-dashboard.strategy';
import { BKDashboardStrategy } from '../strategies/bk-dashboard.strategy';
import { ReporterDashboardStrategy } from '../strategies/reporter-dashboard.strategy';

type UserRoleWithRole = {
  role: {
    name: string;
  };
};

export const DashboardService = {
  /**
   * Mengambil data dashboard secara dinamis berdasarkan Strategy Pattern & Role pengguna.
   */
  async getDashboardData(userId: string): Promise<DashboardData> {
    // Ambil roles pengguna dari database
    const userRoles = await db.userRole.findMany({
      where: { userId },
      include: { role: true },
    });

    const roleNames = userRoles.map((ur: UserRoleWithRole) => ur.role.name.toLowerCase());

    let strategy: IDashboardStrategy;

    if (roleNames.includes('super admin') || roleNames.includes('admin')) {
      strategy = new AdminDashboardStrategy();
    } else if (roleNames.includes('bk') || roleNames.includes('petugas')) {
      strategy = new BKDashboardStrategy();
    } else {
      strategy = new ReporterDashboardStrategy();
    }

    return await strategy.execute(userId);
  },
};
