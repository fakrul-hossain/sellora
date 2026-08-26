'use client';

import React from 'react';
import { ShieldCheck, ArrowRight } from 'lucide-react';
import { formatCurrency } from '@/lib/formatters';

export const SideCampaignCards: React.FC = () => {
  const campaigns = [
    {
      title: 'Smart Watch Mega Sale',
      subtitle: 'Up to 35% OFF on Amazfit & Apple Watch',
      price: 4990,
      imageUrl: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=400&q=80',
    },
    {
      title: 'TWS Sound Fest 2026',
      subtitle: 'AirPods & Anker Earbuds starting from',
      price: 1890,
      imageUrl: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&w=400&q=80',
    },
  ];

  return (
    <div className="flex flex-col justify-between gap-4 h-full">
      {campaigns.map((c, idx) => (
        <div
          key={idx}
          className="group relative rounded-2xl bg-white p-4 border border-slate-200/80 hover:border-brand-accent shadow-sm flex items-center justify-between overflow-hidden flex-1"
        >
          <div className="space-y-1.5 z-10 max-w-[60%]">
            <span className="text-[9px] font-black text-brand-accent uppercase tracking-wider bg-brand-accent/10 px-2 py-0.5 rounded">
              SPECIAL CAMPAIGN
            </span>
            <h4 className="text-xs font-bold text-brand-primary line-clamp-1">{c.title}</h4>
            <p className="text-[10px] text-slate-400 line-clamp-1">{c.subtitle}</p>
            <span className="text-xs font-black text-brand-primary block">
              Starts {formatCurrency(c.price)}
            </span>
          </div>

          <div className="w-20 h-20 shrink-0 bg-slate-50 rounded-xl p-1.5 flex items-center justify-center">
            <img src={c.imageUrl} alt={c.title} className="object-contain max-h-full group-hover:scale-105 transition-transform" />
          </div>
        </div>
      ))}
    </div>
  );
};
