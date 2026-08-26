'use client';

import React from 'react';
import Link from 'next/link';
import { Star, ShoppingCart } from 'lucide-react';
import { useCart } from '@/providers/cart-context';

export interface ProductCardData {
  id: string | number;
  title: string;
  price: number;
  originalPrice?: number;
  discountPercentage?: number;
  imageUrl: string;
  rating?: number;
  reviewCount?: number;
  category?: string;
  brand?: string;
}

export function MarketplaceProductCard({ product }: { product: ProductCardData }) {
  const { addToCart } = useCart();

  const formattedPrice = Number(product.price).toLocaleString();
  const formattedOriginalPrice = product.originalPrice ? Number(product.originalPrice).toLocaleString() : null;
  const discountPercent = product.discountPercentage || (product.originalPrice && product.originalPrice > product.price
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : null);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart({
      id: String(product.id),
      title: product.title,
      price: product.price,
      originalPrice: product.originalPrice,
      imageUrl: product.imageUrl,
      category: product.category || 'General',
      stock: 10,
    });
  };

  return (
    <div className="group relative bg-white rounded-2xl border border-slate-100 shadow-2xs hover:shadow-md transition-all duration-300 flex flex-col justify-between overflow-hidden">
      <Link href={`/products/${product.id}`} className="block p-3 space-y-2">
        {/* Product Image Box */}
        <div className="relative w-full aspect-square rounded-xl bg-slate-50 overflow-hidden flex items-center justify-center p-2">
          <img
            src={product.imageUrl}
            alt={product.title}
            className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
          />

          {/* Discount Badge */}
          {discountPercent && discountPercent > 0 && (
            <span className="absolute top-2 left-2 bg-[#F51466] text-white text-[10px] font-black px-1.5 py-0.5 rounded-md shadow-2xs uppercase">
              -{discountPercent}%
            </span>
          )}
        </div>

        {/* Title */}
        <div className="space-y-1">
          <h3 className="text-xs font-bold text-slate-800 line-clamp-2 leading-snug group-hover:text-brand-primary transition-colors">
            {product.title}
          </h3>
        </div>

        {/* Pricing */}
        <div className="pt-1 flex flex-wrap items-baseline gap-1.5">
          <span className="text-sm font-black text-[#F51466]">
            ৳{formattedPrice}
          </span>
          {formattedOriginalPrice && (
            <span className="text-[11px] font-semibold text-slate-400 line-through">
              ৳{formattedOriginalPrice}
            </span>
          )}
        </div>

        {/* Star Rating */}
        <div className="flex items-center gap-1 text-[10px] font-bold text-slate-500 pt-0.5">
          <div className="flex items-center text-amber-400">
            <Star className="w-3 h-3 fill-amber-400 stroke-none" />
          </div>
          <span>{product.rating || 4.8}</span>
          <span className="text-slate-400">({product.reviewCount || 12})</span>
        </div>
      </Link>

      {/* Add to Cart Quick Trigger */}
      <div className="p-3 pt-0">
        <button
          onClick={handleAddToCart}
          className="w-full py-2 bg-slate-100 hover:bg-brand-primary hover:text-white text-slate-700 font-extrabold text-xs rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer"
        >
          <ShoppingCart className="w-3.5 h-3.5" />
          <span>Add To Cart</span>
        </button>
      </div>
    </div>
  );
}
