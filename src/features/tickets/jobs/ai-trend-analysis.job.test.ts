import { describe, it, expect, vi, beforeEach } from 'vitest';
import { AITrendAnalysisJob } from './ai-trend-analysis.job';
import { db } from '@/shared/server/db';
import { AiCapabilityType } from '@prisma/client';

vi.mock('@/shared/server/db', () => ({
  db: {
    aiRecommendation: {
      findFirst: vi.fn(),
      create: vi.fn(),
    },
    ticket: {
      findMany: vi.fn().mockResolvedValue([]),
    },
  },
}));

describe('AITrendAnalysisJob', () => {
  let job: AITrendAnalysisJob;

  beforeEach(() => {
    vi.clearAllMocks();
    job = new AITrendAnalysisJob();
  });

  it('should generate a new trend analysis snapshot if none exists for today', async () => {
    vi.mocked(db.aiRecommendation.findFirst).mockResolvedValue(null);
    vi.mocked(db.aiRecommendation.create).mockResolvedValue({
      id: 'mock-rec-id-123',
      ticketId: null,
      capability: AiCapabilityType.TREND_ANALYSIS,
      modelName: 'mock-ai-v1',
      promptVersion: 'v1.0',
      confidenceScore: 0.9,
      recommendationData: {},
      userAction: 'ACCEPTED',
      actionReason: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const result = await job.execute({ trigger: 'SCHEDULER' });

    expect(result.success).toBe(true);
    expect(result.metadata?.skipped).toBeUndefined();
    expect(result.metadata?.recommendationId).toBe('mock-rec-id-123');
    expect(db.aiRecommendation.create).toHaveBeenCalledOnce();
  });

  it('should skip execution if a snapshot already exists for today (Idempotency)', async () => {
    vi.mocked(db.aiRecommendation.findFirst).mockResolvedValue({
      id: 'existing-snapshot-id',
      ticketId: null,
      capability: AiCapabilityType.TREND_ANALYSIS,
      modelName: 'mock-ai-v1',
      promptVersion: 'v1.0',
      confidenceScore: 0.9,
      recommendationData: {},
      userAction: 'ACCEPTED',
      actionReason: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const result = await job.execute({ trigger: 'SCHEDULER' });

    expect(result.success).toBe(true);
    expect(result.metadata?.skipped).toBe(true);
    expect(result.metadata?.existingSnapshotId).toBe('existing-snapshot-id');
    expect(db.aiRecommendation.create).not.toHaveBeenCalled();
  });

  it('should run and generate snapshot if forced even if snapshot exists', async () => {
    vi.mocked(db.aiRecommendation.findFirst).mockResolvedValue({
      id: 'existing-snapshot-id',
      ticketId: null,
      capability: AiCapabilityType.TREND_ANALYSIS,
      modelName: 'mock-ai-v1',
      promptVersion: 'v1.0',
      confidenceScore: 0.9,
      recommendationData: {},
      userAction: 'ACCEPTED',
      actionReason: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    vi.mocked(db.aiRecommendation.create).mockResolvedValue({
      id: 'new-forced-rec-id',
      ticketId: null,
      capability: AiCapabilityType.TREND_ANALYSIS,
      modelName: 'mock-ai-v1',
      promptVersion: 'v1.0',
      confidenceScore: 0.9,
      recommendationData: {},
      userAction: 'ACCEPTED',
      actionReason: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const result = await job.execute({ trigger: 'MANUAL', metadata: { force: true } });

    expect(result.success).toBe(true);
    expect(result.metadata?.skipped).toBeUndefined();
    expect(result.metadata?.recommendationId).toBe('new-forced-rec-id');
    expect(db.aiRecommendation.create).toHaveBeenCalledOnce();
  });
});
