import { AIInferenceParams, AIInferenceResponse, AIProvider } from './ai-provider.interface';

export class MockAIProvider implements AIProvider {
  readonly name = 'MockAIProvider';
  readonly modelVersion = 'mock-v1.0-deterministic';

  async generateInference(params: AIInferenceParams): Promise<AIInferenceResponse> {
    const start = Date.now();
    const isClassification = params.systemPrompt.includes('CLASSIFY') || params.userPrompt.toLowerCase().includes('kategori');
    
    let mockJson: Record<string, unknown> = {};

    if (isClassification) {
      mockJson = {
        suggestedCategoryName: 'Sarana & Prasarana',
        suggestedPriorityName: 'Medium',
        confidenceScore: 0.88,
        reasoning: 'Deskripsi pengaduan menyebutkan kerusakan fasilitas fisik sekolah (AC/Meja) yang memerlukan perbaikan standar.',
      };
    } else {
      mockJson = {
        summaryText: 'Pelapor menyampaikan keluhan mengenai fasilitas sekolah yang memerlukan perhatian pihak sarpras.',
        keyPoints: ['Masalah terdeteksi pada fasilitas fisik', 'Memerlukan koordinasi tim sarpras', 'SLA penanganan diperkirakan 24-48 jam'],
        sentiment: 'NEUTRAL',
        reasoning: 'Teks berfokus pada pelaporan masalah teknis tanpa indikasi eskalasi emosional tinggi.',
      };
    }

    const durationMs = Date.now() - start;

    return {
      rawOutput: JSON.stringify(mockJson),
      parsedJson: mockJson,
      modelName: this.modelVersion,
      promptVersion: 'v1.0',
      tokensUsed: 120,
      durationMs,
    };
  }
}

export const defaultAIProvider = new MockAIProvider();
