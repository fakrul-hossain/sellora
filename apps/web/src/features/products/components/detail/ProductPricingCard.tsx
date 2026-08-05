'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { CreditCard, ShieldCheck, Sparkles, CheckCircle2, Info } from 'lucide-react';
import { ProductDetailItem } from '@/lib/products-data';

interface ProductPricingCardProps {
  product: ProductDetailItem;
  priceDelta?: number;
  onOpenEMICalculator: () => void;
}

export function ProductPricingCard({ product, priceDelta = 0, onOpenEMICalculator }: ProductPricingCardProps) {
  const currentPrice = product.price + priceDelta;
  const originalPrice = product.originalPrice ? product.originalPrice + priceDelta : undefined;
  const savedAmount = originalPrice ? originalPrice - currentPrice : 0;
  const discountPercentage = originalPrice
    ? Math.round((savedAmount / originalPrice) * 100)
    : product.discountPercentage;

  const lowestMonthlyEMI = Math.round(currentPrice / 12);

  return (
    <div className="relative overflow-hidden rounded-3xl bg-brand-dark p-6 sm:p-7 text-white shadow-xl border border-brand-dark/20">
      {/* Decorative ambient sheen line */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-brand-primary" />
      <div className="absolute -right-12 -top-12 w-40 h-40 bg-brand-primary/10 rounded-full blur-3xl pointer-events-none" />

      <div className="flex flex-col gap-5">
        {/* Top Badges Row */}
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-brand-light/20 pb-4">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-primary/20 text-brand-lightest text-xs font-extrabold border border-brand-light/30">
              <CheckCircle2 className="w-3.5 h-3.5" />
              In Stock & Ready to Ship
            </span>
            <span className="text-xs text-brand-lightest/70 font-medium">SKU: {product.sku}</span>
          </div>

          <div className="flex items-center gap-1.5 text-xs text-brand-light bg-brand-light/10 px-3 py-1 rounded-full border border-brand-light/20 font-bold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Price Match Guaranteed</span>
          </div>
        </div>

        {/* Primary Pricing Focus */}
        <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-4">
          <div className="space-y-1">
            <div className="text-xs uppercase tracking-wider text-brand-lightest/80 font-bold flex items-center gap-1.5">
              <span>Special Offer Price</span>
              <span className="text-[10px] bg-brand-dark/80 text-brand-lightest px-2 py-0.5 rounded font-normal">VAT Included</span>
            </div>

            <div className="flex items-baseline gap-3 flex-wrap">
              <motion.span
                key={currentPrice}
                initial={{ scale: 0.95, opacity: 0.8 }}
                animate={{ scale: 1, opacity: 1 }}
                className="text-3xl sm:text-4xl font-black tracking-tight text-white"
              >
                ৳{currentPrice.toLocaleString()}
              </motion.span>

              {originalPrice && (
                <span className="text-lg sm:text-xl text-brand-lightest/60 line-through font-semibold">
                  ৳{originalPrice.toLocaleString()}
                </span>
              )}

              {discountPercentage && (
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
                <span>You Save ৳{savedAmount.toLocaleString()} today!</span>
              </p>
            )}
          </div>
        </div>

        {/* EMI Breakdown Panel */}
        <div className="rounded-2xl bg-brand-dark/80 border border-brand-light/20 p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-brand-primary/20 border border-brand-primary/30 flex items-center justify-center text-brand-light shrink-0">
              <CreditCard className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-extrabold text-white flex items-center gap-1.5">
                <span>0% EMI Available</span>
                <span className="bg-brand-primary/20 text-brand-light text-[10px] px-2 py-0.5 rounded font-bold">Up to 12 Months</span>
              </div>
              <p className="text-xs text-brand-lightest/80">
                Starting from <span className="font-black text-white">৳{lowestMonthlyEMI.toLocaleString()}</span> / month
              </p>
            </div>
          </div>

          <button
            onClick={onOpenEMICalculator}
            className="px-4 py-2 rounded-xl bg-brand-primary/30 hover:bg-brand-primary/50 text-white text-xs font-extrabold transition-all border border-brand-light/30 flex items-center justify-center gap-1.5 cursor-pointer shrink-0"
          >
            <span>View EMI Plans</span>
            <Info className="w-3.5 h-3.5 text-slate-400" />
          </button>
        </div>
      </div>
    </div>
  );
}
