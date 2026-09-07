'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/providers/auth-context';
import { useCart } from '@/providers/cart-context';
import { useSiteSettings } from '@/hooks/use-site-settings';
import { ApiClient } from '@/lib/api-client';
import {
  Search,
  ShoppingCart,
  Menu,
  ChevronRight,
  ChevronDown,
  Smartphone,
  Laptop,
  Home as HomeIcon,
  Shirt,
  Footprints,
  Watch,
  X,
  User as UserIcon,
  LogOut,
  Store,
  ShieldCheck,
  Loader2,
  Heart,
  Package,
  Grid,
} from 'lucide-react';

interface SubCategory {
  title: string;
  items: string[];
}

interface CategoryItem {
  id: string;
  name: string;
  icon: React.ElementType;
  subcategories: SubCategory[];
}

const CATEGORIES: CategoryItem[] = [
  {
    id: 'footwear',
    name: 'Shoes & Footwear',
    icon: Footprints,
    subcategories: [
      { title: 'Men Footwear', items: ['Sneakers & Casual', 'Formal Leather', 'Sports Shoes', 'Loafers & Boots', 'Sandals & Slippers'] },
      { title: 'Women Footwear', items: ['Heels & Pumps', 'Flat Sandals', 'Wedges & Platforms', 'Athletic Shoes', 'Boots & Ankle Boots'] },
    ],
  },
  {
    id: 'electronics',
    name: 'Gadgets & Electronics',
    icon: Smartphone,
    subcategories: [
      { title: 'Smartphones & Tablets', items: ['iPhone 16 Series', 'Samsung Galaxy S24', 'Xiaomi & Redmi', 'Realme & Vivo', 'Ipads & Android Tabs'] },
      { title: 'Audio & Music', items: ['TWS Earbuds', 'Wireless Neckbands', 'Bluetooth Speakers', 'Over-Ear Headphones', 'Microphones'] },
    ],
  },
  {
    id: 'laptops',
    name: 'Laptops & Computers',
    icon: Laptop,
    subcategories: [
      { title: 'Laptops', items: ['MacBook Air / Pro', 'Gaming Laptops', 'Ultra-thin Notebooks', 'Student Laptops', 'Workstation PC'] },
      { title: 'Accessories', items: ['Mechanical Keyboards', 'Wireless Mice', 'Monitors 4K/144Hz', 'External SSDs', 'USB Hubs'] },
    ],
  },
  {
    id: 'fashion',
    name: "Women's & Men's Fashion",
    icon: Shirt,
    subcategories: [
      { title: "Men's Clothing", items: ['Polo T-Shirts', 'Casual Shirts', 'Denim Pants', 'Panjabi & Traditional', 'Jackets & Hoodies'] },
      { title: "Women's Wear", items: ['Three Piece Suites', 'Sarees', 'Tops & Kurtis', 'Western Wear', 'Abayas & Hijabs'] },
    ],
  },
  {
    id: 'appliances',
    name: 'Home & Kitchen Appliances',
    icon: HomeIcon,
    subcategories: [
      { title: 'Kitchen Tech', items: ['Microwave Ovens', 'Electric Rice Cookers', 'Air Fryers & Blenders', 'Coffee Makers', 'Induction Cooktops'] },
      { title: 'Home Comfort', items: ['Air Conditioners', 'Smart Refrigerators', 'Washing Machines', 'Vacuum Cleaners', 'Water Purifiers'] },
    ],
  },
  {
    id: 'wearables',
    name: 'Smartwatches & Accessories',
    icon: Watch,
    subcategories: [
      { title: 'Wearables', items: ['Apple Watch', 'Galaxy Watch', 'Fitness Trackers', 'Smart Rings', 'Premium Straps'] },
    ],
  },
];

