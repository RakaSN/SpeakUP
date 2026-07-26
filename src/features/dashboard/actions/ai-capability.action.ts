'use server';

import { auth } from '@/features/auth/server/auth';
import { bootstrapAICapabilities } from '@/shared/server/ai/registry/bootstrap-ai';
import { AICapabilityMetadata, CapabilityHealth } from '@/shared/server/ai/registry/ai-capability.interface';

export interface AICapabilityStatusDTO extends AICapabilityMetadata {
  health: CapabilityHealth;
}

export async function getAICapabilityRegistryStatusAction(): Promise<AICapabilityStatusDTO[]> {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error('Unauthorized');
  }

  const registry = bootstrapAICapabilities();
  return await registry.getRegistryStatus();
}
