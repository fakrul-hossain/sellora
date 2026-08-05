'use client';

import React from 'react';
import { X, Check } from 'lucide-react';
import { TechProductItem } from './CompactProductCard';
import { formatCurrency } from '@/lib/formatters';

interface CompareProductCardProps {
  product: TechProductItem;
  onRemove?: () => void;
}

export const CompareProductCard: React.FC<CompareProductCardProps> = ({ product, onRemove }) => {
  return (
    <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm relative space-y-3">
      <button
        onClick={onRemove}
        className="absolute top-2 right-2 text-slate-400 hover:text-red-500"
      >
        <X className="w-4 h-4" />
      </button>

      <div className="w-20 h-20 mx-auto bg-slate-50 rounded-xl p-2 flex items-center justify-center">
        <img src={product.imageUrl} alt={product.title} className="object-contain max-h-full" />
      </div>

      <div className="text-center">
        <h4 className="text-xs font-bold text-brand-primary line-clamp-1">{product.title}</h4>
        <span className="text-xs font-black text-brand-accent mt-0.5 block">
          {formatCurrency(product.price)}
        </span>
      </div>

      <div className="space-y-1 pt-2 border-t border-slate-100 text-[10px] text-slate-500">
        <div className="flex items-center justify-between">
          <span>Warranty:</span>
          <span className="font-bold text-slate-700">{product.warrantyText || 'Official'}</span>
        </div>
        <div className="flex items-center justify-between">
          <span>Rating:</span>
          <span className="font-bold text-amber-500">{product.rating} ★</span>
        </div>
      </div>
    </div>
  );
};
