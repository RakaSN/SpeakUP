import { db } from '@/shared/server/db';
import { IDashboardStrategy, DashboardData } from './dashboard.strategy';

export class ReporterDashboardStrategy implements IDashboardStrategy {
  async execute(userId: string): Promise<DashboardData> {
    const ownWhere = {
      deletedAt: null,
      reporterId: userId,
    };

    const total = await db.ticket.count({ where: ownWhere });
    const resolved = await db.ticket.count({
      where: { ...ownWhere, status: { name: { in: ['Resolved', 'Closed'] } } },
    });
    const pending = await db.ticket.count({
      where: { ...ownWhere, status: { name: { in: ['Submitted', 'Assigned', 'In Progress'] } } },
    });

    const recentTickets = await db.ticket.findMany({
      where: ownWhere,
      take: 5,
      orderBy: { createdAt: 'desc' },
      include: { status: true, priority: true, category: true },
    });

    return {
      roleName: 'Pelapor (Warga Sekolah)',
      metrics: { total, resolved, pending },
      recentTickets,
    };
  }
}
