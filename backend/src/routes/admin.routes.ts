import { Router } from 'express';
import { AdminController } from '../controllers/admin.controller.js';
import { authenticate, authorizeRoles } from '../middleware/auth.middleware.js';
import { UserRole } from '../types/enums.types.js';
import { asyncHandler } from '../middleware/async-handler.js';

const router = Router();

router.use(authenticate, authorizeRoles(UserRole.ADMIN, UserRole.SUPER_ADMIN, UserRole.MODERATOR));

router.get('/analytics', asyncHandler(AdminController.getAnalytics));

router.get('/users', asyncHandler(AdminController.listUsers));
router.put('/users/:id/role', asyncHandler(AdminController.updateUserRole));

router.get('/vendors', asyncHandler(AdminController.listVendors));
router.put('/vendors/:id/status', asyncHandler(AdminController.updateVendorStatus));

router.get('/products', asyncHandler(AdminController.listProducts));
router.put('/products/:id/approve', asyncHandler(AdminController.approveProduct));
router.get('/orders', asyncHandler(AdminController.listOrders));

router.get('/site-settings', asyncHandler(AdminController.getSiteSettings));
router.put('/site-settings', asyncHandler(AdminController.updateSiteSettings));

router.get('/activity-logs', asyncHandler(AdminController.listActivityLogs));

export const adminRoutes = router;
