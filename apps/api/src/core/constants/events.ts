export const SystemEvents = {
  USER_REGISTERED: 'user.registered',
  USER_VERIFIED: 'user.verified',
  ORDER_CREATED: 'order.created',
  ORDER_CANCELLED: 'order.cancelled',
  PAYMENT_COMPLETED: 'payment.completed',
  PAYMENT_FAILED: 'payment.failed',
  INVENTORY_UPDATED: 'inventory.updated',
  LOW_STOCK_ALERT: 'inventory.low_stock',
} as const;

export type SystemEventType = (typeof SystemEvents)[keyof typeof SystemEvents];
