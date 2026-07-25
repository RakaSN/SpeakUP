import { appLogger } from '../logger/app.logger';
import { auditLogger } from '../logger/audit.logger';
import { requestLogger } from '../logger/request.logger';
import { eventBus } from '../../events/event-bus';
import { db } from '../db';

import { PermissionService } from '@/features/auth/server/permission.service';

/**
 * Service Container
 * Dependency Injection (DI) tersentralisasi secara fungsional.
 * Mencegah import antar-service yang memicu tight-coupling atau circular dependency.
 */
export const container = {
  db,
  events: eventBus,
  logger: {
    app: appLogger,
    audit: auditLogger,
    request: requestLogger,
  },
  permissions: new PermissionService(),
  // To be injected during specific tasks:
  // storage: storageService,
  // ticketIdGen: ticketNumberService
};
