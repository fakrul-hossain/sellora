import { Router } from 'express';
import { healthRoutes } from './health.routes.js';
import { authRoutes } from './auth.routes.js';
import { productRoutes } from './product.routes.js';
import { orderRoutes } from './order.routes.js';
import { vendorRoutes } from './vendor.routes.js';
import { adminRoutes } from './admin.routes.js';
import { siteSettingsRoutes } from './site-settings.routes.js';
import { uploadRoutes } from './upload.routes.js';
import { paymentRoutes } from './payment.routes.js';

const router = Router();

router.use('/', healthRoutes);
router.use('/auth', authRoutes);
router.use('/products', productRoutes);
router.use('/orders', orderRoutes);
router.use('/vendors', vendorRoutes);
router.use('/admin', adminRoutes);
router.use('/site-settings', siteSettingsRoutes);
router.use('/upload', uploadRoutes);
router.use('/payments', paymentRoutes);

export default router;
