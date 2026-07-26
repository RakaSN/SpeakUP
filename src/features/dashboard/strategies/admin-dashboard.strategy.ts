import { db } from '@/shared/server/db';
import { IDashboardStrategy, DashboardData } from './dashboard.strategy';
import { AiCapabilityType } from '@prisma/client';

export class AdminDashboardStrategy implements IDashboardStrategy {
  async execute(): Promise<DashboardData> {
    const now = new Date();
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    // 1. Parallel Ticket Metrics Query
    const [total, resolved, pending, overdue, recentTickets] = await Promise.all([
      db.ticket.count({ where: { deletedAt: null } }),
      db.ticket.count({
        where: { deletedAt: null, status: { name: { in: ['Resolved', 'Closed'] } } },
      }),
      db.ticket.count({
        where: { deletedAt: null, status: { name: { in: ['Submitted', 'Assigned', 'In Progress'] } } },
      }),
      db.ticket.count({
        where: { deletedAt: null, slaStatus: 'OVERDUE' },
      }),
      db.ticket.findMany({
        where: { deletedAt: null },
        take: 5,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          ticketNumber: true,
          title: true,
          createdAt: true,
          resolvedAt: true,
          targetResolutionAt: true,
          slaStatus: true,
          status: { select: { name: true } },
          priority: { select: { name: true } },
          reporter: { select: { name: true } },
        },
      }),
    ]);

    // 2. Parallel AI Recommendation Counts Query
    const [
      totalRecommendations,
      acceptedCount,
      rejectedCount,
      overriddenCount,
      generatedToday,
      avgConfAggregate,
      latestInsightRecord,
      riskRecords,
    ] = await Promise.all([
      db.aiRecommendation.count({
        where: { capability: { in: [AiCapabilityType.CLASSIFICATION, AiCapabilityType.SUMMARIZATION] } },
      }),
      db.aiRecommendation.count({
        where: { capability: { in: [AiCapabilityType.CLASSIFICATION, AiCapabilityType.SUMMARIZATION] }, userAction: 'ACCEPTED' },
      }),
      db.aiRecommendation.count({
        where: { capability: { in: [AiCapabilityType.CLASSIFICATION, AiCapabilityType.SUMMARIZATION] }, userAction: 'REJECTED' },
      }),
      db.aiRecommendation.count({
        where: { capability: { in: [AiCapabilityType.CLASSIFICATION, AiCapabilityType.SUMMARIZATION] }, userAction: 'OVERRIDDEN' },
      }),
      db.aiRecommendation.count({
        where: { createdAt: { gte: startOfToday } },
      }),
      db.aiRecommendation.aggregate({
        _avg: { confidenceScore: true },
        where: { capability: { in: [AiCapabilityType.CLASSIFICATION, AiCapabilityType.SUMMARIZATION] } },
      }),
      db.aiRecommendation.findFirst({
        where: { capability: AiCapabilityType.TREND_ANALYSIS },
        orderBy: { createdAt: 'desc' },
      }),
      db.aiRecommendation.findMany({
        where: {
          capability: AiCapabilityType.RECOMMENDATION,
          ticketId: { not: null },
        },
        orderBy: { createdAt: 'desc' },
        take: 5,
        include: {
          ticket: { select: { ticketNumber: true, title: true } },
        },
      }),
    ]);

    const processedCount = acceptedCount + rejectedCount + overriddenCount;
    const acceptanceRate = processedCount > 0 ? Math.round((acceptedCount / processedCount) * 100) : 0;
    const overrideRate = processedCount > 0 ? Math.round((overriddenCount / processedCount) * 100) : 0;

    const averageConfidence = avgConfAggregate._avg.confidenceScore
      ? Math.round(avgConfAggregate._avg.confidenceScore * 100) / 100
      : 0;

