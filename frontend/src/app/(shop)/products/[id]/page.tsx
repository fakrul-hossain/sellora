'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Star,
  Share2,
  Heart,
  ShieldCheck,
  ChevronRight,
  ArrowRight,
  Store,
} from 'lucide-react';
import { getProductById, mockProducts, ColorVariant, OptionVariant } from '@/lib/products-data';
import { ApiClient } from '@/lib/api-client';
import { CommonProductCard } from '@/components/common/CommonProductCard';

import {
  ProductGallery,
  ProductPricingCard,
  ProductVariantSelector,
  ProductPurchaseActions,
  ProductTrustGrid,
  ProductKeyFeatureCards,
  ProductTabsSection,
  StickyPurchaseBar,
  ShareModal,
} from '@/features/products/components/detail';

export default function ProductDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const productId = Array.isArray(params.id) ? params.id[0] : params.id || '';

  const [productData, setProductData] = useState<any>(null);
  const [catalogProducts, setCatalogProducts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  // Variant States
  const [selectedColor, setSelectedColor] = useState<ColorVariant | undefined>(undefined);
  const [selectedVersion, setSelectedVersion] = useState<OptionVariant | undefined>(undefined);

  // Modals
  const [isShareOpen, setIsShareOpen] = useState(false);
  const [isWishlisted, setIsWishlisted] = useState(false);

  // Fetch real backend product details & catalog
  useEffect(() => {
    async function fetchBackendProduct() {
      if (!productId) return;
      setIsLoading(true);
      setHasError(false);
      try {
        const data = await ApiClient.get<any>(`/products/${productId}`);
        if (data && data.id) {
          const productImages = (data.images && data.images.length > 0)
            ? data.images.filter(Boolean)
            : (data.imageUrl ? [data.imageUrl] : []);

          const formatted = {
            id: String(data.id),
            title: data.title,
            brand: data.brand || 'Sellora Direct',
            category: data.category || 'General',
            price: Number(data.price || 0),
            originalPrice: data.originalPrice ? Number(data.originalPrice) : Number(data.price || 0),
            discountPercentage: data.discountPercentage || 0,
            stock: Number(data.stock !== undefined ? data.stock : 10),
            stockCount: Number(data.stock !== undefined ? data.stock : 10),
            inStock: (Number(data.stock) > 0 || data.stock === undefined),
            rating: data.rating ? Number(data.rating) : 4.8,
            reviewCount: data.reviewCount ? Number(data.reviewCount) : 12,
            soldCount: data.soldCount || 45,
            sku: data.sku || `SKU-${data.id}`,
            description: data.description || '',
            imageUrl: data.imageUrl || (productImages[0] || ''),
            galleryImages: productImages,
            images: productImages,
            videoUrl: data.videoUrl || undefined,
            inTheBox: data.inTheBox || '1x Standard Unit, 1x User Documentation',
            warranty: data.warranty || 'Official Brand Warranty',
            specifications: data.specifications || undefined,
            features: data.features || [],
            vendorId: data.vendorId || '1',
            isVerifiedOfficialStore: true,
            colorVariants: data.colorVariants || [],
            versionVariants: data.versionVariants || [],
          };

          setProductData(formatted);
          if (formatted.colorVariants.length > 0) {
            setSelectedColor(formatted.colorVariants[0]);
          }
          if (formatted.versionVariants.length > 0) {
            setSelectedVersion(formatted.versionVariants[0]);
          }
        } else {
          setHasError(true);
        }
      } catch (err) {
        setHasError(true);
      } finally {
        setIsLoading(false);
      }
    }

    async function fetchCatalogForRelated() {
      try {
        const allItems = await ApiClient.get<any[]>('/products');
        if (allItems && allItems.length > 0) {
          setCatalogProducts(allItems);
        }
      } catch {
        // Fallback
      }
    }

    fetchBackendProduct();
    fetchCatalogForRelated();
  }, [productId]);

  const priceDelta = selectedVersion?.priceDelta || 0;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#FAFAFA] flex flex-col justify-between font-sans antialiased">
        <main className="flex-1 py-8">
          <div className="max-w-[1536px] mx-auto px-4 sm:px-6 space-y-8 animate-pulse">
            <div className="h-4 w-48 bg-slate-200 rounded-full" />
            <div className="bg-white rounded-3xl p-8 border border-slate-200 grid grid-cols-1 lg:grid-cols-12 gap-8">
              <div className="lg:col-span-6 space-y-4">
                <div className="h-[440px] bg-slate-100 rounded-3xl" />
              </div>
              <div className="lg:col-span-6 space-y-6">
                <div className="h-6 w-32 bg-slate-200 rounded-full" />
                <div className="h-10 w-3/4 bg-slate-200 rounded-2xl" />
                <div className="h-28 bg-slate-100 rounded-2xl" />
                <div className="h-14 bg-slate-200 rounded-2xl" />
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (!productData || hasError) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center font-sans text-center px-4 space-y-4">
        <div className="w-16 h-16 rounded-3xl bg-amber-50 border border-amber-200 text-amber-600 flex items-center justify-center mx-auto text-2xl font-black">
          !
        </div>
        <h2 className="text-xl font-black text-slate-900">Product Not Found</h2>
        <p className="text-xs text-slate-500 max-w-sm">
          The requested product could not be located in the catalog. It may have been removed or requires admin approval.
        </p>
        <Link
          href="/"
          className="px-6 py-2.5 rounded-full bg-brand-primary text-white font-extrabold text-xs shadow-sm hover:bg-brand-primary-hover transition-all"
        >
          Return to Marketplace
        </Link>
      </div>
    );
  }

  const product = productData;
  const relatedProducts = catalogProducts.filter((p) => String(p.id) !== String(product.id)).slice(0, 6);
  const recentlyViewed = catalogProducts.filter((p) => String(p.id) !== String(product.id)).slice(2, 6);

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
            <Link href={`/categories?cat=${product.category?.toLowerCase() || 'all'}`} className="hover:text-brand-primary transition-colors shrink-0">
              {product.category || 'Category'}
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span className="text-slate-400 font-medium shrink-0">{product.brand || 'Brand'}</span>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span className="font-extrabold text-brand-dark truncate max-w-[240px] sm:max-w-md">
              {product.title}
            </span>
          </nav>

          {/* Main Hero Product Details Card - Balanced 2-Column Grid */}
          <div className="bg-white rounded-2xl sm:rounded-3xl p-3.5 sm:p-8 lg:p-10 border border-slate-200/90 shadow-2xs grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-12 items-start">

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

              {/* Shop By Seller Store Highlight */}
              <div className="p-5 rounded-2xl bg-brand-lightest/40 border border-brand-light/40 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all hover:border-brand-light">
                <div className="flex items-center gap-3.5">
                  <div className="w-12 h-12 rounded-xl bg-brand-dark text-white font-black text-base flex items-center justify-center shrink-0 shadow-sm">
                    {product.brand?.slice(0, 2) || 'ST'}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-black text-brand-dark">{product.brand || 'Official Vendor'} Store</h4>
                      <span className="bg-brand-primary text-white text-[10px] font-black px-2 py-0.5 rounded">Verified Seller</span>
                    </div>
                    <p className="text-xs text-slate-500 font-medium mt-0.5">98.4% Rating • 100% Authentic Product</p>
                  </div>
                </div>

                <Link
                  href={`/store/${product.vendorId || product.brand?.toLowerCase() || '1'}`}
                  className="px-4 py-2 rounded-xl border border-brand-light hover:border-brand-primary bg-white text-brand-dark font-extrabold text-xs transition-all cursor-pointer shrink-0 shadow-2xs flex items-center gap-1.5"
                >
                  <Store className="w-3.5 h-3.5 text-brand-primary" />
                  <span>Visit Store</span>
                </Link>
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
                        Authorized Seller
                      </span>
                    )}
                  </div>

                  <span className="text-xs font-extrabold text-slate-400">SKU: {product.sku}</span>
                </div>

                <h1 className="text-xl sm:text-2xl lg:text-3xl font-black text-brand-dark leading-tight tracking-tight">
                  {product.title}
                </h1>

                {/* Inline Rating & Stock */}
                <div className="flex flex-wrap items-center gap-3 text-xs border-y border-slate-100 py-3 text-slate-600">
                  <div className="flex items-center gap-1 font-black text-amber-500 bg-amber-50 px-2.5 py-1 rounded-lg border border-amber-200/60">
                    <Star className="w-3.5 h-3.5 fill-amber-400" />
                    <span>{product.rating}</span>
                    <span className="text-slate-400 font-normal">({product.reviewCount} Reviews)</span>
                  </div>

                  <span className="text-slate-300">•</span>
                  <span className="font-extrabold text-slate-800">
                    Available Stock: <span className="text-brand-primary font-black">{product.stock ?? 15} units</span>
                  </span>

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
              />

              {/* Variant Selector (Colors & Versions) */}
              {(product.colorVariants || product.versionVariants) && (
                <ProductVariantSelector
                  colorVariants={product.colorVariants}
                  selectedColorId={selectedColor?.id}
                  onSelectColor={setSelectedColor}
                  versionVariants={product.versionVariants}
                  selectedVersionId={selectedVersion?.id}
                  onSelectVersion={setSelectedVersion}
                />
              )}

              {/* Quantity & High-Priority CTAs */}
              <ProductPurchaseActions
                product={product}
                selectedColorName={selectedColor?.name}
                selectedVersionName={selectedVersion?.name}
              />

            </div>
          </div>

          {/* Product Details Tabs (Description, Specifications, In the Box, Warranty, Q&A) */}
          <ProductTabsSection product={product} />

          {/* Related Products Slider using CommonProductCard */}
          <div className="space-y-4 pt-4">
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
                <CommonProductCard key={rel.id} product={rel} />
              ))}
            </div>
          </div>

          {/* Recently Viewed Products using CommonProductCard */}
          <div className="space-y-4 pt-4 border-t border-slate-200/80">
            <h3 className="text-base font-black text-slate-900">Recently Viewed Items</h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-4">
              {recentlyViewed.map((item) => (
                <CommonProductCard key={item.id} product={item} />
              ))}
            </div>
          </div>

        </div>
      </main>

      {/* Share Modal */}
      <ShareModal
        productTitle={product.title}
        isOpen={isShareOpen}
        onClose={() => setIsShareOpen(false)}
      />

    </div>
  );
}