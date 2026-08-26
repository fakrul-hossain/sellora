'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Trash2, ArrowRight, ShoppingBag } from 'lucide-react';
import { useCart } from '@/providers/cart-context';

export const dynamic = 'force-dynamic';

export default function CartPage() {
  const router = useRouter();
  const { cartItems, updateQuantity, removeFromCart, subtotal, totalItemsCount } = useCart();

  const shippingFee = cartItems.length > 0 ? 60 : 0;
  const grandTotal = subtotal + shippingFee;

  return (
    <div className="min-h-screen bg-[#FAFAFA] flex flex-col justify-between font-sans text-slate-800">
      <main className="flex-1 py-8">
        <div className="max-w-[1536px] mx-auto px-4 space-y-6">
          <h1 className="text-2xl font-black text-brand-dark">Your Shopping Cart ({totalItemsCount} items)</h1>

          {cartItems.length === 0 ? (
            <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 shadow-2xs space-y-4">
              <ShoppingBag className="w-12 h-12 text-slate-300 mx-auto" />
              <h3 className="text-base font-bold text-slate-800">Your cart is currently empty</h3>
              <p className="text-xs text-slate-500">Browse our store and add your favorite products to your cart.</p>
              <Link href="/" className="inline-block px-6 py-2.5 rounded-full bg-brand-primary hover:bg-brand-primary-hover text-white font-bold text-xs">
                Continue Shopping
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              {/* Cart Items List */}
              <div className="lg:col-span-8 space-y-4">
                {cartItems.map((item) => (
                  <div
                    key={item.product.id}
                    className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-2xs flex flex-col sm:flex-row items-center justify-between gap-4"
                  >
                    <div className="flex items-center space-x-4">
                      <img
                        src={item.product.imageUrl}
                        alt={item.product.title}
                        className="w-16 h-16 object-contain bg-slate-50 rounded-xl p-2 border border-slate-100 shrink-0"
                      />
                      <div>
                        <Link href={`/products/${item.product.id}`} className="text-xs font-bold text-slate-900 hover:text-brand-primary line-clamp-1">
                          {item.product.title}
                        </Link>
                        {item.selectedColor && (
                          <span className="text-[10px] text-slate-500 font-semibold block mt-0.5">
                            Color: {item.selectedColor}
                          </span>
                        )}
                        {item.selectedVersion && (
                          <span className="text-[10px] text-slate-500 font-semibold block mt-0.5">
                            Variant: {item.selectedVersion}
                          </span>
                        )}
                        <span className="text-xs font-black text-brand-dark block mt-1">
                          ৳{item.product.price.toLocaleString()}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center space-x-6 shrink-0">
                      {/* Quantity Selector */}
                      <div className="flex items-center border border-slate-200 rounded-xl overflow-hidden bg-white">
                        <button
                          onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                          className="px-2.5 py-1 text-slate-600 hover:bg-slate-100 font-bold text-xs cursor-pointer"
                        >
                          -
                        </button>
                        <span className="px-3 py-1 text-xs font-bold text-slate-900">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                          className="px-2.5 py-1 text-slate-600 hover:bg-slate-100 font-bold text-xs cursor-pointer"
                        >
                          +
                        </button>
                      </div>

                      <span className="text-sm font-black text-brand-dark w-20 text-right">
                        ৳{(item.product.price * item.quantity).toLocaleString()}
                      </span>

                      <button
                        onClick={() => removeFromCart(item.product.id)}
                        className="text-slate-400 hover:text-red-500 transition-colors p-1 cursor-pointer"
                        title="Remove item"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Order Summary Side Card */}
              <div className="lg:col-span-4">
                <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-2xs space-y-4">
                  <h3 className="text-sm font-extrabold text-brand-dark pb-3 border-b border-slate-100">Order Summary</h3>

                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between text-slate-600">
                      <span>Subtotal ({totalItemsCount} items)</span>
                      <span className="font-bold text-slate-900">৳{subtotal.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-slate-600">
                      <span>Shipping Fee (Standard BD)</span>
                      <span className="font-bold text-slate-900">৳{shippingFee}</span>
                    </div>
                    <div className="pt-3 border-t border-slate-100 flex justify-between text-sm font-black text-slate-900">
                      <span>Total</span>
                      <span className="text-brand-primary">৳{grandTotal.toLocaleString()}</span>
                    </div>
                  </div>

                  <button
                    onClick={() => router.push('/checkout')}
                    className="w-full py-3.5 rounded-full bg-brand-primary text-white font-extrabold text-xs hover:bg-brand-primary-hover transition-colors shadow-sm flex items-center justify-center space-x-2 cursor-pointer"
                  >
                    <span>Proceed to Checkout</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
