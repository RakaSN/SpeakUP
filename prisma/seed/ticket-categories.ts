import { PrismaClient } from '@prisma/client';

export const ticketCategories = [
  { name: 'Bullying', description: 'Perundungan fisik, verbal, atau cyber' },
  { name: 'Fasilitas', description: 'Kerusakan sarana dan prasarana' },
  { name: 'Akademik', description: 'Terkait kurikulum, nilai, dan belajar' },
  { name: 'Keuangan', description: 'Terkait SPP, beasiswa, dan iuran' },
  { name: 'IT', description: 'Infrastruktur jaringan, WiFi, dan perangkat lunak' },
  { name: 'Umum', description: 'Kategori lainnya' },
];

export async function seedTicketCategories(prisma: PrismaClient) {
  console.log('Seeding Ticket Categories...');
  for (const category of ticketCategories) {
    await prisma.masterTicketCategory.upsert({
      where: { name: category.name },
      update: {},
      create: category,
    });
  }
}
