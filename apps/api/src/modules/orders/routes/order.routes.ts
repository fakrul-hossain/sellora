import { Router } from 'express';
import { OrderController } from '../controllers/order.controller.js';
import { authenticate, authorizeRoles } from '../../../middlewares/auth.middleware.js';
import { UserRole } from '@sellora/shared-types';

const router = Router();

router.post('/', authenticate, OrderController.create);
router.get('/my-orders', authenticate, OrderController.getMyOrders);
router.get('/vendor/my-orders', authenticate, authorizeRoles(UserRole.SELLER, UserRole.ADMIN), OrderController.getVendorOrders);
router.get('/admin/all', authenticate, authorizeRoles(UserRole.ADMIN, UserRole.SUPER_ADMIN), OrderController.getAllOrders);
router.get('/:id', authenticate, OrderController.getById);
router.put('/:id/status', authenticate, authorizeRoles(UserRole.SELLER, UserRole.ADMIN, UserRole.SUPER_ADMIN), OrderController.updateStatus);

export const orderRoutes = router;
