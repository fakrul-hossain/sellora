import { mongoClient } from '../database/mongo.client.js';
import { InitialDatabaseSeeder } from '../database/seeders/initial-seeder.js';
import { logger } from '../core/utils/logger.js';

async function runSeeder() {
  try {
    await mongoClient.connect();
    await InitialDatabaseSeeder.run();
    logger.info('Database seeding completed successfully.');
    await mongoClient.disconnect();
    process.exit(0);
  } catch (error) {
    logger.error('Database seeding failed:', error);
    await mongoClient.disconnect();
    process.exit(1);
  }
}

runSeeder();
