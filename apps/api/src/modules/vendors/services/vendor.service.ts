import { ObjectId } from 'mongodb';
import { mongoClient } from '../../../database/mongo.client.js';
import { AppError } from '../../../core/utils/app-error.js';
import { VendorStatus } from '@sellora/shared-types';

export class VendorService {
  private static getCollection() {
    return mongoClient.getCollection('vendors');
  }

  private static getOrdersCollection() {
    return mongoClient.getCollection('orders');
  }

  private static getProductsCollection() {
    return mongoClient.getCollection('products');
  }

  public static async getVendorByUserId(userId: string) {
    const vendors = this.getCollection();
    const vendor = await vendors.findOne({ ownerId: userId });
    if (!vendor) {
      throw AppError.notFound('Vendor store profile not found');
    }
    return { id: vendor._id.toString(), ...vendor, _id: undefined };
  }

  public static async getVendorAnalytics(vendorId: string) {
    const orders = this.getOrdersCollection();
    const products = this.getProductsCollection();

    const vendorOrders = await orders.find({ 'items.vendorId': vendorId }).toArray();
    const totalProducts = await products.countDocuments({ vendorId });

    let totalSales = 0;
    let pendingOrders = 0;

    vendorOrders.forEach((ord) => {
      if (ord.orderStatus === 'PENDING' || ord.orderStatus === 'PROCESSING') {
        pendingOrders += 1;
      }
      ord.items.forEach((item: any) => {
        if (item.vendorId === vendorId) {
          totalSales += item.price * item.quantity;
        }
      });
    });

    return {
      totalSales,
      totalOrders: vendorOrders.length,
      totalProducts,
      pendingOrders,
    };
  }

  public static async updateVendorProfile(vendorId: string, input: any) {
    const vendors = this.getCollection();
    const query: any = ObjectId.isValid(vendorId) ? { _id: new ObjectId(vendorId) } : { _id: vendorId };

    const result = await vendors.findOneAndUpdate(
      query,
      { $set: { ...input, updatedAt: new Date() } },
      { returnDocument: 'after' }
    );

    if (!result) {
      throw AppError.notFound('Vendor store not found');
    }
    return { id: result._id.toString(), ...result, _id: undefined };
  }
}
