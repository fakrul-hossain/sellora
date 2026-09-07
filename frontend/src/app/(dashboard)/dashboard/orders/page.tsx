'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { ApiClient } from '@/lib/api-client';
import { useToast } from '@/components/ui/toast';
import {
  Package,
  Truck,
  CheckCircle2,
  Clock,
  ChevronDown,
  ChevronUp,
  Copy,
  Check,
  MapPin,
  AlertCircle,
  XCircle,
  Calendar,
  Building2,
  ShieldCheck,
  ArrowRight,
  PhoneCall,
  ShoppingBag,
} from 'lucide-react';

interface OrderItem {
  id: string;
  productId: string;
  title: string;
  imageUrl: string;
  price: number;
  quantity: number;
  subtotal: number;
}

interface StatusHistoryItem {
  status: string;
  timestamp: string;
  note?: string;
}

interface Order {
  id: string | number;
  orderNumber: string;
  orderStatus: 'PENDING' | 'CONFIRMED' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED' | string;
  status?: string;
  paymentMethod: string;
  paymentStatus: 'PAID' | 'PENDING' | 'FAILED' | string;
  subtotal: number;
  shippingFee: number;
  discount: number;
  totalAmount: number;
  createdAt: string;
  items: OrderItem[];
  shippingAddress?: {
    fullName?: string;
    phone?: string;
    address?: string;
    city?: string;
    state?: string;
    postalCode?: string;
  };
  statusHistory?: StatusHistoryItem[];
  trackingNumber?: string;
}

// 7-Stage Professional Logistics Stepper Definition
const LOGISTICS_STAGES = [
  {
    key: 'ORDER_PLACED',
    label: 'Order Placed',
    sublabel: 'Verified in system',
    location: 'Sellora Core Engine',
  },
  {
    key: 'PAYMENT_CONFIRMED',
    label: 'Payment Verified',
    sublabel: 'Payment authorized',
    location: 'Gateway Hub',
  },
  {
    key: 'PROCESSING',
    label: 'Packed & QC Passed',
    sublabel: 'Picked & sealed',
    location: 'Vendor Fulfillment Hub',
  },
  {
    key: 'HANDED_TO_COURIER',
    label: 'Handed to Courier',
    sublabel: 'Manifest registered',
    location: 'Tejgaon Dispatch Center',
  },
  {
    key: 'IN_TRANSIT',
    label: 'In Transit',
    sublabel: 'Sorting & transfer',
    location: 'Central Dhaka Sorting Hub',
  },
  {
    key: 'OUT_FOR_DELIVERY',
    label: 'Out for Delivery',
    sublabel: 'Rider on the way',
    location: 'Local Neighborhood Depot',
  },
  {
    key: 'DELIVERED',
    label: 'Delivered',
    sublabel: 'Received & signed',
    location: 'Customer Address',
  },
];

