'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';

const CATEGORIES = [
  {
    id: 'audio',
    title: 'Audio & ANC Sound',
    count: '340+ Products',
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=400&q=80',
    bgColor: 'bg-rose-50',
  },
  {
    id: 'mobiles',
    title: 'Smartphones & Tablets',
    count: '1,200+ Products',
    image: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&w=400&q=80',
    bgColor: 'bg-blue-50',
  },
  {
    id: 'wearables',
    title: 'Smartwatches & Fitness',
    count: '280+ Products',
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=400&q=80',
    bgColor: 'bg-purple-50',
  },
  {
    id: 'laptops',
    title: 'Laptops & Workstations',
    count: '450+ Products',
    image: 'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?auto=format&fit=crop&w=400&q=80',
    bgColor: 'bg-amber-50',
  },
  {
    id: 'smarthome',
    title: 'Smart Home & Power',
    count: '510+ Products',
    image: 'https://images.unsplash.com/photo-1609592424074-b52e6bc80d85?auto=format&fit=crop&w=400&q=80',
    bgColor: 'bg-emerald-50',
  },
];

export function CategoryCircularGrid() {
  return (
    <section className="py-8 sm:py-12 bg-white">
      <div className="max-w-[1536px] mx-auto px-4 sm:px-6 space-y-8">

        {/* Header Section */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 border-b border-slate-100 pb-4">
          <div>
            <span className="text-xs font-black text-brand-primary uppercase tracking-wider bg-brand-lightest px-3 py-1 rounded-full border border-brand-light">
              EXPLORE TECH HUB
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-brand-dark mt-2 tracking-tight">
              Categories
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
          {CATEGORIES.map((cat) => (
            <Link
              key={cat.id}
              href={`/categories?cat=${cat.id}`}
              className="group flex flex-col items-center text-center transition-all duration-300"
            >
              {/* Circular Image Stage */}
              <div
                className={`relative w-32 h-32 sm:w-36 sm:h-36 md:w-40 md:h-40 rounded-full ${cat.bgColor} p-3 flex items-center justify-center overflow-hidden transition-transform duration-300 group-hover:scale-105 group-hover:shadow-lg`}
              >
                <img
                  src={cat.image}
                  alt={cat.title}
                  className="w-full h-full object-cover rounded-full group-hover:scale-110 transition-transform duration-500 ease-out"
                  loading="lazy"
                />
              </div>

              {/* Title & Product Count */}
              <div className="mt-3 space-y-1">
                <h3 className="text-sm sm:text-base font-bold text-slate-800 group-hover:text-brand-primary transition-colors line-clamp-2">
                  {cat.title}
                </h3>
                <p className="text-xs text-slate-400 font-medium">
                  {cat.count}
                </p>
              </div>
            </Link>
          ))}
        </div>

      </div>
    </section>
  );
}