'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ApiClient } from '@/lib/api-client';
import { useToast } from '@/components/ui/toast';
import { CloudinaryImageUploader, RichTextEditor } from '@/components/common';
import { PlusCircle, ArrowLeft, Save, Video, Package, Shield, ListPlus, Trash2, Image as ImageIcon, Plus, Star } from 'lucide-react';
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
  const [imageUrl, setImageUrl] = useState('');
  const [galleryImages, setGalleryImages] = useState<string[]>([]);
  const [newGalleryUrl, setNewGalleryUrl] = useState('');
  const [videoUrl, setVideoUrl] = useState('');
  const [description, setDescription] = useState('');
  const [inTheBox, setInTheBox] = useState('1x Main Unit, 1x User Manual, 1x Charging Cable');
  const [warranty, setWarranty] = useState('1 Year Official Brand Warranty');
  const [submitError, setSubmitError] = useState<string | null>(null);
  
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

  const handleAddGalleryImage = (urlToAdd?: string) => {
    const target = (urlToAdd || newGalleryUrl).trim();
    if (!target) return;
    if (!imageUrl) {
      setImageUrl(target);
    } else if (!galleryImages.includes(target) && target !== imageUrl) {
      setGalleryImages((prev) => [...prev, target]);
    }
    setNewGalleryUrl('');
  };

  const handleRemoveGalleryImage = (index: number) => {
    setGalleryImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSetAsPrimary = (imgToMakePrimary: string) => {
    const oldPrimary = imageUrl;
    setImageUrl(imgToMakePrimary);
    setGalleryImages((prev) => prev.map((img) => (img === imgToMakePrimary ? oldPrimary : img)));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);

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

    const allSubmittedImages = [
      imageUrl.trim(),
      ...galleryImages.filter((img) => img.trim() && img.trim() !== imageUrl.trim()),
    ];

    try {
      await ApiClient.post('/vendors/products', {
        title,
        category,
        brand,
        price: parseFloat(price),
        originalPrice: originalPrice ? parseFloat(originalPrice) : parseFloat(price),
        stock: parseInt(stock, 10),
        sku: sku.trim(),
        imageUrl: imageUrl.trim(),
        images: allSubmittedImages,
        videoUrl: videoUrl.trim() || undefined,
        description,
        inTheBox,
        warranty,
        specifications: formattedSpecs,
      });

      toast.success('Product submitted! It is now pending admin review before going live.', 'Product Created');
      router.push('/seller/products');
    } catch (err: any) {
      const errorMsg = err.message || 'Failed to submit product listing. Please check the fields and try again.';
      setSubmitError(errorMsg);
      toast.error(errorMsg, 'Submission Failed');
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

        {submitError && (
          <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 flex items-start gap-3 animate-in fade-in">
            <div className="w-6 h-6 rounded-full bg-rose-600 text-white flex items-center justify-center shrink-0 font-black text-xs">
              !
            </div>
            <div className="space-y-1">
              <h4 className="text-xs font-black uppercase tracking-wider text-rose-900">Submission Error</h4>
              <p className="text-xs font-semibold text-rose-700">{submitError}</p>
            </div>
          </div>
        )}

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
              label="Featured / Main Product Image (Cloudinary Upload / URL) *"
              value={imageUrl}
              onChange={setImageUrl}
              folder="products"
              placeholder="Click or drag product image to upload to Cloudinary"
            />

            {/* Multiple Gallery Images */}
            <div className="space-y-3 pt-2 bg-slate-50/80 p-4 rounded-2xl border border-slate-200">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                <div>
                  <label className="block text-slate-800 font-extrabold text-xs flex items-center gap-1.5">
                    <ImageIcon className="w-4 h-4 text-brand-primary" />
                    <span>Additional Gallery Images ({galleryImages.length} added)</span>
                  </label>
                  <p className="text-[11px] text-slate-500 font-medium">
                    Upload or paste additional product photo URLs (angles, packaging, unboxing views).
                  </p>
                </div>
              </div>

              {/* Add New Gallery Image Row */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                <input
                  type="url"
                  placeholder="Paste additional image URL (e.g. https://...)"
                  value={newGalleryUrl}
                  onChange={(e) => setNewGalleryUrl(e.target.value)}
                  className="flex-1 p-2.5 rounded-xl border border-slate-200 bg-white focus:outline-none focus:border-brand-primary text-xs"
                />
                <button
                  type="button"
                  onClick={() => handleAddGalleryImage()}
                  disabled={!newGalleryUrl.trim()}
                  className="px-4 py-2.5 rounded-xl bg-brand-primary hover:bg-brand-primary-hover disabled:bg-slate-200 disabled:text-slate-400 text-white font-extrabold text-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer shrink-0"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Image URL</span>
                </button>
              </div>

              {/* Quick Cloudinary Upload for Gallery */}
              <div className="pt-2 border-t border-slate-200/60">
                <span className="text-[11px] text-slate-500 font-bold block mb-1.5">Or upload gallery photos directly to Cloudinary:</span>
                <CloudinaryImageUploader
                  label="Upload Additional Photo"
                  value=""
                  onChange={(uploadedUrl) => {
                    if (uploadedUrl) handleAddGalleryImage(uploadedUrl);
                  }}
                  folder="products/gallery"
                  placeholder="Click to upload an additional gallery picture"
                />
              </div>

              {/* Gallery Thumbnails List */}
              {galleryImages.length > 0 && (
                <div className="pt-3 border-t border-slate-200/60 space-y-2">
                  <span className="text-[11px] font-extrabold text-slate-700 block">Uploaded Gallery Pictures:</span>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {galleryImages.map((img, idx) => (
                      <div key={idx} className="relative group rounded-xl border border-slate-200 bg-white p-2 flex flex-col items-center space-y-1.5 shadow-2xs">
                        <img src={img} alt={`Gallery ${idx + 1}`} className="w-full h-24 object-contain rounded-lg bg-slate-50" />
                        <div className="w-full flex items-center justify-between text-[10px] pt-1">
                          <button
                            type="button"
                            onClick={() => handleSetAsPrimary(img)}
                            className="text-brand-primary font-black hover:underline cursor-pointer flex items-center gap-0.5"
                            title="Make this the primary storefront image"
                          >
                            <Star className="w-3 h-3" />
                            <span>Make Main</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => handleRemoveGalleryImage(idx)}
                            className="text-rose-600 font-black hover:text-rose-800 p-1 cursor-pointer"
                            title="Delete image"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

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
