import { BackgroundJob, JobContext, JobResult } from '@/shared/server/jobs/job.interface';
import { db } from '@/shared/server/db';
import { NotificationDispatcher } from '@/features/notifications/server/notification-dispatcher';

export interface DailySummary {
  date: string;
  totalCreated: number;
  totalResolved: number;
  totalOverdue: number;
  totalActive: number;
  generatedAt: Date;
}

export class DailyDigestJob implements BackgroundJob {
  readonly code = 'daily-digest-job';
  readonly name = 'Daily Executive Digest Job';
  readonly defaultIntervalMs = 24 * 60 * 60 * 1000; // Run once per day

  async execute(context: JobContext): Promise<JobResult> {
    const now = new Date();
    const twentyFourHoursAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);

    const [totalCreated, totalResolved, totalOverdue, totalActive] = await Promise.all([
      db.ticket.count({ where: { createdAt: { gte: twentyFourHoursAgo }, deletedAt: null } }),
      db.ticket.count({ where: { resolvedAt: { gte: twentyFourHoursAgo }, deletedAt: null } }),
      db.ticket.count({ where: { slaStatus: 'OVERDUE', resolvedAt: null, closedAt: null, deletedAt: null } }),
      db.ticket.count({ where: { resolvedAt: null, closedAt: null, deletedAt: null } }),
    ]);

    const summary: DailySummary = {
      date: now.toLocaleDateString('id-ID'),
      totalCreated,
      totalResolved,
      totalOverdue,
      totalActive,
      generatedAt: now,
    };

    const executives = await db.userRole.findMany({
      where: { role: { name: { in: ['Kepala Sekolah', 'Admin', 'Super Admin'] } } },
      select: { userId: true },
    });
    const recipientIds = Array.from(new Set(executives.map((e) => e.userId)));

    // Dispatch via NotificationDispatcher — Business Job declares INTENT only
    await NotificationDispatcher.dispatch({
      notificationCode: 'DAILY_DIGEST',
      variables: {
        date: summary.date,
        totalCreated: summary.totalCreated,
        totalResolved: summary.totalResolved,
        totalOverdue: summary.totalOverdue,
        totalActive: summary.totalActive,
      },
      recipientIds,
    });

    return {
      success: true,
      message: `Daily Digest berhasil dibuat untuk ${recipientIds.length} penerima.`,
      metadata: {
        summary: summary as unknown as Record<string, unknown>,
        recipientsCount: recipientIds.length,
        trigger: context.trigger,
      },
    };
  }
}
