'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/providers/auth-context';
import { ApiClient } from '@/lib/api-client';
import {
  Store,
  DollarSign,
  Package,
  ShoppingBag,
  Plus,
  ArrowUpRight,
  AlertTriangle,
  Wallet,
  TrendingUp,
  Clock,
  ExternalLink,
} from 'lucide-react';

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
    <div className="min-h-screen bg-[#FAFAFA] py-8 font-sans text-slate-800 antialiased">
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
              className="px-5 py-3 rounded-2xl bg-brand-primary hover:bg-brand-primary-hover text-white font-extrabold text-xs shadow-md transition-all flex items-center gap-1.5 shrink-0 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Add New Product</span>
            </Link>
          </div>
        </div>

        {/* Core Metrics Grid (6 Metric Cards) */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {/* 1. Total Sales */}
          <div className="p-5 rounded-3xl bg-white border border-slate-200 shadow-2xs space-y-1.5">
            <div className="w-9 h-9 rounded-2xl bg-brand-lightest text-brand-primary flex items-center justify-center">
              <DollarSign className="w-4 h-4" />
            </div>
            <span className="text-[11px] text-slate-500 font-bold block">Total Sales</span>
            <div className="text-lg sm:text-xl font-black text-brand-dark">
              ৳{(analytics?.totalSales || 0).toLocaleString()}
            </div>
          </div>

          {/* 2. Revenue */}
          <div className="p-5 rounded-3xl bg-white border border-slate-200 shadow-2xs space-y-1.5">
            <div className="w-9 h-9 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Wallet className="w-4 h-4" />
            </div>
            <span className="text-[11px] text-slate-500 font-bold block">Net Revenue</span>
            <div className="text-lg sm:text-xl font-black text-emerald-700">
              ৳{(analytics?.revenue || 0).toLocaleString()}
            </div>
          </div>

          {/* 3. Total Orders */}
          <div className="p-5 rounded-3xl bg-white border border-slate-200 shadow-2xs space-y-1.5">
            <div className="w-9 h-9 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <ShoppingBag className="w-4 h-4" />
            </div>
            <span className="text-[11px] text-slate-500 font-bold block">Total Orders</span>
            <div className="text-lg sm:text-xl font-black text-slate-900">
              {analytics?.totalOrders || 0}
            </div>
          </div>

          {/* 4. Pending Orders */}
          <div className="p-5 rounded-3xl bg-white border border-slate-200 shadow-2xs space-y-1.5">
            <div className="w-9 h-9 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
            <span className="text-[11px] text-slate-500 font-bold block">Pending Orders</span>
            <div className="text-lg sm:text-xl font-black text-amber-600">
              {analytics?.pendingOrders || 0}
            </div>
          </div>

          {/* 5. Total Products */}
          <div className="p-5 rounded-3xl bg-white border border-slate-200 shadow-2xs space-y-1.5">
            <div className="w-9 h-9 rounded-2xl bg-slate-100 text-slate-700 flex items-center justify-center">
              <Package className="w-4 h-4" />
            </div>
            <span className="text-[11px] text-slate-500 font-bold block">Total Products</span>
            <div className="text-lg sm:text-xl font-black text-slate-900">
              {analytics?.totalProducts || 0}
            </div>
          </div>

          {/* 6. Low Stock */}
          <div className="p-5 rounded-3xl bg-white border border-slate-200 shadow-2xs space-y-1.5">
            <div className="w-9 h-9 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center">
              <AlertTriangle className="w-4 h-4" />
            </div>
            <span className="text-[11px] text-slate-500 font-bold block">Low Stock</span>
            <div className="text-lg sm:text-xl font-black text-rose-600">
              {analytics?.lowStock || 0}
            </div>
          </div>
        </div>

        {/* 2-Column Data Overview (Recent Orders & Top Products) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Left Column: Recent Orders */}
          <div className="lg:col-span-7 bg-white rounded-3xl p-6 border border-slate-200/90 shadow-2xs space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
                <ShoppingBag className="w-4 h-4 text-brand-primary" />
                <span>Recent Orders</span>
              </h3>
              <Link href="/seller/orders" className="text-xs font-extrabold text-brand-primary hover:underline flex items-center gap-1">
                <span>View All</span>
                <ExternalLink className="w-3 h-3" />
              </Link>
            </div>

            {isLoading ? (
              <div className="p-6 text-center text-xs text-slate-400">Loading recent orders...</div>
            ) : !analytics?.recentOrders || analytics.recentOrders.length === 0 ? (
              <div className="p-8 text-center text-xs text-slate-400">No orders received yet</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="bg-slate-50 text-slate-500 font-extrabold uppercase text-[10px] tracking-wider border-b border-slate-100">
                      <th className="py-2.5 px-3">Order No</th>
                      <th className="py-2.5 px-3">Customer</th>
                      <th className="py-2.5 px-3">Amount</th>
                      <th className="py-2.5 px-3 text-right">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-medium">
                    {analytics.recentOrders.map((ord: any) => (
                      <tr key={ord.id} className="hover:bg-slate-50/60 transition-colors">
                        <td className="py-3 px-3 font-bold text-slate-900">{ord.orderNumber}</td>
                        <td className="py-3 px-3 text-slate-600">{ord.customerName}</td>
                        <td className="py-3 px-3 font-black text-slate-900">৳{ord.totalAmount.toLocaleString()}</td>
                        <td className="py-3 px-3 text-right">
                          <span className="bg-emerald-50 text-emerald-600 text-[10px] font-bold px-2 py-0.5 rounded-full border border-emerald-200">
                            {ord.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Right Column: Top Products */}
          <div className="lg:col-span-5 bg-white rounded-3xl p-6 border border-slate-200/90 shadow-2xs space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-emerald-600" />
                <span>Top Products</span>
              </h3>
              <Link href="/seller/products" className="text-xs font-extrabold text-brand-primary hover:underline">
                Manage Items
              </Link>
            </div>

            {isLoading ? (
              <div className="p-6 text-center text-xs text-slate-400">Loading top products...</div>
            ) : !analytics?.topProducts || analytics.topProducts.length === 0 ? (
              <div className="p-8 text-center text-xs text-slate-400">No product sales data</div>
            ) : (
              <div className="space-y-3">
                {analytics.topProducts.map((p: any, idx: number) => (
                  <div key={idx} className="flex items-center justify-between gap-3 p-2.5 rounded-2xl bg-slate-50/80 border border-slate-100">
                    <div className="flex items-center space-x-3 min-w-0">
                      <img src={p.imageUrl} alt={p.title} className="w-10 h-10 object-contain bg-white rounded-xl p-1 border border-slate-200 shrink-0" />
                      <div className="min-w-0">
                        <h4 className="text-xs font-bold text-slate-900 truncate">{p.title}</h4>
                        <span className="text-[10px] text-slate-500 font-semibold">{p.sold} sold</span>
                      </div>
                    </div>
                    <span className="text-xs font-black text-brand-primary shrink-0">৳{p.total.toLocaleString()}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>

        {/* Action Quick Links */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Link
            href="/seller/products"
            className="p-6 rounded-3xl bg-white border border-slate-200 hover:border-brand-primary shadow-2xs hover:shadow-md transition-all flex items-center justify-between group cursor-pointer"
          >
            <div>
              <h3 className="text-base font-black text-brand-dark group-hover:text-brand-primary transition-colors">Manage Product Catalog</h3>
              <p className="text-xs text-slate-500 font-medium mt-1">Create, edit, or update stock for your listed items</p>
            </div>
            <ArrowUpRight className="w-6 h-6 text-slate-400 group-hover:text-brand-primary transition-colors" />
          </Link>

          <Link
            href="/seller/orders"
            className="p-6 rounded-3xl bg-white border border-slate-200 hover:border-brand-primary shadow-2xs hover:shadow-md transition-all flex items-center justify-between group cursor-pointer"
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
