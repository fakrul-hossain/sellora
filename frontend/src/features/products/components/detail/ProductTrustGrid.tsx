'use client';

import React from 'react';
import { ShieldCheck, Award, Lock, RefreshCw, Truck, CheckCircle } from 'lucide-react';

export function ProductTrustGrid() {
  const trustItems = [
    { icon: ShieldCheck, title: '100% Authentic', desc: 'Guaranteed genuine brand product' },
    { icon: Award, title: 'Official Warranty', desc: 'Full replacement support' },
    { icon: Lock, title: 'Secure Payment', desc: 'SSL & Cash on Delivery' },
    { icon: RefreshCw, title: '7 Days Return', desc: 'Hassle-free easy exchange' },
    { icon: Truck, title: 'Nationwide Delivery', desc: 'Reaches all 64 districts' },
    { icon: CheckCircle, title: 'Verified Seller', desc: 'Authorized store partner' },
  ];

  return (
    <div className="rounded-3xl bg-white border border-slate-200/90 p-5 shadow-2xs">
      <h4 className="text-xs font-black text-slate-900 uppercase tracking-wider mb-4 flex items-center gap-1.5">
        <ShieldCheck className="w-4 h-4 text-emerald-600" />
        Why Shop With Confidence on SELLORA?
      </h4>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {trustItems.map((item, idx) => {
          const Icon = item.icon;
          return (
            <div
              key={idx}
              className="p-3 rounded-2xl bg-slate-50 border border-slate-100 flex flex-col items-center text-center gap-1.5 transition-all hover:bg-slate-100/80"
            >
              <div className="w-8 h-8 rounded-full bg-white text-brand-primary border border-slate-200 flex items-center justify-center shadow-2xs">
                <Icon className="w-4 h-4" />
              </div>
              <span className="text-xs font-extrabold text-slate-900 leading-tight">{item.title}</span>
              <span className="text-[10px] text-slate-500 font-medium leading-tight">{item.desc}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
