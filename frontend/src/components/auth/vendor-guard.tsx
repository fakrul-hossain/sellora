'use client';

import React, { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/providers/auth-context';
import { Loader2, Store, AlertTriangle } from 'lucide-react';

export function VendorGuard({ children }: { children: React.ReactNode }) {
  const { user, isLoading, isVendor } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!isLoading && !user) {
      router.push(`/login?redirect=${encodeURIComponent(pathname)}`);
    }
  }, [user, isLoading, router, pathname]);

  if (isLoading || !user) {
    return (
      <div className="min-h-screen bg-[#FAFAFA] flex flex-col justify-center items-center font-sans">
        <Loader2 className="w-8 h-8 text-brand-primary animate-spin mb-3" />
        <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Verifying Vendor Portal Access...</span>
      </div>
    );
  }

  if (!isVendor) {
    return (
      <div className="min-h-screen bg-[#FAFAFA] flex flex-col items-center justify-center p-4 font-sans">
        <div className="max-w-md w-full bg-white p-8 rounded-3xl border border-slate-200 shadow-xl text-center space-y-6">
          <div className="w-14 h-14 rounded-2xl bg-amber-50 border border-amber-200 text-amber-600 flex items-center justify-center mx-auto shadow-sm">
            <AlertTriangle className="w-7 h-7" />
          </div>

          <div className="space-y-2">
            <h2 className="text-xl font-black text-slate-900">Vendor Store Account Required</h2>
            <p className="text-xs text-slate-500 font-medium leading-relaxed">
              Your account (<b>{user.email}</b>) is currently registered as a <b>Customer</b>. Access to the Vendor Dashboard is reserved for registered sellers.
            </p>
          </div>

          <div className="pt-2 space-y-3">
            <Link
              href="/register?role=SELLER"
              className="w-full py-3.5 px-4 rounded-2xl bg-brand-primary hover:bg-brand-primary-hover text-white font-extrabold text-xs shadow-md transition-all flex items-center justify-center gap-2"
            >
              <Store className="w-4 h-4" />
              <span>Register Seller Store Account</span>
            </Link>

            <Link
              href="/dashboard"
              className="w-full py-3 px-4 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-all block"
            >
              Return to Customer Dashboard
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
