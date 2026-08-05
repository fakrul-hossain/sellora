'use client';

import React, { useEffect, useState } from 'react';
import { ApiClient } from '@/lib/api-client';
import { Settings, Save, CheckCircle2, AlertCircle } from 'lucide-react';

export default function AdminSiteSettingsPage() {
  const [siteName, setSiteName] = useState('SELLORA Bangladesh');
  const [supportPhone, setSupportPhone] = useState('+880 9612-345678');
  const [supportEmail, setSupportEmail] = useState('support@sellora.com');
  const [announcementText, setAnnouncementText] = useState('🎉 Welcome to SELLORA! Free Express Shipping on orders over ৳5,000.');
  const [defaultCommissionRate, setDefaultCommissionRate] = useState('5.0');

  const [isLoading, setIsLoading] = useState(true);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    async function fetchSettings() {
      try {
        const data = await ApiClient.get<any>('/admin/site-settings');
        if (data) {
          setSiteName(data.siteName || 'SELLORA Bangladesh');
          setSupportPhone(data.supportPhone || '+880 9612-345678');
          setSupportEmail(data.supportEmail || 'support@sellora.com');
          setAnnouncementText(data.announcementText || '');
          setDefaultCommissionRate(data.defaultCommissionRate ? String(data.defaultCommissionRate) : '5.0');
        }
      } catch (err) {
        console.error('Failed to fetch site settings:', err);
      } finally {
        setIsLoading(false);
      }
    }
    fetchSettings();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);
    try {
      await ApiClient.put('/admin/site-settings', {
        siteName,
        supportPhone,
        supportEmail,
        announcementText,
        defaultCommissionRate: parseFloat(defaultCommissionRate),
      });
      setMessage('Site settings updated successfully!');
    } catch (err: any) {
      alert(err.message || 'Failed to update site settings');
    }
  };

  return (
    <div className="space-y-6 font-sans max-w-4xl">
      <div className="border-b border-slate-200 pb-4">
        <h1 className="text-2xl font-black text-brand-dark flex items-center gap-2">
          <Settings className="w-6 h-6 text-brand-primary" />
          Site & Platform Settings Management
        </h1>
        <p className="text-xs text-slate-500 font-medium">Configure global platform announcements, commission rates, and support details</p>
      </div>

      {message && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{message}</span>
        </div>
      )}

      <form onSubmit={handleSave} className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-2xs space-y-4 text-xs font-bold">
        <div>
          <label className="block text-slate-700 mb-1">Platform Site Title</label>
          <input
            type="text"
            required
            value={siteName}
            onChange={(e) => setSiteName(e.target.value)}
            className="w-full p-3 rounded-xl border border-slate-200 focus:outline-none focus:border-brand-primary"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-slate-700 mb-1">Customer Support Phone</label>
            <input
              type="text"
              required
              value={supportPhone}
              onChange={(e) => setSupportPhone(e.target.value)}
              className="w-full p-3 rounded-xl border border-slate-200 focus:outline-none focus:border-brand-primary"
            />
          </div>

          <div>
            <label className="block text-slate-700 mb-1">Customer Support Email</label>
            <input
              type="email"
              required
              value={supportEmail}
              onChange={(e) => setSupportEmail(e.target.value)}
              className="w-full p-3 rounded-xl border border-slate-200 focus:outline-none focus:border-brand-primary"
            />
          </div>
        </div>

        <div>
          <label className="block text-slate-700 mb-1">Default Vendor Marketplace Commission (%)</label>
          <input
            type="number"
            step="0.1"
            required
            value={defaultCommissionRate}
            onChange={(e) => setDefaultCommissionRate(e.target.value)}
            className="w-full p-3 rounded-xl border border-slate-200 focus:outline-none focus:border-brand-primary"
          />
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

        <div className="pt-2 flex justify-end">
          <button
            type="submit"
            className="px-6 py-3 rounded-2xl bg-brand-primary hover:bg-brand-primary-hover text-white font-extrabold text-xs shadow-md transition-all flex items-center gap-2 cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>SAVE SITE CONFIGURATION</span>
          </button>
        </div>
      </form>
    </div>
  );
}
