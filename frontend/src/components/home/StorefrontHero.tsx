'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Apple, Play } from 'lucide-react';
import Link from 'next/link';
import { useSiteSettings } from '@/hooks/use-site-settings';
import Image from 'next/image';

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
                className={`h-1.5 sm:h-2 rounded-full transition-all cursor-pointer ${currentSlide === idx ? 'w-5 sm:w-6 bg-brand-primary' : 'w-1.5 sm:w-2 bg-white/80 hover:bg-white'
                  }`}
                aria-label={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>
        </div>


        {/* Right App Download Promo Card (Desktop Only) */}
        <div className="hidden lg:flex lg:col-span-3 rounded-2xl overflow-hidden shadow-xs border border-brand-light/40 relative w-full min-h-[420px]">
          <Image
            src="https://i.ibb.co.com/39q4C3MH/desktopsidebar.avif"
            alt="Download App Promo"
            fill
            sizes="(min-width: 1024px) 25vw, 100vw"
            className="object-cover"
            priority
          />
        </div>

      </div>
    </section>
  );
}