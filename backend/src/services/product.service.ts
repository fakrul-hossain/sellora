import { ProductRepository, ProductRow } from '../models/product.repository.js';
import { AppError } from '../utils/app-error.js';
import { CreateProductInput, UpdateProductInput } from '../validators/product.validators.js';

/**
 * Product Service
 * Handles product browsing, search, vendor product creation, updates, and deletion.
 */
export class ProductService {
  /**
   * Helper function to format database product rows into clean JSON objects
   */
  public static formatProduct(row: ProductRow, images?: string[]) {
    let features: string[] = [];
    if (row.features_json) {
      try {
        features = typeof row.features_json === 'string' ? JSON.parse(row.features_json) : row.features_json;
      } catch {
        features = [];
      }
    }

    let specifications: any = null;
    if (row.specifications_json) {
      try {
        specifications = typeof row.specifications_json === 'string' ? JSON.parse(row.specifications_json) : row.specifications_json;
      } catch {
        specifications = null;
      }
    }

    const productStatus = Boolean(row.is_approved)
      ? 'ACCEPTED'
      : (row.is_published === 0 ? 'CANCELLED' : 'PENDING');

    const productImages = images && images.length > 0 ? images : [row.image_url];

    return {
      id: String(row.id),
      vendorId: String(row.vendor_id),
      category: row.category,
      brand: row.brand,
      title: row.title,
      slug: row.slug,
      sku: row.sku,
      description: row.description,
      price: Number(row.price),
      originalPrice: row.original_price ? Number(row.original_price) : Number(row.price),
      discountPercentage: Number(row.discount_percentage || 0),
      stock: Number(row.stock),
      imageUrl: row.image_url,
      images: productImages,
      videoUrl: row.video_url || undefined,
      specifications: specifications,
      inTheBox: row.in_the_box || undefined,
      warranty: row.warranty || undefined,
      features,
      rating: Number(row.rating),
      reviewCount: Number(row.review_count),
      isPublished: Boolean(row.is_published),
      isApproved: Boolean(row.is_approved),
      status: productStatus,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    };
  }

  /**
   * List products with search keyword, category, or vendor filter
   */
  public static async listProducts(query: { category?: string; search?: string; vendorId?: string; includeUnapproved?: boolean; status?: string }) {
    const rows = await ProductRepository.findAll(query);
    return rows.map((row) => this.formatProduct(row));
  }

  /**
   * Retrieve single product by ID
   */
  public static async getProductById(id: string) {
    const row = await ProductRepository.findById(id);
    if (!row) {
      throw AppError.notFound('Product not found');
    }
    const images = await ProductRepository.getProductImages(row.id);
    return this.formatProduct(row, images.length > 0 ? images : [row.image_url]);
  }

  /**
   * Create a new product (by Store Owner / Vendor)
   */
  public static async createProduct(vendorId: string, input: CreateProductInput & { videoUrl?: string; specifications?: any; inTheBox?: string; warranty?: string; isApproved?: boolean }) {
    if (input.sku && input.sku.trim()) {
      const existingSku = await ProductRepository.findBySku(input.sku.trim());
      if (existingSku) {
        throw AppError.conflict(`Product SKU "${input.sku.trim()}" is already in use by another listing. Please provide a unique SKU.`);
      }
    }

    // 1. Generate URL-friendly slug from title
    const slug = input.title.toLowerCase().replace(/[^a-z0-9]+/g, '-');

    // 2. Insert into MySQL products table (starts as PENDING for admin review)
    const created = await ProductRepository.create({
      vendorId,
      title: input.title,
      slug,
      description: input.description,
      category: input.category,
      brand: input.brand,
      price: input.price,
      originalPrice: input.originalPrice,
      stock: input.stock,
      sku: input.sku,
      imageUrl: input.imageUrl,
      images: input.images || (input.imageUrl ? [input.imageUrl] : []),
      videoUrl: input.videoUrl,
      specifications: input.specifications,
      inTheBox: input.inTheBox,
      warranty: input.warranty,
      features: input.features,
      isApproved: input.isApproved !== undefined ? input.isApproved : false,
    });

    return this.formatProduct(created, input.images);
  }

  /**
   * Update existing product
   */
  public static async updateProduct(id: string, vendorId: string, input: UpdateProductInput & { videoUrl?: string; specifications?: any; inTheBox?: string; warranty?: string }) {
    const updated = await ProductRepository.update(id, vendorId, {
      title: input.title,
      price: input.price,
      stock: input.stock,
      category: input.category,
      brand: input.brand,
      description: input.description,
      image_url: input.imageUrl,
      video_url: input.videoUrl,
      specifications: input.specifications,
      in_the_box: input.inTheBox,
      warranty: input.warranty,
      features: input.features,
    });

    if (!updated) {
      throw AppError.notFound('Product not found or access unauthorized');
    }

    return this.formatProduct(updated);
  }

  /**
   * Delete product
   */
  public static async deleteProduct(id: string, vendorId: string) {
    const success = await ProductRepository.delete(id, vendorId);
    if (!success) {
      throw AppError.notFound('Product not found or access unauthorized');
    }
    return { success: true };
  }

  /**
   * Get public Q&A for a product
   */
  public static async getQuestions(productId: string) {
    return await ProductRepository.getQuestionsByProductId(productId);
  }

  /**
   * Add a customer question for a product
   */
  public static async addQuestion(productId: string, userName: string, question: string) {
    return await ProductRepository.createQuestion(productId, userName, question);
  }
}
