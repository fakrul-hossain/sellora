'use client';

import React, { useEffect, useState } from 'react';
import { ApiClient } from '@/lib/api-client';
import { useToast } from '@/components/ui/toast';
import { Wallet, DollarSign, ArrowUpRight, Plus, Clock, CheckCircle2 } from 'lucide-react';

export default function SellerFinancePage() {
  const toast = useToast();
  const [analytics, setAnalytics] = useState<any>(null);
  const [withdrawals, setWithdrawals] = useState<any[]>([]);
  const [amount, setAmount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('bKash');
  const [accountDetails, setAccountDetails] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchFinanceData();
  }, []);

  async function fetchFinanceData() {
    try {
      setIsLoading(true);
      const [analyticsData, withdrawalsData] = await Promise.all([
        ApiClient.get<any>('/vendors/analytics'),
        ApiClient.get<any[]>('/vendors/withdrawals'),
      ]);
      setAnalytics(analyticsData);
      setWithdrawals(withdrawalsData || []);
    } catch (err) {
      console.error('Failed to fetch financial data:', err);
    } finally {
      setIsLoading(false);
    }
  }

  const handleRequestWithdrawal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || parseFloat(amount) <= 0) return;

    setIsSubmitting(true);
    try {
      await ApiClient.post('/vendors/withdrawals', {
        amount: parseFloat(amount),
        paymentMethod,
        accountDetails,
      });
      toast.success('Payout withdrawal request submitted successfully!', 'Request Submitted');
      setAmount('');
      setAccountDetails('');
      fetchFinanceData();
    } catch (err: any) {
      toast.error(err.message || 'Failed to submit withdrawal request', 'Submission Failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 font-sans text-slate-800 antialiased max-w-5xl">
      {/* Top Banner */}
      <div className="bg-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-2 relative z-10">
          <span className="text-xs font-black text-brand-lightest uppercase tracking-wider bg-brand-primary/30 px-3 py-1 rounded-full border border-brand-light/30">
            FINANCIAL CENTER
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-white">Vendor Earnings & Payout Wallet</h1>
          <p className="text-xs sm:text-sm text-slate-300 font-medium">
            Monitor sales revenue, platform commission deductions, net payout balances, and request payout withdrawals.
          </p>
        </div>

        <div className="relative z-10 text-right">
          <span className="text-xs text-slate-400 font-bold block">Available Payout Balance</span>
          <div className="text-2xl sm:text-3xl font-black text-emerald-400">
            ৳{(analytics?.revenue || 0).toLocaleString()}
          </div>
        </div>
      </div>

      {/* Financial Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-3xl bg-white border border-slate-200 shadow-2xs space-y-1.5">
          <div className="w-9 h-9 rounded-2xl bg-brand-lightest text-brand-primary flex items-center justify-center">
            <DollarSign className="w-4 h-4" />
          </div>
          <span className="text-xs text-slate-500 font-bold block">Gross Sales GMV</span>
          <div className="text-xl font-black text-slate-900">৳{(analytics?.totalSales || 0).toLocaleString()}</div>
        </div>

        <div className="p-5 rounded-3xl bg-white border border-slate-200 shadow-2xs space-y-1.5">
          <div className="w-9 h-9 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center">
            <Wallet className="w-4 h-4" />
          </div>
          <span className="text-xs text-slate-500 font-bold block">Platform Fee (5%)</span>
          <div className="text-xl font-black text-purple-700">
            ৳{Math.round((analytics?.totalSales || 0) * 0.05).toLocaleString()}
          </div>
        </div>

        <div className="p-5 rounded-3xl bg-white border border-slate-200 shadow-2xs space-y-1.5">
          <div className="w-9 h-9 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <CheckCircle2 className="w-4 h-4" />
          </div>
          <span className="text-xs text-slate-500 font-bold block">Net Vendor Revenue</span>
          <div className="text-xl font-black text-emerald-700">৳{(analytics?.revenue || 0).toLocaleString()}</div>
        </div>
      </div>

      {/* 2-Column: Request Payout & Withdrawal History */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Request Withdrawal Form */}
        <div className="lg:col-span-5 bg-white p-6 rounded-3xl border border-slate-200 shadow-2xs space-y-4">
          <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
            <Plus className="w-4 h-4 text-brand-primary" />
            <span>Request Payout Withdrawal</span>
          </h3>

          <form onSubmit={handleRequestWithdrawal} className="space-y-4 text-xs font-bold">
            <div>
              <label className="block text-slate-700 mb-1">Amount to Withdraw (৳) *</label>
              <input
                type="number"
                required
                placeholder="e.g. 5000"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full p-3 rounded-xl border border-slate-200 focus:outline-none focus:border-brand-primary"
              />
            </div>

            <div>
              <label className="block text-slate-700 mb-1">Payment Method *</label>
              <select
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="w-full p-3 rounded-xl border border-slate-200 focus:outline-none focus:border-brand-primary bg-white"
              >
                <option value="bKash">bKash Merchant / Personal</option>
                <option value="Nagad">Nagad Wallet</option>
                <option value="Bank Transfer">Bank Transfer (EFT)</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-700 mb-1">Account / Mobile Number *</label>
              <input
                type="text"
                required
                placeholder="017XXXXXXXX or Bank Details"
                value={accountDetails}
                onChange={(e) => setAccountDetails(e.target.value)}
                className="w-full p-3 rounded-xl border border-slate-200 focus:outline-none focus:border-brand-primary font-mono text-[11px]"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 rounded-2xl bg-brand-primary hover:bg-brand-primary-hover text-white font-extrabold text-xs shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <ArrowUpRight className="w-4 h-4" />
              <span>{isSubmitting ? 'SUBMITTING...' : 'SUBMIT WITHDRAWAL REQUEST'}</span>
            </button>
          </form>
        </div>

        {/* Withdrawal Requests History */}
        <div className="lg:col-span-7 bg-white p-6 rounded-3xl border border-slate-200 shadow-2xs space-y-4">
          <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
            <Clock className="w-4 h-4 text-purple-600" />
            <span>Withdrawal History</span>
          </h3>

          {isLoading ? (
            <div className="p-6 text-center text-xs text-slate-400">Loading payout records...</div>
          ) : withdrawals.length === 0 ? (
            <div className="p-8 text-center text-xs text-slate-400">No withdrawal requests submitted yet</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="bg-slate-50 text-slate-500 font-extrabold uppercase text-[10px] tracking-wider border-b border-slate-100">
                    <th className="py-2.5 px-3">Date</th>
                    <th className="py-2.5 px-3">Method</th>
                    <th className="py-2.5 px-3">Amount</th>
                    <th className="py-2.5 px-3 text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium">
                  {withdrawals.map((w) => (
                    <tr key={w.id} className="hover:bg-slate-50/60 transition-colors">
                      <td className="py-3 px-3 text-slate-500">{new Date(w.createdAt).toLocaleDateString()}</td>
                      <td className="py-3 px-3 font-bold text-slate-800">{w.paymentMethod}</td>
                      <td className="py-3 px-3 font-black text-slate-900">৳{w.amount.toLocaleString()}</td>
                      <td className="py-3 px-3 text-right">
                        <span className="bg-amber-50 text-amber-700 text-[10px] font-bold px-2 py-0.5 rounded-full border border-amber-200">
                          {w.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
