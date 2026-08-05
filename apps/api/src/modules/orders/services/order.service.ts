import { ObjectId } from 'mongodb';
import { mongoClient } from '../../../database/mongo.client.js';
import { AppError } from '../../../core/utils/app-error.js';
import { CreateOrderInput, UpdateOrderStatusInput } from '@sellora/shared-validators';
import { OrderStatus, PaymentStatus } from '@sellora/shared-types';

export class OrderService {
  private static getCollection() {
    return mongoClient.getCollection('orders');
  }

  public static async createOrder(customerId: string, customerName: string, customerEmail: string, input: CreateOrderInput) {
    const orders = this.getCollection();
    const subtotal = input.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const shippingFee = subtotal > 5000 ? 0 : 60;
    const discount = 0;
    const totalAmount = subtotal + shippingFee - discount;
    const orderNumber = `ORD-${Date.now()}-${Math.floor(100 + Math.random() * 900)}`;

    const orderDoc = {
      _id: new ObjectId(),
      orderNumber,
      customerId,
      customerName,
      customerEmail,
      customerPhone: input.shippingAddress.phone,
      items: input.items,
      shippingAddress: input.shippingAddress,
      paymentMethod: input.paymentMethod,
      paymentStatus: input.paymentMethod === 'CASH_ON_DELIVERY' ? PaymentStatus.PENDING : PaymentStatus.PAID,
      orderStatus: OrderStatus.PENDING,
      subtotal,
      shippingFee,
      discount,
      totalAmount,
      statusHistory: [
        {
          status: OrderStatus.PENDING,
          timestamp: new Date(),
          note: 'Order placed by customer',
        },
      ],
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    await orders.insertOne(orderDoc);
    return { id: orderDoc._id.toString(), ...orderDoc, _id: undefined };
  }

  public static async getCustomerOrders(customerId: string) {
    const orders = this.getCollection();
    const items = await orders.find({ customerId }).sort({ createdAt: -1 }).toArray();
    return items.map((item) => ({ id: item._id.toString(), ...item, _id: undefined }));
  }

  public static async getVendorOrders(vendorId: string) {
    const orders = this.getCollection();
    const items = await orders.find({ 'items.vendorId': vendorId }).sort({ createdAt: -1 }).toArray();
    return items.map((item) => ({ id: item._id.toString(), ...item, _id: undefined }));
  }

  public static async getAllOrders() {
    const orders = this.getCollection();
    const items = await orders.find({}).sort({ createdAt: -1 }).toArray();
    return items.map((item) => ({ id: item._id.toString(), ...item, _id: undefined }));
  }

  public static async getOrderById(id: string) {
    const orders = this.getCollection();
    const query: any = ObjectId.isValid(id) ? { _id: new ObjectId(id) } : { _id: id };
    const item = await orders.findOne(query);
    if (!item) {
      throw AppError.notFound('Order not found');
    }
    return { id: item._id.toString(), ...item, _id: undefined };
  }

  public static async updateOrderStatus(id: string, input: UpdateOrderStatusInput) {
    const orders = this.getCollection();
    const query: any = ObjectId.isValid(id) ? { _id: new ObjectId(id) } : { _id: id };

    const statusEntry = {
      status: input.orderStatus as OrderStatus,
      timestamp: new Date(),
      note: input.note || `Order status updated to ${input.orderStatus}`,
    };

    const updateDoc: any = {
      $set: {
        orderStatus: input.orderStatus,
        updatedAt: new Date(),
      },
      $push: {
        statusHistory: statusEntry,
      },
    };

    if (input.orderStatus === OrderStatus.DELIVERED) {
      updateDoc.$set.paymentStatus = PaymentStatus.PAID;
    }

    const result = await orders.findOneAndUpdate(query, updateDoc, { returnDocument: 'after' });
    if (!result) {
      throw AppError.notFound('Order not found');
    }
    return { id: result._id.toString(), ...result, _id: undefined };
  }
}
