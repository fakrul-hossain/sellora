export interface JobPayload<T = any> {
  id: string;
  name: string;
  data: T;
  opts?: Record<string, any>;
}

export interface IQueueProvider {
  addJob<T>(queueName: string, jobName: string, data: T): Promise<void>;
  processJobs<T>(queueName: string, handler: (data: T) => Promise<void>): void;
}
