import { OrderStatus, PaymentStatus, PaymentMethod } from './enums.types.js';
import { UserAddress } from './user.types.js';

export interface OrderItem {
  id: string;
  productId: string;
  vendorId: string;
  title: string;
  imageUrl: string;
  price: number;
  quantity: number;
  subtotal: number;
}

export interface OrderStatusHistory {
  status: string;
  timestamp: string;
  note?: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  customerId: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  items: OrderItem[];
  shippingAddress: UserAddress;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  orderStatus: OrderStatus;
  subtotal: number;
  shippingFee: number;
  discount: number;
  totalAmount: number;
  statusHistory?: OrderStatusHistory[];
  createdAt: string;
  updatedAt: string;
}
