import { db } from '@/shared/server/db';
import { AppError } from '@/shared/lib/errors';
import { AiCapabilityType, AiUserAction, Prisma } from '@prisma/client';

export const AiRecommendationService = {
  /**
   * Fetch all AI recommendations for a specific ticket.
   */
  async getRecommendationsForTicket(ticketId: string) {
    return await db.aiRecommendation.findMany({
      where: { ticketId },
      orderBy: { createdAt: 'desc' },
    });
  },

  /**
   * Accept an AI classification recommendation transactionally.
   * Only applies validated domain fields (categoryId, priorityId) to ticket.
   */
  async acceptRecommendation(recommendationId: string, actorId: string) {
    const rec = await db.aiRecommendation.findUnique({
      where: { id: recommendationId },
      include: { ticket: true },
    });

    if (!rec || !rec.ticketId || !rec.ticket) {
      throw new AppError('NOT_FOUND', 'Rekomendasi AI tidak ditemukan.');
    }

    if (rec.userAction !== AiUserAction.PENDING) {
      throw new AppError('VALIDATION_ERROR', `Rekomendasi sudah diproses sebelumnya dengan status: ${rec.userAction}`);
    }

    const data = rec.recommendationData as Record<string, unknown>;
    const categoryId = typeof data.suggestedCategoryId === 'string' ? data.suggestedCategoryId : undefined;
    const priorityId = typeof data.suggestedPriorityId === 'string' ? data.suggestedPriorityId : undefined;

    return await db.$transaction(async (tx) => {
      // 1. Update AiRecommendation status
      const updatedRec = await tx.aiRecommendation.update({
        where: { id: recommendationId },
        data: {
          userAction: AiUserAction.ACCEPTED,
          actionReason: 'Diterima oleh pengguna',
        },
      });

      // 2. Safely apply ONLY validated domain fields to Ticket
      const ticketUpdateData: { categoryId?: string; priorityId?: string } = {};
      if (categoryId) ticketUpdateData.categoryId = categoryId;
      if (priorityId) ticketUpdateData.priorityId = priorityId;

      if (Object.keys(ticketUpdateData).length > 0) {
        await tx.ticket.update({
          where: { id: rec.ticketId! },
          data: ticketUpdateData,
        });
      }

      // 3. Record Activity Log for Auditability
      await tx.ticketActivity.create({
        data: {
          ticketId: rec.ticketId!,
          actorId,
          actionCode: 'AI_REC_ACCEPTED',
          actionLabel: 'Rekomendasi AI Diterima',
          note: `Rekomendasi AI (${rec.capability}) diterima. Kategori/Prioritas diperbarui.`,
          metadata: { recommendationId, capability: rec.capability },
        },
      });

      return updatedRec;
    });
  },

  /**
   * Reject an AI recommendation transactionally.
   */
  async rejectRecommendation(recommendationId: string, actorId: string, reason?: string) {
    const rec = await db.aiRecommendation.findUnique({
      where: { id: recommendationId },
    });

    if (!rec || !rec.ticketId) {
      throw new AppError('NOT_FOUND', 'Rekomendasi AI tidak ditemukan.');
    }

    return await db.$transaction(async (tx) => {
      const updatedRec = await tx.aiRecommendation.update({
        where: { id: recommendationId },
        data: {
          userAction: AiUserAction.REJECTED,
          actionReason: reason || 'Ditolak oleh pengguna',
        },
      });

      await tx.ticketActivity.create({
        data: {
          ticketId: rec.ticketId!,
          actorId,
          actionCode: 'AI_REC_REJECTED',
          actionLabel: 'Rekomendasi AI Ditolak',
          note: `Rekomendasi AI (${rec.capability}) ditolak. Alasan: ${reason || '—'}`,
          metadata: { recommendationId, capability: rec.capability, reason },
        },
      });

      return updatedRec;
    });
  },

  /**
   * Override an AI recommendation with user-specified values transactionally.
   */
  async overrideRecommendation(
    recommendationId: string,
    actorId: string,
    overrideValues: { categoryId?: string; priorityId?: string; reason?: string }
  ) {
    const rec = await db.aiRecommendation.findUnique({
      where: { id: recommendationId },
    });

    if (!rec || !rec.ticketId) {
      throw new AppError('NOT_FOUND', 'Rekomendasi AI tidak ditemukan.');
    }

    return await db.$transaction(async (tx) => {
      const updatedRec = await tx.aiRecommendation.update({
        where: { id: recommendationId },
        data: {
          userAction: AiUserAction.OVERRIDDEN,
          actionReason: overrideValues.reason || 'Diubah manual oleh pengguna',
        },
      });

      const ticketUpdateData: { categoryId?: string; priorityId?: string } = {};
      if (overrideValues.categoryId) ticketUpdateData.categoryId = overrideValues.categoryId;
      if (overrideValues.priorityId) ticketUpdateData.priorityId = overrideValues.priorityId;

      if (Object.keys(ticketUpdateData).length > 0) {
        await tx.ticket.update({
          where: { id: rec.ticketId! },
          data: ticketUpdateData,
        });
      }

      await tx.ticketActivity.create({
        data: {
          ticketId: rec.ticketId!,
          actorId,
          actionCode: 'AI_REC_OVERRIDDEN',
          actionLabel: 'Rekomendasi AI Diubah (Override)',
          note: `Rekomendasi AI diubah manual. Alasan: ${overrideValues.reason || '—'}`,
          metadata: { recommendationId, overrideValues },
        },
      });

      return updatedRec;
    });
  },
};
