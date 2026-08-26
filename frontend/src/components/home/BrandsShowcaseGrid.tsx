'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ShieldCheck, ArrowRight } from 'lucide-react';

const BRANDS = [
  { name: 'REMAX', tag: 'Official Partner', desc: 'Audio & Chargers' },
  { name: 'APPLE', tag: 'Authorized Store', desc: 'iPhones & MacBooks' },
  { name: 'BASEUS', tag: 'Official Store', desc: 'Power Banks & Cables' },
  { name: 'SAMSUNG', tag: 'Official Hub', desc: 'Galaxy Series & Tabs' },
  { name: 'XIAOMI', tag: 'Official Store', desc: 'Redmi & Smart Home' },
  { name: 'SONY', tag: 'Official Partner', desc: 'ANC Headphones' },
  { name: 'ASUS', tag: 'Official Hub', desc: 'ROG Gaming Laptops' },
  { name: 'ANKER', tag: 'Official Store', desc: 'Soundcore & Chargers' },
];

export function BrandsShowcaseGrid() {
  return (
    <section className="py-10 bg-white border-y border-slate-100">
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
          {BRANDS.map((brand, idx) => (
            <Link
              key={idx}
              href={`/search?q=${brand.name}`}
              className="p-4 rounded-2xl bg-slate-50 hover:bg-white border border-slate-200/80 hover:border-brand-primary/40 shadow-2xs hover:shadow-md transition-all flex flex-col items-center text-center gap-1.5 group cursor-pointer"
            >
              <div className="w-10 h-10 rounded-xl bg-brand-dark text-white font-black text-xs flex items-center justify-center group-hover:scale-105 transition-transform shadow-2xs">
                {brand.name.slice(0, 3)}
              </div>
              <span className="text-xs font-black text-slate-900 group-hover:text-brand-primary transition-colors">{brand.name}</span>
              <span className="text-[9px] font-extrabold text-brand-primary bg-brand-lightest px-2 py-0.5 rounded-full flex items-center gap-0.5">
                <ShieldCheck className="w-2.5 h-2.5" /> Official
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
