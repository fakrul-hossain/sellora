import { mysqlClient } from '../models/mysql.client.js';
import { metricsCollector } from '../utils/metrics.js';

export interface SystemHealthStatus {
  status: 'UP' | 'DOWN' | 'DEGRADED';
  database: 'CONNECTED' | 'DISCONNECTED';
  uptimeSeconds: number;
  memory: NodeJS.MemoryUsage;
  metrics: ReturnType<typeof metricsCollector.getSummary>;
  timestamp: string;
}

export class HealthService {
  public async getHealth(): Promise<SystemHealthStatus> {
    const isDbHealthy = await mysqlClient.isHealthy();
    const metricsSummary = metricsCollector.getSummary();

    return {
      status: isDbHealthy ? 'UP' : 'DEGRADED',
      database: isDbHealthy ? 'CONNECTED' : 'DISCONNECTED',
      uptimeSeconds: metricsSummary.uptimeSeconds,
      memory: process.memoryUsage(),
      metrics: metricsSummary,
      timestamp: new Date().toISOString(),
    };
  }
}

export const healthService = new HealthService();
