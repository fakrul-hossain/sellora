'use client';

import React from 'react';

interface LoadingSkeletonProps {
  type?: 'grid' | 'carousel' | 'banner' | 'category';
  count?: number;
}

export const LoadingSkeleton: React.FC<LoadingSkeletonProps> = ({ type = 'grid', count = 4 }) => {
  return (
    <div
      className={`grid gap-4 animate-pulse ${
        type === 'grid' || type === 'carousel'
          ? 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-5'
          : type === 'category'
          ? 'grid-cols-3 sm:grid-cols-6 lg:grid-cols-12'
          : 'grid-cols-1 md:grid-cols-2'
      }`}
    >
      {[...Array(count)].map((_, i) => (
        <div key={i} className="bg-slate-200/80 rounded-2xl p-4 space-y-3">
          <div className="bg-slate-300/80 aspect-square w-full rounded-xl" />
          <div className="h-3 bg-slate-300/80 rounded w-3/4" />
          <div className="h-3 bg-slate-300/80 rounded w-1/2" />
        </div>
      ))}
    </div>
  );
};
