import { ObjectId } from 'mongodb';
import { mongoClient } from '../../../database/mongo.client.js';
import { AppError } from '../../../core/utils/app-error.js';
import { CreateProductInput, UpdateProductInput } from '@sellora/shared-validators';

export class ProductService {
  private static getCollection() {
    return mongoClient.getCollection('products');
  }

  public static async listProducts(query: { category?: string; search?: string; vendorId?: string }) {
    const products = this.getCollection();
    const filter: Record<string, any> = { isPublished: true };

    if (query.category) {
      filter.category = { $regex: new RegExp(query.category, 'i') };
    }
    if (query.vendorId) {
      filter.vendorId = query.vendorId;
    }
    if (query.search) {
      filter.$or = [
        { title: { $regex: new RegExp(query.search, 'i') } },
        { brand: { $regex: new RegExp(query.search, 'i') } },
        { category: { $regex: new RegExp(query.search, 'i') } },
      ];
    }

    const items = await products.find(filter).sort({ createdAt: -1 }).toArray();
    return items.map((item) => ({
      id: item._id.toString(),
      ...item,
      _id: undefined,
    }));
  }

  public static async getProductById(id: string) {
    const products = this.getCollection();
    let query: any = { _id: id };
    if (ObjectId.isValid(id)) {
      query = { _id: new ObjectId(id) };
    }

    const item = await products.findOne(query);
    if (!item) {
      throw AppError.notFound('Product not found');
    }

    return {
      id: item._id.toString(),
      ...item,
      _id: undefined,
    };
  }

  public static async createProduct(vendorId: string, input: CreateProductInput) {
    const products = this.getCollection();
    const docId = new ObjectId();

    const doc = {
      _id: docId,
      vendorId,
      ...input,
      slug: input.title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      rating: 4.8,
      reviewCount: 12,
      isPublished: true,
      isApproved: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    await products.insertOne(doc);
    return { id: docId.toString(), ...doc, _id: undefined };
  }

  public static async updateProduct(id: string, vendorId: string, input: UpdateProductInput) {
    const products = this.getCollection();
    const query: any = ObjectId.isValid(id) ? { _id: new ObjectId(id), vendorId } : { _id: id, vendorId };

    const result = await products.findOneAndUpdate(
      query,
      { $set: { ...input, updatedAt: new Date() } },
      { returnDocument: 'after' }
    );

    if (!result) {
      throw AppError.notFound('Product not found or access unauthorized');
    }

    return { id: result._id.toString(), ...result, _id: undefined };
  }

  public static async deleteProduct(id: string, vendorId: string) {
    const products = this.getCollection();
    const query: any = ObjectId.isValid(id) ? { _id: new ObjectId(id), vendorId } : { _id: id, vendorId };

    const res = await products.deleteOne(query);
    if (res.deletedCount === 0) {
      throw AppError.notFound('Product not found or access unauthorized');
    }
    return { success: true };
  }
}
