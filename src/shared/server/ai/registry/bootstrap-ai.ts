import { AICapabilityRegistry } from './ai-capability.registry';
import { classificationCapability } from '../capabilities/classification.capability';
import { summarizationCapability } from '../capabilities/summarization.capability';
import { trendAnalysisCapability } from '../capabilities/trend-analysis.capability';
import { riskPredictionCapability } from '../capabilities/risk-prediction.capability';

let isBootstrapped = false;

export function bootstrapAICapabilities(): AICapabilityRegistry {
  const registry = AICapabilityRegistry.getInstance();

  if (!isBootstrapped) {
    registry.register(classificationCapability);
    registry.register(summarizationCapability);
    registry.register(trendAnalysisCapability);
    registry.register(riskPredictionCapability);
    isBootstrapped = true;
  }

  return registry;
}
