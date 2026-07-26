import { BackgroundJob, JobContext, JobResult } from '@/shared/server/jobs/job.interface';
import { db } from '@/shared/server/db';
import { TicketAnalyticsRepository, TicketAnalyticsDataset } from '../server/ticket-analytics.repository';
import { bootstrapAICapabilities } from '@/shared/server/ai/registry/bootstrap-ai';
import { TrendAnalysisResult } from '@/shared/server/ai/capabilities/trend-analysis.capability';
import { AiCapabilityType } from '@prisma/client';

export class AITrendAnalysisJob implements BackgroundJob {
  readonly code = 'ai-trend-analysis-job';
  readonly name = 'AI Trend Analysis & Platform Insights Job';
  readonly defaultIntervalMs = 24 * 60 * 60 * 1000; // Daily job

  async execute(context: JobContext): Promise<JobResult> {
    const now = new Date();
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const endOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999);

    // Snapshot Idempotency Check: check if snapshot exists for today
    const existingSnapshot = await db.aiRecommendation.findFirst({
      where: {
        ticketId: null,
        capability: AiCapabilityType.TREND_ANALYSIS,
        createdAt: {
          gte: startOfToday,
          lte: endOfToday,
        },
      },
    });

    const forceRun = Boolean(context.metadata?.force);

    if (existingSnapshot && !forceRun) {
      return {
        success: true,
        message: `[Idempotent Skip] Analytics snapshot for period ${startOfToday.toISOString().slice(0, 10)} already exists (ID: ${existingSnapshot.id}).`,
        metadata: {
          skipped: true,
          existingSnapshotId: existingSnapshot.id,
          date: startOfToday.toISOString().slice(0, 10),
        },
      };
    }

    // Window for analysis: last 30 days
    const windowStart = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    const windowEnd = now;

    // 1. Fetch Analytics Dataset from Repository
    const dataset = await TicketAnalyticsRepository.getDatasetForPeriod(windowStart, windowEnd);

    // 2. Discover & Execute AI Trend Analysis Capability via Registry
    const capability = bootstrapAICapabilities().get<TicketAnalyticsDataset, TrendAnalysisResult>(AiCapabilityType.TREND_ANALYSIS);
    const execution = await capability.execute(dataset);
    const result = execution.data;


    return {
      success: true,
      message: `AI Trend Analysis Job selesai. Dataset: ${dataset.totalTickets} tiket. Snapshot ID: ${result.recommendationId}`,
      metadata: {
        totalTickets: dataset.totalTickets,
        recommendationId: result.recommendationId,
        windowStart: windowStart.toISOString(),
        windowEnd: windowEnd.toISOString(),
      },
    };
  }
}
