import { DomainEvent, EventHandler } from './domain-events';
import { appLogger } from '../server/logger/app.logger';

class EventBus {
  private handlers: Record<string, EventHandler<DomainEvent>[]> = {};

  subscribe<T extends DomainEvent['type']>(eventType: T, handler: EventHandler<Extract<DomainEvent, { type: T }>>) {
    if (!this.handlers[eventType]) {
      this.handlers[eventType] = [];
    }
    this.handlers[eventType].push(handler as EventHandler<DomainEvent>);
  }

  async publish(event: DomainEvent) {
    appLogger.debug(`[EventBus] Publishing event: ${event.type}`, event.payload);
    const eventHandlers = this.handlers[event.type] || [];
    
    // Fire and forget pattern agar tidak memblokir thread utama HTTP
    Promise.all(
      eventHandlers.map(async (handler) => {
        try {
          await handler(event);
        } catch (error) {
          appLogger.error(`[EventBus] Error processing event ${event.type}`, error);
        }
      })
    );
  }
}

export const eventBus = new EventBus();
