export interface HomepageSectionConfig {
  id: string;
  name: string;
  enabled: boolean;
  order: number;
}

export const defaultHomepageSectionConfig: HomepageSectionConfig[] = [
  { id: 'hero-slider', name: 'Hero Banner & Campaigns', enabled: true, order: 1 },
  { id: 'quick-categories', name: 'Quick Category Icons', enabled: true, order: 2 },
  { id: 'featured-categories', name: 'Featured Categories', enabled: true, order: 3 },
  { id: 'flash-sale', name: 'Flash Deals Countdown', enabled: true, order: 4 },
  { id: 'featured-products', name: 'Featured Products Grid', enabled: true, order: 5 },
  { id: 'top-brands', name: 'Shop By Top Brands', enabled: true, order: 6 },
  { id: 'new-arrivals', name: 'New Arrivals Carousel', enabled: true, order: 7 },
  { id: 'best-sellers', name: 'Best Sellers Carousel', enabled: true, order: 8 },
  { id: 'trending-products', name: 'Trending Products Grid', enabled: true, order: 9 },
  { id: 'smart-lifestyle', name: 'Smart Lifestyle Showcase', enabled: true, order: 10 },
  { id: 'campaign-banners', name: 'Promotional Campaign Banners', enabled: true, order: 11 },
  { id: 'shop-by-budget', name: 'Shop By Budget Filter', enabled: true, order: 12 },
  { id: 'customer-reviews', name: 'Verified Customer Reviews', enabled: true, order: 13 },
  { id: 'why-choose-us', name: 'Why Choose SELLORA (Trust Pillars)', enabled: true, order: 14 },
  { id: 'brand-partners', name: 'Official Distributor Partners', enabled: true, order: 15 },
  { id: 'newsletter', name: 'Newsletter Subscription', enabled: true, order: 16 },
];
