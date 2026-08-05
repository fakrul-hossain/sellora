'use client';

import React, { useEffect, useState } from 'react';
import { ApiClient } from '@/lib/api-client';
import { ShoppingBag, Truck, CheckCircle2, Clock, AlertCircle } from 'lucide-react';

export default function VendorOrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchVendorOrders = async () => {
    try {
      setIsLoading(true);
      const data = await ApiClient.get<any[]>('/orders/vendor/my-orders');
      setOrders(data || []);
    } catch (err) {
      console.error('Failed to fetch vendor orders:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchVendorOrders();
  }, []);

  const handleUpdateStatus = async (orderId: string, newStatus: string) => {
    try {
      await ApiClient.put(`/orders/${orderId}/status`, { orderStatus: newStatus });
      fetchVendorOrders();
    } catch (err: any) {
      alert(err.message || 'Failed to update order status');
    }
  };

  return (
    <div className="min-h-screen bg-[#FAFAFA] py-8 font-sans">
      <div className="max-w-[1536px] mx-auto px-4 sm:px-6 space-y-6">
        <div className="border-b border-slate-200 pb-4">
          <h1 className="text-2xl font-black text-brand-dark flex items-center gap-2">
            <ShoppingBag className="w-6 h-6 text-brand-primary" />
            Vendor Order Fulfillment & Shipping
          </h1>
          <p className="text-xs text-slate-500 font-medium">Manage and ship orders placed by customers for your store</p>
        </div>

        {/* Orders Table */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-2xs overflow-hidden">
          {isLoading ? (
            <div className="py-12 text-center text-xs font-bold text-slate-500">Loading vendor orders...</div>
          ) : orders.length === 0 ? (
            <div className="py-12 text-center text-xs font-bold text-slate-500">No orders received for your store yet.</div>
          ) : (
            <div className="divide-y divide-slate-100">
              {orders.map((ord) => (
                <div key={ord.id} className="p-6 space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3 text-xs">
                    <div>
                      <span className="font-extrabold text-brand-dark">{ord.orderNumber}</span>
                      <span className="text-slate-400 mx-2">•</span>
                      <span className="text-slate-500 font-medium">{new Date(ord.createdAt).toLocaleString()}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-slate-500 font-bold">Status:</span>
                      <select
                        value={ord.orderStatus}
                        onChange={(e) => handleUpdateStatus(ord.id, e.target.value)}
                        className="p-1.5 rounded-xl border border-slate-200 bg-slate-50 font-black text-[11px] text-brand-dark focus:outline-none focus:border-brand-primary cursor-pointer"
                      >
                        <option value="PENDING">PENDING</option>
                        <option value="PROCESSING">PROCESSING</option>
                        <option value="SHIPPED">SHIPPED</option>
                        <option value="DELIVERED">DELIVERED</option>
                        <option value="CANCELLED">CANCELLED</option>
                      </select>
                    </div>
                  </div>

                  {/* Customer Delivery Info */}
                  <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/60 text-xs space-y-1">
                    <span className="font-extrabold text-slate-800 block">Deliver To: {ord.shippingAddress?.fullName} ({ord.shippingAddress?.phone})</span>
                    <p className="text-slate-600 font-medium">
                      {ord.shippingAddress?.street}, {ord.shippingAddress?.area}, {ord.shippingAddress?.city}
                    </p>
                  </div>

                  {/* Items */}
                  <div className="space-y-2">
                    {ord.items?.map((item: any, idx: number) => (
                      <div key={idx} className="flex items-center justify-between gap-3 text-xs">
                        <div className="flex items-center gap-3">
                          <img src={item.imageUrl} alt={item.title} className="w-10 h-10 rounded-xl object-contain bg-white border border-slate-200 p-0.5" />
                          <div>
                            <span className="font-bold text-slate-900">{item.title}</span>
                            <span className="text-[11px] text-slate-500 block">Qty: {item.quantity} × ৳{item.price?.toLocaleString()}</span>
                          </div>
                        </div>
                        <span className="font-extrabold text-brand-dark">৳{(item.price * item.quantity).toLocaleString()}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
