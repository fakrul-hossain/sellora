'use client';

import React, { useEffect, useState } from 'react';
import { ApiClient } from '@/lib/api-client';
import { useToast } from '@/components/ui/toast';
import { Store, Save } from 'lucide-react';

export default function SellerSettingsPage() {
  const toast = useToast();
  const [storeName, setStoreName] = useState('');
  const [phone, setPhone] = useState('');
  const [description, setDescription] = useState('');
  const [logoUrl, setLogoUrl] = useState('');
  const [bannerUrl, setBannerUrl] = useState('');
  const [street, setStreet] = useState('');
  const [city, setCity] = useState('Dhaka');
  const [area, setArea] = useState('Central');
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    async function fetchProfile() {
      try {
        const data = await ApiClient.get<any>('/vendors/profile');
        if (data) {
          setStoreName(data.storeName || '');
          setPhone(data.phone || '');
          setDescription(data.description || '');
          setLogoUrl(data.logoUrl || '');
          setBannerUrl(data.bannerUrl || '');
          setStreet(data.address?.street || '');
          setCity(data.address?.city || 'Dhaka');
          setArea(data.address?.area || 'Central');
        }
      } catch (err) {
        console.error('Failed to fetch vendor profile:', err);
      } finally {
        setIsLoading(false);
      }
    }
    fetchProfile();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await ApiClient.put('/vendors/profile', {
        storeName,
        phone,
        description,
        logoUrl,
        bannerUrl,
        address: { street, city, area },
      });
      toast.success('Vendor store profile updated successfully!', 'Settings Saved');
    } catch (err: any) {
      toast.error(err.message || 'Failed to update store profile', 'Save Failed');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl font-sans text-slate-800 antialiased">
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-2xs">
        <h1 className="text-xl font-black text-slate-900 flex items-center gap-2">
          <Store className="w-5 h-5 text-brand-primary" />
          <span>Vendor Store Profile & Branding Settings</span>
        </h1>
        <p className="text-xs text-slate-500 font-medium mt-1">
          Customize your storefront name, logo, promotional banner, and customer contact details.
        </p>
      </div>

      <form onSubmit={handleSave} className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-2xs space-y-4 text-xs font-bold">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-slate-700 mb-1">Store Name *</label>
            <input
              type="text"
              required
              value={storeName}
              onChange={(e) => setStoreName(e.target.value)}
              className="w-full p-3 rounded-xl border border-slate-200 focus:outline-none focus:border-brand-primary"
            />
          </div>

          <div>
            <label className="block text-slate-700 mb-1">Contact Phone *</label>
            <input
              type="text"
              required
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full p-3 rounded-xl border border-slate-200 focus:outline-none focus:border-brand-primary"
            />
          </div>
        </div>

        <div>
          <label className="block text-slate-700 mb-1">Store Description</label>
          <textarea
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full p-3 rounded-xl border border-slate-200 focus:outline-none focus:border-brand-primary"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-slate-700 mb-1">Logo Image URL</label>
            <input
              type="url"
              value={logoUrl}
              onChange={(e) => setLogoUrl(e.target.value)}
              className="w-full p-3 rounded-xl border border-slate-200 focus:outline-none focus:border-brand-primary font-mono text-[11px]"
            />
          </div>

          <div>
            <label className="block text-slate-700 mb-1">Store Banner Image URL</label>
            <input
              type="url"
              value={bannerUrl}
              onChange={(e) => setBannerUrl(e.target.value)}
              className="w-full p-3 rounded-xl border border-slate-200 focus:outline-none focus:border-brand-primary font-mono text-[11px]"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-slate-700 mb-1">Street Address</label>
            <input
              type="text"
              value={street}
              onChange={(e) => setStreet(e.target.value)}
              className="w-full p-3 rounded-xl border border-slate-200 focus:outline-none focus:border-brand-primary"
            />
          </div>

          <div>
            <label className="block text-slate-700 mb-1">City</label>
            <input
              type="text"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="w-full p-3 rounded-xl border border-slate-200 focus:outline-none focus:border-brand-primary"
            />
          </div>

          <div>
            <label className="block text-slate-700 mb-1">Area / District</label>
            <input
              type="text"
              value={area}
              onChange={(e) => setArea(e.target.value)}
              className="w-full p-3 rounded-xl border border-slate-200 focus:outline-none focus:border-brand-primary"
            />
          </div>
        </div>

        <div className="pt-2 flex justify-end">
          <button
            type="submit"
            disabled={isSaving}
            className="px-6 py-3 rounded-2xl bg-brand-primary hover:bg-brand-primary-hover text-white font-extrabold text-xs shadow-md transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            <span>{isSaving ? 'SAVING...' : 'SAVE STORE PROFILE'}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
