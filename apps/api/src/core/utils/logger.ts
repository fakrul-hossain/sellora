import winston from 'winston';
import 'winston-daily-rotate-file';
import fs from 'fs';
import { loggerConfig } from '../../config/logger.config.js';
import { requestContext } from '../observability/async-context.js';

if (!fs.existsSync(loggerConfig.logDir)) {
  fs.mkdirSync(loggerConfig.logDir, { recursive: true });
}

const customFormat = winston.format.printf(({ level, message, timestamp, stack, ...meta }) => {
  const traceId = requestContext.getTraceId();
  const reqId = requestContext.getRequestId();
  const metaStr = Object.keys(meta).length ? JSON.stringify(meta) : '';
  const stackStr = stack ? `\nStack: ${stack}` : '';
  return `[${timestamp}] [${level.toUpperCase()}] [TraceID: ${traceId}] [ReqID: ${reqId}] ${message} ${metaStr}${stackStr}`;
});

export const logger = winston.createLogger({
  level: loggerConfig.level,
  format: winston.format.combine(
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    winston.format.errors({ stack: true }),
    customFormat
  ),
  transports: [
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        customFormat
      ),
    }),
    new winston.transports.DailyRotateFile({
      filename: `${loggerConfig.logDir}/app-%DATE%.log`,
      datePattern: 'YYYY-MM-DD',
      zippedArchive: true,
      maxSize: loggerConfig.maxSize,
      maxFiles: loggerConfig.maxFiles,
    }),
    new winston.transports.DailyRotateFile({
      level: 'error',
      filename: `${loggerConfig.logDir}/error-%DATE%.log`,
      datePattern: 'YYYY-MM-DD',
      zippedArchive: true,
      maxSize: loggerConfig.maxSize,
      maxFiles: loggerConfig.maxFiles,
    }),
  ],
});
