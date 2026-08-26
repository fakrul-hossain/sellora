import { PoolConnection } from 'mysql2/promise';
import { mysqlClient } from './mysql.client.js';
import { logger } from '../utils/logger.js';

export class TransactionManager {
  public static async execute<T>(callback: (connection: PoolConnection) => Promise<T>): Promise<T> {
    const connection = await mysqlClient.getConnection();
    try {
      await connection.beginTransaction();
      const result = await callback(connection);
      await connection.commit();
      return result;
    } catch (error) {
      await connection.rollback();
      logger.error('Transaction rolled back due to error:', error);
      throw error;
    } finally {
      connection.release();
    }
  }
}
