'use client';

import React from 'react';
import Link from 'next/link';
import { useSiteSettings } from '@/hooks/use-site-settings';

export const BrandWeekBanner: React.FC = () => {
  const { settings } = useSiteSettings();
  const config = settings?.brandWeekConfig;

  const bgImage = config?.image || 'https://images.unsplash.com/photo-1512499617640-c74ae3a79d37?q=80&w=1200';
  const slug = config?.slug || '/campaigns/brand-week';

  return (
    <section className="py-4 font-sans" aria-label="Brand Week Promotion">
      <div className="max-w-[1536px] mx-auto px-4 sm:px-6">
        <Link
          href={slug}
          className="block relative w-full h-[220px] sm:h-[280px] lg:h-[320px] rounded-3xl overflow-hidden shadow-sm border border-slate-200 group cursor-pointer"
        >
          <img
            src={bgImage}
            alt="Brand Week Promotion Banner"
            className="w-full h-full object-cover object-center group-hover:scale-[1.01] transition-transform duration-500 ease-out"
          />
        </Link>
      </div>
    </section>
  );
};