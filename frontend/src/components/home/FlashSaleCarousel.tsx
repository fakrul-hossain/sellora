'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Flame, Clock, ChevronLeft, ChevronRight, Sparkles, ArrowRight } from 'lucide-react';
import { mockProducts } from '@/lib/products-data';
import { ApiClient } from '@/lib/api-client';
import { SelloraProductCard } from '@/components/common/SelloraProductCard';

export function FlashSaleCarousel({ products }: { products?: any[] } = {}) {
  const [timeLeft, setTimeLeft] = useState({ hours: 5, minutes: 42, seconds: 18 });
  const [liveProducts, setLiveProducts] = useState<any[]>(products || []);

  useEffect(() => {
    if (products && products.length > 0) {
      setLiveProducts(products);
    } else {
      ApiClient.get<any[]>('/products')
        .then((data) => {
          if (data && data.length > 0) setLiveProducts(data.slice(0, 6));
        })
        .catch(() => {});
    }
  }, [products]);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { ...prev, minutes: 59, seconds: 59 };
        if (prev.hours > 0) return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        return prev;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const flashProducts = liveProducts.length > 0 ? liveProducts.slice(0, 6) : mockProducts.slice(0, 5);

  return (
    <section className="py-8 sm:py-12 bg-[#FAFAFA] relative overflow-hidden">
      {/* Background Sheen */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-transparent rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-[1536px] mx-auto px-4 sm:px-6 space-y-6 relative z-10">
        {/* Flash Header & Timer */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-5">

          {/* Title & Brand Badge */}
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-brand-primary flex items-center justify-center text-white shadow-lg shrink-0">
              <Flame className="w-6 h-6 fill-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-black text-brand-primary uppercase tracking-wider bg-brand-lightest px-2.5 py-0.5 rounded border border-brand-light">
                  LIMITED TIME DEAL
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-brand-dark tracking-tight mt-0.5">
                Flash Super Deals 2026
              </h2>
            </div>
          </div>

          {/* Ticking Timer Badges */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-500">Ends in:</span>
            <div className="flex items-center gap-1.5 font-mono font-black text-sm text-brand-dark">
              <span className="bg-white border border-slate-200 px-2.5 py-1.5 rounded-xl shadow-xs">
                {String(timeLeft.hours).padStart(2, '0')}h
              </span>
              <span className="text-slate-400 font-bold">:</span>
              <span className="bg-white border border-slate-200 px-2.5 py-1.5 rounded-xl shadow-xs">
                {String(timeLeft.minutes).padStart(2, '0')}m
              </span>
              <span className="text-slate-400 font-bold">:</span>
              <span className="bg-brand-primary text-white px-2.5 py-1.5 rounded-xl shadow-xs">
                {String(timeLeft.seconds).padStart(2, '0')}s
              </span>
            </div>
          </div>

          {/* Right Section: Timer + See All Deals Button */}
          <div className="flex flex-wrap items-center justify-between sm:justify-end gap-4 md:gap-6">
            {/* See All Deals Button */}
            <Link
              href="/categories"
              className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-brand-primary hover:text-brand-dark bg-brand-lightest hover:bg-brand-light/50 px-4 py-2 rounded-xl transition-all group shrink-0"
            >
              <span>See All Deals</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>

        </div>

        {/* Flash Sale Product Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {flashProducts.map((prod) => (
            <div key={prod.id} className="space-y-2">
              <SelloraProductCard product={prod} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}