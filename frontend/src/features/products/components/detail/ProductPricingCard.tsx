'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { ProductDetailItem } from '@/lib/products-data';

interface ProductPricingCardProps {
  product: ProductDetailItem & { stock?: number };
  priceDelta?: number;
}

export function ProductPricingCard({ product, priceDelta = 0 }: ProductPricingCardProps) {
  const currentPrice = product.price + priceDelta;
  const originalPrice = product.originalPrice ? product.originalPrice + priceDelta : undefined;
  const savedAmount = originalPrice ? originalPrice - currentPrice : 0;
  const discountPercentage = originalPrice
    ? Math.round((savedAmount / originalPrice) * 100)
    : product.discountPercentage;

  const stockCount = product.stock ?? 15;

  return (
    <div className="relative overflow-hidden rounded-3xl bg-brand-dark p-6 sm:p-7 text-white shadow-xl border border-brand-dark/20 font-sans">
      <div className="absolute top-0 left-0 right-0 h-1 bg-brand-primary" />
      <div className="absolute -right-12 -top-12 w-40 h-40 bg-brand-primary/10 rounded-full blur-3xl pointer-events-none" />

      <div className="flex flex-col gap-4">
        {/* Primary Pricing Focus */}
        <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-4">
          <div className="space-y-1">
            <div className="text-xs uppercase tracking-wider text-brand-lightest/80 font-bold flex items-center gap-2">
              <span>Marketplace Price</span>
              <span className="text-[10px] bg-brand-primary/20 text-brand-light px-2 py-0.5 rounded font-bold">
                {stockCount > 0 ? `In Stock (${stockCount} available)` : 'Out of Stock'}
              </span>
            </div>

            <div className="flex items-baseline gap-3 flex-wrap pt-1">
              <motion.span
                key={currentPrice}
                initial={{ scale: 0.95, opacity: 0.8 }}
                animate={{ scale: 1, opacity: 1 }}
                className="text-3xl sm:text-4xl font-black tracking-tight text-white"
              >
                ৳{currentPrice.toLocaleString()}
              </motion.span>

              {originalPrice && originalPrice > currentPrice && (
                <span className="text-lg sm:text-xl text-brand-lightest/60 line-through font-semibold">
                  ৳{originalPrice.toLocaleString()}
                </span>
              )}

              {discountPercentage && discountPercentage > 0 && (
                <motion.span
                  animate={{ scale: [1, 1.05, 1] }}
                  transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }}
                  className="px-3 py-1 rounded-xl bg-brand-primary text-white font-black text-xs shadow-md border border-brand-light/30"
                >
                  -{discountPercentage}% OFF
                </motion.span>
              )}
            </div>

            {savedAmount > 0 && (
              <p className="text-xs font-bold text-brand-light flex items-center gap-1 pt-1">
                <span>Save ৳{savedAmount.toLocaleString()} instantly</span>
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
