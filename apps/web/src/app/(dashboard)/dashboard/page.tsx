'use client';

import React, { useEffect, useState } from 'react';
import { useAuth } from '@/providers/auth-context';
import { ApiClient } from '@/lib/api-client';
import { Package, Clock, CheckCircle2, MapPin, ShieldCheck, ShoppingBag, Truck } from 'lucide-react';

export default function CustomerDashboardPage() {
  const { user } = useAuth();
  const [orders, setOrders] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchOrders() {
      try {
        const data = await ApiClient.get<any[]>('/orders/my-orders');
        setOrders(data || []);
      } catch (err) {
        console.error('Failed to fetch orders:', err);
      } finally {
        setIsLoading(false);
      }
    }
    fetchOrders();
  }, []);

  return (
    <div className="space-y-6 font-sans">
      {/* Header Banner */}
      <div className="bg-brand-dark rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-brand-primary/20 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 space-y-2">
          <span className="text-xs font-black text-brand-lightest uppercase tracking-wider bg-brand-primary/30 px-3 py-1 rounded-full border border-brand-light/30">
            CUSTOMER DASHBOARD
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-white">Hello, {user?.name || 'Valued Customer'}!</h1>
          <p className="text-xs sm:text-sm text-brand-lightest/80 font-medium">
            Manage your account profile, track live order status, and view purchases across Bangladesh.
          </p>
        </div>
      </div>

      {/* Orders List Section */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-2xs space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <h2 className="text-base font-black text-brand-dark flex items-center gap-2">
            <Package className="w-5 h-5 text-brand-primary" />
            My Order History ({orders.length})
          </h2>
          <span className="text-xs text-slate-500 font-medium">Real-time status updates</span>
        </div>

        {isLoading ? (
          <div className="py-8 text-center text-xs font-bold text-slate-500">Loading your order history...</div>
        ) : orders.length === 0 ? (
          <div className="py-12 text-center space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
              <ShoppingBag className="w-6 h-6" />
            </div>
            <p className="text-xs font-bold text-slate-600">No orders placed yet.</p>
            <p className="text-xs text-slate-400">Explore products on SELLORA storefront to place your first order.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((ord) => (
              <div key={ord.id} className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200/60 pb-3 text-xs">
                  <div>
                    <span className="font-extrabold text-brand-dark">{ord.orderNumber}</span>
                    <span className="text-slate-400 mx-2">•</span>
                    <span className="text-slate-500 font-medium">{new Date(ord.createdAt).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="bg-brand-primary/10 text-brand-primary text-[10px] font-black px-2.5 py-1 rounded-full uppercase">
                      {ord.orderStatus}
                    </span>
                    <span className="font-black text-brand-dark">৳{ord.totalAmount?.toLocaleString()}</span>
                  </div>
                </div>

                {/* Items */}
                <div className="space-y-2">
                  {ord.items?.map((item: any, idx: number) => (
                    <div key={idx} className="flex items-center justify-between gap-3 text-xs">
                      <div className="flex items-center gap-3">
                        <img src={item.imageUrl} alt={item.title} className="w-10 h-10 rounded-xl object-contain bg-white border border-slate-200 p-0.5" />
                        <div>
                          <span className="font-bold text-slate-800 line-clamp-1">{item.title}</span>
                          <span className="text-[11px] text-slate-500">Qty: {item.quantity}</span>
                        </div>
                      </div>
                      <span className="font-extrabold text-slate-800">৳{(item.price * item.quantity).toLocaleString()}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
