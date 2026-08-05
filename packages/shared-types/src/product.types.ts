import { BaseEntity } from './entity.types.js';

export interface ProductVariant {
  id: string;
  name: string;
  sku: string;
  priceDelta: number;
  stock: number;
}

export interface Category extends BaseEntity {
  name: string;
  slug: string;
  icon?: string;
  description?: string;
}

export interface Brand extends BaseEntity {
  name: string;
  slug: string;
  logoUrl?: string;
}

export interface Product extends BaseEntity {
  vendorId: string;
  title: string;
  slug: string;
  description: string;
  category: string;
  brand: string;
  price: number;
  originalPrice?: number;
  discountPercentage?: number;
  stock: number;
  sku: string;
  imageUrl: string;
  images: string[];
  features: string[];
  rating: number;
  reviewCount: number;
  isPublished: boolean;
  isApproved: boolean;
  variants?: ProductVariant[];
}
