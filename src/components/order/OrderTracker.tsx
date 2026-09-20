        "use client";
import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

interface OrderItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
  color?: string;
  size?: string;
}

interface Order {
  id: string;
  date: string;
  total: number;
  status: 'Order Placed' | 'Payment Confirmed' | 'Processing/Packing' | 'Shipped/In Transit' | 'Delivered' | 'Returned' | 'Cancelled' | 'Pending';
  items: OrderItem[];
  shippingCompany?: string;
  trackingNumber?: string;
  courierPhone?: string;
  customerName?: string;
  customerPhone?: string;
  shippingAddress?: string;
  shippingFee?: number;
}

interface OrderTrackerProps {
  order: Order;
  onUpdateStatus?: (status: Order['status']) => void;
}

const STATUS_STAGES = [
  'Order Placed',
  'Payment Confirmed',
  'Processing/Packing',
  'Shipped/In Transit',
  'Delivered'
];

export default function OrderTracker({ order, onUpdateStatus }: OrderTrackerProps) {
  const [showReturnModal, setShowReturnModal] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  
  // Find current stage index based on DB status
  let currentStageIndex = 0;
  if (order.status === 'Confirmed') currentStageIndex = 2; // Treat Confirmed as Processing/Packing
  if (order.status === 'Delivered') currentStageIndex = 4; // Delivered
  
  // Handle edge cases
  if (order.status === 'Returned' || order.status === 'Cancelled') {
    currentStageIndex = -1; // Don't show standard progress bar
  }

  const handleConfirmDelivery = () => {
    if (onUpdateStatus) {
      onUpdateStatus('Delivered');
    }
  };

  const handleReturnRequest = () => {
    if (onUpdateStatus) {
      onUpdateStatus('Returned');
    }
    setShowReturnModal(false);
  };

  return (
    <div className="bg-white rounded-[24px] shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] overflow-hidden border border-gray-100">
      
      {/* Header */}
      <div className="bg-[#f8f9fc] p-6 border-b border-gray-100 flex flex-wrap justify-between items-center gap-4">
        <div>
          <h2 className="text-xl font-bold text-[#1c2331]">Order {order.id}</h2>
          <p className="text-sm text-gray-500 mt-1">Placed on {order.date}</p>
        </div>
        <div className="flex gap-3">
          <Link href="https://t.me/wecanshop" target="_blank" className="bg-white border border-gray-200 text-gray-700 px-4 py-2 rounded-xl text-sm font-bold shadow-sm hover:bg-gray-50 transition-colors flex items-center">
            <svg className="w-4 h-4 mr-2 text-blue-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 2L11 13"></path><path d="M22 2l-7 20-4-9-9-4 20-7z"></path></svg>
            Contact Support
          </Link>
        </div>
      </div>

      {/* Visual Progress Bar */}
      {currentStageIndex !== -1 && (
        <div className="p-8 border-b border-gray-100">
          <div className="relative">
            {/* Background Line */}
            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-gray-200 rounded-full"></div>
            
            {/* Active Line */}
            <div 
              className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-primary rounded-full transition-all duration-500"
              style={{ width: `${(currentStageIndex / (STATUS_STAGES.length - 1)) * 100}%` }}
            ></div>

            <div className="relative flex justify-between">
              {STATUS_STAGES.map((stage, idx) => {
                const isActive = idx <= currentStageIndex;
                const isCurrent = idx === currentStageIndex;
                return (
                  <div key={stage} className="flex flex-col items-center group relative z-10">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors duration-300 ${isActive ? 'bg-primary text-white shadow-md shadow-primary/30' : 'bg-white border-2 border-gray-200 text-gray-400'}`}>
                      {isActive ? (
                        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="20 6 9 17 4 12"></polyline></svg>
                      ) : (
                        <span className="w-2 h-2 rounded-full bg-gray-300"></span>
                      )}
                    </div>
                    <div className={`absolute top-10 w-24 text-center text-[10px] sm:text-xs font-bold uppercase tracking-wider ${isCurrent ? 'text-primary' : isActive ? 'text-gray-800' : 'text-gray-400'}`}>
                      {stage}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          <div className="mt-14 h-4"></div> {/* Spacing for absolute text */}
        </div>
      )}

      {order.status === 'Cancelled' && (
        <div className="p-6 bg-red-50 text-red-600 font-bold text-center border-b border-red-100">
          This order has been cancelled.
        </div>
      )}
      
      {order.status === 'Returned' && (
        <div className="p-6 bg-orange-50 text-orange-600 font-bold text-center border-b border-orange-100">
          This order has been marked for return.
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-6 lg:p-8">
        {/* Left Column: Order Summary */}
        <div>
          <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4 flex items-center">
            <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path><line x1="3" y1="6" x2="21" y2="6"></line><path d="M16 10a4 4 0 0 1-8 0"></path></svg>
            Order Summary
          </h3>
          <div className="bg-white border border-gray-100 rounded-xl overflow-hidden shadow-sm">
            <div className="p-4 space-y-4 max-h-[300px] overflow-y-auto">
              {order.items.map((item, idx) => (
                <div key={idx} className="flex gap-4">
                  <div className="w-20 h-24 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0 relative">
                     <img src={item.image || "https://images.unsplash.com/photo-1560393464-5c69a73c5770?w=400&q=80"} alt={item.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 flex flex-col justify-between py-1">
                    <div>
                      <p className="font-bold text-sm text-[#1c2331] line-clamp-1">{item.name}</p>
                      <p className="text-[11px] text-gray-500 mt-1 font-medium">{item.color} | {item.size}</p>
                    </div>
                    <div className="flex justify-between items-end">
                      <p className="text-xs text-gray-500 font-bold">Qty: {item.quantity}</p>
                      <p className="font-bold text-sm text-[#1c2331]">${(item.price * item.quantity).toFixed(2)}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="bg-gray-50 p-4 border-t border-gray-100 space-y-2 text-sm">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal</span>
                <span className="font-semibold">${(order.total - (order.shippingFee || 0)).toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Shipping Fee</span>
                <span className="font-semibold">{order.shippingFee ? `$${order.shippingFee.toFixed(2)}` : 'Free'}</span>
              </div>
              <div className="flex justify-between text-[#1c2331] text-base pt-2 border-t border-gray-200 font-black">
                <span>Total</span>
                <span className="text-primary">${(order.total).toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Details */}
        <div>
            <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4 flex items-center">
              <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="1" y="3" width="15" height="13"></rect><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"></polygon><circle cx="5.5" cy="18.5" r="2.5"></circle><circle cx="18.5" cy="18.5" r="2.5"></circle></svg>
              Shipping Information
            </h3>
            <div className="bg-gray-50 rounded-xl p-4 space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-500 text-sm">Company:</span>
                <span className="font-bold text-[#1c2331]">{order.shippingCompany || 'Pending'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500 text-sm">Tracking No:</span>
                <span className="font-bold text-primary">{order.trackingNumber || 'Pending'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500 text-sm">Courier Phone:</span>
                <span className="font-bold text-[#1c2331]">{order.courierPhone || 'Pending'}</span>
              </div>
            </div>
          </div>
      </div>

      {/* Action Buttons */}
      <div className="p-6 lg:p-8 border-t border-gray-100 bg-gray-50 flex flex-wrap gap-4 justify-end rounded-b-2xl">
        {order.status === 'Delivered' && (
          <button onClick={() => setShowReturnModal(true)} className="px-6 py-2.5 bg-white border border-gray-200 text-gray-700 font-bold rounded-xl hover:bg-gray-50 shadow-sm transition-all">
            Return / Refund
          </button>
        )}
        {(order.status === 'Pending' || order.status === 'Confirmed') && (
          <button onClick={() => setShowCancelModal(true)} className="px-6 py-2.5 bg-white border border-gray-200 text-red-600 font-bold rounded-xl hover:bg-red-50 shadow-sm transition-all">
            Cancel Order
          </button>
        )}
        <Link href="/support" className="px-6 py-2.5 bg-gray-900 text-white font-bold rounded-xl hover:bg-gray-800 shadow-sm transition-all">
          Contact Support
        </Link>
      </div>

      {/* Modals */}
      {showCancelModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl">
            <h3 className="text-xl font-bold text-gray-900 mb-2">Cancel Order</h3>
            <p className="text-gray-600 mb-6">Are you sure you want to cancel this order? This action cannot be undone.</p>
            <div className="flex gap-4 justify-end">
              <button onClick={() => setShowCancelModal(false)} className="px-5 py-2.5 bg-gray-100 text-gray-700 font-bold rounded-xl hover:bg-gray-200">No, Keep It</button>
              <button onClick={() => { setShowCancelModal(false); onUpdateStatus?.('Cancelled'); }} className="px-5 py-2.5 bg-red-600 text-white font-bold rounded-xl hover:bg-red-700">Yes, Cancel</button>
            </div>
          </div>
        </div>
      )}
      
      {showReturnModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl">
            <h3 className="text-xl font-bold text-gray-900 mb-2">Return Order</h3>
            <p className="text-gray-600 mb-6">Do you want to request a return for this order?</p>
            <div className="flex gap-4 justify-end">
              <button onClick={() => setShowReturnModal(false)} className="px-5 py-2.5 bg-gray-100 text-gray-700 font-bold rounded-xl hover:bg-gray-200">Close</button>
              <button onClick={handleReturnRequest} className="px-5 py-2.5 bg-orange-600 text-white font-bold rounded-xl hover:bg-orange-700">Submit Request</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
