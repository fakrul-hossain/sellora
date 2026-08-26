import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';
import { AppError } from '../utils/app-error.js';
import { ApiResponseBuilder } from '../utils/api-response.js';
import { HttpStatus, HttpStatusCode } from '../utils/http-status.js';
import { logger } from '../utils/logger.js';
import { metricsCollector } from '../utils/metrics.js';

export const globalErrorHandler = (
  err: Error | AppError,
  _req: Request,
  res: Response,
  _next: NextFunction
): Response => {
  let statusCode: HttpStatusCode = HttpStatus.INTERNAL_SERVER_ERROR;
  let message = 'Internal Server Error';
  let errors: any[] | undefined = undefined;

  if (err instanceof ZodError) {
    statusCode = HttpStatus.BAD_REQUEST;
    message = 'Validation failed for request parameters';
    errors = err.errors.map((e) => ({
      field: e.path.join('.'),
      message: e.message,
    }));
  } else if (err instanceof AppError) {
    statusCode = err.statusCode;
    message = err.message;
    errors = err.errors;
  } else {
    logger.error('Unhandled System Exception:', err);
  }

  metricsCollector.recordError(statusCode.toString());

  return ApiResponseBuilder.error(res, message, statusCode, errors);
};

export const notFoundHandler = (req: Request, res: Response): Response => {
  return ApiResponseBuilder.error(res, `Route path ${req.originalUrl} not found on server`, HttpStatus.NOT_FOUND);
};
