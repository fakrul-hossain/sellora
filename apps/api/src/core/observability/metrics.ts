export interface AppMetrics {
  totalRequests: number;
  activeConnections: number;
  errorCounts: Record<string, number>;
  startTime: number;
}

class MetricsCollector {
  private static instance: MetricsCollector;
  private metrics: AppMetrics = {
    totalRequests: 0,
    activeConnections: 0,
    errorCounts: {},
    startTime: Date.now(),
  };

  private constructor() {}

  public static getInstance(): MetricsCollector {
    if (!MetricsCollector.instance) {
      MetricsCollector.instance = new MetricsCollector();
    }
    return MetricsCollector.instance;
  }

  public incrementRequests(): void {
    this.metrics.totalRequests++;
  }

  public recordError(code: string): void {
    this.metrics.errorCounts[code] = (this.metrics.errorCounts[code] || 0) + 1;
  }

  public getSummary() {
    return {
      totalRequests: this.metrics.totalRequests,
      errorCounts: this.metrics.errorCounts,
      uptimeSeconds: Math.floor((Date.now() - this.metrics.startTime) / 1000),
      memoryUsage: process.memoryUsage(),
    };
  }
}

export const metricsCollector = MetricsCollector.getInstance();
