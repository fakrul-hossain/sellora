'use client';

import React, { useEffect, useState } from 'react';
import { ApiClient } from '@/lib/api-client';
import { CloudinaryImageUploader } from '@/components/common';
import { Settings, Save, Layout, Sparkles, Store, Plus, Trash2, Link as LinkIcon } from 'lucide-react';
import { useToast } from '@/components/ui/toast';

export interface HeroSlideInput {
  id: number | string;
  image: string;
  slug: string;
}

export default function AdminSiteSettingsPage() {
  const toast = useToast();
  const [siteName, setSiteName] = useState('SELLORA Bangladesh');
  const [siteLogo, setSiteLogo] = useState('');
  const [supportPhone, setSupportPhone] = useState('+880 9612-345678');
  const [supportEmail, setSupportEmail] = useState('support@sellora.com');
  const [announcementText, setAnnouncementText] = useState('🎉 Welcome to SELLORA! Free Express Shipping on orders over ৳5,000.');
  const [defaultCommissionRate, setDefaultCommissionRate] = useState('5.0');

  // Multi-Slide Hero Customization
  const [heroSlides, setHeroSlides] = useState<HeroSlideInput[]>([
    {
      id: 1,
      image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?q=80&w=1200',
      slug: '/campaigns/tech-mega-sale',
    },
  ]);

  // Brand Week Customization
  const [bwImage, setBwImage] = useState('https://images.unsplash.com/photo-1512499617640-c74ae3a79d37?q=80&w=1200');
  const [bwSlug, setBwSlug] = useState('/campaigns/apple-ecosystem');

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    async function fetchSettings() {
      try {
        const data = await ApiClient.get<any>('/admin/site-settings');
        if (data) {
          setSiteName(data.siteName || 'SELLORA Bangladesh');
          setSiteLogo(data.siteLogo || '');
          setSupportPhone(data.supportPhone || '+880 9612-345678');
          setSupportEmail(data.supportEmail || 'support@sellora.com');
          setAnnouncementText(data.announcementText || '');
          setDefaultCommissionRate(data.defaultCommissionRate ? String(data.defaultCommissionRate) : '5.0');

          if (data.heroConfig?.slides && Array.isArray(data.heroConfig.slides) && data.heroConfig.slides.length > 0) {
            setHeroSlides(data.heroConfig.slides);
          }

          if (data.brandWeekConfig) {
            setBwImage(data.brandWeekConfig.image || '');
            setBwSlug(data.brandWeekConfig.slug || '/campaigns/brand-week');
          }
        }
      } catch (err) {
        console.error('Failed to fetch site settings:', err);
      } finally {
        setIsLoading(false);
      }
    }
    fetchSettings();
  }, []);

  const handleAddSlide = () => {
    const newSlide: HeroSlideInput = {
      id: Date.now(),
      image: '',
      slug: '/campaigns/new-campaign',
    };
    setHeroSlides([...heroSlides, newSlide]);
  };

  const handleRemoveSlide = (id: number | string) => {
    if (heroSlides.length <= 1) {
      toast.error('At least one hero banner slide is required', 'Cannot Remove');
      return;
    }
    setHeroSlides(heroSlides.filter((s) => s.id !== id));
  };

  const handleSlideChange = (id: number | string, field: 'image' | 'slug', val: string) => {
    setHeroSlides(
      heroSlides.map((s) => (s.id === id ? { ...s, [field]: val } : s))
    );
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await ApiClient.put('/admin/site-settings', {
        siteName,
        siteLogo,
        supportPhone,
        supportEmail,
        announcementText,
        defaultCommissionRate: parseFloat(defaultCommissionRate),
        heroConfig: {
          slides: heroSlides,
        },
        brandWeekConfig: {
          image: bwImage,
          slug: bwSlug,
        },
      });
      toast.success('Marketplace site configuration updated in MySQL database!', 'Settings Saved');
    } catch (err: any) {
      toast.error(err.message || 'Failed to update site settings', 'Save Failed');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6 font-sans max-w-4xl text-slate-800 antialiased">
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-2xs">
        <h1 className="text-xl font-black text-slate-900 flex items-center gap-2">
          <Settings className="w-5 h-5 text-brand-primary" />
          <span>Marketplace & Homepage Storefront Manager</span>
        </h1>
        <p className="text-xs text-slate-500 font-medium mt-1">
          Manage site logo, top announcement bar, multi-image hero slider, and Brand Week campaign banner.
        </p>
      </div>

      <form onSubmit={handleSave} className="space-y-6 text-xs font-bold">
        {/* Section 1: Branding & Header Settings */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-2xs space-y-4">
          <h2 className="text-sm font-black text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-3">
            <Store className="w-4 h-4 text-brand-primary" />
            <span>Storefront Header & Branding</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-slate-700 mb-1">Marketplace Site Name</label>
              <input
                type="text"
                required
                value={siteName}
                onChange={(e) => setSiteName(e.target.value)}
                className="w-full p-3 rounded-xl border border-slate-200 focus:outline-none focus:border-brand-primary"
              />
            </div>

            <CloudinaryImageUploader
              label="Site Logo Image (Cloudinary)"
              value={siteLogo}
              onChange={setSiteLogo}
              folder="site_logos"
              placeholder="Upload Site Logo"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-slate-700 mb-1">Support Phone</label>
              <input
                type="text"
                required
                value={supportPhone}
                onChange={(e) => setSupportPhone(e.target.value)}
                className="w-full p-3 rounded-xl border border-slate-200 focus:outline-none focus:border-brand-primary"
              />
            </div>

            <div>
              <label className="block text-slate-700 mb-1">Support Email</label>
              <input
                type="email"
                required
                value={supportEmail}
                onChange={(e) => setSupportEmail(e.target.value)}
                className="w-full p-3 rounded-xl border border-slate-200 focus:outline-none focus:border-brand-primary"
              />
            </div>

            <div>
              <label className="block text-slate-700 mb-1">Platform Commission (%)</label>
              <input
                type="number"
                step="0.1"
                required
                value={defaultCommissionRate}
                onChange={(e) => setDefaultCommissionRate(e.target.value)}
                className="w-full p-3 rounded-xl border border-slate-200 focus:outline-none focus:border-brand-primary"
              />
            </div>
          </div>

          <div>
            <label className="block text-slate-700 mb-1">Top Announcement Bar Text</label>
            <textarea
              rows={2}
              value={announcementText}
              onChange={(e) => setAnnouncementText(e.target.value)}
              className="w-full p-3 rounded-xl border border-slate-200 focus:outline-none focus:border-brand-primary"
            />
          </div>
        </div>

        {/* Section 2: StorefrontHero Multi-Slide Manager */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-2xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h2 className="text-sm font-black text-slate-900 flex items-center gap-2">
              <Layout className="w-4 h-4 text-purple-600" />
              <span>StorefrontHero Multi-Slide Banners</span>
            </h2>

            <button
              type="button"
              onClick={handleAddSlide}
              className="px-3 py-1.5 bg-brand-primary hover:bg-brand-primary-hover text-white rounded-xl text-xs font-bold flex items-center gap-1 cursor-pointer transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>Add Banner Slide</span>
            </button>
          </div>

          <div className="space-y-6">
            {heroSlides.map((slide, index) => (
              <div key={slide.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3 relative">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-extrabold text-slate-700 uppercase tracking-wider">
                    Banner Slide #{index + 1}
                  </span>

                  {heroSlides.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveSlide(slide.id)}
                      className="p-1.5 rounded-lg text-rose-600 hover:bg-rose-100 transition-colors cursor-pointer"
                      title="Remove Slide"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <CloudinaryImageUploader
                    label="Slide Banner Image (Cloudinary)"
                    value={slide.image}
                    onChange={(url) => handleSlideChange(slide.id, 'image', url)}
                    folder="hero_slides"
                    placeholder="Upload Banner Slide Image"
                  />

                  <div>
                    <label className="block text-slate-700 mb-1 flex items-center gap-1">
                      <LinkIcon className="w-3 h-3 text-slate-400" />
                      <span>Target Route / Campaign Slug</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="/campaigns/moto-essentials or /products"
                      value={slide.slug}
                      onChange={(e) => handleSlideChange(slide.id, 'slug', e.target.value)}
                      className="w-full p-3 rounded-xl border border-slate-200 focus:outline-none focus:border-brand-primary font-mono text-[11px]"
                    />
                    <span className="text-[10px] text-slate-400 font-medium block mt-1">
                      Clicking this banner on homepage will route to this URL.
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Section 3: BrandWeekBanner Showcase Manager */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-2xs space-y-4">
          <h2 className="text-sm font-black text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-3">
            <Sparkles className="w-4 h-4 text-amber-500" />
            <span>BrandWeekBanner Campaign Showcase</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <CloudinaryImageUploader
              label="Brand Week Banner Image (Cloudinary)"
              value={bwImage}
              onChange={setBwImage}
              folder="brand_week"
              placeholder="Upload Brand Week Banner Image"
            />

            <div>
              <label className="block text-slate-700 mb-1 flex items-center gap-1">
                <LinkIcon className="w-3 h-3 text-slate-400" />
                <span>Target Route / Campaign Slug</span>
              </label>
              <input
                type="text"
                required
                placeholder="/campaigns/brand-week"
                value={bwSlug}
                onChange={(e) => setBwSlug(e.target.value)}
                className="w-full p-3 rounded-xl border border-slate-200 focus:outline-none focus:border-brand-primary font-mono text-[11px]"
              />
              <span className="text-[10px] text-slate-400 font-medium block mt-1">
                Clicking the Brand Week banner will route to this campaign page.
              </span>
            </div>
          </div>
        </div>

        <div className="pt-2 flex justify-end">
          <button
            type="submit"
            disabled={isSaving}
            className="px-6 py-3 rounded-2xl bg-brand-primary hover:bg-brand-primary-hover text-white font-extrabold text-xs shadow-md transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            <span>{isSaving ? 'SAVING CONFIGURATION...' : 'SAVE HOMEPAGE & SITE CONFIGURATION'}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
