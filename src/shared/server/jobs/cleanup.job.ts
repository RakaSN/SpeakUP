import { BackgroundJob, JobContext, JobResult } from './job.interface';
import { db } from '@/shared/server/db';

export class CleanupJob implements BackgroundJob {
  readonly code = 'cleanup-job';
  readonly name = 'System Cleanup & Retention Job';
  readonly defaultIntervalMs = 24 * 60 * 60 * 1000; // Run once a day

  async execute(context: JobContext): Promise<JobResult> {
    const now = new Date();
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    // Delete ONLY SUCCESS logs older than 30 days (keep FAILED logs for investigation)
    const deleteResult = await db.jobExecutionLog.deleteMany({
      where: {
        status: 'SUCCESS',
        startedAt: {
          lt: thirtyDaysAgo,
        },
      },
    });

    console.log(`[CleanupJob] Cleared ${deleteResult.count} old SUCCESS execution logs older than 30 days.`);

    return {
      success: true,
      message: `Pembersihan log berhasil. Total ${deleteResult.count} log sukses lama dihapus.`,
      metadata: {
        deletedCount: deleteResult.count,
        retentionCutoff: thirtyDaysAgo.toISOString(),
        trigger: context.trigger,
      },
    };
  }
}
