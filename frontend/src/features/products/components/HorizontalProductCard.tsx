'use client';

import React from 'react';
import { ShoppingBag, Trash2 } from 'lucide-react';
import { TechProductItem } from './CompactProductCard';
import { formatCurrency } from '@/lib/formatters';

interface HorizontalProductCardProps {
  product: TechProductItem;
  onRemove?: () => void;
}

export const HorizontalProductCard: React.FC<HorizontalProductCardProps> = ({
  product,
  onRemove,
}) => {
  return (
    <div className="flex items-center space-x-4 p-3 rounded-2xl bg-white border border-slate-200/80 shadow-xs hover:shadow-md transition-all">
      <div className="w-16 h-16 rounded-xl bg-slate-50 p-2 shrink-0 flex items-center justify-center">
        <img src={product.imageUrl} alt={product.title} className="object-contain max-h-full" />
      </div>

      <div className="flex-1 min-w-0">
        <span className="text-[10px] font-bold text-slate-400 uppercase">{product.brand}</span>
        <h4 className="text-xs font-bold text-brand-primary truncate">{product.title}</h4>
        <div className="flex items-center space-x-2 mt-1">
          <span className="text-xs font-black text-brand-primary">{formatCurrency(product.price)}</span>
          {product.originalPrice && (
            <span className="text-[10px] text-slate-400 line-through">
              {formatCurrency(product.originalPrice)}
            </span>
          )}
        </div>
      </div>

      {onRemove && (
        <button
          onClick={onRemove}
          className="p-1.5 text-slate-400 hover:text-red-500 rounded-lg hover:bg-slate-100 transition-colors"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      )}
    </div>
  );
};
