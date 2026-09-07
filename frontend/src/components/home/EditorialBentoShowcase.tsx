'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles, ShieldCheck, Zap, Headphones, Laptop, Smartphone } from 'lucide-react';

export function EditorialBentoShowcase() {
  return (
    <section className="py-10 sm:py-16 bg-[#FAFAFA]">
      <div className="max-w-[1536px] mx-auto px-4 sm:px-6 space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-xs font-black text-brand-primary uppercase tracking-wider bg-brand-lightest px-3 py-1 rounded-full border border-brand-light">
            EDITORIAL CURATION
          </span>
          <h2 className="text-2xl sm:text-4xl font-black text-brand-dark tracking-tight">
            Designed for Modern Tech Lifestyles
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 font-medium">
            Curated collections of premium hardware, studio acoustics, and smart living automation.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          {/* Main Large Editorial Card (7 Columns) */}
          <div className="md:col-span-7 rounded-2xl sm:rounded-3xl bg-brand-dark p-5 sm:p-10 lg:p-12 text-white shadow-xl relative overflow-hidden flex flex-col justify-between min-h-[260px] sm:min-h-[360px] border border-brand-dark/20">
            <div className="absolute top-0 right-0 w-80 h-80 bg-brand-primary/10 rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10 space-y-3 sm:space-y-4">
              <span className="bg-brand-primary/30 text-brand-lightest text-[10px] sm:text-xs font-black px-2.5 py-1 rounded-full border border-brand-light/30 uppercase tracking-wider inline-flex items-center gap-1.5">
                <Sparkles className="w-3 h-3" /> Apple Authorized Hub
              </span>
              <h3 className="text-xl sm:text-3xl lg:text-4xl font-black text-white leading-tight">
                The Apple Ecosystem. Perfected.
              </h3>
              <p className="text-xs sm:text-sm text-brand-lightest/90 font-medium max-w-md leading-relaxed hidden sm:block">
                Experience seamless integration across iPhone 16 Pro, M3 MacBook Pro, and Apple Watch Ultra with official manufacturer warranty.
              </p>
            </div>

            <div className="relative z-10 pt-4 sm:pt-6 flex items-center justify-between">
              <Link
                href="/categories?cat=mobiles"
                className="py-2.5 sm:py-3.5 px-4 sm:px-6 rounded-xl sm:rounded-2xl bg-brand-lightest text-brand-dark font-black text-xs hover:bg-white transition-all shadow-md flex items-center gap-2"
              >
                <span>Shop Apple Official</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          {/* Secondary Card (5 Columns) */}
          <div className="md:col-span-5 rounded-2xl sm:rounded-3xl bg-brand-primary p-5 sm:p-8 text-white shadow-xl relative overflow-hidden flex flex-col justify-between min-h-[220px] sm:min-h-[360px]">
            <div className="space-y-3 sm:space-y-4 relative z-10">
              <span className="bg-white/20 text-white text-[10px] sm:text-xs font-black px-2.5 py-1 rounded-full uppercase tracking-wider inline-flex items-center gap-1.5 border border-white/20">
                <Headphones className="w-3 h-3" /> Audio Acoustics
              </span>
              <h3 className="text-xl sm:text-2xl font-black leading-tight">
                Active Noise Cancelling & Studio Audio
              </h3>
              <p className="text-xs text-brand-lightest/90 font-medium leading-relaxed hidden sm:block">
                Immerse in pure clarity with Sony, Bose & Remax ANC headphones engineered for lossless wireless acoustics.
              </p>
            </div>

            <div className="pt-4 sm:pt-6 relative z-10">
              <Link
                href="/categories?cat=audio"
                className="py-2.5 sm:py-3 px-4 sm:px-5 rounded-xl sm:rounded-2xl bg-brand-dark text-white font-black text-xs hover:bg-brand-dark-hover transition-all inline-flex items-center gap-2 shadow-md"
              >
                <span>Explore Audio Range</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
