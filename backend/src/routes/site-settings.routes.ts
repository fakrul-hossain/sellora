import { Router, Request, Response } from 'express';
import { AdminService } from '../services/admin.service.js';
import { ApiResponseBuilder } from '../utils/api-response.js';
import { asyncHandler } from '../middleware/async-handler.js';

const router = Router();

router.get('/', asyncHandler(async (req: Request, res: Response) => {
  const settings = await AdminService.getSiteSettings();
  return ApiResponseBuilder.success(res, 'Public site settings fetched', settings);
}));

export const siteSettingsRoutes = router;
