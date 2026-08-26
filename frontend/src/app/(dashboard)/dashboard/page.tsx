'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/providers/auth-context';
import { ApiClient } from '@/lib/api-client';
import {
  User,
  Camera,
  ChevronRight,
  LayoutGrid,
  Wallet,
  Clock,
  CheckCircle2,
  Truck,
  PackageCheck,
  MessageSquare,
  XCircle,
  Settings,
  Headphones,
  RotateCcw,
  MapPin,
  FileText,
  Bell,
  Heart,
  LogOut,
  Package,
  ExternalLink,
  Plus,
  Edit2,
  ShoppingBag,
} from 'lucide-react';

export default function CustomerDashboardPage() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [orders, setOrders] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchOrders() {
      try {
        const data = await ApiClient.get<any[]>('/orders/my-orders');
        setOrders(data || []);
      } catch (err) {
        console.error('Failed to fetch orders:', err);
      } finally {
        setIsLoading(false);
      }
    }
    fetchOrders();
  }, []);

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  return (
    <div className="space-y-6 font-sans text-slate-800 antialiased">
      
      {/* ========================================================================= */}
      {/* 1. MOBILE RESPONSIVE DASHBOARD VIEW (Derived from User's Screenshot 1)    */}
      {/* ========================================================================= */}
      <div className="lg:hidden space-y-5">
        
        {/* Mobile Header Title */}
        <h1 className="text-xl font-black text-slate-900">Profile</h1>

        {/* Profile Card Block */}
        <div className="bg-white rounded-3xl p-5 border border-slate-200/90 shadow-2xs flex items-center gap-4">
          {/* Avatar with Camera Badge */}
          <div className="relative shrink-0">
            <div className="w-16 h-16 rounded-full bg-slate-100 border-2 border-slate-200 flex items-center justify-center text-slate-700 shadow-inner">
              <User className="w-8 h-8 text-slate-600" />
            </div>
            <div className="absolute bottom-0 right-0 w-6 h-6 rounded-full bg-slate-900 text-white flex items-center justify-center shadow-xs border-2 border-white">
              <Camera className="w-3 h-3" />
            </div>
          </div>

          {/* User Info & Quick Action Buttons */}
          <div className="min-w-0 flex-1 space-y-1.5">
            <h2 className="text-base font-black text-slate-900 truncate">
              {user?.name || 'Sakir Hasan'}
            </h2>
            <p className="text-xs text-slate-500 truncate font-medium">{user?.email}</p>

            <div className="flex items-center gap-3 pt-1">
              <Link
                href="/dashboard/profile"
                className="px-3 py-1 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition-all shadow-2xs"
              >
                Edit Profile
              </Link>
              <Link
                href="/dashboard/vouchers"
                className="text-xs font-bold text-slate-800 hover:text-brand-primary underline transition-colors"
              >
                My Voucher
              </Link>
            </div>
          </div>
        </div>

        {/* Section 1: My Orders & Status Grid */}
        <div className="bg-white rounded-3xl border border-slate-200/90 shadow-2xs overflow-hidden">
          <Link
            href="/dashboard/orders"
            className="flex items-center justify-between p-4 border-b border-slate-100 hover:bg-slate-50 transition-colors"
          >
            <div className="flex items-center gap-2 text-xs font-black text-slate-900">
              <Package className="w-4 h-4 text-brand-primary" />
              <span>My Orders</span>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-400" />
          </Link>

          <div className="grid grid-cols-4 gap-2 p-4 text-center">
            <Link href="/dashboard/orders" className="flex flex-col items-center gap-1.5 p-2 rounded-xl hover:bg-slate-50 transition-colors">
              <div className="w-9 h-9 rounded-2xl bg-slate-100 text-slate-700 flex items-center justify-center">
                <LayoutGrid className="w-4 h-4" />
              </div>
              <span className="text-[11px] font-bold text-slate-700">All</span>
            </Link>

            <Link href="/dashboard/orders" className="flex flex-col items-center gap-1.5 p-2 rounded-xl hover:bg-slate-50 transition-colors">
              <div className="w-9 h-9 rounded-2xl bg-slate-100 text-slate-700 flex items-center justify-center">
                <Wallet className="w-4 h-4" />
              </div>
              <span className="text-[11px] font-bold text-slate-700">To Pay</span>
            </Link>

            <Link href="/dashboard/orders" className="flex flex-col items-center gap-1.5 p-2 rounded-xl hover:bg-slate-50 transition-colors">
              <div className="w-9 h-9 rounded-2xl bg-slate-100 text-slate-700 flex items-center justify-center">
                <Clock className="w-4 h-4" />
              </div>
              <span className="text-[11px] font-bold text-slate-700">Pending</span>
            </Link>

            <Link href="/dashboard/orders" className="flex flex-col items-center gap-1.5 p-2 rounded-xl hover:bg-slate-50 transition-colors">
              <div className="w-9 h-9 rounded-2xl bg-slate-100 text-slate-700 flex items-center justify-center">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              </div>
              <span className="text-[11px] font-bold text-slate-700">Confirmed</span>
            </Link>

            <Link href="/dashboard/orders" className="flex flex-col items-center gap-1.5 p-2 rounded-xl hover:bg-slate-50 transition-colors">
              <div className="w-9 h-9 rounded-2xl bg-slate-100 text-slate-700 flex items-center justify-center">
                <Truck className="w-4 h-4 text-brand-primary" />
              </div>
              <span className="text-[11px] font-bold text-slate-700">To Ship</span>
            </Link>

            <Link href="/dashboard/orders" className="flex flex-col items-center gap-1.5 p-2 rounded-xl hover:bg-slate-50 transition-colors">
              <div className="w-9 h-9 rounded-2xl bg-slate-100 text-slate-700 flex items-center justify-center">
                <PackageCheck className="w-4 h-4 text-indigo-600" />
              </div>
              <span className="text-[11px] font-bold text-slate-700">Shipped</span>
            </Link>

            <Link href="/dashboard/reviews" className="flex flex-col items-center gap-1.5 p-2 rounded-xl hover:bg-slate-50 transition-colors">
              <div className="w-9 h-9 rounded-2xl bg-slate-100 text-slate-700 flex items-center justify-center">
                <MessageSquare className="w-4 h-4 text-amber-500" />
              </div>
              <span className="text-[11px] font-bold text-slate-700">Reviews</span>
            </Link>

            <Link href="/dashboard/cancellations" className="flex flex-col items-center gap-1.5 p-2 rounded-xl hover:bg-slate-50 transition-colors">
              <div className="w-9 h-9 rounded-2xl bg-slate-100 text-slate-700 flex items-center justify-center">
                <XCircle className="w-4 h-4 text-rose-500" />
              </div>
              <span className="text-[11px] font-bold text-slate-700">Cancellations</span>
            </Link>
          </div>
        </div>

        {/* Section 2: Track Orders & Account Action Grid */}
        <div className="bg-white rounded-3xl border border-slate-200/90 shadow-2xs overflow-hidden">
          <div className="p-4 border-b border-slate-100 text-xs font-black text-slate-900 flex items-center gap-2">
            <Truck className="w-4 h-4 text-brand-primary" />
            <span>Track Orders & Account</span>
          </div>

          <div className="grid grid-cols-4 gap-2 p-4 text-center">
            <Link href="/dashboard/profile" className="flex flex-col items-center gap-1.5 p-2 rounded-xl hover:bg-slate-50 transition-colors">
              <div className="w-9 h-9 rounded-2xl bg-slate-100 text-slate-700 flex items-center justify-center">
                <Settings className="w-4 h-4" />
              </div>
              <span className="text-[11px] font-bold text-slate-700">Setting</span>
            </Link>

            <Link href="/help" className="flex flex-col items-center gap-1.5 p-2 rounded-xl hover:bg-slate-50 transition-colors">
              <div className="w-9 h-9 rounded-2xl bg-slate-100 text-slate-700 flex items-center justify-center">
                <Headphones className="w-4 h-4 text-brand-primary" />
              </div>
              <span className="text-[11px] font-bold text-slate-700">Help</span>
            </Link>

            <Link href="/dashboard/returns" className="flex flex-col items-center gap-1.5 p-2 rounded-xl hover:bg-slate-50 transition-colors">
              <div className="w-9 h-9 rounded-2xl bg-slate-100 text-slate-700 flex items-center justify-center">
                <RotateCcw className="w-4 h-4" />
              </div>
              <span className="text-[11px] font-bold text-slate-700">Returns</span>
            </Link>

            <Link href="/dashboard/address-book" className="flex flex-col items-center gap-1.5 p-2 rounded-xl hover:bg-slate-50 transition-colors">
              <div className="w-9 h-9 rounded-2xl bg-slate-100 text-slate-700 flex items-center justify-center">
                <MapPin className="w-4 h-4 text-brand-primary" />
              </div>
              <span className="text-[11px] font-bold text-slate-700">Address</span>
            </Link>

            <Link href="/help" className="flex flex-col items-center gap-1.5 p-2 rounded-xl hover:bg-slate-50 transition-colors">
              <div className="w-9 h-9 rounded-2xl bg-slate-100 text-slate-700 flex items-center justify-center">
                <FileText className="w-4 h-4" />
              </div>
              <span className="text-[11px] font-bold text-slate-700">Policies</span>
            </Link>

            <Link href="/dashboard/orders" className="flex flex-col items-center gap-1.5 p-2 rounded-xl hover:bg-slate-50 transition-colors">
              <div className="w-9 h-9 rounded-2xl bg-slate-100 text-slate-700 flex items-center justify-center">
                <Bell className="w-4 h-4 text-amber-500" />
              </div>
              <span className="text-[11px] font-bold text-slate-700">Notifications</span>
            </Link>

            <Link href="/dashboard/wishlist" className="flex flex-col items-center gap-1.5 p-2 rounded-xl hover:bg-slate-50 transition-colors">
              <div className="w-9 h-9 rounded-2xl bg-slate-100 text-slate-700 flex items-center justify-center">
                <Heart className="w-4 h-4 text-rose-500 fill-rose-500" />
              </div>
              <span className="text-[11px] font-bold text-slate-700">My Wishlist</span>
            </Link>

            <button onClick={handleLogout} className="flex flex-col items-center gap-1.5 p-2 rounded-xl hover:bg-slate-50 transition-colors cursor-pointer w-full">
              <div className="w-9 h-9 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center">
                <LogOut className="w-4 h-4" />
              </div>
              <span className="text-[11px] font-bold text-rose-600">Logout</span>
            </button>
          </div>
        </div>

      </div>

      {/* ========================================================================= */}
      {/* 2. DESKTOP DASHBOARD VIEW (Shown on large screens)                        */}
      {/* ========================================================================= */}
      <div className="hidden lg:block space-y-8">
        
        {/* MANAGE MY ACCOUNT SECTION */}
        <div className="space-y-4">
          <h1 className="text-2xl font-black text-slate-900">Manage My Account</h1>

          <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-2xs grid grid-cols-2 gap-8 divide-x divide-slate-100">
            {/* Personal Profile Panel */}
            <div className="space-y-4 pr-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-extrabold text-slate-800 flex items-center gap-2">
                  <User className="w-4 h-4 text-brand-primary" />
                  <span>Personal Profile</span>
                </h3>
                <Link
                  href="/dashboard/profile"
                  className="text-xs font-extrabold text-brand-primary hover:underline flex items-center gap-1"
                >
                  <span>Edit</span>
                  <Edit2 className="w-3 h-3" />
                </Link>
              </div>

              <div className="space-y-1 text-xs font-medium text-slate-600">
                <p className="text-sm font-black text-slate-900">{user?.name || 'Customer'}</p>
                <p className="text-slate-500">{user?.email}</p>
                <p className="text-slate-400 font-mono text-[11px] pt-1">Role: {user?.role || 'CUSTOMER'}</p>
              </div>
            </div>

            {/* Address Book Panel */}
            <div className="space-y-4 pl-8">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-extrabold text-slate-800 flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-brand-primary" />
                  <span>Address Book</span>
                </h3>
                <Link
                  href="/dashboard/address-book"
                  className="text-xs font-extrabold text-brand-primary hover:underline flex items-center gap-1"
                >
                  <span>Add</span>
                  <Plus className="w-3 h-3" />
                </Link>
              </div>

              <div className="text-xs text-slate-400 font-medium italic">
                Please Add Your Shipping Address
              </div>
            </div>
          </div>
        </div>

        {/* TRACK ORDERS SECTION */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-black text-slate-900 flex items-center gap-2">
              <Package className="w-5 h-5 text-brand-primary" />
              <span>Track Orders</span>
            </h2>
            <Link href="/dashboard/orders" className="text-xs font-bold text-brand-primary hover:underline">
              View All Orders
            </Link>
          </div>

          <div className="bg-white rounded-3xl border border-slate-200/90 shadow-2xs overflow-hidden">
            {isLoading ? (
              <div className="p-8 text-center text-xs text-slate-400 font-medium">Loading orders...</div>
            ) : orders.length === 0 ? (
              <div className="p-12 text-center space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
                  <ShoppingBag className="w-6 h-6" />
                </div>
                <h4 className="text-sm font-bold text-slate-800">No active orders placed yet</h4>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  When you order products from Sellora, your order details and live tracking will appear here.
                </p>
                <Link
                  href="/"
                  className="inline-block px-5 py-2.5 rounded-full bg-brand-primary text-white font-extrabold text-xs shadow-sm hover:bg-brand-primary-hover transition-all"
                >
                  Start Shopping Now
                </Link>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-slate-50/80 border-b border-slate-100 text-slate-600 font-extrabold uppercase text-[10px] tracking-wider">
                      <th className="py-3.5 px-5">Order No</th>
                      <th className="py-3.5 px-5">Order Date</th>
                      <th className="py-3.5 px-5">Shop Name</th>
                      <th className="py-3.5 px-5">Item(s)</th>
                      <th className="py-3.5 px-5">Amount</th>
                      <th className="py-3.5 px-5 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                    {orders.map((order) => (
                      <tr key={order.id} className="hover:bg-slate-50/50 transition-colors">
                        <td className="py-4 px-5 font-black text-slate-900">{order.orderNumber || order.id}</td>
                        <td className="py-4 px-5">{new Date(order.createdAt || Date.now()).toLocaleDateString()}</td>
                        <td className="py-4 px-5 font-bold text-brand-primary">Sellora Official Store</td>
                        <td className="py-4 px-5">{order.items?.length || 1} Item(s)</td>
                        <td className="py-4 px-5 font-black text-slate-900">৳{(order.totalAmount || 0).toLocaleString()}</td>
                        <td className="py-4 px-5 text-right">
                          <Link
                            href={`/dashboard/orders`}
                            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-[11px] font-bold transition-all"
                          >
                            <span>Manage</span>
                            <ExternalLink className="w-3 h-3 text-slate-400" />
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

      </div>

    </div>
  );
}
