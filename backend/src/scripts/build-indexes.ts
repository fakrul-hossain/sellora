import { mysqlClient } from '../models/mysql.client.js';
import { DatabaseIndexManager } from '../models/index.manager.js';
import { logger } from '../utils/logger.js';

async function runIndexBuilder() {
  try {
    await mysqlClient.connect();
    await DatabaseIndexManager.createIndexes();
    logger.info('MySQL database index construction complete.');
    await mysqlClient.disconnect();
    process.exit(0);
  } catch (error) {
    logger.error('Database index construction failed:', error);
    await mysqlClient.disconnect();
    process.exit(1);
  }
}

runIndexBuilder();
