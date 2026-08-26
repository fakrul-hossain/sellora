import http from 'http';
import { env } from './config/env.config.js';
import { createApp } from './app.js';
import { mysqlClient } from './models/mysql.client.js';
import { DatabaseSchema } from './models/schema.js';
import { logger } from './utils/logger.js';

async function bootstrapServer() {
  try {
    logger.info('Bootstrapping SELLORA Enterprise API Server...');

    await mysqlClient.connect();
    await DatabaseSchema.initializeSchema();

    const app = createApp();
    const server = http.createServer(app);

    server.listen(env.PORT, () => {
      logger.info(`===================================================`);
      logger.info(` SELLORA Enterprise API Server Started Successfully`);
      logger.info(` Database   : MySQL Relational Engine`);
      logger.info(` Environment: ${env.NODE_ENV}`);
      logger.info(` Port       : ${env.PORT}`);
      logger.info(` Health API : http://localhost:${env.PORT}${env.API_PREFIX}/health`);
      logger.info(`===================================================`);
    });

    const handleShutdown = async (signal: string) => {
      logger.info(`Received ${signal}. Starting graceful shutdown sequence...`);
      server.close(async () => {
        logger.info('HTTP server closed.');
        await mysqlClient.disconnect();
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
