import { BackgroundJob, JobContext, JobResult } from '@/shared/server/jobs/job.interface';
import { db } from '@/shared/server/db';
import { bootstrapAICapabilities } from '@/shared/server/ai/registry/bootstrap-ai';
import { RiskPredictionInput, RiskPredictionResult } from '@/shared/server/ai/capabilities/risk-prediction.capability';
import { AiCapabilityType } from '@prisma/client';

export class AIPredictiveRiskJob implements BackgroundJob {
  readonly code = 'ai-predictive-risk-job';
  readonly name = 'AI Predictive SLA Risk & Early Escalation Job';
  readonly defaultIntervalMs = 6 * 60 * 60 * 1000; // Run every 6 hours

  async execute(context: JobContext): Promise<JobResult> {
    const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);

    // 1. Scan active unresolved tickets needing predictive evaluation
    const tickets = await db.ticket.findMany({
      where: {
        deletedAt: null,
        resolvedAt: null,
        closedAt: null,
        status: {
          name: { in: ['Submitted', 'Assigned', 'In Progress'] },
        },
        aiRecommendations: {
          none: {
            capability: AiCapabilityType.RECOMMENDATION,
            createdAt: { gte: twentyFourHoursAgo },
          },
        },
      },
      take: 10,
    });

    let processedCount = 0;
    const capability = bootstrapAICapabilities().get<RiskPredictionInput, RiskPredictionResult>(AiCapabilityType.RECOMMENDATION);

    for (const ticket of tickets) {
      try {
        await capability.execute({ ticketId: ticket.id });
        processedCount++;
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : String(err);
        console.error(`[AIPredictiveRiskJob] Error predicting risk for ticket #${ticket.ticketNumber}: ${msg}`);
      }
    }


    return {
      success: true,
      message: `AI Predictive Risk Job selesai. Tiket dievaluasi: ${processedCount}/${tickets.length}.`,
      metadata: {
        ticketsEvaluated: tickets.length,
        processedCount,
        trigger: context.trigger,
      },
    };
  }
}
