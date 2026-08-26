'use client';

import React, { useEffect, useState } from 'react';
import { ApiClient } from '@/lib/api-client';
import { Package, Search, AlertTriangle } from 'lucide-react';
import Link from 'next/link';

export default function ProductCatalogPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchProducts() {
      try {
        const data = await ApiClient.get<any[]>('/admin/products');
        setProducts(data);
      } catch (err) {
        console.error('Failed to fetch admin products:', err);
      } finally {
        setIsLoading(false);
      }
    }
    fetchProducts();
  }, []);

  const filteredProducts = products.filter((p) =>
    p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.brand.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 font-sans text-slate-800 antialiased">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200 shadow-2xs">
        <div>
          <h1 className="text-xl font-black text-slate-900 flex items-center gap-2">
            <Package className="w-5 h-5 text-brand-primary" />
            <span>Marketplace Catalog Management</span>
          </h1>
          <p className="text-xs text-slate-500 font-medium mt-1">
            Monitor product listings across all vendor stores, track inventory levels, and manage approvals.
          </p>
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-2xs overflow-hidden">
        <div className="p-4 border-b border-slate-100 bg-slate-50/50">
          <div className="relative max-w-md">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search product title, category, or brand..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-white border border-slate-200 rounded-xl py-2 pl-9 pr-4 text-xs font-medium focus:outline-none focus:border-brand-primary"
            />
          </div>
        </div>

        {isLoading ? (
          <div className="p-8 text-center text-xs text-slate-400">Loading catalog items...</div>
        ) : filteredProducts.length === 0 ? (
          <div className="p-12 text-center text-xs text-slate-400">No products found</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-slate-50 text-slate-500 font-extrabold uppercase text-[10px] tracking-wider border-b border-slate-100">
                  <th className="py-3 px-4">Product Details</th>
                  <th className="py-3 px-4">Category / Brand</th>
                  <th className="py-3 px-4">Price</th>
                  <th className="py-3 px-4">Stock</th>
                  <th className="py-3 px-4 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {filteredProducts.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="flex items-center space-x-3">
                        <img
                          src={p.imageUrl}
                          alt={p.title}
                          className="w-10 h-10 object-contain bg-white rounded-xl p-1 border border-slate-200 shrink-0"
                        />
                        <div className="min-w-0">
                          <Link href={`/products/${p.id}`} className="font-bold text-slate-900 hover:text-brand-primary line-clamp-1">
                            {p.title}
                          </Link>
                          <span className="text-[10px] text-slate-400 font-mono">Vendor ID: #{p.vendorId}</span>
                        </div>
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="font-bold text-slate-800">{p.category}</div>
                      <div className="text-[10px] text-slate-400 font-medium">{p.brand}</div>
                    </td>

                    <td className="py-3.5 px-4 font-black text-slate-900">৳{p.price.toLocaleString()}</td>

                    <td className="py-3.5 px-4">
                      {p.stock <= 5 ? (
                        <span className="inline-flex items-center gap-1 text-rose-600 font-bold bg-rose-50 px-2 py-0.5 rounded-full border border-rose-200">
                          <AlertTriangle className="w-3 h-3" />
                          <span>{p.stock} (Low Stock)</span>
                        </span>
                      ) : (
                        <span className="font-bold text-slate-700">{p.stock} units</span>
                      )}
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <span className="bg-emerald-50 text-emerald-700 text-[10px] font-black px-2.5 py-1 rounded-full border border-emerald-200">
                        APPROVED & ACTIVE
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
