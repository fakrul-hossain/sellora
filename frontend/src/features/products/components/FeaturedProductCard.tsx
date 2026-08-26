'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Star, Heart, ShoppingBag, ShieldCheck, Check } from 'lucide-react';
import { TechProductItem } from './CompactProductCard';
import { formatCurrency } from '@/lib/formatters';
import { useCart } from '@/providers/cart-context';

interface FeaturedProductCardProps {
  product: TechProductItem;
}

export const FeaturedProductCard: React.FC<FeaturedProductCardProps> = ({ product }) => {
  const { addToCart } = useCart();
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [added, setAdded] = useState(false);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product, 1);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  return (
    <div className="group relative bg-white rounded-3xl p-5 border border-slate-200/80 hover:border-brand-accent shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between">
      {/* Image Container */}
      <Link href={`/products/${product.id}`} className="relative aspect-[4/3] w-full rounded-2xl bg-gradient-to-b from-slate-50 to-slate-100 p-6 flex items-center justify-center overflow-hidden block">
        {product.discountPercentage && (
          <span className="absolute top-3 left-3 bg-brand-accent text-white text-[11px] font-black px-2.5 py-1 rounded-lg shadow-sm z-10">
            SAVE {product.discountPercentage}%
          </span>
        )}

        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setIsWishlisted(!isWishlisted);
          }}
          className="absolute top-3 right-3 z-10 w-9 h-9 rounded-full bg-white/90 backdrop-blur-md flex items-center justify-center text-slate-400 hover:text-red-500 shadow-sm"
        >
          <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-red-500 text-red-500' : ''}`} />
        </button>

        <img
          src={product.imageUrl}
          alt={product.title}
          className="object-contain max-h-full max-w-full group-hover:scale-105 transition-transform duration-500"
        />
      </Link>

      {/* Details */}
      <div className="mt-4 space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">
            {product.brand}
          </span>
          <div className="flex items-center space-x-1 text-xs font-bold text-amber-500">
            <Star className="w-3.5 h-3.5 fill-amber-400" />
            <span>{product.rating} ({product.reviewCount})</span>
          </div>
        </div>

        <Link href={`/products/${product.id}`}>
          <h3 className="text-sm font-bold text-brand-primary line-clamp-2 hover:text-brand-accent transition-colors">
            {product.title}
          </h3>
        </Link>

        <div className="flex items-center space-x-1 text-[10px] text-emerald-700 font-bold bg-emerald-50 px-2 py-1 rounded-md w-fit">
          <ShieldCheck className="w-3 h-3 text-emerald-600" />
          <span>{product.warrantyText || 'Official Brand Warranty'}</span>
        </div>

        <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
          <div>
            <span className="text-lg font-black text-brand-primary block">
              {formatCurrency(product.price)}
            </span>
            {product.originalPrice && (
              <span className="text-xs text-slate-400 line-through">
                {formatCurrency(product.originalPrice)}
              </span>
            )}
          </div>

          <button
            type="button"
            onClick={handleAddToCart}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold flex items-center space-x-1.5 transition-all shadow-sm cursor-pointer ${
              added
                ? 'bg-emerald-600 text-white'
                : 'bg-brand-primary text-white hover:bg-brand-accent'
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
                <span>Add to Cart</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
