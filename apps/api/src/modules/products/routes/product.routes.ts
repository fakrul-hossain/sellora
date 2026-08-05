import { Router } from 'express';
import { ProductController } from '../controllers/product.controller.js';
import { authenticate, authorizeRoles } from '../../../middlewares/auth.middleware.js';
import { UserRole } from '@sellora/shared-types';

const router = Router();

router.get('/', ProductController.list);
router.get('/:id', ProductController.getById);

router.post('/', authenticate, authorizeRoles(UserRole.SELLER, UserRole.ADMIN), ProductController.create);
router.put('/:id', authenticate, authorizeRoles(UserRole.SELLER, UserRole.ADMIN), ProductController.update);
router.delete('/:id', authenticate, authorizeRoles(UserRole.SELLER, UserRole.ADMIN), ProductController.delete);

export const productRoutes = router;
