import { z } from 'zod';

export const createOrderItemSchema = z.object({
  productId: z.string().min(1),
  vendorId: z.string().min(1),
  title: z.string().min(1),
  imageUrl: z.string().min(1),
  price: z.number().positive(),
  quantity: z.number().int().positive(),
});

export const shippingAddressSchema = z.object({
  id: z.string().optional(),
  fullName: z.string().min(2),
  phone: z.string().min(6),
  street: z.string().min(3),
  city: z.string().min(2),
  area: z.string().min(2),
  postalCode: z.string().optional(),
});

export const createOrderSchema = z.object({
  items: z.array(createOrderItemSchema).min(1, 'Cart cannot be empty'),
  shippingAddress: shippingAddressSchema,
  paymentMethod: z
    .enum(['CASH_ON_DELIVERY', 'SSL_COMMERZ', 'BKASH', 'NAGAD', 'STRIPE', 'STRIPE_CARD'])
    .transform((val) => (val === 'STRIPE_CARD' ? 'STRIPE' : val)),
});

export const updateOrderStatusSchema = z.object({
  orderStatus: z.enum(['PENDING', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED', 'REFUNDED']),
  note: z.string().optional(),
});

export type CreateOrderInput = z.infer<typeof createOrderSchema>;
export type UpdateOrderStatusInput = z.infer<typeof updateOrderStatusSchema>;
