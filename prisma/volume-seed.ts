import { PrismaClient, Role, UserStatus, TicketStatus, NotificationType } from '@prisma/client';
import { hash } from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting RC1 Volume Seeding...');
  const startTime = Date.now();

  // 1. Create Users (100 Users)
  console.log('Generating 100 Users...');
  const defaultPassword = await hash('Password123!', 10);
  const usersToInsert = [];
  
  // 5 Admins, 10 BK, 5 Kepsek, 80 Reporters
  for (let i = 1; i <= 100; i++) {
    let role = Role.REPORTER;
    if (i <= 5) role = Role.ADMIN;
    else if (i <= 15) role = Role.GURU_BK;
    else if (i <= 20) role = Role.KEPALA_SEKOLAH;

    usersToInsert.push({
      id: `usr-vol-${i}`,
      name: `Volume User ${i}`,
      email: `user${i}@volume.local`,
      password: defaultPassword,
      role: role,
      status: UserStatus.ACTIVE,
      nisn: role === Role.REPORTER ? `10000${i}` : null,
      nip: role !== Role.REPORTER ? `1990010120201210${i}` : null,
    });
  }

  await prisma.user.createMany({
    data: usersToInsert,
    skipDuplicates: true,
  });
  console.log(`✅ Created 100 Users`);

  // Fetch created user IDs for relations
  const reporters = usersToInsert.filter(u => u.role === Role.REPORTER).map(u => u.id);
  const bkUsers = usersToInsert.filter(u => u.role === Role.GURU_BK).map(u => u.id);

  // Fetch Master Data
  const categories = await prisma.masterTicketCategory.findMany();
  const priorities = await prisma.masterTicketPriority.findMany();

  if (categories.length === 0 || priorities.length === 0) {
    console.error('❌ Master Data is empty. Please run the standard seed first (npm run seed).');
    process.exit(1);
  }

  // 2. Create Tickets (1,000 Tickets)
  console.log('Generating 1,000 Tickets...');
  const ticketsToInsert = [];
  
  for (let i = 1; i <= 1000; i++) {
    const isAnonymous = i % 10 === 0; // 10% anonymous
    const reporterId = reporters[i % reporters.length];
    const categoryId = categories[i % categories.length].id;
    const priority = priorities[i % priorities.length];
    
    // Assign 30% of tickets
    const assigneeId = i % 3 === 0 ? bkUsers[i % bkUsers.length] : null;
    
    // Determine status
    let status = TicketStatus.OPEN;
    if (assigneeId) status = TicketStatus.IN_PROGRESS;
    if (i % 5 === 0) status = TicketStatus.RESOLVED;
    if (i % 20 === 0) status = TicketStatus.CLOSED;

    const createdAt = new Date(Date.now() - Math.floor(Math.random() * 90) * 24 * 60 * 60 * 1000); // Random within last 90 days

    ticketsToInsert.push({
      id: `tkt-vol-${i}`,
      title: `Laporan Insiden Volume Uji Coba #${i}`,
      content: `Ini adalah deskripsi laporan panjang untuk pengujian volume data RC1. Tiket ke-${i} menunjukkan bagaimana sistem menangani teks dan query relasional dalam jumlah besar.`,
      categoryId,
      priorityId: priority.id,
      status,
      isAnonymous,
      reporterId: isAnonymous ? null : reporterId,
      assigneeId,
      location: 'Area Sekolah',
      slaHours: priority.slaHours,
      targetResolutionAt: new Date(createdAt.getTime() + priority.slaHours * 60 * 60 * 1000),
      createdAt,
      updatedAt: createdAt,
    });
  }

  // Split into chunks to avoid Prisma payload size limits (approx 500 per chunk)
  const chunkSize = 500;
  for (let i = 0; i < ticketsToInsert.length; i += chunkSize) {
    const chunk = ticketsToInsert.slice(i, i + chunkSize);
    await prisma.ticket.createMany({
      data: chunk,
      skipDuplicates: true,
    });
  }
  console.log(`✅ Created 1,000 Tickets`);

  // 3. Create Notifications (5,000 Notifications)
  console.log('Generating 5,000 Notifications...');
  const notificationsToInsert = [];
  
  for (let i = 1; i <= 5000; i++) {
    const userId = usersToInsert[i % usersToInsert.length].id;
    
    notificationsToInsert.push({
      id: `notif-vol-${i}`,
      userId,
      title: `Notifikasi Sistem #${i}`,
      message: `Pembaruan status sistem atau aktivitas pada tiket volume uji coba.`,
      type: i % 2 === 0 ? NotificationType.INFO : NotificationType.SUCCESS,
      isRead: i % 4 !== 0, // 25% unread
      createdAt: new Date(Date.now() - Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000), // Random within last 30 days
    });
  }

  for (let i = 0; i < notificationsToInsert.length; i += chunkSize) {
    const chunk = notificationsToInsert.slice(i, i + chunkSize);
    await prisma.notification.createMany({
      data: chunk,
      skipDuplicates: true,
    });
  }
  console.log(`✅ Created 5,000 Notifications`);

  const duration = ((Date.now() - startTime) / 1000).toFixed(2);
  console.log(`\n🎉 Volume Seeding Completed in ${duration}s!`);
  console.log('Stats: 100 Users | 1,000 Tickets | 5,000 Notifications');
}

main()
  .catch((e) => {
    console.error('❌ Volume Seed Error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
