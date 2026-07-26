import { RetryStrategy } from './retry.strategy';

export type JobTrigger = 'CRON' | 'MANUAL' | 'EVENT';

export interface JobContext {
  jobCode: string;
  trigger: JobTrigger;
  payload?: Record<string, unknown>;
  metadata?: Record<string, unknown>;
}


export interface JobResult {
  success: boolean;
  message?: string;
  metadata?: Record<string, unknown>;
}

export interface BackgroundJob {
  readonly code: string;
  readonly name: string;
  readonly defaultIntervalMs?: number; // fallback execution interval if no cron expression
  readonly retryStrategy?: RetryStrategy;
  execute(context: JobContext): Promise<JobResult>;
}
