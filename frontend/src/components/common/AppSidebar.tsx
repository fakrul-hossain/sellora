'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, LogOut } from 'lucide-react';

export interface SidebarMenuItem {
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
}

export interface SidebarFooterLink {
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
}

export interface AppSidebarProps {
  brand: {
    title: string;
    subtitle: string;
    icon: React.ComponentType<{ className?: string }>;
    href?: string;
  };
  menuItems: SidebarMenuItem[];
  footerLinks?: SidebarFooterLink[];
  userProfile?: {
    name?: string;
    role?: string;
  };
  onLogout?: () => void;
  logoutText?: string;
  theme?: 'dark' | 'slate';
}

export function AppSidebar({
  brand,
  menuItems,
  footerLinks = [],
  userProfile,
  onLogout,
  logoutText = 'Log Out',
  theme = 'dark',
}: AppSidebarProps) {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  // Close mobile sidebar on route change
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  const BrandIcon = brand.icon;
  const isSlateTheme = theme === 'slate';

  const sidebarBgClass = isSlateTheme ? 'bg-slate-900 text-white' : 'bg-brand-dark text-white';
  const borderClass = isSlateTheme ? 'border-slate-800' : 'border-brand-dark/30';
  const activeClass = isSlateTheme ? 'bg-brand-primary text-white shadow-md' : 'bg-brand-primary text-white font-black shadow-md';
  const hoverClass = isSlateTheme ? 'text-slate-300 hover:bg-slate-800' : 'text-brand-lightest/80 hover:bg-white/10 hover:text-white';

  const renderContent = () => (
    <div className="flex flex-col justify-between h-full p-6 space-y-6">
      <div className="space-y-6 overflow-y-auto scrollbar-none">
        {/* Brand Header */}
        <Link href={brand.href || '/'} className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-2xl bg-brand-primary flex items-center justify-center text-white font-black shadow-md shrink-0 group-hover:scale-105 transition-transform">
            <BrandIcon className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <h2 className="text-base font-black text-white tracking-wider truncate">{brand.title}</h2>
            <span className="text-[10px] text-brand-lightest/70 uppercase tracking-widest block font-extrabold truncate">
              {brand.subtitle}
            </span>
          </div>
        </Link>

        {/* Dynamic Navigation Menu */}
        <nav className="space-y-1.5 text-xs font-bold">
          {menuItems.map((item) => {
            const ItemIcon = item.icon;
            const isActive =
              pathname === item.href ||
              (item.href !== '/admin' && item.href !== '/seller' && pathname.startsWith(item.href));

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3.5 py-3 rounded-2xl transition-all ${isActive ? activeClass : hoverClass
                  }`}
              >
                <ItemIcon className={`w-4 h-4 ${isActive ? 'text-white' : isSlateTheme ? 'text-slate-400' : 'text-brand-light'}`} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Footer & User Actions */}
      <div className={`space-y-2 pt-4 border-t ${borderClass} shrink-0`}>
        {footerLinks.map((link) => {
          const LinkIcon = link.icon;
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`flex items-center gap-2 px-3.5 py-2.5 rounded-2xl text-xs font-bold transition-all ${isSlateTheme ? 'text-slate-400 hover:text-white hover:bg-slate-800' : 'text-brand-lightest/70 hover:text-white hover:bg-white/10'
                }`}
            >
              <LinkIcon className="w-4 h-4" />
              <span>{link.label}</span>
            </Link>
          );
        })}

        {onLogout && (
          <button
            onClick={onLogout}
            className="w-full flex items-center gap-3 px-3.5 py-3 rounded-2xl text-rose-400 hover:bg-rose-950/40 transition-all text-xs font-bold cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            <span>{logoutText}</span>
          </button>
        )}
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile Top Bar with Hamburger Trigger */}
      <div className={`lg:hidden flex items-center justify-between p-4 ${sidebarBgClass} border-b ${borderClass} sticky top-0 z-40 shadow-sm`}>
        <Link href={brand.href || '/'} className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-brand-primary flex items-center justify-center text-white font-black shadow-sm">
            <BrandIcon className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-xs font-black text-white leading-tight">{brand.title}</h2>
            <span className="text-[9px] text-brand-lightest/70 uppercase tracking-wider block font-bold">
              {brand.subtitle}
            </span>
          </div>
        </Link>

        <button
          onClick={() => setIsOpen(!isOpen)}
          className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
          aria-label="Toggle Navigation Menu"
        >
          {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile Slide-Over Drawer Drawer Overlay */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs z-50 lg:hidden"
            />
            <motion.aside
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className={`fixed top-0 left-0 bottom-0 w-72 ${sidebarBgClass} z-50 lg:hidden shadow-2xl flex flex-col`}
            >
              {renderContent()}
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Desktop Sticky Sidebar */}
      <aside className={`hidden lg:flex w-64 ${sidebarBgClass} flex-col border-r ${borderClass} shrink-0 sticky top-0 h-screen z-30`}>
        {renderContent()}
      </aside>
    </>
  );
}
