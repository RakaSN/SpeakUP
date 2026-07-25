import { db } from '@/shared/server/db';
import { Prisma } from '@prisma/client';

export interface ReportFilter {
  startDate?: string;
  endDate?: string;
  categoryId?: string;
  statusId?: string;
}

export const ReportService = {
  /**
   * Mengambil data tiket terfilter untuk kebutuhan ekspor laporan.
   */
  async getReportData(filter: ReportFilter) {
    const where: Prisma.TicketWhereInput = { deletedAt: null };

    if (filter.categoryId) where.categoryId = filter.categoryId;
    if (filter.statusId) where.statusId = filter.statusId;

    if (filter.startDate || filter.endDate) {
      where.createdAt = {};
      if (filter.startDate) where.createdAt.gte = new Date(filter.startDate);
      if (filter.endDate) {
        const end = new Date(filter.endDate);
        end.setHours(23, 59, 59, 999);
        where.createdAt.lte = end;
      }
    }

    return await db.ticket.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      include: {
        reporter: { select: { name: true, email: true } },
        category: true,
        priority: true,
        status: true,
        type: true,
      },
    });
  },

  /**
   * Mengenerasi string format CSV (UTF-8 BOM) yang kompatibel secara otomatis dengan Microsoft Excel.
   */
  async generateExcelCSV(filter: ReportFilter): Promise<string> {
    const tickets = await this.getReportData(filter);

    const headers = [
      'No. Tiket',
      'Judul Tiket',
      'Pelapor',
      'Jenis Layanan',
      'Kategori',
      'Prioritas',
      'Status',
      'Anonim',
      'Tanggal Dibuat',
    ];

    const rows = tickets.map((t: {
      ticketNumber: string;
      title: string;
      isAnonymous: boolean;
      reporter: { name: string };
      type: { name: string };
      category: { name: string };
      priority: { name: string };
      status: { name: string };
      createdAt: Date;
    }) => [
      `"${t.ticketNumber}"`,
      `"${t.title.replace(/"/g, '""')}"`,
      `"${t.isAnonymous ? 'Anonim' : t.reporter.name}"`,
      `"${t.type.name}"`,
      `"${t.category.name}"`,
      `"${t.priority.name}"`,
      `"${t.status.name}"`,
      `"${t.isAnonymous ? 'Ya' : 'Tidak'}"`,
      `"${new Date(t.createdAt).toLocaleString('id-ID')}"`,
    ]);

    const csvContent = [headers.join(','), ...rows.map((r: string[]) => r.join(','))].join('\n');
    
    // Add UTF-8 BOM prefix for Microsoft Excel
    return '\uFEFF' + csvContent;
  },
};
