export type DomainEvent = 
  | { type: 'TICKET_CREATED'; payload: { ticketId: string; reporterId: string } }
  | { type: 'TICKET_STATUS_CHANGED'; payload: { ticketId: string; oldStatus: string; newStatus: string } }
  | { type: 'TICKET_ASSIGNED'; payload: { ticketId: string; assigneeId: string } }
  // Audit Events
  | { type: 'AUTH_LOGIN'; payload: { userId: string; ipAddress?: string; userAgent?: string } }
  | { type: 'AUTH_LOGOUT'; payload: { userId: string } }
  | { type: 'AUTH_PASSWORD_RESET'; payload: { userId: string; adminId: string } }
  | { type: 'USER_ROLE_CHANGED'; payload: { userId: string; roles: string[]; adminId: string } }
  | { type: 'USER_STATUS_CHANGED'; payload: { userId: string; newStatus: string; adminId: string } }
  | { type: 'MASTER_DATA_UPDATED'; payload: { entity: string; entityId: string; action: 'CREATE' | 'UPDATE' | 'SOFT_DELETE' | 'DEACTIVATE'; adminId: string } }
  // SLA Events
  | { type: 'SLA_THRESHOLD_REACHED'; payload: { ticketId: string; hoursRemaining: number } }
  | { type: 'SLA_OVERDUE'; payload: { ticketId: string; overdueHours: number } }
  | { type: 'TICKET_RESOLVED_ON_TIME'; payload: { ticketId: string; resolvedAt: Date } }
  | { type: 'TICKET_RESOLVED_LATE'; payload: { ticketId: string; resolvedAt: Date; overdueHours: number } };

export type EventHandler<T extends DomainEvent> = (event: T) => void | Promise<void>;
