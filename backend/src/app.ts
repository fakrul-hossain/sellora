import express, { Application } from 'express';
import helmet from 'helmet';
import cors from 'cors';
import compression from 'compression';
import { env } from './config/env.config.js';
import { corsConfig } from './config/cors.config.js';
import { helmetConfig } from './config/helmet.config.js';
import { traceIdMiddleware } from './middleware/trace-id.middleware.js';
import { requestLoggerMiddleware } from './middleware/request-logger.middleware.js';
import { globalErrorHandler, notFoundHandler } from './middleware/error.middleware.js';
import routes from './routes/index.js';

export const createApp = (): Application => {
  const app = express();

  // Core Security & Performance Middlewares
  app.use(helmet(helmetConfig));
  app.use(cors(corsConfig));
  app.use(compression());
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true, limit: '10mb' }));

  // Observability & Request Tracing
  app.use(traceIdMiddleware);
  app.use(requestLoggerMiddleware);

  // Register Feature API Routes
  app.use(env.API_PREFIX, routes);

  // Fallback 404 & Global Error Handlers
  app.use(notFoundHandler);
  app.use(globalErrorHandler);

  return app;
};
