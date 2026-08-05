import { IQueueProvider } from './queue.provider.js';
import { logger } from '../utils/logger.js';

export class MemoryQueueProvider implements IQueueProvider {
  private handlers: Map<string, (data: any) => Promise<void>> = new Map();

  public async addJob<T>(queueName: string, jobName: string, data: T): Promise<void> {
    logger.info(`[Queue: ${queueName}] Added Job: ${jobName}`);
    const handler = this.handlers.get(queueName);
    if (handler) {
      setImmediate(async () => {
        try {
          await handler(data);
        } catch (err) {
          logger.error(`[Queue: ${queueName}] Job execution error:`, err);
        }
      });
    }
  }

  public processJobs<T>(queueName: string, handler: (data: T) => Promise<void>): void {
    this.handlers.set(queueName, handler);
    logger.info(`[Queue: ${queueName}] Registered job worker handler`);
  }
}

export const queueProvider: IQueueProvider = new MemoryQueueProvider();
