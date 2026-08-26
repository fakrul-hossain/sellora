import { Request, Response, NextFunction } from 'express';
import { requestContext } from '../utils/async-context.js';

export const traceIdMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const traceId = (req.headers['x-trace-id'] as string) || `trace-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
  const requestId = (req.headers['x-request-id'] as string) || `req-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;

  res.setHeader('X-Trace-ID', traceId);
  res.setHeader('X-Request-ID', requestId);

  requestContext.run(
    {
      traceId,
      requestId,
      ip: req.ip,
    },
    () => {
      next();
    }
  );
};
