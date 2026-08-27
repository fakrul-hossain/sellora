'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ApiClient } from '@/lib/api-client';
import { useToast } from '@/components/ui/toast';
import { CloudinaryImageUploader, RichTextEditor } from '@/components/common';
import { PlusCircle, ArrowLeft, Save, Video, Package, Shield, ListPlus, Trash2 } from 'lucide-react';
import Link from 'next/link';

export default function AddProductPage() {
  const toast = useToast();
  const router = useRouter();

  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Electronics');
  const [brand, setBrand] = useState('');
  const [price, setPrice] = useState('');
  const [originalPrice, setOriginalPrice] = useState('');
  const [stock, setStock] = useState('10');
  const [sku, setSku] = useState('');
  const [imageUrl, setImageUrl] = useState('https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=1000');
  const [videoUrl, setVideoUrl] = useState('');
  const [description, setDescription] = useState('');
  const [inTheBox, setInTheBox] = useState('1x Main Unit, 1x User Manual, 1x Charging Cable');
  const [warranty, setWarranty] = useState('1 Year Official Brand Warranty');
  
  // Specifications KV List
  const [specs, setSpecs] = useState<{ label: string; value: string }[]>([
    { label: 'Model', value: '' },
    { label: 'Color', value: '' },
  ]);

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleAddSpec = () => {
    setSpecs([...specs, { label: '', value: '' }]);
  };

  const handleRemoveSpec = (index: number) => {
    setSpecs(specs.filter((_, i) => i !== index));
  };

  const handleSpecChange = (index: number, field: 'label' | 'value', val: string) => {
    const next = [...specs];
    next[index][field] = val;
    setSpecs(next);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) { toast.error('Product title is required'); return; }
    if (!brand.trim()) { toast.error('Brand name is required'); return; }
    if (!price || parseFloat(price) <= 0) { toast.error('Valid selling price is required'); return; }
    if (!stock || parseInt(stock, 10) < 0) { toast.error('Valid stock quantity is required'); return; }
    if (!sku.trim()) { toast.error('SKU identifier is required'); return; }
    if (!imageUrl.trim()) { toast.error('Product main image is required'); return; }
    if (!description.trim()) { toast.error('Product description is required'); return; }
    if (!inTheBox.trim()) { toast.error('"In the Box" contents are required'); return; }
    if (!warranty.trim()) { toast.error('Warranty information is required'); return; }

    setIsSubmitting(true);

    // Format specifications into structured category format
    const formattedSpecs = specs.filter(s => s.label.trim() && s.value.trim()).length > 0
      ? [{ category: 'General Information', items: specs.filter(s => s.label.trim() && s.value.trim()) }]
      : null;

    try {
      await ApiClient.post('/vendors/products', {
        title,
        category,
        brand,
        price: parseFloat(price),
        originalPrice: originalPrice ? parseFloat(originalPrice) : parseFloat(price),
        stock: parseInt(stock, 10),
        sku,
        imageUrl,
        videoUrl: videoUrl.trim() || undefined,
        description,
        inTheBox,
        warranty,
        specifications: formattedSpecs,
      });

      toast.success('Product submitted! Awaiting Admin confirmation to publish on Sellora.', 'Request Submitted');
      router.push('/seller/products');
    } catch (err: any) {
      toast.error(err.message || 'Failed to submit product listing', 'Submission Failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl font-sans text-slate-800 antialiased pb-12">
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
            <span>Create Marketplace Product Request</span>
          </h1>
          <p className="text-xs text-slate-500 font-medium mt-1">
            Fill in all required product details. Submitted products will be reviewed by Sellora Admin before appearing on the main website.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 text-xs font-bold">
          
          {/* Section 1: Basic Information */}
          <div className="space-y-4">
            <h3 className="text-xs font-extrabold uppercase tracking-wider text-brand-primary">1. Basic Product Information</h3>
            
            <div>
              <label className="block text-slate-700 mb-1">Product Title *</label>
              <input
                type="text"
                required
                placeholder="e.g. Sony WH-1000XM5 Wireless Noise Canceling Headphones"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full p-3 rounded-xl border border-slate-200 focus:outline-none focus:border-brand-primary"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
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
                <label className="block text-slate-700 mb-1">Brand Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Sony, Anker, Samsung"
                  value={brand}
                  onChange={(e) => setBrand(e.target.value)}
                  className="w-full p-3 rounded-xl border border-slate-200 focus:outline-none focus:border-brand-primary"
                />
              </div>

              <div>
                <label className="block text-slate-700 mb-1">SKU Code *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. SONY-XM5-BLK"
                  value={sku}
                  onChange={(e) => setSku(e.target.value)}
                  className="w-full p-3 rounded-xl border border-slate-200 focus:outline-none focus:border-brand-primary font-mono text-xs"
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
                  placeholder="35000"
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
                  placeholder="38000"
                  value={originalPrice}
                  onChange={(e) => setOriginalPrice(e.target.value)}
                  className="w-full p-3 rounded-xl border border-slate-200 focus:outline-none focus:border-brand-primary"
                />
              </div>

              <div>
                <label className="block text-slate-700 mb-1">Available Inventory Stock *</label>
                <input
                  type="number"
                  required
                  placeholder="15"
                  value={stock}
                  onChange={(e) => setStock(e.target.value)}
                  className="w-full p-3 rounded-xl border border-slate-200 focus:outline-none focus:border-brand-primary"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Media */}
          <div className="space-y-4 pt-4 border-t border-slate-100">
            <h3 className="text-xs font-extrabold uppercase tracking-wider text-brand-primary">2. Product Media (Images & Video)</h3>

            <CloudinaryImageUploader
              label="Featured Product Image (Cloudinary Upload / URL) *"
              value={imageUrl}
              onChange={setImageUrl}
              folder="products"
              placeholder="Click or drag product image to upload to Cloudinary"
            />

            <div>
              <label className="block text-slate-700 mb-1 flex items-center gap-1.5">
                <Video className="w-3.5 h-3.5 text-brand-primary" />
                <span>Product Video URL (YouTube Embed Link or Direct MP4)</span>
              </label>
              <input
                type="url"
                placeholder="https://www.youtube.com/watch?v=example or https://video.mp4"
                value={videoUrl}
                onChange={(e) => setVideoUrl(e.target.value)}
                className="w-full p-3 rounded-xl border border-slate-200 focus:outline-none focus:border-brand-primary"
              />
            </div>
          </div>

          {/* Section 3: Description, Specifications, In the Box, Warranty */}
          <div className="space-y-4 pt-4 border-t border-slate-100">
            <h3 className="text-xs font-extrabold uppercase tracking-wider text-brand-primary">3. Detailed Specifications & Warranty</h3>

            <RichTextEditor
              label="Product Description *"
              value={description}
              onChange={setDescription}
              placeholder="Provide a comprehensive product description, key highlights, performance details, and usage instructions..."
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-slate-700 mb-1 flex items-center gap-1.5">
                  <Package className="w-3.5 h-3.5 text-brand-primary" />
                  <span>In The Box Contents *</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 1x Headphones, 1x Carrying Case, 1x Audio Cable, 1x Manual"
                  value={inTheBox}
                  onChange={(e) => setInTheBox(e.target.value)}
                  className="w-full p-3 rounded-xl border border-slate-200 focus:outline-none focus:border-brand-primary"
                />
              </div>

              <div>
                <label className="block text-slate-700 mb-1 flex items-center gap-1.5">
                  <Shield className="w-3.5 h-3.5 text-brand-primary" />
                  <span>Warranty Information *</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 1 Year Official Brand Manufacturer Warranty"
                  value={warranty}
                  onChange={(e) => setWarranty(e.target.value)}
                  className="w-full p-3 rounded-xl border border-slate-200 focus:outline-none focus:border-brand-primary"
                />
              </div>
            </div>

            {/* Specifications Dynamic Key-Value Pairs */}
            <div className="space-y-3 pt-2">
              <div className="flex items-center justify-between">
                <label className="text-slate-700 font-extrabold flex items-center gap-1.5">
                  <ListPlus className="w-3.5 h-3.5 text-brand-primary" />
                  <span>Technical Specifications *</span>
                </label>
                <button
                  type="button"
                  onClick={handleAddSpec}
                  className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-[11px] font-black cursor-pointer transition-colors"
                >
                  + Add Spec Row
                </button>
              </div>

              <div className="space-y-2">
                {specs.map((sp, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <input
                      type="text"
                      placeholder="Spec Name (e.g. Battery Life)"
                      value={sp.label}
                      onChange={(e) => handleSpecChange(idx, 'label', e.target.value)}
                      className="flex-1 p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-brand-primary"
                    />
                    <input
                      type="text"
                      placeholder="Spec Value (e.g. 30 Hours ANC)"
                      value={sp.value}
                      onChange={(e) => handleSpecChange(idx, 'value', e.target.value)}
                      className="flex-1 p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-brand-primary"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveSpec(idx)}
                      className="p-2.5 text-slate-400 hover:text-rose-600 transition-colors cursor-pointer"
                      title="Remove Row"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

          </div>

          <div className="pt-6 border-t border-slate-100 flex justify-end">
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-8 py-3.5 rounded-2xl bg-brand-primary hover:bg-brand-primary-hover text-white font-black text-xs shadow-md transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              <span>{isSubmitting ? 'SUBMITTING REQUEST...' : 'SUBMIT PRODUCT FOR APPROVAL'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
