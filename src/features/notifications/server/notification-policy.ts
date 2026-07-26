import { db } from '@/shared/server/db';
import { NotificationVariables } from './notification-templates';

export type DeliveryChannel = 'IN_APP' | 'EMAIL' | 'PUSH';
export type NotificationPriority = 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';

export interface NotificationPolicyRule {
  readonly notificationCode: string;
  readonly defaultChannels: DeliveryChannel[];
  readonly priority: NotificationPriority;
  readonly rateLimitMinutes?: number;
  readonly allowDigest?: boolean;
  resolveRecipients(variables: NotificationVariables): Promise<string[]>;
}

const policyRules: Record<string, NotificationPolicyRule> = {
  TICKET_CREATED: {
    notificationCode: 'TICKET_CREATED',
    defaultChannels: ['IN_APP'],
    priority: 'MEDIUM',
    async resolveRecipients(v) {
      if (v.reporterId && typeof v.reporterId === 'string') return [v.reporterId];
      return [];
    },
  },

  TICKET_ASSIGNED: {
    notificationCode: 'TICKET_ASSIGNED',
    defaultChannels: ['IN_APP'],
    priority: 'HIGH',
    async resolveRecipients(v) {
      if (v.assigneeId && typeof v.assigneeId === 'string') return [v.assigneeId];
      return [];
    },
  },

  TICKET_STATUS_CHANGED: {
    notificationCode: 'TICKET_STATUS_CHANGED',
    defaultChannels: ['IN_APP'],
    priority: 'MEDIUM',
    async resolveRecipients(v) {
      if (v.reporterId && typeof v.reporterId === 'string') return [v.reporterId];
      return [];
    },
  },

  SLA_REMINDER: {
    notificationCode: 'SLA_REMINDER',
    defaultChannels: ['IN_APP'],
    priority: 'HIGH',
    rateLimitMinutes: 720, // 12 hours deduplication rate limit
    async resolveRecipients(v) {
      if (v.recipientIds && Array.isArray(v.recipientIds)) return v.recipientIds as string[];
      // Fallback resolve Admin users if not explicitly provided
      const admins = await db.userRole.findMany({
        where: { role: { name: 'Admin' } },
        select: { userId: true },
      });
      return admins.map((a) => a.userId);
    },
  },

  AUTO_ESCALATION: {
    notificationCode: 'AUTO_ESCALATION',
    defaultChannels: ['IN_APP'],
    priority: 'URGENT',
    rateLimitMinutes: 1440, // 24 hours deduplication
    async resolveRecipients() {
      const managers = await db.userRole.findMany({
        where: { role: { name: { in: ['Super Admin', 'Admin', 'Kepala Sekolah'] } } },
        select: { userId: true },
      });
      return Array.from(new Set(managers.map((m) => m.userId)));
    },
  },

  DAILY_DIGEST: {
    notificationCode: 'DAILY_DIGEST',
    defaultChannels: ['IN_APP'],
    priority: 'MEDIUM',
    allowDigest: true,
    async resolveRecipients() {
      const execs = await db.userRole.findMany({
        where: { role: { name: { in: ['Kepala Sekolah', 'Admin', 'Super Admin'] } } },
        select: { userId: true },
      });
      return Array.from(new Set(execs.map((e) => e.userId)));
    },
  },
};

export const NotificationPolicyEngine = {
  getRule(notificationCode: string): NotificationPolicyRule | undefined {
    return policyRules[notificationCode];
  },
};
