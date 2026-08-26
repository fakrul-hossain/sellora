'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, Wallet, Truck, Landmark, Gift, RefreshCcw, Ticket, Check, Copy } from 'lucide-react';

export function ProductOffersDeck() {
  const [copiedCoupon, setCopiedCoupon] = useState(false);

  const handleCopyCoupon = () => {
    navigator.clipboard.writeText('SELLORA100');
    setCopiedCoupon(true);
    setTimeout(() => setCopiedCoupon(false), 2000);
  };

  const offers = [
    {
      id: 'warranty',
      icon: ShieldCheck,
      iconBg: 'bg-emerald-50 text-emerald-600 border-emerald-200',
      title: '1 Year Official Warranty',
      desc: '100% Brand Authentic with instant unit replacement guarantee.',
      badge: 'Official',
    },
    {
      id: 'cashback',
      icon: Wallet,
      iconBg: 'bg-brand-lightest text-brand-primary border-brand-light',
      title: '5% bKash Cashback',
      desc: 'Instant cashback up to ৳200 on mobile banking checkout.',
      badge: 'Cashback',
    },
    {
      id: 'delivery',
      icon: Truck,
      iconBg: 'bg-sky-50 text-sky-600 border-sky-200',
      title: 'Free Express Shipping',
      desc: 'Free 24-hour express delivery inside Dhaka city.',
      badge: 'Free Delivery',
    },
    {
      id: 'bank',
      icon: Landmark,
      iconBg: 'bg-indigo-50 text-indigo-600 border-indigo-200',
      title: 'Bank EMI & Card Discount',
      desc: 'Extra 10% instant discount with City Bank & EBL credit cards.',
      badge: '0% Interest',
    },
    {
      id: 'exchange',
      icon: RefreshCcw,
      iconBg: 'bg-amber-50 text-amber-600 border-amber-200',
      title: 'Trade-In / Exchange Offer',
      desc: 'Exchange old tech accessories and get up to ৳500 extra discount.',
      badge: 'Exchange',
    },
    {
      id: 'gift',
      icon: Gift,
      iconBg: 'bg-purple-50 text-purple-600 border-purple-200',
      title: 'Free Hard EVA Travel Case',
      desc: 'Complimentary protective carry case with every order today.',
      badge: 'Free Gift',
    },
  ];

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-xs font-black text-brand-dark uppercase tracking-wider flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-brand-primary" />
          Available Offers & Perks
        </h3>
        <span className="text-xs text-slate-500 font-medium">Applied automatically at checkout</span>
      </div>

      {/* Coupon Banner */}
      <div className="rounded-2xl bg-brand-lightest/40 border border-brand-light/50 p-3.5 flex items-center justify-between gap-3 shadow-2xs">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-brand-primary text-white flex items-center justify-center shrink-0 shadow-sm">
            <Ticket className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-black text-brand-dark">EXTRA ৳100 OFF COUPON</span>
              <span className="bg-brand-primary/10 text-brand-primary text-[10px] font-bold px-2 py-0.5 rounded">Voucher</span>
            </div>
            <p className="text-[11px] text-slate-600 font-medium">Use code <span className="font-extrabold text-brand-dark">SELLORA100</span> on cart page</p>
          </div>
        </div>

        <button
          onClick={handleCopyCoupon}
          className={`px-3 py-1.5 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer border ${
            copiedCoupon
              ? 'bg-brand-primary text-white border-brand-primary shadow-sm'
              : 'bg-white text-slate-800 hover:text-brand-primary border-slate-300 hover:border-brand-light shadow-2xs'
          }`}
        >
          {copiedCoupon ? (
            <>
              <Check className="w-3.5 h-3.5 ml-0.5" />
              <span>Copied!</span>
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5" />
              <span>Copy Code</span>
            </>
          )}
        </button>
      </div>

      {/* Offers Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
        {offers.map((offer) => {
          const Icon = offer.icon;
          return (
            <motion.div
              key={offer.id}
              whileHover={{ y: -2 }}
              className="p-3.5 rounded-2xl bg-white border border-slate-200/80 shadow-2xs flex items-start gap-3 transition-all hover:border-slate-300 hover:shadow-xs"
            >
              <div className={`w-9 h-9 rounded-xl border flex items-center justify-center shrink-0 ${offer.iconBg}`}>
                <Icon className="w-4 h-4" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-1">
                  <h4 className="text-xs font-bold text-slate-900 truncate">{offer.title}</h4>
                  <span className="text-[9px] font-extrabold px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 shrink-0">
                    {offer.badge}
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 leading-snug mt-0.5 line-clamp-2 font-normal">
                  {offer.desc}
                </p>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
