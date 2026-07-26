import { describe, it, expect, vi, beforeEach } from 'vitest';
import { AIPredictiveRiskJob } from './ai-predictive-risk.job';
import { db } from '@/shared/server/db';
import { AiCapabilityType } from '@prisma/client';

vi.mock('@/shared/server/db', () => ({
  db: {
    ticket: {
      findMany: vi.fn(),
      findUnique: vi.fn(),
    },
    aiRecommendation: {
      create: vi.fn(),
    },
  },
}));

describe('AIPredictiveRiskJob', () => {
  let job: AIPredictiveRiskJob;

  beforeEach(() => {
    vi.clearAllMocks();
    job = new AIPredictiveRiskJob();
  });

  it('should scan active unresolved tickets and predict SLA risk', async () => {
    const mockTicket = {
      id: 'ticket-1',
      ticketNumber: 'TCK-001',
      title: 'Fasilitas Rusak',
      description: 'Lampu kelas padam',
      createdAt: new Date(),
      targetResolutionAt: new Date(Date.now() + 2 * 3600 * 1000),
      slaStatus: 'ON_TRACK',
      slaHours: 24,
      category: { name: 'Fasilitas' },
      priority: { name: 'High' },
      status: { name: 'In Progress' },
      assignments: [],
    };

    vi.mocked(db.ticket.findMany).mockResolvedValue([mockTicket as any]);
    vi.mocked(db.ticket.findUnique).mockResolvedValue(mockTicket as any);
    vi.mocked(db.aiRecommendation.create).mockResolvedValue({
      id: 'rec-risk-1',
      ticketId: 'ticket-1',
      capability: AiCapabilityType.RECOMMENDATION,
      modelName: 'mock-ai-v1',
      promptVersion: 'v1.0',
      confidenceScore: 0.88,
      recommendationData: { breachProbability: 0.75, riskLevel: 'HIGH', lifecycleState: 'GENERATED' },
      userAction: 'PENDING',
      actionReason: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const result = await job.execute({ jobCode: 'ai-predictive-risk-job', trigger: 'CRON' });

    expect(result.success).toBe(true);
    expect(result.metadata?.processedCount).toBe(1);
    expect(db.aiRecommendation.create).toHaveBeenCalledOnce();
  });
});
