'use client';

import React from 'react';
import { XCircle } from 'lucide-react';

export default function CancellationsPage() {
  return (
    <div className="space-y-6 font-sans text-slate-800">
      <h1 className="text-xl sm:text-2xl font-black text-slate-900">My Cancellations</h1>

      <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 shadow-2xs space-y-3">
        <XCircle className="w-12 h-12 text-slate-300 mx-auto" />
        <h3 className="text-base font-bold text-slate-800">No Cancelled Orders</h3>
        <p className="text-xs text-slate-500 max-w-sm mx-auto">
          You have not cancelled any placed orders.
        </p>
      </div>
    </div>
  );
}
