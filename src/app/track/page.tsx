"use client";
import React, { useState } from 'react';
import OrderTracker from '@/components/order/OrderTracker';
import { supabase } from '@/lib/supabase';

export default function GuestTrackPage() {
  const [orderId, setOrderId] = useState('');
  const [phone, setPhone] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [error, setError] = useState('');
  const [foundOrder, setFoundOrder] = useState<any>(null);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!orderId || !phone) {
      setError('Please enter both Order ID and Phone Number.');
      return;
    }

    setIsSearching(true);
    setError('');

    try {
      // 1. Fetch Order from Supabase
      const { data: ordersData, error: ordersError } = await supabase
        .from('orders')
        .select('*')
        .ilike('id', orderId.trim())
        .eq('customer_phone', phone.trim());

      if (ordersError) throw ordersError;

      if (!ordersData || ordersData.length === 0) {
        // Fallback: maybe they entered the phone number differently, or it's an old order without a phone
        const { data: fallbackData } = await supabase
          .from('orders')
          .select('*')
          .ilike('id', orderId.trim());
          
        if (!fallbackData || fallbackData.length === 0) {
           setError("We couldn't find an order matching that ID. Please check your details and try again.");
           setIsSearching(false);
           return;
        } else if (fallbackData[0].customer_phone !== phone.trim() && fallbackData[0].customer_phone) {
           setError("The phone number provided does not match our records for this order.");
           setIsSearching(false);
           return;
        } else {
           // Allow if it's an old order without a phone number saved
           ordersData.push(fallbackData[0]);
        }
      }

      const o = ordersData[0];

      // 2. Fetch Order Items
      const { data: itemsData, error: itemsError } = await supabase
        .from('order_items')
        .select('*')
        .eq('order_id', o.id);
        
      if (itemsError) throw itemsError;

      // 2.5 Fetch Product Images
      const productIds = (itemsData || []).map((i: any) => i.product_id).filter(Boolean);
      let productsMap: any = {};
      if (productIds.length > 0) {
         const { data: productsData } = await supabase.from('products').select('id, image').in('id', productIds);
         if (productsData) {
             productsData.forEach((p: any) => {
                 productsMap[p.id] = p.image;
             });
         }
      }

      // 3. Format for OrderTracker
      const formattedItems = (itemsData || []).map((i: any) => ({
        id: i.id,
        productId: i.product_id,
        name: i.name,
        price: Number(i.price),
        quantity: i.quantity,
        image: productsMap[i.product_id] || i.image || "https://images.unsplash.com/photo-1560393464-5c69a73c5770?w=400&q=80",
        color: i.color,
        size: i.size
      }));

      const formattedOrder = {
        id: o.id,
        customerName: o.customer_name,
        customerPhone: o.customer_phone,
        date: new Date(o.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }),
        total: Number(o.total),
        status: o.status === 'Pending Payment' || o.status === 'Paid' ? 'Order Placed' : 
                o.status === 'Preparing' ? 'Processing/Packing' : 
                o.status === 'Shipping' ? 'Shipped/In Transit' : 
                o.status === 'Delivered' ? 'Delivered' : 
                o.status === 'Cancelled' ? 'Cancelled' : 'Order Placed',
        shippingCompany: o.courier || 'Pending',
        trackingNumber: o.tracking_number || 'Pending',
        courierPhone: 'Pending', // Supabase currently doesn't have this
        shippingAddress: 'See details in account', // Supabase currently doesn't have this
        shippingFee: o.total > 100 ? 0 : 5, // Mock logic based on checkout
        items: formattedItems
      };

      setFoundOrder(formattedOrder);

    } catch (err: any) {
      console.error(err);
      setError("An error occurred while fetching your order. Please try again.");
    } finally {
      setIsSearching(false);
    }
  };

  const handleStatusUpdate = async (newStatus: string) => {
    // Optimistic UI update
    setFoundOrder({ ...foundOrder, status: newStatus });
    
    // Convert UI status back to DB status if possible
    let dbStatus = newStatus;
    if (newStatus === 'Shipped/In Transit') dbStatus = 'Shipping';
    if (newStatus === 'Order Placed') dbStatus = 'Paid';
    
    // Update Supabase
    await supabase.from('orders').update({ status: dbStatus }).eq('id', foundOrder.id);
  };

  return (
    <div className="bg-[#f8f9fc] min-h-screen py-12 md:py-20 animate-fade-in">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Section */}
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-5xl font-black text-[#1c2331] mb-4">Track Your Order</h1>
          <p className="text-gray-500 max-w-lg mx-auto">Enter your Order ID and the phone number used during checkout to get real-time updates on your package.</p>
        </div>

        {/* Search Form */}
        {!foundOrder && (
          <div className="bg-white rounded-[24px] shadow-xl shadow-gray-200/50 p-6 md:p-10 max-w-2xl mx-auto border border-gray-100">
            <form onSubmit={handleSearch} className="space-y-6">
              
              {error && (
                <div className="bg-red-50 text-red-600 p-4 rounded-xl text-sm font-bold flex items-center border border-red-100 animate-shake">
                  <svg className="w-5 h-5 mr-3 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
                  {error}
                </div>
              )}

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wider">Order ID</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="16" y1="4" x2="16" y2="20"></line><line x1="8" y1="4" x2="8" y2="20"></line><line x1="3" y1="8" x2="21" y2="8"></line><line x1="3" y1="16" x2="21" y2="16"></line></svg>
                  </div>
                  <input 
                    type="text" 
                    value={orderId}
                    onChange={(e) => setOrderId(e.target.value)}
                    placeholder="e.g. ORD-123456" 
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3.5 pl-12 pr-4 text-[#1c2331] focus:outline-none focus:ring-2 focus:ring-primary focus:bg-white transition-all font-medium"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wider">Phone Number</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
                  </div>
                  <input 
                    type="text" 
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="Enter the phone number used for this order" 
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3.5 pl-12 pr-4 text-[#1c2331] focus:outline-none focus:ring-2 focus:ring-primary focus:bg-white transition-all font-medium"
                  />
                </div>
              </div>
              
              <button 
                type="submit" 
                disabled={isSearching}
                className="w-full bg-primary text-white font-bold py-4 rounded-xl hover:bg-primary-dark transition-all shadow-lg shadow-primary/30 flex items-center justify-center group disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isSearching ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Searching...
                  </>
                ) : (
                  <>
                    Track Order
                    <svg className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="9 18 15 12 9 6"></polyline></svg>
                  </>
                )}
              </button>
            </form>
          </div>
        )}

        {/* Found Order Results */}
        {foundOrder && (
          <div className="space-y-6">
            <div className="flex justify-between items-center bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
              <span className="font-bold text-gray-500">Tracking Results for: <span className="text-[#1c2331]">{foundOrder.id}</span></span>
              <button 
                onClick={() => setFoundOrder(null)}
                className="text-sm font-bold text-primary hover:text-primary-dark hover:underline flex items-center"
              >
                <svg className="w-4 h-4 mr-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
                Search Another
              </button>
            </div>
            
            <OrderTracker order={foundOrder} onUpdateStatus={handleStatusUpdate} />
          </div>
        )}

      </div>
    </div>
  );
}
