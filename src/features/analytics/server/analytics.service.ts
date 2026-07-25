import { db } from '@/shared/server/db';

export const AnalyticsService = {
  /**
   * Mengambil ringkasan metrik tiket untuk analitik eksekutif.
   */
  async getSummaryMetrics() {
    const total = await db.ticket.count({ where: { deletedAt: null } });
    const resolved = await db.ticket.count({
      where: { deletedAt: null, status: { name: { in: ['Resolved', 'Closed'] } } },
    });
    const pending = await db.ticket.count({
      where: { deletedAt: null, status: { name: { in: ['Submitted', 'Assigned', 'In Progress'] } } },
    });

    const resolutionRate = total > 0 ? ((resolved / total) * 100).toFixed(1) : '0';

    return { total, resolved, pending, resolutionRate };
  },

  /**
   * Mengambil grafik distribusi tiket per Kategori.
   */
  async getCategoryDistribution() {
    const categories = await db.masterTicketCategory.findMany({
      where: { deletedAt: null },
      select: {
        id: true,
        name: true,
        _count: {
          select: { tickets: { where: { deletedAt: null } } },
        },
      },
    });

    return categories.map((c) => ({
      categoryId: c.id,
      name: c.name,
      count: c._count.tickets,
    }));
  },

  /**
   * Mengambil grafik distribusi tiket per Status.
   */
  async getStatusDistribution() {
    const statuses = await db.masterTicketStatus.findMany({
      where: { deletedAt: null },
      select: {
        id: true,
        name: true,
        _count: {
          select: { tickets: { where: { deletedAt: null } } },
        },
      },
    });

    return statuses.map((s) => ({
      statusId: s.id,
      name: s.name,
      count: s._count.tickets,
    }));
  },

  /**
   * Tren jumlah tiket bulanan (6 bulan terakhir).
   */
  async getMonthlyTrends() {
    const now = new Date();
    const months = [];

    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const startOfMonth = new Date(d.getFullYear(), d.getMonth(), 1);
      const endOfMonth = new Date(d.getFullYear(), d.getMonth() + 1, 0, 23, 59, 59);

      const count = await db.ticket.count({
        where: {
          deletedAt: null,
          createdAt: {
            gte: startOfMonth,
            lte: endOfMonth,
          },
        },
      });

      const label = d.toLocaleString('id-ID', { month: 'short', year: 'numeric' });
      months.push({ label, count });
    }

    return months;
  },
};
