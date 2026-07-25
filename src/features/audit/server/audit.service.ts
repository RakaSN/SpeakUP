import { db } from '@/shared/server/db';
import { appLogger } from '@/shared/server/logger/app.logger';

type AuditLogJson = Parameters<typeof db.auditLog.create>[0]['data']['oldValue'];

export interface LogAuditParams {
  actorId?: string;
  action: string;
  entity?: string;
  entityId?: string;
  oldValue?: Record<string, unknown>;
  newValue?: Record<string, unknown>;
  ipAddress?: string;
  userAgent?: string;
  metadata?: Record<string, unknown>;
}

export const AuditService = {
  /**
   * Mencatat aktivitas penting pengguna ke dalam Audit Log lengkap dengan delta perubahan.
   */
  async log(params: LogAuditParams) {
    try {
      await db.auditLog.create({
        data: {
          actorId: params.actorId,
          action: params.action,
          entity: params.entity,
          entityId: params.entityId,
          oldValue: (params.oldValue as unknown as AuditLogJson) || undefined,
          newValue: (params.newValue as unknown as AuditLogJson) || undefined,
          ipAddress: params.ipAddress,
          userAgent: params.userAgent,
          metadata: (params.metadata as unknown as AuditLogJson) || undefined,
        },
      });
    } catch (error) {
      appLogger.error('[AuditService] Gagal menyimpan audit log', {
        error,
        params,
      });
    }
  },
};
