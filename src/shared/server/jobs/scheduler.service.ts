import { db } from '@/shared/server/db';
import { JobExecutor } from './job.executor';
import { JobRegistry } from './job.registry';
import { LockService } from './lock.service';

class SchedulerServiceImpl {
  private timer: NodeJS.Timeout | null = null;
  private isRunning = false;
  private checkIntervalMs = 30000; // Check DB for due jobs every 30s
  private runnerId = `runner_${process.pid}_${Math.random().toString(36).substring(2, 7)}`;

  /**
   * Start the background scheduler loop.
   */
  start(): void {
    if (this.timer) {
      console.log('[SchedulerService] Scheduler is already running.');
      return;
    }

    console.log(`[SchedulerService] Starting background scheduler engine [RunnerID: ${this.runnerId}]...`);
    this.timer = setInterval(() => this.tick(), this.checkIntervalMs);
    setTimeout(() => this.tick(), 5000);
  }

  /**
   * Stop the scheduler engine.
   */
  stop(): void {
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
      console.log('[SchedulerService] Scheduler engine stopped.');
    }
  }

  /**
   * Execute a single tick to check for due jobs.
   */
  private async tick(): Promise<void> {
    if (this.isRunning) return; // Prevent concurrent ticks within this process
    this.isRunning = true;

    try {
      // Recover any stale locks left by crashed processes
      await LockService.staleLockRecovery();

      const now = new Date();
      const registeredJobs = JobRegistry.getAll();

      for (const job of registeredJobs) {
        const config = await db.jobConfiguration.findUnique({
          where: { jobCode: job.code },
        });

        const isDue = !config?.nextRunAt || config.nextRunAt <= now;
        const isActive = config ? config.isActive : true;

        if (isActive && isDue) {
          // Attempt distributed lock acquisition with 5-minute lease
          const acquired = await LockService.acquireLock(job.code, this.runnerId, 5 * 60 * 1000);
          if (acquired) {
            try {
              await JobExecutor.runJob(job.code, 'CRON');
            } finally {
              await LockService.releaseLock(job.code, this.runnerId);
            }
          }
        }
      }
    } catch (error) {
      console.error('[SchedulerService] Error during scheduler tick:', error);
    } finally {
      this.isRunning = false;
    }
  }
}

export const SchedulerService = new SchedulerServiceImpl();
