'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { useSiteSettings } from '@/hooks/use-site-settings';

const DEFAULT_CATEGORIES = [
  { id: 1, name: 'Smartphones', itemCount: '140+ Items', image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?q=80&w=300', href: '/search?category=Electronics' },
  { id: 2, name: 'Audio & Sound', itemCount: '95+ Items', image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=300', href: '/search?category=Gadgets' },
  { id: 3, name: 'Laptops & PCs', itemCount: '60+ Items', image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?q=80&w=300', href: '/search?category=Electronics' },
  { id: 4, name: 'Smartwatches', itemCount: '80+ Items', image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=300', href: '/search?category=Gadgets' },
  { id: 5, name: 'Fashion & Apparel', itemCount: '200+ Items', image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=300', href: '/search?category=Fashion' },
];

export function CategoryCircularGrid() {
  const { settings } = useSiteSettings();

  const categoriesList = settings?.categoriesConfig && settings.categoriesConfig.length > 0
    ? settings.categoriesConfig
    : DEFAULT_CATEGORIES;

  return (
    <section className="py-8 sm:py-12 bg-white font-sans">
      <div className="max-w-[1536px] mx-auto px-4 sm:px-6 space-y-8">

        {/* Header Section */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 border-b border-slate-100 pb-4">
          <div>
            <span className="text-xs font-black text-brand-primary uppercase tracking-wider bg-brand-lightest px-3 py-1 rounded-full border border-brand-light">
              EXPLORE MARKETPLACE
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-brand-dark mt-2 tracking-tight">
              Featured Categories
            </h2>
          </div>
          <Link
            href="/categories"
            className="text-xs font-extrabold text-brand-primary hover:underline flex items-center gap-1 shrink-0"
          >
            <span>View All Categories</span>
            <ArrowUpRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Circular Grid Layout */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6 sm:gap-8">
          {categoriesList.map((cat) => (
            <Link
              key={cat.id}
              href={cat.href || `/search?category=${encodeURIComponent(cat.name)}`}
              className="group flex flex-col items-center text-center transition-all duration-300"
            >
              {/* Circular Image Stage */}
              <div className="relative w-28 h-28 sm:w-36 sm:h-36 rounded-full bg-slate-100 p-2 flex items-center justify-center overflow-hidden transition-transform duration-300 group-hover:scale-105 group-hover:shadow-lg border border-slate-200">
                <img
                  src={cat.image}
                  alt={cat.name}
                  className="w-full h-full object-cover rounded-full group-hover:scale-110 transition-transform duration-500 ease-out"
                  loading="lazy"
                />
              </div>

              {/* Title & Product Count */}
              <div className="mt-3 space-y-1">
                <h3 className="text-sm sm:text-base font-bold text-slate-800 group-hover:text-brand-primary transition-colors line-clamp-2">
                  {cat.name}
                </h3>
                <p className="text-xs text-slate-400 font-medium">
                  {cat.itemCount}
                </p>
              </div>
            </Link>
          ))}
        </div>

      </div>
    </section>
  );
}