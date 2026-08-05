import { Request, Response } from 'express';
import { AuthService } from '../services/auth.service.js';
import { ApiResponseBuilder } from '../../../core/utils/api-response.js';
import { registerSchema, loginSchema } from '@sellora/shared-validators';

export class AuthController {
  public static register = async (req: Request, res: Response) => {
    const validated = registerSchema.parse(req.body);
    const result = await AuthService.register(validated);
    return ApiResponseBuilder.created(res, 'User registered successfully', result);
  };

  public static login = async (req: Request, res: Response) => {
    const validated = loginSchema.parse(req.body);
    const result = await AuthService.login(validated);
    return ApiResponseBuilder.success(res, 'Login successful', result);
  };

  public static getMe = async (req: Request, res: Response) => {
    const userId = req.user!.userId;
    const result = await AuthService.getProfile(userId);
    return ApiResponseBuilder.success(res, 'User profile retrieved', result);
  };
}
