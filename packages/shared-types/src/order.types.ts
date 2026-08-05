import { BaseEntity } from './entity.types.js';
import { OrderStatus, PaymentStatus, PaymentMethod } from './enums.types.js';
import { Address } from './user.types.js';

export interface OrderItem {
  productId: string;
  vendorId: string;
  title: string;
  imageUrl: string;
  price: number;
  quantity: number;
}

export interface OrderStatusHistory {
  status: OrderStatus;
  timestamp: Date;
  note?: string;
}

export interface Order extends BaseEntity {
  orderNumber: string;
  customerId: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  items: OrderItem[];
  shippingAddress: Address;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  orderStatus: OrderStatus;
  subtotal: number;
  shippingFee: number;
  discount: number;
  totalAmount: number;
  statusHistory: OrderStatusHistory[];
}
