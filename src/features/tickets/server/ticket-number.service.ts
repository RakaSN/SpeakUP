import { db } from '@/shared/server/db';
import { appLogger } from '@/shared/server/logger/app.logger';
import { Prisma } from '@prisma/client';

/**
 * TicketNumberService
 * 
 * Menghasilkan nomor tiket unik dengan format:
 * SU-YYYYMM-NNNNN
 * Contoh: SU-202607-00001
 *
 * - SU = Prefix SpeakUp
 * - YYYYMM = Tahun dan Bulan pembuatan
 * - NNNNN = Sequence number (auto-increment per bulan)
 */
export class TicketNumberService {
  /**
   * Generate nomor tiket berikutnya.
   * Menghitung jumlah tiket yang sudah ada pada bulan berjalan,
   * lalu menambahkan 1.
   * 
   * @param tx - Optional Prisma transaction client
   */
  static async generate(tx?: Prisma.TransactionClient): Promise<string> {
    const prisma = tx || db;
    const prefix = 'SU';
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const yearMonth = `${year}${month}`;
    const pattern = `${prefix}-${yearMonth}-`;

    try {
      // Hitung jumlah tiket pada bulan ini
      const count = await prisma.ticket.count({
        where: {
          ticketNumber: {
            startsWith: pattern,
          },
        },
      });

      const sequence = String(count + 1).padStart(5, '0');
      return `${pattern}${sequence}`;
    } catch (error) {
      appLogger.error('[TicketNumberService] Gagal menghasilkan nomor tiket', error);
      throw error;
    }
  }

  /**
   * Parse nomor tiket untuk mendapatkan komponen-komponennya.
   * Berguna untuk analitik dan validasi.
   */
  static parse(ticketNumber: string): { prefix: string; yearMonth: string; sequence: number } | null {
    const regex = /^([A-Z]{2})-(\d{6})-(\d{5})$/;
    const match = ticketNumber.match(regex);

    if (!match) return null;

    return {
      prefix: match[1],
      yearMonth: match[2],
      sequence: parseInt(match[3], 10),
    };
  }
}