export function StorefrontHeader() {
  const { user, logout, isVendor, isAdmin } = useAuth();
  const { totalItemsCount, toggleCart } = useCart();
  const { settings } = useSiteSettings();
  const router = useRouter();
  const pathname = usePathname();

  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [isCategoriesHovered, setIsCategoriesHovered] = useState(false);
  const [hoveredCategory, setHoveredCategory] = useState<CategoryItem>(CATEGORIES[0]);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [expandedMobileCategory, setExpandedMobileCategory] = useState<string | null>(null);

  // Close mobile drawer on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  // Debounced Live Backend Search
  useEffect(() => {
    const trimmed = searchQuery.trim();
    if (!trimmed) {
      setSearchResults([]);
      setIsSearching(false);
      return;
    }

    setIsSearching(true);
    const debounceTimer = setTimeout(async () => {
      try {
        const results = await ApiClient.get<any[]>(`/products?search=${encodeURIComponent(trimmed)}`);
        setSearchResults(results || []);
      } catch (err) {
        console.error('Header search error:', err);
      } finally {
        setIsSearching(false);
      }
    }, 250);

    return () => clearTimeout(debounceTimer);
  }, [searchQuery]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    setIsSearchFocused(false);
    router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
  };

  return (
    <header className="w-full z-50 bg-white font-sans text-slate-800 border-b border-slate-100 sticky top-0 shadow-xs">
      {/* 1. TOP ANNOUNCEMENT BAR (Desktop & Tablet) */}
      <div className="hidden md:block bg-brand-dark text-brand-lightest text-xs py-2 px-4 border-b border-brand-dark/20">
        <div className="max-w-[1536px] mx-auto flex items-center justify-between gap-4">
          <div className="text-[11px] font-medium text-brand-lightest/80 truncate">
            {settings?.announcementText || '🎉 Welcome to SELLORA! Free Express Shipping on orders over ৳5,000.'}
          </div>

          <div className="flex items-center gap-4 text-[11px] font-bold text-brand-lightest/90 shrink-0">
            <Link href="/register?role=SELLER" className="hover:text-brand-light transition-colors whitespace-nowrap">
              Sell With Sellora
            </Link>

            {user ? (
              <>
                <Link
                  href="/dashboard"
                  className="hover:text-brand-light transition-colors whitespace-nowrap font-extrabold text-white flex items-center gap-1"
                >
                  <UserIcon className="w-3 h-3 text-brand-primary" />
                  <span>My Account ({user.name.split(' ')[0]})</span>
                </Link>

                {isVendor && (
                  <Link href="/seller" className="hover:text-brand-light transition-colors whitespace-nowrap text-amber-300 flex items-center gap-1">
                    <Store className="w-3 h-3" />
                    <span>Seller Hub</span>
                  </Link>
                )}

                {isAdmin && (
                  <Link href="/admin" className="hover:text-brand-light transition-colors whitespace-nowrap text-emerald-300 flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3" />
                    <span>Admin Panel</span>
                  </Link>
                )}

                <button
                  onClick={() => logout()}
                  className="hover:text-rose-300 transition-colors whitespace-nowrap cursor-pointer flex items-center gap-1"
                >
                  <LogOut className="w-3 h-3" />
                  <span>Sign Out</span>
                </button>
              </>
            ) : (
              <>
                <Link href="/login" className="hover:text-brand-light transition-colors whitespace-nowrap">
                  Login
                </Link>
                <Link href="/register" className="hover:text-brand-light transition-colors whitespace-nowrap">
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      </div>

      {/* 2. MAIN HEADER BAR */}
      <div className="max-w-[1536px] mx-auto px-3 sm:px-6 py-2.5 sm:py-3 space-y-2.5 md:space-y-0 md:flex md:items-center md:justify-between md:gap-6">
        
        {/* Row 1 on Mobile: Hamburger, Logo & Right Actions (Cart / Account) */}
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 sm:gap-4">
            {/* Mobile Hamburger Button */}
            <button
              type="button"
              onClick={() => setIsMobileMenuOpen(true)}
              className="md:hidden p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors cursor-pointer"
              aria-label="Open Navigation Menu"
            >
              <Menu className="w-5 h-5" />
            </button>

            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 group shrink-0">
              {settings?.siteLogo ? (
                <img src={settings.siteLogo} alt={settings.siteName || 'Logo'} className="h-8 sm:h-9 w-auto object-contain rounded-lg" />
              ) : (
                <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-brand-primary text-white flex items-center justify-center shadow-xs transition-transform group-hover:scale-105">
                  <ShoppingCart className="w-4 h-4 sm:w-5 sm:h-5 fill-white stroke-none" />
                </div>
              )}
              <span className="text-xl sm:text-2xl font-black tracking-tight text-brand-dark leading-none">
                {settings?.siteName ? (
                  settings.siteName
                ) : (
                  <>
                    sell<span className="text-brand-primary">ora</span>
                  </>
                )}
              </span>
            </Link>

            {/* Desktop Category Hover Trigger */}
            <div
              className="relative hidden lg:block"
              onMouseEnter={() => setIsCategoriesHovered(true)}
              onMouseLeave={() => setIsCategoriesHovered(false)}
            >
              <button className="flex items-center gap-2 py-2 px-3 rounded-xl text-slate-700 font-bold text-xs hover:text-brand-primary hover:bg-slate-50 transition-colors cursor-pointer">
                <Menu className="w-4 h-4 text-slate-700" />
                <span>Categories</span>
              </button>

              {/* Desktop Category Dropdown Flyout */}
              <AnimatePresence>
                {isCategoriesHovered && (
                  <motion.div
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 6 }}
                    transition={{ duration: 0.18 }}
                    className="absolute top-full left-0 mt-1 w-[680px] bg-white rounded-2xl shadow-2xl border border-slate-200 z-50 flex overflow-hidden"
                  >
                    <div className="w-64 bg-brand-lightest/30 border-r border-slate-200/80 py-2 shrink-0">
                      {CATEGORIES.map((cat) => {
                        const Icon = cat.icon;
                        const isSelected = hoveredCategory.id === cat.id;
                        return (
                          <div
                            key={cat.id}
                            onMouseEnter={() => setHoveredCategory(cat)}
                            className={`flex items-center justify-between px-4 py-2.5 text-xs font-semibold cursor-pointer transition-all ${
                              isSelected
                                ? 'bg-white text-brand-primary font-extrabold border-l-4 border-brand-primary shadow-xs'
                                : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900'
                            }`}
                          >
                            <div className="flex items-center gap-3">
                              <Icon className={`w-4 h-4 ${isSelected ? 'text-brand-primary' : 'text-slate-500'}`} />
                              <span>{cat.name}</span>
                            </div>
                            <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                          </div>
                        );
                      })}
                    </div>

                    <div className="flex-1 p-5 bg-white space-y-4">
                      <h4 className="text-xs font-extrabold text-brand-primary uppercase tracking-wider border-b border-slate-100 pb-2">
                        {hoveredCategory.name}
                      </h4>
                      <div className="grid grid-cols-2 gap-6">
                        {hoveredCategory.subcategories.map((sub, idx) => (
                          <div key={idx} className="space-y-2">
                            <h5 className="text-xs font-bold text-slate-900">{sub.title}</h5>
                            <ul className="space-y-1.5">
                              {sub.items.map((item, itemIdx) => (
                                <li key={itemIdx}>
                                  <Link
                                    href="/search"
                                    className="text-xs text-slate-600 hover:text-brand-primary hover:underline font-medium transition-colors"
                                  >
                                    {item}
                                  </Link>
                                </li>
                              ))}
                            </ul>
                          </div>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Right Mobile Actions (Cart + Account) */}
          <div className="flex md:hidden items-center gap-1.5">
            <Link
              href={user ? '/dashboard' : '/login'}
              className="p-2 rounded-xl text-slate-700 hover:text-brand-primary transition-colors"
              aria-label="Account"
            >
              <UserIcon className="w-5 h-5 text-brand-dark" />
            </Link>

            <button
              type="button"
              onClick={toggleCart}
              className="relative p-2 text-slate-700 hover:text-brand-primary transition-colors cursor-pointer"
              aria-label="Shopping Cart"
            >
              <ShoppingCart className="w-5 h-5 text-brand-dark" />
              {totalItemsCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 min-w-4 h-4 px-1 rounded-full bg-brand-primary text-white text-[9px] font-black flex items-center justify-center border border-white">
                  {totalItemsCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Center: Search Bar (Full Width on Mobile, Max-W-2xl on Desktop) */}
        <form onSubmit={handleSearchSubmit} className="w-full md:flex-1 md:max-w-2xl relative">
          <div className="flex items-center rounded-xl bg-slate-100/90 border border-slate-200 focus-within:border-brand-primary focus-within:bg-white focus-within:ring-2 focus-within:ring-brand-primary/20 transition-all">
            <div className="pl-3 pr-2 text-slate-400">
              {isSearching ? (
                <Loader2 className="w-4 h-4 text-brand-primary animate-spin" />
              ) : (
                <Search className="w-4 h-4" />
              )}
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setIsSearchFocused(true)}
              onBlur={() => setTimeout(() => setIsSearchFocused(false), 250)}
              placeholder="Search products, brands, categories..."
              className="w-full py-2 text-xs sm:text-sm font-medium bg-transparent text-slate-900 placeholder:text-slate-400 focus:outline-none"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => {
                  setSearchQuery('');
                  setSearchResults([]);
                }}
                className="p-1 mr-1 text-slate-400 hover:text-slate-700 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            )}
            <button
              type="submit"
              className="bg-brand-primary hover:bg-brand-primary-hover text-white font-extrabold text-xs sm:text-sm px-4 sm:px-6 py-2 rounded-r-xl transition-colors shrink-0 cursor-pointer"
            >
              Search
            </button>
          </div>

          {/* Search Dropdown Results */}
          <AnimatePresence>
            {isSearchFocused && searchQuery.trim() && (
              <motion.div
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 6 }}
                className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl border border-slate-200 shadow-xl z-50 p-3 sm:p-4 space-y-2 max-h-96 overflow-y-auto"
              >
                <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                  <span className="text-[10px] sm:text-[11px] font-black text-slate-400 uppercase tracking-wider">
                    Database Products
                  </span>
                  {isSearching && (
                    <span className="text-[10px] text-brand-primary font-bold flex items-center gap-1">
                      <Loader2 className="w-3 h-3 animate-spin" />
                      Searching...
                    </span>
                  )}
                </div>

                {searchResults.length > 0 ? (
                  <>
                    <div className="space-y-1">
                      {searchResults.slice(0, 6).map((item) => (
                        <Link
                          key={item.id}
                          href={`/products/${item.id}`}
                          onClick={() => setIsSearchFocused(false)}
                          className="flex items-center gap-3 p-2 rounded-xl hover:bg-slate-50 transition-colors"
                        >
                          <img
                            src={item.imageUrl}
                            alt={item.title}
                            className="w-9 h-9 object-contain rounded-lg border border-slate-100 bg-white p-0.5 shrink-0"
                          />
                          <div className="min-w-0 flex-1">
                            <h5 className="text-xs font-bold text-slate-900 truncate">{item.title}</h5>
                            <div className="flex items-center gap-2 mt-0.5">
                              <span className="text-xs font-black text-brand-primary">
                                ৳{Number(item.price).toLocaleString()}
                              </span>
                              {item.category && (
                                <span className="text-[10px] text-slate-400 font-medium truncate">
                                  in {item.category}
                                </span>
                              )}
                            </div>
                          </div>
                        </Link>
                      ))}
                    </div>

                    <div className="pt-2 border-t border-slate-100 text-center">
                      <Link
                        href={`/search?q=${encodeURIComponent(searchQuery.trim())}`}
                        onClick={() => setIsSearchFocused(false)}
                        className="text-xs font-black text-brand-primary hover:underline inline-block py-1 cursor-pointer"
                      >
                        View all {searchResults.length} matching products &rarr;
                      </Link>
                    </div>
                  </>
                ) : !isSearching ? (
                  <div className="text-xs text-slate-500 py-3 text-center">
                    No products found in database matching &quot;{searchQuery}&quot;
                  </div>
                ) : null}
              </motion.div>
            )}
          </AnimatePresence>
        </form>

        {/* Right Side on Desktop: Cart & Account */}
        <div className="hidden md:flex items-center gap-4 shrink-0">
          <button
            type="button"
            onClick={toggleCart}
            className="relative p-2 text-slate-700 hover:text-brand-primary transition-colors cursor-pointer"
            aria-label="Shopping Cart"
            title="Open Shopping Cart"
          >
            <ShoppingCart className="w-6 h-6 text-brand-dark hover:text-brand-primary" />
            {totalItemsCount > 0 && (
              <span className="absolute -top-1 -right-1.5 min-w-4 h-4 px-1 rounded-full bg-brand-primary text-white text-[10px] font-black flex items-center justify-center border-2 border-white">
                {totalItemsCount}
              </span>
            )}
          </button>

          <Link
            href={user ? '/dashboard' : '/login'}
            className="flex items-center gap-2 py-2 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition-all"
          >
            <UserIcon className="w-4 h-4 text-brand-primary" />
            <span>{user ? user.name.split(' ')[0] : 'Sign In'}</span>
          </Link>
        </div>
      </div>

      {/* 3. MOBILE SLIDE-OVER NAVIGATION DRAWER */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs z-50 md:hidden"
            />

            {/* Drawer Content */}
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 280 }}
              className="fixed inset-y-0 left-0 w-[82vw] max-w-xs bg-white shadow-2xl z-50 flex flex-col justify-between overflow-y-auto md:hidden font-sans"
            >
              <div className="p-5 space-y-5">
                {/* Header Row */}
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-xl bg-brand-primary text-white flex items-center justify-center font-black">
                      <ShoppingCart className="w-4 h-4" />
                    </div>
                    <span className="text-lg font-black text-brand-dark">
                      sell<span className="text-brand-primary">ora</span>
                    </span>
                  </div>
                  <button
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="p-1.5 rounded-xl bg-slate-100 text-slate-500 hover:text-slate-900 cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {/* User Status Card */}
                <div className="p-3.5 rounded-2xl bg-brand-lightest/50 border border-brand-light/30">
                  {user ? (
                    <div className="space-y-2">
                      <div className="flex items-center gap-2.5">
                        <div className="w-9 h-9 rounded-full bg-brand-primary text-white font-black text-xs flex items-center justify-center">
                          {user.name.charAt(0)}
                        </div>
                        <div className="min-w-0">
                          <h4 className="text-xs font-black text-slate-900 truncate">{user.name}</h4>
                          <span className="text-[10px] font-bold text-slate-400 truncate block">{user.email}</span>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-2 pt-1">
                        <Link
                          href="/dashboard"
                          onClick={() => setIsMobileMenuOpen(false)}
                          className="px-2.5 py-1.5 rounded-xl bg-white text-center text-[11px] font-bold text-slate-700 border border-slate-200"
                        >
                          My Account
                        </Link>
                        <Link
                          href="/dashboard/orders"
                          onClick={() => setIsMobileMenuOpen(false)}
                          className="px-2.5 py-1.5 rounded-xl bg-brand-primary text-center text-[11px] font-black text-white"
                        >
                          Track Orders
                        </Link>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <p className="text-xs font-bold text-slate-700">Sign in to track orders & earn rewards</p>
                      <div className="grid grid-cols-2 gap-2">
                        <Link
                          href="/login"
                          onClick={() => setIsMobileMenuOpen(false)}
                          className="px-3 py-2 rounded-xl bg-brand-primary text-white text-center text-xs font-black"
                        >
                          Sign In
                        </Link>
                        <Link
                          href="/register"
                          onClick={() => setIsMobileMenuOpen(false)}
                          className="px-3 py-2 rounded-xl bg-white border border-slate-200 text-slate-800 text-center text-xs font-bold"
                        >
                          Register
                        </Link>
                      </div>
                    </div>
                  )}
                </div>

                {/* Main Navigation Links */}
                <div className="space-y-1 text-xs font-bold text-slate-700">
                  <Link
                    href="/"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-slate-50 transition-colors"
                  >
                    <HomeIcon className="w-4 h-4 text-brand-primary" />
                    <span>Home Marketplace</span>
                  </Link>

                  <Link
                    href="/dashboard/orders"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-slate-50 transition-colors"
                  >
                    <Package className="w-4 h-4 text-brand-primary" />
                    <span>My Orders & Logistics Tracking</span>
                  </Link>

                  <Link
                    href="/dashboard/wishlist"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-slate-50 transition-colors"
                  >
                    <Heart className="w-4 h-4 text-rose-500" />
                    <span>Saved Wishlist</span>
                  </Link>

                  <Link
                    href="/cart"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center justify-between px-3 py-2.5 rounded-xl hover:bg-slate-50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <ShoppingCart className="w-4 h-4 text-brand-primary" />
                      <span>Shopping Cart</span>
                    </div>
                    {totalItemsCount > 0 && (
                      <span className="px-2 py-0.5 rounded-full bg-brand-primary text-white text-[10px] font-black">
                        {totalItemsCount}
                      </span>
                    )}
                  </Link>
                </div>

                {/* Categories Accordion Section */}
                <div className="pt-3 border-t border-slate-100 space-y-1">
                  <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 px-3 block">
                    Product Categories
                  </span>

                  <div className="space-y-0.5">
                    {CATEGORIES.map((cat) => {
                      const Icon = cat.icon;
                      const isExpanded = expandedMobileCategory === cat.id;

                      return (
                        <div key={cat.id} className="rounded-xl overflow-hidden">
                          <button
                            type="button"
                            onClick={() => setExpandedMobileCategory(isExpanded ? null : cat.id)}
                            className="w-full flex items-center justify-between px-3 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer"
                          >
                            <div className="flex items-center gap-2.5">
                              <Icon className="w-4 h-4 text-brand-primary" />
                              <span>{cat.name}</span>
                            </div>
                            <ChevronDown className={`w-3.5 h-3.5 transition-transform ${isExpanded ? 'rotate-180 text-brand-primary' : 'text-slate-400'}`} />
                          </button>

                          {isExpanded && (
                            <div className="pl-9 pr-3 py-1 space-y-1 bg-slate-50/80 rounded-b-xl">
                              {cat.subcategories.map((sub, sIdx) => (
                                <div key={sIdx} className="space-y-1 py-1">
                                  <span className="text-[10px] font-black text-slate-400 block">{sub.title}</span>
                                  {sub.items.map((item, iIdx) => (
                                    <Link
                                      key={iIdx}
                                      href="/search"
                                      onClick={() => setIsMobileMenuOpen(false)}
                                      className="block text-[11px] font-medium text-slate-600 hover:text-brand-primary py-0.5"
                                    >
                                      {item}
                                    </Link>
                                  ))}
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Seller & Admin Sections */}
                <div className="pt-3 border-t border-slate-100 space-y-1">
                  <Link
                    href="/register?role=SELLER"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-amber-800 bg-amber-50 hover:bg-amber-100 text-xs font-bold transition-colors"
                  >
                    <Store className="w-4 h-4 text-amber-600" />
                    <span>Sell With Sellora (Open Store)</span>
                  </Link>

                  {isVendor && (
                    <Link
                      href="/seller"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-brand-dark bg-brand-lightest/70 hover:bg-brand-lightest text-xs font-bold transition-colors"
                    >
                      <Store className="w-4 h-4 text-brand-primary" />
                      <span>Vendor Dashboard</span>
                    </Link>
                  )}

                  {isAdmin && (
                    <Link
                      href="/admin"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-emerald-800 bg-emerald-50 hover:bg-emerald-100 text-xs font-bold transition-colors"
                    >
                      <ShieldCheck className="w-4 h-4 text-emerald-600" />
                      <span>Admin Control Panel</span>
                    </Link>
                  )}
                </div>
              </div>

              {/* Drawer Footer */}
              {user && (
                <div className="p-4 border-t border-slate-100 bg-slate-50">
                  <button
                    onClick={() => {
                      logout();
                      setIsMobileMenuOpen(false);
                    }}
                    className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-white border border-slate-200 text-rose-600 font-bold text-xs hover:bg-rose-50 transition-colors cursor-pointer"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Sign Out</span>
                  </button>
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </header>
  );
}
