'use client';

import React from 'react';
import { HelpCircle, Phone, Mail, RotateCcw, Truck, ShieldCheck } from 'lucide-react';

export default function HelpCenterPage() {
  return (
    <div className="min-h-screen bg-[#FAFAFA] flex flex-col justify-between font-sans text-slate-800">
      <main className="flex-1 py-10">
        <div className="max-w-[1536px] mx-auto px-4 space-y-10">
          <div className="text-center max-w-xl mx-auto space-y-2">
            <h1 className="text-3xl font-black text-brand-dark">Sellora Help Center & Support</h1>
            <p className="text-xs text-slate-500">Everything you need to know about shopping, delivery, warranty, and returns.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-2xs space-y-3">
              <Truck className="w-8 h-8 text-brand-primary" />
              <h3 className="text-sm font-extrabold text-slate-900">Order Delivery</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Standard delivery takes 24 hours inside Dhaka and 48-72 hours across all other districts in Bangladesh.
              </p>
            </div>

            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-2xs space-y-3">
              <RotateCcw className="w-8 h-8 text-brand-primary" />
              <h3 className="text-sm font-extrabold text-slate-900">7-Day Easy Returns</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                If your product is damaged or wrong item, return it within 7 days for a 100% full refund or replacement.
              </p>
            </div>

            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-2xs space-y-3">
              <ShieldCheck className="w-8 h-8 text-brand-primary" />
              <h3 className="text-sm font-extrabold text-slate-900">Official Brand Warranty</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                All electronic items sold on Sellora come with official brand warranty cards honored nationwide.
              </p>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}
