import { db } from '@/shared/server/db';
import { JobRegistry } from './job.registry';
import { JobContext, JobResult } from './job.interface';
import { DEFAULT_RETRY_STRATEGY, calculateRetryDelay, shouldRetryError } from './retry.strategy';
import { Prisma } from '@prisma/client';

export const JobExecutor = {
  /**
   * Execute a background job safely with retry strategy support, recording logs and updating job configuration.
   */
  async runJob(jobCode: string, trigger: JobContext['trigger'] = 'CRON', payload?: Record<string, unknown>): Promise<JobResult> {
    const job = JobRegistry.get(jobCode);
    if (!job) {
      const msg = `Job '${jobCode}' is not registered in JobRegistry.`;
      console.error(`[JobExecutor] ${msg}`);
      return { success: false, message: msg };
    }

    const startedAt = new Date();

    // Ensure JobConfiguration row exists in database
    let config = await db.jobConfiguration.findUnique({
      where: { jobCode },
    });

    if (!config) {
      config = await db.jobConfiguration.create({
        data: {
          jobCode,
          name: job.name,
          isActive: true,
          intervalMs: job.defaultIntervalMs || 60000,
        },
      });
    }

    if (!config.isActive && trigger === 'CRON') {
      return { success: false, message: `Job '${jobCode}' is disabled.` };
    }

    console.log(`[JobExecutor] Running job '${job.name}' (${jobCode}) [Trigger: ${trigger}]...`);

    const retryStrategy = job.retryStrategy || DEFAULT_RETRY_STRATEGY;
    const maxAttempts = Math.max(1, retryStrategy.maxAttempts || 1);

    let result: JobResult = { success: false };
    const startTime = Date.now();
    let attempt = 0;

    while (attempt < maxAttempts) {
      attempt++;
      try {
        result = await job.execute({ jobCode, trigger, payload });
        if (result.success) break; // Job succeeded, exit loop

        // Evaluate if error is retryable
        const errorMsg = result.message || 'Job returned unsuccessful status';
        const isRetryable = shouldRetryError(retryStrategy, attempt, errorMsg);

        if (!isRetryable || attempt >= maxAttempts) {
          console.warn(`[JobExecutor] Job '${jobCode}' failed attempt ${attempt}/${maxAttempts} (Non-retryable or max attempts reached).`);
          break;
        }

        const delayMs = calculateRetryDelay(retryStrategy, attempt);
        console.log(`[JobExecutor] Retrying job '${jobCode}' (Attempt ${attempt + 1}/${maxAttempts}) in ${delayMs}ms...`);
        await new Promise((resolve) => setTimeout(resolve, delayMs));
      } catch (err: unknown) {
        const errorMsg = err instanceof Error ? err.message : String(err);
        result = {
          success: false,
          message: `Execution exception: ${errorMsg}`,
        };

        const isRetryable = shouldRetryError(retryStrategy, attempt, errorMsg);
        if (!isRetryable || attempt >= maxAttempts) {
          break;
        }

        const delayMs = calculateRetryDelay(retryStrategy, attempt);
        console.log(`[JobExecutor] Retrying job '${jobCode}' after exception (Attempt ${attempt + 1}/${maxAttempts}) in ${delayMs}ms...`);
        await new Promise((resolve) => setTimeout(resolve, delayMs));
      }
    }

    const completedAt = new Date();
    const durationMs = Date.now() - startTime;

    const interval = config.intervalMs || 60000;
    const nextRunAt = new Date(completedAt.getTime() + interval);

    // Save execution log and update config in transaction
    await db.$transaction(async (tx) => {
      await tx.jobExecutionLog.create({
        data: {
          jobCode,
          status: result.success ? 'SUCCESS' : 'FAILED',
          message: result.message || (result.success ? 'Executed successfully' : 'Failed'),
          metadata: {
            ...(result.metadata || {}),
            attemptsExecuted: attempt,
            retryPolicy: retryStrategy.policy,
          } as Prisma.InputJsonValue,
          durationMs,
          startedAt,
          completedAt,
        },
      });

      await tx.jobConfiguration.update({
        where: { jobCode },
        data: {
          lastRunAt: completedAt,
          nextRunAt,
        },
      });
    });

    console.log(`[JobExecutor] Job '${jobCode}' finished in ${durationMs}ms (Attempts: ${attempt}) with status: ${result.success ? 'SUCCESS' : 'FAILED'}`);
    return result;
  },
};
