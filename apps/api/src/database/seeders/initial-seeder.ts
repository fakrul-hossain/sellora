import { ObjectId } from 'mongodb';
import { mongoClient } from '../mongo.client.js';
import { logger } from '../../core/utils/logger.js';
import { AuthUtil } from '../../core/utils/jwt.util.js';
import { UserRole, VendorStatus } from '@sellora/shared-types';

export class InitialDatabaseSeeder {
  public static async run(): Promise<void> {
    const db = await mongoClient.connect();
    logger.info('Running Initial Database Seeder...');

    // 1. Admin User Baseline
    const usersCollection = db.collection('users');
    const existingAdmin = await usersCollection.findOne({ email: 'admin@sellora.com' });

    if (!existingAdmin) {
      const passwordHash = await AuthUtil.hashPassword('Admin123456');
      await usersCollection.insertOne({
        _id: new ObjectId(),
        name: 'SELLORA Super Admin',
        email: 'admin@sellora.com',
        passwordHash,
        role: UserRole.SUPER_ADMIN,
        isEmailVerified: true,
        addresses: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      logger.info('Created Super Admin user (admin@sellora.com / Admin123456)');
    }

    // 2. Demo Vendor Store Baseline
    const vendorsCollection = db.collection('vendors');
    const existingVendor = await vendorsCollection.findOne({ slug: 'remax-official' });
    let vendorId = 'v-remax-001';

    if (!existingVendor) {
      const vId = new ObjectId();
      vendorId = vId.toString();
      await vendorsCollection.insertOne({
        _id: vId,
        ownerId: 'admin-owner',
        storeName: 'REMAX Official Hub',
        slug: 'remax-official',
        description: 'Official Direct Distributor for REMAX Audio & Accessories in Bangladesh',
        phone: '+880 1711-000111',
        email: 'remax@sellora.com',
        status: VendorStatus.APPROVED,
        commissionRate: 5.0,
        balance: 145000,
        address: { street: '55 Gulshan Avenue', city: 'Dhaka', area: 'Gulshan 2' },
        rating: 4.9,
        reviewCount: 320,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      logger.info('Created REMAX Official Hub vendor store.');
    }

    // 3. Initial Products Baseline
    const productsCollection = db.collection('products');
    const existingProductCount = await productsCollection.countDocuments({});

    if (existingProductCount === 0) {
      await productsCollection.insertMany([
        {
          _id: new ObjectId(),
          vendorId,
          title: 'REMAX Wireless Noise Cancelling Headphones - RB-750HB',
          slug: 'remax-rb-750hb-headphones',
          description: 'High performance active noise cancelling studio acoustic headphones with 40mm drivers and 30-hour battery life.',
          category: 'Audio',
          brand: 'REMAX',
          price: 2850,
          originalPrice: 3800,
          discountPercentage: 25,
          stock: 45,
          sku: 'RMX-RB750-BLK',
          imageUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80',
          images: [
            'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80',
          ],
          features: ['Active Noise Cancellation', '30-Hour Battery Life', '40mm Neodymium Drivers', 'Bluetooth 5.3 Low Latency'],
          rating: 4.8,
          reviewCount: 42,
          isPublished: true,
          isApproved: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          _id: new ObjectId(),
          vendorId,
          title: 'Apple iPhone 16 Pro Max - 256GB Natural Titanium',
          slug: 'iphone-16-pro-max-256gb',
          description: 'Official Apple Warranty iPhone 16 Pro Max featuring A18 Pro Bionic Chip and 48MP Fusion Camera system.',
          category: 'Mobiles',
          brand: 'APPLE',
          price: 168000,
          originalPrice: 175000,
          discountPercentage: 4,
          stock: 12,
          sku: 'APL-IP16PM-256',
          imageUrl: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&w=800&q=80',
          images: [
            'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&w=800&q=80',
          ],
          features: ['A18 Pro Chip', 'Super Retina XDR Display', 'Action Button & Camera Control', '1 Year Apple Official Warranty'],
          rating: 5.0,
          reviewCount: 89,
          isPublished: true,
          isApproved: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ]);
      logger.info('Inserted baseline products into MongoDB.');
    }

    logger.info('Database seeder execution finished successfully.');
  }
}
