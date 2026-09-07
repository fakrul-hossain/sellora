'use client';

import React, { useState, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/providers/auth-context';
import { ApiClient } from '@/lib/api-client';
import { useToast } from '@/components/ui/toast';
import { CloudinaryImageUploader } from '@/components/common';
import { UserPlus, User, Lock, Mail, Store, AlertCircle, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

function RegisterContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const isSeller = searchParams.get('role') === 'SELLER';
  const role: 'CUSTOMER' | 'SELLER' = isSeller ? 'SELLER' : 'CUSTOMER';

  const { login } = useAuth();
  const toast = useToast();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [storeName, setStoreName] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');

  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const data = await ApiClient.post<{ token: string; user: any }>('/auth/register', {
        name,
        email,
        password,
        role,
        storeName: isSeller ? storeName : undefined,
        avatarUrl: avatarUrl || undefined,
      });

      login(data.token, data.user);
      toast.success(`Account registered successfully! Welcome to SELLORA, ${name.split(' ')[0]}.`, 'Registration Successful');

      const redirectUrl = searchParams.get('redirect');
      if (redirectUrl) {
        router.push(redirectUrl);
      } else if (data.user.role === 'SELLER') {
        router.push('/seller');
      } else {
        router.push('/dashboard');
      }
    } catch (err: any) {
      const errorMsg = err.message || 'Registration failed. Please check form inputs.';
      setError(errorMsg);
      toast.error(errorMsg, 'Registration Failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-md w-full space-y-8 bg-white p-8 sm:p-10 rounded-3xl border border-slate-200 shadow-xl font-sans">
      {/* Header Info Banner */}
      <div className="text-center space-y-2">
        <div className="w-12 h-12 rounded-2xl bg-brand-primary text-white flex items-center justify-center mx-auto shadow-md">
          {isSeller ? <Store className="w-6 h-6" /> : <UserPlus className="w-6 h-6" />}
        </div>
        <h2 className="text-2xl font-black text-brand-dark tracking-tight">
          {isSeller ? 'Become a SELLORA Seller' : 'Create Customer Account'}
        </h2>
        <p className="text-xs text-slate-500 font-medium">
          {isSeller
            ? 'Open your official merchant store and reach millions of customers in Bangladesh'
            : 'Join Bangladesh marketplace platform'}
        </p>
      </div>

      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-bold flex items-start gap-3 shadow-xs"
          >
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
            <div className="flex-1 leading-relaxed">{error}</div>
          </motion.div>
        )}
      </AnimatePresence>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">Full Name</label>
          <div className="relative">
            <User className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Tofayel Ahmed"
              className="w-full pl-10 pr-4 py-3 rounded-2xl border border-slate-200 text-xs font-medium focus:outline-none focus:border-brand-primary"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">Email Address</label>
          <div className="relative">
            <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@example.com"
              className="w-full pl-10 pr-4 py-3 rounded-2xl border border-slate-200 text-xs font-medium focus:outline-none focus:border-brand-primary"
            />
          </div>
        </div>

        {isSeller && (
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Store / Business Name</label>
            <div className="relative">
              <Store className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                required
                value={storeName}
                onChange={(e) => setStoreName(e.target.value)}
                placeholder="e.g. Apex Tech Hub Bangladesh"
                className="w-full pl-10 pr-4 py-3 rounded-2xl border border-slate-200 text-xs font-medium focus:outline-none focus:border-brand-primary"
              />
            </div>
          </div>
        )}

        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">Password</label>
          <div className="relative">
            <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full pl-10 pr-4 py-3 rounded-2xl border border-slate-200 text-xs font-medium focus:outline-none focus:border-brand-primary"
            />
          </div>
        </div>

        {/* Optional Avatar Cloudinary Upload */}
        <CloudinaryImageUploader
          label="Profile / Store Avatar (Cloudinary Optional)"
          value={avatarUrl}
          onChange={setAvatarUrl}
          folder="avatars"
          placeholder="Upload profile photo to Cloudinary"
        />

        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-3.5 px-4 rounded-2xl bg-brand-primary hover:bg-brand-primary-hover text-white font-extrabold text-xs shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
        >
          {isLoading ? 'Registering...' : isSeller ? 'CREATE SELLER ACCOUNT' : 'CREATE CUSTOMER ACCOUNT'}
          <ArrowRight className="w-4 h-4" />
        </button>
      </form>

      <div className="pt-4 border-t border-slate-100 text-center space-y-2">
        <p className="text-xs text-slate-500 font-medium">
          {isSeller ? (
            <>
              Looking for customer shopping?{' '}
              <Link href="/register" className="font-bold text-brand-primary hover:underline">
                Register as Customer
              </Link>
            </>
          ) : (
            <>
              Want to sell products on SELLORA?{' '}
              <Link href="/register?role=SELLER" className="font-bold text-brand-primary hover:underline">
                Register as a Seller
              </Link>
            </>
          )}
        </p>

        <p className="text-xs text-slate-500 font-medium">
          Already have an account?{' '}
          <Link href="/login" className="font-bold text-brand-primary hover:underline">
            Sign In Here
          </Link>
        </p>
      </div>
    </div>
  );
}

export default function RegisterPage() {
  return (
    <Suspense fallback={<div className="text-xs font-bold text-slate-500">Loading registration...</div>}>
      <RegisterContent />
    </Suspense>
  );
}
