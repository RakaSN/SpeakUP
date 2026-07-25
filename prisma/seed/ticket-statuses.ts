import { PrismaClient } from '@prisma/client';

export const ticketStatuses = [
  { name: 'Draft', description: 'Tiket disimpan namun belum dikirim' },
  { name: 'Submitted', description: 'Tiket baru dikirim, menunggu verifikasi awal' },
  { name: 'Verified', description: 'Tiket tervalidasi dan siap didisposisikan' },
  { name: 'Assigned', description: 'Tiket telah didisposisikan ke petugas' },
  { name: 'In Progress', description: 'Tiket sedang dalam penanganan' },
  { name: 'Waiting Response', description: 'Menunggu balasan/tindakan dari pelapor' },
  { name: 'Resolved', description: 'Kendala pada tiket telah terselesaikan' },
  { name: 'Closed', description: 'Tiket telah ditutup permanen' },
  { name: 'Rejected', description: 'Tiket ditolak karena tidak valid' },
];

export async function seedTicketStatuses(prisma: PrismaClient) {
  console.log('Seeding Ticket Statuses...');
  for (const status of ticketStatuses) {
    await prisma.masterTicketStatus.upsert({
      where: { name: status.name },
      update: {},
      create: status,
    });
  }
}
