import { db } from '@/shared/server/db';
import { AppError } from '@/shared/lib/errors';
import { eventBus } from '@/shared/events/event-bus';

export type MasterEntity = 'category' | 'priority' | 'type' | 'status';

export const MasterDataService = {
  // Read List (Public / Internal Form Dropdowns)
  async getTicketStatuses() {
    return db.masterTicketStatus.findMany({
      where: { isActive: true, deletedAt: null },
      orderBy: { createdAt: 'asc' },
    });
  },

  async getTicketCategories() {
    return db.masterTicketCategory.findMany({
      where: { isActive: true, deletedAt: null },
      orderBy: { name: 'asc' },
    });
  },

  async getTicketPriorities() {
    return db.masterTicketPriority.findMany({
      where: { isActive: true, deletedAt: null },
      orderBy: { createdAt: 'asc' },
    });
  },

  async getTicketTypes() {
    return db.masterTicketType.findMany({
      where: { isActive: true, deletedAt: null },
      orderBy: { name: 'asc' },
    });
  },

  // Admin Management Listing (Includes Inactive)
  async getAllCategories() {
    return db.masterTicketCategory.findMany({
      where: { deletedAt: null },
      orderBy: { name: 'asc' },
    });
  },

  async getAllPriorities() {
    return db.masterTicketPriority.findMany({
      where: { deletedAt: null },
      orderBy: { createdAt: 'asc' },
    });
  },

  async getAllTypes() {
    return db.masterTicketType.findMany({
      where: { deletedAt: null },
      orderBy: { name: 'asc' },
    });
  },

  async getAllStatuses() {
    return db.masterTicketStatus.findMany({
      where: { deletedAt: null },
      orderBy: { createdAt: 'asc' },
    });
  },

  // CRUD Operations with Protection Rules
  async createCategory(data: { name: string; description?: string }, adminId: string) {
    const existing = await db.masterTicketCategory.findUnique({ where: { name: data.name } });
    if (existing) throw new AppError('DUPLICATE_RESOURCE', 'Kategori dengan nama tersebut sudah ada');

    const created = await db.masterTicketCategory.create({
      data: {
        name: data.name,
        description: data.description,
        createdBy: adminId,
      },
    });

    await eventBus.publish({
      type: 'MASTER_DATA_UPDATED',
      payload: { entity: 'Category', entityId: created.id, action: 'CREATE', adminId },
    });

    return created;
  },

  async updateCategory(id: string, data: { name?: string; description?: string; isActive?: boolean }, adminId: string) {
    const updated = await db.masterTicketCategory.update({
      where: { id },
      data: {
        ...data,
        updatedBy: adminId,
      },
    });

    await eventBus.publish({
      type: 'MASTER_DATA_UPDATED',
      payload: { entity: 'Category', entityId: id, action: 'UPDATE', adminId },
    });

    return updated;
  },

  async deleteCategory(id: string, adminId: string) {
    // Protection check: Pastikan tidak ada tiket yang merelasikan kategori ini
    const ticketCount = await db.ticket.count({ where: { categoryId: id } });

    if (ticketCount > 0) {
      // Jika masih ada tiket, lakukan Deaktivasi (isActive = false), JANGAN hapus
      await db.masterTicketCategory.update({
        where: { id },
        data: { isActive: false, updatedBy: adminId },
      });

      await eventBus.publish({
        type: 'MASTER_DATA_UPDATED',
        payload: { entity: 'Category', entityId: id, action: 'DEACTIVATE', adminId },
      });

      return { status: 'DEACTIVATED', message: 'Kategori dinonaktifkan karena masih digunakan oleh tiket aktif.' };
    }

    // Jika bersih dari referensi tiket, aman untuk Soft Delete
    await db.masterTicketCategory.update({
      where: { id },
      data: { deletedAt: new Date(), updatedBy: adminId },
    });

    await eventBus.publish({
      type: 'MASTER_DATA_UPDATED',
      payload: { entity: 'Category', entityId: id, action: 'SOFT_DELETE', adminId },
    });

    return { status: 'DELETED', message: 'Kategori berhasil dihapus.' };
  },
};
