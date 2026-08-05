'use client';

import React, { useState } from 'react';
import { Mail, Check, Sparkles, ShieldCheck, Ticket } from 'lucide-react';

export function LuxuryNewsletterCard() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setTimeout(() => setSubscribed(false), 4000);
      setEmail('');
    }
  };

  return (
    <section className="py-10 bg-white">
      <div className="max-w-[1536px] mx-auto px-4 sm:px-6">
        <div className="rounded-3xl bg-brand-dark p-8 sm:p-12 text-white shadow-2xl relative overflow-hidden border border-brand-dark/20">
          <div className="absolute top-0 right-0 w-96 h-96 bg-brand-primary/10 rounded-full blur-3xl pointer-events-none" />

          <div className="max-w-2xl mx-auto text-center space-y-6 relative z-10">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-primary text-white text-xs font-black uppercase tracking-wider">
              <Ticket className="w-3.5 h-3.5" /> VIP TECH CLUB
            </div>

            <div className="space-y-2">
              <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
                Unlock Instant ৳500 Discount Voucher
              </h2>
              <p className="text-xs sm:text-sm text-brand-lightest/90 font-medium">
                Subscribe to SELLORA Insider to receive exclusive flash sale drops, secret coupon codes, and priority tech product launches.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row items-center gap-3 max-w-md mx-auto">
              <div className="relative w-full">
                <Mail className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email address..."
                  className="w-full pl-11 pr-4 py-3.5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 text-xs font-medium text-white placeholder:text-slate-400 focus:outline-none focus:border-brand-primary"
                />
              </div>

              <button
                type="submit"
                className={`w-full sm:w-auto px-6 py-3.5 rounded-2xl font-black text-xs transition-all shadow-md cursor-pointer shrink-0 ${
                  subscribed ? 'bg-brand-primary text-white' : 'bg-brand-primary hover:bg-brand-primary-hover text-white'
                }`}
              >
                {subscribed ? (
                  <span className="flex items-center gap-1.5 justify-center">
                    <Check className="w-4 h-4" /> Code Sent!
                  </span>
                ) : (
                  <span>Claim ৳500 Voucher</span>
                )}
              </button>
            </form>

            <div className="flex items-center justify-center gap-2 text-[11px] text-brand-lightest/70 font-medium pt-2">
              <ShieldCheck className="w-3.5 h-3.5 text-brand-light" />
              <span>We respect your privacy. Unsubscribe anytime with 1-click.</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
