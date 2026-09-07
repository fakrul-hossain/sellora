'use client';

import React, { Suspense, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { ApiClient } from '@/lib/api-client';
import { SelloraProductCard } from '@/components/common/SelloraProductCard';
import { Search, PackageOpen } from 'lucide-react';

export const dynamic = 'force-dynamic';

function SearchContent() {
  const searchParams = useSearchParams();
  const query = searchParams.get('q') || '';
  const [products, setProducts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchSearchResults() {
      try {
        setIsLoading(true);
        const endpoint = query.trim()
          ? `/products?search=${encodeURIComponent(query.trim())}`
          : '/products';
        const data = await ApiClient.get<any[]>(endpoint);
        setProducts(data || []);
      } catch (err) {
        console.error('Search query failed:', err);
        setProducts([]);
      } finally {
        setIsLoading(false);
      }
    }
    fetchSearchResults();
  }, [query]);

  return (
    <div className="max-w-[1536px] mx-auto px-4 space-y-6">
      <div className="border-b border-slate-200 pb-4">
        <h1 className="text-xl font-black text-brand-dark flex items-center gap-2">
          <Search className="w-5 h-5 text-brand-primary" />
          <span>
            Search Results for <span className="text-brand-primary">&quot;{query || 'All Catalog'}&quot;</span>
          </span>
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          {isLoading ? 'Searching database...' : `Found ${products.length} matching product(s) in Sellora database.`}
        </p>
      </div>

      {isLoading ? (
        <div className="py-16 text-center text-xs font-bold text-slate-400">
          Loading matching database products...
        </div>
      ) : products.length === 0 ? (
        <div className="py-16 text-center bg-white rounded-3xl border border-slate-200 shadow-2xs space-y-3 max-w-md mx-auto p-8">
          <PackageOpen className="w-12 h-12 text-slate-300 mx-auto" />
          <h3 className="text-base font-extrabold text-slate-800">No matching products found</h3>
          <p className="text-xs text-slate-500">
            We couldn&apos;t find any database products matching &quot;{query}&quot;. Try checking for spelling errors or searching for a broader term like &quot;phone&quot; or &quot;electronics&quot;.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5">
          {products.map((p) => (
            <SelloraProductCard key={p.id} product={p} />
          ))}
        </div>
      )}
    </div>
  );
}

export default function SearchResultsPage() {
  return (
    <div className="min-h-screen bg-[#FAFAFA] flex flex-col justify-between font-sans text-slate-800">
      <main className="flex-1 py-8">
        <Suspense fallback={<div className="max-w-[1536px] mx-auto px-4 py-8 text-xs font-bold text-slate-500">Loading search results...</div>}>
          <SearchContent />
        </Suspense>
      </main>
    </div>
  );
}
