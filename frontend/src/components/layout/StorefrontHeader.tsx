'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/providers/auth-context';
import { useCart } from '@/providers/cart-context';
import {
  Search,
  ShoppingCart,
  Menu,
  ChevronRight,
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
} from 'lucide-react';
import { mockProducts } from '@/lib/products-data';

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
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [isCategoriesHovered, setIsCategoriesHovered] = useState(false);
  const [hoveredCategory, setHoveredCategory] = useState<CategoryItem>(CATEGORIES[0]);

  const searchResults = searchQuery
    ? mockProducts.filter((p) => p.title.toLowerCase().includes(searchQuery.toLowerCase())).slice(0, 4)
    : [];

  return (
    <header className="w-full z-50 bg-white font-sans text-slate-800 border-b border-slate-100 sticky top-0 shadow-xs">
      {/* 1. TOP ANNOUNCEMENT BAR */}
      <div className="bg-brand-dark text-brand-lightest text-xs py-3 px-4 border-b border-brand-dark/20">
        <div className="max-w-[1536px] mx-auto flex items-center justify-between sm:justify-end gap-4">
          <div className="flex items-center gap-5 text-[11px] font-bold text-brand-lightest/90 shrink-0 overflow-x-auto scrollbar-hide">
            <Link href="/register?role=SELLER" className="hover:text-brand-light transition-colors whitespace-nowrap">
              Sell With Sellora
            </Link>

            {user ? (
              <>
                <Link href="/dashboard" className="hover:text-brand-light transition-colors whitespace-nowrap font-extrabold text-white flex items-center gap-1">
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

                <button onClick={() => logout()} className="hover:text-rose-300 transition-colors whitespace-nowrap cursor-pointer flex items-center gap-1">
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

      <div className="max-w-[1536px] mx-auto px-4 sm:px-6 py-3 flex items-center justify-between gap-4 md:gap-8">
        {/* Left Side: Logo & Category Dropdown */}
        <div className="flex items-center gap-6">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group shrink-0">
            <div className="w-9 h-9 rounded-xl bg-brand-primary text-white flex items-center justify-center shadow-xs transition-transform group-hover:scale-105">
              <ShoppingCart className="w-5 h-5 fill-white stroke-none" />
            </div>
            <span className="text-2xl font-black tracking-tight text-brand-dark leading-none">
              sell<span className="text-brand-primary">ora</span>
            </span>
          </Link>

          {/* Hover Category Trigger & Dropdown */}
          <div
            className="relative hidden lg:block"
            onMouseEnter={() => setIsCategoriesHovered(true)}
            onMouseLeave={() => setIsCategoriesHovered(false)}
          >
            <button className="flex items-center gap-2 py-2 px-3 rounded-lg text-slate-700 font-bold text-sm hover:text-brand-primary transition-colors cursor-pointer">
              <Menu className="w-5 h-5 text-slate-700" />
              <span>Categories</span>
            </button>

            {/* Category Dropdown Menu */}
            <AnimatePresence>
              {isCategoriesHovered && (
                <motion.div
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 6 }}
                  transition={{ duration: 0.18 }}
                  className="absolute top-full left-0 mt-1 w-[680px] bg-white rounded-xl shadow-2xl border border-slate-200 z-50 flex overflow-hidden"
                >
                  {/* Left Side: Main Categories List */}
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

                  {/* Right Side: Hovered Subcategories Flyout */}
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

        {/* Center: Search Bar */}
        <div className="flex-1 max-w-2xl relative">
          <div className="flex items-center rounded-xl bg-slate-100/90 border border-slate-200 focus-within:border-brand-primary focus-within:bg-white focus-within:ring-2 focus-within:ring-brand-primary/20 transition-all">
            <div className="pl-3.5 pr-2 text-slate-400">
              <Search className="w-4 h-4" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setIsSearchFocused(true)}
              onBlur={() => setTimeout(() => setIsSearchFocused(false), 200)}
              placeholder="Search in Sellora"
              className="w-full py-2 text-xs sm:text-sm font-medium bg-transparent text-slate-900 placeholder:text-slate-400 focus:outline-none"
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery('')} className="p-1 mr-2 text-slate-400 hover:text-slate-700">
                <X className="w-4 h-4" />
              </button>
            )}
            <button className="bg-brand-primary hover:bg-brand-primary-hover text-white font-extrabold text-xs sm:text-sm px-6 py-2 rounded-r-xl transition-colors shrink-0 cursor-pointer">
              Search
            </button>
          </div>

          {/* Search Dropdown Results */}
          <AnimatePresence>
            {isSearchFocused && searchQuery && (
              <motion.div
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 6 }}
                className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl border border-slate-200 shadow-xl z-50 p-4 space-y-2"
              >
                <div className="text-[11px] font-black text-slate-400 uppercase tracking-wider">Search Results</div>
                {searchResults.length > 0 ? (
                  searchResults.map((item) => (
                    <Link
                      key={item.id}
                      href={`/products/${item.id}`}
                      className="flex items-center gap-3 p-2 rounded-lg hover:bg-slate-50 transition-colors"
                    >
                      <img src={item.imageUrl} alt={item.title} className="w-9 h-9 object-contain rounded-md border border-slate-100" />
                      <div className="min-w-0 flex-1">
                        <h5 className="text-xs font-bold text-slate-900 truncate">{item.title}</h5>
                        <span className="text-xs font-black text-brand-primary">৳{item.price.toLocaleString()}</span>
                      </div>
                    </Link>
                  ))
                ) : (
                  <div className="text-xs text-slate-500 py-2">No products found for &quot;{searchQuery}&quot;</div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Right Side: Cart & Account Icons */}
        <div className="flex items-center gap-4">
          <button
            onClick={toggleCart}
            className="relative p-2 text-slate-700 hover:text-brand-primary transition-colors cursor-pointer"
            aria-label="Shopping Cart"
            title="Open Shopping Cart Drawer"
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
            className="hidden sm:flex items-center gap-2 py-2 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition-all"
          >
            <UserIcon className="w-4 h-4 text-brand-primary" />
            <span>{user ? user.name.split(' ')[0] : 'Sign In'}</span>
          </Link>
        </div>
      </div>
    </header>
  );
}
