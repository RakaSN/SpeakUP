import { PrismaClient } from '@prisma/client';

export const ticketTypes = [
  { name: 'Pengaduan', description: 'Laporan keluhan atau pelanggaran' },
  { name: 'Konsultasi', description: 'Permintaan konseling atau diskusi' },
  { name: 'Helpdesk', description: 'Layanan bantuan teknis/umum' },
  { name: 'Aspirasi', description: 'Saran dan ide untuk sekolah' },
  { name: 'Surat', description: 'Permohonan dokumen tertulis' },
];

export async function seedTicketTypes(prisma: PrismaClient) {
  console.log('Seeding Ticket Types...');
  for (const type of ticketTypes) {
    await prisma.masterTicketType.upsert({
      where: { name: type.name },
      update: {},
      create: type,
    });
  }
}
