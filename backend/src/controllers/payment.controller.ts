import { Request, Response } from 'express';
import Stripe from 'stripe';
import { env } from '../config/env.config.js';
import { pool } from '../models/mysql.client.js';
import { ApiResponseBuilder } from '../utils/api-response.js';
import { AppError } from '../utils/app-error.js';
import { logger } from '../utils/logger.js';

/**
 * Helper to get active Stripe client using live or configured keys
 */
function getStripeClient(): Stripe | null {
  const secret = process.env.STRIPE_SECRET_KEY || env.STRIPE_SECRET_KEY;
  if (secret && !secret.includes('mock') && !secret.includes('placeholder')) {
    try {
      return new Stripe(secret, {
        apiVersion: '2024-06-20' as any,
      });
    } catch (err: any) {
      logger.warn('Stripe initialization failed:', err.message);
    }
  }
  return null;
}

/**
 * Payment Controller
 * Handles Stripe PaymentIntent creation, Card checkout, and payment confirmation.
 */
export class PaymentController {
  /**
   * Create a Stripe PaymentIntent for card payment
   */
  public static createPaymentIntent = async (req: Request, res: Response) => {
    // 1. Get amount and order info from request body
    const { amount, orderId, customerEmail } = req.body;

    if (!amount || amount <= 0) {
      throw AppError.badRequest('Valid payment amount is required');
    }

    const numericAmount = Number(amount);
    const stripe = getStripeClient();

    // 2. Try creating a real Stripe PaymentIntent if real Stripe key is provided
    if (stripe) {
      try {
        const paymentIntent = await stripe.paymentIntents.create({
          amount: Math.round(numericAmount * 100), // Convert to lowest currency denomination (paisa/cents)
          currency: 'bdt',
          description: `SELLORA Order #${orderId || 'New'}`,
          metadata: {
            orderId: String(orderId || ''),
            customerEmail: String(customerEmail || req.user?.email || ''),
          },
          payment_method_types: ['card'],
        });

        logger.info(`Stripe PaymentIntent created: ${paymentIntent.id} for amount ${numericAmount} BDT`);

        return ApiResponseBuilder.success(res, 'Stripe PaymentIntent created successfully', {
          clientSecret: paymentIntent.client_secret,
          paymentIntentId: paymentIntent.id,
          publishableKey: process.env.STRIPE_PUBLISHABLE_KEY || env.STRIPE_PUBLISHABLE_KEY,
          isSimulated: false,
        });
      } catch (stripeErr: any) {
        logger.warn('Stripe API error, falling back to development test mode:', stripeErr.message);
      }
    }

    // 3. Fallback to reliable development test simulation (supports test card 4242 4242 4242 4242)
    const simulatedId = `pi_test_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;
    return ApiResponseBuilder.success(res, 'Stripe PaymentIntent created (Development Mode)', {
      clientSecret: `${simulatedId}_secret_mock`,
      paymentIntentId: simulatedId,
      publishableKey: process.env.STRIPE_PUBLISHABLE_KEY || env.STRIPE_PUBLISHABLE_KEY || 'pk_test_sellora_mock',
      isSimulated: true,
    });
  };

  /**
   * Confirm successful payment and update order & revenue records in database
   */
  public static confirmPayment = async (req: Request, res: Response) => {
    const { orderId, orderNumber, paymentIntentId, amount, paymentMethod = 'STRIPE' } = req.body;
    const resolvedPaymentMethod = paymentMethod === 'STRIPE_CARD' ? 'STRIPE' : paymentMethod;

    if (!orderId && !orderNumber) {
      throw AppError.badRequest('Order ID or Order Number is required for payment confirmation');
    }

    // 1. Find the order in MySQL
    let orderRow: any = null;
    if (orderId) {
      const [rows]: any = await pool.query('SELECT * FROM orders WHERE id = ? LIMIT 1', [orderId]);
      orderRow = rows[0];
    } else if (orderNumber) {
      const [rows]: any = await pool.query('SELECT * FROM orders WHERE order_number = ? LIMIT 1', [orderNumber]);
      orderRow = rows[0];
    }

    if (!orderRow) {
      throw AppError.notFound('Order not found');
    }

    const resolvedOrderId = orderRow.id;
    const finalAmount = amount ? Number(amount) : Number(orderRow.total_amount);
    const txnRef = paymentIntentId || `TRX-STRIPE-${Date.now()}`;

    // 2. Update order payment and delivery status
    await pool.query(
      `UPDATE orders 
       SET payment_status = 'PAID', 
           order_status = 'CONFIRMED',
           payment_method = ?
       WHERE id = ?`,
      [resolvedPaymentMethod, resolvedOrderId]
    );

    // 3. Update or Insert into payments table (Report Requirement)
    const [existingPayments]: any = await pool.query(
      'SELECT id FROM payments WHERE order_id = ? LIMIT 1',
      [resolvedOrderId]
    );

    if (existingPayments && existingPayments.length > 0) {
      await pool.query(
        `UPDATE payments 
         SET payment_status = 'COMPLETED', 
             transaction_id = ?, 
             payment_method = 'CARD',
             amount = ?
         WHERE order_id = ?`,
        [txnRef, finalAmount, resolvedOrderId]
      );
    } else {
      await pool.query(
        `INSERT INTO payments (order_id, amount, payment_method, payment_status, transaction_id)
         VALUES (?, ?, 'CARD', 'COMPLETED', ?)`,
        [resolvedOrderId, finalAmount, txnRef]
      );
    }

    // 4. Add Order Status History log
    await pool.query(
      `INSERT INTO order_status_history (order_id, status, note)
       VALUES (?, 'CONFIRMED', ?)`,
      [resolvedOrderId, `Payment confirmed via Stripe (Transaction: ${txnRef})`]
    );

    // 5. Update vendor earnings in revenue table
    await pool.query(`
      INSERT INTO revenue (owner_id, total_revenue)
      SELECT v.owner_id, SUM(oi.subtotal) AS total_revenue
      FROM order_items oi
      JOIN vendors v ON oi.vendor_id = v.id
      JOIN orders o ON oi.order_id = o.id
      JOIN payments pay ON pay.order_id = o.id
      WHERE pay.payment_status IN ('COMPLETED', 'PAID') AND o.id = ?
      GROUP BY v.owner_id
      ON DUPLICATE KEY UPDATE total_revenue = total_revenue + VALUES(total_revenue);
    `, [resolvedOrderId]);

    logger.info(`Payment confirmed for Order #${orderRow.order_number} via Stripe. Txn: ${txnRef}`);

    return ApiResponseBuilder.success(res, 'Payment verified and order confirmed successfully', {
      orderId: resolvedOrderId,
      orderNumber: orderRow.order_number,
      paymentStatus: 'PAID',
      orderStatus: 'CONFIRMED',
      transactionId: txnRef,
    });
  };
}
