import { AiCapabilityType } from '@prisma/client';

export interface AIInferenceParams {
  systemPrompt: string;
  userPrompt: string;
  temperature?: number;
  responseFormat?: 'json' | 'text';
  capabilityId?: AiCapabilityType;
}

export interface AIInferenceResponse {
  rawOutput: string;
  parsedJson?: Record<string, unknown>;
  modelName: string;
  promptVersion: string;
  tokensUsed?: number;
  durationMs?: number;
}

export interface AIProvider {
  readonly name: string;
  readonly modelVersion: string;
  generateInference(params: AIInferenceParams): Promise<AIInferenceResponse>;
}
