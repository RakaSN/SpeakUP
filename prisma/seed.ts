import 'dotenv/config';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '@prisma/client';

import { seedPermissions } from './seed/permissions';
import { seedRoles } from './seed/roles';
import { seedRolePermissions } from './seed/role-permissions';
import { seedTicketStatuses } from './seed/ticket-statuses';
import { seedTicketTypes } from './seed/ticket-types';
import { seedTicketCategories } from './seed/ticket-categories';
import { seedTicketPriorities } from './seed/ticket-priorities';
import { seedSuperAdmin } from './seed/super-admin';

// Inisialisasi Prisma khusus untuk eksekusi seed
const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('🌱 Starting Seed Process...');
  
  await seedPermissions(prisma);
  await seedRoles(prisma);
  await seedRolePermissions(prisma);
  
  await seedTicketStatuses(prisma);
  await seedTicketTypes(prisma);
  await seedTicketCategories(prisma);
  await seedTicketPriorities(prisma);
  
  await seedSuperAdmin(prisma);

  console.log('✅ Seed Process Completed Successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Seed Failed: ', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
