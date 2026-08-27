import { Router } from 'express';
import { VendorController } from '../controllers/vendor.controller.js';
import { authenticate, authorizeRoles } from '../middleware/auth.middleware.js';
import { UserRole } from '../types/enums.types.js';
import { asyncHandler } from '../middleware/async-handler.js';

const router = Router();

router.get('/store/:id', asyncHandler(VendorController.getPublicStore));

router.use(authenticate, authorizeRoles(UserRole.SELLER, UserRole.ADMIN, UserRole.SUPER_ADMIN));

router.get('/profile', asyncHandler(VendorController.getProfile));
router.put('/profile', asyncHandler(VendorController.updateProfile));
router.get('/analytics', asyncHandler(VendorController.getAnalytics));

router.post('/products', asyncHandler(VendorController.createProduct));
router.put('/products/:id', asyncHandler(VendorController.updateProduct));
router.delete('/products/:id', asyncHandler(VendorController.deleteProduct));

router.put('/inventory/:productId', asyncHandler(VendorController.updateStock));

router.get('/withdrawals', asyncHandler(VendorController.listWithdrawals));
router.post('/withdrawals', asyncHandler(VendorController.requestWithdrawal));

export const vendorRoutes = router;
