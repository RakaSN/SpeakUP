import { eventBus } from '@/shared/events/event-bus';
import { db } from '@/shared/server/db';
import { appLogger } from '@/shared/server/logger/app.logger';

export function registerNotificationListeners() {
  // Listener saat tiket baru dibuat
  eventBus.subscribe('TICKET_CREATED', async (event) => {
    try {
      await db.notification.create({
        data: {
          userId: event.payload.reporterId,
          type: 'INFO',
          title: 'Tiket Berhasil Dibuat',
          message: `Tiket Anda telah diterima oleh sistem dan sedang menunggu peninjauan.`,
        },
      });
    } catch (err) {
      appLogger.error('[NotificationListener] Failed to handle TICKET_CREATED', err);
    }
  });

  // Listener saat tiket didisposisikan ke petugas
  eventBus.subscribe('TICKET_ASSIGNED', async (event) => {
    try {
      await db.notification.create({
        data: {
          userId: event.payload.assigneeId,
          type: 'INFO',
          title: 'Penugasan Tiket Baru',
          message: `Anda telah ditugaskan untuk menangani sebuah tiket baru.`,
        },
      });
    } catch (err) {
      appLogger.error('[NotificationListener] Failed to handle TICKET_ASSIGNED', err);
    }
  });

  // Listener saat status tiket berubah
  eventBus.subscribe('TICKET_STATUS_CHANGED', async (event) => {
    try {
      const ticket = await db.ticket.findUnique({
        where: { id: event.payload.ticketId },
        select: { reporterId: true, ticketNumber: true },
      });

      if (ticket) {
        await db.notification.create({
          data: {
            userId: ticket.reporterId,
            type: 'INFO',
            title: `Status Tiket #${ticket.ticketNumber} Berubah`,
            message: `Status tiket Anda telah diperbarui menjadi ${event.payload.newStatus}.`,
          },
        });
      }
    } catch (err) {
      appLogger.error('[NotificationListener] Failed to handle TICKET_STATUS_CHANGED', err);
    }
  });
}
