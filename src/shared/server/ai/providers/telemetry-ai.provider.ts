import { db } from '@/shared/server/db';
import { AIInferenceParams, AIInferenceResponse, AIProvider } from './ai-provider.interface';
import { AiTelemetryStatus } from '@prisma/client';

export class TelemetryAIProvider implements AIProvider {
  constructor(private innerProvider: AIProvider) {}

  get name(): string {
    return `Telemetry[${this.innerProvider.name}]`;
  }

  get modelVersion(): string {
    return this.innerProvider.modelVersion;
  }

  async generateInference(params: AIInferenceParams): Promise<AIInferenceResponse> {
    const startTime = Date.now();
    let status: AiTelemetryStatus = AiTelemetryStatus.SUCCESS;
    let errorMessage: string | undefined = undefined;
    let response: AIInferenceResponse | undefined = undefined;

    try {
      response = await this.innerProvider.generateInference(params);
      return response;
    } catch (err: unknown) {
      status = AiTelemetryStatus.FAILED;
      errorMessage = err instanceof Error ? err.message : String(err);
      if (errorMessage.toLowerCase().includes('rate limit') || errorMessage.includes('429')) {
        status = AiTelemetryStatus.RATE_LIMITED;
      } else if (errorMessage.toLowerCase().includes('timeout') || errorMessage.includes('504')) {
        status = AiTelemetryStatus.TIMEOUT;
      }
      throw err;
    } finally {
      const durationMs = Date.now() - startTime;
      const tokensUsed = response?.tokensUsed || 0;
      // Estimated cost calculation: Gemini Flash approx $0.075 / 1M input + $0.30 / 1M output => avg ~$0.0000002 / token
      const estimatedCost = tokensUsed * 0.0000002;

      try {
        if (db.aiTelemetryLog) {
          await db.aiTelemetryLog.create({
            data: {
              capability: params.capabilityId ?? null,
              modelName: response?.modelName || this.innerProvider.modelVersion,
              promptVersion: response?.promptVersion || 'v1.0',
              tokensUsed,
              durationMs,
              estimatedCost,
              status,
              errorMessage,
            },
          });
        }

      } catch (logErr) {
        // Telemetry logging should never crash the main AI flow
        console.error('[TelemetryAIProvider] Failed to persist AI telemetry log:', logErr);
      }
    }
  }
}
