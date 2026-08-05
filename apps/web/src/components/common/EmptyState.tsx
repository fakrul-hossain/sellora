'use client';

import React from 'react';
import { PackageOpen } from 'lucide-react';

interface EmptyStateProps {
  title?: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title = 'No Items Available',
  description = 'Check back soon for new arrivals and promotional drops.',
  actionLabel,
  onAction,
}) => {
  return (
    <div className="py-12 px-4 text-center bg-slate-50 rounded-3xl border border-dashed border-slate-200 flex flex-col items-center justify-center space-y-3">
      <div className="w-12 h-12 rounded-full bg-slate-200/80 flex items-center justify-center text-slate-400">
        <PackageOpen className="w-6 h-6" />
      </div>
      <h4 className="text-sm font-bold text-brand-primary">{title}</h4>
      <p className="text-xs text-slate-400 max-w-sm">{description}</p>
      {actionLabel && onAction && (
        <button
          onClick={onAction}
          className="mt-2 px-4 py-2 rounded-xl bg-brand-primary text-white text-xs font-bold hover:bg-brand-dark transition-colors"
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
};
