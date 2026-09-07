import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';
import { AppError } from '../utils/app-error.js';
import { ApiResponseBuilder } from '../utils/api-response.js';
import { logger } from '../utils/logger.js';

/**
 * Centralized error handler
 * Catches all errors and returns a clean, readable JSON response.
 */
export const globalErrorHandler = (
  err: Error | AppError,
  _req: Request,
  res: Response,
  _next: NextFunction
): Response => {
  let statusCode = 500;
  let message = 'Internal Server Error';

  if (err instanceof ZodError) {
    statusCode = 400;
    message = err.errors.map((e) => e.message).join(', ');
  } else if (err instanceof AppError) {
    statusCode = err.statusCode;
    message = err.message;
  } else {
    const rawError = err as any;
    const errorMsg = String(rawError?.message || '');

    if (rawError?.code === 'ER_DUP_ENTRY' || rawError?.errno === 1062 || errorMsg.includes('Duplicate entry')) {
      statusCode = 409;
      if (errorMsg.includes('sku')) {
        const match = errorMsg.match(/Duplicate entry '([^']+)'/);
        const dupVal = match ? match[1] : '';
        message = dupVal
          ? `Product SKU "${dupVal}" is already registered. Please choose a unique SKU.`
          : 'A product with this SKU already exists. Please choose a unique SKU.';
      } else if (errorMsg.includes('email')) {
        message = 'This email address is already registered. Please sign in or use another email.';
      } else if (errorMsg.includes('slug')) {
        message = 'A product with a similar title or slug already exists. Please use a unique title.';
      } else {
        message = 'A duplicate record already exists with the provided information.';
      }
    } else {
      logger.error('Unhandled Server Error:', rawError.message || rawError);
      // In development or when message is informative, return message rather than opaque 500
      if (rawError.message && !rawError.message.includes('password') && !rawError.message.includes('secret')) {
        message = rawError.message;
      }
    }
  }

  return ApiResponseBuilder.error(res, message, statusCode);
};

/**
 * 404 handler for unknown routes
 */
export const notFoundHandler = (req: Request, res: Response): Response => {
  return ApiResponseBuilder.error(res, `Route ${req.method} ${req.originalUrl} not found`, 404);
};
