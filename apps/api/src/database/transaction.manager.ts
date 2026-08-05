import { ClientSession } from 'mongodb';
import { mongoClient } from './mongo.client.js';
import { logger } from '../core/utils/logger.js';

export class TransactionManager {
  public static async execute<T>(fn: (session: ClientSession) => Promise<T>): Promise<T> {
    const session = mongoClient.startSession();
    session.startTransaction();
    try {
      const result = await fn(session);
      await session.commitTransaction();
      return result;
    } catch (error) {
      logger.error('Transaction failed, aborting session modifications:', error);
      await session.abortTransaction();
      throw error;
    } finally {
      await session.endSession();
    }
  }
}
