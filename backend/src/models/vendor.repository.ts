import { RowDataPacket } from 'mysql2/promise';
import { mysqlClient } from './mysql.client.js';

export interface VendorRow extends RowDataPacket {
  id: number;
  owner_id: number;
  store_name: string;
  slug: string;
  logo_url?: string;
  banner_url?: string;
  description?: string;
  phone: string;
  email: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'SUSPENDED';
  commission_rate: number;
  balance: number;
  street: string;
  city: string;
  area: string;
  rating: number;
  review_count: number;
  created_at: Date;
  updated_at: Date;
}

export interface UpdateVendorPayload {
  store_name?: string;
  slug?: string;
  phone?: string;
  description?: string;
  logo_url?: string;
  banner_url?: string;
  street?: string;
  city?: string;
  area?: string;
}

export class VendorRepository {
  public static async findById(id: number | string): Promise<VendorRow | null> {
    const numericId = typeof id === 'string' ? parseInt(id, 10) : id;
    if (isNaN(numericId)) return null;

    const sql = `SELECT * FROM vendors WHERE id = ? LIMIT 1`;
    const rows = await mysqlClient.query<VendorRow[]>(sql, [numericId]);
    return rows.length > 0 ? rows[0] : null;
  }

  public static async findByOwnerId(ownerId: number | string): Promise<VendorRow | null> {
    const numericOwnerId = typeof ownerId === 'string' ? parseInt(ownerId, 10) : ownerId;
    if (isNaN(numericOwnerId)) return null;

    const sql = `SELECT * FROM vendors WHERE owner_id = ? LIMIT 1`;
    const rows = await mysqlClient.query<VendorRow[]>(sql, [numericOwnerId]);
    return rows.length > 0 ? rows[0] : null;
  }

  public static async findBySlug(slug: string): Promise<VendorRow | null> {
    const sql = `SELECT * FROM vendors WHERE slug = ? LIMIT 1`;
    const rows = await mysqlClient.query<VendorRow[]>(sql, [slug]);
    return rows.length > 0 ? rows[0] : null;
  }

  public static async create(vendor: {
    ownerId: number | string;
    storeName: string;
    slug: string;
    email: string;
    phone?: string;
    status?: string;
    commissionRate?: number;
    street?: string;
    city?: string;
    area?: string;
  }): Promise<VendorRow> {
    const numericOwnerId = typeof vendor.ownerId === 'string' ? parseInt(vendor.ownerId, 10) : vendor.ownerId;
    const sql = `
      INSERT INTO vendors (
        owner_id, store_name, slug, email, phone, status, commission_rate,
        balance, street, city, area, rating, review_count
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, 0.00, ?, ?, ?, 5.00, 0)
    `;
    const result = await mysqlClient.execute(sql, [
      numericOwnerId,
      vendor.storeName,
      vendor.slug,
      vendor.email,
      vendor.phone || '',
      vendor.status || 'APPROVED',
      vendor.commissionRate || 5.0,
      vendor.street || '',
      vendor.city || 'Dhaka',
      vendor.area || 'Central',
    ]);

    const created = await this.findById(result.insertId);
    if (!created) throw new Error('Failed to retrieve newly created vendor store.');
    return created;
  }

  public static async update(id: number | string, input: UpdateVendorPayload): Promise<VendorRow | null> {
    const numericId = typeof id === 'string' ? parseInt(id, 10) : id;

    const fields: string[] = [];
    const values: any[] = [];

    if (input.store_name !== undefined) { fields.push('store_name = ?'); values.push(input.store_name); }
    if (input.slug !== undefined) { fields.push('slug = ?'); values.push(input.slug); }
    if (input.phone !== undefined) { fields.push('phone = ?'); values.push(input.phone); }
    if (input.description !== undefined) { fields.push('description = ?'); values.push(input.description); }
    if (input.logo_url !== undefined) { fields.push('logo_url = ?'); values.push(input.logo_url); }
    if (input.banner_url !== undefined) { fields.push('banner_url = ?'); values.push(input.banner_url); }
    if (input.street !== undefined) { fields.push('street = ?'); values.push(input.street); }
    if (input.city !== undefined) { fields.push('city = ?'); values.push(input.city); }
    if (input.area !== undefined) { fields.push('area = ?'); values.push(input.area); }

    if (fields.length === 0) {
      return await this.findById(numericId);
    }

    values.push(numericId);
    const sql = `UPDATE vendors SET ${fields.join(', ')} WHERE id = ?`;
    await mysqlClient.execute(sql, values);

    return await this.findById(numericId);
  }

  public static async updateStatus(id: number | string, status: string): Promise<VendorRow | null> {
    const numericId = typeof id === 'string' ? parseInt(id, 10) : id;
    const sql = `UPDATE vendors SET status = ? WHERE id = ?`;
    await mysqlClient.execute(sql, [status, numericId]);
    return await this.findById(numericId);
  }

  public static async listAll(): Promise<VendorRow[]> {
    const sql = `SELECT * FROM vendors ORDER BY created_at DESC`;
    return await mysqlClient.query<VendorRow[]>(sql);
  }

  public static async countVendors(): Promise<number> {
    const sql = `SELECT COUNT(*) as count FROM vendors`;
    const rows = await mysqlClient.query<RowDataPacket[]>(sql);
    return rows[0]?.count || 0;
  }
}
