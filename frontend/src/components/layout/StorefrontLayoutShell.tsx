'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import { StorefrontHeader, StorefrontFooter, MobileBottomBar } from '@/components/layout';

export function StorefrontLayoutShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  // Exclude Storefront Header and Footer from Admin and Seller Portals
  const isDashboardRoute =
    pathname.startsWith('/admin') ||
    pathname.startsWith('/seller');

  if (isDashboardRoute) {
    return <main className="flex-1 flex flex-col">{children}</main>;
  }

  return (
    <>
      <StorefrontHeader />
      <main className="flex-1 flex flex-col pb-14 md:pb-0">{children}</main>
      <StorefrontFooter />
      <MobileBottomBar />
    </>
  );
}
