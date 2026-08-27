'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import {
  Store,
  Star,
  MapPin,
  Phone,
  Mail,
  ShieldCheck,
  Search,
  ChevronRight,
  Package,
  Calendar,
} from 'lucide-react';
import { ApiClient } from '@/lib/api-client';
import { CommonProductCard, CommonProductItem } from '@/components/common/CommonProductCard';
import { mockProducts } from '@/lib/products-data';

interface VendorStoreData {
  id: string;
  storeName: string;
  slug: string;
  logoUrl?: string;
  bannerUrl?: string;
  description?: string;
  phone?: string;
  email?: string;
  rating: number;
  reviewCount: number;
  address?: {
    street?: string;
    city?: string;
    area?: string;
  };
  createdAt?: string;
}

export default function SellerStorePage() {
  const params = useParams();
  const storeId = Array.isArray(params.id) ? params.id[0] : params.id || '1';

  const [storeData, setStoreData] = useState<VendorStoreData | null>(null);
  const [products, setProducts] = useState<CommonProductItem[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchStoreAndProducts() {
      try {
        const response = await ApiClient.get<{ store: VendorStoreData; products: any[] }>(`/vendors/store/${storeId}`);
        if (response && response.store) {
          setStoreData(response.store);
          setProducts(response.products || []);
        } else {
          fallbackMockStore();
        }
      } catch (err) {
        fallbackMockStore();
      } finally {
        setIsLoading(false);
      }
    }

    function fallbackMockStore() {
      setStoreData({
        id: storeId,
        storeName: 'Sellora Official Digital Store',
        slug: 'sellora-official',
        logoUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80',
        bannerUrl: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=1600&q=80',
        description: 'Official authorized seller store on Sellora Marketplace. We provide 100% authentic tech gadgets, accessories, and electronics with official warranty support across Bangladesh.',
        phone: '+880 9612-345678',
        email: 'store@sellora.com',
        rating: 4.9,
        reviewCount: 342,
        address: { street: 'Gulshan 2, Avenue Road', city: 'Dhaka', area: 'Central' },
        createdAt: '2025-01-15',
      });

      setProducts(mockProducts as CommonProductItem[]);
    }

    fetchStoreAndProducts();
  }, [storeId]);

  const filteredProducts = products.filter((p) => {
    const matchesSearch = p.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'ALL' || (p as any).category?.toUpperCase() === selectedCategory.toUpperCase();
    return matchesSearch && matchesCategory;
  });

  const categories = Array.from(new Set(products.map((p: any) => p.category).filter(Boolean)));

  return (
    <div className="min-h-screen bg-[#FAFAFA] flex flex-col justify-between font-sans text-slate-800 antialiased pb-16">
      <main className="flex-1 space-y-8">
        
        {/* Banner Section */}
        <div className="relative w-full h-48 sm:h-64 lg:h-80 bg-slate-900 overflow-hidden">
          <img
            src={storeData?.bannerUrl || 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=1600&q=80'}
            alt="Store Banner"
            className="w-full h-full object-cover opacity-60"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
          
          <div className="max-w-[1536px] mx-auto px-4 sm:px-6 absolute top-4 left-0 right-0">
            {/* Breadcrumb */}
            <nav aria-label="Breadcrumb" className="flex items-center space-x-2 text-xs font-semibold text-slate-300">
              <Link href="/" className="hover:text-white transition-colors">Home</Link>
              <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
              <span className="text-slate-400">Stores</span>
              <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
              <span className="text-white font-bold">{storeData?.storeName || 'Seller Store'}</span>
            </nav>
          </div>
        </div>

        {/* Store Profile Card Container */}
        <div className="max-w-[1536px] mx-auto px-4 sm:px-6 -mt-16 sm:-mt-20 relative z-10">
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-lg flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            
            {/* Store Branding Info */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
              <img
                src={storeData?.logoUrl || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80'}
                alt="Store Logo"
                className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl object-cover border-4 border-white shadow-md bg-white shrink-0"
              />

              <div className="space-y-1.5">
                <div className="flex items-center gap-2 flex-wrap">
                  <h1 className="text-xl sm:text-2xl font-black text-slate-900 flex items-center gap-2">
                    <Store className="w-6 h-6 text-brand-primary" />
                    <span>{storeData?.storeName || 'Seller Store'}</span>
                  </h1>
                  <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 text-[11px] font-black px-2.5 py-0.5 rounded-full flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                    Verified Seller
                  </span>
                </div>

                <p className="text-xs text-slate-600 font-medium max-w-2xl leading-relaxed">
                  {storeData?.description}
                </p>

                <div className="flex flex-wrap items-center gap-4 text-xs font-bold text-slate-500 pt-1">
                  <div className="flex items-center gap-1 text-amber-500 font-black">
                    <Star className="w-4 h-4 fill-amber-400" />
                    <span>{storeData?.rating ?? 4.9}</span>
                    <span className="text-slate-400 font-normal">({storeData?.reviewCount ?? 120} Store Ratings)</span>
                  </div>

                  {storeData?.address?.city && (
                    <div className="flex items-center gap-1 text-slate-600">
                      <MapPin className="w-3.5 h-3.5 text-brand-primary" />
                      <span>{storeData.address.street ? `${storeData.address.street}, ` : ''}{storeData.address.city}</span>
                    </div>
                  )}

                  <div className="flex items-center gap-1 text-slate-600">
                    <Package className="w-3.5 h-3.5 text-brand-primary" />
                    <span>{products.length} Products Listed</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Contact Box */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2 text-xs font-bold text-slate-700 w-full md:w-auto shrink-0">
              <div className="text-[10px] font-black uppercase text-slate-400 tracking-wider mb-1">Seller Contact Details</div>
              {storeData?.phone && (
                <div className="flex items-center gap-2">
                  <Phone className="w-3.5 h-3.5 text-brand-primary" />
                  <span>{storeData.phone}</span>
                </div>
              )}
              {storeData?.email && (
                <div className="flex items-center gap-2">
                  <Mail className="w-3.5 h-3.5 text-brand-primary" />
                  <span>{storeData.email}</span>
                </div>
              )}
            </div>

          </div>
        </div>

        {/* Store Catalog Section */}
        <div className="max-w-[1536px] mx-auto px-4 sm:px-6 space-y-6 pt-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-3xl border border-slate-200/90 shadow-2xs">
            <div>
              <h2 className="text-lg font-black text-slate-900">Seller Store Catalog</h2>
              <p className="text-xs text-slate-500 font-medium mt-0.5">Explore all verified products available directly from {storeData?.storeName}</p>
            </div>

            {/* Search Input */}
            <div className="relative max-w-sm w-full">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search products in this store..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-2.5 pl-10 pr-4 text-xs font-medium focus:outline-none focus:border-brand-primary focus:bg-white"
              />
            </div>
          </div>

          {/* Category Filter Pills */}
          {categories.length > 0 && (
            <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
              <button
                onClick={() => setSelectedCategory('ALL')}
                className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
                  selectedCategory === 'ALL'
                    ? 'bg-brand-primary text-white shadow-xs'
                    : 'bg-white border border-slate-200 text-slate-600 hover:text-slate-900'
                }`}
              >
                All Products ({products.length})
              </button>
              {categories.map((cat: any) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
                    selectedCategory === cat
                      ? 'bg-brand-primary text-white shadow-xs'
                      : 'bg-white border border-slate-200 text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          )}

          {/* Product Grid rendered using CommonProductCard */}
          {isLoading ? (
            <div className="p-12 text-center text-xs text-slate-400">Loading store products...</div>
          ) : filteredProducts.length === 0 ? (
            <div className="p-12 text-center text-xs text-slate-400 bg-white rounded-3xl border border-slate-200">
              No products found in this store catalog.
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {filteredProducts.map((product) => (
                <CommonProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>

      </main>
    </div>
  );
}
