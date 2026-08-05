'use client';

import React from 'react';
import Link from 'next/link';
import { ShieldCheck, LayoutDashboard, Store, ShoppingBag, Settings, LogOut } from 'lucide-react';
import { useAuth } from '@/providers/auth-context';
import { useRouter } from 'next/navigation';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { logout } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  return (
    <div className="flex min-h-screen bg-[#FAFAFA] font-sans">
      {/* Admin Sidebar */}
      <aside className="w-64 bg-brand-dark text-white p-6 hidden md:flex flex-col justify-between border-r border-brand-dark/30 shrink-0">
        <div className="space-y-6">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-brand-primary flex items-center justify-center text-white font-black">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-black text-white tracking-wider">SELLORA Admin</h2>
              <span className="text-[10px] text-brand-lightest/70 uppercase tracking-widest block font-extrabold">Site Management</span>
            </div>
          </div>

          <nav className="space-y-1.5 text-xs font-bold">
            <Link
              href="/admin"
              className="flex items-center gap-3 px-3.5 py-3 rounded-2xl bg-white/10 text-white hover:bg-white/20 transition-all"
            >
              <LayoutDashboard className="w-4 h-4 text-brand-light" />
              <span>Platform Overview</span>
            </Link>

            <Link
              href="/admin/vendors"
              className="flex items-center gap-3 px-3.5 py-3 rounded-2xl text-brand-lightest/80 hover:bg-white/10 hover:text-white transition-all"
            >
              <Store className="w-4 h-4 text-brand-light" />
              <span>Vendor Approvals</span>
            </Link>

            <Link
              href="/admin/site-settings"
              className="flex items-center gap-3 px-3.5 py-3 rounded-2xl text-brand-lightest/80 hover:bg-white/10 hover:text-white transition-all"
            >
              <Settings className="w-4 h-4 text-brand-light" />
              <span>Site & Banner Settings</span>
            </Link>
          </nav>
        </div>

        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-3.5 py-3 rounded-2xl text-rose-300 hover:bg-rose-900/30 transition-all text-xs font-bold cursor-pointer"
        >
          <LogOut className="w-4 h-4" />
          <span>Exit Admin Session</span>
        </button>
      </aside>

      <main className="flex-1 p-6 sm:p-8 min-w-0">{children}</main>
    </div>
  );
}
