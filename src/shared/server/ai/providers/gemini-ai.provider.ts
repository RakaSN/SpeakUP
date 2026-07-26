import { AIInferenceParams, AIInferenceResponse, AIProvider } from './ai-provider.interface';

export class GeminiAIProvider implements AIProvider {
  readonly name = 'GeminiAIProvider';
  readonly modelVersion = 'gemini-1.5-flash';

  private apiKey: string | undefined;

  constructor(apiKey?: string) {
    this.apiKey = apiKey || process.env.GEMINI_API_KEY;
  }

  async generateInference(params: AIInferenceParams): Promise<AIInferenceResponse> {
    const start = Date.now();

    if (!this.apiKey) {
      console.warn('[GeminiAIProvider] GEMINI_API_KEY not configured. Falling back to Mock Provider output.');
      const { defaultAIProvider } = await import('./mock-ai.provider');
      return defaultAIProvider.generateInference(params);
    }

    try {
      // HTTP call to Google Gemini REST API
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${this.modelVersion}:generateContent?key=${this.apiKey}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [
              {
                parts: [
                  { text: `${params.systemPrompt}\n\nUSER INPUT:\n${params.userPrompt}` },
                ],
              },
            ],
            generationConfig: {
              temperature: params.temperature ?? 0.2,
              responseMimeType: params.responseFormat === 'json' ? 'application/json' : 'text/plain',
            },
          }),
        }
      );

      const data = await response.json();
      const durationMs = Date.now() - start;

      const rawOutput = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
      let parsedJson: Record<string, unknown> | undefined = undefined;

      if (params.responseFormat === 'json' && rawOutput) {
        try {
          parsedJson = JSON.parse(rawOutput);
        } catch {
          console.warn('[GeminiAIProvider] Failed to parse JSON response from Gemini API.');
        }
      }

      return {
        rawOutput,
        parsedJson,
        modelName: this.modelVersion,
        promptVersion: 'v1.0',
        tokensUsed: data.usageMetadata?.totalTokenCount || 0,
        durationMs,
      };
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      console.error(`[GeminiAIProvider] API request failed: ${msg}`);
      throw new Error(`Gemini AI Inference failed: ${msg}`);
    }
  }
}
