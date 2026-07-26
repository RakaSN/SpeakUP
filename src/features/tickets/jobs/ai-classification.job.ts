import { BackgroundJob, JobContext, JobResult } from '@/shared/server/jobs/job.interface';
import { db } from '@/shared/server/db';
import { classificationCapability } from '@/shared/server/ai/capabilities/classification.capability';
import { AiCapabilityType } from '@prisma/client';

export class AIClassificationJob implements BackgroundJob {
  readonly code = 'ai-classification-job';
  readonly name = 'AI Ticket Classification Assistance Job';
  readonly defaultIntervalMs = 10 * 60 * 1000; // Run every 10 minutes

  async execute(context: JobContext): Promise<JobResult> {
    // 1. Scan active tickets without existing CLASSIFICATION recommendations
    const tickets = await db.ticket.findMany({
      where: {
        deletedAt: null,
        resolvedAt: null,
        closedAt: null,
        aiRecommendations: {
          none: {
            capability: AiCapabilityType.CLASSIFICATION,
          },
        },
      },
      take: 10, // Process in batches of 10
    });

    let processedCount = 0;

    for (const ticket of tickets) {
      // Data snapshot at the start of inference
      const snapshot = {
        id: ticket.id,
        title: ticket.title,
        description: ticket.description,
      };

      try {
        await classificationCapability.classifyTicket(
          snapshot.id,
          snapshot.title,
          snapshot.description
        );
        processedCount++;
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : String(err);
        console.error(`[AIClassificationJob] Error classifying ticket #${ticket.ticketNumber}: ${msg}`);
      }
    }

    return {
      success: true,
      message: `AI Classification Job selesai. Tiket diproses: ${processedCount}/${tickets.length}.`,
      metadata: {
        ticketsFound: tickets.length,
        processedCount,
        trigger: context.trigger,
      },
    };
  }
}
