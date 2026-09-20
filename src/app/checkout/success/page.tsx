"use client";
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useAdmin } from '@/context/AdminContext';
import Confetti from 'react-confetti';
import { useWindowSize } from 'react-use';

export default function OrderSuccessPage() {
  const { orders, refreshOrders } = useAdmin();
  const [order, setOrder] = useState<any>(null);
  const [showConfetti, setShowConfetti] = useState(false);
  const { width, height } = useWindowSize();

  useEffect(() => {
    refreshOrders().then(() => {});
    setShowConfetti(true);
    
    // Stop confetti after 5 seconds to not lag the page forever
    const timer = setTimeout(() => setShowConfetti(false), 5000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (orders.length > 0) {
      const sorted = [...orders].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      setOrder(sorted[0]);
    }
  }, [orders]);

  return (
    <div className="min-h-screen bg-[#f8f9fc] flex flex-col items-center justify-center px-4 py-12 overflow-hidden relative">
      {/* Confetti Animation */}
      {showConfetti && <Confetti width={width} height={height} recycle={false} numberOfPieces={500} gravity={0.15} />}

      <style jsx>{`
        @keyframes draw {
          0% { stroke-dashoffset: 48; }
          100% { stroke-dashoffset: 0; }
        }
        @keyframes scaleIn {
          0% { transform: scale(0); opacity: 0; }
          60% { transform: scale(1.1); opacity: 1; }
          100% { transform: scale(1); opacity: 1; }
        }
        @keyframes slideUp {
          0% { transform: translateY(20px); opacity: 0; }
          100% { transform: translateY(0); opacity: 1; }
        }
        
        .animate-draw {
          stroke-dasharray: 48;
          stroke-dashoffset: 48;
          animation: draw 0.6s cubic-bezier(0.65, 0, 0.45, 1) 0.3s forwards;
        }
        .animate-scale-in {
          animation: scaleIn 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
        }
        .animate-slide-up-1 { animation: slideUp 0.6s ease forwards 0.4s; opacity: 0; }
        .animate-slide-up-2 { animation: slideUp 0.6s ease forwards 0.5s; opacity: 0; }
        .animate-slide-up-3 { animation: slideUp 0.6s ease forwards 0.6s; opacity: 0; }
      `}</style>

      <div className="max-w-lg w-full z-10">
        
        <div className="bg-white rounded-[32px] shadow-[0_20px_50px_-12px_rgba(0,0,0,0.1)] p-8 md:p-12 text-center animate-slide-up-1">
          
          {/* Animated Checkmark */}
          <div className="w-24 h-24 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-8 animate-scale-in">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
              <svg className="w-8 h-8 text-green-500" fill="none" viewBox="0 0 24 24">
                <path 
                  className="animate-draw"
                  stroke="currentColor" 
                  strokeWidth="3" 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
          </div>

          <h1 className="text-3xl md:text-4xl font-black text-[#1c2331] mb-3">Payment Successful!</h1>
          <p className="text-gray-500 mb-8 font-medium">Thank you! Your order has been placed and is being processed.</p>

          {/* Receipt Box */}
          <div className="bg-gray-50 rounded-2xl p-6 mb-8 text-left border border-gray-100 animate-slide-up-2">
            <div className="flex justify-between items-center mb-4 pb-4 border-b border-gray-200 border-dashed">
              <span className="text-gray-400 font-bold uppercase text-xs tracking-wider">Order ID</span>
              <span className="font-black text-[#1c2331]">{order?.id || 'Loading...'}</span>
            </div>
            
            <div className="flex justify-between items-center mb-4">
              <span className="text-gray-500 font-medium text-sm">Payment Method</span>
              <span className="font-bold text-gray-900 text-sm">{order?.payment_method || '...'}</span>
            </div>
            
            <div className="flex justify-between items-center mb-4 pb-4 border-b border-gray-200 border-dashed">
              <span className="text-gray-500 font-medium text-sm">Date</span>
              <span className="font-bold text-gray-900 text-sm">{new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-gray-900 font-bold">Total Paid</span>
              <span className="font-black text-2xl text-primary">${order?.total?.toFixed(2) || '0.00'}</span>
            </div>
          </div>

          <div className="space-y-4 animate-slide-up-3">
            <Link 
              href="/shop" 
              className="flex items-center justify-center w-full bg-primary text-white font-bold py-4 rounded-xl hover:bg-primary-dark transition-all shadow-lg shadow-primary/30 hover:shadow-xl hover:-translate-y-0.5"
            >
              Continue Shopping
            </Link>
            
            <Link 
              href="/" 
              className="flex items-center justify-center w-full bg-white text-gray-700 font-bold py-4 rounded-xl hover:bg-gray-50 transition-all border-2 border-gray-100 hover:border-gray-200"
            >
              Back to Home
            </Link>
          </div>

        </div>
      </div>
    </div>
  );
}
