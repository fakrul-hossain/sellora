import { OrderRepository, OrderRow } from '../models/order.repository.js';
import { ProductRepository } from '../models/product.repository.js';
import { TransactionManager } from '../models/transaction.manager.js';
import { AppError } from '../utils/app-error.js';
import { CreateOrderInput, UpdateOrderStatusInput } from '../validators/order.validators.js';
import { OrderStatus, PaymentStatus } from '../types/enums.types.js';

export class OrderService {
  private static async formatOrder(row: OrderRow) {
    const items = await OrderRepository.getOrderItems(row.id);
    const history = await OrderRepository.getStatusHistory(row.id);

    let shippingAddress = {};
    try {
      shippingAddress = typeof row.shipping_address_json === 'string' ? JSON.parse(row.shipping_address_json) : row.shipping_address_json;
    } catch {
      shippingAddress = {};
    }

    return {
      id: String(row.id),
      orderNumber: row.order_number,
      customerId: String(row.customer_id),
      customerName: row.customer_name,
      customerEmail: row.customer_email,
      customerPhone: row.customer_phone,
      items: items.map((item) => ({
        id: String(item.id),
        productId: String(item.product_id),
        vendorId: String(item.vendor_id),
        title: item.title,
        imageUrl: item.image_url,
        price: Number(item.price),
        quantity: Number(item.quantity),
        subtotal: Number(item.subtotal),
      })),
      shippingAddress,
      paymentMethod: row.payment_method,
      paymentStatus: row.payment_status,
      orderStatus: row.order_status,
      subtotal: Number(row.subtotal),
      shippingFee: Number(row.shipping_fee),
      discount: Number(row.discount),
      totalAmount: Number(row.total_amount),
      statusHistory: history.map((h) => ({
        status: h.status,
        timestamp: h.created_at,
        note: h.note,
      })),
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    };
  }

  public static async createOrder(
    customerId: string,
    customerName: string,
    customerEmail: string,
    input: CreateOrderInput
  ) {
    const subtotal = input.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const shippingFee = subtotal > 5000 ? 0 : 60;
    const discount = 0;
    const totalAmount = subtotal + shippingFee - discount;
    const orderNumber = `ORD-${Date.now()}-${Math.floor(100 + Math.random() * 900)}`;

    const paymentStatus = input.paymentMethod === 'CASH_ON_DELIVERY' ? PaymentStatus.PENDING : PaymentStatus.PAID;

    const orderId = await TransactionManager.execute(async (connection) => {
      for (const item of input.items) {
        const hasStock = await ProductRepository.decrementStock(item.productId, item.quantity, connection);
        if (!hasStock) {
          throw AppError.badRequest(`Product "${item.title}" is out of stock or does not have requested quantity`);
        }
      }

      const newOrderId = await OrderRepository.createOrderHeader(
        {
          orderNumber,
          customerId,
          customerName,
          customerEmail,
          customerPhone: input.shippingAddress.phone,
          subtotal,
          shippingFee,
          discount,
          totalAmount,
          paymentMethod: input.paymentMethod,
          paymentStatus,
          orderStatus: OrderStatus.PENDING,
          shippingAddress: input.shippingAddress,
        },
        connection
      );

      // Step 3: Insert each purchased item into order_items table
      for (const item of input.items) {
        await OrderRepository.createOrderItem(
          {
            orderId: newOrderId,
            productId: item.productId,
            vendorId: item.vendorId,
            title: item.title,
            imageUrl: item.imageUrl,
            price: item.price,
            quantity: item.quantity,
            subtotal: item.price * item.quantity,
          },
          connection
        );
      }

      // Step 4: Record initial order status history
      await OrderRepository.addStatusHistory(newOrderId, OrderStatus.PENDING, 'Order placed by customer', connection);

      // Step 5: Record transaction in payments table (Report Requirement)
      await connection.execute(
        `INSERT INTO payments (order_id, amount, payment_method, payment_status, transaction_id)
         VALUES (?, ?, ?, ?, ?)`,
        [newOrderId, totalAmount, input.paymentMethod, paymentStatus, `TRX-${Date.now()}`]
      );

      return newOrderId;
    });

    return await this.getOrderById(String(orderId));
  }

  public static async getCustomerOrders(customerId: string) {
    const rows = await OrderRepository.findByCustomerId(customerId);
    return await Promise.all(rows.map((row) => this.formatOrder(row)));
  }

  public static async getVendorOrders(vendorId: string) {
    const rows = await OrderRepository.findByVendorId(vendorId);
    return await Promise.all(rows.map((row) => this.formatOrder(row)));
  }

  public static async getAllOrders() {
    const rows = await OrderRepository.findAll();
    return await Promise.all(rows.map((row) => this.formatOrder(row)));
  }

  public static async getOrderById(id: string) {
    const row = await OrderRepository.findById(id);
    if (!row) {
      throw AppError.notFound('Order not found');
    }
    return await this.formatOrder(row);
  }

  public static async updateOrderStatus(id: string, input: UpdateOrderStatusInput) {
    const updated = await OrderRepository.updateStatus(id, input.orderStatus, input.note);
    if (!updated) {
      throw AppError.notFound('Order not found');
    }
    return await this.formatOrder(updated);
  }
}
