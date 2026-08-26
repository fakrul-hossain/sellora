'use client';

import React, { useEffect, useState } from 'react';
import { ApiClient } from '@/lib/api-client';
import { Package, Truck, CheckCircle2, Clock } from 'lucide-react';

export default function MyOrdersPage() {
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
    <div className="space-y-6 font-sans text-slate-800">
      <div className="flex items-center justify-between">
        <h1 className="text-xl sm:text-2xl font-black text-slate-900">My Orders</h1>
        <span className="text-xs font-bold text-slate-500">{orders.length} Total Orders</span>
      </div>

      {isLoading ? (
        <div className="p-8 text-center text-xs text-slate-400">Loading order history...</div>
      ) : orders.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 shadow-2xs space-y-3">
          <Package className="w-12 h-12 text-slate-300 mx-auto" />
          <h3 className="text-base font-bold text-slate-800">No Orders Placed Yet</h3>
          <p className="text-xs text-slate-500">Your order history will appear here after placing orders.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((ord) => (
            <div
              key={ord.id}
              className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-2xs space-y-4"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100 text-xs">
                <div>
                  <span className="font-black text-slate-900 text-sm">Order {ord.orderNumber || ord.id}</span>
                  <span className="text-slate-400 block text-[11px]">
                    Placed on {new Date(ord.createdAt || Date.now()).toLocaleDateString()}
                  </span>
                </div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-600 font-bold border border-emerald-200 text-xs">
                  <Truck className="w-3.5 h-3.5" />
                  <span>{ord.status || 'CONFIRMED'}</span>
                </div>
              </div>

              <div className="space-y-3">
                {ord.items?.map((item: any, idx: number) => (
                  <div key={idx} className="flex items-center justify-between gap-4 text-xs">
                    <div className="flex items-center space-x-3">
                      <img
                        src={item.imageUrl}
                        alt={item.title}
                        className="w-12 h-12 object-contain bg-slate-50 rounded-xl p-1 border border-slate-100 shrink-0"
                      />
                      <div>
                        <h4 className="font-bold text-slate-900 line-clamp-1">{item.title}</h4>
                        <span className="text-slate-400 text-[11px]">Qty: {item.quantity}</span>
                      </div>
                    </div>
                    <span className="font-black text-slate-900">৳{(item.price * item.quantity).toLocaleString()}</span>
                  </div>
                ))}
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="text-slate-500 font-medium">Payment: {ord.paymentMethod || 'CASH_ON_DELIVERY'}</span>
                <span className="text-sm font-black text-brand-primary">Total: ৳{(ord.totalAmount || 0).toLocaleString()}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
