'use client';

import React from 'react';
import { RotateCcw } from 'lucide-react';

export default function ReturnsPage() {
  return (
    <div className="space-y-6 font-sans text-slate-800">
      <h1 className="text-xl sm:text-2xl font-black text-slate-900">My Returns & Refunds</h1>

      <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 shadow-2xs space-y-3">
        <RotateCcw className="w-12 h-12 text-slate-300 mx-auto" />
        <h3 className="text-base font-bold text-slate-800">No Return Requests</h3>
        <p className="text-xs text-slate-500 max-w-sm mx-auto">
          You currently have no active or historical return or refund requests.
        </p>
      </div>
    </div>
  );
}
