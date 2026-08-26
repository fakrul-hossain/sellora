import { env } from './env.config.js';

export const databaseConfig = {
  host: env.DB_HOST,
  port: env.DB_PORT,
  user: env.DB_USER,
  password: env.DB_PASSWORD,
  database: env.DB_NAME,
  connectionLimit: env.DB_CONNECTION_LIMIT,
  waitForConnections: true,
  queueLimit: 0,
  multipleStatements: true,
  ssl: (env.DB_SSL || env.DB_HOST.includes('aivencloud.com')) ? { rejectUnauthorized: false } : undefined,
};
