import { db } from '@/shared/server/db';
import { getTemplate, severityToNotificationType, NotificationVariables } from './notification-templates';
import { NotificationPolicyEngine } from './notification-policy';

// ============================================================
// Dispatch Request (What Business Jobs Send)
// ============================================================

export interface DispatchRequest {
  /** Template code, e.g. 'SLA_REMINDER', 'TICKET_CREATED' */
  notificationCode: string;
  /** Template variables for rendering title/message */
  variables?: NotificationVariables;
  /** Optional explicit recipient user IDs (resolved via policy if omitted) */
  recipientIds?: string[];
}

// ============================================================
// Notification Dispatcher (Policy-Based Gateway)
// ============================================================

export const NotificationDispatcher = {
  /**
   * Dispatch a notification using the template engine and NotificationPolicyEngine.
   *
   * Business Jobs call this with ONLY a notificationCode — recipient resolution
   * and delivery channels are determined by NotificationPolicyEngine.
   */
  async dispatch(request: DispatchRequest): Promise<{ sent: number; skipped: number }> {
    const template = getTemplate(request.notificationCode);
    const policy = NotificationPolicyEngine.getRule(request.notificationCode);

    if (!template) {
      console.error(`[NotificationDispatcher] Unknown template code: '${request.notificationCode}'`);
      return { sent: 0, skipped: 0 };
    }

    // Resolve recipients using explicit list or policy engine
    const recipients = request.recipientIds && request.recipientIds.length > 0
      ? request.recipientIds
      : (policy ? await policy.resolveRecipients(request.variables || {}) : []);

    const { title, message } = template.render(request.variables || {});
    const type = severityToNotificationType(template.severity);

    let sent = 0;
    let skipped = 0;

    // ── Channel Router (IN_APP) ──────────────────────────────────
    for (const userId of recipients) {
      if (!userId) {
        skipped++;
        continue;
      }

      await db.notification.create({
        data: {
          userId,
          type,
          title,
          message,
        },
      });
      sent++;
    }

    return { sent, skipped };
  },
};
