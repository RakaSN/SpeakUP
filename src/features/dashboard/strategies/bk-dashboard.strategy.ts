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

    // Execute queries in parallel
    const [total, resolved, pending, overdue, recentTickets] = await Promise.all([
      db.ticket.count({ where: assignedWhere }),
      db.ticket.count({
        where: { ...assignedWhere, status: { name: { in: ['Resolved', 'Closed'] } } },
      }),
      db.ticket.count({
        where: { ...assignedWhere, status: { name: { in: ['Submitted', 'Assigned', 'In Progress'] } } },
      }),
      db.ticket.count({
        where: { ...assignedWhere, slaStatus: 'OVERDUE' },
      }),
      db.ticket.findMany({
        where: assignedWhere,
        take: 5,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          ticketNumber: true,
          title: true,
          createdAt: true,
          resolvedAt: true,
          targetResolutionAt: true,
          slaStatus: true,
          status: { select: { name: true } },
          priority: { select: { name: true } },
          reporter: { select: { name: true } },
        },
      }),
    ]);

    return {
      roleName: 'Petugas BK / Guru',
      metrics: { total, resolved, pending, overdue },
      recentTickets: recentTickets as unknown as DashboardData['recentTickets'],
    };
  }
}
