'use server';

import { db } from '@/shared/server/db';
import { auth } from '@/features/auth/server/auth';

export interface AITelemetrySummary {
  totalInferences: number;
  averageLatencyMs: number;
  totalTokens: number;
  totalEstimatedCostUsd: number;
  successCount: number;
  failedCount: number;
  rateLimitedCount: number;
  timeoutCount: number;
  errorRatePercentage: number;
  capabilityBreakdown: Array<{
    capability: string;
    count: number;
    avgLatencyMs: number;
    tokensUsed: number;
  }>;
}

export async function getAITelemetrySummaryAction(): Promise<AITelemetrySummary> {
  const session = await auth();
  if (!session?.user?.id) throw new Error('Unauthorized');

  const last24h = new Date(Date.now() - 24 * 60 * 60 * 1000);

  const logs = await db.aiTelemetryLog.findMany({
    where: {
      createdAt: { gte: last24h },
    },
    orderBy: { createdAt: 'desc' },
  });

  const totalInferences = logs.length;
  if (totalInferences === 0) {
    return {
      totalInferences: 0,
      averageLatencyMs: 0,
      totalTokens: 0,
      totalEstimatedCostUsd: 0,
      successCount: 0,
      failedCount: 0,
      rateLimitedCount: 0,
      timeoutCount: 0,
      errorRatePercentage: 0,
      capabilityBreakdown: [],
    };
  }

  let totalDuration = 0;
  let totalTokens = 0;
  let totalEstimatedCostUsd = 0;
  let successCount = 0;
  let failedCount = 0;
  let rateLimitedCount = 0;
  let timeoutCount = 0;

  const capMap: Record<string, { count: number; totalLatency: number; tokensUsed: number }> = {};

  for (const log of logs) {
    totalDuration += log.durationMs;
    totalTokens += log.tokensUsed;
    totalEstimatedCostUsd += log.estimatedCost;

    if (log.status === 'SUCCESS') successCount++;
    else if (log.status === 'FAILED') failedCount++;
    else if (log.status === 'RATE_LIMITED') rateLimitedCount++;
    else if (log.status === 'TIMEOUT') timeoutCount++;

    const capKey = log.capability || 'UNKNOWN';
    if (!capMap[capKey]) {
      capMap[capKey] = { count: 0, totalLatency: 0, tokensUsed: 0 };
    }
    capMap[capKey].count++;
    capMap[capKey].totalLatency += log.durationMs;
    capMap[capKey].tokensUsed += log.tokensUsed;
  }

  const averageLatencyMs = Math.round(totalDuration / totalInferences);
  const nonSuccessCount = failedCount + rateLimitedCount + timeoutCount;
  const errorRatePercentage = parseFloat(((nonSuccessCount / totalInferences) * 100).toFixed(1));

  const capabilityBreakdown = Object.entries(capMap).map(([cap, data]) => ({
    capability: cap,
    count: data.count,
    avgLatencyMs: Math.round(data.totalLatency / data.count),
    tokensUsed: data.tokensUsed,
  }));

  return {
    totalInferences,
    averageLatencyMs,
    totalTokens,
    totalEstimatedCostUsd: parseFloat(totalEstimatedCostUsd.toFixed(6)),
    successCount,
    failedCount,
    rateLimitedCount,
    timeoutCount,
    errorRatePercentage,
    capabilityBreakdown,
  };
}
