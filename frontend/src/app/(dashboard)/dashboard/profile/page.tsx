'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/providers/auth-context';
import { useToast } from '@/components/ui/toast';
import { User, MapPin, Edit2, Save, FileText, Headphones } from 'lucide-react';

export default function ProfilePage() {
  const { user } = useAuth();
  const toast = useToast();
  const [activeTab, setActiveTab] = useState<'info' | 'policies' | 'help'>('info');

  const [name, setName] = useState(user?.name || 'Sakir Hasan');
  const [email] = useState(user?.email || 'sakirhasan133@gmail.com');
  const [phone, setPhone] = useState('01712-345678');
  const [dob, setDob] = useState('1996-08-15');
  const [gender, setGender] = useState('Male');
  const [isEditing, setIsEditing] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setIsEditing(false);
    toast.success('Account information updated!', 'Profile Saved');
  };

  return (
    <div className="space-y-6 font-sans text-slate-800 antialiased">
      {/* Header Title */}
      <h1 className="text-xl sm:text-2xl font-black text-slate-900">Profile Settings</h1>

      {/* Top Tabs Bar (Screenshot 2 design) */}
      <div className="flex items-center gap-6 border-b border-slate-200 text-xs font-extrabold text-slate-500">
        <button
          onClick={() => setActiveTab('info')}
          className={`pb-3 transition-colors cursor-pointer relative ${
            activeTab === 'info' ? 'text-brand-dark font-black' : 'hover:text-slate-900'
          }`}
        >
          Account Information
          {activeTab === 'info' && (
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-brand-dark rounded-full" />
          )}
        </button>

        <button
          onClick={() => setActiveTab('policies')}
          className={`pb-3 transition-colors cursor-pointer relative ${
            activeTab === 'policies' ? 'text-brand-dark font-black' : 'hover:text-slate-900'
          }`}
        >
          Policies
          {activeTab === 'policies' && (
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-brand-dark rounded-full" />
          )}
        </button>

        <button
          onClick={() => setActiveTab('help')}
          className={`pb-3 transition-colors cursor-pointer relative ${
            activeTab === 'help' ? 'text-brand-dark font-black' : 'hover:text-slate-900'
          }`}
        >
          Help
          {activeTab === 'help' && (
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-brand-dark rounded-full" />
          )}
        </button>
      </div>

      {activeTab === 'info' && (
        <div className="space-y-6">
          {/* Avatar & Edit/Delete Bar */}
          <div className="flex items-center justify-between bg-white rounded-3xl p-6 border border-slate-200/90 shadow-2xs">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-slate-100 border-2 border-slate-200 flex items-center justify-center text-slate-700 shadow-inner">
                <User className="w-8 h-8 text-slate-600" />
              </div>
              <div>
                <h3 className="text-sm font-black text-slate-900">{name}</h3>
                <span className="text-xs text-slate-500 font-medium">{email}</span>
              </div>
            </div>

            <div className="flex items-center gap-3 text-xs font-bold">
              <button
                onClick={() => setIsEditing(!isEditing)}
                className="text-blue-600 hover:underline cursor-pointer"
              >
                {isEditing ? 'Cancel' : 'Edit'}
              </button>
              <button
                onClick={() => toast.info('Delete account requested', 'Account Notice')}
                className="text-rose-600 hover:underline cursor-pointer"
              >
                Delete
              </button>
            </div>
          </div>

          {/* Account Details Box */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-2xs space-y-4">
            {!isEditing ? (
              <div className="space-y-4 text-xs">
                <div>
                  <span className="text-slate-400 font-medium block">Full Name</span>
                  <span className="text-sm font-black text-slate-900">{name}</span>
                </div>

                <div>
                  <span className="text-slate-400 font-medium block">Email Address</span>
                  <span className="text-sm font-bold text-slate-800">{email}</span>
                </div>

                <div>
                  <span className="text-slate-400 font-medium block">Mobile No</span>
                  <span className="text-xs font-bold text-slate-800">{phone}</span>
                </div>

                <div>
                  <span className="text-slate-400 font-medium block">Date of Birth</span>
                  <span className="text-xs font-bold text-slate-800">{dob}</span>
                </div>

                <div>
                  <span className="text-slate-400 font-medium block">Gender</span>
                  <span className="text-xs font-bold text-slate-800">{gender}</span>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSave} className="space-y-4 text-xs">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Full Name</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 font-bold"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Mobile No</label>
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 font-medium"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Date of Birth</label>
                  <input
                    type="date"
                    value={dob}
                    onChange={(e) => setDob(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 font-medium"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Gender</label>
                  <select
                    value={gender}
                    onChange={(e) => setGender(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 font-medium"
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-brand-primary text-white font-extrabold text-xs shadow-sm hover:bg-brand-primary-hover transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <Save className="w-4 h-4" /> Save Profile
                </button>
              </form>
            )}
          </div>

          {/* Addresses Section (Screenshot 2 design) */}
          <div className="space-y-4">
            <h2 className="text-lg font-black text-slate-900">Addresses</h2>

            <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-2xs space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-800">Default Delivery Address</span>
                <Link
                  href="/dashboard/address-book"
                  className="text-xs font-extrabold text-blue-600 hover:underline"
                >
                  Edit
                </Link>
              </div>

              <div className="text-xs text-slate-600 font-medium pt-1 flex items-start gap-2">
                <MapPin className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-slate-900 block">{name} ({phone})</strong>
                  <span>House 42, Road 9A, Dhanmondi, Dhaka 1209</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'policies' && (
        <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-2xs space-y-4 text-xs">
          <div className="flex items-center gap-2 font-bold text-slate-900 text-sm">
            <FileText className="w-5 h-5 text-brand-primary" />
            <span>Sellora Customer Terms & Policies</span>
          </div>
          <p className="text-slate-600 leading-relaxed">
            All orders placed on Sellora are protected by our 7-day easy return policy and official brand manufacturer warranty across Bangladesh.
          </p>
        </div>
      )}

      {activeTab === 'help' && (
        <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-2xs space-y-4 text-xs">
          <div className="flex items-center gap-2 font-bold text-slate-900 text-sm">
            <Headphones className="w-5 h-5 text-brand-primary" />
            <span>Need Assistance?</span>
          </div>
          <p className="text-slate-600 leading-relaxed">
            Contact our 24/7 customer experience team via Live Support or call our hotline at 16222.
          </p>
          <Link
            href="/dashboard/live-chat"
            className="inline-block px-4 py-2 rounded-xl bg-brand-primary text-white font-extrabold text-xs shadow-sm hover:bg-brand-primary-hover transition-colors"
          >
            Open Live Support Chat
          </Link>
        </div>
      )}
    </div>
  );
}
