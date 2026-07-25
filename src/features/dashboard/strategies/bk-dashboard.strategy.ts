import { db } from '@/shared/server/db';
import { IDashboardStrategy, DashboardData } from './dashboard.strategy';

export class BKDashboardStrategy implements IDashboardStrategy {
  async execute(userId: string): Promise<DashboardData> {
    const assignedWhere = {
      deletedAt: null,
      assignments: {
        some: { assigneeId: userId, isActive: true },
      },
    };

    const total = await db.ticket.count({ where: assignedWhere });
    const resolved = await db.ticket.count({
      where: { ...assignedWhere, status: { name: { in: ['Resolved', 'Closed'] } } },
    });
    const pending = await db.ticket.count({
      where: { ...assignedWhere, status: { name: { in: ['Submitted', 'Assigned', 'In Progress'] } } },
    });
    const overdue = await db.ticket.count({
      where: { ...assignedWhere, slaStatus: 'OVERDUE' },
    });

    const recentTickets = await db.ticket.findMany({
      where: assignedWhere,
      take: 5,
      orderBy: { createdAt: 'desc' },
      include: { status: true, priority: true, reporter: { select: { name: true } } },
    });

    return {
      roleName: 'Petugas BK / Guru',
      metrics: { total, resolved, pending, overdue },
      recentTickets,
    };
  }
}
