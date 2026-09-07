/**
 * Simple, beginner-friendly application logger
 * Prints clean, formatted log messages to the console.
 */
export const logger = {
  info: (message: string, ...args: any[]) => {
    console.log(`[INFO  ${new Date().toLocaleTimeString()}] ${message}`, ...args);
  },
  warn: (message: string, ...args: any[]) => {
    console.warn(`[WARN  ${new Date().toLocaleTimeString()}] ${message}`, ...args);
  },
  error: (message: string, ...args: any[]) => {
    console.error(`[ERROR ${new Date().toLocaleTimeString()}] ${message}`, ...args);
  },
};