    // Latest Platform Insight
    let latestInsight: NonNullable<DashboardData['extraWidgets']>['latestInsight'] = undefined;
    if (latestInsightRecord?.recommendationData) {
      const data = latestInsightRecord.recommendationData as Record<string, unknown>;
      latestInsight = {
        id: latestInsightRecord.id,
        topCategories: (data.topCategories as Array<{ name: string; count: number }>) || [],
        delayPatterns: (data.delayPatterns as Array<{ pattern: string; impact: string }>) || [],
        emergingTopics: (data.emergingTopics as string[]) || [],
        recommendations: (data.recommendations as string[]) || [],
        reasoning: (data.reasoning as string) || '',
        datasetSize: (data.datasetSize as number) || 0,
        lifecycleState: (data.lifecycleState as string) || 'GENERATED',
      };
    }

    // Predictive SLA Risk Recommendations
    const predictiveRisks = riskRecords.map((r: typeof riskRecords[number]) => {
      const data = (r.recommendationData as Record<string, unknown>) || {};
      return {
        id: r.id,
        ticketId: r.ticketId!,
        ticketNumber: r.ticket?.ticketNumber || 'TICKET',
        ticketTitle: r.ticket?.title || 'Complaint',
        breachProbability: (data.breachProbability as number) || 0.5,
        riskLevel: (data.riskLevel as string) || 'MEDIUM',
        riskFactors: (data.riskFactors as string[]) || [],
        recommendedActions: (data.recommendedActions as string[]) || [],
        lifecycleState: (data.lifecycleState as string) || 'GENERATED',
      };
    });

    // AI Telemetry Operations Metrics (Last 24h)
    const telemetryLogs = db.aiTelemetryLog
      ? await db.aiTelemetryLog.findMany({
          where: { createdAt: { gte: new Date(Date.now() - 24 * 60 * 60 * 1000) } },
        })
      : [];

    const totalInferences = telemetryLogs.length;
    const totalLatency = telemetryLogs.reduce((acc: number, log: typeof telemetryLogs[number]) => acc + log.durationMs, 0);
    const totalTokens = telemetryLogs.reduce((acc: number, log: typeof telemetryLogs[number]) => acc + log.tokensUsed, 0);
    const totalEstimatedCostUsd = telemetryLogs.reduce((acc: number, log: typeof telemetryLogs[number]) => acc + log.estimatedCost, 0);
    const failedCount = telemetryLogs.filter((log: typeof telemetryLogs[number]) => log.status !== 'SUCCESS').length;

    const errorRatePercentage = totalInferences > 0 ? parseFloat(((failedCount / totalInferences) * 100).toFixed(1)) : 0;
    const averageLatencyMs = totalInferences > 0 ? Math.round(totalLatency / totalInferences) : 0;

    // AI Capability Registry & Model Evaluation in Parallel
    const [aiRegistry, modelEvaluation] = await Promise.all([
      import('@/shared/server/ai/registry/bootstrap-ai')
        .then((m) => m.bootstrapAICapabilities().getRegistryStatus())
        .catch(() => undefined),
      import('@/shared/server/ai/evaluation/ai-model-evaluation.service')
        .then((m) => m.AIModelEvaluationService.getEvaluationSummary())
        .catch(() => undefined),
    ]);

    return {
      roleName: 'Super Admin',
      metrics: { total, resolved, pending, overdue },
      recentTickets: recentTickets as unknown as DashboardData['recentTickets'],
      extraWidgets: {
        aiAdoption: {
          totalRecommendations,
          acceptedCount,
          rejectedCount,
          overriddenCount,
          acceptanceRate,
          overrideRate,
          generatedToday,
        },
        aiQuality: {
          averageConfidence,
        },
        latestInsight,
        predictiveRisks,
        aiTelemetry: {
          totalInferences,
          averageLatencyMs,
          totalTokens,
          totalEstimatedCostUsd: parseFloat(totalEstimatedCostUsd.toFixed(6)),
          errorRatePercentage,
        },
        aiRegistry,
        modelEvaluation,
      },
    };
  }
}
