import { BackgroundJob } from './job.interface';

class JobRegistryImpl {
  private jobs = new Map<string, BackgroundJob>();

  /**
   * Register a background job definition in memory.
   */
  register(job: BackgroundJob): void {
    if (this.jobs.has(job.code)) {
      console.warn(`[JobRegistry] Warning: Overwriting job with code '${job.code}'`);
    }
    this.jobs.set(job.code, job);
    console.log(`[JobRegistry] Registered job: '${job.name}' (${job.code})`);
  }

  /**
   * Get a registered job by its code.
   */
  get(jobCode: string): BackgroundJob | undefined {
    return this.jobs.get(jobCode);
  }

  /**
   * List all registered jobs.
   */
  getAll(): BackgroundJob[] {
    return Array.from(this.jobs.values());
  }

  /**
   * Check if a job is registered.
   */
  has(jobCode: string): boolean {
    return this.jobs.has(jobCode);
  }
}

export const JobRegistry = new JobRegistryImpl();
