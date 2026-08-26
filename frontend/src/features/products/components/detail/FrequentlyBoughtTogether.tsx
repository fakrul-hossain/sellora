'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Check, ShoppingCart, Sparkles } from 'lucide-react';
import { BundleAccessory, ProductDetailItem } from '@/lib/products-data';

interface FrequentlyBoughtTogetherProps {
  product: ProductDetailItem;
}

export function FrequentlyBoughtTogether({ product }: FrequentlyBoughtTogetherProps) {
  const accessories = product.frequentlyBoughtTogether || [
    {
      id: 'acc-case',
      title: 'Hard EVA Earphone Protective Travel Case',
      price: 290,
      originalPrice: 450,
      imageUrl: 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&w=300&q=80',
      defaultSelected: true,
    },
    {
      id: 'acc-charger',
      title: 'Baseus 20W PD Type-C Fast Wall Charger',
      price: 890,
      originalPrice: 1200,
      imageUrl: 'https://images.unsplash.com/photo-1609592424074-b52e6bc80d85?auto=format&fit=crop&w=300&q=80',
      defaultSelected: true,
    },
  ];

  const [selectedIds, setSelectedIds] = useState<string[]>(
    accessories.filter((a) => a.defaultSelected).map((a) => a.id)
  );

  const [addedBundle, setAddedBundle] = useState(false);

  const toggleAccessory = (id: string) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter((item) => item !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

  const selectedAccessories = accessories.filter((a) => selectedIds.includes(a.id));
  const accessoriesTotal = selectedAccessories.reduce((sum, a) => sum + a.price, 0);
  const accessoriesOriginalTotal = selectedAccessories.reduce((sum, a) => sum + (a.originalPrice || a.price), 0);
  const grandTotal = product.price + accessoriesTotal;
  const grandOriginalTotal = (product.originalPrice || product.price) + accessoriesOriginalTotal;
  const bundleSavings = grandOriginalTotal - grandTotal;

  const handleAddBundleToCart = () => {
    setAddedBundle(true);
    setTimeout(() => setAddedBundle(false), 2500);
  };

  return (
    <div className="rounded-3xl bg-[#FAFAFA] border border-slate-200/90 p-6 space-y-6 shadow-2xs">
      <div className="flex items-center justify-between">
        <div>
          <span className="text-xs font-extrabold text-brand-primary uppercase tracking-wider bg-brand-lightest px-2.5 py-1 rounded-md">
            Bundle Offer
          </span>
          <h3 className="text-lg font-black text-slate-900 mt-1 flex items-center gap-2">
            Frequently Bought Together
          </h3>
        </div>

        {bundleSavings > 0 && (
          <span className="text-xs font-black text-brand-dark bg-brand-lightest border border-brand-light px-3 py-1.5 rounded-full flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5" /> Bundle Savings ৳{bundleSavings.toLocaleString()}!
          </span>
        )}
      </div>

      {/* Visual Product Cards Row */}
      <div className="flex flex-col md:flex-row items-center gap-4 overflow-x-auto py-2">
        {/* Main Product */}
        <div className="w-full md:w-48 p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs flex flex-col items-center text-center gap-2 shrink-0">
          <div className="w-20 h-20 rounded-xl bg-slate-50 p-1 border border-slate-100 flex items-center justify-center">
            <img src={product.imageUrl} alt={product.title} className="max-h-full object-contain" />
          </div>
          <span className="text-xs font-extrabold text-slate-900 line-clamp-1">{product.title}</span>
          <span className="text-xs font-black text-brand-primary">৳{product.price.toLocaleString()}</span>
          <span className="text-[10px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded">This Item</span>
        </div>

        {accessories.map((acc, idx) => {
          const isChecked = selectedIds.includes(acc.id);
          return (
            <React.Fragment key={acc.id}>
              <div className="text-slate-400 font-black text-xl shrink-0">+</div>

              <div
                onClick={() => toggleAccessory(acc.id)}
                className={`w-full md:w-48 p-4 rounded-2xl border transition-all cursor-pointer flex flex-col items-center text-center gap-2 shrink-0 relative ${
                  isChecked
                    ? 'bg-white border-brand-primary ring-2 ring-brand-primary/20 shadow-2xs'
                    : 'bg-slate-100/70 border-slate-200 opacity-60 hover:opacity-100'
                }`}
              >
                <div
                  className={`absolute top-3 right-3 w-5 h-5 rounded-md border flex items-center justify-center ${
                    isChecked ? 'bg-brand-primary border-brand-primary text-white' : 'border-slate-300 bg-white'
                  }`}
                >
                  {isChecked && <Check className="w-3.5 h-3.5" />}
                </div>

                <div className="w-20 h-20 rounded-xl bg-slate-50 p-1 border border-slate-100 flex items-center justify-center">
                  <img src={acc.imageUrl} alt={acc.title} className="max-h-full object-contain" />
                </div>
                <span className="text-xs font-bold text-slate-900 line-clamp-1">{acc.title}</span>
                <div className="flex items-baseline gap-1.5">
                  <span className="text-xs font-black text-brand-primary">৳{acc.price.toLocaleString()}</span>
                  {acc.originalPrice && (
                    <span className="text-[10px] text-slate-400 line-through">৳{acc.originalPrice.toLocaleString()}</span>
                  )}
                </div>
              </div>
            </React.Fragment>
          );
        })}
      </div>

      {/* Checkbox List & Combined Price CTA */}
      <div className="p-4 rounded-2xl bg-white border border-slate-200/90 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div className="space-y-2 text-xs font-bold text-slate-800">
          <div className="flex items-center gap-2">
            <input type="checkbox" checked disabled className="rounded text-brand-primary" />
            <span>{product.title} (৳{product.price.toLocaleString()})</span>
          </div>

          {accessories.map((acc) => (
            <label key={acc.id} className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={selectedIds.includes(acc.id)}
                onChange={() => toggleAccessory(acc.id)}
                className="rounded text-brand-primary focus:ring-brand-primary"
              />
              <span>
                {acc.title} (<span className="text-brand-primary">৳{acc.price.toLocaleString()}</span>)
              </span>
            </label>
          ))}
        </div>

        <div className="flex items-center justify-between lg:justify-end gap-6 pt-3 lg:pt-0 border-t lg:border-t-0 border-slate-100">
          <div>
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Total Bundle Price</span>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-black text-slate-900">৳{grandTotal.toLocaleString()}</span>
              {grandOriginalTotal > grandTotal && (
                <span className="text-xs text-slate-400 line-through">৳{grandOriginalTotal.toLocaleString()}</span>
              )}
            </div>
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleAddBundleToCart}
            className={`py-3.5 px-6 rounded-2xl font-black text-xs flex items-center gap-2 transition-all shadow-md cursor-pointer ${
              addedBundle ? 'bg-brand-primary text-white' : 'bg-brand-primary hover:bg-brand-primary-hover text-white'
            }`}
          >
            {addedBundle ? (
              <>
                <Check className="w-4 h-4" />
                <span>Bundle Added!</span>
              </>
            ) : (
              <>
                <ShoppingCart className="w-4 h-4" />
                <span>Add {1 + selectedAccessories.length} Items to Cart</span>
              </>
            )}
          </motion.button>
        </div>
      </div>
    </div>
  );
}
