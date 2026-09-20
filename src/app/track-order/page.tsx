"use client";
import { useState } from 'react';
import { useAdmin, Order } from '@/context/AdminContext';
import { Search, Package, Truck, CheckCircle, PackageOpen } from 'lucide-react';
import Link from 'next/link';

export default function TrackOrderPage() {
  const { orders } = useAdmin();
  const [searchId, setSearchId] = useState('');
  const [foundOrder, setFoundOrder] = useState<Order | null>(null);
  const [hasSearched, setHasSearched] = useState(false);

  const handleTrack = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchId.trim()) return;
    
    // In a real app, this would be an API call to a backend DB
    const order = orders.find(o => o.id.toLowerCase() === searchId.toLowerCase());
    setFoundOrder(order || null);
    setHasSearched(true);
  };

  const getStatusStep = (status: Order['status']) => {
    switch (status as any) {
      case 'Pending': return 1;
      case 'Confirmed': return 2;
      case 'Shipped': return 3;
      case 'Delivered': return 4;
      case 'Cancelled': return -1;
      default: return 0;
    }
  };

  return (
    <div className="bg-[#f8f9fc] min-h-screen py-16" suppressHydrationWarning>
      <div className="max-w-3xl mx-auto px-6">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-black text-[#1c2331] tracking-tight mb-4">Track Your Order</h1>
          <p className="text-gray-500">Enter your Order ID to check the current delivery status.</p>
        </div>

        <div className="bg-white rounded-[24px] p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] mb-8">
          <form onSubmit={handleTrack} className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input 
                type="text" 
                placeholder="E.g. ORD-1234" 
                value={searchId}
                onChange={(e) => setSearchId(e.target.value)}
                className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary focus:bg-white transition-all text-[#1c2331]"
                required
              />
            </div>
            <button type="submit" className="bg-primary text-white px-8 py-4 rounded-xl font-bold hover:bg-primary-dark transition-all shadow-lg shadow-primary/20 flex-shrink-0">
              Track Now
            </button>
          </form>
        </div>

        {hasSearched && (
          <div className="bg-white rounded-[24px] p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] animate-in fade-in slide-in-from-bottom-4 duration-500">
            {foundOrder ? (
              <div>
                <div className="flex justify-between items-start mb-8 pb-8 border-b border-gray-100">
                  <div>
                    <h2 className="text-2xl font-bold text-[#1c2331] mb-1">Order {foundOrder.id}</h2>
                    <p className="text-gray-500 text-sm">Placed on {foundOrder.date}</p>
                  </div>
                  <div className="text-right">
                    <span className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider ${
                      foundOrder.status === 'Delivered' ? 'bg-green-100 text-green-700' :
                      (foundOrder.status as any) === 'Shipped' ? 'bg-blue-100 text-blue-700' :
                      foundOrder.status === 'Cancelled' ? 'bg-red-100 text-red-700' :
                      'bg-orange-100 text-orange-700'
                    }`}>
                      {foundOrder.status}
                    </span>
                  </div>
                </div>

                {foundOrder.status !== 'Cancelled' ? (
                  <div className="relative mb-12">
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-gray-100 rounded-full z-0"></div>
                    <div 
                      className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-primary rounded-full z-0 transition-all duration-1000"
                      style={{ width: `${((getStatusStep(foundOrder.status) - 1) / 3) * 100}%` }}
                    ></div>
                    
                    <div className="relative z-10 flex justify-between">
                      {[
                        { step: 1, label: 'Order Placed', icon: Package },
                        { step: 2, label: 'Confirmed', icon: CheckCircle },
                        { step: 3, label: 'Shipped', icon: Truck },
                        { step: 4, label: 'Delivered', icon: PackageOpen },
                      ].map((item) => {
                        const isCompleted = getStatusStep(foundOrder.status) >= item.step;
                        const isCurrent = getStatusStep(foundOrder.status) === item.step;
                        
                        return (
                          <div key={item.step} className="flex flex-col items-center">
                            <div className={`w-12 h-12 rounded-full flex items-center justify-center border-4 transition-all duration-500 ${
                              isCompleted 
                                ? 'bg-primary border-white shadow-lg text-white' 
                                : 'bg-gray-50 border-white text-gray-300'
                            }`}>
                              <item.icon className="w-5 h-5" />
                            </div>
                            <p className={`mt-3 text-sm font-bold ${isCompleted ? 'text-[#1c2331]' : 'text-gray-400'}`}>
                              {item.label}
                            </p>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ) : (
                  <div className="bg-red-50 text-red-700 p-6 rounded-xl text-center mb-8 border border-red-100">
                    <p className="font-bold">This order has been cancelled.</p>
                    <p className="text-sm mt-1">If you have any questions, please contact our support team.</p>
                  </div>
                )}

                <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100">
                  <h3 className="font-bold text-[#1c2331] mb-4 text-lg">Delivery Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Courier Service</p>
                      <p className="font-medium text-[#1c2331] flex items-center gap-2">
                        {foundOrder.courier ? (
                          <>
                            <Truck className="w-4 h-4 text-gray-400" />
                            {foundOrder.courier === 'VET' ? 'VET Express' : 
                             foundOrder.courier === 'J&T' ? 'J&T Express' : 
                             foundOrder.courier === 'Speed' ? 'Speed Delivery' : 
                             'Manual Driver'}
                          </>
                        ) : 'Pending Assignment'}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Tracking Number</p>
                      <p className="font-medium text-[#1c2331]">
                        {foundOrder.trackingNumber ? (
                          <span className="font-mono text-blue-600 bg-blue-50 px-2 py-1 rounded border border-blue-100">{foundOrder.trackingNumber}</span>
                        ) : 'Not available yet'}
                      </p>
                    </div>
                  </div>
                </div>
                
              </div>
            ) : (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-400">
                  <Search className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-[#1c2331] mb-2">Order Not Found</h3>
                <p className="text-gray-500 mb-6">We couldn't find an order with ID "{searchId}". Please check the ID and try again.</p>
                <Link href="/shop" className="text-primary font-bold hover:underline">
                  Continue Shopping
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
