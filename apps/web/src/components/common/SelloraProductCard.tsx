'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, ShoppingCart, Check, Heart, Eye, ArrowLeftRight, ShieldCheck, Truck, Sparkles } from 'lucide-react';
import { ProductDetailItem } from '@/lib/products-data';

interface SelloraProductCardProps {
  product: ProductDetailItem;
  featured?: boolean;
}

export const SelloraProductCard: React.FC<SelloraProductCardProps> = ({ product, featured = false }) => {
  const [isAdded, setIsAdded] = useState(false);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [isCompared, setIsCompared] = useState(false);
  const [isQuickViewOpen, setIsQuickViewOpen] = useState(false);

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2000);
  };

  const handleWishlistToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsWishlisted(!isWishlisted);
  };

  const handleCompareToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsCompared(!isCompared);
  };

  const handleQuickView = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsQuickViewOpen(true);
  };

  return (
    <>
      <Link
        href={`/products/${product.id}`}
        className={`group relative bg-white rounded-xl hover:border-brand-primary/50 shadow-2xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between h-full overflow-hidden ${featured ? 'ring-2 ring-brand-primary/20' : ''
          }`}
      >
        <div
          className="relative group rounded-t-xl overflow-hidden transition-all duration-300 hover:shadow-xl hover:border-slate-200/70"
          style={{
            backgroundImage: `url(${product.imageUrl})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat'
          }}
        >

          {/* 1. Gradient Overlay (for text readability) */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/0 via-black/0 to-transparent z-10" />

          {/* 2. Top Badges Row */}
          <div className="absolute top-3.5 left-3.5 right-3.5 z-30 flex items-center justify-between pointer-events-none ">
            <div className="flex flex-col gap-1">
              {product.discountPercentage && (
                <motion.span
                  whileHover={{ scale: 1.05 }}
                  className="bg-brand-primary text-white text-[10px] sm:text-xs font-black px-2.5 py-1 rounded-full shadow-md border border-white/20"
                >
                  -{product.discountPercentage}% OFF
                </motion.span>
              )}
              {product.isVerifiedOfficialStore && (
                <span className="bg-brand-dark text-white text-[9px] font-extrabold px-2 py-0.5 rounded-md shadow-2xs flex items-center gap-1 w-max">
                  <ShieldCheck className="w-2.5 h-2.5" /> Official
                </span>
              )}
            </div>

            <div className="flex flex-col items-end gap-1.5 pointer-events-auto">
              <button
                onClick={handleWishlistToggle}
                className={`p-2 rounded-full backdrop-blur-md border transition-all cursor-pointer shadow-2xs ${isWishlisted
                  ? 'bg-brand-lightest border-brand-light text-brand-primary'
                  : 'bg-white/80 border-slate-200/80 text-slate-400 hover:text-brand-primary hover:bg-white'
                  }`}
                title="Add to Wishlist"
              >
                <Heart className={`w-3.5 h-3.5 ${isWishlisted ? 'fill-brand-primary' : ''}`} />
              </button>

              <button
                onClick={handleCompareToggle}
                className={`p-2 rounded-full backdrop-blur-md border transition-all cursor-pointer shadow-2xs hidden sm:block ${isCompared
                  ? 'bg-brand-lightest border-brand-light text-brand-dark'
                  : 'bg-white/80 border-slate-200/80 text-slate-400 hover:text-brand-dark hover:bg-white'
                  }`}
                title="Compare Product"
              >
                <ArrowLeftRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* 3. Empty spacer to maintain the aspect ratio */}
          <div className="relative aspect-square w-full z-0" />

          {/* 4. Hover Quick Action Bar */}
          <div className="absolute inset-x-3 bottom-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center gap-2 z-30">
            <button
              onClick={handleQuickView}
              className="flex-1 py-2 px-3 rounded-xl bg-white/90 backdrop-blur-md border border-slate-200 text-slate-800 hover:text-brand-primary font-extrabold text-xs shadow-md transition-all cursor-pointer flex items-center justify-center gap-1"
            >
              <Eye className="w-3.5 h-3.5" />
              <span>Quick View</span>
            </button>
          </div>

        </div>

        {/* Info & Pricing */}
        <div className="mt-4 space-y-2 flex-1 flex flex-col justify-between px-4 sm:px-5 pb-4">
          <div>
            <div className="flex items-center justify-between text-[11px] text-slate-400 font-extrabold uppercase tracking-wider mb-1">
              <span>{product.brand}</span>
              <span className="text-brand-primary flex items-center gap-0.5">
                <Truck className="w-3 h-3" /> Express
              </span>
            </div>

            <h3 className="text-xs sm:text-sm font-extrabold text-slate-900 line-clamp-2 leading-snug group-hover:text-brand-primary transition-colors">
              {product.title}
            </h3>

            {/* Rating & Sold Count */}
            <div className="flex items-center justify-between text-[11px] text-slate-500 font-semibold mt-2">
              <div className="flex items-center gap-1 font-extrabold text-amber-500">
                <Star className="w-3.5 h-3.5 fill-amber-400" />
                <span>{product.rating}</span>
                <span className="text-slate-400 font-normal">({product.reviewCount})</span>
              </div>
              <span className="text-slate-400 font-medium">{product.soldCount || 1200}+ sold</span>
            </div>
          </div>

          {/* Pricing & Add to Cart CTA */}
          <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
            <div>
              <div className="flex items-baseline gap-1.5 flex-wrap">
                <span className="text-base sm:text-lg font-black text-brand-dark">
                  ৳{product.price.toLocaleString()}
                </span>
                {product.originalPrice && (
                  <span className="text-xs text-slate-400 line-through font-medium">
                    ৳{product.originalPrice.toLocaleString()}
                  </span>
                )}
              </div>
              <span className="text-[10px] font-bold text-brand-primary block">EMI ৳{Math.round(product.price / 12)}/mo</span>
            </div>

            {/* Quick Add Button */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleQuickAdd}
              className={`p-2.5 sm:px-3 sm:py-2 rounded-xl font-extrabold text-xs flex items-center gap-1.5 transition-all cursor-pointer shadow-sm ${isAdded
                ? 'bg-brand-primary text-white'
                : 'bg-brand-dark hover:bg-brand-primary text-white'
                }`}
              title="Add to Cart"
            >
              {isAdded ? (
                <>
                  <Check className="w-4 h-4" />
                  <span className="hidden sm:inline">Added</span>
                </>
              ) : (
                <>
                  <ShoppingCart className="w-4 h-4" />
                  <span className="hidden sm:inline">Add</span>
                </>
              )}
            </motion.button>
          </div>
        </div>
      </Link>

      {/* Quick View Lightbox Modal */}
      <AnimatePresence>
        {isQuickViewOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4"
            onClick={() => setIsQuickViewOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-white rounded-3xl p-6 sm:p-8 max-w-2xl w-full shadow-2xl relative border border-slate-200 grid grid-cols-1 sm:grid-cols-2 gap-6"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setIsQuickViewOpen(false)}
                className="absolute top-4 right-4 p-2 rounded-full hover:bg-slate-100 text-slate-500 cursor-pointer"
              >
                ✕
              </button>

              <div className="aspect-square bg-slate-50 rounded-2xl p-4 flex items-center justify-center border border-slate-100">
                <img src={product.imageUrl} alt={product.title} className="max-h-full object-contain" />
              </div>

              <div className="space-y-4 flex flex-col justify-between">
                <div>
                  <span className="text-xs font-black text-brand-primary uppercase tracking-wider">{product.brand}</span>
                  <h3 className="text-lg font-black text-slate-900 mt-1 leading-tight">{product.title}</h3>
                  <p className="text-xs text-slate-600 line-clamp-3 mt-2 font-normal">{product.description}</p>
                </div>

                <div className="space-y-3 pt-3 border-t border-slate-100">
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-black text-brand-dark">৳{product.price.toLocaleString()}</span>
                    {product.originalPrice && (
                      <span className="text-sm text-slate-400 line-through">৳{product.originalPrice.toLocaleString()}</span>
                    )}
                  </div>

                  <Link
                    href={`/products/${product.id}`}
                    onClick={() => setIsQuickViewOpen(false)}
                    className="w-full py-3 rounded-2xl bg-brand-primary text-white font-extrabold text-xs flex items-center justify-center gap-2 hover:bg-brand-primary-hover transition-all shadow-md cursor-pointer"
                  >
                    <span>View Full Details</span>
                    <Sparkles className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
