import { Router } from 'express';
import { AdminController } from '../controllers/admin.controller.js';
import { authenticate, authorizeRoles } from '../middleware/auth.middleware.js';
import { UserRole } from '../types/enums.types.js';

const router = Router();

router.use(authenticate, authorizeRoles(UserRole.ADMIN, UserRole.SUPER_ADMIN));

router.get('/analytics', AdminController.getAnalytics);
router.get('/vendors', AdminController.listVendors);
router.put('/vendors/:id/status', AdminController.updateVendorStatus);
router.get('/site-settings', AdminController.getSiteSettings);
router.put('/site-settings', AdminController.updateSiteSettings);

export const adminRoutes = router;
