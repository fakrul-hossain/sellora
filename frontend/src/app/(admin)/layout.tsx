'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/providers/auth-context';
import { AdminGuard } from '@/components/auth/admin-guard';
import { ShieldCheck, LayoutDashboard, Store, Settings, LogOut, ArrowLeft } from 'lucide-react';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  return (
    <AdminGuard>
      <div className="flex min-h-screen bg-[#FAFAFA] font-sans">
        {/* Admin Sidebar */}
        <aside className="w-64 bg-brand-dark text-white p-6 hidden md:flex flex-col justify-between border-r border-brand-dark/30 shrink-0">
          <div className="space-y-6">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-brand-primary flex items-center justify-center text-white font-black">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <h2 className="text-base font-black text-white tracking-wider">SELLORA Admin</h2>
                <span className="text-[10px] text-brand-lightest/70 uppercase tracking-widest block font-extrabold truncate">
                  {user?.name || 'Administrator'}
                </span>
              </div>
            </div>

            <nav className="space-y-1.5 text-xs font-bold">
              <Link
                href="/admin"
                className={`flex items-center gap-3 px-3.5 py-3 rounded-2xl transition-all ${
                  pathname === '/admin' ? 'bg-white/20 text-white shadow-md' : 'text-brand-lightest/80 hover:bg-white/10 hover:text-white'
                }`}
              >
                <LayoutDashboard className="w-4 h-4 text-brand-light" />
                <span>Platform Overview</span>
              </Link>

              <Link
                href="/admin/vendors"
                className={`flex items-center gap-3 px-3.5 py-3 rounded-2xl transition-all ${
                  pathname.startsWith('/admin/vendors') ? 'bg-white/20 text-white shadow-md' : 'text-brand-lightest/80 hover:bg-white/10 hover:text-white'
                }`}
              >
                <Store className="w-4 h-4 text-brand-light" />
                <span>Vendor Approvals</span>
              </Link>

              <Link
                href="/admin/site-settings"
                className={`flex items-center gap-3 px-3.5 py-3 rounded-2xl transition-all ${
                  pathname.startsWith('/admin/site-settings') ? 'bg-white/20 text-white shadow-md' : 'text-brand-lightest/80 hover:bg-white/10 hover:text-white'
                }`}
              >
                <Settings className="w-4 h-4 text-brand-light" />
                <span>Site & Banner Settings</span>
              </Link>
            </nav>
          </div>

          <div className="space-y-2 pt-4 border-t border-white/10">
            <Link
              href="/dashboard"
              className="flex items-center gap-2 px-3.5 py-2.5 rounded-2xl text-brand-lightest/70 hover:text-white hover:bg-white/10 transition-all text-xs font-bold"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Customer Portal</span>
            </Link>

            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-3.5 py-3 rounded-2xl text-rose-300 hover:bg-rose-900/30 transition-all text-xs font-bold cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
              <span>Exit Admin Session</span>
            </button>
          </div>
        </aside>

        <main className="flex-1 p-6 sm:p-8 min-w-0">{children}</main>
      </div>
    </AdminGuard>
  );
}
