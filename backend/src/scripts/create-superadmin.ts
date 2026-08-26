import { mysqlClient } from '../models/mysql.client.js';
import { DatabaseSchema } from '../models/schema.js';
import { UserRepository } from '../models/user.repository.js';
import { AuthUtil } from '../utils/jwt.util.js';
import { UserRole } from '../types/enums.types.js';
import { logger } from '../utils/logger.js';

async function createSuperAdmin() {
  try {
    await mysqlClient.connect();
    await DatabaseSchema.initializeSchema();

    const superAdminEmail = 'admin@sellora.com';
    const existing = await UserRepository.findByEmail(superAdminEmail);

    if (existing) {
      logger.info(`Super Admin user (${superAdminEmail}) already exists in MySQL.`);
    } else {
      const passwordHash = await AuthUtil.hashPassword('Admin123456');
      await UserRepository.create({
        name: 'SELLORA Super Administrator',
        email: superAdminEmail,
        passwordHash,
        role: UserRole.SUPER_ADMIN,
      });
      logger.info(`Successfully created Super Admin user in MySQL: ${superAdminEmail}`);
    }

    await mysqlClient.disconnect();
    process.exit(0);
  } catch (error) {
    logger.error('Failed to create superadmin:', error);
    await mysqlClient.disconnect();
    process.exit(1);
  }
}

createSuperAdmin();
