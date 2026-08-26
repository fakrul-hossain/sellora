'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Apple, Play } from 'lucide-react';
import Link from 'next/link';

const HERO_SLIDES = [
  {
    id: 1,
    title: 'FLASH SALE',
    brand: 'Bata',
    discount: 'Flat 25% off',
    time: '3:00 - 9:00 PM',
    prepayment: 'Up to 15% Pre-payment Savings',
    delivery: 'FREE DELIVERY',
    image: '/banners/hero_bata_flash_sale.png',
  },
  {
    id: 2,
    title: 'MEGA TECH DEALS',
    brand: 'SELLORA',
    discount: 'Up to 40% off',
    time: 'Limited Time Offer',
    prepayment: 'Instant Bank Cashback',
    delivery: 'FREE EXPRESS SHIPPING',
    image: '/banners/hero_tech_flash_sale.png',
  },
];

export function StorefrontHero() {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length);
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + HERO_SLIDES.length) % HERO_SLIDES.length);

  return (
    <section className="py-4 font-sans">
      <div className="max-w-[1536px] mx-auto px-4 sm:px-6 grid grid-cols-1 lg:grid-cols-12 gap-4">
        
        {/* Left Main Slider (8 or 9 columns out of 12) */}
        <div className="lg:col-span-9 relative rounded-2xl overflow-hidden shadow-sm bg-stone-100 min-h-[340px] sm:min-h-[380px] lg:min-h-[420px] flex items-center">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentSlide}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
              className="absolute inset-0 w-full h-full"
            >
              <img
                src={HERO_SLIDES[currentSlide].image}
                alt={HERO_SLIDES[currentSlide].title}
                className="w-full h-full object-cover object-center"
              />

              {/* Overlay Content */}
              <div className="absolute inset-0 bg-gradient-to-r from-slate-900/40 via-transparent to-transparent flex flex-col justify-center p-6 sm:p-10 pointer-events-none">
                <div className="max-w-md space-y-2 text-white drop-shadow-md">
                  <div className="flex items-center gap-2">
                    <span className="text-xl sm:text-2xl font-black text-brand-primary bg-white px-2 py-0.5 rounded-md italic">
                      {HERO_SLIDES[currentSlide].brand}
                    </span>
                    <span className="text-2xl sm:text-4xl font-black tracking-tight text-white">
                      {HERO_SLIDES[currentSlide].title}
                    </span>
                  </div>
                  <div className="inline-block bg-brand-primary text-white text-xs sm:text-sm font-black px-3 py-1 rounded-full">
                    {HERO_SLIDES[currentSlide].discount}
                  </div>
                  <p className="text-xs sm:text-sm font-bold text-slate-100">
                    {HERO_SLIDES[currentSlide].time}
                  </p>

                  <div className="pt-2 flex flex-wrap items-center gap-2 text-[11px] font-extrabold">
                    <span className="bg-brand-primary text-white px-2.5 py-1 rounded-md">
                      {HERO_SLIDES[currentSlide].prepayment}
                    </span>
                    <span className="bg-brand-lightest text-brand-dark px-2.5 py-1 rounded-md uppercase">
                      {HERO_SLIDES[currentSlide].delivery}
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Left Arrow Button */}
          <button
            onClick={prevSlide}
            className="absolute left-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/70 hover:bg-white text-slate-800 shadow-md flex items-center justify-center transition-all cursor-pointer z-10"
            aria-label="Previous Slide"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          {/* Right Arrow Button */}
          <button
            onClick={nextSlide}
            className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/70 hover:bg-white text-slate-800 shadow-md flex items-center justify-center transition-all cursor-pointer z-10"
            aria-label="Next Slide"
          >
            <ChevronRight className="w-5 h-5" />
          </button>

          {/* Bottom Pagination Dots */}
          <div className="absolute bottom-3 inset-x-0 flex items-center justify-center gap-1.5 z-10">
            {HERO_SLIDES.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentSlide(idx)}
                className={`h-2 rounded-full transition-all cursor-pointer ${
                  currentSlide === idx ? 'w-5 bg-brand-primary' : 'w-2 bg-white/70 hover:bg-white'
                }`}
                aria-label={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>

          <span className="absolute bottom-2 right-4 text-[9px] font-bold text-slate-600/80 z-10">
            *T&Cs Apply
          </span>
        </div>

        {/* Right App Download Promo Card */}
        <div className="lg:col-span-3 rounded-2xl overflow-hidden bg-gradient-to-b from-brand-lightest via-brand-light/30 to-brand-primary/20 p-5 flex flex-col justify-between shadow-xs border border-brand-light/40 relative">
          {/* Card Top */}
          <div className="space-y-3">
            <div className="bg-brand-dark text-white p-4 rounded-2xl shadow-md text-center relative overflow-hidden">
              <div className="absolute -top-3 -right-3 w-12 h-12 bg-brand-light rounded-full blur-md opacity-40"></div>
              <p className="text-xs font-bold text-brand-lightest uppercase tracking-wider">Download the App &</p>
              <h3 className="text-xl sm:text-2xl font-black leading-tight text-white mt-0.5">
                GET ৳250 OFF
              </h3>
              <p className="text-[11px] font-medium text-brand-lightest mt-0.5">on your first order!</p>
            </div>
          </div>

          {/* QR Code & Store Links Container */}
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
                  Scan the QR code & get it now!
                </p>
              </div>
            </div>

            {/* Store Buttons */}
            <div className="flex items-center gap-2 pt-1">
              <Link
                href="#"
                className="flex-1 bg-brand-dark hover:bg-brand-dark-hover text-white rounded-lg p-2 flex items-center justify-center gap-1.5 transition-colors"
              >
                <Apple className="w-4 h-4 fill-white" />
                <div className="text-left leading-none">
                  <span className="text-[8px] block text-brand-lightest/80 font-medium">Available on the</span>
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