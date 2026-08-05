import { BaseEntity } from './entity.types.js';

export enum VendorStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
  SUSPENDED = 'SUSPENDED',
}

export interface VendorStore extends BaseEntity {
  ownerId: string;
  storeName: string;
  slug: string;
  logoUrl?: string;
  bannerUrl?: string;
  description?: string;
  phone: string;
  email: string;
  status: VendorStatus;
  commissionRate: number; // e.g. 5.0 (percent)
  balance: number; // Vendor wallet balance in BDT
  address: {
    street: string;
    city: string;
    area: string;
  };
  rating: number;
  reviewCount: number;
}

export interface VendorAnalyticsSummary {
  totalSales: number;
  totalOrders: number;
  totalProducts: number;
  pendingOrders: number;
}
