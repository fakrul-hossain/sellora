'use client';

import React, { useEffect, useState } from 'react';
import { ApiClient } from '@/lib/api-client';
import { useToast } from '@/components/ui/toast';
import { Package, Search, AlertTriangle, CheckCircle2, Clock, XCircle, Filter } from 'lucide-react';
import Link from 'next/link';

export default function ProductCatalogPage() {
  const toast = useToast();
  const [products, setProducts] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState<'ALL' | 'PENDING' | 'APPROVED'>('ALL');
  const [isLoading, setIsLoading] = useState(true);
  const [actionId, setActionId] = useState<string | null>(null);

  const fetchProducts = async () => {
    try {
      const data = await ApiClient.get<any[]>('/admin/products');
      setProducts(data);
    } catch (err) {
      console.error('Failed to fetch admin products:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleToggleApproval = async (id: string, newApprovedState: boolean) => {
    setActionId(id);
    try {
      await ApiClient.put(`/admin/products/${id}/approve`, { isApproved: newApprovedState });
      toast.success(
        newApprovedState
          ? 'Product approved successfully! It is now published live on Sellora website.'
          : 'Product listing moved back to pending status.',
        newApprovedState ? 'Product Approved' : 'Status Updated'
      );
      setProducts((prev) =>
        prev.map((item) => (item.id === id ? { ...item, isApproved: newApprovedState } : item))
      );
    } catch (err: any) {
      toast.error(err.message || 'Failed to update approval status', 'Action Failed');
    } finally {
      setActionId(null);
    }
  };

  const filteredProducts = products.filter((p) => {
    const matchesSearch =
      p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.brand.toLowerCase().includes(searchTerm.toLowerCase());

    if (!matchesSearch) return false;

    if (activeTab === 'PENDING') return !p.isApproved;
    if (activeTab === 'APPROVED') return Boolean(p.isApproved);
    return true;
  });

  const pendingCount = products.filter((p) => !p.isApproved).length;
  const approvedCount = products.filter((p) => p.isApproved).length;

  return (
    <div className="space-y-6 font-sans text-slate-800 antialiased pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200 shadow-2xs">
        <div>
          <h1 className="text-xl font-black text-slate-900 flex items-center gap-2">
            <Package className="w-5 h-5 text-brand-primary" />
            <span>Marketplace Product Review & Catalog</span>
          </h1>
          <p className="text-xs text-slate-500 font-medium mt-1">
            Review new product add requests from sellers, manage active catalog items, and verify inventory.
          </p>
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-2xs overflow-hidden">
        {/* Filter & Search Bar */}
        <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-2 overflow-x-auto">
            <button
              onClick={() => setActiveTab('ALL')}
              className={`px-3.5 py-2 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
                activeTab === 'ALL'
                  ? 'bg-slate-900 text-white'
                  : 'bg-white border border-slate-200 text-slate-600 hover:text-slate-900'
              }`}
            >
              All Products ({products.length})
            </button>

            <button
              onClick={() => setActiveTab('PENDING')}
              className={`px-3.5 py-2 rounded-xl text-xs font-extrabold transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'PENDING'
                  ? 'bg-amber-500 text-white shadow-xs'
                  : 'bg-amber-50 text-amber-800 border border-amber-200 hover:bg-amber-100'
              }`}
            >
              <Clock className="w-3.5 h-3.5" />
              <span>Pending Confirmation ({pendingCount})</span>
            </button>

            <button
              onClick={() => setActiveTab('APPROVED')}
              className={`px-3.5 py-2 rounded-xl text-xs font-extrabold transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'APPROVED'
                  ? 'bg-emerald-600 text-white'
                  : 'bg-emerald-50 text-emerald-800 border border-emerald-200 hover:bg-emerald-100'
              }`}
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Live & Approved ({approvedCount})</span>
            </button>
          </div>

          <div className="relative max-w-xs w-full">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search title, category, brand..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-white border border-slate-200 rounded-xl py-2 pl-9 pr-4 text-xs font-medium focus:outline-none focus:border-brand-primary"
            />
          </div>
        </div>

        {isLoading ? (
          <div className="p-8 text-center text-xs text-slate-400">Loading catalog items...</div>
        ) : filteredProducts.length === 0 ? (
          <div className="p-12 text-center text-xs text-slate-400">No matching products found</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-slate-50 text-slate-500 font-extrabold uppercase text-[10px] tracking-wider border-b border-slate-100">
                  <th className="py-3 px-4">Product Details</th>
                  <th className="py-3 px-4">Category / Brand</th>
                  <th className="py-3 px-4">Price</th>
                  <th className="py-3 px-4">Stock</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Admin Action</th>
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
                        <div className="min-w-0 max-w-xs">
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

                    <td className="py-3.5 px-4">
                      {p.isApproved ? (
                        <span className="bg-emerald-50 text-emerald-700 text-[10px] font-black px-2.5 py-1 rounded-full border border-emerald-200 flex items-center gap-1 w-fit">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                          <span>APPROVED & LIVE</span>
                        </span>
                      ) : (
                        <span className="bg-amber-50 text-amber-800 text-[10px] font-black px-2.5 py-1 rounded-full border border-amber-200 flex items-center gap-1 w-fit">
                          <Clock className="w-3 h-3 text-amber-600" />
                          <span>PENDING APPROVAL</span>
                        </span>
                      )}
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      {p.isApproved ? (
                        <button
                          disabled={actionId === p.id}
                          onClick={() => handleToggleApproval(p.id, false)}
                          className="px-3 py-1.5 rounded-xl border border-slate-200 hover:bg-slate-100 text-slate-700 font-bold text-xs cursor-pointer disabled:opacity-50 transition-colors"
                        >
                          Unpublish
                        </button>
                      ) : (
                        <button
                          disabled={actionId === p.id}
                          onClick={() => handleToggleApproval(p.id, true)}
                          className="px-4 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs shadow-xs cursor-pointer disabled:opacity-50 transition-colors"
                        >
                          {actionId === p.id ? 'Confirming...' : 'Confirm & Publish'}
                        </button>
                      )}
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
