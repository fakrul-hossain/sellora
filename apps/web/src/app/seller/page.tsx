'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/providers/auth-context';
import { ApiClient } from '@/lib/api-client';
import { Store, DollarSign, Package, ShoppingBag, Plus, ArrowUpRight, TrendingUp } from 'lucide-react';

export default function VendorDashboardPage() {
  const { user } = useAuth();
  const [analytics, setAnalytics] = useState<any>(null);
  const [vendorProfile, setVendorProfile] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const [analyticsData, profileData] = await Promise.all([
          ApiClient.get<any>('/vendors/analytics'),
          ApiClient.get<any>('/vendors/profile'),
        ]);
        setAnalytics(analyticsData);
        setVendorProfile(profileData);
      } catch (err) {
        console.error('Failed to fetch vendor dashboard data:', err);
      } finally {
        setIsLoading(false);
      }
    }
    fetchData();
  }, []);

  return (
    <div className="min-h-screen bg-[#FAFAFA] py-8 font-sans">
      <div className="max-w-[1536px] mx-auto px-4 sm:px-6 space-y-6">
        {/* Header Store Banner */}
        <div className="bg-brand-dark rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden border border-brand-dark/20 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-2 relative z-10">
            <span className="text-xs font-black text-brand-lightest uppercase tracking-wider bg-brand-primary/30 px-3 py-1 rounded-full border border-brand-light/30">
              OFFICIAL VENDOR PORTAL
            </span>
            <h1 className="text-2xl sm:text-3xl font-black text-white">
              {vendorProfile?.storeName || 'My Vendor Store'}
            </h1>
            <p className="text-xs sm:text-sm text-brand-lightest/80 font-medium">
              Manage your business inventory, fulfill orders, and monitor sales performance.
            </p>
          </div>

          <div className="relative z-10 flex items-center gap-2">
            <Link
              href="/seller/products"
              className="px-5 py-3 rounded-2xl bg-brand-primary hover:bg-brand-primary-hover text-white font-extrabold text-xs shadow-md transition-all flex items-center gap-1.5 shrink-0"
            >
              <Plus className="w-4 h-4" />
              <span>Add New Product</span>
            </Link>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-5 rounded-3xl bg-white border border-slate-200 shadow-2xs space-y-2">
            <div className="w-10 h-10 rounded-2xl bg-brand-lightest text-brand-primary flex items-center justify-center">
              <DollarSign className="w-5 h-5" />
            </div>
            <span className="text-xs text-slate-500 font-bold block">Total Store Earnings</span>
            <div className="text-2xl font-black text-brand-dark">৳{analytics?.totalSales?.toLocaleString() || '0'}</div>
          </div>

          <div className="p-5 rounded-3xl bg-white border border-slate-200 shadow-2xs space-y-2">
            <div className="w-10 h-10 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <span className="text-xs text-slate-500 font-bold block">Total Received Orders</span>
            <div className="text-2xl font-black text-slate-900">{analytics?.totalOrders || 0} Orders</div>
          </div>

          <div className="p-5 rounded-3xl bg-white border border-slate-200 shadow-2xs space-y-2">
            <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <Package className="w-5 h-5" />
            </div>
            <span className="text-xs text-slate-500 font-bold block">Pending Fulfillment</span>
            <div className="text-2xl font-black text-amber-600">{analytics?.pendingOrders || 0} Orders</div>
          </div>

          <div className="p-5 rounded-3xl bg-white border border-slate-200 shadow-2xs space-y-2">
            <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Store className="w-5 h-5" />
            </div>
            <span className="text-xs text-slate-500 font-bold block">Active Listed Products</span>
            <div className="text-2xl font-black text-emerald-700">{analytics?.totalProducts || 0} Items</div>
          </div>
        </div>

        {/* Action Quick Links */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Link
            href="/seller/products"
            className="p-6 rounded-3xl bg-white border border-slate-200 hover:border-brand-primary shadow-2xs hover:shadow-md transition-all flex items-center justify-between group"
          >
            <div>
              <h3 className="text-base font-black text-brand-dark group-hover:text-brand-primary transition-colors">Manage Product Catalog</h3>
              <p className="text-xs text-slate-500 font-medium mt-1">Create, edit, or update stock for your listed items</p>
            </div>
            <ArrowUpRight className="w-6 h-6 text-slate-400 group-hover:text-brand-primary transition-colors" />
          </Link>

          <Link
            href="/seller/orders"
            className="p-6 rounded-3xl bg-white border border-slate-200 hover:border-brand-primary shadow-2xs hover:shadow-md transition-all flex items-center justify-between group"
          >
            <div>
              <h3 className="text-base font-black text-brand-dark group-hover:text-brand-primary transition-colors">Order Fulfillment & Shipping</h3>
              <p className="text-xs text-slate-500 font-medium mt-1">View vendor order sub-lists and update status to Shipped or Delivered</p>
            </div>
            <ArrowUpRight className="w-6 h-6 text-slate-400 group-hover:text-brand-primary transition-colors" />
          </Link>
        </div>
      </div>
    </div>
  );
}
