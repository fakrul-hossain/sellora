'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { ApiClient } from '@/lib/api-client';
import { MarketplaceProductCard } from '@/components/common/MarketplaceProductCard';
import { useSiteSettings } from '@/hooks/use-site-settings';
import { Tag, Sparkles, Truck, CheckCircle2 } from 'lucide-react';

export default function CampaignLandingPage() {
  const params = useParams();
  const slug = params?.slug as string;

  const { settings } = useSiteSettings();
  const [products, setProducts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [voucherCollected, setVoucherCollected] = useState(false);

  useEffect(() => {
    async function fetchCampaignProducts() {
      try {
        setIsLoading(true);
        const data = await ApiClient.get<any[]>('/products');
        setProducts(data || []);
      } catch (err) {
        console.error('Failed to fetch campaign products:', err);
      } finally {
        setIsLoading(false);
      }
    }
    fetchCampaignProducts();
  }, [slug]);

  // Find banner matching slug from heroConfig or brandWeekConfig
  const heroSlide = settings?.heroConfig?.slides?.find((s) => s.slug.includes(slug));
  const isBrandWeek = settings?.brandWeekConfig?.slug.includes(slug);

  const bannerImage = heroSlide?.image || (isBrandWeek ? settings?.brandWeekConfig?.image : null) || 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?q=80&w=1400';
  const campaignTitle = slug ? slug.replace(/-/g, ' ').toUpperCase() : 'SPECIAL CAMPAIGN';

  return (
    <div className="min-h-screen bg-[#FAFAFA] font-sans text-slate-800 antialiased pb-16">
      {/* 1. TOP FULL-WIDTH CAMPAIGN BANNER IMAGE */}
      <div className="w-full relative h-[200px] sm:h-[300px] lg:h-[380px] bg-slate-900 overflow-hidden border-b border-slate-200">
        <img
          src={bannerImage}
          alt={campaignTitle}
          className="w-full h-full object-cover object-center"
        />
      </div>

      <div className="max-w-[1536px] mx-auto px-4 sm:px-6 space-y-6 mt-6">
        {/* 2. VOUCHER & FREE SHIPPING PROMO BAR */}
        <div className="bg-gradient-to-r from-sky-50 via-indigo-50 to-blue-50 border border-sky-200/80 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-2xs">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-sky-500 text-white flex items-center justify-center shrink-0 shadow-xs">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-black text-sky-900 uppercase">৳45 OFF Free Delivery</span>
                <span className="text-[10px] font-bold bg-sky-200 text-sky-800 px-2 py-0.5 rounded-md">
                  Min Spend ৳499
                </span>
              </div>
              <p className="text-[11px] text-sky-700 font-medium mt-0.5">
                Valid for campaign products across Bangladesh • Terms Apply
              </p>
            </div>
          </div>

          <button
            onClick={() => setVoucherCollected(true)}
            className={`px-5 py-2.5 rounded-xl font-extrabold text-xs transition-all flex items-center gap-1.5 cursor-pointer shadow-xs ${
              voucherCollected
                ? 'bg-emerald-600 text-white'
                : 'bg-brand-primary hover:bg-brand-primary-hover text-white'
            }`}
          >
            {voucherCollected ? (
              <>
                <CheckCircle2 className="w-4 h-4" />
                <span>VOUCHER COLLECTED</span>
              </>
            ) : (
              <>
                <Tag className="w-4 h-4" />
                <span>COLLECT VOUCHER</span>
              </>
            )}
          </button>
        </div>

        {/* 3. CAMPAIGN TITLE BAR */}
        <div className="flex items-center justify-between border-b border-slate-200 pb-3">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-brand-primary" />
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              {campaignTitle} PRODUCTS
            </h1>
          </div>

          <span className="text-xs font-bold text-slate-500">
            Showing {products.length} Campaign Items
          </span>
        </div>

        {/* 4. PRODUCT CARD GRID (Matching Reference Screenshot) */}
        {isLoading ? (
          <div className="py-16 text-center text-xs text-slate-400 font-bold">
            Loading campaign products...
          </div>
        ) : products.length === 0 ? (
          <div className="py-16 text-center text-xs text-slate-400 font-bold">
            No products found for this campaign.
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {products.map((p) => (
              <MarketplaceProductCard key={p.id} product={p} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
