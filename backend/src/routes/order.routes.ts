import { Router } from 'express';
import { OrderController } from '../controllers/order.controller.js';
import { authenticate, authorizeRoles } from '../middleware/auth.middleware.js';
import { UserRole } from '../types/enums.types.js';
import { asyncHandler } from '../middleware/async-handler.js';

const router = Router();

router.post('/', authenticate, asyncHandler(OrderController.create));
router.get('/my-orders', authenticate, asyncHandler(OrderController.getMyOrders));
router.get('/vendor/my-orders', authenticate, authorizeRoles(UserRole.SELLER, UserRole.ADMIN), asyncHandler(OrderController.getVendorOrders));
router.get('/admin/all', authenticate, authorizeRoles(UserRole.ADMIN, UserRole.SUPER_ADMIN), asyncHandler(OrderController.getAllOrders));
router.get('/:id', authenticate, asyncHandler(OrderController.getById));
router.put('/:id/status', authenticate, authorizeRoles(UserRole.SELLER, UserRole.ADMIN, UserRole.SUPER_ADMIN), asyncHandler(OrderController.updateStatus));

export const orderRoutes = router;
