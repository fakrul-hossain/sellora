export interface TrustPillarItem {
  id: string;
  title: string;
  subtitle: string;
  iconName: string;
}

export const platformConfig = {
  brandName: 'SELLORA',
  tagline: 'Modern Tech E-Commerce in Bangladesh',
  hotline: '16780',
  supportEmail: 'support@sellora.com.bd',
  currency: {
    code: 'BDT',
    symbol: '৳',
    position: 'prefix' as const,
    locale: 'bn-BD',
  },
  emiAvailable: true,
  maxEmiMonths: 12,
  storeLocationsCount: 24,
  warranties: {
    officialBadgeText: 'Official Warranty',
    guaranteedOriginalText: '100% Genuine Product',
    returnDays: 7,
  },
  trustPillars: [
    {
      id: 'tp1',
      title: '100% Genuine Products',
      subtitle: 'Sourced directly from authorized brands',
      iconName: 'ShieldCheck',
    },
    {
      id: 'tp2',
      title: 'Official Brand Warranty',
      subtitle: 'Hassle-free official replacement warranty',
      iconName: 'Award',
    },
    {
      id: 'tp3',
      title: '0% EMI Facility',
      subtitle: 'Up to 12 months EMI on major bank cards',
      iconName: 'CreditCard',
    },
    {
      id: 'tp4',
      title: 'Express Nationwide Delivery',
      subtitle: 'Fast delivery across all districts in Bangladesh',
      iconName: 'Truck',
    },
    {
      id: 'tp5',
      title: 'Cash on Delivery',
      subtitle: 'Pay after receiving & checking your order',
      iconName: 'Banknote',
    },
    {
      id: 'tp6',
      title: 'Easy 7-Day Return',
      subtitle: 'Simple return & instant refund policy',
      iconName: 'RefreshCw',
    },
  ],
  popularSearchKeywords: [
    'iPhone 15 Pro',
    'Sony WH-1000XM5',
    'Apple Watch Series 9',
    'MacBook Air M2',
    'Anker Power Bank',
    'AirPods Pro',
    'Gaming Laptop',
    'Smart TV',
  ],
};
