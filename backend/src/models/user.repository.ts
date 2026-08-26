import { RowDataPacket } from 'mysql2/promise';
import { mysqlClient } from './mysql.client.js';

export interface UserRow extends RowDataPacket {
  id: number;
  name: string;
  email: string;
  password_hash: string;
  phone: string;
  role: 'CUSTOMER' | 'SELLER' | 'ADMIN' | 'SUPER_ADMIN';
  avatar_url?: string;
  is_email_verified: number;
  vendor_id?: string;
  created_at: Date;
  updated_at: Date;
}

export interface AddressRow extends RowDataPacket {
  id: number;
  user_id: number;
  full_name: string;
  phone: string;
  street: string;
  city: string;
  area: string;
  postal_code?: string;
  is_default: number;
}

export class UserRepository {
  public static async findByEmail(email: string): Promise<UserRow | null> {
    const sql = `SELECT * FROM users WHERE email = ? LIMIT 1`;
    const rows = await mysqlClient.query<UserRow[]>(sql, [email]);
    return rows.length > 0 ? rows[0] : null;
  }

  public static async findById(id: number | string): Promise<UserRow | null> {
    const numericId = typeof id === 'string' ? parseInt(id, 10) : id;
    if (isNaN(numericId)) return null;

    const sql = `SELECT * FROM users WHERE id = ? LIMIT 1`;
    const rows = await mysqlClient.query<UserRow[]>(sql, [numericId]);
    return rows.length > 0 ? rows[0] : null;
  }

  public static async create(user: {
    name: string;
    email: string;
    passwordHash: string;
    role: string;
    phone?: string;
    vendorId?: string;
  }): Promise<UserRow> {
    const sql = `
      INSERT INTO users (name, email, password_hash, role, phone, vendor_id, is_email_verified)
      VALUES (?, ?, ?, ?, ?, ?, 1)
    `;
    const result = await mysqlClient.execute(sql, [
      user.name,
      user.email,
      user.passwordHash,
      user.role,
      user.phone || '',
      user.vendorId || null,
    ]);

    const created = await this.findById(result.insertId);
    if (!created) throw new Error('Failed to retrieve newly created user.');
    return created;
  }

  public static async updateVendorId(userId: number | string, vendorId: string): Promise<void> {
    const numericId = typeof userId === 'string' ? parseInt(userId, 10) : userId;
    const sql = `UPDATE users SET vendor_id = ? WHERE id = ?`;
    await mysqlClient.execute(sql, [vendorId, numericId]);
  }

  public static async getUserAddresses(userId: number | string): Promise<AddressRow[]> {
    const numericId = typeof userId === 'string' ? parseInt(userId, 10) : userId;
    const sql = `SELECT * FROM user_addresses WHERE user_id = ? ORDER BY is_default DESC, id DESC`;
    return await mysqlClient.query<AddressRow[]>(sql, [numericId]);
  }

  public static async countCustomers(): Promise<number> {
    const sql = `SELECT COUNT(*) as count FROM users WHERE role = 'CUSTOMER'`;
    const rows = await mysqlClient.query<RowDataPacket[]>(sql);
    return rows[0]?.count || 0;
  }
}
