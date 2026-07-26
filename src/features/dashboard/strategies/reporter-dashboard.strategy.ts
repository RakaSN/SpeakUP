import { db } from '@/shared/server/db';
import { IDashboardStrategy, DashboardData } from './dashboard.strategy';

export class ReporterDashboardStrategy implements IDashboardStrategy {
  async execute(userId: string): Promise<DashboardData> {
    const ownWhere = {
      deletedAt: null,
      reporterId: userId,
    };

    // Execute queries in parallel
    const [total, resolved, pending, recentTickets] = await Promise.all([
      db.ticket.count({ where: ownWhere }),
      db.ticket.count({
        where: { ...ownWhere, status: { name: { in: ['Resolved', 'Closed'] } } },
      }),
      db.ticket.count({
        where: { ...ownWhere, status: { name: { in: ['Submitted', 'Assigned', 'In Progress'] } } },
      }),
      db.ticket.findMany({
        where: ownWhere,
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
          category: { select: { name: true } },
        },
      }),
    ]);

    return {
      roleName: 'Pelapor (Warga Sekolah)',
      metrics: { total, resolved, pending },
      recentTickets: recentTickets as unknown as DashboardData['recentTickets'],
    };
  }
}
