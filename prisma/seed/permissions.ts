import { PrismaClient } from '@prisma/client';

export const permissions = [
  { code: 'ticket.create', description: 'Membuat tiket baru' },
  { code: 'ticket.read', description: 'Melihat tiket yang diizinkan (berdasarkan visibility & role)' },
  { code: 'ticket.read.all', description: 'Melihat seluruh tiket dalam sistem tanpa batasan visibility' },
  { code: 'ticket.update', description: 'Mengubah data tiket dasar' },
  { code: 'ticket.assign', description: 'Mendisposisikan tiket ke petugas lain' },
  { code: 'ticket.resolve', description: 'Menandai tiket sebagai selesai/resolved' },
  { code: 'ticket.close', description: 'Menutup tiket secara permanen' },
  { code: 'ticket.delete', description: 'Menghapus (soft delete) tiket' },
  { code: 'master.manage', description: 'Mengelola Master Data (Kategori, Status, dsb)' },
  { code: 'users.manage', description: 'Mengelola pengguna dan hak akses' },
  { code: 'dashboard.read', description: 'Mengakses halaman dashboard analitik' },
  { code: 'notification.read', description: 'Mengakses dan membaca notifikasi' },
];

export async function seedPermissions(prisma: PrismaClient) {
  console.log('Seeding Permissions...');
  for (const perm of permissions) {
    await prisma.permission.upsert({
      where: { code: perm.code },
      update: {},
      create: perm,
    });
  }
}
