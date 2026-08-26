import { Request, Response, NextFunction } from 'express';
import { AuthUtil, JwtPayload } from '../utils/jwt.util.js';
import { AppError } from '../utils/app-error.js';
import { UserRole } from '../types/enums.types.js';

declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload;
    }
  }
}

export const authenticate = (req: Request, _res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw AppError.unauthorized('Authentication token is missing or malformed');
  }

  const token = authHeader.split(' ')[1];
  try {
    const payload = AuthUtil.verifyToken(token);
    req.user = payload;
    next();
  } catch {
    throw AppError.unauthorized('Invalid or expired authentication token');
  }
};

export const authorizeRoles = (...allowedRoles: UserRole[]) => {
  return (req: Request, _res: Response, next: NextFunction) => {
    if (!req.user) {
      throw AppError.unauthorized('User is not authenticated');
    }

    if (!allowedRoles.includes(req.user.role)) {
      throw AppError.forbidden('You do not have permission to access this resource');
    }

    next();
  };
};
