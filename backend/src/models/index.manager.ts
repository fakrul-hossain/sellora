import { mysqlClient } from './mysql.client.js';
import { logger } from '../utils/logger.js';

export class DatabaseIndexManager {
  public static async createIndexes(): Promise<void> {
    logger.info('Verifying database indexes...');
    const pool = mysqlClient.getPool();

    const indexes = [
      'CREATE INDEX IF NOT EXISTS idx_products_title ON products(title);',
      'CREATE INDEX IF NOT EXISTS idx_products_brand ON products(brand);',
      'CREATE INDEX IF NOT EXISTS idx_orders_created ON orders(created_at);',
    ];

    for (const sql of indexes) {
      try {
        await pool.query(sql);
      } catch (err: any) {
        logger.warn(`Index statement skipped or already exists: ${err.message}`);
      }
    }
  }
}
