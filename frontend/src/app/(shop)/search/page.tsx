'use client';

import React, { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { mockProducts } from '@/lib/products-data';
import { SelloraProductCard } from '@/components/common/SelloraProductCard';

export const dynamic = 'force-dynamic';

function SearchContent() {
  const searchParams = useSearchParams();
  const query = searchParams.get('q') || 'Electronics';

  const matchedProducts = mockProducts.filter(
    (p) =>
      p.title.toLowerCase().includes(query.toLowerCase()) ||
      p.brand.toLowerCase().includes(query.toLowerCase()) ||
      p.category.toLowerCase().includes(query.toLowerCase())
  );

  const displayProducts = matchedProducts.length > 0 ? matchedProducts : mockProducts;

  return (
    <div className="max-w-[1536px] mx-auto px-4 space-y-6">
      <div className="border-b border-slate-200 pb-4">
        <h1 className="text-xl font-black text-brand-dark">
          Search Results for <span className="text-brand-primary">&quot;{query}&quot;</span>
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Found {displayProducts.length} matching products in Bangladesh.
        </p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5">
        {displayProducts.map((p) => (
          <SelloraProductCard key={p.id} product={p} />
        ))}
      </div>
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
