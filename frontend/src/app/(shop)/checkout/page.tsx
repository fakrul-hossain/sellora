'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  CheckCircle2, 
  CreditCard, 
  Banknote, 
  ShoppingBag, 
  ArrowRight, 
  Lock, 
  ShieldCheck, 
  Info,
  Sparkles
} from 'lucide-react';
import { ApiClient } from '@/lib/api-client';
import { useCart } from '@/providers/cart-context';
import { useAuth } from '@/providers/auth-context';
import { useToast } from '@/components/ui/toast';
import { motion, AnimatePresence } from 'framer-motion';

export const dynamic = 'force-dynamic';

export default function CheckoutPage() {
  const router = useRouter();
  const { cartItems, subtotal, clearCart } = useCart();
  const { user, isLoading: isAuthLoading } = useAuth();
  const toast = useToast();

  const [paymentMethod, setPaymentMethod] = useState<'cod' | 'card' | 'bkash' | 'nagad'>('card');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [orderNumber, setOrderNumber] = useState('');
  const [confirmedPaymentStatus, setConfirmedPaymentStatus] = useState<'PAID' | 'PENDING'>('PAID');
  const [confirmedTxnId, setConfirmedTxnId] = useState('');

  // Customer Delivery Info
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [city, setCity] = useState('Dhaka');
  const [street, setStreet] = useState('');

  // Stripe Card Details
  const [cardNumber, setCardNumber] = useState('4242 4242 4242 4242');
  const [cardExpiry, setCardExpiry] = useState('12/28');
  const [cardCvc, setCardCvc] = useState('123');
  const [cardholderName, setCardholderName] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);

  const shippingFee = cartItems.length > 0 ? 60 : 0;
  const grandTotal = subtotal + shippingFee;

  // Auto pre-fill customer details from logged-in account
  useEffect(() => {
    if (user) {
      if (user.name) {
        setFullName(user.name);
        setCardholderName(user.name);
      }
      const userAny = user as any;
      if (userAny.phone || userAny.mobile) {
        setPhone(userAny.phone || userAny.mobile);
      }
      if (user.addresses && user.addresses.length > 0) {
        const primary = user.addresses[0];
        if (primary.city) setCity(primary.city);
        if (primary.street) setStreet(primary.street);
      } else if (userAny.address) {
        setStreet(userAny.address);
      }
    }
  }, [user]);

  // Format Card Number input with spaces
  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value.replace(/\D/g, '').slice(0, 16);
    let formatted = val.match(/.{1,4}/g)?.join(' ') || val;
    setCardNumber(formatted);
  };

  // Format Card Expiry MM/YY
  const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value.replace(/\D/g, '').slice(0, 4);
    if (val.length >= 2) {
      val = `${val.slice(0, 2)}/${val.slice(2)}`;
    }
    setCardExpiry(val);
  };

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();

    // 1. Enforce user authentication
    if (!user) {
      toast.error('You must be logged in to place an order.', 'Authentication Required');
      router.push('/login?redirect=/checkout');
      return;
    }

    if (cartItems.length === 0) {
      toast.error('Your cart is empty!', 'Checkout Error');
      return;
    }

    if (paymentMethod === 'card') {
      const cleanNum = cardNumber.replace(/\s+/g, '');
      if (cleanNum.length < 15) {
        toast.error('Please enter a valid credit/debit card number', 'Payment Error');
        return;
      }
      if (!cardExpiry.includes('/') || cardExpiry.length < 5) {
        toast.error('Please enter a valid expiry date (MM/YY)', 'Payment Error');
        return;
      }
      if (cardCvc.length < 3) {
        toast.error('Please enter a valid 3-digit CVC security code', 'Payment Error');
        return;
      }
    }

    setIsSubmitting(true);

    try {
      const paymentMethodMap: Record<string, string> = {
        cod: 'CASH_ON_DELIVERY',
        card: 'STRIPE',
        stripe: 'STRIPE',
        STRIPE: 'STRIPE',
        STRIPE_CARD: 'STRIPE',
        bkash: 'BKASH',
        nagad: 'NAGAD',
      };

      // 2. Prepare Order Payload for Backend
      const orderPayload = {
        items: cartItems.map((item) => ({
          productId: item.product.id,
          vendorId: item.product.vendorId || '1',
          title: item.product.title,
          imageUrl: item.product.imageUrl,
          price: item.product.price,
          quantity: item.quantity,
        })),
        shippingAddress: {
          fullName,
          phone,
          street,
          city,
          area: 'Central Zone',
        },
        paymentMethod: paymentMethodMap[paymentMethod] || 'CASH_ON_DELIVERY',
      };

      // 3. Create the Order in MySQL
      const orderData = await ApiClient.post<any>('/orders', orderPayload);
      const createdOrderId = orderData?.id;
      const refNum = orderData?.orderNumber || `ORD-${Date.now()}`;

      // 4. Handle Payment based on selected method
      if (paymentMethod === 'card') {
        // Step 4a: Create Stripe PaymentIntent via Backend
        const intentRes = await ApiClient.post<any>('/payments/create-intent', {
          amount: grandTotal,
          orderId: createdOrderId,
          customerEmail: user.email,
        });

        const txnId = intentRes?.paymentIntentId || `TRX-STRIPE-${Date.now()}`;

        // Step 4b: Confirm Payment and update order to PAID in MySQL
        await ApiClient.post<any>('/payments/confirm', {
          orderId: createdOrderId,
          orderNumber: refNum,
          paymentIntentId: txnId,
          amount: grandTotal,
          paymentMethod: 'STRIPE',
        });

        setConfirmedPaymentStatus('PAID');
        setConfirmedTxnId(txnId);
        toast.success('Stripe payment verified and processed successfully!', 'Payment Received');
      } else {
        // Cash on Delivery
        setConfirmedPaymentStatus('PENDING');
        setConfirmedTxnId('PAY-ON-DELIVERY');
        toast.success(`Order placed with Cash on Delivery!`, 'Order Placed');
      }

      setOrderNumber(refNum);
      setIsModalOpen(true);
      clearCart();
    } catch (err: any) {
      toast.error(err.message || 'Failed to complete order. Please try again.', 'Order Error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAFAFA] flex flex-col justify-between font-sans text-slate-800">
      <main className="flex-1 py-8">
        <div className="max-w-[1536px] mx-auto px-4 space-y-6">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-black text-brand-dark">Checkout & Payment</h1>
            {user && (
              <div className="text-xs font-bold text-slate-500 bg-white border border-slate-200 px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-2xs">
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                <span>Logged in as <strong>{user.name}</strong></span>
              </div>
            )}
          </div>

          {/* 1. Unauthenticated Login Gate */}
          {!isAuthLoading && !user ? (
            <div className="bg-white rounded-3xl p-8 sm:p-12 text-center border border-slate-200 shadow-2xs space-y-5 max-w-lg mx-auto">
              <div className="w-16 h-16 rounded-2xl bg-brand-lightest text-brand-primary flex items-center justify-center mx-auto shadow-sm">
                <Lock className="w-8 h-8" />
              </div>
              <div className="space-y-2">
                <h2 className="text-2xl font-black text-brand-dark">Sign In to Complete Purchase</h2>
                <p className="text-xs text-slate-500 max-w-md mx-auto">
                  To ensure order security, delivery tracking, and warranty service, customers must be signed in before completing checkout.
                </p>
              </div>
              <div className="pt-2 flex flex-col sm:flex-row gap-3">
                <Link
                  href="/login?redirect=/checkout"
                  className="flex-1 py-3.5 px-6 rounded-full bg-brand-primary hover:bg-brand-primary-hover text-white font-extrabold text-xs shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>Log In to Continue</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  href="/register?redirect=/checkout"
                  className="flex-1 py-3.5 px-6 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-800 font-extrabold text-xs transition-all flex items-center justify-center cursor-pointer"
                >
                  Create Account
                </Link>
              </div>
            </div>
          ) : cartItems.length === 0 && !isModalOpen ? (
            <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 shadow-2xs space-y-4 max-w-lg mx-auto">
              <ShoppingBag className="w-12 h-12 text-slate-300 mx-auto" />
              <h2 className="text-xl font-bold text-slate-800">No items to checkout</h2>
              <p className="text-xs text-slate-500">Your cart is currently empty. Please add items before checking out.</p>
              <Link href="/" className="inline-block px-8 py-3 rounded-full bg-brand-primary text-white font-bold text-xs">
                Browse Products
              </Link>
            </div>
          ) : (
            <form onSubmit={handlePlaceOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
              {/* Delivery & Payment Columns */}
              <div className="lg:col-span-8 space-y-6">
                {/* Delivery Address Form */}
                <div className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-8 border border-slate-200/80 shadow-2xs space-y-4">
                  <h3 className="text-sm font-extrabold text-brand-dark border-b border-slate-100 pb-3 flex items-center justify-between">
                    <span>1. Shipping Details</span>
                    <span className="text-xs font-semibold text-slate-400">Doorstep Delivery</span>
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                    <div>
                      <label className="block text-slate-600 font-bold mb-1">Full Recipient Name</label>
                      <input
                        type="text"
                        required
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        placeholder="e.g. Rafiqul Hossain"
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 px-3 font-medium text-slate-800 focus:outline-none focus:border-brand-primary"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-600 font-bold mb-1">Mobile Contact (+880)</label>
                      <input
                        type="tel"
                        required
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="01712345678"
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 px-3 font-medium text-slate-800 focus:outline-none focus:border-brand-primary"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-600 font-bold mb-1">City / Region</label>
                      <select 
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 px-3 font-medium text-slate-800 focus:outline-none"
                      >
                        <option>Dhaka</option>
                        <option>Chattogram</option>
                        <option>Sylhet</option>
                        <option>Rajshahi</option>
                        <option>Khulna</option>
                        <option>Barishal</option>
                        <option>Rangpur</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-slate-600 font-bold mb-1">Area / Sub-district</label>
                      <input
                        type="text"
                        required
                        defaultValue="Central"
                        placeholder="e.g. Dhanmondi / Zindabazar"
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 px-3 font-medium text-slate-800 focus:outline-none focus:border-brand-primary"
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="block text-slate-600 font-bold mb-1">Detailed Street Address</label>
                      <input
                        type="text"
                        required
                        value={street}
                        onChange={(e) => setStreet(e.target.value)}
                        placeholder="House, Road, Apartment or Landmark"
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 px-3 font-medium text-slate-800 focus:outline-none focus:border-brand-primary"
                      />
                    </div>
                  </div>
                </div>

                {/* Payment Method Selector */}
                <div className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-8 border border-slate-200/80 shadow-2xs space-y-5">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                    <h3 className="text-sm font-extrabold text-brand-dark">
                      2. Payment Method
                    </h3>
                    <div className="flex items-center gap-1 text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full">
                      <ShieldCheck className="w-3.5 h-3.5" />
                      <span>SSL 256-Bit</span>
                    </div>
                  </div>

                  {/* Payment Tabs Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 text-xs">
                    {/* Stripe Card Option */}
                    <label
                      onClick={() => setPaymentMethod('card')}
                      className={`p-4 rounded-2xl border cursor-pointer flex items-start space-x-3.5 transition-all relative ${
                        paymentMethod === 'card' 
                          ? 'border-brand-primary bg-brand-lightest/40 ring-2 ring-brand-primary/20 shadow-xs' 
                          : 'border-slate-200 bg-white hover:border-slate-300'
                      }`}
                    >
                      <div className="w-14 h-11 rounded-xl bg-white p-1 border border-slate-200 flex items-center justify-center shrink-0 shadow-2xs">
                        <img src="/images/stripe.png" alt="Stripe Cards" className="h-5 w-auto object-contain" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <span className="font-extrabold text-slate-900 block text-sm">Credit / Debit Card</span>
                          <span className="bg-blue-600 text-white text-[9px] font-black px-1.5 py-0.5 rounded tracking-wider">STRIPE</span>
                        </div>
                        <span className="text-[11px] text-slate-500 block mt-0.5">Visa, Mastercard, Amex</span>
                      </div>
                    </label>

                    {/* Cash on Delivery Option */}
                    <label
                      onClick={() => setPaymentMethod('cod')}
                      className={`p-4 rounded-2xl border cursor-pointer flex items-start space-x-3.5 transition-all ${
                        paymentMethod === 'cod' 
                          ? 'border-brand-primary bg-brand-lightest/40 ring-2 ring-brand-primary/20 shadow-xs' 
                          : 'border-slate-200 bg-white hover:border-slate-300'
                      }`}
                    >
                      <div className="w-14 h-11 rounded-xl bg-white p-1 border border-slate-200 flex items-center justify-center shrink-0 shadow-2xs">
                        <img src="/images/cod.avif" alt="Cash on Delivery" className="h-7 w-auto object-contain" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <span className="font-extrabold text-slate-900 block text-sm">Cash on Delivery</span>
                        <span className="text-[11px] text-slate-500 block mt-0.5">Pay in cash when package arrives</span>
                      </div>
                    </label>

                    {/* bKash Mobile Wallet */}
                    <label
                      onClick={() => setPaymentMethod('bkash')}
                      className={`p-4 rounded-2xl border cursor-pointer flex items-start space-x-3.5 transition-all ${
                        paymentMethod === 'bkash' 
                          ? 'border-brand-primary bg-brand-lightest/40 ring-2 ring-brand-primary/20 shadow-xs' 
                          : 'border-slate-200 bg-white hover:border-slate-300'
                      }`}
                    >
                      <div className="w-14 h-11 rounded-xl bg-white p-1 border border-slate-200 flex items-center justify-center shrink-0 shadow-2xs">
                        <img src="/images/bkash_logo.avif" alt="bKash" className="h-7 w-auto object-contain" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <span className="font-extrabold text-slate-900 block text-sm">bKash Payment</span>
                        <span className="text-[11px] text-slate-500 block mt-0.5">Instant mobile wallet checkout</span>
                      </div>
                    </label>

                    {/* Upay / Nagad Mobile Wallet */}
                    <label
                      onClick={() => setPaymentMethod('nagad')}
                      className={`p-4 rounded-2xl border cursor-pointer flex items-start space-x-3.5 transition-all ${
                        paymentMethod === 'nagad' 
                          ? 'border-brand-primary bg-brand-lightest/40 ring-2 ring-brand-primary/20 shadow-xs' 
                          : 'border-slate-200 bg-white hover:border-slate-300'
                      }`}
                    >
                      <div className="w-14 h-11 rounded-xl bg-white p-1 border border-slate-200 flex items-center justify-center shrink-0 shadow-2xs">
                        <img src="/images/upay2.svg" alt="Upay" className="h-7 w-auto object-contain" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <span className="font-extrabold text-slate-900 block text-sm">Upay / Nagad Payment</span>
                        <span className="text-[11px] text-slate-500 block mt-0.5">Fast 1-step gateway checkout</span>
                      </div>
                    </label>
                  </div>

                  {/* Dynamic Stripe Card Form */}
                  {paymentMethod === 'card' && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="p-5 rounded-2xl bg-slate-50/80 border border-slate-200/90 space-y-4"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-black text-slate-800 flex items-center gap-2">
                          <img src="/images/stripe.png" alt="Stripe" className="h-4 w-auto object-contain" />
                          <span>Enter Card Details (Powered by Stripe)</span>
                        </span>
                        <span className="text-[10px] font-bold text-slate-400">Test Card Ready</span>
                      </div>

                      <div className="space-y-3 text-xs">
                        <div>
                          <label className="block text-slate-600 font-bold mb-1">Card Number</label>
                          <input
                            type="text"
                            required
                            value={cardNumber}
                            onChange={handleCardNumberChange}
                            placeholder="4242 4242 4242 4242"
                            className="w-full bg-white border border-slate-300 rounded-xl py-2.5 px-3 font-mono font-bold text-slate-800 tracking-wider focus:outline-none focus:border-brand-primary"
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="block text-slate-600 font-bold mb-1">Expiration (MM/YY)</label>
                            <input
                              type="text"
                              required
                              value={cardExpiry}
                              onChange={handleExpiryChange}
                              placeholder="MM/YY"
                              className="w-full bg-white border border-slate-300 rounded-xl py-2.5 px-3 font-mono font-bold text-slate-800 focus:outline-none focus:border-brand-primary"
                            />
                          </div>
                          <div>
                            <label className="block text-slate-600 font-bold mb-1">Security Code (CVC)</label>
                            <input
                              type="password"
                              required
                              maxLength={4}
                              value={cardCvc}
                              onChange={(e) => setCardCvc(e.target.value)}
                              placeholder="123"
                              className="w-full bg-white border border-slate-300 rounded-xl py-2.5 px-3 font-mono font-bold text-slate-800 focus:outline-none focus:border-brand-primary"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-slate-600 font-bold mb-1">Name on Card</label>
                          <input
                            type="text"
                            required
                            value={cardholderName}
                            onChange={(e) => setCardholderName(e.target.value)}
                            placeholder="Cardholder Full Name"
                            className="w-full bg-white border border-slate-300 rounded-xl py-2.5 px-3 font-medium text-slate-800 focus:outline-none focus:border-brand-primary"
                          />
                        </div>
                      </div>

                      <div className="p-3 rounded-xl bg-blue-50/70 border border-blue-100/80 text-[11px] text-blue-700 flex items-center gap-2">
                        <Info className="w-4 h-4 text-blue-500 shrink-0" />
                        <span>Development Mode: You can use test card <strong>4242 •••• •••• 4242</strong> with any future expiration date.</span>
                      </div>
                    </motion.div>
                  )}

                  {/* Cash on Delivery Notice */}
                  {paymentMethod === 'cod' && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="p-4 rounded-2xl bg-emerald-50/60 border border-emerald-100 text-xs text-emerald-800 flex items-center gap-3.5"
                    >
                      <div className="w-12 h-12 rounded-xl bg-white p-1 border border-emerald-200 flex items-center justify-center shrink-0 shadow-2xs">
                        <img src="/images/cod.avif" alt="Cash on Delivery" className="h-8 w-auto object-contain" />
                      </div>
                      <div>
                        <strong className="block font-bold">Pay in Cash at Doorstep</strong>
                        <span className="text-[11px] text-emerald-700">Please keep the exact amount of ৳{grandTotal.toLocaleString()} ready for the courier.</span>
                      </div>
                    </motion.div>
                  )}
                </div>
              </div>

              {/* Order Summary Side Card */}
              <div className="lg:col-span-4">
                <div className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-6 border border-slate-200 shadow-2xs space-y-4 lg:sticky top-24">
                  <h3 className="text-sm font-extrabold text-brand-dark pb-3 border-b border-slate-100 flex items-center justify-between">
                    <span>Order Summary</span>
                    <span className="text-xs text-slate-400 font-bold">({cartItems.length} items)</span>
                  </h3>

                  <div className="space-y-3 text-xs max-h-60 overflow-y-auto pr-1">
                    {cartItems.map((item) => (
                      <div key={item.product.id} className="flex items-center justify-between text-slate-700 gap-2">
                        <div className="flex items-center gap-2 min-w-0">
                          <img src={item.product.imageUrl} alt="" className="w-8 h-8 rounded-lg object-contain bg-slate-50 shrink-0 border border-slate-100" />
                          <span className="truncate font-medium">{item.product.title} (x{item.quantity})</span>
                        </div>
                        <span className="font-bold shrink-0">৳{(item.product.price * item.quantity).toLocaleString()}</span>
                      </div>
                    ))}

                    <div className="pt-2 border-t border-slate-100 flex justify-between text-slate-600">
                      <span>Subtotal</span>
                      <span className="font-bold text-slate-900">৳{subtotal.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-slate-600">
                      <span>Nationwide Shipping</span>
                      <span className="font-bold text-slate-900">৳{shippingFee}</span>
                    </div>
                    <div className="pt-3 border-t border-slate-100 flex justify-between text-sm font-black text-slate-900">
                      <span>Total Amount</span>
                      <span className="text-brand-primary text-base">৳{grandTotal.toLocaleString()}</span>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-4 rounded-2xl bg-brand-primary text-white font-extrabold text-xs hover:bg-brand-primary-hover transition-all shadow-md hover:shadow-lg cursor-pointer mt-4 disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {isSubmitting ? (
                      <span>Processing Payment...</span>
                    ) : paymentMethod === 'card' ? (
                      <>
                        <Lock className="w-4 h-4" />
                        <span>Pay ৳{grandTotal.toLocaleString()} via Stripe</span>
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4 text-amber-300" />
                        <span>Place Order (৳{grandTotal.toLocaleString()})</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </form>
          )}
        </div>
      </main>

      {/* Order Success Confirmation Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-white rounded-3xl p-8 max-w-lg w-full shadow-2xl text-center border border-slate-200 space-y-6"
            >
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-sm">
                <CheckCircle2 className="w-10 h-10" />
              </div>

              <div className="space-y-2">
                <h2 className="text-2xl font-black text-slate-900">Order Placed Successfully!</h2>
                <p className="text-xs text-slate-500">
                  Thank you for shopping with SELLORA. Your confirmed order number is{' '}
                  <strong className="text-brand-primary font-black">{orderNumber}</strong>.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 text-left text-xs space-y-2 font-medium text-slate-600">
                <div><strong className="text-slate-800">Customer:</strong> {fullName} ({phone})</div>
                <div><strong className="text-slate-800">Shipping Address:</strong> {street}, {city}</div>
                <div className="flex items-center justify-between pt-1 border-t border-slate-200">
                  <div>
                    <strong className="text-slate-800">Payment Method:</strong>{' '}
                    {paymentMethod === 'card' ? 'Debit/Credit Card (Stripe)' : paymentMethod === 'cod' ? 'Cash on Delivery' : paymentMethod.toUpperCase()}
                  </div>
                  <span className={`text-[10px] font-black px-2 py-0.5 rounded ${
                    confirmedPaymentStatus === 'PAID' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                  }`}>
                    {confirmedPaymentStatus}
                  </span>
                </div>
                {confirmedTxnId && confirmedTxnId !== 'PAY-ON-DELIVERY' && (
                  <div className="text-[11px] text-slate-400 truncate">
                    <strong>Transaction ID:</strong> {confirmedTxnId}
                  </div>
                )}
              </div>

              <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
                <button
                  onClick={() => {
                    setIsModalOpen(false);
                    router.push('/dashboard/orders');
                  }}
                  className="w-full py-3.5 rounded-2xl bg-brand-primary text-white font-extrabold text-xs hover:bg-brand-primary-hover transition-colors shadow-md cursor-pointer flex items-center justify-center gap-2"
                >
                  <span>View in My Orders</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <button
                  onClick={() => {
                    setIsModalOpen(false);
                    router.push('/');
                  }}
                  className="w-full py-3.5 rounded-2xl bg-slate-100 text-slate-800 font-extrabold text-xs hover:bg-slate-200 transition-colors cursor-pointer"
                >
                  Continue Shopping
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
