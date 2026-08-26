'use client';

import React from 'react';
import { Flame } from 'lucide-react';

export const FlashDealWidget: React.FC = () => {
  return (
    <div className="bg-gradient-to-r from-brand-accent to-orange-500 text-white rounded-2xl p-4 shadow-md flex items-center justify-between">
      <div className="flex items-center space-x-2">
        <Flame className="w-5 h-5 animate-pulse" />
        <div>
          <h4 className="text-xs font-black uppercase tracking-wider">LIVE FLASH SALE ACTIVE</h4>
          <p className="text-[10px] text-white/90">Up to 50% discount on 100+ tech gadgets</p>
        </div>
      </div>

      <a
        href="#flash-sale"
        className="px-3.5 py-1.5 rounded-xl bg-white text-brand-primary text-xs font-bold hover:bg-brand-primary hover:text-white transition-all shadow-sm"
      >
        View Deals
      </a>
    </div>
  );
};
