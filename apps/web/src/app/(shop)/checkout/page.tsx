'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ShieldCheck, CheckCircle2, CreditCard, Banknote } from 'lucide-react';
import { ApiClient } from '@/lib/api-client';
import { mockProducts } from '@/lib/products-data';

export const dynamic = 'force-dynamic';

export default function CheckoutPage() {
  const [paymentMethod, setPaymentMethod] = useState<'cod' | 'bkash' | 'nagad' | 'card'>('cod');
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [orderNumber, setOrderNumber] = useState('');

  const [fullName, setFullName] = useState('Tanvir Hossain');
  const [phone, setPhone] = useState('01712345678');
  const [city, setCity] = useState('Dhanmondi, Dhaka');
  const [street, setStreet] = useState('House 42, Road 9A, Dhanmondi, Dhaka');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const subtotal = mockProducts[0].price + mockProducts[1].price;
  const shippingFee = 60;
  const grandTotal = subtotal + shippingFee;

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const paymentMethodMap: Record<string, string> = {
        cod: 'CASH_ON_DELIVERY',
        bkash: 'BKASH',
        nagad: 'NAGAD',
        card: 'SSL_COMMERZ',
      };

      const orderData = await ApiClient.post<any>('/orders', {
        items: [
          {
            productId: mockProducts[0].id,
            vendorId: 'v-remax-001',
            title: mockProducts[0].title,
            imageUrl: mockProducts[0].imageUrl,
            price: mockProducts[0].price,
            quantity: 1,
          },
          {
            productId: mockProducts[1].id,
            vendorId: 'v-remax-001',
            title: mockProducts[1].title,
            imageUrl: mockProducts[1].imageUrl,
            price: mockProducts[1].price,
            quantity: 1,
          },
        ],
        shippingAddress: {
          fullName,
          phone,
          street,
          city,
          area: 'Central',
        },
        paymentMethod: paymentMethodMap[paymentMethod] || 'CASH_ON_DELIVERY',
      });

      setOrderNumber(orderData.orderNumber || '#SLR-984021');
      setOrderSuccess(true);
    } catch (err: any) {
      alert(err.message || 'Please log in to place an order.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAFAFA] flex flex-col justify-between font-sans text-slate-800">

      <main className="flex-1 py-8">
        <div className="max-w-[1536px] mx-auto px-4 space-y-6">

          <h1 className="text-2xl font-black text-brand-dark">Checkout & Payment</h1>

          {orderSuccess ? (
            <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 shadow-2xs space-y-4 max-w-lg mx-auto">
              <CheckCircle2 className="w-16 h-16 text-brand-primary mx-auto" />
              <h2 className="text-xl font-black text-brand-dark">Order Placed Successfully!</h2>
              <p className="text-xs text-slate-500 leading-relaxed">
                Thank you for shopping with Sellora. Your order reference is <strong className="text-slate-800">{orderNumber}</strong>.
              </p>
              <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
                <Link href="/dashboard" className="inline-block px-8 py-3 rounded-full bg-brand-primary hover:bg-brand-primary-hover text-white font-bold text-xs">
                  Track in Customer Dashboard
                </Link>
              </div>
            </div>
          ) : (
            <form onSubmit={handlePlaceOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-8">

              {/* Delivery Details Form */}
              <div className="lg:col-span-8 space-y-6">

                {/* Delivery Address */}
                <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-2xs space-y-4">
                  <h3 className="text-sm font-extrabold text-brand-dark border-b border-slate-100 pb-3">
                    1. Shipping Address (Bangladesh)
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                    <div>
                      <label className="block text-slate-600 font-bold mb-1">Full Name</label>
                      <input
                        type="text"
                        required
                        defaultValue="Tanvir Hossain"
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 px-3 font-medium text-slate-800 focus:outline-none focus:border-brand-primary"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-600 font-bold mb-1">Mobile Number (+880)</label>
                      <input
                        type="tel"
                        required
                        defaultValue="01712345678"
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 px-3 font-medium text-slate-800 focus:outline-none focus:border-brand-primary"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-600 font-bold mb-1">Division</label>
                      <select className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 px-3 font-medium text-slate-800 focus:outline-none">
                        <option>Dhaka</option>
                        <option>Chittagong</option>
                        <option>Sylhet</option>
                        <option>Rajshahi</option>
                        <option>Khulna</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-slate-600 font-bold mb-1">City / Area</label>
                      <input
                        type="text"
                        required
                        defaultValue="Dhanmondi, Dhaka"
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 px-3 font-medium text-slate-800 focus:outline-none focus:border-brand-primary"
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="block text-slate-600 font-bold mb-1">Full Delivery Address</label>
                      <input
                        type="text"
                        required
                        defaultValue="House 42, Road 9A, Dhanmondi, Dhaka"
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 px-3 font-medium text-slate-800 focus:outline-none focus:border-brand-primary"
                      />
                    </div>
                  </div>
                </div>

                {/* Payment Method Selector */}
                <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-2xs space-y-4">
                  <h3 className="text-sm font-extrabold text-brand-dark border-b border-slate-100 pb-3">
                    2. Select Payment Method
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <label
                      onClick={() => setPaymentMethod('cod')}
                      className={`p-4 rounded-2xl border cursor-pointer flex items-center space-x-3 transition-all ${paymentMethod === 'cod' ? 'border-brand-primary bg-brand-lightest/40' : 'border-slate-200 bg-white'
                        }`}
                    >
                      <Banknote className="w-5 h-5 text-brand-primary" />
                      <div>
                        <span className="font-bold text-slate-900 block">Cash on Delivery</span>
                        <span className="text-[10px] text-slate-500">Pay when you receive package</span>
                      </div>
                    </label>

                    <label
                      onClick={() => setPaymentMethod('bkash')}
                      className={`p-4 rounded-2xl border cursor-pointer flex items-center space-x-3 transition-all ${paymentMethod === 'bkash' ? 'border-brand-primary bg-brand-lightest/40' : 'border-slate-200 bg-white'
                        }`}
                    >
                      <span className="font-black text-brand-primary text-sm">bKash</span>
                      <div>
                        <span className="font-bold text-slate-900 block">bKash Online Payment</span>
                        <span className="text-[10px] text-slate-500">Instant mobile wallet checkout</span>
                      </div>
                    </label>

                    <label
                      onClick={() => setPaymentMethod('nagad')}
                      className={`p-4 rounded-2xl border cursor-pointer flex items-center space-x-3 transition-all ${paymentMethod === 'nagad' ? 'border-brand-primary bg-brand-lightest/40' : 'border-slate-200 bg-white'
                        }`}
                    >
                      <span className="font-black text-orange-600 text-sm">Nagad</span>
                      <div>
                        <span className="font-bold text-slate-900 block">Nagad Online Payment</span>
                        <span className="text-[10px] text-slate-500">Fast 1-step gateway checkout</span>
                      </div>
                    </label>

                    <label
                      onClick={() => setPaymentMethod('card')}
                      className={`p-4 rounded-2xl border cursor-pointer flex items-center space-x-3 transition-all ${paymentMethod === 'card' ? 'border-brand-primary bg-brand-lightest/40' : 'border-slate-200 bg-white'
                        }`}
                    >
                      <CreditCard className="w-5 h-5 text-blue-600" />
                      <div>
                        <span className="font-bold text-slate-900 block">Debit / Credit Card</span>
                        <span className="text-[10px] text-slate-500">VISA, Mastercard, SSLCommerz</span>
                      </div>
                    </label>
                  </div>
                </div>

              </div>

              {/* Order Summary */}
              <div className="lg:col-span-4">
                <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-2xs space-y-4 sticky top-24">
                  <h3 className="text-sm font-extrabold text-brand-dark pb-3 border-b border-slate-100">Order Summary</h3>

                  <div className="space-y-3 text-xs">
                    <div className="flex items-center justify-between text-slate-700">
                      <span>Remax 200h Neckband</span>
                      <span className="font-bold">৳349</span>
                    </div>
                    <div className="flex items-center justify-between text-slate-700">
                      <span>Baseus Power Bank 10000mAh</span>
                      <span className="font-bold">৳1,250</span>
                    </div>
                    <div className="pt-2 border-t border-slate-100 flex justify-between text-slate-600">
                      <span>Subtotal</span>
                      <span className="font-bold text-slate-900">৳{subtotal.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-slate-600">
                      <span>Shipping Fee</span>
                      <span className="font-bold text-slate-900">৳{shippingFee}</span>
                    </div>
                    <div className="pt-3 border-t border-slate-100 flex justify-between text-sm font-black text-slate-900">
                      <span>Total Payable</span>
                      <span className="text-brand-primary">৳{grandTotal.toLocaleString()}</span>
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3.5 rounded-full bg-brand-primary text-white font-extrabold text-xs hover:bg-brand-primary-hover transition-colors shadow-sm cursor-pointer mt-4"
                  >
                    Place Order (৳{grandTotal.toLocaleString()})
                  </button>
                </div>
              </div>

            </form>
          )}

        </div>
      </main>

    </div>
  );
}
