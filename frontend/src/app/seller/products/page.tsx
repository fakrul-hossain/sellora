'use client';

import React, { useEffect, useState } from 'react';
import { ApiClient } from '@/lib/api-client';
import { useAuth } from '@/providers/auth-context';
import Link from 'next/link';
import { Package, Plus, Trash2, Edit3, X, Check, Search, AlertCircle, Clock, CheckCircle2, XCircle, Filter } from 'lucide-react';

export default function VendorProductsPage() {
  const { user } = useAuth();
  const [products, setProducts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'ALL' | 'ACCEPTED' | 'PENDING' | 'CANCELLED'>('ALL');
  const [searchTerm, setSearchTerm] = useState('');

  // Form fields
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Electronics');
  const [brand, setBrand] = useState('REMAX');
  const [price, setPrice] = useState('');
  const [stock, setStock] = useState('');
  const [sku, setSku] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState<string | null>(null);

  const fetchProducts = async () => {
    try {
      setIsLoading(true);
      const vendorId = user?.vendorId || user?.id;
      // includeUnapproved is automatically supported by backend when vendorId is provided
      const data = await ApiClient.get<any[]>(`/products?vendorId=${vendorId}&includeUnapproved=true`);
      setProducts(data || []);
    } catch (err) {
      console.error('Failed to fetch products:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [user]);

  const handleCreateProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      await ApiClient.post('/vendors/products', {
        title,
        category,
        brand,
        price: parseFloat(price),
        stock: parseInt(stock, 10),
        sku,
        imageUrl,
        description,
      });

      setIsModalOpen(false);
      setTitle('');
      setPrice('');
      setStock('');
      setSku('');
      setImageUrl('');
      setDescription('');
      fetchProducts();
    } catch (err: any) {
      setError(err.message || 'Failed to create product');
    }
  };

  const handleDeleteProduct = async (id: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return;
    try {
      await ApiClient.delete(`/products/${id}`);
      fetchProducts();
    } catch (err: any) {
      alert(err.message || 'Failed to delete product');
    }
  };

  // Status Filter Computations
  const totalCount = products.length;
  const acceptedCount = products.filter((p) => p.isApproved || p.status === 'ACCEPTED').length;
  const pendingCount = products.filter((p) => !p.isApproved && p.status !== 'CANCELLED').length;
  const cancelledCount = products.filter((p) => p.status === 'CANCELLED').length;

  const filteredProducts = products.filter((p) => {
    const matchesSearch =
      p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.sku.toLowerCase().includes(searchTerm.toLowerCase());

    if (!matchesSearch) return false;

    if (activeTab === 'ACCEPTED') return p.isApproved || p.status === 'ACCEPTED';
    if (activeTab === 'PENDING') return !p.isApproved && p.status !== 'CANCELLED';
    if (activeTab === 'CANCELLED') return p.status === 'CANCELLED';
    return true;
  });

  return (
    <div className="min-h-screen bg-[#FAFAFA] py-8 font-sans">
      <div className="max-w-[1536px] mx-auto px-4 sm:px-6 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
          <div>
            <h1 className="text-2xl font-black text-brand-dark flex items-center gap-2">
              <Package className="w-6 h-6 text-brand-primary" />
              Vendor Product Catalog Management
            </h1>
            <p className="text-xs text-slate-500 font-medium">Create and manage your products available on SELLORA</p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/seller/products/new"
              className="px-5 py-3 rounded-2xl bg-brand-primary hover:bg-brand-primary-hover text-white font-extrabold text-xs shadow-md transition-all flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Add New Product</span>
            </Link>
          </div>
        </div>

        {/* Informational Pending Banner if Seller has items under review */}
        {pendingCount > 0 && (
          <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 flex items-start sm:items-center gap-3">
            <Clock className="w-5 h-5 text-amber-600 shrink-0 mt-0.5 sm:mt-0" />
            <div className="text-xs">
              <span className="font-extrabold block sm:inline">Notice: </span>
              <span>
                You have <strong>{pendingCount} product(s)</strong> currently under administrative review. Once approved by Sellora Admin, they will immediately appear live on the public storefront.
              </span>
            </div>
          </div>
        )}

        {/* Filter Tabs & Search Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
          {/* Status Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto scrollbar-none pb-1 sm:pb-0">
            <button
              onClick={() => setActiveTab('ALL')}
              className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
                activeTab === 'ALL'
                  ? 'bg-slate-900 text-white shadow-sm'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              <span>All Products</span>
              <span className="px-1.5 py-0.5 rounded-full text-[10px] bg-white/20 font-black">{totalCount}</span>
            </button>

            <button
              onClick={() => setActiveTab('ACCEPTED')}
              className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
                activeTab === 'ACCEPTED'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
              <span>Accepted / Live</span>
              <span className="px-1.5 py-0.5 rounded-full text-[10px] bg-white/20 font-black">{acceptedCount}</span>
            </button>

            <button
              onClick={() => setActiveTab('PENDING')}
              className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
                activeTab === 'PENDING'
                  ? 'bg-amber-500 text-white shadow-sm'
                  : 'bg-amber-50 text-amber-800 hover:bg-amber-100'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse"></span>
              <span>Pending Review</span>
              <span className="px-1.5 py-0.5 rounded-full text-[10px] bg-white/20 font-black">{pendingCount}</span>
            </button>

            <button
              onClick={() => setActiveTab('CANCELLED')}
              className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
                activeTab === 'CANCELLED'
                  ? 'bg-rose-600 text-white shadow-sm'
                  : 'bg-rose-50 text-rose-800 hover:bg-rose-100'
              }`}
            >
              <span>Rejected / Cancelled</span>
              <span className="px-1.5 py-0.5 rounded-full text-[10px] bg-white/20 font-black">{cancelledCount}</span>
            </button>
          </div>

          {/* Search Input */}
          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search store catalog..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-brand-primary"
            />
          </div>
        </div>

        {/* Product Table List */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-2xs overflow-hidden">
          {isLoading ? (
            <div className="py-12 text-center text-xs font-bold text-slate-500">Loading catalog items...</div>
          ) : filteredProducts.length === 0 ? (
            <div className="py-12 text-center text-xs font-bold text-slate-500">
              No products found in &quot;{activeTab}&quot; status.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider font-extrabold border-b border-slate-200">
                  <tr>
                    <th className="p-4">Product Details</th>
                    <th className="p-4">Category</th>
                    <th className="p-4">Price</th>
                    <th className="p-4">Stock</th>
                    <th className="p-4">Approval Status</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium">
                  {filteredProducts.map((p) => {
                    const isApproved = Boolean(p.isApproved || p.status === 'ACCEPTED');
                    const isCancelled = p.status === 'CANCELLED';

                    return (
                      <tr key={p.id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="p-4 flex items-center gap-3">
                          <img
                            src={p.imageUrl}
                            alt={p.title}
                            className="w-10 h-10 rounded-xl object-contain bg-white border border-slate-200 p-0.5"
                          />
                          <div>
                            <span className="font-extrabold text-slate-900 line-clamp-1">{p.title}</span>
                            <span className="text-[10px] text-slate-400">SKU: {p.sku}</span>
                          </div>
                        </td>
                        <td className="p-4 font-bold text-slate-700">{p.category}</td>
                        <td className="p-4 font-extrabold text-brand-dark">৳{p.price?.toLocaleString()}</td>
                        <td className="p-4">
                          <span
                            className={`px-2.5 py-1 rounded-full text-[10px] font-black ${
                              p.stock > 0 ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                            }`}
                          >
                            {p.stock} units
                          </span>
                        </td>
                        <td className="p-4">
                          {isApproved ? (
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-extrabold bg-emerald-100 text-emerald-800 border border-emerald-200">
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                              <span>Live / Accepted</span>
                            </span>
                          ) : isCancelled ? (
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-extrabold bg-rose-100 text-rose-800 border border-rose-200">
                              <XCircle className="w-3.5 h-3.5 text-rose-600" />
                              <span>Rejected</span>
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-extrabold bg-amber-100 text-amber-800 border border-amber-200">
                              <Clock className="w-3.5 h-3.5 text-amber-600 animate-spin" />
                              <span>Pending Review</span>
                            </span>
                          )}
                        </td>
                        <td className="p-4 text-right">
                          <button
                            onClick={() => handleDeleteProduct(p.id)}
                            className="p-2 rounded-xl text-rose-600 hover:bg-rose-50 transition-all cursor-pointer"
                            title="Delete Product"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Add Product Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-black text-brand-dark">Add Product to Store</h3>
              <button onClick={() => setIsModalOpen(false)} className="p-1 text-slate-400 hover:text-slate-700 cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            {error && (
              <div className="p-3 rounded-xl bg-rose-50 text-rose-700 text-xs font-bold flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleCreateProduct} className="space-y-3 text-xs font-bold">
              <div>
                <label className="block text-slate-700 mb-1">Product Title</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. REMAX Wireless Earbuds"
                  className="w-full p-3 rounded-xl border border-slate-200 focus:outline-none focus:border-brand-primary"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 mb-1">Category</label>
                  <input
                    type="text"
                    required
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full p-3 rounded-xl border border-slate-200 focus:outline-none focus:border-brand-primary"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 mb-1">Brand</label>
                  <input
                    type="text"
                    required
                    value={brand}
                    onChange={(e) => setBrand(e.target.value)}
                    className="w-full p-3 rounded-xl border border-slate-200 focus:outline-none focus:border-brand-primary"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-700 mb-1">Price (৳)</label>
                  <input
                    type="number"
                    required
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    placeholder="2500"
                    className="w-full p-3 rounded-xl border border-slate-200 focus:outline-none focus:border-brand-primary"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 mb-1">Stock Qty</label>
                  <input
                    type="number"
                    required
                    value={stock}
                    onChange={(e) => setStock(e.target.value)}
                    placeholder="50"
                    className="w-full p-3 rounded-xl border border-slate-200 focus:outline-none focus:border-brand-primary"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 mb-1">SKU Code</label>
                  <input
                    type="text"
                    required
                    value={sku}
                    onChange={(e) => setSku(e.target.value)}
                    placeholder="RMX-001"
                    className="w-full p-3 rounded-xl border border-slate-200 focus:outline-none focus:border-brand-primary"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 mb-1">Image URL</label>
                <input
                  type="url"
                  required
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full p-3 rounded-xl border border-slate-200 focus:outline-none focus:border-brand-primary"
                />
              </div>

              <div>
                <label className="block text-slate-700 mb-1">Description</label>
                <textarea
                  required
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Product specifications and features..."
                  className="w-full p-3 rounded-xl border border-slate-200 focus:outline-none focus:border-brand-primary"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-100 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-brand-primary text-white font-extrabold hover:bg-brand-primary-hover shadow-md cursor-pointer"
                >
                  Publish Product
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
