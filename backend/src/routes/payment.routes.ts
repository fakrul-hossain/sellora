import { Router } from 'express';
import { PaymentController } from '../controllers/payment.controller.js';
import { authenticate } from '../middleware/auth.middleware.js';
import { asyncHandler } from '../middleware/async-handler.js';

const router = Router();

// Create Stripe PaymentIntent (Requires Logged-in Customer)
router.post('/create-intent', authenticate, asyncHandler(PaymentController.createPaymentIntent));

// Confirm payment and update order in MySQL (Requires Logged-in Customer)
router.post('/confirm', authenticate, asyncHandler(PaymentController.confirmPayment));

export const paymentRoutes = router;
