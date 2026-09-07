'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Apple, Play } from 'lucide-react';
import Link from 'next/link';
import { useSiteSettings } from '@/hooks/use-site-settings';

const DEFAULT_HERO_SLIDES = [
  {
    id: 1,
    image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?q=80&w=1200',
    slug: '/campaigns/tech-mega-sale',
  },
  {
    id: 2,
    image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?q=80&w=1200',
    slug: '/campaigns/ultrabook-deals',
  },
];

export function StorefrontHero() {
  const { settings } = useSiteSettings();
  const [currentSlide, setCurrentSlide] = useState(0);

  const heroSlides = settings?.heroConfig?.slides && settings.heroConfig.slides.length > 0
    ? settings.heroConfig.slides
    : DEFAULT_HERO_SLIDES;

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [heroSlides.length]);

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length);

  return (
    <section className="py-4 font-sans">
      <div className="max-w-[1536px] mx-auto px-4 sm:px-6 grid grid-cols-1 lg:grid-cols-12 gap-4">
        
        {/* Left Main Slider — Pure 100% Un-obscured Image Banner */}
        <div className="lg:col-span-9 relative rounded-2xl overflow-hidden shadow-sm bg-stone-100 min-h-[190px] sm:min-h-[280px] lg:min-h-[400px] aspect-[16/9] sm:aspect-[21/9] lg:aspect-auto flex items-center group">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentSlide}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
              className="absolute inset-0 w-full h-full"
            >
              <Link href={heroSlides[currentSlide]?.slug || '/products'} className="block w-full h-full cursor-pointer">
                <img
                  src={heroSlides[currentSlide]?.image}
                  alt={`Hero Banner ${currentSlide + 1}`}
                  className="w-full h-full object-cover object-center group-hover:scale-[1.01] transition-transform duration-500 ease-out"
                />
              </Link>
            </motion.div>
          </AnimatePresence>

          {/* Left Arrow Button */}
          <button
            onClick={prevSlide}
            className="absolute left-2.5 sm:left-3 top-1/2 -translate-y-1/2 w-7 h-7 sm:w-9 sm:h-9 rounded-full bg-white/80 hover:bg-white text-slate-800 shadow-md flex items-center justify-center transition-all cursor-pointer z-10"
            aria-label="Previous Slide"
          >
            <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>

          {/* Right Arrow Button */}
          <button
            onClick={nextSlide}
            className="absolute right-2.5 sm:right-3 top-1/2 -translate-y-1/2 w-7 h-7 sm:w-9 sm:h-9 rounded-full bg-white/80 hover:bg-white text-slate-800 shadow-md flex items-center justify-center transition-all cursor-pointer z-10"
            aria-label="Next Slide"
          >
            <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>

          {/* Bottom Pagination Dots */}
          <div className="absolute bottom-2.5 sm:bottom-3 inset-x-0 flex items-center justify-center gap-1.5 z-10">
            {heroSlides.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentSlide(idx)}
                className={`h-1.5 sm:h-2 rounded-full transition-all cursor-pointer ${
                  currentSlide === idx ? 'w-5 sm:w-6 bg-brand-primary' : 'w-1.5 sm:w-2 bg-white/80 hover:bg-white'
                }`}
                aria-label={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>
        </div>

        {/* Right App Download Promo Card (Desktop Only to prevent mobile vertical clutter) */}
        <div className="hidden lg:flex lg:col-span-3 rounded-2xl overflow-hidden bg-gradient-to-b from-brand-lightest via-brand-light/30 to-brand-primary/20 p-5 flex-col justify-between shadow-xs border border-brand-light/40 relative">
          <div className="space-y-3">
            <div className="bg-brand-dark text-white p-4 rounded-2xl shadow-md text-center relative overflow-hidden">
              <p className="text-xs font-bold text-brand-lightest uppercase tracking-wider">Download the App &</p>
              <h3 className="text-xl sm:text-2xl font-black leading-tight text-white mt-0.5">
                GET ৳250 OFF
              </h3>
              <p className="text-[11px] font-medium text-brand-lightest mt-0.5">on your first order!</p>
            </div>
          </div>

          <div className="bg-white/90 backdrop-blur-xs rounded-2xl p-4 border border-white shadow-xs space-y-3 mt-4 text-center">
            <div className="flex items-center gap-3 justify-center">
              <div className="w-16 h-16 bg-white p-1 rounded-lg border border-slate-200 shadow-xs shrink-0 flex items-center justify-center">
                <svg viewBox="0 0 100 100" className="w-full h-full text-brand-dark fill-current">
                  <rect x="0" y="0" width="30" height="30" rx="3" />
                  <rect x="5" y="5" width="20" height="20" fill="white" />
                  <rect x="10" y="10" width="10" height="10" />
                  <rect x="70" y="0" width="30" height="30" rx="3" />
                  <rect x="75" y="5" width="20" height="20" fill="white" />
                  <rect x="80" y="10" width="10" height="10" />
                  <rect x="0" y="70" width="30" height="30" rx="3" />
                  <rect x="5" y="75" width="20" height="20" fill="white" />
                  <rect x="10" y="80" width="10" height="10" />
                  <rect x="40" y="10" width="15" height="15" />
                  <rect x="40" y="40" width="20" height="20" />
                  <rect x="70" y="40" width="15" height="15" />
                  <rect x="10" y="45" width="15" height="15" />
                  <rect x="40" y="70" width="20" height="20" />
                  <rect x="70" y="70" width="20" height="20" />
                </svg>
              </div>

              <div className="text-left space-y-1">
                <p className="text-xs font-extrabold text-brand-dark leading-tight">
                  Scan QR code & get it now!
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 pt-1">
              <Link
                href="#"
                className="flex-1 bg-brand-dark hover:bg-brand-dark-hover text-white rounded-lg p-2 flex items-center justify-center gap-1.5 transition-colors"
              >
                <Apple className="w-4 h-4 fill-white" />
                <div className="text-left leading-none">
                  <span className="text-[8px] block text-brand-lightest/80 font-medium">Available on</span>
                  <span className="text-[10px] font-extrabold block">App Store</span>
                </div>
              </Link>

              <Link
                href="#"
                className="flex-1 bg-brand-dark hover:bg-brand-dark-hover text-white rounded-lg p-2 flex items-center justify-center gap-1.5 transition-colors"
              >
                <Play className="w-3.5 h-3.5 fill-white stroke-none" />
                <div className="text-left leading-none">
                  <span className="text-[8px] block text-brand-lightest/80 font-medium">GET IT ON</span>
                  <span className="text-[10px] font-extrabold block">Google Play</span>
                </div>
              </Link>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}