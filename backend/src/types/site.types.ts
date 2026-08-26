export interface SiteBanner {
  id: string;
  imageUrl: string;
  title?: string;
  linkUrl?: string;
  isActive?: boolean;
}

export interface SiteSettings {
  id: string;
  siteName: string;
  supportPhone: string;
  supportEmail: string;
  announcementText?: string;
  defaultCommissionRate: number;
  banners?: SiteBanner[];
  createdAt?: string;
  updatedAt?: string;
}
