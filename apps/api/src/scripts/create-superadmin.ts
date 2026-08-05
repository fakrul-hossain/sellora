import { mongoClient } from '../database/mongo.client.js';
import { Collections } from '../core/constants/collections.js';
import { UserRole } from '@sellora/shared-types';
import { logger } from '../core/utils/logger.js';

async function createSuperAdmin() {
  try {
    const db = await mongoClient.connect();
    const usersCollection = db.collection(Collections.USERS);

    const superAdminEmail = 'admin@sellora.com';
    const existing = await usersCollection.findOne({ email: superAdminEmail });

    if (existing) {
      logger.info(`Super Admin user (${superAdminEmail}) already exists.`);
    } else {
      await usersCollection.insertOne({
        email: superAdminEmail,
        fullName: 'SELLORA Super Administrator',
        role: UserRole.SUPER_ADMIN,
        isVerified: true,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      logger.info(`Successfully created Super Admin user: ${superAdminEmail}`);
    }

    await mongoClient.disconnect();
    process.exit(0);
  } catch (error) {
    logger.error('Failed to create superadmin:', error);
    await mongoClient.disconnect();
    process.exit(1);
  }
}

createSuperAdmin();
