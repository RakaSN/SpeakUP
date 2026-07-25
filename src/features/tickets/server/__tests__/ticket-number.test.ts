import { describe, it, expect } from 'vitest';
import { TicketNumberService } from '@/features/tickets/server/ticket-number.service';

describe('TicketNumberService.parse()', () => {
  it('harus mem-parse nomor tiket yang valid', () => {
    const result = TicketNumberService.parse('SU-202607-00001');

    expect(result).not.toBeNull();
    expect(result!.prefix).toBe('SU');
    expect(result!.yearMonth).toBe('202607');
    expect(result!.sequence).toBe(1);
  });

  it('harus mem-parse nomor tiket dengan sequence besar', () => {
    const result = TicketNumberService.parse('SU-202612-99999');

    expect(result).not.toBeNull();
    expect(result!.sequence).toBe(99999);
  });

  it('harus mengembalikan null untuk format yang tidak valid', () => {
    expect(TicketNumberService.parse('INVALID')).toBeNull();
    expect(TicketNumberService.parse('SU-2026-001')).toBeNull();
    expect(TicketNumberService.parse('XX-202607-0001')).toBeNull(); // sequence hanya 4 digit
    expect(TicketNumberService.parse('')).toBeNull();
  });

  it('harus menolak prefix yang terlalu panjang', () => {
    expect(TicketNumberService.parse('SUP-202607-00001')).toBeNull();
  });
});
