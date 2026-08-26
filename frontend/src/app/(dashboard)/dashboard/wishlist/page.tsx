'use client';

import React from 'react';
import Link from 'next/link';
import { Heart, ShoppingBag } from 'lucide-react';
import { mockProducts } from '@/lib/products-data';
import { SelloraProductCard } from '@/components/common/SelloraProductCard';

export default function WishlistPage() {
  const wishlistProducts = mockProducts.slice(0, 4);

  return (
    <div className="space-y-6 font-sans text-slate-800">
      <div className="flex items-center justify-between">
        <h1 className="text-xl sm:text-2xl font-black text-slate-900 flex items-center gap-2">
          <Heart className="w-6 h-6 text-rose-500 fill-rose-500" />
          <span>My Saved Wishlist</span>
        </h1>
        <span className="text-xs font-bold text-slate-500">{wishlistProducts.length} Saved Items</span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {wishlistProducts.map((product) => (
          <SelloraProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}
