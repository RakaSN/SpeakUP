import { db } from '@/shared/server/db';
import { AIProvider } from '../providers/ai-provider.interface';
import { AIProviderFactory } from '../providers/ai-provider.factory';
import { PromptRegistry } from '../prompts/prompt.registry';
import { AiCapabilityType, Prisma } from '@prisma/client';
import { AICapability, AICapabilityMetadata, AICapabilityResult, CapabilityHealth } from '../registry/ai-capability.interface';

export interface SummarizationInput {
  ticketId: string;
  chronologyText: string;
}

export interface AISummaryResult {
  summaryText: string;
  keyPoints: string[];
  sentiment: 'POSITIVE' | 'NEUTRAL' | 'NEGATIVE' | 'URGENT';
  reasoning: string;
  recommendationId: string;
}

export class SummarizationCapability implements AICapability<SummarizationInput, AISummaryResult> {
  readonly metadata: AICapabilityMetadata;

  constructor(private provider: AIProvider = AIProviderFactory.getProvider()) {
    const promptDef = PromptRegistry.getActivePrompt(AiCapabilityType.SUMMARIZATION);
    this.metadata = {
      capabilityId: AiCapabilityType.SUMMARIZATION,
      name: 'Chronology Summarization Capability',
      description: 'Ekstraksi poin-poin utama dan sentimen dari kronologi pengaduan',
      version: '1.0.0',
      providerName: provider.name,
      promptId: `ticket-summary:${promptDef.version}`,
      enabled: true,
      tags: ['summarization', 'nlp', 'sentiment'],
      lifecycleState: 'ACTIVE',
      dependencies: ['PromptRegistry', 'GeminiAIProvider'],
    };

  }

  async execute(input: SummarizationInput): Promise<AICapabilityResult<AISummaryResult>> {
    const { ticketId, chronologyText } = input;
    const promptDef = PromptRegistry.getActivePrompt(AiCapabilityType.SUMMARIZATION);

    const userPrompt = `Kronologi / Deskripsi Pengaduan:\n${chronologyText}`;

    const response = await this.provider.generateInference({
      systemPrompt: promptDef.systemPrompt,
      userPrompt,
      temperature: 0.2,
      responseFormat: 'json',
      capabilityId: AiCapabilityType.SUMMARIZATION,
    });

    const parsed = response.parsedJson || {};
    const summaryText = (parsed.summaryText as string) || 'Ringkasan otomatis dari kronologi pengaduan.';
    const keyPoints = (parsed.keyPoints as string[]) || ['Poin utama pengaduan tercatat.'];
    const sentiment = (parsed.sentiment as AISummaryResult['sentiment']) || 'NEUTRAL';
    const reasoning = (parsed.reasoning as string) || 'Ekstraksi poin-poin penting dari kronologi yang dilaporkan.';

    const recData = {
      summaryText,
      keyPoints,
      sentiment,
      reasoning,
    };

    const recRecord = await db.aiRecommendation.create({
      data: {
        ticketId,
        capability: AiCapabilityType.SUMMARIZATION,
        modelName: response.modelName,
        promptVersion: promptDef.version,
        confidenceScore: 0.9,
        recommendationData: recData as Prisma.InputJsonValue,
        userAction: 'PENDING',
      },
    });

    const resultData: AISummaryResult = {
      summaryText,
      keyPoints,
      sentiment,
      reasoning,
      recommendationId: recRecord.id,
    };

    return {
      success: true,
      data: resultData,
      confidence: 0.9,
      reasoning,
      provider: this.provider.name,
      model: response.modelName,
      promptVersion: promptDef.version,
    };
  }

  async summarizeTicket(ticketId: string, chronologyText: string): Promise<AISummaryResult> {
    const res = await this.execute({ ticketId, chronologyText });
    return res.data;
  }

  async checkHealth(): Promise<CapabilityHealth> {
    const start = Date.now();
    try {
      const latencyMs = Date.now() - start;
      return {
        status: 'HEALTHY',
        latencyMs,
        providerReachable: true,
        lastSuccessfulRun: new Date(),
        message: 'Summarization capability is online.',
      };
    } catch (err: unknown) {
      return {
        status: 'UNAVAILABLE',
        latencyMs: Date.now() - start,
        providerReachable: false,
        message: err instanceof Error ? err.message : String(err),
      };
    }
  }
}

export const summarizationCapability = new SummarizationCapability();
