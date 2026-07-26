import { db } from '@/shared/server/db';

export interface TicketAnalyticsDataset {
  windowStart: Date;
  windowEnd: Date;
  totalTickets: number;
  overdueTickets: number;
  categoryCounts: Array<{ name: string; count: number }>;
  priorityCounts: Array<{ name: string; count: number }>;
  statusCounts: Array<{ name: string; count: number }>;
  sampleTitles: string[];
}

export const TicketAnalyticsRepository = {
  /**
   * Fetches aggregated ticket dataset for AI Trend Analysis within a given date window.
   */
  async getDatasetForPeriod(windowStart: Date, windowEnd: Date): Promise<TicketAnalyticsDataset> {
    const tickets = await db.ticket.findMany({
      where: {
        createdAt: {
          gte: windowStart,
          lte: windowEnd,
        },
        deletedAt: null,
      },
      include: {
        category: true,
        priority: true,
        status: true,
      },
    });

    const totalTickets = tickets.length;
    const overdueTickets = tickets.filter((t) => t.slaStatus === 'OVERDUE').length;

    // Aggregate Categories
    const catMap = new Map<string, number>();
    tickets.forEach((t) => {
      const catName = t.category?.name || 'Uncategorized';
      catMap.set(catName, (catMap.get(catName) || 0) + 1);
    });

    const categoryCounts = Array.from(catMap.entries()).map(([name, count]) => ({
      name,
      count,
    }));

    // Aggregate Priorities
    const prioMap = new Map<string, number>();
    tickets.forEach((t) => {
      const prioName = t.priority?.name || 'Normal';
      prioMap.set(prioName, (prioMap.get(prioName) || 0) + 1);
    });

    const priorityCounts = Array.from(prioMap.entries()).map(([name, count]) => ({
      name,
      count,
    }));

    // Aggregate Statuses
    const statusMap = new Map<string, number>();
    tickets.forEach((t) => {
      const statusName = t.status?.name || 'Unknown';
      statusMap.set(statusName, (statusMap.get(statusName) || 0) + 1);
    });

    const statusCounts = Array.from(statusMap.entries()).map(([name, count]) => ({
      name,
      count,
    }));

    // Sample ticket titles for context
    const sampleTitles = tickets.slice(0, 15).map((t) => `[${t.category?.name}] ${t.title}`);

    return {
      windowStart,
      windowEnd,
      totalTickets,
      overdueTickets,
      categoryCounts,
      priorityCounts,
      statusCounts,
      sampleTitles,
    };
  },
};
