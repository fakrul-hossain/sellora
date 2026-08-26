'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, ChevronLeft, ChevronRight, ShieldCheck } from 'lucide-react';
import { platformConfig } from '@/config/platform.config';

export const HeroSlider: React.FC = () => {
  const slides = [
    {
      id: 1,
      badge: 'OFFICIAL CAMPAIGN 2026',
      title: 'iPhone 15 Pro Max',
      subtitle: 'Titanium design. A17 Pro chip. 0% EMI available up to 12 months.',
      cta: 'Order Now with Warranty',
      imageUrl: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=80',
      bgGradient: 'from-slate-900 via-brand-primary to-slate-900',
    },
    {
      id: 2,
      badge: 'FLASH TECH DEAL',
      title: 'Sony WH-1000XM5',
      subtitle: 'Industry-leading noise canceling headphones with official warranty.',
      cta: 'Shop Acoustic Deals',
      imageUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80',
      bgGradient: 'from-brand-primary via-slate-800 to-brand-primary',
    },
  ];

  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  const slide = slides[current];

  return (
    <div className="relative rounded-3xl overflow-hidden bg-brand-primary text-white aspect-[16/9] sm:aspect-[16/8] shadow-2xl flex items-center">
      <AnimatePresence mode="wait">
        <motion.div
          key={slide.id}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.7 }}
          className={`absolute inset-0 bg-gradient-to-r ${slide.bgGradient} p-8 sm:p-12 flex flex-col justify-between`}
        >
          <div className="space-y-4 max-w-lg z-10">
            <span className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-brand-accent text-white text-[10px] font-black uppercase tracking-wider shadow-sm">
              <ShieldCheck className="w-3 h-3" />
              <span>{slide.badge}</span>
            </span>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight">
              {slide.title}
            </h1>

            <p className="text-xs sm:text-sm text-slate-300 font-normal leading-relaxed">
              {slide.subtitle}
            </p>

            <div className="pt-2">
              <a
                href="#shop"
                className="inline-flex items-center space-x-2 px-6 py-3 rounded-xl bg-brand-accent text-white font-bold text-xs hover:bg-brand-accent/90 transition-all shadow-lg"
              >
                <span>{slide.cta}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

          <div className="absolute right-0 top-0 bottom-0 w-1/2 hidden sm:block opacity-80">
            <img src={slide.imageUrl} alt={slide.title} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-r from-brand-primary via-transparent to-transparent" />
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Slider Controls */}
      <div className="absolute bottom-4 right-4 z-20 flex items-center space-x-2">
        <button
          onClick={() => setCurrent((prev) => (prev === 0 ? slides.length - 1 : prev - 1))}
          className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-md text-white flex items-center justify-center hover:bg-white/40"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
        <button
          onClick={() => setCurrent((prev) => (prev + 1) % slides.length)}
          className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-md text-white flex items-center justify-center hover:bg-white/40"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
