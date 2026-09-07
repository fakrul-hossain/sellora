'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { ApiClient } from '@/lib/api-client';
import { mockProducts } from '@/lib/products-data';
import { SelloraProductCard } from '@/components/common/SelloraProductCard';

export default function CategoriesBrowsePage() {
  const [products, setProducts] = useState<any[]>([]);

  useEffect(() => {
    ApiClient.get<any[]>('/products')
      .then((data) => {
        if (data && data.length > 0) setProducts(data);
      })
      .catch((err) => console.error('Failed to load category products:', err));
  }, []);

  const displayProducts = products.length > 0 ? products : mockProducts;

  const categoriesList = [
    { name: "Men's Fashion", icon: '👔', count: '450+ Products' },
    { name: "Women's Fashion", icon: '👗', count: '620+ Products' },
    { name: 'Electronics', icon: '🎧', count: '1,200+ Products' },
    { name: 'Home & Living', icon: '🏠', count: '380+ Products' },
    { name: 'Beauty & Health', icon: '💄', count: '540+ Products' },
    { name: 'Groceries', icon: '🛒', count: '910+ Products' },
    { name: 'Sports & Outdoors', icon: '⚽', count: '290+ Products' },
    { name: 'Toys & Kids', icon: '🧸', count: '310+ Products' },
    { name: 'Automotive', icon: '🚗', count: '180+ Products' },
    { name: 'Mobile Accessories', icon: '📱', count: '850+ Products' },
  ];

  return (
    <div className="min-h-screen bg-[#FAFAFA] flex flex-col justify-between font-sans text-slate-800">
      <main className="flex-1 py-8">
        <div className="max-w-[1536px] mx-auto px-4 space-y-8">
          <div className="border-b border-slate-200 pb-4">
            <h1 className="text-2xl font-black text-brand-dark">All Product Categories</h1>
            <p className="text-xs text-slate-500 mt-1">Browse our complete collection across all departments in Bangladesh.</p>
          </div>

          {/* Categories Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2.5 sm:gap-4">
            {categoriesList.map((c) => (
              <Link
                key={c.name}
                href={`/search?q=${encodeURIComponent(c.name)}`}
                className="p-3.5 sm:p-5 rounded-2xl bg-white border border-slate-200/80 hover:border-brand-primary shadow-2xs hover:shadow-md transition-all cursor-pointer group block"
              >
                <span className="text-2xl sm:text-3xl block mb-1.5 sm:mb-2">{c.icon}</span>
                <h3 className="text-xs font-bold text-slate-900 group-hover:text-brand-primary transition-colors">{c.name}</h3>
                <span className="text-[10px] text-slate-400 font-semibold block mt-0.5 sm:mt-1">{c.count}</span>
              </Link>
            ))}
          </div>

          {/* Featured Department Items */}
          <div className="space-y-4 pt-4">
            <h2 className="text-base font-extrabold text-brand-dark">Live Catalog Products</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5 sm:gap-4">
              {displayProducts.map((p) => (
                <SelloraProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
