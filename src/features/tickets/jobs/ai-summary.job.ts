import { BackgroundJob, JobContext, JobResult } from '@/shared/server/jobs/job.interface';
import { db } from '@/shared/server/db';
import { summarizationCapability } from '@/shared/server/ai/capabilities/summarization.capability';
import { AiCapabilityType } from '@prisma/client';

const MIN_DESCRIPTION_LENGTH = 50; // Minimum 50 characters required for summarization

export class AISummaryJob implements BackgroundJob {
  readonly code = 'ai-summary-job';
  readonly name = 'AI Chronology Summarization Job';
  readonly defaultIntervalMs = 15 * 60 * 1000; // Run every 15 minutes

  async execute(context: JobContext): Promise<JobResult> {
    // Scan active tickets without existing SUMMARIZATION recommendations
    const tickets = await db.ticket.findMany({
      where: {
        deletedAt: null,
        resolvedAt: null,
        closedAt: null,
        aiRecommendations: {
          none: {
            capability: AiCapabilityType.SUMMARIZATION,
          },
        },
      },
      take: 10,
    });

    let summarizedCount = 0;
    let skippedBelowThreshold = 0;

    for (const ticket of tickets) {
      // Threshold check: Skip short descriptions
      if (!ticket.description || ticket.description.trim().length < MIN_DESCRIPTION_LENGTH) {
        skippedBelowThreshold++;
        continue;
      }

      try {
        await summarizationCapability.summarizeTicket(ticket.id, ticket.description);
        summarizedCount++;
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : String(err);
        console.error(`[AISummaryJob] Error summarizing ticket #${ticket.ticketNumber}: ${msg}`);
      }
    }

    return {
      success: true,
      message: `AI Summary Job selesai. Tiket disarikan: ${summarizedCount}, Dilewati (Bawah Ambang Batas < ${MIN_DESCRIPTION_LENGTH} karakter): ${skippedBelowThreshold}.`,
      metadata: {
        ticketsFound: tickets.length,
        summarizedCount,
        skippedBelowThreshold,
        trigger: context.trigger,
      },
    };
  }
}
