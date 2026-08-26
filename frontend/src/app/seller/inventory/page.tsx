'use client';

import React, { useEffect, useState } from 'react';
import { ApiClient } from '@/lib/api-client';
import { useToast } from '@/components/ui/toast';
import { Boxes, Search, AlertTriangle, Save, RefreshCw } from 'lucide-react';

export default function SellerInventoryPage() {
  const toast = useToast();
  const [products, setProducts] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [stockInputs, setStockInputs] = useState<Record<string, string>>({});

  useEffect(() => {
    fetchInventory();
  }, []);

  async function fetchInventory() {
    try {
      setIsLoading(true);
      const data = await ApiClient.get<any[]>('/products');
      setProducts(data || []);
      const initialMap: Record<string, string> = {};
      data?.forEach((p) => {
        initialMap[p.id] = String(p.stock);
      });
      setStockInputs(initialMap);
    } catch (err) {
      console.error('Failed to fetch vendor inventory:', err);
    } finally {
      setIsLoading(false);
    }
  }

  const handleStockUpdate = async (productId: string) => {
    const newStock = stockInputs[productId];
    if (newStock === undefined || isNaN(parseInt(newStock, 10))) return;

    try {
      await ApiClient.put(`/vendors/inventory/${productId}`, { stock: parseInt(newStock, 10) });
      toast.success('Inventory stock level updated successfully', 'Stock Updated');
      fetchInventory();
    } catch (err: any) {
      toast.error(err.message || 'Failed to update stock level', 'Update Failed');
    }
  };

  const filteredProducts = products.filter(
    (p) =>
      p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 font-sans text-slate-800 antialiased">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200 shadow-2xs">
        <div>
          <h1 className="text-xl font-black text-slate-900 flex items-center gap-2">
            <Boxes className="w-5 h-5 text-brand-primary" />
            <span>Store Inventory Manager</span>
          </h1>
          <p className="text-xs text-slate-500 font-medium mt-1">
            Monitor real-time stock levels, adjust inventory quantities, and prevent stockouts.
          </p>
        </div>

        <button
          onClick={fetchInventory}
          className="p-2.5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-extrabold flex items-center gap-1.5 shrink-0 transition-colors cursor-pointer"
        >
          <RefreshCw className="w-4 h-4" />
          <span>Refresh Stock</span>
        </button>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-2xs overflow-hidden">
        <div className="p-4 border-b border-slate-100 bg-slate-50/50">
          <div className="relative max-w-md">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search product inventory by title..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-white border border-slate-200 rounded-xl py-2 pl-9 pr-4 text-xs font-medium focus:outline-none focus:border-brand-primary"
            />
          </div>
        </div>

        {isLoading ? (
          <div className="p-8 text-center text-xs text-slate-400">Loading store inventory...</div>
        ) : filteredProducts.length === 0 ? (
          <div className="p-12 text-center text-xs text-slate-400">No inventory products found</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-slate-50 text-slate-500 font-extrabold uppercase text-[10px] tracking-wider border-b border-slate-100">
                  <th className="py-3 px-4">Product Details</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">Price</th>
                  <th className="py-3 px-4">Current Stock</th>
                  <th className="py-3 px-4 text-right">Update Stock</th>
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
                          <span className="font-bold text-slate-900 line-clamp-1">{p.title}</span>
                          <span className="text-[10px] text-slate-400 font-mono">SKU: {p.sku || `#${p.id}`}</span>
                        </div>
                      </div>
                    </td>

                    <td className="py-3.5 px-4 font-semibold text-slate-700">{p.category}</td>

                    <td className="py-3.5 px-4 font-black text-slate-900">৳{p.price.toLocaleString()}</td>

                    <td className="py-3.5 px-4">
                      {p.stock <= 5 ? (
                        <span className="inline-flex items-center gap-1 text-rose-600 font-bold bg-rose-50 px-2.5 py-0.5 rounded-full border border-rose-200">
                          <AlertTriangle className="w-3 h-3" />
                          <span>{p.stock} units (Low)</span>
                        </span>
                      ) : (
                        <span className="font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                          {p.stock} units
                        </span>
                      )}
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <div className="inline-flex items-center gap-2">
                        <input
                          type="number"
                          value={stockInputs[p.id] ?? p.stock}
                          onChange={(e) =>
                            setStockInputs((prev) => ({ ...prev, [p.id]: e.target.value }))
                          }
                          className="w-20 p-1.5 text-center bg-slate-100 border border-slate-200 rounded-xl font-bold text-slate-900 focus:outline-none focus:border-brand-primary"
                        />
                        <button
                          onClick={() => handleStockUpdate(p.id)}
                          className="px-3 py-1.5 bg-brand-primary hover:bg-brand-primary-hover text-white font-extrabold rounded-xl shadow-xs transition-colors flex items-center gap-1 cursor-pointer"
                        >
                          <Save className="w-3.5 h-3.5" />
                          <span>Save</span>
                        </button>
                      </div>
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
