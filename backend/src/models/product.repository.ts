import { RowDataPacket, ResultSetHeader, PoolConnection } from 'mysql2/promise';
import { mysqlClient } from './mysql.client.js';

export interface ProductRow extends RowDataPacket {
  id: number;
  vendor_id: number;
  category_id?: number;
  category: string;
  brand: string;
  title: string;
  slug: string;
  sku: string;
  description: string;
  price: number;
  original_price?: number;
  discount_percentage: number;
  stock: number;
  image_url: string;
  features_json?: string;
  rating: number;
  review_count: number;
  is_published: number;
  is_approved: number;
  created_at: Date;
  updated_at: Date;
}

export interface UpdateProductPayload {
  title?: string;
  price?: number;
  stock?: number;
  category?: string;
  brand?: string;
  description?: string;
  image_url?: string;
  features?: string[];
}

export class ProductRepository {
  public static async findById(id: number | string): Promise<ProductRow | null> {
    const numericId = typeof id === 'string' ? parseInt(id, 10) : id;
    if (isNaN(numericId)) return null;

    const sql = `SELECT * FROM products WHERE id = ? LIMIT 1`;
    const rows = await mysqlClient.query<ProductRow[]>(sql, [numericId]);
    return rows.length > 0 ? rows[0] : null;
  }

  public static async findAll(query: { category?: string; search?: string; vendorId?: string }): Promise<ProductRow[]> {
    const whereConditions: string[] = ['is_published = 1'];
    const params: any[] = [];

    if (query.vendorId) {
      const numericVendorId = parseInt(query.vendorId, 10);
      if (!isNaN(numericVendorId)) {
        whereConditions.push('vendor_id = ?');
        params.push(numericVendorId);
      }
    }

    if (query.category) {
      whereConditions.push('LOWER(category) LIKE ?');
      params.push(`%${query.category.toLowerCase()}%`);
    }

    if (query.search) {
      whereConditions.push('(LOWER(title) LIKE ? OR LOWER(brand) LIKE ? OR LOWER(category) LIKE ?)');
      const searchTerm = `%${query.search.toLowerCase()}%`;
      params.push(searchTerm, searchTerm, searchTerm);
    }

    const sql = `
      SELECT * FROM products
      WHERE ${whereConditions.join(' AND ')}
      ORDER BY created_at DESC
    `;

    return await mysqlClient.query<ProductRow[]>(sql, params);
  }

  public static async create(product: {
    vendorId: number | string;
    title: string;
    slug: string;
    description: string;
    category: string;
    brand?: string;
    price: number;
    originalPrice?: number;
    discountPercentage?: number;
    stock: number;
    sku?: string;
    imageUrl?: string;
    features?: string[];
  }): Promise<ProductRow> {
    const numericVendorId = typeof product.vendorId === 'string' ? parseInt(product.vendorId, 10) : product.vendorId;
    const generatedSku = product.sku || `SKU-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    const defaultImage = product.imageUrl || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=1000';

    const sql = `
      INSERT INTO products (
        vendor_id, category, brand, title, slug, sku, description,
        price, original_price, discount_percentage, stock, image_url,
        features_json, rating, review_count, is_published, is_approved
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 4.80, 12, 1, 1)
    `;

    const result = await mysqlClient.execute(sql, [
      numericVendorId,
      product.category || 'General',
      product.brand || 'Generic',
      product.title,
      product.slug,
      generatedSku,
      product.description || '',
      product.price,
      product.originalPrice || product.price,
      product.discountPercentage || 0,
      product.stock,
      defaultImage,
      JSON.stringify(product.features || []),
    ]);

    const created = await this.findById(result.insertId);
    if (!created) throw new Error('Failed to create product.');
    return created;
  }

  public static async update(
    id: number | string,
    vendorId: number | string,
    input: UpdateProductPayload
  ): Promise<ProductRow | null> {
    const numericId = typeof id === 'string' ? parseInt(id, 10) : id;
    const numericVendorId = typeof vendorId === 'string' ? parseInt(vendorId, 10) : vendorId;

    const fields: string[] = [];
    const values: any[] = [];

    if (input.title !== undefined) { fields.push('title = ?'); values.push(input.title); }
    if (input.price !== undefined) { fields.push('price = ?'); values.push(input.price); }
    if (input.stock !== undefined) { fields.push('stock = ?'); values.push(input.stock); }
    if (input.category !== undefined) { fields.push('category = ?'); values.push(input.category); }
    if (input.brand !== undefined) { fields.push('brand = ?'); values.push(input.brand); }
    if (input.description !== undefined) { fields.push('description = ?'); values.push(input.description); }
    if (input.image_url !== undefined) { fields.push('image_url = ?'); values.push(input.image_url); }
    if (input.features !== undefined) { fields.push('features_json = ?'); values.push(JSON.stringify(input.features)); }

    if (fields.length === 0) {
      return await this.findById(numericId);
    }

    values.push(numericId, numericVendorId);
    const sql = `UPDATE products SET ${fields.join(', ')} WHERE id = ? AND vendor_id = ?`;
    await mysqlClient.execute(sql, values);

    return await this.findById(numericId);
  }

  public static async delete(id: number | string, vendorId: number | string): Promise<boolean> {
    const numericId = typeof id === 'string' ? parseInt(id, 10) : id;
    const numericVendorId = typeof vendorId === 'string' ? parseInt(vendorId, 10) : vendorId;

    const sql = `DELETE FROM products WHERE id = ? AND vendor_id = ?`;
    const result = await mysqlClient.execute(sql, [numericId, numericVendorId]);
    return result.affectedRows > 0;
  }

  public static async decrementStock(
    productId: number | string,
    quantity: number,
    connection?: PoolConnection
  ): Promise<boolean> {
    const numericId = typeof productId === 'string' ? parseInt(productId, 10) : productId;
    const sql = `
      UPDATE products
      SET stock = stock - ?
      WHERE id = ? AND stock >= ?
    `;

    if (connection) {
      const [result] = await connection.execute<ResultSetHeader>(sql, [quantity, numericId, quantity]);
      return result.affectedRows > 0;
    } else {
      const result = await mysqlClient.execute(sql, [quantity, numericId, quantity]);
      return result.affectedRows > 0;
    }
  }

  public static async countProducts(vendorId?: number | string): Promise<number> {
    if (vendorId) {
      const numericVendorId = typeof vendorId === 'string' ? parseInt(vendorId, 10) : vendorId;
      const sql = `SELECT COUNT(*) as count FROM products WHERE vendor_id = ?`;
      const rows = await mysqlClient.query<RowDataPacket[]>(sql, [numericVendorId]);
      return rows[0]?.count || 0;
    } else {
      const sql = `SELECT COUNT(*) as count FROM products`;
      const rows = await mysqlClient.query<RowDataPacket[]>(sql);
      return rows[0]?.count || 0;
    }
  }
}
