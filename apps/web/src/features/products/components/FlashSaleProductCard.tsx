'use client';

import React, { useState } from 'react';
import { ShoppingBag, Flame } from 'lucide-react';
import { TechProductItem } from './CompactProductCard';
import { formatCurrency } from '@/lib/formatters';

interface FlashSaleProductCardProps {
  product: TechProductItem & { soldCount?: number; totalStock?: number };
}

export const FlashSaleProductCard: React.FC<FlashSaleProductCardProps> = ({ product }) => {
  const [added, setAdded] = useState(false);
  const sold = product.soldCount || 18;
  const total = product.totalStock || 25;
  const percentage = Math.min(Math.round((sold / total) * 100), 100);

  const handleAdd = () => {
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  return (
    <div className="group relative bg-white rounded-2xl p-4 border border-brand-accent/30 hover:border-brand-accent shadow-sm hover:shadow-lg transition-all flex flex-col justify-between h-full min-w-[240px]">
      <div className="relative aspect-square w-full rounded-xl bg-slate-50 p-4 flex items-center justify-center overflow-hidden">
        {product.discountPercentage && (
          <span className="absolute top-2 left-2 bg-brand-accent text-white text-[10px] font-black px-2 py-0.5 rounded shadow z-10 flex items-center space-x-0.5">
            <Flame className="w-3 h-3" />
            <span>-{product.discountPercentage}% OFF</span>
          </span>
        )}

        <img
          src={product.imageUrl}
          alt={product.title}
          className="object-contain max-h-full max-w-full group-hover:scale-105 transition-transform duration-300"
        />
      </div>

      <div className="mt-3 space-y-2 flex-1 flex flex-col justify-between">
        <div>
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
            {product.brand}
          </span>
          <h3 className="text-xs font-bold text-brand-primary line-clamp-2 mt-0.5">
            {product.title}
          </h3>
        </div>

        {/* Stock Progress Bar */}
        <div className="space-y-1">
          <div className="flex items-center justify-between text-[10px] font-bold">
            <span className="text-slate-500">Stock Status</span>
            <span className="text-brand-accent">{sold}/{total} Sold</span>
          </div>
          <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
            <div
              className="bg-brand-accent h-full rounded-full transition-all duration-500"
              style={{ width: `${percentage}%` }}
            />
          </div>
        </div>

        <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
          <div>
            <span className="text-sm font-black text-brand-primary block">
              {formatCurrency(product.price)}
            </span>
            {product.originalPrice && (
              <span className="text-[10px] text-slate-400 line-through">
                {formatCurrency(product.originalPrice)}
              </span>
            )}
          </div>

          <button
            onClick={handleAdd}
            className="px-3 py-1.5 rounded-xl bg-brand-accent text-white font-bold text-xs hover:bg-brand-accent/90 transition-colors shadow-sm flex items-center space-x-1"
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>Add</span>
          </button>
        </div>
      </div>
    </div>
  );
};