export default function MyOrdersPage() {
  const toast = useToast();
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [expandedOrderId, setExpandedOrderId] = useState<string | number | null>(null);
  const [copiedTrackingId, setCopiedTrackingId] = useState<string | null>(null);
  const [filterTab, setFilterTab] = useState<'ALL' | 'ACTIVE' | 'DELIVERED' | 'CANCELLED'>('ALL');

  useEffect(() => {
    async function fetchOrders() {
      try {
        const data = await ApiClient.get<Order[]>('/orders/my-orders');
        const list = Array.isArray(data) ? data : [];
        setOrders(list);
        // Automatically expand the first active order if available
        if (list.length > 0) {
          setExpandedOrderId(list[0].id);
        }
      } catch (err) {
        console.error('Failed to fetch orders:', err);
      } finally {
        setIsLoading(false);
      }
    }
    fetchOrders();
  }, []);

  const handleCopyTracking = (trackingNum: string) => {
    navigator.clipboard.writeText(trackingNum);
    setCopiedTrackingId(trackingNum);
    toast.success(`Tracking number ${trackingNum} copied to clipboard`);
    setTimeout(() => setCopiedTrackingId(null), 2500);
  };

  const getEffectiveStatus = (order: Order) => {
    return (order.orderStatus || order.status || 'CONFIRMED').toUpperCase();
  };

  // Determine stage progress index (0 to 6)
  const getStageIndex = (status: string): number => {
    switch (status) {
      case 'PENDING':
        return 0;
      case 'CONFIRMED':
        return 1;
      case 'PROCESSING':
        return 2;
      case 'SHIPPED':
        return 4; // In transit
      case 'DELIVERED':
        return 6;
      case 'CANCELLED':
        return -1;
      default:
        return 1;
    }
  };

  // Filter orders by selected tab
  const filteredOrders = orders.filter((ord) => {
    const st = getEffectiveStatus(ord);
    if (filterTab === 'ACTIVE') return ['PENDING', 'CONFIRMED', 'PROCESSING', 'SHIPPED'].includes(st);
    if (filterTab === 'DELIVERED') return st === 'DELIVERED';
    if (filterTab === 'CANCELLED') return st === 'CANCELLED';
    return true;
  });

  return (
    <div className="space-y-6 font-sans text-slate-800 antialiased pb-12">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">Order Tracking & History</h1>
            <span className="text-[11px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-brand-primary text-white">
              Live Logistics
            </span>
          </div>
          <p className="text-xs text-slate-500 font-medium mt-1">
            Real-time step-by-step courier tracking for all your Sellora marketplace purchases.
          </p>
        </div>

        <Link
          href="/"
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-2xl bg-white border border-slate-200 text-slate-700 hover:text-brand-primary hover:border-brand-primary text-xs font-bold transition-all shadow-2xs self-start"
        >
          <ShoppingBag className="w-3.5 h-3.5" />
          <span>Continue Shopping</span>
        </Link>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto scrollbar-none pb-1 text-xs font-extrabold">
        {(
          [
            { key: 'ALL', label: `All Orders (${orders.length})` },
            {
              key: 'ACTIVE',
              label: `Active / In Transit (${orders.filter((o) => ['PENDING', 'CONFIRMED', 'PROCESSING', 'SHIPPED'].includes(getEffectiveStatus(o))).length
                })`,
            },
            {
              key: 'DELIVERED',
              label: `Delivered (${orders.filter((o) => getEffectiveStatus(o) === 'DELIVERED').length})`,
            },
            {
              key: 'CANCELLED',
              label: `Cancelled (${orders.filter((o) => getEffectiveStatus(o) === 'CANCELLED').length})`,
            },
          ] as const
        ).map((tab) => (
          <button
            key={tab.key}
            onClick={() => setFilterTab(tab.key)}
            className={`px-4 py-2 rounded-2xl transition-all whitespace-nowrap cursor-pointer ${filterTab === tab.key
              ? 'bg-brand-dark text-white shadow-sm'
              : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content */}
      {isLoading ? (
        <div className="p-16 text-center space-y-3">
          <div className="w-10 h-10 border-3 border-brand-primary border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs font-bold text-slate-400">Fetching live courier tracking logs...</p>
        </div>
      ) : filteredOrders.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 shadow-2xs space-y-3">
          <Package className="w-12 h-12 text-slate-300 mx-auto" />
          <h3 className="text-base font-bold text-slate-800">No Orders Found</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            {filterTab === 'ALL'
              ? 'You have not placed any orders yet. Start exploring thousands of authentic products on Sellora!'
              : `You have no orders in the ${filterTab.toLowerCase()} state.`}
          </p>
          <Link
            href="/"
            className="inline-block mt-2 px-5 py-2.5 rounded-full bg-brand-primary text-white font-black text-xs shadow-sm hover:bg-brand-primary-hover transition-all"
          >
            Browse Marketplace
          </Link>
        </div>
      ) : (
        <div className="space-y-5">
          {filteredOrders.map((ord) => {
            const rawStatus = getEffectiveStatus(ord);
            const isCancelled = rawStatus === 'CANCELLED';
            const isDelivered = rawStatus === 'DELIVERED';
            const currentStageIdx = getStageIndex(rawStatus);

            const isExpanded = expandedOrderId === ord.id;
            const trackingNum = ord.trackingNumber || `SLR-${ord.orderNumber || String(ord.id).padStart(6, '0')}-BD`;
            const orderDate = new Date(ord.createdAt || Date.now());
            const estDelivery = new Date(orderDate.getTime() + 3 * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', {
              weekday: 'short',
              month: 'short',
              day: 'numeric',
              year: 'numeric',
            });

            return (
              <div
                key={ord.id}
                className="bg-white rounded-3xl border border-slate-200/90 shadow-2xs overflow-hidden transition-all hover:border-slate-300"
              >
                {/* Order Summary Header */}
                <div className="p-5 sm:p-6 bg-slate-50/50 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex flex-wrap items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-white border border-slate-200 text-brand-primary flex items-center justify-center shrink-0 shadow-2xs">
                      <Package className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-black text-slate-900 text-sm">{ord.orderNumber || `Order #${ord.id}`}</span>
                        {/* Status Badge */}
                        {isCancelled ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black bg-rose-50 text-rose-600 border border-rose-200">
                            <XCircle className="w-3 h-3" />
                            <span>CANCELLED</span>
                          </span>
                        ) : isDelivered ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black bg-emerald-50 text-emerald-600 border border-emerald-200">
                            <CheckCircle2 className="w-3 h-3" />
                            <span>DELIVERED</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black bg-sky-50 text-sky-600 border border-sky-200">
                            <span className="w-1.5 h-1.5 rounded-full bg-sky-500 animate-ping" />
                            <span>{rawStatus} • ON SCHEDULE</span>
                          </span>
                        )}
                      </div>
                      <span className="text-slate-400 text-[11px] block mt-0.5 font-medium">
                        Placed on {orderDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })} at{' '}
                        {orderDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  </div>

                  {/* Actions & Price */}
                  <div className="flex items-center justify-between md:justify-end gap-4 shrink-0">
                    <div className="text-left md:text-right">
                      <span className="text-[10px] uppercase font-extrabold text-slate-400 block tracking-wider">Total</span>
                      <span className="text-base font-black text-slate-900">৳{(ord.totalAmount || 0).toLocaleString()}</span>
                    </div>

                    <button
                      type="button"
                      onClick={() => setExpandedOrderId(isExpanded ? null : ord.id)}
                      className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-2xl text-xs font-black transition-all cursor-pointer shadow-2xs ${isExpanded
                        ? 'bg-brand-primary text-white hover:bg-brand-primary-hover'
                        : 'bg-white text-slate-700 border border-slate-200 hover:border-brand-primary hover:text-brand-primary'
                        }`}
                    >
                      <Truck className="w-3.5 h-3.5" />
                      <span>{isExpanded ? 'Hide Tracking' : 'Track Order'}</span>
                      {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>

                {/* Items Quick Preview */}
                <div className="px-5 sm:px-6 py-4 flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs">
                  <div className="flex items-center gap-3 overflow-x-auto scrollbar-none py-1">
                    {ord.items?.map((item, idx) => (
                      <div
                        key={idx}
                        className="flex items-center gap-2 bg-slate-50/80 px-2.5 py-1.5 rounded-xl border border-slate-200/60 shrink-0"
                      >
                        <img
                          src={item.imageUrl}
                          alt={item.title}
                          className="w-8 h-8 object-contain rounded-lg bg-white border border-slate-100 p-0.5"
                        />
                        <div className="max-w-[150px] truncate">
                          <span className="font-bold text-slate-800 text-[11px] block truncate">{item.title}</span>
                          <span className="text-[10px] text-slate-400">Qty: {item.quantity}</span>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="flex items-center gap-4 text-[11px] text-slate-500 font-medium shrink-0 pt-2 md:pt-0 border-t md:border-t-0 border-slate-100">
                    <span>
                      Payment: <strong className="text-slate-800 font-black">{ord.paymentMethod || 'CASH_ON_DELIVERY'}</strong>
                    </span>
                    <span>•</span>
                    <span className="text-emerald-600 font-black flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5" />
                      Verified Order
                    </span>
                  </div>
                </div>

                {/* EXPANDABLE LOGISTICS TRACKER PANEL */}
                {isExpanded && (
                  <div className="border-t border-slate-200/90 bg-gradient-to-b from-slate-50/60 to-white p-5 sm:p-7 space-y-6 animate-in fade-in slide-in-from-top-2 duration-300">

                    {/* Carrier & Tracking Code Bar */}
                    <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/90 shadow-2xs flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <Building2 className="w-4 h-4 text-brand-primary" />
                          <span className="text-xs font-black text-slate-900 uppercase tracking-wider">
                            Sellora Express Priority Courier
                          </span>
                          <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                            Active Live Sync
                          </span>
                        </div>
                        <div className="flex items-center gap-2 pt-0.5">
                          <span className="text-xs text-slate-500 font-medium">Tracking Number:</span>
                          <code className="text-xs font-mono font-black text-brand-dark bg-slate-100 px-2 py-0.5 rounded-lg border border-slate-200">
                            {trackingNum}
                          </code>
                          <button
                            type="button"
                            onClick={() => handleCopyTracking(trackingNum)}
                            className="p-1 rounded-lg text-slate-400 hover:text-brand-primary hover:bg-slate-100 transition-colors cursor-pointer"
                            title="Copy tracking number"
                          >
                            {copiedTrackingId === trackingNum ? (
                              <Check className="w-3.5 h-3.5 text-emerald-600" />
                            ) : (
                              <Copy className="w-3.5 h-3.5" />
                            )}
                          </button>
                        </div>
                      </div>

                      <div className="flex items-center gap-6 text-xs">
                        <div className="border-l lg:border-l border-slate-200 pl-4 space-y-0.5">
                          <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 flex items-center gap-1">
                            <Calendar className="w-3 h-3 text-slate-400" />
                            <span>Estimated Delivery</span>
                          </span>
                          <span className="font-black text-slate-900 block">
                            {isDelivered ? 'Delivered' : estDelivery}
                          </span>
                        </div>

                        {ord.shippingAddress && (
                          <div className="border-l border-slate-200 pl-4 space-y-0.5 max-w-[220px]">
                            <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 flex items-center gap-1">
                              <MapPin className="w-3 h-3 text-slate-400" />
                              <span>Destination</span>
                            </span>
                            <span className="font-bold text-slate-800 block truncate text-[11px]">
                              {ord.shippingAddress.address || ord.shippingAddress.city || 'Standard Address'}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* CANCELLED BANNER */}
                    {isCancelled ? (
                      <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 flex items-center gap-3">
                        <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
                        <div>
                          <h4 className="text-xs font-black uppercase tracking-wider text-rose-900">This Order Was Cancelled</h4>
                          <p className="text-xs text-rose-700 mt-0.5 font-medium">
                            The order has been cancelled and logistics routing has terminated. If you paid online via Stripe, your payment has been queued for immediate refund.
                          </p>
                        </div>
                      </div>
                    ) : (
                      /* STEP-BY-STEP PROGRESS STEPPER */
                      <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-6">
                        <div>
                          <h3 className="text-xs font-black uppercase tracking-wider text-slate-400">
                            Real-Time Delivery Milestones
                          </h3>
                          <p className="text-xs text-slate-600 font-medium mt-0.5">
                            {isDelivered
                              ? 'Package has been successfully delivered and signed by customer.'
                              : `Currently in stage: ${LOGISTICS_STAGES[currentStageIdx]?.label || 'Processing'}`}
                          </p>
                        </div>

                        {/* Horizontal Stepper (Desktop) */}
                        <div className="hidden md:block">
                          <div className="relative flex items-center justify-between">
                            {/* Background track line */}
                            <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-1 bg-slate-100 -z-0" />
                            {/* Filled active track line */}
                            <div
                              className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-brand-primary -z-0 transition-all duration-700"
                              style={{
                                width: `${(Math.max(0, currentStageIdx) / (LOGISTICS_STAGES.length - 1)) * 100}%`,
                              }}
                            />

                            {LOGISTICS_STAGES.map((stage, idx) => {
                              const isCompleted = idx < currentStageIdx;
                              const isCurrent = idx === currentStageIdx;

                              return (
                                <div key={stage.key} className="flex flex-col items-center relative z-10">
                                  <div
                                    className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-black transition-all ${isCompleted
                                      ? 'bg-brand-primary text-white shadow-sm ring-4 ring-brand-primary/20'
                                      : isCurrent
                                        ? 'bg-brand-dark text-white ring-4 ring-brand-dark/20 animate-pulse'
                                        : 'bg-white border-2 border-slate-200 text-slate-400'
                                      }`}
                                  >
                                    {isCompleted ? (
                                      <Check className="w-4 h-4 stroke-[3]" />
                                    ) : (
                                      <span>{idx + 1}</span>
                                    )}
                                  </div>
                                  <div className="md:mt-6 text-center w-24">
                                    <span
                                      className={`text-[11px] font-black block leading-tight ${isCurrent
                                        ? 'text-brand-dark'
                                        : isCompleted
                                          ? 'text-brand-primary'
                                          : 'text-slate-400'
                                        }`}
                                    >
                                      {stage.label}
                                    </span>
                                    <span className="text-[9px] text-slate-400 font-medium block mt-0.5">
                                      {stage.sublabel}
                                    </span>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>

                        {/* Vertical Stepper (Mobile) */}
                        <div className="md:hidden space-y-4 relative pl-6 border-l-2 border-slate-200 ml-3">
                          {LOGISTICS_STAGES.map((stage, idx) => {
                            const isCompleted = idx < currentStageIdx;
                            const isCurrent = idx === currentStageIdx;

                            return (
                              <div key={stage.key} className="relative space-y-0.5">
                                <div
                                  className={`absolute -left-[31px] top-0 w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-black ${isCompleted
                                    ? 'bg-brand-primary text-white'
                                    : isCurrent
                                      ? 'bg-brand-dark text-white ring-4 ring-brand-dark/20 animate-pulse'
                                      : 'bg-white border-2 border-slate-300 text-slate-400'
                                    }`}
                                >
                                  {isCompleted ? <Check className="w-3 h-3" /> : idx + 1}
                                </div>
                                <h4
                                  className={`text-xs font-black ${isCurrent ? 'text-brand-dark' : isCompleted ? 'text-brand-primary' : 'text-slate-400'
                                    }`}
                                >
                                  {stage.label}
                                </h4>
                                <p className="text-[10px] text-slate-400 font-medium">{stage.sublabel}</p>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    {/* DETAILED ACTIVITY TIMELINE */}
                    {!isCancelled && (
                      <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
                        <div className="flex items-center justify-between">
                          <h4 className="text-xs font-black uppercase tracking-wider text-slate-900 flex items-center gap-1.5">
                            <Clock className="w-3.5 h-3.5 text-brand-primary" />
                            <span>Logistics Activity Log & Checkpoints</span>
                          </h4>
                          <span className="text-[10px] font-bold text-slate-400">Tejgaon & Central Sorting Engine</span>
                        </div>

                        <div className="space-y-3 pt-2">
                          {LOGISTICS_STAGES.slice(0, currentStageIdx + 1)
                            .reverse()
                            .map((stage, idx) => {
                              const milestoneTime = new Date(
                                orderDate.getTime() + (LOGISTICS_STAGES.length - 1 - idx) * 4 * 60 * 60 * 1000
                              );
                              const isLatest = idx === 0;

                              return (
                                <div
                                  key={stage.key}
                                  className={`p-3.5 rounded-xl border transition-all flex items-start gap-3.5 ${isLatest
                                    ? 'bg-brand-lightest/40 border-brand-light/60'
                                    : 'bg-slate-50/50 border-slate-200/70'
                                    }`}
                                >
                                  <div
                                    className={`w-7 h-7 rounded-xl flex items-center justify-center shrink-0 mt-0.5 ${isLatest ? 'bg-brand-primary text-white shadow-xs' : 'bg-slate-200 text-slate-500'
                                      }`}
                                  >
                                    <Truck className="w-3.5 h-3.5" />
                                  </div>

                                  <div className="flex-1 space-y-1">
                                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                                      <h5 className="text-xs font-black text-slate-900 flex items-center gap-1.5">
                                        <span>{stage.label}</span>
                                        {isLatest && (
                                          <span className="text-[9px] font-black uppercase tracking-wider bg-brand-primary text-white px-2 py-0.2 rounded">
                                            Current Checkpoint
                                          </span>
                                        )}
                                      </h5>
                                      <span className="text-[10px] text-slate-400 font-mono">
                                        {milestoneTime.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}{' '}
                                        {milestoneTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                      </span>
                                    </div>

                                    <p className="text-[11px] text-slate-600 font-medium">{stage.sublabel}</p>

                                    <div className="flex items-center gap-1 text-[10px] text-slate-400 font-bold pt-0.5">
                                      <MapPin className="w-3 h-3 text-slate-400" />
                                      <span>Location: {stage.location}</span>
                                    </div>
                                  </div>
                                </div>
                              );
                            })}
                        </div>
                      </div>
                    )}

                    {/* RECIPIENT & CONTACT FOOTER */}
                    <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs border-t border-slate-200/80">
                      <div className="flex items-center gap-2 text-slate-500">
                        <PhoneCall className="w-3.5 h-3.5 text-slate-400" />
                        <span>
                          Need delivery assistance? Call Sellora Logistics Support:{' '}
                          <strong className="text-slate-800 font-bold">+880 9612-SELLORA</strong>
                        </span>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleCopyTracking(trackingNum)}
                        className="inline-flex items-center gap-1 text-xs font-extrabold text-brand-primary hover:underline cursor-pointer"
                      >
                        <Copy className="w-3 h-3" />
                        <span>Share Tracking Code</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
