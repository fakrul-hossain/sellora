import http from 'http';
import { env } from './config/env.config.js';
import { createApp } from './app.js';
import { mongoClient } from './database/mongo.client.js';
import { DatabaseIndexManager } from './database/index.manager.js';
import { logger } from './core/utils/logger.js';

async function bootstrapServer() {
  try {
    logger.info('Bootstrapping SELLORA Enterprise API Server...');

    // Initialize Database Connection Pool & Sync Indexes
    await mongoClient.connect();
    await DatabaseIndexManager.createIndexes();

    const app = createApp();
    const server = http.createServer(app);

    server.listen(env.PORT, () => {
      logger.info(`===================================================`);
      logger.info(` SELLORA Enterprise API Server Started Successfully`);
      logger.info(` Environment: ${env.NODE_ENV}`);
      logger.info(` Port       : ${env.PORT}`);
      logger.info(` Health API : http://localhost:${env.PORT}${env.API_PREFIX}/health`);
      logger.info(`===================================================`);
    });

    // Graceful Teardown Handlers
    const handleShutdown = async (signal: string) => {
      logger.info(`Received ${signal}. Starting graceful shutdown sequence...`);
      server.close(async () => {
        logger.info('HTTP server closed.');
        await mongoClient.disconnect();
        logger.info('Graceful shutdown completed. Exiting process.');
        process.exit(0);
      });

      setTimeout(() => {
        logger.error('Forced shutdown due to timeout.');
        process.exit(1);
      }, 10000);
    };

    process.on('SIGINT', () => handleShutdown('SIGINT'));
    process.on('SIGTERM', () => handleShutdown('SIGTERM'));

    process.on('uncaughtException', (error) => {
      logger.error('Uncaught Exception detected:', error);
    });

    process.on('unhandledRejection', (reason) => {
      logger.error('Unhandled Promise Rejection detected:', reason);
    });
  } catch (error) {
    logger.error('Fatal initialization error during server bootstrap:', error);
    process.exit(1);
  }
}

bootstrapServer();
