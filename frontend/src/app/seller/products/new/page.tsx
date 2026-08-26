'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ApiClient } from '@/lib/api-client';
import { useToast } from '@/components/ui/toast';
import { PlusCircle, ArrowLeft, Save, Package } from 'lucide-react';
import Link from 'next/link';

export default function AddProductPage() {
  const toast = useToast();
  const router = useRouter();

  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Electronics');
  const [brand, setBrand] = useState('Generic');
  const [price, setPrice] = useState('');
  const [originalPrice, setOriginalPrice] = useState('');
  const [stock, setStock] = useState('10');
  const [sku, setSku] = useState('');
  const [imageUrl, setImageUrl] = useState('https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=1000');
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await ApiClient.post('/vendors/products', {
        title,
        category,
        brand,
        price: parseFloat(price),
        originalPrice: originalPrice ? parseFloat(originalPrice) : parseFloat(price),
        stock: parseInt(stock, 10),
        sku: sku || undefined,
        imageUrl,
        description,
      });

      toast.success('Product listed successfully on Sellora marketplace!', 'Product Created');
      router.push('/seller/products');
    } catch (err: any) {
      toast.error(err.message || 'Failed to create product listing', 'Creation Failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl font-sans text-slate-800 antialiased">
      <div className="flex items-center justify-between">
        <Link href="/seller/products" className="inline-flex items-center gap-2 text-xs font-black text-slate-600 hover:text-brand-primary transition-colors">
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Products</span>
        </Link>
      </div>

      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-2xs space-y-6">
        <div className="border-b border-slate-100 pb-4">
          <h1 className="text-xl font-black text-slate-900 flex items-center gap-2">
            <PlusCircle className="w-5 h-5 text-brand-primary" />
            <span>Create New Marketplace Listing</span>
          </h1>
          <p className="text-xs text-slate-500 font-medium mt-1">
            Add a new product to your vendor store catalog for customers across Bangladesh.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs font-bold">
          <div>
            <label className="block text-slate-700 mb-1">Product Title *</label>
            <input
              type="text"
              required
              placeholder="e.g. Wireless Bluetooth Noise Canceling Headphones"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full p-3 rounded-xl border border-slate-200 focus:outline-none focus:border-brand-primary"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-700 mb-1">Category *</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full p-3 rounded-xl border border-slate-200 focus:outline-none focus:border-brand-primary bg-white"
              >
                <option value="Electronics">Electronics</option>
                <option value="Fashion">Fashion & Apparel</option>
                <option value="Gadgets">Gadgets & Tech</option>
                <option value="Home Appliance">Home & Kitchen</option>
                <option value="Beauty">Beauty & Personal Care</option>
                <option value="Groceries">Groceries & Everyday</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-700 mb-1">Brand Name</label>
              <input
                type="text"
                placeholder="e.g. Sony, Anker, Samsung, or Generic"
                value={brand}
                onChange={(e) => setBrand(e.target.value)}
                className="w-full p-3 rounded-xl border border-slate-200 focus:outline-none focus:border-brand-primary"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-slate-700 mb-1">Selling Price (৳) *</label>
              <input
                type="number"
                step="0.01"
                required
                placeholder="2500"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="w-full p-3 rounded-xl border border-slate-200 focus:outline-none focus:border-brand-primary"
              />
            </div>

            <div>
              <label className="block text-slate-700 mb-1">Original / Regular Price (৳)</label>
              <input
                type="number"
                step="0.01"
                placeholder="3000"
                value={originalPrice}
                onChange={(e) => setOriginalPrice(e.target.value)}
                className="w-full p-3 rounded-xl border border-slate-200 focus:outline-none focus:border-brand-primary"
              />
            </div>

            <div>
              <label className="block text-slate-700 mb-1">Initial Stock Quantity *</label>
              <input
                type="number"
                required
                placeholder="10"
                value={stock}
                onChange={(e) => setStock(e.target.value)}
                className="w-full p-3 rounded-xl border border-slate-200 focus:outline-none focus:border-brand-primary"
              />
            </div>
          </div>

          <div>
            <label className="block text-slate-700 mb-1">Image URL *</label>
            <input
              type="url"
              required
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              className="w-full p-3 rounded-xl border border-slate-200 focus:outline-none focus:border-brand-primary font-mono text-[11px]"
            />
          </div>

          <div>
            <label className="block text-slate-700 mb-1">Product Description</label>
            <textarea
              rows={4}
              placeholder="Describe the key features, specifications, and details of your item..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full p-3 rounded-xl border border-slate-200 focus:outline-none focus:border-brand-primary"
            />
          </div>

          <div className="pt-4 flex justify-end">
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-3 rounded-2xl bg-brand-primary hover:bg-brand-primary-hover text-white font-extrabold text-xs shadow-md transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              <span>{isSubmitting ? 'LISTING PRODUCT...' : 'PUBLISH ITEM LISTING'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
