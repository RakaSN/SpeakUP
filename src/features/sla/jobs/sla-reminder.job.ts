import { BackgroundJob, JobContext, JobResult } from '@/shared/server/jobs/job.interface';
import { db } from '@/shared/server/db';
import { NotificationType } from '@prisma/client';
import { NotificationDispatcher } from '@/features/notifications/server/notification-dispatcher';

export class SlaReminderJob implements BackgroundJob {
  readonly code = 'sla-reminder-job';
  readonly name = 'SLA Warning & Reminder Job';
  readonly defaultIntervalMs = 15 * 60 * 1000; // Check every 15 minutes

  async execute(context: JobContext): Promise<JobResult> {
    const now = new Date();
    const fourHoursFromNow = new Date(now.getTime() + 4 * 60 * 60 * 1000);
    const twelveHoursAgo = new Date(now.getTime() - 12 * 60 * 60 * 1000);

    const ticketsAtRisk = await db.ticket.findMany({
      where: {
        deletedAt: null,
        resolvedAt: null,
        closedAt: null,
        targetResolutionAt: { gte: now, lte: fourHoursFromNow },
      },
      include: {
        assignments: { where: { isActive: true }, select: { assigneeId: true } },
      },
    });

    let remindersSent = 0;
    let skippedIdempotent = 0;

    for (const ticket of ticketsAtRisk) {
      const recipientIds = ticket.assignments.map((a) => a.assigneeId);

      if (recipientIds.length === 0) {
        const adminUsers = await db.userRole.findMany({
          where: { role: { name: 'Admin' } },
          select: { userId: true },
        });
        recipientIds.push(...adminUsers.map((u) => u.userId));
      }

      const eligibleRecipients: string[] = [];
      for (const userId of recipientIds) {
        const existingNotif = await db.notification.findFirst({
          where: {
            userId,
            title: { contains: ticket.ticketNumber },
            type: NotificationType.WARNING,
            createdAt: { gte: twelveHoursAgo },
          },
        });

        if (existingNotif) {
          skippedIdempotent++;
        } else {
          eligibleRecipients.push(userId);
        }
      }

      if (eligibleRecipients.length > 0) {
        const result = await NotificationDispatcher.dispatch({
          notificationCode: 'SLA_REMINDER',
          variables: { ticketNumber: ticket.ticketNumber, ticketTitle: ticket.title },
          recipientIds: eligibleRecipients,
        });
        remindersSent += result.sent;
      }
    }

    return {
      success: true,
      message: `Pemeriksaan SLA selesai. Notifikasi dikirim: ${remindersSent}, Dilewati (Idempotent): ${skippedIdempotent}.`,
      metadata: {
        ticketsEvaluated: ticketsAtRisk.length,
        remindersSent,
        skippedIdempotent,
        trigger: context.trigger,
      },
    };
  }
}
