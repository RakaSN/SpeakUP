import { PrismaClient } from '@prisma/client';

export const ticketPriorities = [
  { name: 'Low', description: 'Tidak mendesak' },
  { name: 'Medium', description: 'Penting namun tidak darurat' },
  { name: 'High', description: 'Penting dan harus segera ditangani' },
  { name: 'Critical', description: 'Sangat darurat, butuh tindakan instan' },
];

export async function seedTicketPriorities(prisma: PrismaClient) {
  console.log('Seeding Ticket Priorities...');
  for (const priority of ticketPriorities) {
    await prisma.masterTicketPriority.upsert({
      where: { name: priority.name },
      update: {},
      create: priority,
    });
  }
}
