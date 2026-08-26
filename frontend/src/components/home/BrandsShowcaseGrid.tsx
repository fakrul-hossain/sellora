'use client';

import React from 'react';
import Link from 'next/link';
import { ShieldCheck } from 'lucide-react';
import { useSiteSettings } from '@/hooks/use-site-settings';

const DEFAULT_BRANDS = [
  { id: 1, name: 'Apple', logo: 'https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?q=80&w=200', badge: 'Official Authorized' },
  { id: 2, name: 'Sony', logo: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=200', badge: 'Official Store' },
  { id: 3, name: 'Samsung', logo: 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?q=80&w=200', badge: 'Top Seller' },
  { id: 4, name: 'Anker', logo: 'https://images.unsplash.com/photo-1546868871-7041f2a55e12?q=80&w=200', badge: 'Fast Delivery' },
  { id: 5, name: 'Remax', logo: '', badge: 'Official Partner' },
  { id: 6, name: 'Baseus', logo: '', badge: 'Official Store' },
  { id: 7, name: 'Xiaomi', logo: '', badge: 'Authorized Hub' },
  { id: 8, name: 'Asus', logo: '', badge: 'Gaming Official' },
];

export function BrandsShowcaseGrid() {
  const { settings } = useSiteSettings();

  const brandsList = settings?.brandsConfig && settings.brandsConfig.length > 0
    ? settings.brandsConfig
    : DEFAULT_BRANDS;

  return (
    <section className="py-10 bg-white border-y border-slate-100 font-sans">
      <div className="max-w-[1536px] mx-auto px-4 sm:px-6 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <span className="text-xs font-black text-brand-primary uppercase tracking-wider bg-brand-lightest px-3 py-1 rounded-full border border-brand-light">
              DIRECT DISTRIBUTORS
            </span>
            <h2 className="text-xl sm:text-2xl font-black text-brand-dark mt-1 tracking-tight">
              Shop Official Brand Stores
            </h2>
          </div>
          <span className="text-xs font-bold text-slate-500">100% Genuine Manufacturer Guarantee</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
          {brandsList.map((brand, idx) => (
            <Link
              key={brand.id || idx}
              href={`/search?search=${encodeURIComponent(brand.name)}`}
              className="p-4 rounded-2xl bg-slate-50 hover:bg-white border border-slate-200/80 hover:border-brand-primary/40 shadow-2xs hover:shadow-md transition-all flex flex-col items-center text-center gap-1.5 group cursor-pointer"
            >
              {brand.logo ? (
                <img src={brand.logo} alt={brand.name} className="w-10 h-10 object-contain rounded-xl bg-white p-1 border border-slate-200" />
              ) : (
                <div className="w-10 h-10 rounded-xl bg-brand-dark text-white font-black text-xs flex items-center justify-center group-hover:scale-105 transition-transform shadow-2xs">
                  {brand.name.slice(0, 3).toUpperCase()}
                </div>
              )}
              <span className="text-xs font-black text-slate-900 group-hover:text-brand-primary transition-colors line-clamp-1">
                {brand.name}
              </span>
              <span className="text-[9px] font-extrabold text-brand-primary bg-brand-lightest px-2 py-0.5 rounded-full flex items-center gap-0.5 truncate max-w-full">
                <ShieldCheck className="w-2.5 h-2.5 shrink-0" />
                <span className="truncate">{brand.badge || 'Official'}</span>
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
