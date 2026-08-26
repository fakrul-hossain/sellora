import { Router } from 'express';
import { ProductController } from '../controllers/product.controller.js';
import { authenticate, authorizeRoles } from '../middleware/auth.middleware.js';
import { UserRole } from '../types/enums.types.js';
import { asyncHandler } from '../middleware/async-handler.js';

const router = Router();

router.get('/', asyncHandler(ProductController.list));
router.get('/:id', asyncHandler(ProductController.getById));

router.post('/', authenticate, authorizeRoles(UserRole.SELLER, UserRole.ADMIN), asyncHandler(ProductController.create));
router.put('/:id', authenticate, authorizeRoles(UserRole.SELLER, UserRole.ADMIN), asyncHandler(ProductController.update));
router.delete('/:id', authenticate, authorizeRoles(UserRole.SELLER, UserRole.ADMIN), asyncHandler(ProductController.delete));

export const productRoutes = router;
