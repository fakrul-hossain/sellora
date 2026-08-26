'use client';

import React from 'react';
import { useAuth } from '@/providers/auth-context';
import { useRouter } from 'next/navigation';
import { VendorGuard } from '@/components/auth/vendor-guard';
import { AppSidebar } from '@/components/common';
import {
  Store,
  Package,
  PlusCircle,
  Boxes,
  ShoppingBag,
  Wallet,
  Settings,
  ArrowLeft,
  Home,
} from 'lucide-react';

export default function SellerPortalLayout({ children }: { children: React.ReactNode }) {
  const { user, logout } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  const navItems = [
    { label: 'Store Overview', href: '/seller', icon: Store },
    { label: 'Product Catalog', href: '/seller/products', icon: Package },
    { label: 'Add New Product', href: '/seller/products/new', icon: PlusCircle },
    { label: 'Inventory Manager', href: '/seller/inventory', icon: Boxes },
    { label: 'Fulfillment Orders', href: '/seller/orders', icon: ShoppingBag },
    { label: 'Finance & Payouts', href: '/seller/finance', icon: Wallet },
    { label: 'Store Settings', href: '/seller/settings', icon: Settings },
  ];

  const footerLinks = [
    { label: 'Customer Dashboard', href: '/dashboard', icon: ArrowLeft },
    { label: 'Go back Sellora', href: '/', icon: Home },
  ];

  return (
    <VendorGuard>
      <div className="min-h-screen bg-[#FAFAFA] font-sans flex flex-col lg:flex-row antialiased">
        {/* Dynamic Mobile-Responsive Reusable AppSidebar for Seller Hub */}
        <AppSidebar
          brand={{
            title: 'Seller Hub',
            subtitle: user?.name || 'Vendor Store',
            icon: Store,
            href: '/',
          }}
          menuItems={navItems}
          footerLinks={footerLinks}
          userProfile={{
            name: user?.name || 'Vendor Store',
            role: 'SELLER',
          }}
          onLogout={handleLogout}
          logoutText="Sign Out"
          theme="slate"
        />

        {/* Seller Content Body */}
        <main className="flex-1 min-w-0 p-4 sm:p-6 lg:p-8">{children}</main>
      </div>
    </VendorGuard>
  );
}
