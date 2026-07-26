import { AiCapabilityType } from '@prisma/client';

export type CapabilityLifecycleState = 'ACTIVE' | 'DEPRECATED' | 'EXPERIMENTAL';

export interface AICapabilityMetadata {
  capabilityId: AiCapabilityType;
  name: string;
  description: string;
  version: string;
  providerName: string;
  promptId: string;
  enabled: boolean;
  tags: string[];
  lifecycleState: CapabilityLifecycleState;
  dependencies: string[];
}

export interface AICapabilityResult<T> {
  success: boolean;
  data: T;
  confidence?: number;
  reasoning?: string;
  provider: string;
  model: string;
  promptVersion: string;
}

export interface CapabilityHealth {
  status: 'HEALTHY' | 'DEGRADED' | 'UNAVAILABLE';
  latencyMs: number;
  lastSuccessfulRun?: Date;
  providerReachable: boolean;
  message?: string;
}

export interface AICapability<TInput, TOutput> {
  readonly metadata: AICapabilityMetadata;
  execute(input: TInput): Promise<AICapabilityResult<TOutput>>;
  checkHealth(): Promise<CapabilityHealth>;
}
