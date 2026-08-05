import { ObjectId } from 'mongodb';
import { mongoClient } from '../../../database/mongo.client.js';
import { AppError } from '../../../core/utils/app-error.js';
import { VendorStatus } from '@sellora/shared-types';

export class AdminService {
  private static getVendorsCollection() {
    return mongoClient.getCollection('vendors');
  }

  private static getUsersCollection() {
    return mongoClient.getCollection('users');
  }

  private static getOrdersCollection() {
    return mongoClient.getCollection('orders');
  }

  private static getProductsCollection() {
    return mongoClient.getCollection('products');
  }

  private static getSiteSettingsCollection() {
    return mongoClient.getCollection('site_settings');
  }

  public static async getPlatformAnalytics() {
    const orders = this.getOrdersCollection();
    const vendors = this.getVendorsCollection();
    const users = this.getUsersCollection();
    const products = this.getProductsCollection();

    const allOrders = await orders.find({}).toArray();
    const totalRevenue = allOrders.reduce((sum, ord) => sum + (ord.totalAmount || 0), 0);
    const totalVendors = await vendors.countDocuments({});
    const totalCustomers = await users.countDocuments({ role: 'CUSTOMER' });
    const totalProducts = await products.countDocuments({});

    return {
      totalRevenue,
      totalOrders: allOrders.length,
      totalVendors,
      totalCustomers,
      totalProducts,
    };
  }

  public static async listVendors() {
    const vendors = this.getVendorsCollection();
    const items = await vendors.find({}).toArray();
    return items.map((item) => ({ id: item._id.toString(), ...item, _id: undefined }));
  }

  public static async updateVendorStatus(vendorId: string, status: VendorStatus) {
    const vendors = this.getVendorsCollection();
    const query: any = ObjectId.isValid(vendorId) ? { _id: new ObjectId(vendorId) } : { _id: vendorId };

    const result = await vendors.findOneAndUpdate(
      query,
      { $set: { status, updatedAt: new Date() } },
      { returnDocument: 'after' }
    );

    if (!result) {
      throw AppError.notFound('Vendor store not found');
    }
    return { id: result._id.toString(), ...result, _id: undefined };
  }

  public static async getSiteSettings() {
    const settings = this.getSiteSettingsCollection();
    const doc = await settings.findOne({});
    if (!doc) {
      const defaultDoc = {
        siteName: 'SELLORA Bangladesh',
        supportPhone: '+880 9612-345678',
        supportEmail: 'support@sellora.com',
        banners: [],
        announcementText: '🎉 Welcome to SELLORA! Free Express Shipping on orders over ৳5,000.',
        defaultCommissionRate: 5.0,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      const res = await settings.insertOne(defaultDoc as any);
      return { id: res.insertedId.toString(), ...defaultDoc };
    }
    return { id: doc._id.toString(), ...doc, _id: undefined };
  }

  public static async updateSiteSettings(input: any) {
    const settings = this.getSiteSettingsCollection();
    const doc = await settings.findOne({});
    if (!doc) {
      await this.getSiteSettings();
    }
    const result = await settings.findOneAndUpdate(
      {},
      { $set: { ...input, updatedAt: new Date() } },
      { returnDocument: 'after' }
    );
    return { id: result!._id.toString(), ...result, _id: undefined };
  }
}
