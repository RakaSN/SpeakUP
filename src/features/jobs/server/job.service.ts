import { db } from '@/shared/server/db';
import { JobRegistry } from '@/shared/server/jobs/job.registry';
import { JobExecutor } from '@/shared/server/jobs/job.executor';

export const JobService = {
  /**
   * List all background jobs registered in memory alongside their DB configuration.
   */
  async listJobs() {
    const registeredJobs = JobRegistry.getAll();
    const configs = await db.jobConfiguration.findMany();
    const configMap = new Map(configs.map((c) => [c.jobCode, c]));

    return registeredJobs.map((job) => {
      const config = configMap.get(job.code);
      return {
        code: job.code,
        name: job.name,
        isActive: config ? config.isActive : true,
        cronExpression: config?.cronExpression || null,
        intervalMs: config?.intervalMs || job.defaultIntervalMs || 60000,
        lastRunAt: config?.lastRunAt || null,
        nextRunAt: config?.nextRunAt || null,
      };
    });
  },

  /**
   * Toggle the active status of a background job.
   */
  async toggleJobStatus(jobCode: string, isActive: boolean) {
    return await db.jobConfiguration.update({
      where: { jobCode },
      data: { isActive },
    });
  },

  /**
   * Manually trigger a background job execution.
   */
  async triggerJobManually(jobCode: string, payload?: Record<string, unknown>) {
    return await JobExecutor.runJob(jobCode, 'MANUAL', payload);
  },

  /**
   * Fetch recent execution logs for a job.
   */
  async getExecutionLogs(jobCode?: string, limit = 50) {
    return await db.jobExecutionLog.findMany({
      where: jobCode ? { jobCode } : undefined,
      orderBy: { startedAt: 'desc' },
      take: limit,
    });
  },
};
