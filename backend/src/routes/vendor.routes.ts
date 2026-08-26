import { Router } from 'express';
import { VendorController } from '../controllers/vendor.controller.js';
import { authenticate, authorizeRoles } from '../middleware/auth.middleware.js';
import { UserRole } from '../types/enums.types.js';

const router = Router();

router.get('/profile', authenticate, authorizeRoles(UserRole.SELLER, UserRole.ADMIN), VendorController.getProfile);
router.get('/analytics', authenticate, authorizeRoles(UserRole.SELLER, UserRole.ADMIN), VendorController.getAnalytics);
router.put('/profile', authenticate, authorizeRoles(UserRole.SELLER, UserRole.ADMIN), VendorController.updateProfile);

export const vendorRoutes = router;
