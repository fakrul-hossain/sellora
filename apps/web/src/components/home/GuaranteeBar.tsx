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
        <div className="bg-white rounded-xl shadow-2xs border border-slate-200/80 py-3.5 px-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 divide-y sm:divide-y-0 sm:divide-x divide-slate-100">
          {guarantees.map((g, idx) => {
            const Icon = g.icon;
            return (
              <div
                key={idx}
                className={`flex items-center gap-3.5 ${
                  idx > 0 ? 'sm:pl-6 pt-3 sm:pt-0' : ''
                }`}
              >
                <div className="w-10 h-10 rounded-xl bg-brand-primary text-white flex items-center justify-center shrink-0 shadow-xs">
                  <Icon className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs sm:text-sm font-extrabold text-slate-900 leading-tight">
                    {g.title}
                  </h4>
                  <p className="text-[11px] text-slate-500 font-medium leading-tight mt-0.5">
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

