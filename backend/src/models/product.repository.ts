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
  video_url?: string;
  specifications_json?: string;
  in_the_box?: string;
  warranty?: string;
  features_json?: string;
  rating: number;
  review_count: number;
  is_published: number;
  is_approved: number;
  created_at: Date;
  updated_at: Date;
}

export interface ProductQuestionRow extends RowDataPacket {
  id: number;
  product_id: number;
  user_name: string;
  question: string;
  answer?: string;
  answered_by?: string;
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
  video_url?: string;
  specifications?: any;
  in_the_box?: string;
  warranty?: string;
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

  public static async findBySku(sku: string): Promise<ProductRow | null> {
    if (!sku || !sku.trim()) return null;
    const sql = `SELECT * FROM products WHERE LOWER(sku) = LOWER(?) LIMIT 1`;
    const rows = await mysqlClient.query<ProductRow[]>(sql, [sku.trim()]);
    return rows.length > 0 ? rows[0] : null;
  }

  public static async getProductImages(productId: number | string): Promise<string[]> {
    const numericId = typeof productId === 'string' ? parseInt(productId, 10) : productId;
    if (isNaN(numericId)) return [];

    try {
      const rows = await mysqlClient.query<any[]>(
        `SELECT image_url FROM product_images WHERE product_id = ? ORDER BY sort_order ASC, id ASC`,
        [numericId]
      );
      return rows.map((r) => r.image_url);
    } catch {
      return [];
    }
  }

