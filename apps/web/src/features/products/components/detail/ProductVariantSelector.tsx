'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';
import { ColorVariant, OptionVariant } from '@/lib/products-data';

interface ProductVariantSelectorProps {
  colorVariants?: ColorVariant[];
  selectedColorId?: string;
  onSelectColor: (color: ColorVariant) => void;

  versionVariants?: OptionVariant[];
  selectedVersionId?: string;
  onSelectVersion: (version: OptionVariant) => void;
}

export function ProductVariantSelector({
  colorVariants,
  selectedColorId,
  onSelectColor,
  versionVariants,
  selectedVersionId,
  onSelectVersion,
}: ProductVariantSelectorProps) {
  return (
    <div className="space-y-4 pt-1">
      {/* Color Selection */}
      {colorVariants && colorVariants.length > 0 && (
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-brand-dark uppercase tracking-wider">
              Color Family:{' '}
              <span className="font-extrabold text-brand-primary">
                {colorVariants.find((c) => c.id === selectedColorId)?.name || colorVariants[0].name}
              </span>
            </span>
            <span className="text-slate-500 font-medium">{colorVariants.length} options available</span>
          </div>

          <div className="flex flex-wrap gap-2.5">
            {colorVariants.map((color) => {
              const isSelected = color.id === selectedColorId;
              return (
                <button
                  key={color.id}
                  onClick={() => onSelectColor(color)}
                  className={`relative flex items-center gap-2.5 px-3.5 py-2 rounded-2xl border text-xs font-bold transition-all cursor-pointer bg-white ${
                    isSelected
                      ? 'border-brand-primary ring-2 ring-brand-primary/20 shadow-sm text-slate-900'
                      : 'border-slate-200 text-slate-600 hover:border-slate-300'
                  }`}
                >
                  <span
                    className="w-4 h-4 rounded-full border border-slate-300 shadow-2xs shrink-0 flex items-center justify-center"
                    style={{ backgroundColor: color.hex }}
                  >
                    {isSelected && <Check className="w-2.5 h-2.5 text-white drop-shadow-sm" />}
                  </span>

                  <span>{color.name}</span>

                  {isSelected && (
                    <motion.div
                      layoutId="colorActivePill"
                      className="absolute inset-0 rounded-2xl border-2 border-brand-primary pointer-events-none"
                      transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                    />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Version / Storage / Edition Variants */}
      {versionVariants && versionVariants.length > 0 && (
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-brand-dark uppercase tracking-wider">
              Edition / Package:{' '}
              <span className="font-extrabold text-brand-primary">
                {versionVariants.find((v) => v.id === selectedVersionId)?.name || versionVariants[0].name}
              </span>
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {versionVariants.map((version) => {
              const isSelected = version.id === selectedVersionId;
              return (
                <button
                  key={version.id}
                  onClick={() => onSelectVersion(version)}
                  className={`relative p-3 rounded-2xl border text-left transition-all cursor-pointer bg-white flex items-center justify-between gap-2 ${
                    isSelected
                      ? 'border-brand-primary ring-2 ring-brand-primary/20 shadow-sm'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="min-w-0">
                    <div className="text-xs font-extrabold text-slate-900 truncate">{version.name}</div>
                    <div className="text-[11px] text-slate-500 font-normal">
                      {version.priceDelta === 0 ? 'Standard Price' : `+৳${version.priceDelta.toLocaleString()} extra`}
                    </div>
                  </div>

                  <div
                    className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 ${
                      isSelected ? 'bg-brand-primary border-brand-primary text-white' : 'border-slate-300 bg-slate-50'
                    }`}
                  >
                    {isSelected && <Check className="w-3 h-3" />}
                  </div>

                  {isSelected && (
                    <motion.div
                      layoutId="versionActivePill"
                      className="absolute inset-0 rounded-2xl border-2 border-brand-primary pointer-events-none"
                      transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                    />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
