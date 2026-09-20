"use client";
import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import { useRouter } from 'next/navigation';

export default function CartPage() {
  const { items, updateQuantity, removeFromCart, subtotal, totalItems, isLoaded } = useCart();
  const [discountCode, setDiscountCode] = useState('');
  const [appliedDiscount, setAppliedDiscount] = useState<{code: string, amount: number} | null>(null);
  const router = useRouter();

  const handleApplyDiscount = () => {
    if (discountCode.toUpperCase() === 'LUXE20') {
      setAppliedDiscount({ code: 'LUXE20', amount: subtotal * 0.2 });
    } else {
      alert('Invalid discount code');
      setAppliedDiscount(null);
    }
  };

  const total = subtotal - (appliedDiscount?.amount || 0);

  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center" suppressHydrationWarning>
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" suppressHydrationWarning></div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4" suppressHydrationWarning>
        <div className="w-24 h-24 bg-blue-50 text-primary rounded-full flex items-center justify-center mb-6" suppressHydrationWarning>
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="9" cy="21" r="1"></circle><circle cx="20" cy="21" r="1"></circle><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path></svg>
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Your cart is empty</h1>
        <p className="text-gray-500 mb-8 text-center max-w-md">Looks like you haven't added anything to your cart yet. Discover our premium collections and find something you love.</p>
        <Link href="/shop" className="bg-primary text-white font-bold py-4 px-8 rounded-full hover:bg-primary-dark transition-colors shadow-lg hover:shadow-xl hover:-translate-y-0.5 transform duration-200">
          Start Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12" suppressHydrationWarning>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" suppressHydrationWarning>
        <h1 className="text-3xl font-extrabold text-gray-900 mb-10">Shopping Cart ({totalItems} items)</h1>

        <div className="lg:grid lg:grid-cols-12 lg:gap-12 items-start">
          {/* Cart Items List */}
          <div className="lg:col-span-8 bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mb-8 lg:mb-0">
            <ul className="divide-y divide-gray-100">
              {items.map((item) => (
                <li key={item.id} className="p-6 sm:p-8 flex flex-col sm:flex-row gap-6">
                  <div className="relative w-24 h-32 sm:w-32 sm:h-40 rounded-xl overflow-hidden flex-shrink-0 border border-gray-100 bg-gray-50 flex items-center justify-center">
                    {item.image ? (
                      <Image src={item.image} alt={item.name} fill sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" className="object-cover" />
                    ) : (
                      <svg className="w-10 h-10 text-gray-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><circle cx="8.5" cy="8.5" r="1.5"></circle><polyline points="21 15 16 10 5 21"></polyline></svg>
                    )}
                  </div>
                  <div className="flex-1 flex flex-col justify-between">
                    <div className="flex justify-between">
                      <div>
                        <h3 className="text-lg font-bold text-gray-900 mb-1">{item.name}</h3>
                        <p className="text-sm text-gray-500 mb-4">
                          Color: {item.color} | Size: {item.size}
                        </p>
                      </div>
                      <p className="text-lg font-bold text-gray-900">${(item.price * item.quantity).toFixed(2)}</p>
                    </div>
                    
                    <div className="flex justify-between items-end">
                      <div className="flex items-center border border-gray-200 rounded-full bg-white">
                        <button 
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="w-10 h-10 flex items-center justify-center text-gray-500 hover:text-primary transition-colors focus:outline-none"
                        >
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line></svg>
                        </button>
                        <span className="w-8 text-center font-bold text-gray-900">{item.quantity}</span>
                        <button 
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="w-10 h-10 flex items-center justify-center text-gray-500 hover:text-primary transition-colors focus:outline-none"
                        >
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
                        </button>
                      </div>
                      
                      <button 
                        onClick={() => removeFromCart(item.id)}
                        className="text-sm font-medium text-red-500 hover:text-red-700 hover:underline transition-all"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-4 sticky top-28">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Order Summary</h2>
              
              <div className="space-y-4 mb-6">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span className="font-medium text-gray-900">${(subtotal).toFixed(2)}</span>
                </div>
                {appliedDiscount && (
                  <div className="flex justify-between text-green-600">
                    <span>Discount ({appliedDiscount.code})</span>
                    <span className="font-medium">-${appliedDiscount.amount.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between text-gray-600">
                  <span>Shipping</span>
                  <span className="font-medium text-gray-900">Calculated at checkout</span>
                </div>
                <div className="border-t border-gray-100 pt-4 flex justify-between items-center">
                  <span className="text-lg font-bold text-gray-900">Total</span>
                  <span className="text-2xl font-black text-primary">${(total).toFixed(2)}</span>
                </div>
              </div>

              {/* Discount Code */}
              <div className="mb-8">
                <label htmlFor="discount" className="block text-sm font-medium text-gray-700 mb-2">Gift card or discount code</label>
                <div className="relative flex items-center group">
                  <input 
                    type="text" 
                    id="discount"
                    value={discountCode}
                    onChange={(e) => setDiscountCode(e.target.value)}
                    placeholder="Enter discount code" 
                    className="w-full border-gray-200 rounded-xl shadow-sm focus:ring-2 focus:ring-primary/20 focus:border-primary p-4 text-[#111c44] font-bold outline-none transition-all pr-24 border"
                  />
                  <button 
                    onClick={handleApplyDiscount}
                    className="absolute right-2 top-1/2 -translate-y-1/2 bg-[#111c44] text-white px-5 py-2 text-sm font-bold rounded-lg hover:bg-black transition-colors shadow-md"
                  >
                    Apply
                  </button>
                </div>
              </div>

              <button 
                onClick={() => router.push('/checkout')}
                className="w-full bg-primary text-white font-bold py-4 rounded-xl hover:bg-primary-dark transition-colors shadow-lg hover:shadow-xl hover:-translate-y-0.5 transform duration-200"
              >
                Proceed to Checkout
              </button>
              
              <div className="mt-6 flex justify-center items-center gap-4 opacity-60">
                {/* Dummy payment icons */}
                <div className="h-6 w-10 bg-gray-200 rounded-sm"></div>
                <div className="h-6 w-10 bg-gray-200 rounded-sm"></div>
                <div className="h-6 w-10 bg-gray-200 rounded-sm"></div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

