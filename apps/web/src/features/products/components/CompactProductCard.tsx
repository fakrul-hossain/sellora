'use client';

import React, { useState } from 'react';
import { Star, Heart, ShoppingBag, ArrowLeftRight, ShieldCheck } from 'lucide-react';
import { formatCurrency } from '@/lib/formatters';

export interface TechProductItem {
  id: string;
  title: string;
  brand: string;
  category: string;
  price: number;
  originalPrice?: number;
  rating: number;
  reviewCount: number;
  imageUrl: string;
  discountPercentage?: number;
  warrantyText?: string;
  inStock?: boolean;
  stockCount?: number;
  totalStock?: number;
}

interface CompactProductCardProps {
  product: TechProductItem;
}

export const CompactProductCard: React.FC<CompactProductCardProps> = ({ product }) => {
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [isAdded, setIsAdded] = useState(false);

  const handleAddToCart = () => {
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 1500);
  };

  return (
    <div className="group relative bg-white rounded-2xl p-3 border border-slate-200/80 hover:border-brand-accent/50 shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col justify-between h-full">
      {/* Top Image Container */}
      <div className="relative aspect-square w-full rounded-xl bg-slate-50/80 p-3 flex items-center justify-center overflow-hidden">
        
        {/* Discount Badge */}
        {product.discountPercentage && (
          <span className="absolute top-2 left-2 bg-brand-accent text-white text-[10px] font-black px-2 py-0.5 rounded-md shadow-sm z-10">
            -{product.discountPercentage}%
          </span>
        )}

        {/* Official Warranty Badge */}
        <div className="absolute bottom-2 left-2 z-10 flex items-center space-x-1 bg-white/90 backdrop-blur-sm px-2 py-0.5 rounded-md text-[9px] font-extrabold text-brand-primary border border-slate-200/60 shadow-xs">
          <ShieldCheck className="w-3 h-3 text-emerald-600" />
          <span>{product.warrantyText || 'Official Warranty'}</span>
        </div>

        {/* Action Buttons Overlay */}
        <div className="absolute top-2 right-2 flex flex-col space-y-1 z-10">
          <button
            onClick={() => setIsWishlisted(!isWishlisted)}
            className="w-7 h-7 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center text-slate-400 hover:text-red-500 shadow-sm transition-transform hover:scale-110"
            aria-label="Wishlist"
          >
            <Heart className={`w-3.5 h-3.5 ${isWishlisted ? 'fill-red-500 text-red-500' : ''}`} />
          </button>
        </div>

        {/* Product Image */}
        <img
          src={product.imageUrl}
          alt={product.title}
          className="object-contain max-h-full max-w-full group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
        />
      </div>

      {/* Product Content Details */}
      <div className="mt-3 space-y-1.5 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              {product.brand}
            </span>
            <div className="flex items-center space-x-1 text-[10px] font-bold text-amber-500">
              <Star className="w-3 h-3 fill-amber-400" />
              <span>{product.rating}</span>
            </div>
          </div>

          <h3 className="text-xs font-bold text-brand-primary line-clamp-2 mt-0.5 leading-snug group-hover:text-brand-accent transition-colors">
            {product.title}
          </h3>
        </div>

        {/* Price & Action */}
        <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
          <div>
            <div className="flex items-baseline space-x-1.5">
              <span className="text-sm font-extrabold text-brand-primary">
                {formatCurrency(product.price)}
              </span>
            </div>
            {product.originalPrice && (
              <span className="text-[10px] text-slate-400 line-through">
                {formatCurrency(product.originalPrice)}
              </span>
            )}
          </div>

          <button
            onClick={handleAddToCart}
            className={`w-8 h-8 rounded-xl flex items-center justify-center transition-all shadow-sm ${
              isAdded
                ? 'bg-emerald-600 text-white'
                : 'bg-brand-primary text-white hover:bg-brand-accent'
            }`}
            aria-label="Add to Cart"
          >
            <ShoppingBag className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
