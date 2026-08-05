export interface BaseEntity {
  id: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface TraceContext {
  traceId: string;
  requestId: string;
  userId?: string;
  userRole?: string;
}
