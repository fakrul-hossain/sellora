'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/providers/auth-context';
import { CustomerGuard } from '@/components/auth/customer-guard';
import {
  User,
  MapPin,
  Ticket,
  Package,
  RotateCcw,
  XCircle,
  Star,
  Heart,
  MessageCircle,
  LogOut,
  ShieldCheck,
  Store,
  ArrowLeft,
} from 'lucide-react';

export default function CustomerDashboardLayout({ children }: { children: React.ReactNode }) {
  const { user, logout, isVendor, isAdmin } = useAuth();
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  const isActive = (path: string) => pathname === path;
  const isSubPage = pathname !== '/dashboard';

  return (
    <CustomerGuard>
      <div className="min-h-screen bg-[#FAFAFA] py-4 sm:py-8 font-sans text-slate-800 antialiased">
        <div className="max-w-[1536px] mx-auto px-4 sm:px-6">
          
          {/* Mobile Back Button Navigation Bar (Visible on subpages for mobile screens) */}
          {isSubPage && (
            <div className="lg:hidden flex items-center justify-between pb-4 mb-4 border-b border-slate-200/80">
              <button
                onClick={() => router.push('/dashboard')}
                className="flex items-center gap-2 text-xs font-black text-slate-800 hover:text-brand-primary transition-colors cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4 text-brand-primary" />
                <span>Back to Dashboard</span>
              </button>

              <span className="text-xs font-bold text-slate-400 capitalize">
                {pathname.split('/').pop()?.replace('-', ' ')}
              </span>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
            {/* Desktop Left Sidebar Navigation (Hidden on mobile screens to allow clean mobile UX) */}
            <aside className="hidden lg:block lg:col-span-3 space-y-6 sticky top-24">
              <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-2xs space-y-6">
                {/* User Greeting & Verification Badge */}
                <div className="space-y-2 pb-4 border-b border-slate-100">
                  <span className="text-xs font-medium text-slate-500 block">Hello,</span>
                  <h2 className="text-lg font-black text-slate-900 truncate">
                    {user?.name || 'Valued Customer'}
                  </h2>
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-200 text-[11px] font-extrabold">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>Verified Account</span>
                  </div>
                </div>

                {/* Desktop Sidebar Links */}
                <nav className="space-y-5 text-xs font-bold">
                  {/* Group 1: Manage My Account */}
                  <div className="space-y-1.5">
                    <Link
                      href="/dashboard"
                      className={`flex items-center gap-2.5 px-3 py-2 rounded-xl transition-all ${
                        isActive('/dashboard')
                          ? 'text-brand-primary font-black bg-brand-lightest/60'
                          : 'text-slate-700 hover:text-brand-primary'
                      }`}
                    >
                      <User className="w-4 h-4 text-brand-primary" />
                      <span>Manage My Account</span>
                    </Link>

                    <div className="pl-6 space-y-1 text-slate-500 font-semibold">
                      <Link
                        href="/dashboard/profile"
                        className={`flex items-center gap-2 py-1.5 px-2 rounded-lg transition-colors ${
                          isActive('/dashboard/profile')
                            ? 'text-brand-primary font-extrabold bg-slate-50'
                            : 'hover:text-brand-primary'
                        }`}
                      >
                        <User className="w-3.5 h-3.5" />
                        <span>My Profile</span>
                      </Link>

                      <Link
                        href="/dashboard/address-book"
                        className={`flex items-center gap-2 py-1.5 px-2 rounded-lg transition-colors ${
                          isActive('/dashboard/address-book')
                            ? 'text-brand-primary font-extrabold bg-slate-50'
                            : 'hover:text-brand-primary'
                        }`}
                      >
                        <MapPin className="w-3.5 h-3.5" />
                        <span>Address Book</span>
                      </Link>
                    </div>
                  </div>

                  {/* Group 2: Voucher Center */}
                  <div className="space-y-1.5 pt-3 border-t border-slate-100">
                    <div className="text-slate-800 font-black flex items-center gap-2 px-3 py-1">
                      <Ticket className="w-4 h-4 text-brand-primary" />
                      <span>Voucher Center</span>
                    </div>

                    <div className="pl-6 space-y-1 text-slate-500 font-semibold">
                      <Link
                        href="/dashboard/vouchers"
                        className={`flex items-center gap-2 py-1.5 px-2 rounded-lg transition-colors ${
                          isActive('/dashboard/vouchers')
                            ? 'text-brand-primary font-extrabold bg-slate-50'
                            : 'hover:text-brand-primary'
                        }`}
                      >
                        <Ticket className="w-3.5 h-3.5" />
                        <span>My Voucher</span>
                      </Link>
                    </div>
                  </div>

                  {/* Group 3: My Orders */}
                  <div className="space-y-1.5 pt-3 border-t border-slate-100">
                    <Link
                      href="/dashboard/orders"
                      className={`flex items-center gap-2.5 px-3 py-2 rounded-xl transition-all ${
                        isActive('/dashboard/orders')
                          ? 'text-brand-primary font-black bg-brand-lightest/60'
                          : 'text-slate-800 font-black hover:text-brand-primary'
                      }`}
                    >
                      <Package className="w-4 h-4 text-brand-primary" />
                      <span>My Orders</span>
                    </Link>

                    <div className="pl-6 space-y-1 text-slate-500 font-semibold">
                      <Link
                        href="/dashboard/returns"
                        className={`flex items-center gap-2 py-1.5 px-2 rounded-lg transition-colors ${
                          isActive('/dashboard/returns')
                            ? 'text-brand-primary font-extrabold bg-slate-50'
                            : 'hover:text-brand-primary'
                        }`}
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                        <span>My Returns</span>
                      </Link>

                      <Link
                        href="/dashboard/cancellations"
                        className={`flex items-center gap-2 py-1.5 px-2 rounded-lg transition-colors ${
                          isActive('/dashboard/cancellations')
                            ? 'text-brand-primary font-extrabold bg-slate-50'
                            : 'hover:text-brand-primary'
                        }`}
                      >
                        <XCircle className="w-3.5 h-3.5" />
                        <span>My Cancellation</span>
                      </Link>
                    </div>
                  </div>

                  {/* Group 4: Reviews, Wishlist, Chat */}
                  <div className="space-y-1.5 pt-3 border-t border-slate-100">
                    <Link
                      href="/dashboard/reviews"
                      className={`flex items-center gap-2.5 px-3 py-2 rounded-xl transition-all ${
                        isActive('/dashboard/reviews')
                          ? 'text-brand-primary font-black bg-brand-lightest/60'
                          : 'text-slate-700 hover:text-brand-primary'
                      }`}
                    >
                      <Star className="w-4 h-4 text-amber-500" />
                      <span>My Reviews</span>
                    </Link>

                    <Link
                      href="/dashboard/wishlist"
                      className={`flex items-center gap-2.5 px-3 py-2 rounded-xl transition-all ${
                        isActive('/dashboard/wishlist')
                          ? 'text-brand-primary font-black bg-brand-lightest/60'
                          : 'text-slate-700 hover:text-brand-primary'
                      }`}
                    >
                      <Heart className="w-4 h-4 text-rose-500" />
                      <span>My Wishlist</span>
                    </Link>

                    <Link
                      href="/dashboard/live-chat"
                      className={`flex items-center gap-2.5 px-3 py-2 rounded-xl transition-all ${
                        isActive('/dashboard/live-chat')
                          ? 'text-brand-primary font-black bg-brand-lightest/60'
                          : 'text-slate-700 hover:text-brand-primary'
                      }`}
                    >
                      <MessageCircle className="w-4 h-4 text-brand-primary" />
                      <span>Live Chat</span>
                    </Link>
                  </div>

                  {/* Merchant / Admin Portals */}
                  {(isVendor || isAdmin) && (
                    <div className="space-y-1.5 pt-3 border-t border-slate-100">
                      {isVendor && (
                        <Link
                          href="/seller"
                          className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-indigo-700 font-bold bg-indigo-50 hover:bg-indigo-100 transition-all"
                        >
                          <Store className="w-4 h-4" />
                          <span>Vendor Store Portal</span>
                        </Link>
                      )}

                      {isAdmin && (
                        <Link
                          href="/admin"
                          className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-emerald-700 font-bold bg-emerald-50 hover:bg-emerald-100 transition-all"
                        >
                          <ShieldCheck className="w-4 h-4" />
                          <span>Admin Control Panel</span>
                        </Link>
                      )}
                    </div>
                  )}

                  {/* Logout Button */}
                  <div className="pt-3 border-t border-slate-100">
                    <button
                      onClick={handleLogout}
                      className="w-full text-left flex items-center gap-2.5 px-3 py-2 rounded-xl text-slate-600 hover:text-rose-600 transition-all cursor-pointer font-bold"
                    >
                      <LogOut className="w-4 h-4 text-slate-400" />
                      <span>Logout</span>
                    </button>
                  </div>
                </nav>
              </div>
            </aside>

            {/* Main Content Container (Full Width on Mobile) */}
            <main className="lg:col-span-9 w-full">{children}</main>
          </div>
        </div>
      </div>
    </CustomerGuard>
  );
}
