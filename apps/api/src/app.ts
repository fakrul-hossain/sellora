import express, { Application } from 'express';
import helmet from 'helmet';
import cors from 'cors';
import compression from 'compression';
import { env } from './config/env.config.js';
import { corsConfig } from './config/cors.config.js';
import { helmetConfig } from './config/helmet.config.js';
import { traceIdMiddleware } from './middlewares/trace-id.middleware.js';
import { requestLoggerMiddleware } from './middlewares/request-logger.middleware.js';
import { mongoSanitizeMiddleware } from './middlewares/mongo-sanitize.middleware.js';
import { globalErrorHandler, notFoundHandler } from './middlewares/error.middleware.js';
import { healthRoutes } from './modules/health/routes/health.routes.js';
import { authRoutes } from './modules/auth/routes/auth.routes.js';
import { productRoutes } from './modules/products/routes/product.routes.js';
import { orderRoutes } from './modules/orders/routes/order.routes.js';
import { vendorRoutes } from './modules/vendors/routes/vendor.routes.js';
import { adminRoutes } from './modules/admin/routes/admin.routes.js';

export const createApp = (): Application => {
  const app = express();

  // Core Security & Compression Middlewares
  app.use(helmet(helmetConfig));
  app.use(cors(corsConfig));
  app.use(compression());
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true, limit: '10mb' }));

  // Observability & Security Sanitization
  app.use(traceIdMiddleware);
  app.use(requestLoggerMiddleware);
  app.use(mongoSanitizeMiddleware);

  // Register Feature Routes
  app.use(env.API_PREFIX, healthRoutes);
  app.use(`${env.API_PREFIX}/auth`, authRoutes);
  app.use(`${env.API_PREFIX}/products`, productRoutes);
  app.use(`${env.API_PREFIX}/orders`, orderRoutes);
  app.use(`${env.API_PREFIX}/vendors`, vendorRoutes);
  app.use(`${env.API_PREFIX}/admin`, adminRoutes);

  // Fallback 404 & Error Middlewares
  app.use(notFoundHandler);
  app.use(globalErrorHandler);

  return app;
};
