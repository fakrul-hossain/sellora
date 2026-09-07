'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingCart, Check, Sparkles, Star } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { ProductDetailItem } from '@/lib/products-data';
import { useCart } from '@/providers/cart-context';
import { useAuth } from '@/providers/auth-context';
import { useToast } from '@/components/ui/toast';

interface StickyPurchaseBarProps {
  product: ProductDetailItem;
  priceDelta?: number;
  selectedColorName?: string;
  selectedVersionName?: string;
}

export function StickyPurchaseBar({
  product,
  priceDelta = 0,
  selectedColorName,
  selectedVersionName,
}: StickyPurchaseBarProps) {
  const router = useRouter();
  const { addToCart } = useCart();
  const { user } = useAuth();
  const toast = useToast();
  const [isVisible, setIsVisible] = useState(false);
  const [isAdded, setIsAdded] = useState(false);

  const currentPrice = product.price + priceDelta;

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 600) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleAddToCart = () => {
    addToCart(product, 1, selectedColorName, selectedVersionName);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2000);
  };

  const handleBuyNow = () => {
    if (!user) {
      toast.info('Please log in to proceed with your purchase.', 'Login Required');
      addToCart(product, 1, selectedColorName, selectedVersionName);
      router.push('/login?redirect=/checkout');
      return;
    }
    addToCart(product, 1, selectedColorName, selectedVersionName);
    router.push('/checkout');
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <>
          {/* Top Sticky Bar - Desktop & Tablet */}
          <motion.div
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -100, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="hidden md:flex fixed top-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-xl border-b border-slate-200 shadow-md py-3 px-6 items-center justify-between gap-4"
          >
            {/* Product Summary */}
            <div className="flex items-center gap-3.5 min-w-0">
              <div className="w-12 h-12 rounded-xl bg-slate-50 border border-slate-200 p-1 shrink-0 flex items-center justify-center">
                <img src={product.imageUrl} alt={product.title} className="max-h-full object-contain" />
              </div>
              <div className="min-w-0">
                <div className="text-xs font-black text-slate-900 truncate max-w-md">{product.title}</div>
                <div className="flex items-center gap-3 text-[11px] text-slate-500 mt-0.5 font-medium">
                  <div className="flex items-center gap-1 text-amber-500 font-bold">
                    <Star className="w-3 h-3 fill-amber-400" />
                    <span>{product.rating}</span>
                  </div>
                  {selectedColorName && <span>Color: <strong className="text-slate-800">{selectedColorName}</strong></span>}
                  {selectedVersionName && <span>Edition: <strong className="text-slate-800">{selectedVersionName}</strong></span>}
                </div>
              </div>
            </div>

            {/* Price & Action Buttons */}
            <div className="flex items-center gap-4 shrink-0">
              <div className="text-right">
                <span className="text-xl font-black text-slate-900">৳{currentPrice.toLocaleString()}</span>
                {product.originalPrice && (
                  <span className="text-xs text-slate-400 line-through block font-medium">
                    ৳{(product.originalPrice + priceDelta).toLocaleString()}
                  </span>
                )}
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleAddToCart}
                  className={`py-2.5 px-5 rounded-xl font-extrabold text-xs flex items-center gap-1.5 transition-all shadow-2xs cursor-pointer ${
                    isAdded ? 'bg-brand-primary text-white' : 'bg-brand-primary hover:bg-brand-primary-hover text-white'
                  }`}
                >
                  {isAdded ? (
                    <>
                      <Check className="w-4 h-4" /> Added!
                    </>
                  ) : (
                    <>
                      <ShoppingCart className="w-4 h-4" /> Add to Cart
                    </>
                  )}
                </button>

                <button
                  onClick={handleBuyNow}
                  className="py-2.5 px-5 rounded-xl bg-brand-dark hover:bg-brand-dark-hover text-white font-extrabold text-xs transition-all shadow-2xs cursor-pointer flex items-center gap-1.5"
                >
                  <Sparkles className="w-3.5 h-3.5 text-brand-lightest" /> Buy Now
                </button>
              </div>
            </div>
          </motion.div>

          {/* Bottom Floating Bar - Mobile Only */}
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-xl border-t border-slate-200 shadow-2xl p-3 flex items-center justify-between gap-3"
          >
            <div className="min-w-0">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Total Price</span>
              <span className="text-lg font-black text-brand-dark">৳{currentPrice.toLocaleString()}</span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleAddToCart}
                className={`py-3 px-4 rounded-xl font-extrabold text-xs flex items-center gap-1.5 shadow-sm cursor-pointer ${
                  isAdded ? 'bg-brand-primary text-white' : 'bg-brand-primary text-white'
                }`}
              >
                <ShoppingCart className="w-4 h-4" />
                <span>{isAdded ? 'Added' : 'Cart'}</span>
              </button>

              <button
                onClick={handleBuyNow}
                className="py-3 px-5 rounded-xl bg-brand-dark text-white font-extrabold text-xs shadow-sm cursor-pointer"
              >
                Buy Now
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
