import { mongoClient } from './mongo.client.js';
import { Collections } from '../core/constants/collections.js';
import { logger } from '../core/utils/logger.js';

export class DatabaseIndexManager {
  public static async createIndexes(): Promise<void> {
    const db = await mongoClient.connect();
    logger.info('Initializing collection indexes across SELLORA database schema...');

    // Users Collection Indexes
    const users = db.collection(Collections.USERS);
    await users.createIndex({ email: 1 }, { unique: true, name: 'idx_users_email_unique' });
    await users.createIndex({ role: 1 }, { name: 'idx_users_role' });

    // Products Collection Indexes
    const products = db.collection(Collections.PRODUCTS);
    await products.createIndex({ slug: 1 }, { unique: true, name: 'idx_products_slug_unique' });
    await products.createIndex({ title: 'text', description: 'text' }, { name: 'idx_products_text_search' });
    await products.createIndex({ categoryId: 1, status: 1 }, { name: 'idx_products_category_status' });

    // Orders Collection Indexes
    const orders = db.collection(Collections.ORDERS);
    await orders.createIndex({ orderNumber: 1 }, { unique: true, name: 'idx_orders_number_unique' });
    await orders.createIndex({ customerId: 1, createdAt: -1 }, { name: 'idx_orders_customer_date' });

    logger.info('Collection indexes verified and built successfully.');
  }
}
