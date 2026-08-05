import path from 'path';
import { env } from './env.config.js';

export const loggerConfig = {
  level: env.NODE_ENV === 'production' ? 'info' : 'debug',
  logDir: path.join(process.cwd(), 'logs'),
  maxSize: '20m',
  maxFiles: '14d',
};
