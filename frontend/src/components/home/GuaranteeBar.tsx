'use client';

import React from 'react';
import { DollarSign, Award, CreditCard, Truck } from 'lucide-react';

export const GuaranteeBar: React.FC = () => {
  const guarantees = [
    {
      title: 'Competitive Price',
      subtitle: 'Get The Best Prices Everyday',
      icon: DollarSign,
    },
    {
      title: 'Authentic Products',
      subtitle: 'Secured with Brand Warranty',
      icon: Award,
    },
    {
      title: 'Easy & Secured Payment',
      subtitle: 'Pre-payment, Cash on Delivery',
      icon: CreditCard,
    },
    {
      title: 'Fast Delivery',
      subtitle: 'Rapid delivery At Your Doorstep',
      icon: Truck,
    },
  ];

  return (
    <section className="py-2 my-2 font-sans">
      <div className="max-w-[1536px] mx-auto px-4 sm:px-6">
        <div className="bg-white rounded-2xl shadow-2xs border border-slate-200/80 py-3 px-3 sm:py-3.5 sm:px-4 grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-4">
          {guarantees.map((g, idx) => {
            const Icon = g.icon;
            return (
              <div
                key={idx}
                className="flex items-center gap-2 sm:gap-3.5 p-1 sm:p-0"
              >
                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-brand-primary text-white flex items-center justify-center shrink-0 shadow-xs">
                  <Icon className="w-4 h-4 sm:w-5 sm:h-5" />
                </div>
                <div className="min-w-0">
                  <h4 className="text-[11px] sm:text-sm font-black text-slate-900 leading-tight truncate">
                    {g.title}
                  </h4>
                  <p className="text-[10px] sm:text-[11px] text-slate-500 font-medium leading-tight mt-0.5 truncate hidden sm:block">
                    {g.subtitle}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

