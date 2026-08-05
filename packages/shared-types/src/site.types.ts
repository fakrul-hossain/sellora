import { BaseEntity } from './entity.types.js';

export interface Banner {
  id: string;
  title: string;
  subtitle?: string;
  imageUrl: string;
  linkUrl: string;
  isActive: boolean;
}

export interface SiteSettings extends BaseEntity {
  siteName: string;
  supportPhone: string;
  supportEmail: string;
  banners: Banner[];
  announcementText?: string;
  defaultCommissionRate: number;
}
