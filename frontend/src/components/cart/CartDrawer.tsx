'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ShoppingBag, Trash2, ArrowRight, Truck, ShieldCheck, Sparkles } from 'lucide-react';
import { useCart } from '@/providers/cart-context';

export function CartDrawer() {
  const router = useRouter();
  const {
    cartItems,
    isCartOpen,
    closeCart,
    updateQuantity,
    removeFromCart,
    subtotal,
    totalItemsCount,
  } = useCart();

  const freeShippingThreshold = 2000;
  const progressPercent = Math.min(100, Math.round((subtotal / freeShippingThreshold) * 100));
  const amountLeftForFreeShipping = Math.max(0, freeShippingThreshold - subtotal);
  const shippingFee = cartItems.length > 0 ? (subtotal >= freeShippingThreshold ? 0 : 60) : 0;
  const grandTotal = subtotal + shippingFee;

  const handleCheckout = () => {
    closeCart();
    router.push('/checkout');
  };

  const handleViewCart = () => {
    closeCart();
    router.push('/cart');
  };

  return (
    <AnimatePresence>
      {isCartOpen && (
        <>
          {/* Backdrop Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeCart}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs transition-opacity"
          />

          {/* Slide-over Right Drawer Container */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', stiffness: 350, damping: 35 }}
            className="fixed inset-y-0 right-0 z-50 w-full sm:w-[440px] bg-white shadow-2xl flex flex-col font-sans text-slate-800"
          >
            {/* 1. Header Bar */}
            <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/80">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-brand-primary/10 text-brand-primary flex items-center justify-center font-black">
                  <ShoppingBag className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-black text-slate-900 leading-none">Your Shopping Cart</h3>
                  <span className="text-xs text-slate-500 font-bold mt-0.5 block">
                    {totalItemsCount} {totalItemsCount === 1 ? 'item' : 'items'} selected
                  </span>
                </div>
              </div>

              <button
                onClick={closeCart}
                className="p-2 rounded-full hover:bg-slate-200/70 text-slate-500 hover:text-slate-900 transition-colors cursor-pointer"
                title="Close Cart Drawer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* 2. Free Shipping Threshold Progress Indicator */}
            <div className="bg-brand-dark/95 text-white p-3.5 text-xs border-b border-brand-dark">
              <div className="flex items-center justify-between font-bold mb-1.5 text-[11px]">
                <span className="flex items-center gap-1.5 text-brand-light">
                  <Truck className="w-3.5 h-3.5" />
                  {amountLeftForFreeShipping === 0 ? (
                    <span className="text-emerald-300">🎉 Congratulations! You unlocked FREE Express Shipping!</span>
                  ) : (
                    <span>Add ৳{amountLeftForFreeShipping.toLocaleString()} more for FREE Shipping</span>
                  )}
                </span>
                <span className="text-brand-lightest/80">{progressPercent}%</span>
              </div>
              <div className="w-full bg-brand-dark/80 rounded-full h-1.5 overflow-hidden border border-brand-light/20">
                <div
                  className="bg-brand-primary h-full rounded-full transition-all duration-500"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>

            {/* 3. Items List Body */}
            <div className="flex-1 overflow-y-auto p-5 space-y-4 scrollbar-thin">
              {cartItems.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-3">
                  <div className="w-16 h-16 rounded-3xl bg-slate-100 flex items-center justify-center text-slate-300">
                    <ShoppingBag className="w-8 h-8" />
                  </div>
                  <h4 className="text-sm font-bold text-slate-800">Your cart is empty</h4>
                  <p className="text-xs text-slate-500 max-w-xs">
                    Explore our categories and add products to start shopping.
                  </p>
                  <button
                    onClick={closeCart}
                    className="px-6 py-2.5 rounded-full bg-brand-primary text-white font-extrabold text-xs shadow-sm hover:bg-brand-primary-hover transition-colors"
                  >
                    Start Shopping
                  </button>
                </div>
              ) : (
                cartItems.map((item) => (
                  <div
                    key={item.product.id}
                    className="p-3.5 rounded-2xl bg-white border border-slate-200/80 shadow-2xs flex items-center justify-between gap-3 hover:border-brand-light transition-all"
                  >
                    <div className="w-14 h-14 rounded-xl bg-slate-50 p-1.5 border border-slate-100 shrink-0 flex items-center justify-center">
                      <img src={item.product.imageUrl} alt={item.product.title} className="max-h-full object-contain" />
                    </div>

                    <div className="flex-1 min-w-0">
                      <h5 className="text-xs font-bold text-slate-900 truncate">{item.product.title}</h5>
                      {item.selectedColor && (
                        <span className="text-[10px] text-slate-400 block">Color: {item.selectedColor}</span>
                      )}
                      <span className="text-xs font-black text-brand-primary mt-0.5 block">
                        ৳{item.product.price.toLocaleString()}
                      </span>
                    </div>

                    <div className="flex items-center gap-3 shrink-0">
                      {/* Quantity Stepper */}
                      <div className="flex items-center border border-slate-200 rounded-lg overflow-hidden bg-slate-50 text-xs">
                        <button
                          onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                          className="px-2 py-0.5 text-slate-600 hover:bg-slate-200 font-bold"
                        >
                          -
                        </button>
                        <span className="px-2 py-0.5 font-bold text-slate-900">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                          className="px-2 py-0.5 text-slate-600 hover:bg-slate-200 font-bold"
                        >
                          +
                        </button>
                      </div>

                      <button
                        onClick={() => removeFromCart(item.product.id)}
                        className="text-slate-400 hover:text-rose-500 transition-colors p-1"
                        title="Remove item"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* 4. Footer Calculations & High Priority CTAs */}
            {cartItems.length > 0 && (
              <div className="p-5 border-t border-slate-100 bg-slate-50/50 space-y-4">
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between text-slate-600">
                    <span>Subtotal</span>
                    <span className="font-bold text-slate-900">৳{subtotal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span>Delivery Fee</span>
                    <span className="font-bold text-slate-900">
                      {shippingFee === 0 ? <span className="text-emerald-600">FREE</span> : `৳${shippingFee}`}
                    </span>
                  </div>
                  <div className="pt-2 border-t border-slate-200/80 flex justify-between text-sm font-black text-slate-900">
                    <span>Total</span>
                    <span className="text-brand-primary">৳{grandTotal.toLocaleString()}</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <button
                    onClick={handleCheckout}
                    className="w-full py-3.5 rounded-2xl bg-brand-primary hover:bg-brand-primary-hover text-white font-extrabold text-xs shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Sparkles className="w-4 h-4 text-brand-lightest" />
                    <span>CHECKOUT NOW (৳{grandTotal.toLocaleString()})</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>

                  <button
                    onClick={handleViewCart}
                    className="w-full py-3 rounded-2xl bg-white border border-slate-200 text-slate-800 font-extrabold text-xs hover:bg-slate-100 transition-all cursor-pointer"
                  >
                    View Shopping Cart Page
                  </button>
                </div>

                <div className="flex items-center justify-center gap-1.5 text-[10px] font-bold text-slate-400 pt-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-brand-primary" />
                  <span>256-Bit SSL Encrypted & Verified Checkout</span>
                </div>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