  public static async findAll(query: { category?: string; search?: string; vendorId?: string; includeUnapproved?: boolean; status?: string }): Promise<ProductRow[]> {
    const whereConditions: string[] = ['is_published = 1'];
    
    // When vendorId is specified, the vendor must see all their products (both pending & approved)
    if (!query.includeUnapproved && !query.vendorId) {
      whereConditions.push('is_approved = 1');
    }

    if (query.status) {
      if (query.status.toUpperCase() === 'APPROVED' || query.status.toUpperCase() === 'ACCEPTED') {
        whereConditions.push('is_approved = 1');
      } else if (query.status.toUpperCase() === 'PENDING') {
        whereConditions.push('is_approved = 0');
      }
    }

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
    images?: string[];
    videoUrl?: string;
    specifications?: any;
    inTheBox?: string;
    warranty?: string;
    features?: string[];
    isApproved?: boolean;
  }): Promise<ProductRow> {
    const numericVendorId = typeof product.vendorId === 'string' ? parseInt(product.vendorId, 10) : product.vendorId;
    const generatedSku = product.sku || `SKU-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    const defaultImage = product.imageUrl || (product.images && product.images[0]) || '';
    const isApprovedVal = product.isApproved !== undefined ? (product.isApproved ? 1 : 0) : 0;

    const sql = `
      INSERT INTO products (
        vendor_id, category, brand, title, slug, sku, description,
        price, original_price, discount_percentage, stock, image_url,
        video_url, specifications_json, in_the_box, warranty,
        features_json, rating, review_count, is_published, is_approved
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 4.80, 12, 1, ?)
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
      product.videoUrl || null,
      product.specifications ? JSON.stringify(product.specifications) : null,
      product.inTheBox || null,
      product.warranty || null,
      JSON.stringify(product.features || []),
      isApprovedVal,
    ]);

    const newProductId = result.insertId;

    // Save multiple images into product_images table
    const allImagesToInsert = (product.images && product.images.length > 0)
      ? product.images
      : [defaultImage];

    for (let i = 0; i < allImagesToInsert.length; i++) {
      const img = allImagesToInsert[i];
      if (img && typeof img === 'string' && img.trim()) {
        try {
          await mysqlClient.execute(
            `INSERT INTO product_images (product_id, image_url, is_primary, sort_order)
             VALUES (?, ?, ?, ?)`,
            [newProductId, img.trim(), i === 0 ? 1 : 0, i]
          );
        } catch {
          // Ignore individual image insertion error
        }
      }
    }

    const created = await this.findById(newProductId);
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
    if (input.video_url !== undefined) { fields.push('video_url = ?'); values.push(input.video_url); }
    if (input.specifications !== undefined) { fields.push('specifications_json = ?'); values.push(JSON.stringify(input.specifications)); }
    if (input.in_the_box !== undefined) { fields.push('in_the_box = ?'); values.push(input.in_the_box); }
    if (input.warranty !== undefined) { fields.push('warranty = ?'); values.push(input.warranty); }
    if (input.features !== undefined) { fields.push('features_json = ?'); values.push(JSON.stringify(input.features)); }

    if (fields.length === 0) {
      return await this.findById(numericId);
    }

    values.push(numericId, numericVendorId);
    const sql = `UPDATE products SET ${fields.join(', ')} WHERE id = ? AND vendor_id = ?`;
    await mysqlClient.execute(sql, values);

    return await this.findById(numericId);
  }

  public static async updateApprovalStatus(id: number | string, isApproved: boolean): Promise<ProductRow | null> {
    const numericId = typeof id === 'string' ? parseInt(id, 10) : id;
    const sql = `UPDATE products SET is_approved = ? WHERE id = ?`;
    await mysqlClient.execute(sql, [isApproved ? 1 : 0, numericId]);
    return await this.findById(numericId);
  }

  public static async getQuestionsByProductId(productId: number | string): Promise<ProductQuestionRow[]> {
    const numericId = typeof productId === 'string' ? parseInt(productId, 10) : productId;
    const sql = `SELECT * FROM product_questions WHERE product_id = ? ORDER BY created_at DESC`;
    return await mysqlClient.query<ProductQuestionRow[]>(sql, [numericId]);
  }

  public static async createQuestion(productId: number | string, userName: string, question: string): Promise<ProductQuestionRow> {
    const numericId = typeof productId === 'string' ? parseInt(productId, 10) : productId;
    const sql = `INSERT INTO product_questions (product_id, user_name, question) VALUES (?, ?, ?)`;
    const result = await mysqlClient.execute(sql, [numericId, userName, question]);
    const rows = await mysqlClient.query<ProductQuestionRow[]>(`SELECT * FROM product_questions WHERE id = ?`, [result.insertId]);
    return rows[0];
  }

  public static async answerQuestion(questionId: number | string, answer: string, answeredBy: string): Promise<boolean> {
    const numericId = typeof questionId === 'string' ? parseInt(questionId, 10) : questionId;
    const sql = `UPDATE product_questions SET answer = ?, answered_by = ? WHERE id = ?`;
    const result = await mysqlClient.execute(sql, [answer, answeredBy, numericId]);
    return result.affectedRows > 0;
  }

  public static async updateStock(productId: number | string, vendorId: number | string, newStock: number): Promise<boolean> {
    const numericId = typeof productId === 'string' ? parseInt(productId, 10) : productId;
    const numericVendorId = typeof vendorId === 'string' ? parseInt(vendorId, 10) : vendorId;

    const sql = `UPDATE products SET stock = ? WHERE id = ? AND vendor_id = ?`;
    const result = await mysqlClient.execute(sql, [newStock, numericId, numericVendorId]);
    return result.affectedRows > 0;
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

  public static async countLowStock(vendorId?: number | string, threshold: number = 5): Promise<number> {
    if (vendorId) {
      const numericVendorId = typeof vendorId === 'string' ? parseInt(vendorId, 10) : vendorId;
      const sql = `SELECT COUNT(*) as count FROM products WHERE vendor_id = ? AND stock <= ?`;
      const rows = await mysqlClient.query<RowDataPacket[]>(sql, [numericVendorId, threshold]);
      return rows[0]?.count || 0;
    } else {
      const sql = `SELECT COUNT(*) as count FROM products WHERE stock <= ?`;
      const rows = await mysqlClient.query<RowDataPacket[]>(sql, [threshold]);
      return rows[0]?.count || 0;
    }
  }
}
