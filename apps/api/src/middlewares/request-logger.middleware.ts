import { Request, Response, NextFunction } from 'express';
import { logger } from '../core/utils/logger.js';
import { metricsCollector } from '../core/observability/metrics.js';

export const requestLoggerMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const startTime = Date.now();
  metricsCollector.incrementRequests();

  res.on('finish', () => {
    const durationMs = Date.now() - startTime;
    logger.info(`HTTP ${req.method} ${req.originalUrl} ${res.statusCode} - ${durationMs}ms - IP: ${req.ip}`);
  });

  next();
};
