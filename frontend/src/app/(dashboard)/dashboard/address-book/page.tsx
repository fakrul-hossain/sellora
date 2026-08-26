'use client';

import React, { useState } from 'react';
import { MapPin, Plus, Home, Building, CheckCircle2 } from 'lucide-react';
import { useToast } from '@/components/ui/toast';

export default function AddressBookPage() {
  const toast = useToast();
  const [addresses, setAddresses] = useState([
    {
      id: 'addr-1',
      type: 'Home',
      name: 'Sakir Hasan',
      phone: '01712345678',
      address: 'House 42, Road 9A, Dhanmondi, Dhaka 1209',
      isDefault: true,
    },
  ]);

  const [isAdding, setIsAdding] = useState(false);
  const [newType, setNewType] = useState('Office');
  const [newName, setNewName] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [newAddress, setNewAddress] = useState('');

  const handleAddAddress = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName || !newAddress) return;

    const newObj = {
      id: `addr-${Date.now()}`,
      type: newType,
      name: newName,
      phone: newPhone,
      address: newAddress,
      isDefault: false,
    };

    setAddresses([...addresses, newObj]);
    setIsAdding(false);
    setNewName('');
    setNewPhone('');
    setNewAddress('');
    toast.success('New delivery address saved!', 'Address Added');
  };

  return (
    <div className="space-y-6 font-sans text-slate-800">
      <div className="flex items-center justify-between">
        <h1 className="text-xl sm:text-2xl font-black text-slate-900">Address Book</h1>
        <button
          onClick={() => setIsAdding(!isAdding)}
          className="px-4 py-2.5 rounded-2xl bg-brand-primary text-white font-extrabold text-xs shadow-sm hover:bg-brand-primary-hover transition-colors flex items-center gap-1.5 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>{isAdding ? 'Cancel' : 'Add New Address'}</span>
        </button>
      </div>

      {isAdding && (
        <form onSubmit={handleAddAddress} className="bg-white rounded-3xl p-6 border border-brand-light shadow-md space-y-4 text-xs">
          <h3 className="text-sm font-extrabold text-brand-dark">Add New Delivery Address</h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Address Label</label>
              <select
                value={newType}
                onChange={(e) => setNewType(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 font-bold"
              >
                <option value="Home">Home</option>
                <option value="Office">Office</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Receiver Name</label>
              <input
                type="text"
                required
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                placeholder="Full Name"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 font-medium"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Phone Number</label>
              <input
                type="tel"
                required
                value={newPhone}
                onChange={(e) => setNewPhone(e.target.value)}
                placeholder="017xxxxxxxx"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 font-medium"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block font-bold text-slate-700 mb-1">Full Street Address</label>
              <input
                type="text"
                required
                value={newAddress}
                onChange={(e) => setNewAddress(e.target.value)}
                placeholder="House, Road, Area, City"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 font-medium"
              />
            </div>
          </div>

          <button
            type="submit"
            className="px-5 py-2.5 bg-brand-primary text-white rounded-xl font-bold text-xs shadow-sm hover:bg-brand-primary-hover transition-colors"
          >
            Save Address
          </button>
        </form>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {addresses.map((addr) => (
          <div
            key={addr.id}
            className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-2xs space-y-3 relative overflow-hidden"
          >
            {addr.isDefault && (
              <span className="absolute top-4 right-4 bg-emerald-50 text-emerald-600 text-[10px] font-black px-2.5 py-1 rounded-full border border-emerald-200 flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" /> Default Shipping Address
              </span>
            )}

            <div className="flex items-center gap-2">
              {addr.type === 'Home' ? (
                <Home className="w-4 h-4 text-brand-primary" />
              ) : (
                <Building className="w-4 h-4 text-brand-primary" />
              )}
              <span className="text-xs font-black uppercase text-slate-900">{addr.type}</span>
            </div>

            <div className="space-y-1 text-xs">
              <h4 className="font-extrabold text-slate-900">{addr.name}</h4>
              <p className="text-slate-500 font-medium">{addr.phone}</p>
              <p className="text-slate-700 font-medium pt-1 flex items-start gap-1">
                <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                <span>{addr.address}</span>
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
