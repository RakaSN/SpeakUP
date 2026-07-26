import { eventBus } from '@/shared/events/event-bus';
import { db } from '@/shared/server/db';
import { appLogger } from '@/shared/server/logger/app.logger';
import { NotificationDispatcher } from './notification-dispatcher';

export function registerNotificationListeners() {
  // Listener saat tiket baru dibuat
  eventBus.subscribe('TICKET_CREATED', async (event) => {
    try {
      await NotificationDispatcher.dispatch({
        notificationCode: 'TICKET_CREATED',
        recipientIds: [event.payload.reporterId],
      });
    } catch (err) {
      appLogger.error('[NotificationListener] Failed to handle TICKET_CREATED', err);
    }
  });

  // Listener saat tiket didisposisikan ke petugas
  eventBus.subscribe('TICKET_ASSIGNED', async (event) => {
    try {
      await NotificationDispatcher.dispatch({
        notificationCode: 'TICKET_ASSIGNED',
        recipientIds: [event.payload.assigneeId],
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
        await NotificationDispatcher.dispatch({
          notificationCode: 'TICKET_STATUS_CHANGED',
          variables: {
            ticketNumber: ticket.ticketNumber,
            newStatus: event.payload.newStatus,
          },
          recipientIds: [ticket.reporterId],
        });
      }
    } catch (err) {
      appLogger.error('[NotificationListener] Failed to handle TICKET_STATUS_CHANGED', err);
    }
  });
}

