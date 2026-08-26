'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Grid, ShoppingCart, Heart, User } from 'lucide-react';

export function MobileBottomBar() {
  const pathname = usePathname();

  const navItems = [
    { href: '/', label: 'Home', icon: Home },
    { href: '/categories', label: 'Categories', icon: Grid },
    { href: '/cart', label: 'Cart', icon: ShoppingCart, badge: '3' },
    { href: '/cart', label: 'Wishlist', icon: Heart, badge: '2' },
    { href: '/help', label: 'Account', icon: User },
  ];

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-xl border-t border-slate-200 shadow-2xl py-2 px-4 flex items-center justify-around">
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = pathname === item.href;
        return (
          <Link
            key={item.label}
            href={item.href}
            className={`relative flex flex-col items-center gap-0.5 p-1 transition-all ${
              isActive ? 'text-brand-primary font-black' : 'text-slate-500 hover:text-brand-dark font-medium'
            }`}
          >
            <div className="relative">
              <Icon className="w-5 h-5" />
              {item.badge && (
                <span className="absolute -top-1.5 -right-2 w-4 h-4 rounded-full bg-brand-primary text-white text-[9px] font-black flex items-center justify-center">
                  {item.badge}
                </span>
              )}
            </div>
            <span className="text-[10px]">{item.label}</span>
          </Link>
        );
      })}
    </div>
  );
}
