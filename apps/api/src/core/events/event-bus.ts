import { EventEmitter } from 'events';
import { IDomainEvent, IEventHandler } from './domain-event.interface.js';
import { logger } from '../utils/logger.js';

export class EventBus {
  private static instance: EventBus;
  private emitter: EventEmitter;

  private constructor() {
    this.emitter = new EventEmitter();
    this.emitter.setMaxListeners(50);
  }

  public static getInstance(): EventBus {
    if (!EventBus.instance) {
      EventBus.instance = new EventBus();
    }
    return EventBus.instance;
  }

  public subscribe<T>(eventType: string, handler: IEventHandler<T>): void {
    this.emitter.on(eventType, async (event: IDomainEvent<T>) => {
      try {
        logger.info(`Processing Event [${event.eventType}] ID: ${event.eventId}`);
        await handler.handle(event);
      } catch (error) {
        logger.error(`Error processing Event [${event.eventType}] ID: ${event.eventId}:`, error);
      }
    });
  }

  public async publish<T>(event: IDomainEvent<T>): Promise<void> {
    logger.info(`Publishing Event [${event.eventType}] ID: ${event.eventId}`);
    this.emitter.emit(event.eventType, event);
  }
}

export const eventBus = EventBus.getInstance();
