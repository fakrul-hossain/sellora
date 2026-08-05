'use client';

import React, { useState } from 'react';
import { mockProducts } from '@/lib/products-data';

import { StorefrontHeader, MobileBottomBar, StorefrontFooter } from '@/components/layout';
import {
  StorefrontHero,
  FlashSaleCarousel,
  EditorialBentoShowcase,
  BrandsShowcaseGrid,
  LuxuryNewsletterCard,
  GuaranteeBar,
  BrandWeekBanner,
  CategoryCircularGrid,
} from '@/components/home';
import { SelloraProductCard } from '@/components/common/SelloraProductCard';

export default function RedesignedStorefrontPage() {
  const [activeTab, setActiveTab] = useState<'trending' | 'new' | 'budget' | 'all'>('trending');

  const trendingProducts = mockProducts.slice(0, 6);
  const newArrivals = mockProducts.slice(2, 8);
  const budgetDeals = mockProducts.filter((p) => p.price < 2000);

  const getActiveProducts = () => {
    switch (activeTab) {
      case 'new':
        return newArrivals;
      case 'budget':
        return budgetDeals;
      case 'all':
        return mockProducts;
      case 'trending':
      default:
        return trendingProducts;
    }
  };

  const activeProducts = getActiveProducts();

  return (
    <div className="min-h-screen bg-[#FAFAFA] flex flex-col justify-between font-sans text-slate-800 antialiased pb-16 md:pb-0">
      {/* 3-Level Premium Header */}

      <main className="flex-1 space-y-4">
        {/* 1. High-Impact Hero Campaign Showcase */}
        <StorefrontHero />

        {/* 2. Top Trust Guarantee Bar */}
        <GuaranteeBar />

        {/* 3. Brand Week Campaign Banner */}
        <BrandWeekBanner />

        {/* 4. Flash Sale Carousel with Live Timer & Stock Progress */}
        <FlashSaleCarousel />


        {/* 4. Tech Category Bento Grid */}
        <CategoryCircularGrid />


        {/* 5. Editorial Bento Showcase (Apple Ecosystem & Audio) */}
        <EditorialBentoShowcase />

        {/* 6. Main Product Discovery Engine with Tabs */}
        <section className="py-8 sm:py-12 bg-white">
          <div className="max-w-[1536px] mx-auto px-4 sm:px-6 space-y-6">

            {/* Tab Navigation Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
              <div>
                <span className="text-xs font-black text-brand-primary uppercase tracking-wider bg-brand-lightest px-3 py-1 rounded-full border border-brand-light">
                  DISCOVER HARDWARE
                </span>
                <h2 className="text-2xl sm:text-3xl font-black text-brand-dark mt-1 tracking-tight">
                  Featured Tech Products
                </h2>
              </div>

              {/* Filter Tabs */}
              <div className="flex items-center gap-2 overflow-x-auto scrollbar-none py-1">
                <button
                  onClick={() => setActiveTab('trending')}
                  className={`px-4 py-2 rounded-2xl text-xs font-extrabold transition-all cursor-pointer whitespace-nowrap ${activeTab === 'trending'
                    ? 'bg-brand-primary text-white shadow-md'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                >
                  🔥 Trending Now
                </button>

                <button
                  onClick={() => setActiveTab('new')}
                  className={`px-4 py-2 rounded-2xl text-xs font-extrabold transition-all cursor-pointer whitespace-nowrap ${activeTab === 'new'
                    ? 'bg-brand-primary text-white shadow-md'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                >
                  ✨ New Arrivals
                </button>

                <button
                  onClick={() => setActiveTab('budget')}
                  className={`px-4 py-2 rounded-2xl text-xs font-extrabold transition-all cursor-pointer whitespace-nowrap ${activeTab === 'budget'
                    ? 'bg-brand-primary text-white shadow-md'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                >
                  🏷️ Under ৳2,000 Budget
                </button>
              </div>
            </div>

            {/* Product Cards Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {activeProducts.map((prod) => (
                <SelloraProductCard key={prod.id} product={prod} />
              ))}
            </div>
          </div>
        </section>

        {/* 7. Interactive Official Brand Wall */}
        <BrandsShowcaseGrid />

        {/* 8. Luxury Tech Newsletter Subscription */}
        <LuxuryNewsletterCard />
      </main>

      {/* Mobile Bottom Navigation Bar */}
      <MobileBottomBar />

      {/* Rich 4-Column Footer */}

    </div>
  );
}
