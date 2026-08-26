import { env } from './env.config.js';

export const loggerConfig = {
  level: env.NODE_ENV === 'production' ? 'info' : 'debug',
  logDir: 'logs',
  maxSize: '20m',
  maxFiles: '14d',
};
