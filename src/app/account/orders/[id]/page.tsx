"use client";
import React, { useEffect, useState } from 'react';
import OrderTracker from '@/components/order/OrderTracker';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';

export default function OrderDetailsPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  
  const [order, setOrder] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!id) return;
    
    const fetchOrder = async () => {
      try {
        setIsLoading(true);
        // 1. Fetch Order from Supabase
        const { data: ordersData, error: ordersError } = await supabase
          .from('orders')
          .select('*')
          .eq('id', id);

        if (ordersError) throw ordersError;
        
        if (!ordersData || ordersData.length === 0) {
          setError('Order not found.');
          return;
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
          shippingFee: o.total > 100 ? 0 : 5, // Mock logic
          items: formattedItems
        };

        setOrder(formattedOrder);
      } catch (err: any) {
        console.error(err);
        setError('Failed to load order details.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrder();
  }, [id]);

  const handleStatusUpdate = async (newStatus: string) => {
    setOrder({ ...order, status: newStatus });
    
    // Convert UI status back to DB status if possible
    let dbStatus = newStatus;
    if (newStatus === 'Shipped/In Transit') dbStatus = 'Shipping';
    if (newStatus === 'Order Placed') dbStatus = 'Paid';
    
    await supabase.from('orders').update({ status: dbStatus }).eq('id', order.id);
  };

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto pb-20 py-20 text-center flex flex-col items-center justify-center space-y-4">
        <svg className="animate-spin h-8 w-8 text-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        <p className="text-gray-500 font-medium">Loading live order data...</p>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="max-w-4xl mx-auto pb-20 py-20 text-center">
        <div className="bg-red-50 text-red-600 p-6 rounded-2xl max-w-lg mx-auto border border-red-100">
          <h3 className="font-bold text-lg mb-2">Error</h3>
          <p>{error}</p>
          <Link href="/account/orders" className="inline-block mt-4 text-primary font-bold hover:underline">
            Back to Orders
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto pb-20 animate-fade-in">
      <div className="mb-6">
        <Link href="/account/orders" className="text-sm font-bold text-gray-400 hover:text-primary flex items-center transition-colors">
          <svg className="w-4 h-4 mr-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="15 18 9 12 15 6"></polyline></svg>
          Back to Orders
        </Link>
      </div>
      
      <OrderTracker order={order} onUpdateStatus={handleStatusUpdate} />
    </div>
  );
}
