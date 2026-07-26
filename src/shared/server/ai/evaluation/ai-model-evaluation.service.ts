import { db } from '@/shared/server/db';
import { AiCapabilityType } from '@prisma/client';

export interface ConfidenceBucket {
  rangeLabel: string;
  minConfidence: number;
  maxConfidence: number;
  totalCount: number;
  acceptedCount: number;
  acceptanceRatePercentage: number;
}

export interface AIModelEvaluationSummary {
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
    confidenceCalibrationBuckets: ConfidenceBucket[];
  };
  productivity: {
    averageTimeToAcceptSeconds: number;
    formattedTimeToAccept: string;
  };
}

export class AIModelEvaluationService {
  static async getEvaluationSummary(capabilityType?: AiCapabilityType): Promise<AIModelEvaluationSummary> {
    const whereClause = capabilityType ? { capability: capabilityType } : {};

    const recommendations = await db.aiRecommendation.findMany({
      where: whereClause,
      select: {
        id: true,
        capability: true,
        confidenceScore: true,
        userAction: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    const totalGenerated = recommendations.length;

    let acceptedCount = 0;
    let overriddenCount = 0;
    let rejectedCount = 0;
    let pendingCount = 0;
    let sumConfidence = 0;

    let totalTimeToAcceptMs = 0;
    let timeToAcceptSampleCount = 0;

    // Define 5 Calibration Buckets: 0-20%, 21-40%, 41-60%, 61-80%, 81-100%
    const bucketsConfig = [
      { rangeLabel: '0–20%', min: 0.0, max: 0.2 },
      { rangeLabel: '21–40%', min: 0.21, max: 0.4 },
      { rangeLabel: '41–60%', min: 0.41, max: 0.6 },
      { rangeLabel: '61–80%', min: 0.61, max: 0.8 },
      { rangeLabel: '81–100%', min: 0.81, max: 1.0 },
    ];

    const bucketsMap = bucketsConfig.map((b) => ({
      rangeLabel: b.rangeLabel,
      minConfidence: b.min,
      maxConfidence: b.max,
      totalCount: 0,
      acceptedCount: 0,
    }));

    for (const rec of recommendations) {
      sumConfidence += rec.confidenceScore;

      if (rec.userAction === 'ACCEPTED') acceptedCount++;
      else if (rec.userAction === 'OVERRIDDEN') overriddenCount++;
      else if (rec.userAction === 'REJECTED') rejectedCount++;
      else pendingCount++;

      // Calibration Buckets logic
      const score = rec.confidenceScore;
      const targetBucket = bucketsMap.find((b) => score >= b.minConfidence && score <= b.maxConfidence) || bucketsMap[bucketsMap.length - 1];
      targetBucket.totalCount++;
      if (rec.userAction === 'ACCEPTED') {
        targetBucket.acceptedCount++;
      }

      // Time to Accept Calculation for processed recommendations
      if (rec.userAction !== 'PENDING' && rec.updatedAt) {
        const elapsed = rec.updatedAt.getTime() - rec.createdAt.getTime();
        if (elapsed >= 0) {
          totalTimeToAcceptMs += elapsed;
          timeToAcceptSampleCount++;
        }
      }
    }

    const processedCount = acceptedCount + overriddenCount + rejectedCount;
    const acceptanceRatePercentage = processedCount > 0 ? parseFloat(((acceptedCount / processedCount) * 100).toFixed(1)) : 0;
    const overrideRatePercentage = processedCount > 0 ? parseFloat(((overriddenCount / processedCount) * 100).toFixed(1)) : 0;
    const rejectionRatePercentage = processedCount > 0 ? parseFloat(((rejectedCount / processedCount) * 100).toFixed(1)) : 0;

    // Estimated Operational Precision = Accepted / (Accepted + Overridden + Rejected)
    const estimatedOperationalPrecisionPercentage = acceptanceRatePercentage;

    const averageConfidenceScore = totalGenerated > 0 ? parseFloat((sumConfidence / totalGenerated).toFixed(2)) : 0;

    const confidenceCalibrationBuckets: ConfidenceBucket[] = bucketsMap.map((b) => ({
      rangeLabel: b.rangeLabel,
      minConfidence: b.minConfidence,
      maxConfidence: b.maxConfidence,
      totalCount: b.totalCount,
      acceptedCount: b.acceptedCount,
      acceptanceRatePercentage: b.totalCount > 0 ? parseFloat(((b.acceptedCount / b.totalCount) * 100).toFixed(1)) : 0,
    }));

    const avgSeconds = timeToAcceptSampleCount > 0 ? Math.round(totalTimeToAcceptMs / timeToAcceptSampleCount / 1000) : 0;
    const minutes = Math.floor(avgSeconds / 60);
    const remainingSeconds = avgSeconds % 60;
    const formattedTimeToAccept = minutes > 0 ? `${minutes}m ${remainingSeconds}s` : `${remainingSeconds}s`;

    return {
      adoption: {
        totalGenerated,
        acceptedCount,
        overriddenCount,
        rejectedCount,
        pendingCount,
        acceptanceRatePercentage,
        overrideRatePercentage,
        rejectionRatePercentage,
      },
      quality: {
        estimatedOperationalPrecisionPercentage,
        averageConfidenceScore,
        confidenceCalibrationBuckets,
      },
      productivity: {
        averageTimeToAcceptSeconds: avgSeconds,
        formattedTimeToAccept,
      },
    };
  }
}
