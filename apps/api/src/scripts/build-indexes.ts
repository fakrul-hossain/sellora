import { mongoClient } from '../database/mongo.client.js';
import { DatabaseIndexManager } from '../database/index.manager.js';
import { logger } from '../core/utils/logger.js';

async function runIndexBuilder() {
  try {
    await mongoClient.connect();
    await DatabaseIndexManager.createIndexes();
    logger.info('Database index construction complete.');
    await mongoClient.disconnect();
    process.exit(0);
  } catch (error) {
    logger.error('Database index construction failed:', error);
    await mongoClient.disconnect();
    process.exit(1);
  }
}

runIndexBuilder();
