import { BackgroundJob, JobContext, JobResult } from './job.interface';

export class DummyLogJob implements BackgroundJob {
  readonly code = 'dummy-log-job';
  readonly name = 'Dummy Heartbeat Job';
  readonly defaultIntervalMs = 60000; // Run every 60 seconds

  async execute(context: JobContext): Promise<JobResult> {
    const timestamp = new Date().toISOString();
    console.log(`[DummyLogJob] Executing heartbeat job at ${timestamp} (Trigger: ${context.trigger})`);
    
    return {
      success: true,
      message: `Heartbeat log generated successfully at ${timestamp}`,
      metadata: { timestamp, trigger: context.trigger },
    };
  }
}
