import { env } from './env.config.js';

export const redisConfig = {
  host: env.REDIS_HOST,
  port: env.REDIS_PORT,
  password: env.REDIS_PASSWORD || undefined,
  connectTimeout: 10000,
  maxRetriesPerRequest: null,
};
