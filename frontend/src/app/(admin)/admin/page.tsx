'use client';

import React, { useEffect, useState } from 'react';
import { ApiClient } from '@/lib/api-client';
import {
  ShieldCheck,
  DollarSign,
  Store,
  Users,
  ShoppingBag,
  Package,
  ArrowUpRight,
  Wallet,
  AlertTriangle,
  Clock,
  ExternalLink,
  History,
} from 'lucide-react';
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
    <div className="space-y-6 font-sans text-slate-800 antialiased">
      {/* Header Executive Banner */}
      <div className="bg-brand-dark rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden border border-brand-dark/20">
        <div className="absolute top-0 right-0 w-80 h-80 bg-brand-primary/20 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 space-y-2">
          <span className="text-xs font-black text-brand-lightest uppercase tracking-wider bg-brand-primary/30 px-3 py-1 rounded-full border border-brand-light/30">
            MASTER COMMAND CENTER
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-white">SELLORA Platform Command Dashboard</h1>
          <p className="text-xs sm:text-sm text-brand-lightest/80 font-medium">
            Monitor real-time GMV sales volume, platform commission, vendor lifecycle, catalog stock, and system activity logs.
          </p>
        </div>
      </div>

      {/* KPI Cards Grid (8 Cards) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-4 gap-4">
        {/* Total GMV Revenue */}
        <div className="p-5 rounded-3xl bg-white border border-slate-200 shadow-2xs space-y-1.5">
          <div className="w-9 h-9 rounded-2xl bg-brand-lightest text-brand-primary flex items-center justify-center">
            <DollarSign className="w-4 h-4" />
          </div>
          <span className="text-[11px] text-slate-500 font-bold block">Total Marketplace GMV</span>
          <div className="text-xl font-black text-brand-dark">৳{(analytics?.totalRevenue || 0).toLocaleString()}</div>
        </div>

        {/* Platform Commission Revenue */}
        <div className="p-5 rounded-3xl bg-white border border-slate-200 shadow-2xs space-y-1.5">
          <div className="w-9 h-9 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <Wallet className="w-4 h-4" />
          </div>
          <span className="text-[11px] text-slate-500 font-bold block">Platform Commission (5%)</span>
          <div className="text-xl font-black text-emerald-700">৳{(analytics?.platformRevenue || 0).toLocaleString()}</div>
        </div>

        {/* Seller Payout Revenue */}
        <div className="p-5 rounded-3xl bg-white border border-slate-200 shadow-2xs space-y-1.5">
          <div className="w-9 h-9 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
            <Store className="w-4 h-4" />
          </div>
          <span className="text-[11px] text-slate-500 font-bold block">Seller Earnings Net</span>
          <div className="text-xl font-black text-slate-900">৳{(analytics?.sellerRevenue || 0).toLocaleString()}</div>
        </div>

        {/* Total Orders */}
        <div className="p-5 rounded-3xl bg-white border border-slate-200 shadow-2xs space-y-1.5">
          <div className="w-9 h-9 rounded-2xl bg-sky-50 text-sky-600 flex items-center justify-center">
            <ShoppingBag className="w-4 h-4" />
          </div>
          <span className="text-[11px] text-slate-500 font-bold block">Total Platform Orders</span>
          <div className="text-xl font-black text-slate-900">{analytics?.totalOrders || 0}</div>
        </div>

        {/* Registered Customers */}
        <div className="p-5 rounded-3xl bg-white border border-slate-200 shadow-2xs space-y-1.5">
          <div className="w-9 h-9 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center">
            <Users className="w-4 h-4" />
          </div>
          <span className="text-[11px] text-slate-500 font-bold block">Customer Accounts</span>
          <div className="text-xl font-black text-amber-600">{analytics?.totalCustomers || 0}</div>
        </div>

        {/* Total Vendors */}
        <div className="p-5 rounded-3xl bg-white border border-slate-200 shadow-2xs space-y-1.5">
          <div className="w-9 h-9 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center">
            <Store className="w-4 h-4" />
          </div>
          <span className="text-[11px] text-slate-500 font-bold block">Active Vendor Stores</span>
          <div className="text-xl font-black text-purple-700">{analytics?.totalVendors || 0}</div>
        </div>

        {/* Low Stock Alert */}
        <div className="p-5 rounded-3xl bg-white border border-slate-200 shadow-2xs space-y-1.5">
          <div className="w-9 h-9 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center">
            <AlertTriangle className="w-4 h-4" />
          </div>
          <span className="text-[11px] text-slate-500 font-bold block">Low Stock Products</span>
          <div className="text-xl font-black text-rose-600">{analytics?.lowStock || 0}</div>
        </div>

        {/* Pending Approvals */}
        <div className="p-5 rounded-3xl bg-white border border-slate-200 shadow-2xs space-y-1.5">
          <div className="w-9 h-9 rounded-2xl bg-orange-50 text-orange-600 flex items-center justify-center">
            <Clock className="w-4 h-4" />
          </div>
          <span className="text-[11px] text-slate-500 font-bold block">Pending Vendors</span>
          <div className="text-xl font-black text-orange-600">{analytics?.pendingVendors || 0}</div>
        </div>
      </div>

      {/* 2-Column Realtime Feeds (Recent Platform Orders & Recent Audit Logs) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Recent Orders */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-6 border border-slate-200/90 shadow-2xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
              <ShoppingBag className="w-4 h-4 text-brand-primary" />
              <span>Recent Marketplace Orders</span>
            </h3>
            <Link href="/admin/orders" className="text-xs font-extrabold text-brand-primary hover:underline flex items-center gap-1">
              <span>View Orders</span>
              <ExternalLink className="w-3 h-3" />
            </Link>
          </div>

          {isLoading ? (
            <div className="p-6 text-center text-xs text-slate-400">Loading marketplace orders...</div>
          ) : !analytics?.recentOrders || analytics.recentOrders.length === 0 ? (
            <div className="p-8 text-center text-xs text-slate-400">No orders recorded</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="bg-slate-50 text-slate-500 font-extrabold uppercase text-[10px] tracking-wider border-b border-slate-100">
                    <th className="py-2.5 px-3">Order Number</th>
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

        {/* Right Column: Recent Audit Activity Logs */}
        <div className="lg:col-span-5 bg-white rounded-3xl p-6 border border-slate-200/90 shadow-2xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
              <History className="w-4 h-4 text-purple-600" />
              <span>Recent System Audit Logs</span>
            </h3>
            <Link href="/admin/activity-logs" className="text-xs font-extrabold text-brand-primary hover:underline">
              Full Logs
            </Link>
          </div>

          {isLoading ? (
            <div className="p-6 text-center text-xs text-slate-400">Loading audit logs...</div>
          ) : !analytics?.recentLogs || analytics.recentLogs.length === 0 ? (
            <div className="p-8 text-center text-xs text-slate-400">No activity logs recorded yet</div>
          ) : (
            <div className="space-y-3">
              {analytics.recentLogs.map((log: any) => (
                <div key={log.id} className="p-3 rounded-2xl bg-slate-50/80 border border-slate-100 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-900">{log.userName}</span>
                    <span className="text-[10px] text-slate-400 font-medium">
                      {new Date(log.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  <div className="text-[11px] text-brand-primary font-mono font-bold">{log.action}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Admin Action Quick Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Link
          href="/admin/users"
          className="p-6 rounded-3xl bg-white border border-slate-200 hover:border-brand-primary shadow-2xs hover:shadow-md transition-all flex items-center justify-between group cursor-pointer"
        >
          <div>
            <h3 className="text-base font-black text-brand-dark group-hover:text-brand-primary transition-colors">User Accounts & Roles</h3>
            <p className="text-xs text-slate-500 font-medium mt-1">Manage user list and promote admin permissions</p>
          </div>
          <ArrowUpRight className="w-6 h-6 text-slate-400 group-hover:text-brand-primary transition-colors" />
        </Link>

        <Link
          href="/admin/vendors"
          className="p-6 rounded-3xl bg-white border border-slate-200 hover:border-brand-primary shadow-2xs hover:shadow-md transition-all flex items-center justify-between group cursor-pointer"
        >
          <div>
            <h3 className="text-base font-black text-brand-dark group-hover:text-brand-primary transition-colors">Vendor Store Approvals</h3>
            <p className="text-xs text-slate-500 font-medium mt-1">Review pending vendor registration applications</p>
          </div>
          <ArrowUpRight className="w-6 h-6 text-slate-400 group-hover:text-brand-primary transition-colors" />
        </Link>

        <Link
          href="/admin/site-settings"
          className="p-6 rounded-3xl bg-white border border-slate-200 hover:border-brand-primary shadow-2xs hover:shadow-md transition-all flex items-center justify-between group cursor-pointer"
        >
          <div>
            <h3 className="text-base font-black text-brand-dark group-hover:text-brand-primary transition-colors">Site Configuration</h3>
            <p className="text-xs text-slate-500 font-medium mt-1">Configure banners, hotline info, and platform settings</p>
          </div>
          <ArrowUpRight className="w-6 h-6 text-slate-400 group-hover:text-brand-primary transition-colors" />
        </Link>
      </div>
    </div>
  );
}
