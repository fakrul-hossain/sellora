import { RowDataPacket, ResultSetHeader, PoolConnection } from 'mysql2/promise';
import { mysqlClient } from './mysql.client.js';

export interface OrderRow extends RowDataPacket {
  id: number;
  order_number: string;
  customer_id: number;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  subtotal: number;
  shipping_fee: number;
  discount: number;
  total_amount: number;
  payment_method: string;
  payment_status: 'PENDING' | 'PAID' | 'FAILED' | 'REFUNDED';
  order_status: 'PENDING' | 'CONFIRMED' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';
  shipping_address_json: string;
  created_at: Date;
  updated_at: Date;
}

export interface OrderItemRow extends RowDataPacket {
  id: number;
  order_id: number;
  product_id: number;
  vendor_id: number;
  title: string;
  image_url: string;
  price: number;
  quantity: number;
  subtotal: number;
  created_at: Date;
}

export interface OrderStatusHistoryRow extends RowDataPacket {
  id: number;
  order_id: number;
  status: string;
  note?: string;
  created_at: Date;
}

export class OrderRepository {
  public static async findById(id: number | string): Promise<OrderRow | null> {
    const numericId = typeof id === 'string' ? parseInt(id, 10) : id;
    if (isNaN(numericId)) return null;

    const sql = `SELECT * FROM orders WHERE id = ? LIMIT 1`;
    const rows = await mysqlClient.query<OrderRow[]>(sql, [numericId]);
    return rows.length > 0 ? rows[0] : null;
  }

  public static async getOrderItems(orderId: number | string): Promise<OrderItemRow[]> {
    const numericId = typeof orderId === 'string' ? parseInt(orderId, 10) : orderId;
    const sql = `SELECT * FROM order_items WHERE order_id = ?`;
    return await mysqlClient.query<OrderItemRow[]>(sql, [numericId]);
  }

  public static async getStatusHistory(orderId: number | string): Promise<OrderStatusHistoryRow[]> {
    const numericId = typeof orderId === 'string' ? parseInt(orderId, 10) : orderId;
    const sql = `SELECT * FROM order_status_history WHERE order_id = ? ORDER BY id ASC`;
    return await mysqlClient.query<OrderStatusHistoryRow[]>(sql, [numericId]);
  }

  public static async createOrderHeader(
    order: {
      orderNumber: string;
      customerId: number | string;
      customerName: string;
      customerEmail: string;
      customerPhone: string;
      subtotal: number;
      shippingFee: number;
      discount: number;
      totalAmount: number;
      paymentMethod: string;
      paymentStatus: string;
      orderStatus: string;
      shippingAddress: any;
    },
    connection?: PoolConnection
  ): Promise<number> {
    const numericCustomerId = typeof order.customerId === 'string' ? parseInt(order.customerId, 10) : order.customerId;
    const sql = `
      INSERT INTO orders (
        order_number, customer_id, customer_name, customer_email, customer_phone,
        subtotal, shipping_fee, discount, total_amount, payment_method,
        payment_status, order_status, shipping_address_json
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const params = [
      order.orderNumber,
      numericCustomerId,
      order.customerName,
      order.customerEmail,
      order.customerPhone,
      order.subtotal,
      order.shippingFee,
      order.discount,
      order.totalAmount,
      order.paymentMethod,
      order.paymentStatus,
      order.orderStatus,
      JSON.stringify(order.shippingAddress),
    ];

    if (connection) {
      const [result] = await connection.execute<ResultSetHeader>(sql, params);
      return result.insertId;
    } else {
      const result = await mysqlClient.execute(sql, params);
      return result.insertId;
    }
  }

  public static async createOrderItem(
    item: {
      orderId: number;
      productId: number | string;
      vendorId: number | string;
      title: string;
      imageUrl: string;
      price: number;
      quantity: number;
      subtotal: number;
    },
    connection?: PoolConnection
  ): Promise<void> {
    const numericProductId = typeof item.productId === 'string' ? parseInt(item.productId, 10) : item.productId;
    const numericVendorId = typeof item.vendorId === 'string' ? parseInt(item.vendorId, 10) : item.vendorId;

    const sql = `
      INSERT INTO order_items (order_id, product_id, vendor_id, title, image_url, price, quantity, subtotal)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const params = [
      item.orderId,
      numericProductId,
      numericVendorId,
      item.title,
      item.imageUrl,
      item.price,
      item.quantity,
      item.subtotal,
    ];

    if (connection) {
      await connection.execute(sql, params);
    } else {
      await mysqlClient.execute(sql, params);
    }
  }

  public static async addStatusHistory(
    orderId: number,
    status: string,
    note?: string,
    connection?: PoolConnection
  ): Promise<void> {
    const sql = `INSERT INTO order_status_history (order_id, status, note) VALUES (?, ?, ?)`;
    const params = [orderId, status, note || `Order updated to ${status}`];

    if (connection) {
      await connection.execute(sql, params);
    } else {
      await mysqlClient.execute(sql, params);
    }
  }

  public static async findByCustomerId(customerId: number | string): Promise<OrderRow[]> {
    const numericCustomerId = typeof customerId === 'string' ? parseInt(customerId, 10) : customerId;
    const sql = `SELECT * FROM orders WHERE customer_id = ? ORDER BY created_at DESC`;
    return await mysqlClient.query<OrderRow[]>(sql, [numericCustomerId]);
  }

  public static async findByVendorId(vendorId: number | string): Promise<OrderRow[]> {
    const numericVendorId = typeof vendorId === 'string' ? parseInt(vendorId, 10) : vendorId;
    const sql = `
      SELECT DISTINCT o.*
      FROM orders o
      JOIN order_items oi ON o.id = oi.order_id
      WHERE oi.vendor_id = ?
      ORDER BY o.created_at DESC
    `;
    return await mysqlClient.query<OrderRow[]>(sql, [numericVendorId]);
  }

  public static async findAll(): Promise<OrderRow[]> {
    const sql = `SELECT * FROM orders ORDER BY created_at DESC`;
    return await mysqlClient.query<OrderRow[]>(sql);
  }

  public static async updateStatus(
    id: number | string,
    status: string,
    note?: string
  ): Promise<OrderRow | null> {
    const numericId = typeof id === 'string' ? parseInt(id, 10) : id;

    let sql = `UPDATE orders SET order_status = ? WHERE id = ?`;
    if (status === 'DELIVERED') {
      sql = `UPDATE orders SET order_status = ?, payment_status = 'PAID' WHERE id = ?`;
    }

    await mysqlClient.execute(sql, [status, numericId]);
    await this.addStatusHistory(numericId, status, note);

    return await this.findById(numericId);
  }

  public static async calculateTotalRevenue(): Promise<number> {
    const sql = `SELECT SUM(total_amount) as revenue FROM orders`;
    const rows = await mysqlClient.query<RowDataPacket[]>(sql);
    return Number(rows[0]?.revenue || 0);
  }
}
