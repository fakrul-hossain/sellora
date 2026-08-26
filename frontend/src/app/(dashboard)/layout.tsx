'use client';

import React from 'react';
import Link from 'next/link';
import { useAuth } from '@/providers/auth-context';
import { useRouter } from 'next/navigation';
import { CustomerGuard } from '@/components/auth/customer-guard';
import { User, LogOut, Store, ShieldCheck } from 'lucide-react';

export default function CustomerDashboardLayout({ children }: { children: React.ReactNode }) {
  const { user, logout, isVendor, isAdmin } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  return (
    <CustomerGuard>
      <div className="min-h-screen bg-[#FAFAFA] py-8 font-sans">
        <div className="max-w-[1536px] mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            {/* Customer Navigation Sidebar */}
            <aside className="md:col-span-3 space-y-4">
              <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-2xs space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-brand-primary text-white font-black text-lg flex items-center justify-center shadow-md shrink-0">
                    {user?.name ? user.name.slice(0, 1).toUpperCase() : 'U'}
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-sm font-black text-brand-dark truncate">{user?.name || 'Customer'}</h3>
                    <span className="text-[11px] text-slate-500 font-medium truncate block">{user?.email}</span>
                    <span className="inline-block mt-1 text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-brand-lightest text-brand-primary border border-brand-light/40">
                      {user?.role || 'CUSTOMER'}
                    </span>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-100 space-y-1 text-xs font-bold">
                  <Link
                    href="/dashboard"
                    className="flex items-center gap-2.5 p-3 rounded-2xl bg-brand-lightest text-brand-dark transition-all"
                  >
                    <User className="w-4 h-4 text-brand-primary" />
                    <span>My Profile & Orders</span>
                  </Link>

                  {isVendor && (
                    <Link
                      href="/seller"
                      className="flex items-center gap-2.5 p-3 rounded-2xl text-slate-700 hover:bg-slate-50 transition-all"
                    >
                      <Store className="w-4 h-4 text-indigo-600" />
                      <span>Vendor Store Portal</span>
                    </Link>
                  )}

                  {isAdmin && (
                    <Link
                      href="/admin"
                      className="flex items-center gap-2.5 p-3 rounded-2xl text-slate-700 hover:bg-slate-50 transition-all"
                    >
                      <ShieldCheck className="w-4 h-4 text-emerald-600" />
                      <span>Admin Control Panel</span>
                    </Link>
                  )}

                  <button
                    onClick={handleLogout}
                    className="w-full text-left flex items-center gap-2.5 p-3 rounded-2xl text-rose-600 hover:bg-rose-50 transition-all cursor-pointer"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Sign Out</span>
                  </button>
                </div>
              </div>
            </aside>

            {/* Main Dashboard Panel */}
            <main className="md:col-span-9">{children}</main>
          </div>
        </div>
      </div>
    </CustomerGuard>
  );
}
