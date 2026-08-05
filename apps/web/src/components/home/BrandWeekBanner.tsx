'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

export const BrandWeekBanner: React.FC = () => {
  return (
    <section className="py-3 font-sans" aria-label="Brand Week Promotion">
      <div className="max-w-[1536px] mx-auto px-4 sm:px-6">
        <Link
          href="/search?campaign=brand-week"
          className="block relative w-full h-[300px] overflow-hidden rounded-2xl shadow-xs group cursor-pointer focus:outline-none focus:ring-2 focus:ring-teal-500"
          aria-label="Shop Brand Week Deals - Up to 56% Off on Home Appliances with Free Delivery"
        >
          <Image
            src="/banners/brand_week_appliances.jpg"
            alt="Sellora Brand Week - Up to 56% off on home appliances with free delivery and pre-payment savings"
            fill
            priority
            sizes="(max-width: 1536px) 100vw, 1536px"
            className="object-fill object-center group-hover:scale-[1.01] transition-transform duration-300 ease-in-out"
          />
        </Link>
      </div>
    </section>
  );
};