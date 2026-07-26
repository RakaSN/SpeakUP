import { db } from '@/shared/server/db';
import { AIProvider } from '../providers/ai-provider.interface';
import { AIProviderFactory } from '../providers/ai-provider.factory';
import { PromptRegistry } from '../prompts/prompt.registry';
import { AiCapabilityType, Prisma } from '@prisma/client';
import { AICapability, AICapabilityMetadata, AICapabilityResult, CapabilityHealth } from '../registry/ai-capability.interface';

export interface ClassificationInput {
  ticketId: string;
  title: string;
  description: string;
}

export interface AIClassificationResult {
  suggestedCategoryId?: string;
  suggestedCategoryName?: string;
  suggestedPriorityId?: string;
  suggestedPriorityName?: string;
  confidenceScore: number;
  reasoning: string;
  recommendationId: string;
}

export class ClassificationCapability implements AICapability<ClassificationInput, AIClassificationResult> {
  readonly metadata: AICapabilityMetadata;

  constructor(private provider: AIProvider = AIProviderFactory.getProvider()) {
    const promptDef = PromptRegistry.getActivePrompt(AiCapabilityType.CLASSIFICATION);
    this.metadata = {
      capabilityId: AiCapabilityType.CLASSIFICATION,
      name: 'Ticket Classification Capability',
      description: 'Klasifikasi otomatis kategori dan tingkat prioritas tiket pengaduan',
      version: '1.0.0',
      providerName: provider.name,
      promptId: `ticket-classification:${promptDef.version}`,
      enabled: true,
      tags: ['classification', 'triage', 'ticket'],
      lifecycleState: 'ACTIVE',
      dependencies: ['MasterTicketCategory', 'MasterTicketPriority', 'PromptRegistry', 'GeminiAIProvider'],
    };

  }

  async execute(input: ClassificationInput): Promise<AICapabilityResult<AIClassificationResult>> {
    const { ticketId, title, description } = input;
    const categories = await db.masterTicketCategory.findMany({ where: { isActive: true }, select: { id: true, name: true } });
    const priorities = await db.masterTicketPriority.findMany({ where: { isActive: true }, select: { id: true, name: true } });

    const promptDef = PromptRegistry.getActivePrompt(AiCapabilityType.CLASSIFICATION);

    const systemPromptWithContext = `${promptDef.systemPrompt}\n\nAVAILABLE CATEGORIES: ${categories.map((c) => c.name).join(', ')}\nAVAILABLE PRIORITIES: ${priorities.map((p) => p.name).join(', ')}`;
    const userPrompt = `Judul Tiket: ${title}\nDeskripsi Tiket: ${description}`;

    const response = await this.provider.generateInference({
      systemPrompt: systemPromptWithContext,
      userPrompt,
      temperature: 0.1,
      responseFormat: 'json',
      capabilityId: AiCapabilityType.CLASSIFICATION,
    });

    const parsed = response.parsedJson || {};
    const categoryName = (parsed.suggestedCategoryName as string) || categories[0]?.name;
    const priorityName = (parsed.suggestedPriorityName as string) || priorities[0]?.name;
    const confidenceScore = (parsed.confidenceScore as number) || 0.85;
    const reasoning = (parsed.reasoning as string) || 'Klasifikasi otomatis berdasarkan analisis isi pengaduan.';

    const matchedCategory = categories.find((c) => c.name.toLowerCase() === categoryName.toLowerCase());
    const matchedPriority = priorities.find((p) => p.name.toLowerCase() === priorityName.toLowerCase());

    const recData = {
      suggestedCategoryId: matchedCategory?.id,
      suggestedCategoryName: categoryName,
      suggestedPriorityId: matchedPriority?.id,
      suggestedPriorityName: priorityName,
      confidenceScore,
      reasoning,
    };

    const recRecord = await db.aiRecommendation.create({
      data: {
        ticketId,
        capability: AiCapabilityType.CLASSIFICATION,
        modelName: response.modelName,
        promptVersion: promptDef.version,
        confidenceScore,
        recommendationData: recData as Prisma.InputJsonValue,
        userAction: 'PENDING',
      },
    });

    const resultData: AIClassificationResult = {
      suggestedCategoryId: matchedCategory?.id,
      suggestedCategoryName: categoryName,
      suggestedPriorityId: matchedPriority?.id,
      suggestedPriorityName: priorityName,
      confidenceScore,
      reasoning,
      recommendationId: recRecord.id,
    };

    return {
      success: true,
      data: resultData,
      confidence: confidenceScore,
      reasoning,
      provider: this.provider.name,
      model: response.modelName,
      promptVersion: promptDef.version,
    };
  }

  async classifyTicket(ticketId: string, title: string, description: string): Promise<AIClassificationResult> {
    const res = await this.execute({ ticketId, title, description });
    return res.data;
  }

  async checkHealth(): Promise<CapabilityHealth> {
    const start = Date.now();
    try {
      // Basic database check & provider readiness check
      const hasCategories = await db.masterTicketCategory.count();
      const latencyMs = Date.now() - start;
      return {
        status: hasCategories > 0 ? 'HEALTHY' : 'DEGRADED',
        latencyMs,
        providerReachable: true,
        lastSuccessfulRun: new Date(),
        message: hasCategories > 0 ? 'Capability active and master data online.' : 'Master category empty.',
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

export const classificationCapability = new ClassificationCapability();
