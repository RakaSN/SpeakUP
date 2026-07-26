/**
 * SpeakUp Security Suite - Audit Logging Engine
 * Structured logging for security events, credential actions, and admin operations.
 */

export type AuditEventType =
  | 'LOGIN_SUCCESS'
  | 'LOGIN_FAILED'
  | 'ROLE_CHANGED'
  | 'TICKET_DISPOSITION'
  | 'MASTER_DATA_UPDATED'
  | 'USER_CREATED'
  | 'USER_DEACTIVATED';

export interface AuditLogEntry {
  eventType: AuditEventType;
  userId?: string;
  userEmail?: string;
  ipAddress?: string;
  resourceId?: string;
  details?: Record<string, unknown>;
  timestamp?: Date;
}

export async function recordAuditLog(entry: AuditLogEntry): Promise<void> {
  const timestamp = entry.timestamp || new Date();
  
  // Format structured JSON log
  const logData = {
    level: 'AUDIT',
    timestamp: timestamp.toISOString(),
    event: entry.eventType,
    userId: entry.userId || 'ANONYMOUS',
    userEmail: entry.userEmail || 'N/A',
    ipAddress: entry.ipAddress || 'UNKNOWN',
    resourceId: entry.resourceId || 'NONE',
    details: entry.details || {},
  };

  // Output structured log to stdout / monitoring system
  console.log(`[AUDIT_LOG] ${JSON.stringify(logData)}`);
}
