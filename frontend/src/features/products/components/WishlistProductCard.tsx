'use client';

import React from 'react';
import { ShoppingBag, X } from 'lucide-react';
import { TechProductItem } from './CompactProductCard';
import { formatCurrency } from '@/lib/formatters';

interface WishlistProductCardProps {
  product: TechProductItem;
  onRemove?: () => void;
}

export const WishlistProductCard: React.FC<WishlistProductCardProps> = ({ product, onRemove }) => {
  return (
    <div className="group relative bg-white rounded-2xl p-4 border border-slate-200 shadow-sm flex flex-col justify-between">
      <button
        onClick={onRemove}
        className="absolute top-2 right-2 z-10 w-7 h-7 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 hover:text-red-500 transition-colors"
      >
        <X className="w-3.5 h-3.5" />
      </button>

      <div className="aspect-square w-full bg-slate-50 rounded-xl p-3 flex items-center justify-center">
        <img src={product.imageUrl} alt={product.title} className="object-contain max-h-full" />
      </div>

      <div className="mt-3 space-y-2">
        <span className="text-[10px] font-bold text-slate-400 uppercase">{product.brand}</span>
        <h4 className="text-xs font-bold text-brand-primary line-clamp-1">{product.title}</h4>
        <span className="text-sm font-black text-brand-primary block">{formatCurrency(product.price)}</span>
        
        <button className="w-full py-2 rounded-xl bg-brand-primary text-white text-xs font-bold flex items-center justify-center space-x-1.5 hover:bg-brand-accent transition-colors">
          <ShoppingBag className="w-3.5 h-3.5" />
          <span>Move to Cart</span>
        </button>
      </div>
    </div>
  );
};
