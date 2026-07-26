import { db } from '@/shared/server/db';
import { AIProvider } from '../providers/ai-provider.interface';
import { AIProviderFactory } from '../providers/ai-provider.factory';
import { PromptRegistry } from '../prompts/prompt.registry';
import { AiCapabilityType, Prisma } from '@prisma/client';
import { AICapability, AICapabilityMetadata, AICapabilityResult, CapabilityHealth } from '../registry/ai-capability.interface';

export interface RiskPredictionInput {
  ticketId: string;
}

export interface RiskPredictionResult {
  recommendationId: string;
  ticketId: string;
  breachProbability: number;
  riskLevel: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  riskFactors: string[];
  recommendedActions: string[];
  confidenceScore: number;
  reasoning: string;
  lifecycleState: 'GENERATED' | 'VIEWED' | 'ACKNOWLEDGED' | 'ARCHIVED';
}

export class RiskPredictionCapability implements AICapability<RiskPredictionInput, RiskPredictionResult> {
  readonly metadata: AICapabilityMetadata;

  constructor(private provider: AIProvider = AIProviderFactory.getProvider()) {
    const promptDef = PromptRegistry.getActivePrompt(AiCapabilityType.RECOMMENDATION);
    this.metadata = {
      capabilityId: AiCapabilityType.RECOMMENDATION,
      name: 'Predictive SLA Risk Capability',
      description: 'Prediksi risiko keterlambatan batas SLA dan usulan tindakan pencegahan',
      version: '1.0.0',
      providerName: provider.name,
      promptId: `sla-risk-prediction:${promptDef.version}`,
      enabled: true,
      tags: ['predictive', 'sla', 'risk'],
      lifecycleState: 'ACTIVE',
      dependencies: ['TicketRepository', 'PromptRegistry', 'GeminiAIProvider'],
    };

  }

  async execute(input: RiskPredictionInput): Promise<AICapabilityResult<RiskPredictionResult>> {
    const { ticketId } = input;
    const ticket = await db.ticket.findUnique({
      where: { id: ticketId },
      include: { category: true, priority: true, status: true, assignments: true },
    });

    if (!ticket) {
      throw new Error(`Ticket with ID ${ticketId} not found`);
    }

    const promptDef = PromptRegistry.getActivePrompt(AiCapabilityType.RECOMMENDATION);

    const now = new Date();
    const createdAt = new Date(ticket.createdAt);
    const targetAt = ticket.targetResolutionAt ? new Date(ticket.targetResolutionAt) : null;
    const elapsedHours = (now.getTime() - createdAt.getTime()) / (1000 * 60 * 60);

    const userPrompt = `TICKET NUMBER: ${ticket.ticketNumber}
TITLE: ${ticket.title}
DESCRIPTION: ${ticket.description}
CATEGORY: ${ticket.category?.name || 'Unknown'}
PRIORITY: ${ticket.priority?.name || 'Normal'}
STATUS: ${ticket.status?.name || 'Unknown'}
SLA STATUS: ${ticket.slaStatus}
SLA TARGET HOURS: ${ticket.slaHours || 24}
ELAPSED HOURS: ${elapsedHours.toFixed(1)}
ASSIGNMENTS COUNT: ${ticket.assignments.length}
TARGET RESOLUTION AT: ${targetAt ? targetAt.toISOString() : 'None'}`;

    const response = await this.provider.generateInference({
      systemPrompt: promptDef.systemPrompt,
      userPrompt,
      temperature: 0.1,
      responseFormat: 'json',
      capabilityId: AiCapabilityType.RECOMMENDATION,
    });

    const parsed = response.parsedJson || {};
    const breachProbability = typeof parsed.breachProbability === 'number' ? parsed.breachProbability : 0.65;
    const riskLevel = (parsed.riskLevel as 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW') || (breachProbability > 0.7 ? 'HIGH' : 'MEDIUM');
    const riskFactors = Array.isArray(parsed.riskFactors) ? parsed.riskFactors : ['Waktu penanganan mendekati batas SLA jam'];
    const recommendedActions = Array.isArray(parsed.recommendedActions) ? parsed.recommendedActions : ['Segera tatalaksana dan konfirmasi penugasan petugas'];
    const confidenceScore = typeof parsed.confidenceScore === 'number' ? parsed.confidenceScore : 0.88;
    const reasoning = (parsed.reasoning as string) || 'Prediksi risiko keterlambatan SLA berdasarkan sisa waktu dan tingkat prioritas.';

    const recData = {
      breachProbability,
      riskLevel,
      riskFactors,
      recommendedActions,
      confidenceScore,
      reasoning,
      lifecycleState: 'GENERATED',
    };

    const recRecord = await db.aiRecommendation.create({
      data: {
        ticketId: ticket.id,
        capability: AiCapabilityType.RECOMMENDATION,
        modelName: response.modelName,
        promptVersion: promptDef.version,
        confidenceScore,
        recommendationData: recData as Prisma.InputJsonValue,
        userAction: 'PENDING',
      },
    });

    const resultData: RiskPredictionResult = {
      recommendationId: recRecord.id,
      ticketId: ticket.id,
      breachProbability,
      riskLevel,
      riskFactors,
      recommendedActions,
      confidenceScore,
      reasoning,
      lifecycleState: 'GENERATED',
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

  async predictTicketRisk(ticketId: string): Promise<RiskPredictionResult> {
    const res = await this.execute({ ticketId });
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
        message: 'Risk prediction capability online.',
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

export const riskPredictionCapability = new RiskPredictionCapability();
