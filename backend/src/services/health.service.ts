import { pool } from '../models/mysql.client.js';

export interface SystemHealthStatus {
  status: 'UP' | 'DOWN' | 'DEGRADED';
  database: 'CONNECTED' | 'DISCONNECTED';
  uptimeSeconds: number;
  memory: NodeJS.MemoryUsage;
  timestamp: string;
}

/**
 * Basic health check service
 * Checks database connectivity and server uptime.
 */
export class HealthService {
  public async getHealth(): Promise<SystemHealthStatus> {
    let isDbConnected = false;
    try {
      const conn = await pool.getConnection();
      await conn.ping();
      conn.release();
      isDbConnected = true;
    } catch {
      isDbConnected = false;
    }

    return {
      status: isDbConnected ? 'UP' : 'DEGRADED',
      database: isDbConnected ? 'CONNECTED' : 'DISCONNECTED',
      uptimeSeconds: Math.floor(process.uptime()),
      memory: process.memoryUsage(),
      timestamp: new Date().toISOString(),
    };
  }
}

export const healthService = new HealthService();
