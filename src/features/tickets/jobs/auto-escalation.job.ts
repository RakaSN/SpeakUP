import { BackgroundJob, JobContext, JobResult } from '@/shared/server/jobs/job.interface';
import { db } from '@/shared/server/db';
import { SlaStatus } from '@prisma/client';
import { NotificationDispatcher } from '@/features/notifications/server/notification-dispatcher';

export class AutoEscalationJob implements BackgroundJob {
  readonly code = 'auto-escalation-job';
  readonly name = 'Auto Escalation Job';
  readonly defaultIntervalMs = 30 * 60 * 1000; // Check every 30 minutes

  async execute(context: JobContext): Promise<JobResult> {
    const now = new Date();
    const twentyFourHoursAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);

    const overdueTickets = await db.ticket.findMany({
      where: {
        deletedAt: null,
        resolvedAt: null,
        closedAt: null,
        targetResolutionAt: { lt: now },
      },
    });

    let escalatedCount = 0;
    let skippedIdempotent = 0;

    const managers = await db.userRole.findMany({
      where: {
        role: { name: { in: ['Super Admin', 'Admin', 'Kepala Sekolah'] } },
      },
      select: { userId: true },
    });
    const managerUserIds = Array.from(new Set(managers.map((m) => m.userId)));

    for (const ticket of overdueTickets) {
      // Idempotency check
      const recentEscalation = await db.ticketActivity.findFirst({
        where: {
          ticketId: ticket.id,
          actionCode: 'AUTO_ESCALATED',
          createdAt: { gte: twentyFourHoursAgo },
        },
      });

      if (recentEscalation) {
        skippedIdempotent++;
        continue;
      }

      // Transaction: ONLY data mutations (SLA status + Activity log)
      const systemActorId = managerUserIds[0] || ticket.reporterId;

      await db.$transaction(async (tx) => {
        if (ticket.slaStatus !== SlaStatus.OVERDUE) {
          await tx.ticket.update({
            where: { id: ticket.id },
            data: { slaStatus: SlaStatus.OVERDUE },
          });
        }

        await tx.ticketActivity.create({
          data: {
            ticketId: ticket.id,
            actorId: systemActorId,
            actionCode: 'AUTO_ESCALATED',
            actionLabel: 'Eskalasi Otomatis SLA Terlambat',
            note: `Tiket melewati batas waktu penyelesaian SLA. Notifikasi eskalasi dikirim ke manajemen.`,
            metadata: { targetResolutionAt: ticket.targetResolutionAt },
          },
        });
      });

      // Notification dispatch OUTSIDE transaction (per Transaction Boundary guidelines)
      await NotificationDispatcher.dispatch({
        notificationCode: 'AUTO_ESCALATION',
        variables: { ticketNumber: ticket.ticketNumber, ticketTitle: ticket.title },
        recipientIds: managerUserIds,
      });

      escalatedCount++;
    }

    return {
      success: true,
      message: `Pemeriksaan eskalasi selesai. Tiket di-eskalasi: ${escalatedCount}, Dilewati (Idempotent): ${skippedIdempotent}.`,
      metadata: {
        overdueCount: overdueTickets.length,
        escalatedCount,
        skippedIdempotent,
        trigger: context.trigger,
      },
    };
  }
}
