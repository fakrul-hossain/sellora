import { Response } from 'express';
import { ApiResponse } from '../types/api.types.js';
import { HttpStatus, HttpStatusCode } from './http-status.js';
import { requestContext } from './async-context.js';

export class ApiResponseBuilder {
  public static success<T>(
    res: Response,
    message: string,
    data?: T,
    statusCode: HttpStatusCode = HttpStatus.OK,
    meta?: Record<string, any>
  ): Response {
    const traceId = requestContext.getTraceId();
    const payload: ApiResponse<T> = {
      success: true,
      statusCode,
      message,
      data,
      meta,
      traceId,
      timestamp: new Date().toISOString(),
    };
    return res.status(statusCode).json(payload);
  }

  public static created<T>(res: Response, message: string, data?: T): Response {
    return this.success(res, message, data, HttpStatus.CREATED);
  }

  public static error(
    res: Response,
    message: string,
    statusCode: HttpStatusCode = HttpStatus.INTERNAL_SERVER_ERROR,
    errors?: any[]
  ): Response {
    const traceId = requestContext.getTraceId();
    const payload: ApiResponse = {
      success: false,
      statusCode,
      message,
      errors,
      traceId,
      timestamp: new Date().toISOString(),
    };
    return res.status(statusCode).json(payload);
  }
}
