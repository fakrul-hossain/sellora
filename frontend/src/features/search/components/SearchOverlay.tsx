'use client';

import React from 'react';
import { Search, TrendingUp, Clock, Tag, X, ChevronRight } from 'lucide-react';
import { platformConfig } from '@/config/platform.config';

interface SearchOverlayProps {
  query: string;
  isOpen: boolean;
  onClose: () => void;
  onSelectKeyword: (keyword: string) => void;
}

export const SearchOverlay: React.FC<SearchOverlayProps> = ({
  query,
  isOpen,
  onClose,
  onSelectKeyword,
}) => {
  if (!isOpen) return null;

  return (
    <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-3xl border border-slate-200 shadow-2xl z-50 overflow-hidden max-h-[480px] overflow-y-auto">
      <div className="p-5 space-y-5">
        
        {/* Popular Trending Keywords */}
        <div>
          <div className="flex items-center space-x-1.5 text-xs font-bold text-slate-400 uppercase tracking-wider mb-2.5">
            <TrendingUp className="w-3.5 h-3.5 text-brand-accent" />
            <span>Popular Tech Searches</span>
          </div>

          <div className="flex flex-wrap gap-2">
            {platformConfig.popularSearchKeywords.map((kw) => (
              <button
                key={kw}
                onClick={() => {
                  onSelectKeyword(kw);
                  onClose();
                }}
                className="px-3 py-1.5 rounded-xl bg-slate-100/80 hover:bg-brand-accent hover:text-white text-slate-700 text-xs font-semibold transition-all flex items-center space-x-1"
              >
                <span>{kw}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Categories Quick Jump */}
        <div className="pt-3 border-t border-slate-100">
          <div className="flex items-center space-x-1.5 text-xs font-bold text-slate-400 uppercase tracking-wider mb-2.5">
            <Tag className="w-3.5 h-3.5 text-brand-primary" />
            <span>Top Categories</span>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs">
            {['Mobile Phones', 'Laptops & Computers', 'Smart Watches', 'Audio & Headphones', 'Gaming Accessories', 'Home Appliances'].map((cat) => (
              <a
                key={cat}
                href="#category"
                onClick={onClose}
                className="p-2 rounded-xl hover:bg-slate-50 text-slate-700 font-semibold flex items-center justify-between transition-colors"
              >
                <span>{cat}</span>
                <ChevronRight className="w-3.5 h-3.5 text-slate-300" />
              </a>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};
