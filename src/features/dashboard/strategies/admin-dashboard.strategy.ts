import { db } from '@/shared/server/db';
import { IDashboardStrategy, DashboardData } from './dashboard.strategy';

export class AdminDashboardStrategy implements IDashboardStrategy {
  async execute(): Promise<DashboardData> {
    const total = await db.ticket.count({ where: { deletedAt: null } });
    const resolved = await db.ticket.count({
      where: { deletedAt: null, status: { name: { in: ['Resolved', 'Closed'] } } },
    });
    const pending = await db.ticket.count({
      where: { deletedAt: null, status: { name: { in: ['Submitted', 'Assigned', 'In Progress'] } } },
    });
    const overdue = await db.ticket.count({
      where: { deletedAt: null, slaStatus: 'OVERDUE' },
    });

    const recentTickets = await db.ticket.findMany({
      where: { deletedAt: null },
      take: 5,
      orderBy: { createdAt: 'desc' },
      include: { status: true, priority: true, reporter: { select: { name: true } } },
    });

    return {
      roleName: 'Super Admin',
      metrics: { total, resolved, pending, overdue },
      recentTickets,
    };
  }
}
