'use client';
import React, { useState, useEffect } from 'react';
import { ApiClient } from '@/lib/api-client';
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
  const [dbProducts, setDbProducts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadStorefrontProducts() {
      try {
        setIsLoading(true);
        const data = await ApiClient.get<any[]>('/products');
        if (data && data.length > 0) {
          setDbProducts(data);
        }
      } catch (err) {
        console.error('Failed to load database products:', err);
      } finally {
        setIsLoading(false);
      }
    }
    loadStorefrontProducts();
  }, []);

  const effectiveProducts = dbProducts.length > 0 ? dbProducts : mockProducts;

  // 1. Trending: Top rated products
  const trendingProducts = [...effectiveProducts]
    .sort((a, b) => Number(b.rating || 0) - Number(a.rating || 0))
    .slice(0, 12);

  // 2. New Arrivals: Sorted by latest created date / ID descending so new vendor products appear first
  const newArrivals = [...effectiveProducts]
    .sort((a, b) => {
      const timeA = a.createdAt ? new Date(a.createdAt).getTime() : Number(a.id) || 0;
      const timeB = b.createdAt ? new Date(b.createdAt).getTime() : Number(b.id) || 0;
      return timeB - timeA;
    })
    .slice(0, 12);

  // 3. Under 2,000 Budget Deals
  const budgetDeals = effectiveProducts.filter((p) => Number(p.price) < 2000).slice(0, 12);

  const getActiveProducts = () => {
    switch (activeTab) {
      case 'new':
        return newArrivals;
      case 'budget':
        return budgetDeals.length > 0 ? budgetDeals : effectiveProducts.slice(0, 12);
      case 'all':
        return effectiveProducts;
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
        <FlashSaleCarousel products={effectiveProducts.slice(0, 8)} />


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
