'use client';

import React, { useEffect, useState } from 'react';
import { ApiClient } from '@/lib/api-client';
import { ShieldCheck, DollarSign, Store, Users, ShoppingBag, Package, ArrowUpRight } from 'lucide-react';
import Link from 'next/link';

export default function AdminOverviewPage() {
  const [analytics, setAnalytics] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchAnalytics() {
      try {
        const data = await ApiClient.get<any>('/admin/analytics');
        setAnalytics(data);
      } catch (err) {
        console.error('Failed to fetch admin analytics:', err);
      } finally {
        setIsLoading(false);
      }
    }
    fetchAnalytics();
  }, []);

  return (
    <div className="space-y-6 font-sans">
      <div className="bg-brand-dark rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden border border-brand-dark/20">
        <div className="absolute top-0 right-0 w-80 h-80 bg-brand-primary/20 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 space-y-2">
          <span className="text-xs font-black text-brand-lightest uppercase tracking-wider bg-brand-primary/30 px-3 py-1 rounded-full border border-brand-light/30">
            SUPER ADMIN DASHBOARD
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-white">SELLORA Platform Control Center</h1>
          <p className="text-xs sm:text-sm text-brand-lightest/80 font-medium">
            Monitor real-time GMV revenue, active multi-vendor stores, customer accounts, and site configuration.
          </p>
        </div>
      </div>

      {/* Analytics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-3xl bg-white border border-slate-200 shadow-2xs space-y-2">
          <div className="w-10 h-10 rounded-2xl bg-brand-lightest text-brand-primary flex items-center justify-center">
            <DollarSign className="w-5 h-5" />
          </div>
          <span className="text-xs text-slate-500 font-bold block">Platform GMV Sales</span>
          <div className="text-2xl font-black text-brand-dark">৳{analytics?.totalRevenue?.toLocaleString() || '0'}</div>
        </div>

        <div className="p-5 rounded-3xl bg-white border border-slate-200 shadow-2xs space-y-2">
          <div className="w-10 h-10 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
            <Store className="w-5 h-5" />
          </div>
          <span className="text-xs text-slate-500 font-bold block">Total Vendor Stores</span>
          <div className="text-2xl font-black text-slate-900">{analytics?.totalVendors || 0} Vendors</div>
        </div>

        <div className="p-5 rounded-3xl bg-white border border-slate-200 shadow-2xs space-y-2">
          <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <ShoppingBag className="w-5 h-5" />
          </div>
          <span className="text-xs text-slate-500 font-bold block">Platform Total Orders</span>
          <div className="text-2xl font-black text-emerald-700">{analytics?.totalOrders || 0} Orders</div>
        </div>

        <div className="p-5 rounded-3xl bg-white border border-slate-200 shadow-2xs space-y-2">
          <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center">
            <Users className="w-5 h-5" />
          </div>
          <span className="text-xs text-slate-500 font-bold block">Registered Customers</span>
          <div className="text-2xl font-black text-amber-600">{analytics?.totalCustomers || 0} Users</div>
        </div>
      </div>

      {/* Admin Action Panels */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Link
          href="/admin/vendors"
          className="p-6 rounded-3xl bg-white border border-slate-200 hover:border-brand-primary shadow-2xs hover:shadow-md transition-all flex items-center justify-between group"
        >
          <div>
            <h3 className="text-base font-black text-brand-dark group-hover:text-brand-primary transition-colors">Vendor Store Verification</h3>
            <p className="text-xs text-slate-500 font-medium mt-1">Review pending vendor registration applications & toggle approval</p>
          </div>
          <ArrowUpRight className="w-6 h-6 text-slate-400 group-hover:text-brand-primary transition-colors" />
        </Link>

        <Link
          href="/admin/site-settings"
          className="p-6 rounded-3xl bg-white border border-slate-200 hover:border-brand-primary shadow-2xs hover:shadow-md transition-all flex items-center justify-between group"
        >
          <div>
            <h3 className="text-base font-black text-brand-dark group-hover:text-brand-primary transition-colors">Site & Banner Configuration</h3>
            <p className="text-xs text-slate-500 font-medium mt-1">Configure homepage promotional text, customer support info, and platform settings</p>
          </div>
          <ArrowUpRight className="w-6 h-6 text-slate-400 group-hover:text-brand-primary transition-colors" />
        </Link>
      </div>
    </div>
  );
}
