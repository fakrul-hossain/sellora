import express, { Application, Request, Response, NextFunction } from 'express';
import helmet from 'helmet';
import cors from 'cors';
import compression from 'compression';
import { env } from './config/env.config.js';
import { corsConfig } from './config/cors.config.js';
import { helmetConfig } from './config/helmet.config.js';
import { globalErrorHandler, notFoundHandler } from './middleware/error.middleware.js';
import routes from './routes/index.js';

export const createApp = (): Application => {
  const app = express();

  // 1. Basic Security & CORS Middlewares
  app.use(helmet(helmetConfig));
  app.use(cors(corsConfig));
  app.use(compression());
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true, limit: '10mb' }));

  // 2. Simple Request Logging
  app.use((req: Request, _res: Response, next: NextFunction) => {
    console.log(`[${new Date().toLocaleTimeString()}] ${req.method} ${req.originalUrl}`);
    next();
  });

  // 3. Mount Main API Routes (/api/v1)
  app.use(env.API_PREFIX, routes);

  // 4. Handle 404 & Global Errors
  app.use(notFoundHandler);
  app.use(globalErrorHandler);

  return app;
};
