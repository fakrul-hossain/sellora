import { Router } from 'express';
import { AdminController } from '../controllers/admin.controller.js';
import { authenticate, authorizeRoles } from '../middleware/auth.middleware.js';
import { UserRole } from '../types/enums.types.js';
import { asyncHandler } from '../middleware/async-handler.js';

const router = Router();

router.use(authenticate, authorizeRoles(UserRole.ADMIN, UserRole.SUPER_ADMIN));

router.get('/analytics', asyncHandler(AdminController.getAnalytics));
router.get('/vendors', asyncHandler(AdminController.listVendors));
router.put('/vendors/:id/status', asyncHandler(AdminController.updateVendorStatus));
router.get('/site-settings', asyncHandler(AdminController.getSiteSettings));
router.put('/site-settings', asyncHandler(AdminController.updateSiteSettings));

export const adminRoutes = router;
