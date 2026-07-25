import { db } from '@/shared/server/db';
import { AppError } from '@/shared/lib/errors';
import { eventBus } from '@/shared/events/event-bus';
import { TicketNumberService } from './ticket-number.service';

// Extract the TransactionClient type from db.transaction
type TransactionClient = Parameters<Parameters<typeof db.transaction>[0]>[0];

export interface CreateTicketParams {
  typeId: string;
  categoryId: string;
  priorityId: string;
  title: string;
  description: string;
  isAnonymous: boolean;
  visibility: 'PUBLIC' | 'INTERNAL' | 'CONFIDENTIAL' | 'STRICTLY_CONFIDENTIAL';
  reporterId: string;
}

export const TicketService = {
  async getDashboardSummary() {
    return await db.transaction(async (tx: TransactionClient) => {
      const total = await tx.ticket.count({ where: { deletedAt: null } });
      const newCount = await tx.ticket.count({
        where: {
          deletedAt: null,
          status: { name: 'Submitted' },
        },
      });
      const inProgressCount = await tx.ticket.count({
        where: {
          deletedAt: null,
          status: { name: { in: ['Verified', 'Assigned', 'In Progress', 'Waiting Response'] } },
        },
      });
      const resolvedCount = await tx.ticket.count({
        where: {
          deletedAt: null,
          status: { name: { in: ['Resolved', 'Closed'] } },
        },
      });

      return { total, new: newCount, inProgress: inProgressCount, resolved: resolvedCount };
    });
  },

  async createTicket(data: CreateTicketParams) {
    return await db.transaction(async (tx: TransactionClient) => {
      // Get 'Submitted' status
      const status = await tx.masterTicketStatus.findUnique({ where: { name: 'Submitted' } });
      if (!status) throw new AppError('MASTER_DATA_NOT_FOUND', 'Status Submitted tidak ditemukan');

      const ticketNumber = await TicketNumberService.generate(tx);

      // Fetch Priority to get slaHours for SLA Freeze
      const priority = await tx.masterTicketPriority.findUnique({ where: { id: data.priorityId } });
      const slaHours = priority?.slaHours || 24;

      const now = new Date();
      const targetResolutionAt = new Date(now.getTime() + slaHours * 60 * 60 * 1000);

      const ticket = await tx.ticket.create({
        data: {
          ticketNumber,
          title: data.title,
          description: data.description,
          isAnonymous: data.isAnonymous,
          visibility: data.visibility,
          typeId: data.typeId,
          categoryId: data.categoryId,
          priorityId: data.priorityId,
          statusId: status.id,
          reporterId: data.reporterId,
          slaHours,
          targetResolutionAt,
          slaStatus: 'ON_TRACK',
        },
      });

      await tx.ticketActivity.create({
        data: {
          ticketId: ticket.id,
          actorId: data.reporterId,
          actionCode: 'TICKET_CREATED',
          actionLabel: 'Tiket Dibuat',
          note: 'Tiket baru berhasil disubmit.',
        },
      });

      await eventBus.publish({ type: 'TICKET_CREATED', payload: { ticketId: ticket.id, reporterId: data.reporterId } });

      return ticket;
    });
  },

  async getTicket(id: string) {
    const ticket = await db.ticket.findUnique({
      where: { id, deletedAt: null },
      include: {
        reporter: { select: { id: true, name: true, email: true } },
        type: true,
        category: true,
        status: true,
        priority: true,
        assignments: {
          include: { assignee: true, assignedBy: true },
          orderBy: { assignedAt: 'desc' },
        },
        activities: {
          include: { actor: true },
          orderBy: { createdAt: 'desc' },
        },
        attachments: true,
      },
    });

    if (!ticket) throw new AppError('TICKET_NOT_FOUND', 'Tiket tidak ditemukan');
    return ticket;
  },

  async listTickets(params: {
    page?: number;
    limit?: number;
    statusId?: string;
    categoryId?: string;
    search?: string;
  }) {
    const page = params.page || 1;
    const limit = params.limit || 10;
    const skip = (page - 1) * limit;

    const where: Record<string, unknown> = { deletedAt: null };
    if (params.statusId) where.statusId = params.statusId;
    if (params.categoryId) where.categoryId = params.categoryId;
    if (params.search) {
      where.OR = [
        { title: { contains: params.search, mode: 'insensitive' } },
        { ticketNumber: { contains: params.search, mode: 'insensitive' } },
      ];
    }

    const [items, total] = await Promise.all([
      db.ticket.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: { status: true, priority: true, type: true, category: true },
      }),
      db.ticket.count({ where }),
    ]);

    return {
      items,
      meta: {
        totalItems: total,
        totalPages: Math.ceil(total / limit),
        currentPage: page,
        itemsPerPage: limit,
      },
    };
  },

  async assignTicket(ticketId: string, assigneeId: string, actorId: string, note?: string) {
    return await db.transaction(async (tx: TransactionClient) => {
      const ticket = await tx.ticket.findUnique({ where: { id: ticketId } });
      if (!ticket) throw new AppError('TICKET_NOT_FOUND', 'Tiket tidak ditemukan');

      // Update previous assignments to inactive
      await tx.ticketAssignment.updateMany({
        where: { ticketId, isActive: true },
        data: { isActive: false },
      });

      const assignment = await tx.ticketAssignment.create({
        data: {
          ticketId,
          assigneeId,
          assignedById: actorId,
          note,
        },
      });

      await tx.ticketActivity.create({
        data: {
          ticketId,
          actorId,
          actionCode: 'TICKET_ASSIGNED',
          actionLabel: 'Tiket Didisposisikan',
          note: note || 'Tiket telah diteruskan ke petugas baru.',
        },
      });

      await eventBus.publish({ type: 'TICKET_ASSIGNED', payload: { ticketId, assigneeId } });

      return assignment;
    });
  },

  async changeStatus(ticketId: string, statusName: string, actorId: string, note?: string) {
    return await db.transaction(async (tx: TransactionClient) => {
      const ticket = await tx.ticket.findUnique({ where: { id: ticketId }, include: { status: true } });
      if (!ticket) throw new AppError('TICKET_NOT_FOUND', 'Tiket tidak ditemukan');

      const newStatus = await tx.masterTicketStatus.findUnique({ where: { name: statusName } });
      if (!newStatus) throw new AppError('MASTER_DATA_NOT_FOUND', `Status ${statusName} tidak ditemukan`);

      const updatedTicket = await tx.ticket.update({
        where: { id: ticketId },
        data: { statusId: newStatus.id },
      });

      await tx.ticketActivity.create({
        data: {
          ticketId,
          actorId,
          actionCode: 'STATUS_CHANGED',
          actionLabel: `Status diubah menjadi ${statusName}`,
          note: note || `Status diubah dari ${ticket.status.name} menjadi ${statusName}`,
        },
      });

      await eventBus.publish({
        type: 'TICKET_STATUS_CHANGED',
        payload: { ticketId, oldStatus: ticket.status.name, newStatus: statusName }
      });

      return updatedTicket;
    });
  },

  async resolveTicket(ticketId: string, actorId: string, note?: string) {
    return await db.transaction(async (tx: TransactionClient) => {
      const existing = await tx.ticket.findUnique({ where: { id: ticketId } });
      if (!existing) throw new AppError('TICKET_NOT_FOUND', 'Tiket tidak ditemukan');

      const newStatus = await tx.masterTicketStatus.findUnique({ where: { name: 'Resolved' } });
      if (!newStatus) throw new AppError('MASTER_DATA_NOT_FOUND', 'Status Resolved tidak ditemukan');

      const resolvedAt = new Date();
      const isOnTime = existing.targetResolutionAt ? resolvedAt <= existing.targetResolutionAt : true;
      const slaStatus = isOnTime ? 'RESOLVED_ON_TIME' : 'RESOLVED_LATE';

      const ticket = await tx.ticket.update({
        where: { id: ticketId },
        data: {
          statusId: newStatus.id,
          resolvedAt,
          slaStatus,
        },
      });

      await tx.ticketActivity.create({
        data: {
          ticketId,
          actorId,
          actionCode: 'TICKET_RESOLVED',
          actionLabel: `Tiket Selesai (${isOnTime ? 'Tepat Waktu' : 'Terlambat'})`,
          note: note || 'Penanganan tiket telah selesai.',
        },
      });

      if (isOnTime) {
        await eventBus.publish({ type: 'TICKET_RESOLVED_ON_TIME', payload: { ticketId, resolvedAt } });
      } else {
        const overdueHours = existing.targetResolutionAt
          ? Math.round((resolvedAt.getTime() - existing.targetResolutionAt.getTime()) / (1000 * 60 * 60))
          : 0;
        await eventBus.publish({ type: 'TICKET_RESOLVED_LATE', payload: { ticketId, resolvedAt, overdueHours } });
      }

      return ticket;
    });
  },

  async closeTicket(ticketId: string, actorId: string, note?: string) {
    return await db.transaction(async (tx: TransactionClient) => {
      const newStatus = await tx.masterTicketStatus.findUnique({ where: { name: 'Closed' } });
      if (!newStatus) throw new AppError('MASTER_DATA_NOT_FOUND', 'Status Closed tidak ditemukan');

      const ticket = await tx.ticket.update({
        where: { id: ticketId },
        data: { statusId: newStatus.id, closedAt: new Date() },
      });

      await tx.ticketActivity.create({
        data: {
          ticketId,
          actorId,
          actionCode: 'TICKET_CLOSED',
          actionLabel: 'Tiket Ditutup (Closed)',
          note: note || 'Siklus tiket ini telah ditutup permanen.',
        },
      });

      return ticket;
    });
  },

  async rejectTicket(ticketId: string, actorId: string, note: string) {
    if (!note) throw new AppError('VALIDATION_ERROR', 'Catatan/alasan penolakan wajib diisi');
    
    return await db.transaction(async (tx: TransactionClient) => {
      const newStatus = await tx.masterTicketStatus.findUnique({ where: { name: 'Rejected' } });
      if (!newStatus) throw new AppError('MASTER_DATA_NOT_FOUND', 'Status Rejected tidak ditemukan');

      const ticket = await tx.ticket.update({
        where: { id: ticketId },
        data: { statusId: newStatus.id, closedAt: new Date() },
      });

      await tx.ticketActivity.create({
        data: {
          ticketId,
          actorId,
          actionCode: 'TICKET_REJECTED',
          actionLabel: 'Tiket Ditolak (Rejected)',
          note,
        },
      });

      return ticket;
    });
  },
};
