import { NextResponse } from 'next/server';
import { db } from '@/shared/server/db';
import { defaultQueueProvider } from '@/shared/server/queue/direct-queue.provider';

const serverStartedAt = new Date().toISOString();

export async function GET() {
  try {
    const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);

    const [failedJobs24h, queueSize] = await Promise.all([
      db.jobExecutionLog.count({
        where: {
          status: 'FAILED',
          startedAt: { gte: twentyFourHoursAgo },
        },
      }),
      defaultQueueProvider.size(),
    ]);

    const isHealthy = failedJobs24h === 0;

    return NextResponse.json(
      {
        version: '1.1.0',
        status: isHealthy ? 'healthy' : 'degraded',
        scheduler: 'running',
        startedAt: serverStartedAt,
        heartbeat: new Date().toISOString(),
        uptimeSeconds: Math.floor(process.uptime()),
        failedJobs24h,
        queue: {
          provider: defaultQueueProvider.name,
          pending: queueSize,
        },
      },
      { status: 200 }
    );
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    return NextResponse.json(
      {
        version: '1.1.0',
        status: 'unhealthy',
        error: message,
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}
