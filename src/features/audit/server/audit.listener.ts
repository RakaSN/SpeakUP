import { eventBus } from '@/shared/events/event-bus';
import { AuditService } from './audit.service';
import { appLogger } from '@/shared/server/logger/app.logger';

export function registerAuditListeners() {
  eventBus.subscribe('AUTH_LOGIN', async (event) => {
    await AuditService.log({
      actorId: event.payload.userId,
      action: 'USER_LOGIN',
      entity: 'User',
      entityId: event.payload.userId,
      ipAddress: event.payload.ipAddress,
      userAgent: event.payload.userAgent,
    });
  });

  eventBus.subscribe('AUTH_LOGOUT', async (event) => {
    await AuditService.log({
      actorId: event.payload.userId,
      action: 'USER_LOGOUT',
      entity: 'User',
      entityId: event.payload.userId,
    });
  });

  eventBus.subscribe('AUTH_PASSWORD_RESET', async (event) => {
    await AuditService.log({
      actorId: event.payload.adminId,
      action: 'USER_PASSWORD_RESET',
      entity: 'User',
      entityId: event.payload.userId,
    });
  });

  eventBus.subscribe('USER_ROLE_CHANGED', async (event) => {
    await AuditService.log({
      actorId: event.payload.adminId,
      action: 'USER_ROLE_CHANGED',
      entity: 'User',
      entityId: event.payload.userId,
      newValue: { roles: event.payload.roles },
    });
  });

  eventBus.subscribe('USER_STATUS_CHANGED', async (event) => {
    await AuditService.log({
      actorId: event.payload.adminId,
      action: 'USER_STATUS_CHANGED',
      entity: 'User',
      entityId: event.payload.userId,
      newValue: { status: event.payload.newStatus },
    });
  });

  eventBus.subscribe('MASTER_DATA_UPDATED', async (event) => {
    await AuditService.log({
      actorId: event.payload.adminId,
      action: `MASTER_DATA_${event.payload.action}`,
      entity: event.payload.entity,
      entityId: event.payload.entityId,
    });
  });

  appLogger.info('[AuditListener] Registered audit event listeners');
}
