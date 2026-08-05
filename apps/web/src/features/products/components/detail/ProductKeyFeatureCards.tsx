'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Bluetooth, BatteryCharging, Zap, Droplets, Mic, Shield, Sparkles } from 'lucide-react';
import { KeyFeatureCardItem } from '@/lib/products-data';

interface ProductKeyFeatureCardsProps {
  features?: KeyFeatureCardItem[];
}

export function ProductKeyFeatureCards({ features }: ProductKeyFeatureCardsProps) {
  if (!features || features.length === 0) return null;

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'bluetooth':
        return Bluetooth;
      case 'battery':
        return BatteryCharging;
      case 'zap':
        return Zap;
      case 'water':
        return Droplets;
      case 'sound':
        return Mic;
      case 'shield':
      default:
        return Shield;
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
          <Sparkles className="w-4 h-4 text-amber-500" />
          Key Feature Highlights
        </h3>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {features.map((feat, idx) => {
          const Icon = getIcon(feat.iconName);
          return (
            <motion.div
              key={idx}
              whileHover={{ y: -3 }}
              className="p-3.5 rounded-2xl bg-white border border-slate-200/90 shadow-2xs flex flex-col items-center text-center gap-2 transition-all hover:border-brand-primary/40 hover:shadow-xs group"
            >
              <div className="w-10 h-10 rounded-2xl bg-brand-lightest text-brand-primary border border-brand-light flex items-center justify-center group-hover:bg-brand-primary group-hover:text-white transition-colors shadow-2xs">
                <Icon className="w-5 h-5" />
              </div>
              <div>
                <h5 className="text-xs font-black text-slate-900 leading-tight">{feat.title}</h5>
                <p className="text-[10px] text-slate-500 font-medium leading-tight mt-0.5">{feat.subtitle}</p>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
