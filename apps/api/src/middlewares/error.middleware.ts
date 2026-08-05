import { Request, Response, NextFunction } from 'express';
import { AppError } from '../core/utils/app-error.js';
import { ApiResponseBuilder } from '../core/utils/api-response.js';
import { HttpStatus, HttpStatusCode } from '../core/constants/http-status.js';
import { logger } from '../core/utils/logger.js';
import { metricsCollector } from '../core/observability/metrics.js';

export const globalErrorHandler = (
  err: Error | AppError,
  req: Request,
  res: Response,
  next: NextFunction
): Response => {
  let statusCode: HttpStatusCode = HttpStatus.INTERNAL_SERVER_ERROR;
  let message = 'Internal Server Error';
  let errors: any[] | undefined = undefined;

  if (err instanceof AppError) {
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
