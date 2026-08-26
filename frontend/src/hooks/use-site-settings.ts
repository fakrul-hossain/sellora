'use client';

import { useState, useEffect } from 'react';
import { ApiClient } from '@/lib/api-client';

export interface HeroSlideItem {
  id: number | string;
  image: string;
  slug: string;
}

export interface BrandWeekConfig {
  image: string;
  slug: string;
}

export interface SiteSettings {
  siteName: string;
  siteLogo: string;
  supportPhone: string;
  supportEmail: string;
  announcementText: string;
  defaultCommissionRate: number;
  banners: any[];
  heroConfig: {
    slides: HeroSlideItem[];
  } | null;
  brandWeekConfig: BrandWeekConfig | null;
  categoriesConfig: Array<{
    id: number;
    name: string;
    itemCount: string;
    image: string;
    href: string;
  }>;
  brandsConfig: Array<{
    id: number;
    name: string;
    rating: number;
    productsCount: string;
    badge: string;
    logo: string;
  }>;
}

export function useSiteSettings() {
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadSettings() {
      try {
        const data = await ApiClient.get<SiteSettings>('/site-settings');
        setSettings(data);
      } catch (err) {
        console.error('Failed to load site settings:', err);
      } finally {
        setIsLoading(false);
      }
    }
    loadSettings();
  }, []);

  return { settings, isLoading };
}
