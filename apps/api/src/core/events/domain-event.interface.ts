export interface IDomainEvent<T = any> {
  eventId: string;
  eventType: string;
  timestamp: Date;
  aggregateId?: string;
  payload: T;
}

export interface IEventHandler<T = any> {
  handle(event: IDomainEvent<T>): Promise<void>;
}
