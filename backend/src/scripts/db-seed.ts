import { mysqlClient } from '../models/mysql.client.js';
import { DatabaseSchema } from '../models/schema.js';
import { UserRepository } from '../models/user.repository.js';
import { VendorRepository } from '../models/vendor.repository.js';
import { ProductRepository } from '../models/product.repository.js';
import { AuthUtil } from '../utils/jwt.util.js';
import { UserRole } from '../types/enums.types.js';
import { logger } from '../utils/logger.js';

async function runSeeder() {
  try {
    await mysqlClient.connect();
    await DatabaseSchema.initializeSchema();

    logger.info('Running MySQL Baseline Database Seeder...');

    // 1. Super Admin User Baseline
    let adminUser = await UserRepository.findByEmail('admin@sellora.com');
    if (!adminUser) {
      const passwordHash = await AuthUtil.hashPassword('Admin123456');
      adminUser = await UserRepository.create({
        name: 'SELLORA Super Admin',
        email: 'admin@sellora.com',
        passwordHash,
        role: UserRole.SUPER_ADMIN,
      });
      logger.info('Created Super Admin user (admin@sellora.com / Admin123456)');
    }

    // 2. Demo Vendor Store Baseline
    let vendor = await VendorRepository.findBySlug('remax-official');
    if (!vendor) {
      let sellerUser = await UserRepository.findByEmail('remax@sellora.com');
      if (!sellerUser) {
        const passwordHash = await AuthUtil.hashPassword('Vendor123456');
        sellerUser = await UserRepository.create({
          name: 'REMAX Official Manager',
          email: 'remax@sellora.com',
          passwordHash,
          role: UserRole.SELLER,
        });
      }

      vendor = await VendorRepository.create({
        ownerId: sellerUser.id,
        storeName: 'REMAX Official Hub',
        slug: 'remax-official',
        email: 'remax@sellora.com',
        phone: '+880 1711-000111',
        street: '55 Gulshan Avenue',
        city: 'Dhaka',
        area: 'Gulshan 2',
      });

      await UserRepository.updateVendorId(sellerUser.id, String(vendor.id));
      logger.info('Created REMAX Official Hub vendor store.');
    }

    // 3. Initial Baseline Products
    const productCount = await ProductRepository.countProducts();
    if (productCount === 0 && vendor) {
      await ProductRepository.create({
        vendorId: vendor.id,
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
        features: ['Active Noise Cancellation', '30-Hour Battery Life', '40mm Neodymium Drivers', 'Bluetooth 5.3 Low Latency'],
      });

      await ProductRepository.create({
        vendorId: vendor.id,
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
        features: ['A18 Pro Chip', 'Super Retina XDR Display', 'Action Button & Camera Control', '1 Year Apple Official Warranty'],
      });

      logger.info('Inserted baseline demo products into MySQL database.');
    }

    logger.info('Database seeding completed successfully.');
    await mysqlClient.disconnect();
    process.exit(0);
  } catch (error) {
    logger.error('Database seeding failed:', error);
    await mysqlClient.disconnect();
    process.exit(1);
  }
}

runSeeder();
