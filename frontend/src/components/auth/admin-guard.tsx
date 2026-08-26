'use client';

import React, { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/providers/auth-context';
import { Loader2, ShieldAlert, LogIn } from 'lucide-react';

export function AdminGuard({ children }: { children: React.ReactNode }) {
  const { user, isLoading, isAdmin } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!isLoading && !user) {
      router.push(`/login?redirect=${encodeURIComponent(pathname)}`);
    }
  }, [user, isLoading, router, pathname]);

  if (isLoading || !user) {
    return (
      <div className="min-h-screen bg-brand-dark flex flex-col justify-center items-center font-sans text-white">
        <Loader2 className="w-8 h-8 text-brand-light animate-spin mb-3" />
        <span className="text-xs font-bold text-brand-lightest/70 uppercase tracking-widest">Verifying Admin Session...</span>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-brand-dark flex flex-col items-center justify-center p-4 font-sans text-white">
        <div className="max-w-md w-full bg-white/10 backdrop-blur-md p-8 rounded-3xl border border-white/20 shadow-2xl text-center space-y-6">
          <div className="w-14 h-14 rounded-2xl bg-rose-500/20 border border-rose-500/30 text-rose-400 flex items-center justify-center mx-auto shadow-sm">
            <ShieldAlert className="w-7 h-7" />
          </div>

          <div className="space-y-2">
            <h2 className="text-xl font-black text-white">Access Denied (Admin Required)</h2>
            <p className="text-xs text-brand-lightest/70 font-medium leading-relaxed">
              Your account (<b>{user.email}</b>) does not possess Administrator authorization permissions.
            </p>
          </div>

          <div className="pt-2 space-y-3">
            <Link
              href="/login?tab=admin"
              className="w-full py-3.5 px-4 rounded-2xl bg-brand-primary hover:bg-brand-primary-hover text-white font-extrabold text-xs shadow-md transition-all flex items-center justify-center gap-2"
            >
              <LogIn className="w-4 h-4" />
              <span>Sign in with Admin Credentials</span>
            </Link>

            <Link
              href="/"
              className="w-full py-3 px-4 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs transition-all block"
            >
              Back to Home Store
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
