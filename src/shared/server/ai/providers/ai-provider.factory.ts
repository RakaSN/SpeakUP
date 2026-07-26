import { AIProvider } from './ai-provider.interface';
import { GeminiAIProvider } from './gemini-ai.provider';
import { defaultAIProvider as mockAIProvider } from './mock-ai.provider';
import { TelemetryAIProvider } from './telemetry-ai.provider';

export class AIProviderFactory {
  private static telemetryProviderInstance: AIProvider | null = null;

  static getProvider(): AIProvider {
    if (!this.telemetryProviderInstance) {
      const apiKey = process.env.GEMINI_API_KEY;
      const baseProvider: AIProvider = apiKey ? new GeminiAIProvider(apiKey) : mockAIProvider;
      this.telemetryProviderInstance = new TelemetryAIProvider(baseProvider);
    }
    return this.telemetryProviderInstance;
  }
}
