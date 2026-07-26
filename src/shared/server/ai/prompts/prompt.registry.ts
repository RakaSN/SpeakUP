import { AiCapabilityType } from '@prisma/client';

export interface PromptDefinition {
  id: string;
  version: string;
  capability: AiCapabilityType;
  systemPrompt: string;
}

const promptDefinitions: Record<string, PromptDefinition> = {
  'CLASSIFICATION_v1': {
    id: 'ticket-classification',
    version: 'v1.0',
    capability: AiCapabilityType.CLASSIFICATION,
    systemPrompt: `SYSTEM INSTRUCTION: You are an AI Classifier for a Digital Complaint System in SMKS Kampung Jawa.
TASK: CLASSIFY the ticket into the most suitable Category and Priority based on the title and description.

OUTPUT FORMAT: Strict JSON only:
{
  "suggestedCategoryName": "string",
  "suggestedPriorityName": "string",
  "confidenceScore": float between 0.0 and 1.0,
  "reasoning": "Explain in Indonesian language WHY this classification was chosen."
}`,
  },

  'SUMMARIZATION_v1': {
    id: 'ticket-summary',
    version: 'v1.0',
    capability: AiCapabilityType.SUMMARIZATION,
    systemPrompt: `SYSTEM INSTRUCTION: You are an AI Summarizer for a Digital Complaint System in SMKS Kampung Jawa.
TASK: SUMMARIZE the provided complaint chronology into a concise executive summary with key points, sentiment analysis, and rationale.

OUTPUT FORMAT: Strict JSON only:
{
  "summaryText": "Concise summary in Indonesian language (1-2 sentences)",
  "keyPoints": ["point 1", "point 2", "point 3"],
  "sentiment": "POSITIVE" | "NEUTRAL" | "NEGATIVE" | "URGENT",
  "reasoning": "Explain in Indonesian language WHY this summary and sentiment were produced."
}`,
  },

  'TREND_ANALYSIS_v1': {
    id: 'ticket-trend-analysis',
    version: 'v1.0',
    capability: AiCapabilityType.TREND_ANALYSIS,
    systemPrompt: `SYSTEM INSTRUCTION: You are an AI Analytics Engine for a Digital Complaint System in SMKS Kampung Jawa (SpeakUp).
TASK: Analyze aggregate complaint statistics and ticket chronologies from the given period. Identify top categories, delay patterns, emerging topics (e.g. bullying/perundungan trends), and actionable intervention recommendations.

OUTPUT FORMAT: Strict JSON only matching:
{
  "topCategories": [{"name": "string", "count": number}],
  "delayPatterns": [{"pattern": "string", "impact": "HIGH" | "MEDIUM" | "LOW"}],
  "emergingTopics": ["string"],
  "recommendations": ["string"],
  "confidenceScore": float between 0.0 and 1.0,
  "reasoning": "Executive summary in Indonesian of the platform trends"
}`,
  },

  'RISK_PREDICTION_v1': {
    id: 'ticket-risk-prediction',
    version: 'v1.0',
    capability: AiCapabilityType.RECOMMENDATION,
    systemPrompt: `SYSTEM INSTRUCTION: You are an AI Predictive Risk Engine for SpeakUp (SMKS Kampung Jawa).
TASK: Analyze an active ticket's details, SLA targets, elapsed time, and assignment state. Predict SLA breach probability, identify risk factors, and suggest early mitigation actions for officers.

OUTPUT FORMAT: Strict JSON only:
{
  "breachProbability": float between 0.0 and 1.0,
  "riskLevel": "CRITICAL" | "HIGH" | "MEDIUM" | "LOW",
  "riskFactors": ["string"],
  "recommendedActions": ["string"],
  "confidenceScore": float between 0.0 and 1.0,
  "reasoning": "Indonesian rationale for the predictive risk evaluation"
}`,
  },
};

export const PromptRegistry = {
  /**
   * Get active prompt definition for a specific AI Capability.
   * Business capabilities don't hardcode prompt versions; the Registry resolves the active version.
   */
  getActivePrompt(capability: AiCapabilityType): PromptDefinition {
    switch (capability) {
      case AiCapabilityType.CLASSIFICATION:
        return promptDefinitions['CLASSIFICATION_v1'];
      case AiCapabilityType.SUMMARIZATION:
        return promptDefinitions['SUMMARIZATION_v1'];
      case AiCapabilityType.TREND_ANALYSIS:
        return promptDefinitions['TREND_ANALYSIS_v1'];
      case AiCapabilityType.RECOMMENDATION:
        return promptDefinitions['RISK_PREDICTION_v1'];
      default:
        throw new Error(`[PromptRegistry] No active prompt definition registered for capability '${capability}'.`);
    }
  },

  /**
   * Get a specific prompt by ID and version.
   */
  get(id: string, version: string): PromptDefinition | undefined {
    return Object.values(promptDefinitions).find(
      (p) => p.id === id && p.version === version
    );
  },
};
