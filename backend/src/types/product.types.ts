export interface Product {
  id: string;
  vendorId: string;
  category: string;
  brand: string;
  title: string;
  slug: string;
  sku: string;
  description: string;
  price: number;
  originalPrice?: number;
  discountPercentage?: number;
  stock: number;
  imageUrl: string;
  images?: string[];
  features?: string[];
  rating?: number;
  reviewCount?: number;
  isPublished: boolean;
  isApproved: boolean;
  createdAt?: string;
  updatedAt?: string;
}
