import { Request, Response } from 'express';
import { healthService } from '../services/health.service.js';
import { ApiResponseBuilder } from '../../../core/utils/api-response.js';
import { asyncHandler } from '../../../middlewares/async-handler.js';

export class HealthController {
  public checkHealth = asyncHandler(async (req: Request, res: Response) => {
    const healthStatus = await healthService.getHealth();
    return ApiResponseBuilder.success(res, 'SELLORA Enterprise API is operational', healthStatus);
  });
}

export const healthController = new HealthController();
