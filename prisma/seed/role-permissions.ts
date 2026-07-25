import { PrismaClient } from '@prisma/client';

const rolePermissionMap: Record<string, string[]> = {
  'Super Admin': [
    'ticket.create', 'ticket.read', 'ticket.read.all', 'ticket.update',
    'ticket.assign', 'ticket.resolve', 'ticket.close', 'ticket.delete',
    'master.manage', 'users.manage', 'dashboard.read', 'notification.read'
  ],
  'Admin': [
    'ticket.create', 'ticket.read', 'ticket.read.all', 'ticket.update',
    'ticket.assign', 'ticket.resolve', 'dashboard.read', 'notification.read'
  ],
  'Kepsek': [
    'ticket.read', 'ticket.read.all', 'dashboard.read', 'notification.read'
  ],
  'Wakasek': [
    'ticket.read', 'ticket.assign', 'ticket.resolve', 'dashboard.read', 'notification.read'
  ],
  'BK': [
    'ticket.read', 'ticket.assign', 'ticket.resolve', 'dashboard.read', 'notification.read'
  ],
  'Pelapor': [
    'ticket.create', 'ticket.read', 'notification.read'
  ]
};

export async function seedRolePermissions(prisma: PrismaClient) {
  console.log('Seeding Role Permissions...');
  for (const [roleName, permissionCodes] of Object.entries(rolePermissionMap)) {
    const role = await prisma.role.findUnique({ where: { name: roleName } });
    if (!role) continue;

    for (const code of permissionCodes) {
      const permission = await prisma.permission.findUnique({ where: { code } });
      if (!permission) continue;

      // Gunakan kombinasi ID untuk upsert agar tidak bentrok
      await prisma.rolePermission.upsert({
        where: {
          roleId_permissionId: {
            roleId: role.id,
            permissionId: permission.id
          }
        },
        update: {},
        create: {
          roleId: role.id,
          permissionId: permission.id
        }
      });
    }
  }
}
