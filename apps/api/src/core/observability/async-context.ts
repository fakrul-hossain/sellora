import { AsyncLocalStorage } from 'async_hooks';

export interface RequestContextStore {
  traceId: string;
  requestId: string;
  userId?: string;
  userRole?: string;
  ip?: string;
}

const asyncLocalStorage = new AsyncLocalStorage<RequestContextStore>();

export const requestContext = {
  run: (store: RequestContextStore, callback: () => void) => {
    asyncLocalStorage.run(store, callback);
  },
  getStore: (): RequestContextStore | undefined => {
    return asyncLocalStorage.getStore();
  },
  getTraceId: (): string => {
    return asyncLocalStorage.getStore()?.traceId || 'no-trace-id';
  },
  getRequestId: (): string => {
    return asyncLocalStorage.getStore()?.requestId || 'no-req-id';
  },
};
