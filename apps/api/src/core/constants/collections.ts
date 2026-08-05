export const Collections = {
  USERS: 'users',
  PRODUCTS: 'products',
  CATEGORIES: 'categories',
  BRANDS: 'brands',
  CARTS: 'carts',
  WISHLISTS: 'wishlists',
  ORDERS: 'orders',
  PAYMENTS: 'payments',
  COUPONS: 'coupons',
  REVIEWS: 'reviews',
  BANNERS: 'banners',
  AUDIT_LOGS: 'audit_logs',
  SYSTEM_SETTINGS: 'system_settings',
} as const;

export type CollectionName = (typeof Collections)[keyof typeof Collections];
