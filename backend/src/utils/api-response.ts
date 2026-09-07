import { Response } from 'express';

/**
 * Standard API response helper for sending consistent JSON responses
 * Format: { success: boolean, message: string, data: any }
 */
export class ApiResponseBuilder {
  public static success<T>(
    res: Response,
    message: string,
    data?: T,
    statusCode: number = 200,
    meta?: Record<string, any>
  ): Response {
    return res.status(statusCode).json({
      success: true,
      statusCode,
      message,
      data,
      meta,
      timestamp: new Date().toISOString(),
    });
  }

  public static created<T>(res: Response, message: string, data?: T): Response {
    return this.success(res, message, data, 201);
  }

  public static error(
    res: Response,
    message: string,
    statusCode: number = 500,
    errors?: any[]
  ): Response {
    return res.status(statusCode).json({
      success: false,
      statusCode,
      message,
      errors,
      timestamp: new Date().toISOString(),
    });
  }
}
