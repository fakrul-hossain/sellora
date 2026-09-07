'use client';

import React from 'react';
import Link from 'next/link';
import { PhoneCall, Mail, MapPin, Lock } from 'lucide-react';

export function StorefrontFooter() {
  return (
    <footer className="bg-brand-dark text-brand-lightest font-sans text-xs border-t border-brand-dark/20">
      <div className="max-w-[1536px] mx-auto px-4 sm:px-6 py-8 sm:py-12 lg:py-16 space-y-8 sm:space-y-12">
        {/* Main 4 Column Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8">
          
          {/* Col 1: Brand & Contact Info */}
          <div className="lg:col-span-4 space-y-4">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-2xl bg-brand-primary text-white font-black text-xl flex items-center justify-center shadow-md">
                S
              </div>
              <span className="text-2xl font-black tracking-tight text-white">
                SELL<span className="text-brand-light">ORA</span>
              </span>
            </Link>

            <p className="text-brand-lightest/80 leading-relaxed font-normal">
              SELLORA is Bangladesh&apos;s premier technology ecommerce platform delivering 100% original gadgets, flagship smartphones, workstations, and smart home IoT automation with official brand warranty.
            </p>

            <div className="space-y-2 pt-2 text-brand-lightest font-medium">
              <div className="flex items-center gap-2">
                <PhoneCall className="w-4 h-4 text-brand-light" />
                <span>Customer Care Hotline: 09612-SELLORA (7355)</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-brand-light" />
                <span>support@sellora.com.bd</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-brand-light" />
                <span>Headquarters: Mirpur-10 Circle, Dhaka-1216</span>
              </div>
            </div>
          </div>

          {/* Col 2: Categories */}
          <div className="lg:col-span-2 space-y-3">
            <h4 className="text-sm font-black text-white uppercase tracking-wider">Categories</h4>
            <ul className="space-y-2 font-medium">
              <li><Link href="/categories?cat=mobiles" className="hover:text-brand-light transition-colors">Smartphones</Link></li>
              <li><Link href="/categories?cat=laptops" className="hover:text-brand-light transition-colors">Laptops & Mac</Link></li>
              <li><Link href="/categories?cat=audio" className="hover:text-brand-light transition-colors">Audio & Sound</Link></li>
              <li><Link href="/categories?cat=wearables" className="hover:text-brand-light transition-colors">Smartwatches</Link></li>
              <li><Link href="/categories?cat=smarthome" className="hover:text-brand-light transition-colors">Smart Home IoT</Link></li>
            </ul>
          </div>

          {/* Col 3: Customer Care */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="text-sm font-black text-white uppercase tracking-wider">Customer Service</h4>
            <ul className="space-y-2 font-medium">
              <li><Link href="/help" className="hover:text-brand-light transition-colors">Track Order Status</Link></li>
              <li><Link href="/help" className="hover:text-brand-light transition-colors">Official Warranty Claim Hub</Link></li>
              <li><Link href="/help" className="hover:text-brand-light transition-colors">7 Days Replacement Policy</Link></li>
              <li><Link href="/help" className="hover:text-brand-light transition-colors">0% Bank EMI Policies</Link></li>
              <li><Link href="/help" className="hover:text-brand-light transition-colors">Corporate & Wholesale Orders</Link></li>
            </ul>
          </div>

          {/* Col 4: Payments & Security */}
          <div className="lg:col-span-3 space-y-4">
            <h4 className="text-sm font-black text-white uppercase tracking-wider">Secure Payment Partners</h4>
            <p className="text-brand-lightest/80 font-normal">
              We accept Cash on Delivery nationwide along with bKash, Nagad, Visa, Mastercard, and Amex credit cards.
            </p>

            <div className="flex flex-wrap items-center gap-2 pt-1">
              <div className="bg-white px-2.5 py-1 rounded-xl flex items-center justify-center shadow-xs border border-white/20 h-9" title="Stripe Cards (Visa, Mastercard, Amex)">
                <img src="/images/stripe.png" alt="Stripe / Cards" className="h-4 sm:h-5 w-auto object-contain" />
              </div>
              <div className="bg-white px-2.5 py-1 rounded-xl flex items-center justify-center shadow-xs border border-white/20 h-9" title="bKash">
                <img src="/images/bkash_logo.avif" alt="bKash" className="h-6 w-auto object-contain" />
              </div>
              <div className="bg-white px-2.5 py-1 rounded-xl flex items-center justify-center shadow-xs border border-white/20 h-9" title="Cash on Delivery">
                <img src="/images/cod.avif" alt="Cash on Delivery" className="h-6 w-auto object-contain" />
              </div>
              <div className="bg-white px-2.5 py-1 rounded-xl flex items-center justify-center shadow-xs border border-white/20 h-9" title="Upay / Digital Wallet">
                <img src="/images/upay2.svg" alt="Upay" className="h-6 w-auto object-contain" />
              </div>
            </div>

            <div className="p-3 rounded-2xl bg-brand-dark/60 border border-brand-light/20 flex items-center gap-2.5 text-[11px] text-brand-light font-bold">
              <Lock className="w-4 h-4 text-brand-light shrink-0" />
              <span>256-Bit SSL Encrypted & Verified Secure</span>
            </div>
          </div>
        </div>

        {/* Bottom Copyright Bar */}
        <div className="pt-8 border-t border-brand-light/20 flex flex-col sm:flex-row items-center justify-between gap-4 text-brand-lightest/70 font-medium">
          <p>© 2026 SELLORA Technologies Ltd. All Rights Reserved.</p>
          <div className="flex gap-4">
            <Link href="/help" className="hover:text-brand-light">Privacy Policy</Link>
            <span>•</span>
            <Link href="/help" className="hover:text-brand-light">Terms of Service</Link>
            <span>•</span>
            <Link href="/help" className="hover:text-brand-light">Sitemap</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
