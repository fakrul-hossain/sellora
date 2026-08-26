'use client';

import React, { useState } from 'react';
import { CreditCard, Landmark, ShieldCheck, X, Check } from 'lucide-react';

interface EMICalculatorModalProps {
  productTitle: string;
  price: number;
  isOpen: boolean;
  onClose: () => void;
}

const BD_BANKS = [
  { id: 'city', name: 'City Bank Amex', tenure: [3, 6, 9, 12], interest: '0% Interest' },
  { id: 'ebl', name: 'Eastern Bank Ltd (EBL)', tenure: [3, 6, 12], interest: '0% Interest' },
  { id: 'brac', name: 'BRAC Bank Credit Card', tenure: [3, 6, 12, 18], interest: '0% Interest' },
  { id: 'scb', name: 'Standard Chartered Bank', tenure: [6, 12, 24], interest: '0% Interest' },
  { id: 'dbbl', name: 'Dutch-Bangla Bank (DBBL)', tenure: [3, 6, 12], interest: '0% Interest' },
  { id: 'prime', name: 'Prime Bank Ltd', tenure: [3, 6, 12], interest: '0% Interest' },
];

export function EMICalculatorModal({ productTitle, price, isOpen, onClose }: EMICalculatorModalProps) {
  const [selectedBank, setSelectedBank] = useState(BD_BANKS[0]);
  const [selectedTenure, setSelectedTenure] = useState(12);

  if (!isOpen) return null;

  const monthlyInstallment = Math.round(price / selectedTenure);

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-xl w-full space-y-6 shadow-2xl relative border border-slate-200">
        <button
          onClick={onClose}
          className="absolute top-6 right-6 p-2 rounded-full hover:bg-slate-100 text-slate-500 hover:text-slate-800 transition-all cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="space-y-1">
          <div className="flex items-center gap-2 text-brand-primary text-xs font-black uppercase tracking-wider">
            <CreditCard className="w-4 h-4" />
            <span>0% Interest EMI Calculator</span>
          </div>
          <h3 className="text-base sm:text-lg font-black text-slate-900 line-clamp-1">{productTitle}</h3>
          <p className="text-xs text-slate-500 font-bold">Total Price: ৳{price.toLocaleString()}</p>
        </div>

        {/* Bank Selection */}
        <div className="space-y-2">
          <label className="text-xs font-black text-slate-800 uppercase tracking-wider block">1. Select Bank:</label>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {BD_BANKS.map((bank) => (
              <button
                key={bank.id}
                onClick={() => {
                  setSelectedBank(bank);
                  if (!bank.tenure.includes(selectedTenure)) {
                    setSelectedTenure(bank.tenure[0]);
                  }
                }}
                className={`p-3 rounded-2xl border text-xs font-bold text-left transition-all cursor-pointer ${
                  selectedBank.id === bank.id
                    ? 'border-brand-primary bg-brand-lightest/60 text-brand-primary ring-2 ring-brand-primary/20'
                    : 'border-slate-200 hover:border-slate-300 text-slate-700 bg-white'
                }`}
              >
                <Landmark className="w-4 h-4 mb-1 text-slate-500" />
                <div className="truncate">{bank.name}</div>
                <div className="text-[10px] text-brand-primary font-extrabold">{bank.interest}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Tenure Selection */}
        <div className="space-y-2">
          <label className="text-xs font-black text-slate-800 uppercase tracking-wider block">2. Select Duration (Months):</label>
          <div className="flex flex-wrap gap-2">
            {selectedBank.tenure.map((t) => (
              <button
                key={t}
                onClick={() => setSelectedTenure(t)}
                className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
                  selectedTenure === t
                    ? 'bg-brand-dark text-white shadow-sm'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {t} Months
              </button>
            ))}
          </div>
        </div>

        {/* Calculation Result */}
        <div className="p-5 rounded-2xl bg-brand-dark text-white space-y-2">
          <div className="flex items-center justify-between text-xs text-brand-lightest/80 font-medium">
            <span>Estimated Monthly Installment:</span>
            <span className="text-brand-light font-bold">0% Interest Fee</span>
          </div>
          <div className="text-3xl font-black text-white">৳{monthlyInstallment.toLocaleString()} / month</div>
          <p className="text-[11px] text-brand-lightest/70 font-medium">
            {selectedTenure} equal monthly installments of ৳{monthlyInstallment.toLocaleString()} charged to your {selectedBank.name}.
          </p>
        </div>

        <div className="flex justify-end gap-2">
          <button
            onClick={onClose}
            className="w-full py-3 rounded-2xl bg-brand-primary text-white font-extrabold text-xs hover:bg-brand-primary-hover transition-all cursor-pointer shadow-sm"
          >
            Apply EMI at Checkout
          </button>
        </div>
      </div>
    </div>
  );
}
