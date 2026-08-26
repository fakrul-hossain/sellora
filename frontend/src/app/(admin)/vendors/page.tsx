'use client';

import React, { useEffect, useState } from 'react';
import { ApiClient } from '@/lib/api-client';
import { Store, CheckCircle, ShieldAlert, XCircle, Search } from 'lucide-react';

export default function AdminVendorsPage() {
  const [vendors, setVendors] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchVendors = async () => {
    try {
      setIsLoading(true);
      const data = await ApiClient.get<any[]>('/admin/vendors');
      setVendors(data || []);
    } catch (err) {
      console.error('Failed to fetch vendors list:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchVendors();
  }, []);

  const handleUpdateStatus = async (vendorId: string, status: string) => {
    try {
      await ApiClient.put(`/admin/vendors/${vendorId}/status`, { status });
      fetchVendors();
    } catch (err: any) {
      alert(err.message || 'Failed to update vendor status');
    }
  };

  return (
    <div className="space-y-6 font-sans">
      <div className="border-b border-slate-200 pb-4">
        <h1 className="text-2xl font-black text-brand-dark flex items-center gap-2">
          <Store className="w-6 h-6 text-brand-primary" />
          Vendor Store Moderation & Approvals
        </h1>
        <p className="text-xs text-slate-500 font-medium">Verify business registration status and toggle store permissions across SELLORA</p>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200 shadow-2xs overflow-hidden">
        {isLoading ? (
          <div className="py-12 text-center text-xs font-bold text-slate-500">Loading vendor list...</div>
        ) : vendors.length === 0 ? (
          <div className="py-12 text-center text-xs font-bold text-slate-500">No vendors registered on the platform yet.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider font-extrabold border-b border-slate-200">
                <tr>
                  <th className="p-4">Store Name</th>
                  <th className="p-4">Email / Phone</th>
                  <th className="p-4">Location</th>
                  <th className="p-4">Commission</th>
                  <th className="p-4">Current Status</th>
                  <th className="p-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {vendors.map((v) => (
                  <tr key={v.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="p-4 font-extrabold text-slate-900">{v.storeName}</td>
                    <td className="p-4 text-slate-600">
                      <div>{v.email}</div>
                      <div className="text-[10px] text-slate-400">{v.phone || 'No phone'}</div>
                    </td>
                    <td className="p-4 text-slate-600">{v.address?.city || 'Dhaka'}</td>
                    <td className="p-4 font-bold text-brand-primary">{v.commissionRate || 5}%</td>
                    <td className="p-4">
                      <span
                        className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase ${
                          v.status === 'APPROVED'
                            ? 'bg-emerald-100 text-emerald-800'
                            : v.status === 'SUSPENDED'
                            ? 'bg-rose-100 text-rose-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {v.status}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <select
                        value={v.status}
                        onChange={(e) => handleUpdateStatus(v.id, e.target.value)}
                        className="p-1.5 rounded-xl border border-slate-200 bg-slate-50 font-extrabold text-[11px] text-brand-dark focus:outline-none focus:border-brand-primary cursor-pointer"
                      >
                        <option value="APPROVED">APPROVED</option>
                        <option value="PENDING">PENDING</option>
                        <option value="SUSPENDED">SUSPENDED</option>
                        <option value="REJECTED">REJECTED</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
