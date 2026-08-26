'use client';

import React, { useState } from 'react';
import { X, Copy, Check, Share2 } from 'lucide-react';

interface ShareModalProps {
  productTitle: string;
  isOpen: boolean;
  onClose: () => void;
}

export function ShareModal({ productTitle, isOpen, onClose }: ShareModalProps) {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const currentUrl = typeof window !== 'undefined' ? window.location.href : '';

  const handleCopy = () => {
    navigator.clipboard.writeText(currentUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl p-6 max-w-md w-full space-y-5 shadow-2xl relative border border-slate-200">
        <button
          onClick={onClose}
          className="absolute top-6 right-6 p-2 rounded-full hover:bg-slate-100 text-slate-500 hover:text-slate-800 transition-all cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="space-y-1">
          <div className="flex items-center gap-2 text-brand-primary text-xs font-black uppercase tracking-wider">
            <Share2 className="w-4 h-4" />
            <span>Share Product</span>
          </div>
          <h3 className="text-base font-black text-slate-900 line-clamp-1">{productTitle}</h3>
        </div>

        <div className="flex gap-3 overflow-x-auto py-2">
          <button
            onClick={() => window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(productTitle + ' ' + currentUrl)}`, '_blank')}
            className="flex-1 p-3 rounded-2xl bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-extrabold text-xs flex flex-col items-center gap-1 cursor-pointer transition-all border border-emerald-200"
          >
            <span>WhatsApp</span>
          </button>
          <button
            onClick={() => window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(currentUrl)}`, '_blank')}
            className="flex-1 p-3 rounded-2xl bg-blue-50 hover:bg-blue-100 text-blue-700 font-extrabold text-xs flex flex-col items-center gap-1 cursor-pointer transition-all border border-blue-200"
          >
            <span>Facebook</span>
          </button>
        </div>

        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-700 block">Copy Shareable Link:</label>
          <div className="flex gap-2">
            <input
              type="text"
              readOnly
              value={currentUrl}
              className="flex-1 p-3 rounded-xl border border-slate-200 bg-slate-50 text-xs font-medium text-slate-600 outline-none"
            />
            <button
              onClick={handleCopy}
              className={`px-4 py-3 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer ${
                copied ? 'bg-emerald-600 text-white' : 'bg-slate-900 text-white hover:bg-slate-800'
              }`}
            >
              {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              <span>{copied ? 'Copied' : 'Copy'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
