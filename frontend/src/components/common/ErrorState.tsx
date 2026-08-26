'use client';

import React from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';

interface ErrorStateProps {
  message?: string;
  onRetry?: () => void;
}

export const ErrorState: React.FC<ErrorStateProps> = ({
  message = 'Unable to load section data at this time.',
  onRetry,
}) => {
  return (
    <div className="py-8 px-4 rounded-2xl bg-red-50/80 border border-red-100 flex items-center justify-between text-xs text-red-700">
      <div className="flex items-center space-x-2.5">
        <AlertCircle className="w-4 h-4 text-red-500 shrink-0" />
        <span className="font-medium">{message}</span>
      </div>
      {onRetry && (
        <button
          onClick={onRetry}
          className="flex items-center space-x-1 px-3 py-1.5 rounded-lg bg-red-600 text-white font-bold hover:bg-red-700 transition-colors shadow-sm shrink-0"
        >
          <RefreshCw className="w-3 h-3" />
          <span>Retry</span>
        </button>
      )}
    </div>
  );
};
