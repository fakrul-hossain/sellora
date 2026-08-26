'use client';

import React, { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Star,
  Share2,
  Heart,
  ShieldCheck,
  ChevronRight,
  Sparkles,
  ArrowRight,
} from 'lucide-react';
import { getProductById, mockProducts, ColorVariant, OptionVariant } from '@/lib/products-data';
import { SelloraProductCard } from '@/components/common/SelloraProductCard';

import {
  ProductGallery,
  ProductPricingCard,
  ProductVariantSelector,
  ProductDeliveryCard,
  ProductPurchaseActions,
  ProductTrustGrid,
  ProductKeyFeatureCards,
  ProductTabsSection,
  FrequentlyBoughtTogether,
  StickyPurchaseBar,
  EMICalculatorModal,
  ShareModal,
} from '@/features/products/components/detail';

export default function ProductDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const productId = Array.isArray(params.id) ? params.id[0] : params.id || 'remax-200h';

  const product = getProductById(productId);

  // Variant States
  const [selectedColor, setSelectedColor] = useState<ColorVariant | undefined>(
    product.colorVariants?.[0]
  );
  const [selectedVersion, setSelectedVersion] = useState<OptionVariant | undefined>(
    product.versionVariants?.[0]
  );

  // Modals
  const [isEMIOpen, setIsEMIOpen] = useState(false);
  const [isShareOpen, setIsShareOpen] = useState(false);

  // Wishlist state
  const [isWishlisted, setIsWishlisted] = useState(false);

  const priceDelta = selectedVersion?.priceDelta || 0;
  const currentPrice = product.price + priceDelta;

  const relatedProducts = mockProducts.filter((p) => p.id !== product.id).slice(0, 6);
  const recentlyViewed = mockProducts.filter((p) => p.id !== product.id).slice(2, 6);

  return (
    <div className="min-h-screen bg-[#FAFAFA] flex flex-col justify-between font-sans text-slate-800 antialiased">
      {/* Top Floating / Scroll Triggered Purchase Bar */}
      <StickyPurchaseBar
        product={product}
        priceDelta={priceDelta}
        selectedColorName={selectedColor?.name}
        selectedVersionName={selectedVersion?.name}
      />

      <main className="flex-1 py-6 sm:py-8">
        <div className="max-w-[1536px] mx-auto px-4 sm:px-6 space-y-8">

          {/* Clean Modern Breadcrumbs */}
          <nav aria-label="Breadcrumb" className="flex items-center space-x-2 text-xs font-semibold text-slate-500 overflow-x-auto scrollbar-none py-1">
            <Link href="/" className="hover:text-brand-primary transition-colors shrink-0">
              Home
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <Link href={`/categories?cat=${product.category.toLowerCase()}`} className="hover:text-brand-primary transition-colors shrink-0">
              {product.category}
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span className="text-slate-400 font-medium shrink-0">{product.brand}</span>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span className="font-extrabold text-brand-dark truncate max-w-[240px] sm:max-w-md">
              {product.title}
            </span>
          </nav>

          {/* Main Hero Product Details Card - Balanced 2-Column Grid */}
          <div className="bg-white rounded-3xl p-5 sm:p-8 lg:p-10 border border-slate-200/90 shadow-2xs grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">

            {/* LEFT COLUMN (lg:col-span-6) - Gallery, Brand Store & Key Features */}
            <div className="lg:col-span-6 space-y-6">
              {/* Product Media Gallery */}
              <ProductGallery
                product={product}
                selectedColorImage={selectedColor?.imageUrl}
              />

              {/* Key Feature Highlight Cards */}
              {product.keyFeatureCards && (
                <div className="pt-2">
                  <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-400 mb-3">
                    Key Highlights
                  </h3>
                  <ProductKeyFeatureCards features={product.keyFeatureCards} />
                </div>
              )}

              {/* Trust Badges */}
              <div className="pt-2">
                <ProductTrustGrid />
              </div>

              {/* Shop By Brand Highlight */}
              <div className="p-5 rounded-2xl bg-brand-lightest/40 border border-brand-light/40 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all hover:border-brand-light">
                <div className="flex items-center gap-3.5">
                  <div className="w-12 h-12 rounded-xl bg-brand-dark text-white font-black text-base flex items-center justify-center shrink-0 shadow-sm">
                    {product.brand.slice(0, 2)}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-black text-brand-dark">{product.brand} Store</h4>
                      <span className="bg-brand-primary text-white text-[10px] font-black px-2 py-0.5 rounded">Verified</span>
                    </div>
                    <p className="text-xs text-slate-500 font-medium mt-0.5">98.4% Rating • 100% Authentic Product</p>
                  </div>
                </div>

                <button
                  onClick={() => router.push(`/search?q=${product.brand}`)}
                  className="px-4 py-2 rounded-xl border border-brand-light hover:border-brand-primary bg-white text-brand-dark font-extrabold text-xs transition-all cursor-pointer shrink-0 shadow-2xs"
                >
                  Visit Store
                </button>
              </div>
            </div>

            {/* RIGHT COLUMN (lg:col-span-6) - Purchase Engine & Information */}
            <div className="lg:col-span-6 space-y-6">

              {/* Title & Brand Header */}
              <div className="space-y-3">
                <div className="flex items-center justify-between gap-2 flex-wrap">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-black text-brand-primary uppercase tracking-wider bg-brand-lightest border border-brand-light px-3 py-1 rounded-lg">
                      {product.brand} OFFICIAL STORE
                    </span>
                    {product.isVerifiedOfficialStore && (
                      <span className="text-[11px] font-bold text-brand-dark bg-brand-lightest/60 border border-brand-light px-2.5 py-1 rounded-lg flex items-center gap-1">
                        <ShieldCheck className="w-3.5 h-3.5 text-brand-primary" />
                        Authorized Distributor
                      </span>
                    )}
                  </div>

                  <span className="text-xs font-extrabold text-slate-400">SKU: {product.sku}</span>
                </div>

                <h1 className="text-xl sm:text-2xl lg:text-3xl font-black text-brand-dark leading-tight tracking-tight">
                  {product.title}
                </h1>

                {/* Inline Rating & Actions */}
                <div className="flex flex-wrap items-center gap-3 text-xs border-y border-slate-100 py-3 text-slate-600">
                  <div className="flex items-center gap-1 font-black text-amber-500 bg-amber-50 px-2.5 py-1 rounded-lg border border-amber-200/60">
                    <Star className="w-3.5 h-3.5 fill-amber-400" />
                    <span>{product.rating}</span>
                    <span className="text-slate-400 font-normal">({product.reviewCount} Reviews)</span>
                  </div>

                  <span className="text-slate-300">•</span>
                  <span className="font-extrabold text-slate-800">{product.soldCount || 1420}+ Sold</span>

                  <div className="ml-auto flex items-center gap-2">
                    <button
                      onClick={() => setIsWishlisted(!isWishlisted)}
                      className={`p-2 rounded-xl border transition-all cursor-pointer ${
                        isWishlisted ? 'bg-brand-lightest border-brand-light text-brand-primary' : 'border-slate-200 text-slate-500 hover:text-slate-900'
                      }`}
                      title="Wishlist"
                    >
                      <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-brand-primary' : ''}`} />
                    </button>

                    <button
                      onClick={() => setIsShareOpen(true)}
                      className="p-2 rounded-xl border border-slate-200 text-slate-500 hover:text-brand-primary hover:border-brand-light transition-all cursor-pointer"
                      title="Share Product"
                    >
                      <Share2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Visual Focus Pricing Section */}
              <ProductPricingCard
                product={product}
                priceDelta={priceDelta}
                onOpenEMICalculator={() => setIsEMIOpen(true)}
              />

              {/* Variant Selector */}
              <ProductVariantSelector
                colorVariants={product.colorVariants}
                selectedColorId={selectedColor?.id}
                onSelectColor={setSelectedColor}
                versionVariants={product.versionVariants}
                selectedVersionId={selectedVersion?.id}
                onSelectVersion={setSelectedVersion}
              />

              {/* Delivery & Shipping Info Card */}
              <ProductDeliveryCard />

              {/* Quantity & High-Priority CTAs */}
              <ProductPurchaseActions
                product={product}
                selectedColorName={selectedColor?.name}
                selectedVersionName={selectedVersion?.name}
                onOpenEMICalculator={() => setIsEMIOpen(true)}
              />

            </div>
          </div>

          {/* Interleaved Campaign Promotional Banner */}
          <div className="rounded-3xl bg-brand-dark p-6 sm:p-8 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-6 border border-brand-dark/20">
            <div className="space-y-2 text-center md:text-left">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-primary text-white text-xs font-black uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5" /> SELLORA TECH FEST 2026
              </div>
              <h3 className="text-xl sm:text-2xl font-black text-white">Get Up To 40% Off Tech Accessories & Free Express Shipping</h3>
              <p className="text-xs text-brand-lightest/90 font-medium">Use code <span className="font-bold text-brand-light">TECH2026</span> at checkout for extra savings on orders above ৳2,000</p>
            </div>
            <button
              onClick={() => router.push('/categories?cat=electronics')}
              className="px-6 py-3.5 rounded-2xl bg-brand-lightest text-brand-dark font-black text-xs hover:bg-white transition-all cursor-pointer shrink-0 shadow-md flex items-center gap-2"
            >
              <span>Explore Tech Deals</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Frequently Bought Together Bundle Builder */}
          <FrequentlyBoughtTogether product={product} />

          {/* Product Tabs */}
          <ProductTabsSection product={product} />

          {/* Related Products Slider */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-extrabold text-brand-primary uppercase tracking-wider">Recommendations</span>
                <h3 className="text-lg font-black text-brand-dark">You May Also Like</h3>
              </div>
              <Link href="/categories?cat=electronics" className="text-xs font-extrabold text-brand-primary hover:underline flex items-center gap-1">
                View All <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {relatedProducts.map((rel) => (
                <SelloraProductCard key={rel.id} product={rel} />
              ))}
            </div>
          </div>

          {/* Recently Viewed Products */}
          <div className="space-y-4 pt-4 border-t border-slate-200/80">
            <h3 className="text-base font-black text-slate-900">Recently Viewed Items</h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {recentlyViewed.map((item) => (
                <SelloraProductCard key={item.id} product={item} />
              ))}
            </div>
          </div>

        </div>
      </main>

      {/* Modals */}
      <EMICalculatorModal
        productTitle={product.title}
        price={currentPrice}
        isOpen={isEMIOpen}
        onClose={() => setIsEMIOpen(false)}
      />

      <ShareModal
        productTitle={product.title}
        isOpen={isShareOpen}
        onClose={() => setIsShareOpen(false)}
      />

    </div>
  );
}