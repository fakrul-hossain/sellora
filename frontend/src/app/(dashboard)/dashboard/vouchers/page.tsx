'use client';

import React from 'react';
import { Ticket, Copy, Sparkles } from 'lucide-react';
import { useToast } from '@/components/ui/toast';

export default function VouchersPage() {
  const toast = useToast();

  const vouchers = [
    {
      code: 'WELCOME100',
      discount: '৳100 OFF',
      minSpend: 'On orders above ৳1,000',
      validTill: '31 Dec 2026',
      tag: 'New User Special',
    },
    {
      code: 'TECH2026',
      discount: '15% OFF',
      minSpend: 'On Electronics & Gadgets',
      validTill: '15 Oct 2026',
      tag: 'Tech Fest Offer',
    },
    {
      code: 'FREESHIP',
      discount: 'FREE Express Delivery',
      minSpend: 'On all orders above ৳2,000',
      validTill: '30 Nov 2026',
      tag: 'Limited Campaign',
    },
  ];

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    toast.success(`Coupon code ${code} copied to clipboard!`, 'Voucher Copied');
  };

  return (
    <div className="space-y-6 font-sans text-slate-800">
      <div className="flex items-center justify-between">
        <h1 className="text-xl sm:text-2xl font-black text-slate-900">Voucher Center</h1>
        <span className="text-xs font-bold text-slate-500">3 Available Coupons</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {vouchers.map((v) => (
          <div
            key={v.code}
            className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-2xs space-y-4 relative overflow-hidden flex flex-col justify-between"
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="bg-brand-lightest text-brand-primary text-[10px] font-black px-2.5 py-1 rounded-full border border-brand-light/40 flex items-center gap-1">
                  <Sparkles className="w-3 h-3" />
                  {v.tag}
                </span>
                <span className="text-[10px] font-bold text-slate-400">Valid till {v.validTill}</span>
              </div>

              <div className="text-xl font-black text-brand-dark">{v.discount}</div>
              <p className="text-xs text-slate-500 font-medium">{v.minSpend}</p>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
              <div className="font-mono text-xs font-black bg-slate-100 text-slate-800 px-3 py-1.5 rounded-xl">
                {v.code}
              </div>

              <button
                onClick={() => handleCopyCode(v.code)}
                className="px-4 py-2 rounded-xl bg-brand-primary text-white text-xs font-extrabold hover:bg-brand-primary-hover transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
              >
                <Copy className="w-3.5 h-3.5" />
                <span>Copy Code</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
