'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ShoppingCart, Check, Heart, Sparkles } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { ProductDetailItem } from '@/lib/products-data';
import { useCart } from '@/providers/cart-context';

interface ProductPurchaseActionsProps {
  product: ProductDetailItem;
  selectedColorName?: string;
  selectedVersionName?: string;
}

export function ProductPurchaseActions({
  product,
  selectedColorName,
  selectedVersionName,
}: ProductPurchaseActionsProps) {
  const router = useRouter();
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [isAdded, setIsAdded] = useState(false);
  const [isWishlisted, setIsWishlisted] = useState(false);

  const handleAddToCart = () => {
    addToCart(product, quantity, selectedColorName, selectedVersionName);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2500);
  };

  const handleBuyNow = () => {
    addToCart(product, quantity, selectedColorName, selectedVersionName);
    router.push('/checkout');
  };

  return (
    <div className="space-y-4 pt-2 font-sans">
      {/* Quantity Picker & Wishlist */}
      <div className="flex items-center justify-between gap-4 p-3 rounded-2xl bg-white border border-slate-200/90 shadow-2xs">
        <div className="flex items-center gap-3">
          <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">Quantity:</span>
          <div className="flex items-center border border-slate-300 rounded-xl overflow-hidden bg-slate-50">
            <button
              onClick={() => setQuantity((q) => Math.max(1, q - 1))}
              className="w-9 h-9 flex items-center justify-center text-slate-700 hover:bg-slate-200 font-black text-sm cursor-pointer transition-colors"
            >
              -
            </button>
            <motion.span
              key={quantity}
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              className="w-10 text-center text-xs font-black text-slate-900"
            >
              {quantity}
            </motion.span>
            <button
              onClick={() => setQuantity((q) => q + 1)}
              className="w-9 h-9 flex items-center justify-center text-slate-700 hover:bg-slate-200 font-black text-sm cursor-pointer transition-colors"
            >
              +
            </button>
          </div>
        </div>

        <button
          onClick={() => setIsWishlisted(!isWishlisted)}
          className={`p-2.5 rounded-xl border transition-all cursor-pointer flex items-center gap-1.5 text-xs font-bold ${
            isWishlisted
              ? 'bg-brand-lightest border-brand-light text-brand-primary'
              : 'bg-white border-slate-200 text-slate-600 hover:text-slate-900 hover:border-slate-300'
          }`}
          title="Add to Wishlist"
        >
          <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-brand-primary text-brand-primary' : ''}`} />
          <span className="hidden sm:inline">{isWishlisted ? 'Saved' : 'Wishlist'}</span>
        </button>
      </div>

      {/* Main Action Buttons Grid */}
      <div className="flex flex-col sm:flex-row gap-3">
        {/* Add to Cart */}
        <motion.button
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleAddToCart}
          className={`flex-1 py-4 px-6 rounded-2xl font-black text-xs sm:text-sm flex items-center justify-center gap-2.5 transition-all shadow-md cursor-pointer ${
            isAdded
              ? 'bg-emerald-600 text-white'
              : 'bg-brand-primary hover:bg-brand-primary-hover text-white shadow-brand-primary/25 hover:shadow-lg'
          }`}
        >
          {isAdded ? (
            <>
              <Check className="w-5 h-5" />
              <span>Added to Cart!</span>
            </>
          ) : (
            <>
              <ShoppingCart className="w-5 h-5 ml-0.5" />
              <span>ADD TO CART</span>
            </>
          )}
        </motion.button>

        {/* Buy Now */}
        <motion.button
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleBuyNow}
          className="flex-1 py-4 px-6 rounded-2xl bg-brand-dark hover:bg-slate-900 text-white font-black text-xs sm:text-sm transition-all shadow-md hover:shadow-lg cursor-pointer flex items-center justify-center gap-2"
        >
          <Sparkles className="w-4 h-4 text-amber-400" />
          <span>BUY NOW (CHECKOUT)</span>
        </motion.button>
      </div>
    </div>
  );
}
