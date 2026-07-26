'use server';

import { db } from '@/shared/server/db';
import { auth } from '@/features/auth/server/auth';
import { revalidatePath } from 'next/cache';
import { Prisma } from '@prisma/client';

export async function acknowledgeInsightAction(recommendationId: string, note?: string) {
  const session = await auth();
  if (!session?.user?.id) {
    return { success: false, error: 'Unauthorized' };
  }

  const rec = await db.aiRecommendation.findUnique({
    where: { id: recommendationId },
  });

  if (!rec) {
    return { success: false, error: 'Insight / Recommendation not found' };
  }

  const currentData = (rec.recommendationData as Record<string, unknown>) || {};
  const updatedData = {
    ...currentData,
    lifecycleState: 'ACKNOWLEDGED',
    acknowledgedBy: session.user.id,
    acknowledgedAt: new Date().toISOString(),
    acknowledgementNote: note || 'Ditolak/Diterima & Ditindaklanjuti oleh Petugas',
  };

  await db.aiRecommendation.update({
    where: { id: recommendationId },
    data: {
      userAction: 'ACCEPTED',
      actionReason: note || 'Insight / Rekomendasi di-acknowledge oleh petugas.',
      recommendationData: updatedData as Prisma.InputJsonValue,
    },
  });

  revalidatePath('/dashboard');
  return { success: true };
}

export async function archiveInsightAction(recommendationId: string) {
  const session = await auth();
  if (!session?.user?.id) {
    return { success: false, error: 'Unauthorized' };
  }

  const rec = await db.aiRecommendation.findUnique({
    where: { id: recommendationId },
  });

  if (!rec) {
    return { success: false, error: 'Insight / Recommendation not found' };
  }

  const currentData = (rec.recommendationData as Record<string, unknown>) || {};
  const updatedData = {
    ...currentData,
    lifecycleState: 'ARCHIVED',
    archivedBy: session.user.id,
    archivedAt: new Date().toISOString(),
  };

  await db.aiRecommendation.update({
    where: { id: recommendationId },
    data: {
      recommendationData: updatedData as Prisma.InputJsonValue,
    },
  });

  revalidatePath('/dashboard');
  return { success: true };
}
