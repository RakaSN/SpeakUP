export interface DashboardData {
  roleName: string;
  metrics: {
    total: number;
    resolved: number;
    pending: number;
    overdue?: number;
  };
  recentTickets: Record<string, unknown>[];
  extraWidgets?: {
    aiAdoption?: {
      totalRecommendations: number;
      acceptedCount: number;
      rejectedCount: number;
      overriddenCount: number;
      acceptanceRate: number; // Accepted / (Accepted + Rejected + Overridden)
      overrideRate: number; // Overridden / (Accepted + Rejected + Overridden)
      generatedToday: number;
    };
    aiQuality?: {
      averageConfidence: number;
    };
    latestInsight?: {
      id?: string;
      topCategories: Array<{ name: string; count: number }>;
      delayPatterns: Array<{ pattern: string; impact: string }>;
      emergingTopics: string[];
      recommendations: string[];
      reasoning: string;
      datasetSize: number;
      lifecycleState?: string;
    };
    predictiveRisks?: Array<{
      id: string;
      ticketId: string;
      ticketNumber: string;
      ticketTitle: string;
      breachProbability: number;
      riskLevel: string;
      riskFactors: string[];
      recommendedActions: string[];
      lifecycleState: string;
    }>;
    aiTelemetry?: {
      totalInferences: number;
      averageLatencyMs: number;
      totalTokens: number;
      totalEstimatedCostUsd: number;
      errorRatePercentage: number;
    };
    aiRegistry?: Array<{
      capabilityId: string;
      name: string;
      description: string;
      version: string;
      providerName: string;
      promptId: string;
      enabled: boolean;
      tags: string[];
      lifecycleState?: string;
      dependencies?: string[];
      health: {
        status: string;
        latencyMs: number;
        providerReachable: boolean;
        message?: string;
      };
    }>;
    modelEvaluation?: {
      adoption: {
        totalGenerated: number;
        acceptedCount: number;
        overriddenCount: number;
        rejectedCount: number;
        pendingCount: number;
        acceptanceRatePercentage: number;
        overrideRatePercentage: number;
        rejectionRatePercentage: number;
      };
      quality: {
        estimatedOperationalPrecisionPercentage: number;
        averageConfidenceScore: number;
        confidenceCalibrationBuckets: Array<{
          rangeLabel: string;
          totalCount: number;
          acceptedCount: number;
          acceptanceRatePercentage: number;
        }>;
      };
      productivity: {
        averageTimeToAcceptSeconds: number;
        formattedTimeToAccept: string;
      };
    };
    [key: string]: unknown;
  };
}




export interface IDashboardStrategy {
  execute(userId: string): Promise<DashboardData>;
}
