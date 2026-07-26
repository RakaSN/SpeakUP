import { db } from '@/shared/server/db';
import { JobRegistry } from '@/shared/server/jobs/job.registry';

export interface PlatformHealthMetrics {
  totalExecutions: number;
  successCount: number;
  failureCount: number;
  successRate: number;
  failureRate: number;
  avgDurationMs: number;
  longestRunningJob: { jobCode: string; durationMs: number } | null;
  mostFrequentJob: { jobCode: string; count: number } | null;
  mostFailedJob: { jobCode: string; count: number } | null;
  lastSuccessfulExecution: { jobCode: string; completedAt: Date } | null;
  lastFailedExecution: { jobCode: string; completedAt: Date; message: string | null } | null;
}

export interface JobBreakdown {
  jobCode: string;
  jobName: string;
  totalRuns: number;
  successCount: number;
  failureCount: number;
  successRate: number;
  avgDurationMs: number;
  lastRunAt: Date | null;
  isActive: boolean;
}

export const JobMetricsService = {
  /**
   * Get platform health metrics aggregated over a specified number of days.
   */
  async getHealthMetrics(days: number = 7): Promise<PlatformHealthMetrics> {
    const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000);

    const logs = await db.jobExecutionLog.findMany({
      where: { startedAt: { gte: since } },
      select: { jobCode: true, status: true, durationMs: true, completedAt: true, message: true },
      orderBy: { startedAt: 'desc' },
    });

    const totalExecutions = logs.length;
    const successCount = logs.filter((l) => l.status === 'SUCCESS').length;
    const failureCount = logs.filter((l) => l.status === 'FAILED').length;
    const successRate = totalExecutions > 0 ? Math.round((successCount / totalExecutions) * 100) : 0;
    const failureRate = totalExecutions > 0 ? Math.round((failureCount / totalExecutions) * 100) : 0;

    const durations = logs.map((l) => l.durationMs || 0);
    const avgDurationMs = durations.length > 0 ? Math.round(durations.reduce((a, b) => a + b, 0) / durations.length) : 0;

    // Longest running job
    const longestLog = logs.reduce<typeof logs[0] | null>((max, l) => {
      if (!max || (l.durationMs || 0) > (max.durationMs || 0)) return l;
      return max;
    }, null);
    const longestRunningJob = longestLog ? { jobCode: longestLog.jobCode, durationMs: longestLog.durationMs || 0 } : null;

    // Most frequent job
    const freqMap = new Map<string, number>();
    logs.forEach((l) => freqMap.set(l.jobCode, (freqMap.get(l.jobCode) || 0) + 1));
    let mostFrequentJob: { jobCode: string; count: number } | null = null;
    freqMap.forEach((count, jobCode) => {
      if (!mostFrequentJob || count > mostFrequentJob.count) {
        mostFrequentJob = { jobCode, count };
      }
    });

    // Most failed job
    const failMap = new Map<string, number>();
    logs.filter((l) => l.status === 'FAILED').forEach((l) => failMap.set(l.jobCode, (failMap.get(l.jobCode) || 0) + 1));
    let mostFailedJob: { jobCode: string; count: number } | null = null;
    failMap.forEach((count, jobCode) => {
      if (!mostFailedJob || count > mostFailedJob.count) {
        mostFailedJob = { jobCode, count };
      }
    });

    // Last successful & failed executions
    const lastSuccess = logs.find((l) => l.status === 'SUCCESS');
    const lastFailed = logs.find((l) => l.status === 'FAILED');

    return {
      totalExecutions,
      successCount,
      failureCount,
      successRate,
      failureRate,
      avgDurationMs,
      longestRunningJob,
      mostFrequentJob,
      mostFailedJob,
      lastSuccessfulExecution: lastSuccess ? { jobCode: lastSuccess.jobCode, completedAt: lastSuccess.completedAt } : null,
      lastFailedExecution: lastFailed ? { jobCode: lastFailed.jobCode, completedAt: lastFailed.completedAt, message: lastFailed.message } : null,
    };
  },

  /**
   * Get per-job breakdown with metrics.
   */
  async getJobBreakdown(): Promise<JobBreakdown[]> {
    const registeredJobs = JobRegistry.getAll();
    const configs = await db.jobConfiguration.findMany();
    const configMap = new Map(configs.map((c) => [c.jobCode, c]));

    const results: JobBreakdown[] = [];

    for (const job of registeredJobs) {
      const config = configMap.get(job.code);

      const logs = await db.jobExecutionLog.findMany({
        where: { jobCode: job.code },
        select: { status: true, durationMs: true },
      });

      const totalRuns = logs.length;
      const successCount = logs.filter((l) => l.status === 'SUCCESS').length;
      const failureCount = logs.filter((l) => l.status === 'FAILED').length;
      const durations = logs.map((l) => l.durationMs || 0);
      const avgDurationMs = durations.length > 0 ? Math.round(durations.reduce((a, b) => a + b, 0) / durations.length) : 0;

      results.push({
        jobCode: job.code,
        jobName: job.name,
        totalRuns,
        successCount,
        failureCount,
        successRate: totalRuns > 0 ? Math.round((successCount / totalRuns) * 100) : 0,
        avgDurationMs,
        lastRunAt: config?.lastRunAt || null,
        isActive: config ? config.isActive : true,
      });
    }

    return results;
  },

  /**
   * Get recent execution logs.
   */
  async getRecentLogs(limit: number = 25) {
    return db.jobExecutionLog.findMany({
      orderBy: { startedAt: 'desc' },
      take: limit,
    });
  },
};
