import { VendorStatus } from './enums.types.js';

export interface VendorAddress {
  street?: string;
  city?: string;
  area?: string;
}

export interface Vendor {
  id: string;
  ownerId: string;
  storeName: string;
  slug: string;
  logoUrl?: string;
  bannerUrl?: string;
  description?: string;
  phone?: string;
  email: string;
  status: VendorStatus;
  commissionRate: number;
  balance: number;
  address?: VendorAddress;
  rating: number;
  reviewCount: number;
  createdAt?: string;
  updatedAt?: string;
}
