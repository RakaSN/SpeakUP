import { AiCapabilityType } from '@prisma/client';
import { AICapability, AICapabilityMetadata, CapabilityHealth } from './ai-capability.interface';

export class AICapabilityRegistry {
  private static instance: AICapabilityRegistry | null = null;
  private capabilities: Map<AiCapabilityType, AICapability<any, any>> = new Map();

  private constructor() {}

  static getInstance(): AICapabilityRegistry {
    if (!this.instance) {
      this.instance = new AICapabilityRegistry();
    }
    return this.instance;
  }

  register(capability: AICapability<any, any>): void {
    this.capabilities.set(capability.metadata.capabilityId, capability);
  }

  unregister(type: AiCapabilityType): boolean {
    return this.capabilities.delete(type);
  }

  has(type: AiCapabilityType): boolean {
    return this.capabilities.has(type);
  }

  get<TInput, TOutput>(type: AiCapabilityType): AICapability<TInput, TOutput> {
    const cap = this.capabilities.get(type);
    if (!cap) {
      throw new Error(`[AICapabilityRegistry] Capability ${type} is not registered.`);
    }
    if (!cap.metadata.enabled) {
      throw new Error(`[AICapabilityRegistry] Capability ${type} is currently disabled.`);
    }
    return cap as AICapability<TInput, TOutput>;
  }

  getAll(): AICapability<any, any>[] {
    return Array.from(this.capabilities.values());
  }

  async getRegistryStatus(): Promise<Array<AICapabilityMetadata & { health: CapabilityHealth }>> {
    const results: Array<AICapabilityMetadata & { health: CapabilityHealth }> = [];

    for (const cap of this.capabilities.values()) {
      let health: CapabilityHealth;
      try {
        health = await cap.checkHealth();
      } catch (err: unknown) {
        health = {
          status: 'UNAVAILABLE',
          latencyMs: 0,
          providerReachable: false,
          message: err instanceof Error ? err.message : String(err),
        };
      }

      results.push({
        ...cap.metadata,
        health,
      });
    }

    return results;
  }
}
