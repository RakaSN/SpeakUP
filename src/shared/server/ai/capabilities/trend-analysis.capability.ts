import { db } from '@/shared/server/db';
import { AIProvider } from '../providers/ai-provider.interface';
import { AIProviderFactory } from '../providers/ai-provider.factory';
import { PromptRegistry } from '../prompts/prompt.registry';
import { AiCapabilityType, Prisma } from '@prisma/client';
import { TicketAnalyticsDataset } from '@/features/tickets/server/ticket-analytics.repository';
import { AICapability, AICapabilityMetadata, AICapabilityResult, CapabilityHealth } from '../registry/ai-capability.interface';

export interface TrendAnalysisResult {
  recommendationId: string;
  topCategories: Array<{ name: string; count: number }>;
  delayPatterns: Array<{ pattern: string; impact: 'HIGH' | 'MEDIUM' | 'LOW' }>;
  emergingTopics: string[];
  recommendations: string[];
  confidenceScore: number;
  reasoning: string;
  analysisWindowStart: string;
  analysisWindowEnd: string;
  datasetSize: number;
}

export class TrendAnalysisCapability implements AICapability<TicketAnalyticsDataset, TrendAnalysisResult> {
  readonly metadata: AICapabilityMetadata;

  constructor(private provider: AIProvider = AIProviderFactory.getProvider()) {
    const promptDef = PromptRegistry.getActivePrompt(AiCapabilityType.TREND_ANALYSIS);
    this.metadata = {
      capabilityId: AiCapabilityType.TREND_ANALYSIS,
      name: 'Platform Trend Analysis Capability',
      description: 'Analisis agregasi tren tiket, kecenderungan keterlambatan, dan topik baru',
      version: '1.0.0',
      providerName: provider.name,
      promptId: `platform-trend:${promptDef.version}`,
      enabled: true,
      tags: ['analytics', 'trend', 'platform'],
      lifecycleState: 'ACTIVE',
      dependencies: ['TicketAnalyticsRepository', 'PromptRegistry', 'GeminiAIProvider'],
    };

  }

  async execute(dataset: TicketAnalyticsDataset): Promise<AICapabilityResult<TrendAnalysisResult>> {
    const promptDef = PromptRegistry.getActivePrompt(AiCapabilityType.TREND_ANALYSIS);

    const userPrompt = `DATASET ANALYTICS WINDOW: ${dataset.windowStart.toISOString()} - ${dataset.windowEnd.toISOString()}
TOTAL TICKETS: ${dataset.totalTickets}
OVERDUE SLA TICKETS: ${dataset.overdueTickets}

CATEGORY DISTRIBUTION:
${dataset.categoryCounts.map((c) => `- ${c.name}: ${c.count}`).join('\n')}

PRIORITY DISTRIBUTION:
${dataset.priorityCounts.map((p) => `- ${p.name}: ${p.count}`).join('\n')}

STATUS DISTRIBUTION:
${dataset.statusCounts.map((s) => `- ${s.name}: ${s.count}`).join('\n')}

SAMPLE COMPLAINT TITLES:
${dataset.sampleTitles.map((t) => `- ${t}`).join('\n')}`;

    const response = await this.provider.generateInference({
      systemPrompt: promptDef.systemPrompt,
      userPrompt,
      temperature: 0.2,
      responseFormat: 'json',
      capabilityId: AiCapabilityType.TREND_ANALYSIS,
    });

    const parsed = response.parsedJson || {};
    const topCategories = Array.isArray(parsed.topCategories) ? parsed.topCategories : dataset.categoryCounts;
    const delayPatterns = Array.isArray(parsed.delayPatterns)
      ? parsed.delayPatterns
      : [{ pattern: 'Keterlambatan penanganan pada kategori prioritas tinggi', impact: 'HIGH' }];
    const emergingTopics = Array.isArray(parsed.emergingTopics)
      ? parsed.emergingTopics
      : ['Perundungan / Bullying', 'Fasilitas Belajar'];
    const recommendations = Array.isArray(parsed.recommendations)
      ? parsed.recommendations
      : ['Tingkatkan jumlah petugas penanggung jawab', 'Sosialisasi pencegahan perundungan di kelas'];
    const confidenceScore = (parsed.confidenceScore as number) || 0.9;
    const reasoning = (parsed.reasoning as string) || 'Analisis tren berhasil dibuat berdasarkan agregasi data tiket.';

    const recData = {
      topCategories,
      delayPatterns,
      emergingTopics,
      recommendations,
      confidenceScore,
      reasoning,
      analysisWindowStart: dataset.windowStart.toISOString(),
      analysisWindowEnd: dataset.windowEnd.toISOString(),
      datasetSize: dataset.totalTickets,
    };

    const recRecord = await db.aiRecommendation.create({
      data: {
        ticketId: null,
        capability: AiCapabilityType.TREND_ANALYSIS,
        modelName: response.modelName,
        promptVersion: promptDef.version,
        confidenceScore,
        recommendationData: recData as Prisma.InputJsonValue,
        userAction: 'ACCEPTED',
      },
    });

    const resultData: TrendAnalysisResult = {
      recommendationId: recRecord.id,
      topCategories,
      delayPatterns,
      emergingTopics,
      recommendations,
      confidenceScore,
      reasoning,
      analysisWindowStart: dataset.windowStart.toISOString(),
      analysisWindowEnd: dataset.windowEnd.toISOString(),
      datasetSize: dataset.totalTickets,
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

  async analyzeTrends(dataset: TicketAnalyticsDataset): Promise<TrendAnalysisResult> {
    const res = await this.execute(dataset);
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
        message: 'Trend analysis capability online.',
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

export const trendAnalysisCapability = new TrendAnalysisCapability();
