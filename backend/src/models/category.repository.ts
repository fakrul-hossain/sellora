import { RowDataPacket } from 'mysql2/promise';
import { mysqlClient } from './mysql.client.js';

export interface CategoryRow extends RowDataPacket {
  id: number;
  parent_id?: number;
  name: string;
  slug: string;
  icon?: string;
  description?: string;
  status: 'ACTIVE' | 'INACTIVE';
  created_at: Date;
  updated_at: Date;
}

export class CategoryRepository {
  public static async findById(id: number | string): Promise<CategoryRow | null> {
    const numericId = typeof id === 'string' ? parseInt(id, 10) : id;
    if (isNaN(numericId)) return null;

    const sql = `SELECT * FROM categories WHERE id = ? LIMIT 1`;
    const rows = await mysqlClient.query<CategoryRow[]>(sql, [numericId]);
    return rows.length > 0 ? rows[0] : null;
  }

  public static async findBySlug(slug: string): Promise<CategoryRow | null> {
    const sql = `SELECT * FROM categories WHERE slug = ? LIMIT 1`;
    const rows = await mysqlClient.query<CategoryRow[]>(sql, [slug]);
    return rows.length > 0 ? rows[0] : null;
  }

  public static async listAll(): Promise<CategoryRow[]> {
    const sql = `SELECT * FROM categories WHERE status = 'ACTIVE' ORDER BY name ASC`;
    return await mysqlClient.query<CategoryRow[]>(sql);
  }

  public static async create(category: {
    name: string;
    slug: string;
    parentId?: number;
    icon?: string;
    description?: string;
  }): Promise<CategoryRow> {
    const sql = `
      INSERT INTO categories (name, slug, parent_id, icon, description, status)
      VALUES (?, ?, ?, ?, ?, 'ACTIVE')
    `;
    const result = await mysqlClient.execute(sql, [
      category.name,
      category.slug,
      category.parentId || null,
      category.icon || null,
      category.description || null,
    ]);

    const created = await this.findById(result.insertId);
    if (!created) throw new Error('Failed to create category.');
    return created;
  }
}
