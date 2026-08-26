'use client';

import React, { useState } from 'react';
import { MapPin, Truck, Zap, Store, Banknote, ChevronDown, Check } from 'lucide-react';

const BD_LOCATIONS = [
  { id: 'dhaka-dhanmondi', city: 'Dhaka', area: 'Dhanmondi', charge: 60, time: '24 Hours (Tomorrow)' },
  { id: 'dhaka-gulshan', city: 'Dhaka', area: 'Gulshan / Banani', charge: 60, time: '24 Hours (Tomorrow)' },
  { id: 'dhaka-uttara', city: 'Dhaka', area: 'Uttara / Airport', charge: 60, time: '24 Hours (Tomorrow)' },
  { id: 'chattogram', city: 'Chattogram', area: 'GEC / Agrabad', charge: 120, time: '48 - 72 Hours' },
  { id: 'sylhet', city: 'Sylhet', area: 'Zindabazar', charge: 120, time: '48 - 72 Hours' },
  { id: 'khulna', city: 'Khulna', area: 'Boyra / City', charge: 120, time: '48 - 72 Hours' },
  { id: 'rajshahi', city: 'Rajshahi', area: 'Shaheb Bazar', charge: 120, time: '48 - 72 Hours' },
];

export function ProductDeliveryCard() {
  const [selectedLocation, setSelectedLocation] = useState(BD_LOCATIONS[0]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  return (
    <div className="rounded-3xl bg-slate-50 border border-slate-200/90 p-5 space-y-4 shadow-2xs">
      <div className="flex items-center justify-between">
        <h4 className="text-xs font-black text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
          <Truck className="w-4 h-4 text-brand-primary" />
          Delivery & Shipping Details
        </h4>
        <span className="bg-emerald-100 text-emerald-700 text-[10px] font-extrabold px-2 py-0.5 rounded flex items-center gap-1">
          <Banknote className="w-3 h-3" />
          Cash on Delivery Available
        </span>
      </div>

      {/* Location Selector */}
      <div className="relative">
        <label className="block text-[11px] font-bold text-slate-600 mb-1">Deliver To:</label>
        <button
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          className="w-full p-3 rounded-2xl bg-white border border-slate-200 hover:border-slate-300 flex items-center justify-between gap-2 text-xs font-bold text-slate-800 shadow-2xs cursor-pointer"
        >
          <div className="flex items-center gap-2 truncate">
            <MapPin className="w-4 h-4 text-brand-primary shrink-0" />
            <span className="truncate">
              {selectedLocation.city} - {selectedLocation.area}
            </span>
          </div>
          <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
        </button>

        {isDropdownOpen && (
          <div className="absolute top-full left-0 right-0 mt-1 z-30 bg-white rounded-2xl border border-slate-200 shadow-xl max-h-56 overflow-y-auto p-1.5 space-y-1">
            {BD_LOCATIONS.map((loc) => (
              <button
                key={loc.id}
                onClick={() => {
                  setSelectedLocation(loc);
                  setIsDropdownOpen(false);
                }}
                className={`w-full text-left px-3 py-2 rounded-xl text-xs flex items-center justify-between cursor-pointer ${
                  selectedLocation.id === loc.id ? 'bg-brand-lightest text-brand-primary font-extrabold' : 'hover:bg-slate-50 text-slate-700 font-medium'
                }`}
              >
                <span>{loc.city} ({loc.area})</span>
                {selectedLocation.id === loc.id && <Check className="w-4 h-4 text-brand-primary" />}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Delivery Timelines & Options */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
        {/* Standard Home Delivery */}
        <div className="p-3 rounded-2xl bg-white border border-slate-200/80 flex items-start gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center shrink-0 mt-0.5">
            <Truck className="w-4 h-4" />
          </div>
          <div>
            <div className="font-extrabold text-slate-900 flex items-center gap-1.5">
              <span>Home Delivery</span>
              <span className="font-black text-brand-primary">৳{selectedLocation.charge}</span>
            </div>
            <p className="text-[11px] text-slate-500 font-medium mt-0.5">Est. {selectedLocation.time}</p>
          </div>
        </div>

        {/* Express Same-Day Delivery */}
        <div className="p-3 rounded-2xl bg-brand-lightest/50 border border-brand-light/50 flex items-start gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-brand-primary text-white flex items-center justify-center shrink-0 mt-0.5 shadow-2xs">
            <Zap className="w-4 h-4" />
          </div>
          <div>
            <div className="font-extrabold text-slate-900 flex items-center gap-1">
              <span>Express Delivery</span>
              <span className="bg-brand-primary text-white text-[9px] font-black px-1.5 py-0.2 rounded">Fast</span>
            </div>
            <p className="text-[11px] text-slate-600 font-medium mt-0.5">Order before 2 PM for Same Day</p>
          </div>
        </div>
      </div>

      {/* Store Pickup Callout */}
      <div className="p-3 rounded-2xl bg-white border border-slate-200/80 flex items-center justify-between text-xs">
        <div className="flex items-center gap-2.5">
          <Store className="w-4 h-4 text-indigo-600 shrink-0" />
          <div>
            <span className="font-extrabold text-slate-900">Free Store Pickup</span>
            <p className="text-[11px] text-slate-500 font-medium">Ready in 2 hours at SELLORA Mirpur Hub</p>
          </div>
        </div>
        <span className="text-[10px] font-extrabold text-emerald-600 bg-emerald-50 px-2 py-1 rounded">FREE</span>
      </div>
    </div>
  );
}
