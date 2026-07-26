'use server';

import { auth } from '@/features/auth/server/auth';
import { AIModelEvaluationService, AIModelEvaluationSummary } from '@/shared/server/ai/evaluation/ai-model-evaluation.service';
import { AiCapabilityType } from '@prisma/client';

export async function getAIModelEvaluationAction(capabilityType?: AiCapabilityType): Promise<AIModelEvaluationSummary> {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error('Unauthorized');
  }

  return await AIModelEvaluationService.getEvaluationSummary(capabilityType);
}
