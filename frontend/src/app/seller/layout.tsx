'use client';

import React from 'react';
import Link from 'next/link';
import { useAuth } from '@/providers/auth-context';
import { useRouter, usePathname } from 'next/navigation';
import { VendorGuard } from '@/components/auth/vendor-guard';
import { Store, Package, ShoppingBag, LogOut, ArrowLeft } from 'lucide-react';

export default function SellerPortalLayout({ children }: { children: React.ReactNode }) {
  const { user, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  return (
    <VendorGuard>
      <div className="min-h-screen bg-[#FAFAFA] font-sans flex flex-col md:flex-row">
        {/* Vendor Portal Sidebar */}
        <aside className="w-full md:w-64 bg-slate-900 text-white p-6 flex flex-col justify-between shrink-0 border-r border-slate-800">
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-brand-primary flex items-center justify-center text-white font-black shadow-md">
                <Store className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <h2 className="text-sm font-black text-white tracking-wider truncate">Seller Hub</h2>
                <span className="text-[10px] text-brand-lightest/70 uppercase tracking-widest block font-extrabold truncate">
                  {user?.name || 'Vendor Store'}
                </span>
              </div>
            </div>

            <nav className="space-y-1.5 text-xs font-bold">
              <Link
                href="/seller"
                className={`flex items-center gap-3 px-3.5 py-3 rounded-2xl transition-all ${
                  pathname === '/seller' ? 'bg-brand-primary text-white shadow-md' : 'text-slate-300 hover:bg-slate-800'
                }`}
              >
                <Store className="w-4 h-4" />
                <span>Store Overview</span>
              </Link>

              <Link
                href="/seller/products"
                className={`flex items-center gap-3 px-3.5 py-3 rounded-2xl transition-all ${
                  pathname.startsWith('/seller/products') ? 'bg-brand-primary text-white shadow-md' : 'text-slate-300 hover:bg-slate-800'
                }`}
              >
                <Package className="w-4 h-4" />
                <span>Product Catalog</span>
              </Link>

              <Link
                href="/seller/orders"
                className={`flex items-center gap-3 px-3.5 py-3 rounded-2xl transition-all ${
                  pathname.startsWith('/seller/orders') ? 'bg-brand-primary text-white shadow-md' : 'text-slate-300 hover:bg-slate-800'
                }`}
              >
                <ShoppingBag className="w-4 h-4" />
                <span>Fulfillment Orders</span>
              </Link>
            </nav>
          </div>

          <div className="pt-6 border-t border-slate-800 space-y-2">
            <Link
              href="/dashboard"
              className="flex items-center gap-2 px-3.5 py-2.5 rounded-2xl text-slate-400 hover:text-white hover:bg-slate-800 transition-all text-xs font-bold"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Customer Dashboard</span>
            </Link>

            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-2 px-3.5 py-2.5 rounded-2xl text-rose-400 hover:bg-rose-950/40 transition-all text-xs font-bold cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
              <span>Sign Out</span>
            </button>
          </div>
        </aside>

        {/* Seller Content Body */}
        <main className="flex-1 min-w-0">{children}</main>
      </div>
    </VendorGuard>
  );
}
