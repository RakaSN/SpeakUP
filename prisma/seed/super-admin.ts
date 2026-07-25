import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

export async function seedSuperAdmin(prisma: PrismaClient) {
  console.log('Seeding Super Admin...');
  
  const email = process.env.SUPER_ADMIN_EMAIL;
  const password = process.env.SUPER_ADMIN_PASSWORD;

  if (!email || !password) {
    console.warn('⚠️ Melewati Seed Super Admin: Variabel SUPER_ADMIN_EMAIL atau SUPER_ADMIN_PASSWORD tidak diatur di .env');
    return;
  }

  const role = await prisma.role.findUnique({ where: { name: 'Super Admin' } });
  
  if (!role) {
    console.error('⚠️ Role Super Admin tidak ditemukan, melewati seed user.');
    return;
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const adminUser = await prisma.user.upsert({
    where: { email },
    update: {
      password: hashedPassword,
    },
    create: {
      name: 'Super Administrator',
      email,
      password: hashedPassword,
    },
  });

  // Assign user to Super Admin role
  await prisma.userRole.upsert({
    where: {
      userId_roleId: {
        userId: adminUser.id,
        roleId: role.id,
      }
    },
    update: {},
    create: {
      userId: adminUser.id,
      roleId: role.id,
    }
  });
  
  console.log('✅ Super Admin Seeded:', email);
}
