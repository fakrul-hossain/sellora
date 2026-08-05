import { HttpStatus, HttpStatusCode } from '../constants/http-status.js';

export class AppError extends Error {
  public readonly statusCode: HttpStatusCode;
  public readonly isOperational: boolean;
  public readonly errors?: any[];

  constructor(message: string, statusCode: HttpStatusCode = HttpStatus.INTERNAL_SERVER_ERROR, errors?: any[]) {
    super(message);
    Object.setPrototypeOf(this, new.target.prototype);
    this.statusCode = statusCode;
    this.isOperational = true;
    this.errors = errors;
    Error.captureStackTrace(this, this.constructor);
  }

  public static badRequest(message: string, errors?: any[]): AppError {
    return new BadRequestError(message, errors);
  }

  public static notFound(message: string): AppError {
    return new NotFoundError(message);
  }

  public static unauthorized(message: string): AppError {
    return new UnauthorizedError(message);
  }

  public static forbidden(message: string): AppError {
    return new ForbiddenError(message);
  }
}

export class NotFoundError extends AppError {
  constructor(message: string = 'Requested resource not found') {
    super(message, HttpStatus.NOT_FOUND);
  }
}

export class BadRequestError extends AppError {
  constructor(message: string = 'Bad request input parameters', errors?: any[]) {
    super(message, HttpStatus.BAD_REQUEST, errors);
  }
}

export class UnauthorizedError extends AppError {
  constructor(message: string = 'Authentication required to access this resource') {
    super(message, HttpStatus.UNAUTHORIZED);
  }
}

export class ForbiddenError extends AppError {
  constructor(message: string = 'Access forbidden for current user credentials') {
    super(message, HttpStatus.FORBIDDEN);
  }
}

export class ConflictError extends AppError {
  constructor(message: string = 'Resource state conflict detected') {
    super(message, HttpStatus.CONFLICT);
  }
}

export class ValidationError extends AppError {
  constructor(message: string = 'Schema validation failure', errors?: any[]) {
    super(message, HttpStatus.UNPROCESSABLE_ENTITY, errors);
  }
}
