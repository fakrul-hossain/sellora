'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Star, Heart, ShoppingBag, ShieldCheck, Check } from 'lucide-react';
import { formatCurrency } from '@/lib/formatters';
import { useCart } from '@/providers/cart-context';

export interface CommonProductItem {
  id: string | number;
  title: string;
  price: number;
  originalPrice?: number;
  discountPercentage?: number;
  brand?: string;
  rating?: number;
  reviewCount?: number;
  imageUrl: string;
  warrantyText?: string;
  warranty?: string;
  stock?: number;
}

interface CommonProductCardProps {
  product: CommonProductItem;
}

export const CommonProductCard: React.FC<CommonProductCardProps> = ({ product }) => {
  const { addToCart } = useCart();
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [added, setAdded] = useState(false);

  const discount = product.discountPercentage || 
    (product.originalPrice && product.originalPrice > product.price
      ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
      : undefined);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product, 1);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  return (
    <div className="group relative bg-white rounded-3xl p-4 sm:p-5 border border-slate-200/80 hover:border-brand-primary/40 shadow-2xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between h-full font-sans text-slate-800">
      {/* Image Container */}
      <div>
        <Link href={`/products/${product.id}`} className="relative aspect-[4/3] w-full rounded-2xl bg-gradient-to-b from-slate-50 to-slate-100 p-4 flex items-center justify-center overflow-hidden block">
          {discount && discount > 0 && (
            <span className="absolute top-2.5 left-2.5 bg-brand-primary text-white text-[10px] font-black px-2 py-0.5 rounded-lg shadow-xs z-10 uppercase tracking-wider">
              SAVE {discount}%
            </span>
          )}

          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setIsWishlisted(!isWishlisted);
            }}
            className="absolute top-2.5 right-2.5 z-10 w-8 h-8 rounded-full bg-white/90 backdrop-blur-md flex items-center justify-center text-slate-400 hover:text-rose-500 shadow-xs transition-colors cursor-pointer"
            title="Wishlist"
          >
            <Heart className={`w-3.5 h-3.5 ${isWishlisted ? 'fill-rose-500 text-rose-500' : ''}`} />
          </button>

          <img
            src={product.imageUrl}
            alt={product.title}
            className="object-contain max-h-full max-w-full group-hover:scale-105 transition-transform duration-500"
          />
        </Link>

        {/* Details */}
        <div className="mt-3.5 space-y-2">
          <div className="flex items-center justify-between gap-1 text-[11px] font-bold text-slate-400">
            <span className="uppercase tracking-wider truncate">{product.brand || 'GENERIC'}</span>
            <div className="flex items-center space-x-1 font-bold text-amber-500 shrink-0">
              <Star className="w-3.5 h-3.5 fill-amber-400" />
              <span>{product.rating ?? 4.8} ({product.reviewCount ?? 12})</span>
            </div>
          </div>

          <Link href={`/products/${product.id}`}>
            <h3 className="text-xs sm:text-sm font-extrabold text-slate-900 line-clamp-2 hover:text-brand-primary transition-colors leading-snug">
              {product.title}
            </h3>
          </Link>

          {(product.warrantyText || product.warranty) && (
            <div className="flex items-center space-x-1 text-[10px] text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded-md w-fit border border-emerald-100/60">
              <ShieldCheck className="w-3 h-3 text-emerald-600 shrink-0" />
              <span className="truncate">{product.warrantyText || product.warranty}</span>
            </div>
          )}
        </div>
      </div>

      {/* Footer Price & Add to Cart */}
      <div className="pt-3 mt-3 border-t border-slate-100 flex items-center justify-between gap-2">
        <div className="min-w-0">
          <span className="text-base sm:text-lg font-black text-slate-900 block truncate">
            {formatCurrency(product.price)}
          </span>
          {product.originalPrice && product.originalPrice > product.price && (
            <span className="text-[11px] text-slate-400 line-through block truncate">
              {formatCurrency(product.originalPrice)}
            </span>
          )}
        </div>

        <button
          type="button"
          onClick={handleAddToCart}
          className={`px-3 py-2 rounded-xl text-xs font-black flex items-center space-x-1.5 transition-all shadow-2xs cursor-pointer shrink-0 ${
            added
              ? 'bg-emerald-600 text-white'
              : 'bg-brand-primary text-white hover:bg-brand-primary-hover'
          }`}
        >
          {added ? (
            <>
              <Check className="w-3.5 h-3.5" />
              <span>Added</span>
            </>
          ) : (
            <>
              <ShoppingBag className="w-3.5 h-3.5" />
              <span>Add</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};
