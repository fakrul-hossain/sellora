'use client';

import React from 'react';
import { ChevronRight, Laptop, Smartphone, Watch, Headphones, Gamepad2, Tv, ShieldCheck } from 'lucide-react';

interface MegaMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MegaMenu: React.FC<MegaMenuProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const categories = [
    {
      title: 'Mobiles & Tablets',
      icon: Smartphone,
      links: ['Apple iPhone', 'Samsung Galaxy', 'Xiaomi / Redmi', 'Realme', 'OnePlus', 'Tablets & iPads'],
    },
    {
      title: 'Laptops & Computers',
      icon: Laptop,
      links: ['Apple MacBook', 'Gaming Laptops', 'Ultrabooks', 'Desktop PCs', 'Monitors', 'PC Components'],
    },
    {
      title: 'Smart Wearables',
      icon: Watch,
      links: ['Apple Watch', 'Samsung Galaxy Watch', 'Amazfit', 'Haylou', 'Smart Bands', 'Kids Smart Watch'],
    },
    {
      title: 'Audio & Acoustics',
      icon: Headphones,
      links: ['AirPods', 'Bluetooth Headphones', 'TWS Earbuds', 'Soundbars', 'Portable Speakers', 'Microphones'],
    },
    {
      title: 'Gaming & Accessories',
      icon: Gamepad2,
      links: ['PlayStation 5', 'Nintendo Switch', 'Gaming Mice', 'Mechanical Keyboards', 'Power Banks', 'Fast Chargers'],
    },
    {
      title: 'TV & Home Appliances',
      icon: Tv,
      links: ['Smart LED TVs', 'Android TV Boxes', 'Air Conditioners', 'Washing Machines', 'Refrigerators', 'Robot Vacuums'],
    },
  ];

  return (
    <div
      onMouseLeave={onClose}
      className="absolute top-full left-0 right-0 bg-white/95 backdrop-blur-xl border-b border-slate-200 shadow-2xl z-40 py-8 px-6 transition-all"
    >
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-6">
        {categories.map((cat) => (
          <div key={cat.title} className="space-y-3">
            <div className="flex items-center space-x-2 font-bold text-xs text-brand-primary border-b border-slate-100 pb-2">
              <cat.icon className="w-4 h-4 text-brand-accent shrink-0" />
              <span className="truncate">{cat.title}</span>
            </div>
            <ul className="space-y-1.5 text-xs text-slate-500 font-medium">
              {cat.links.map((link) => (
                <li key={link}>
                  <a href="#category" onClick={onClose} className="hover:text-brand-accent transition-colors block py-0.5">
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
};
