'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/providers/auth-context';
import { AdminGuard } from '@/components/auth/admin-guard';
import { AppSidebar } from '@/components/common';
import {
  ShieldCheck,
  LayoutDashboard,
  Users,
  Store,
  Package,
  ShoppingBag,
  Settings,
  History,
  ArrowLeft,
  Search,
  Bell,
  Home,
} from 'lucide-react';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, logout } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  const navItems = [
    { label: 'Executive Overview', href: '/admin', icon: LayoutDashboard },
    { label: 'User Management', href: '/admin/users', icon: Users },
    { label: 'Sellers & Approvals', href: '/admin/vendors', icon: Store },
    { label: 'Products Catalog', href: '/admin/products', icon: Package },
    { label: 'Orders & Payments', href: '/admin/orders', icon: ShoppingBag },
    { label: 'Site & Banner Settings', href: '/admin/site-settings', icon: Settings },
    { label: 'Audit Activity Logs', href: '/admin/activity-logs', icon: History },
  ];

  const footerLinks = [
    { label: 'Customer Portal', href: '/dashboard', icon: ArrowLeft },
    { label: 'Go to Storefront', href: '/', icon: Home },
  ];

  return (
    <AdminGuard>
      <div className="min-h-screen bg-[#FAFAFA] font-sans text-slate-800 antialiased">
        {/* Dynamic Mobile-Responsive Reusable AppSidebar (Fixed on Desktop) */}
        <AppSidebar
          brand={{
            title: 'SELLORA',
            subtitle: 'Master Command',
            icon: ShieldCheck,
            href: '/',
          }}
          menuItems={navItems}
          footerLinks={footerLinks}
          userProfile={{
            name: user?.name || 'Administrator',
            role: user?.role || 'SUPER_ADMIN',
          }}
          onLogout={handleLogout}
          logoutText="Exit Admin Session"
          theme="dark"
        />

        {/* Main Content Area (Offset by 64 / 256px on desktop) */}
        <div className="lg:pl-64 flex flex-col min-h-screen min-w-0">
          {/* Top Command Bar */}
          <header className="h-16 bg-white border-b border-slate-200/80 px-6 flex items-center justify-between gap-4 sticky top-0 z-30 shadow-2xs">
            <div className="flex items-center gap-3 flex-1 max-w-md">
              <div className="relative w-full">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search users, orders, sellers, or products..."
                  className="w-full bg-slate-100/80 border border-slate-200 rounded-xl py-2 pl-9 pr-4 text-xs font-medium focus:outline-none focus:border-brand-primary"
                />
              </div>
            </div>

            <div className="flex items-center gap-4">
              <button className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 relative cursor-pointer">
                <Bell className="w-4 h-4" />
                <span className="w-2 h-2 rounded-full bg-brand-primary absolute top-1.5 right-1.5 ring-2 ring-white" />
              </button>

              <div className="flex items-center gap-2.5 pl-2 border-l border-slate-200">
                <div className="w-8 h-8 rounded-xl bg-brand-dark text-white font-black text-xs flex items-center justify-center">
                  {user?.name ? user.name.slice(0, 1).toUpperCase() : 'A'}
                </div>
                <div className="hidden sm:block text-left">
                  <span className="text-xs font-black text-slate-900 block leading-none">{user?.name || 'Admin'}</span>
                  <span className="text-[10px] font-bold text-brand-primary uppercase">{user?.role || 'SUPER_ADMIN'}</span>
                </div>
              </div>
            </div>
          </header>

          <main className="flex-1 p-4 sm:p-6 lg:p-8">{children}</main>
        </div>
      </div>
    </AdminGuard>
  );
}
