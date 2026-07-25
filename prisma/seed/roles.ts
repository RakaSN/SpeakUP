import { PrismaClient } from '@prisma/client';

export const roles = [
  { name: 'Super Admin', description: 'Administrator tertinggi dengan akses penuh' },
  { name: 'Admin', description: 'Pengelola operasional sistem' },
  { name: 'Kepsek', description: 'Kepala Sekolah (Eksekutif)' },
  { name: 'Wakasek', description: 'Wakil Kepala Sekolah' },
  { name: 'BK', description: 'Bimbingan Konseling' },
  { name: 'Pelapor', description: 'Pengguna biasa (Siswa, Guru, Orang Tua)' },
];

export async function seedRoles(prisma: PrismaClient) {
  console.log('Seeding Roles...');
  for (const role of roles) {
    await prisma.role.upsert({
      where: { name: role.name },
      update: {},
      create: role,
    });
  }
}
