"use client";
import React, { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { Bell, Search, Settings, ChevronDown, Calendar, ChevronLeft, ChevronRight, Package } from 'lucide-react';
import WeCanLoading from '@/components/ui/WeCanLoading';

export default function OrdersPage() {
  const router = useRouter();
  const { orders: localOrders, user } = useAuth();
  const [liveOrders, setLiveOrders] = useState<Record<string, unknown>[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // UI States
  const [activeTab, setActiveTab] = useState('All orders');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;
  
  const tabs = ['All orders', 'Dispatch', 'Pending', 'Completed'];

  useEffect(() => {
    const fetchLiveOrders = async () => {
      if (localOrders.length === 0) {
        setLiveOrders([]);
        setIsLoading(false);
        return;
      }
      
      try {
        const orderIds = localOrders.map(o => o.id);
        
        // Fetch orders
        const { data: ordersData } = await supabase
          .from('orders')
          .select('*')
          .in('id', orderIds)
          .order('created_at', { ascending: false });
          
        if (!ordersData || ordersData.length === 0) {
           setLiveOrders([]);
           setIsLoading(false);
           return;
        }

        // Fetch order items for these orders
        const { data: itemsData } = await supabase
          .from('order_items')
          .select('*')
          .in('order_id', orderIds);
          
        // Fetch products for images
        const productIds = (itemsData || []).map(i => i.product_id).filter(Boolean);
        const productsMap: Record<string, string> = {};
        if (productIds.length > 0) {
          const { data: productsData } = await supabase
            .from('products')
            .select('id, image')
            .in('id', productIds);
          productsData?.forEach(p => {
            productsMap[p.id] = p.image;
          });
        }
        
        // Assemble live orders
        const assembled = ordersData.map(o => {
          const oItems = (itemsData || []).filter(i => i.order_id === o.id).map(i => ({
            ...i,
            image: productsMap[i.product_id] || "https://images.unsplash.com/photo-1560393464-5c69a73c5770?w=400&q=80"
          }));
          
          let displayStatus = o.status;
          if (o.status === 'Pending Payment' || o.status === 'Paid' || o.status === 'Pending') displayStatus = 'Pending';
          if (o.status === 'Preparing' || o.status === 'Shipping' || o.status === 'Shipped/In Transit') displayStatus = 'Dispatch';
          if (o.status === 'Delivered' || o.status === 'Completed') displayStatus = 'Completed';
          if (o.status === 'Returned' || o.status === 'Cancelled') displayStatus = o.status;
          
          // Get correct status mapping for tabs
          let tabStatus = 'Pending';
          if (displayStatus === 'Dispatch') tabStatus = 'Dispatch';
          if (displayStatus === 'Completed') tabStatus = 'Completed';
          
          return {
            id: o.id,
            rawDate: o.created_at,
            date: new Date(o.created_at).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
            total: Number(o.total),
            status: tabStatus,
            items: oItems,
            customer_name: o.customer_name || user?.name || 'Customer',
            address: 'Stored Securely' // Fallback
          };
        });
        
        setLiveOrders(assembled);
      } catch (e) {
        console.error("Failed to fetch live orders", e);
        // Fallback to local
        setLiveOrders(localOrders.map(o => ({
          ...o, 
          status: o.status === 'Order Placed' ? 'Pending' : (o.status === 'Delivered' ? 'Completed' : 'Dispatch'),
          customer_name: user?.name || 'Customer',
          address: 'Stored Securely'
        })));
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchLiveOrders();
  }, [localOrders, user]);

  // Filter orders by tab
  const filteredOrders = liveOrders.filter(order => {
    if (activeTab === 'All orders') return true;
    return order.status === activeTab;
  });

  // Pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentOrders = filteredOrders.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Completed': return 'bg-gray-400';
      case 'Dispatch': return 'bg-green-500';
      case 'Pending': return 'bg-red-500';
      default: return 'bg-gray-400';
    }
  };

  const getStatusBgColor = (status: string) => {
    switch (status) {
      case 'Completed': return 'text-gray-500';
      case 'Dispatch': return 'text-green-500';
      case 'Pending': return 'text-red-500';
      default: return 'text-gray-500';
    }
  };

  return (
    <div className="max-w-[1200px] mx-auto pb-20 animate-fade-in bg-white p-8 rounded-[32px] shadow-sm mt-4 font-sans" suppressHydrationWarning>
      
      {/* Header section */}
      <div className="flex justify-between items-start mb-6">
        <div>
          <h2 className="text-[28px] font-bold text-gray-900 mb-1 leading-none">Order</h2>
          <p className="text-gray-500 text-sm font-medium">{filteredOrders.length} orders found</p>
        </div>
      </div>
      
      {/* Filters section */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4 border-b border-gray-100 pb-4">
        <div className="flex gap-6 overflow-x-auto w-full md:w-auto hide-scrollbar">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => {setActiveTab(tab); setCurrentPage(1);}}
              className={`focus:outline-none pb-4 whitespace-nowrap text-sm font-bold transition-all relative ${
                activeTab === tab ? 'text-[#2064ff]' : 'text-gray-400 hover:text-gray-600'
              }`}
            >
              {tab}
              {activeTab === tab && (
                <span className="absolute bottom-[-17px] left-0 right-0 h-[3px] bg-[#2064ff] rounded-t-full"></span>
              )}
            </button>
          ))}
        </div>
      </div>
      
      {/* Table section */}
      {isLoading ? (
        <WeCanLoading />
      ) : filteredOrders.length === 0 ? (
        <div className="py-20 text-center border border-dashed border-gray-200 rounded-[24px]">
          <h2 className="text-xl font-bold text-gray-900 mb-2">No orders found</h2>
          <p className="text-gray-500">You don&apos;t have any orders in this category.</p>
        </div>
      ) : (
        <div className="w-full overflow-x-auto pb-4">
          <table className="w-full min-w-[900px] border-separate" style={{ borderSpacing: '0 12px' }}>
            <thead>
              <tr className="text-left shadow-sm">
                <th className="px-6 py-4 rounded-l-2xl bg-[#0f172a] text-white text-[13px] uppercase tracking-widest font-black">Id <ChevronDown size={14} className="inline ml-1 opacity-70" /></th>
                <th className="px-4 py-4 bg-[#0f172a] text-white text-[13px] uppercase tracking-widest font-black">Product</th>
                <th className="px-4 py-4 bg-[#0f172a] text-white text-[13px] uppercase tracking-widest font-black">Quantity</th>
                <th className="px-4 py-4 bg-[#0f172a] text-white text-[13px] uppercase tracking-widest font-black">Date <ChevronDown size={14} className="inline ml-1 opacity-70" /></th>
                <th className="px-4 py-4 bg-[#0f172a] text-white text-[13px] uppercase tracking-widest font-black">Price <ChevronDown size={14} className="inline ml-1 opacity-70" /></th>
                <th className="px-4 py-4 bg-[#0f172a] text-white text-[13px] uppercase tracking-widest font-black">Status</th>
                <th className="px-6 py-4 rounded-r-2xl bg-[#0f172a] text-white text-[13px] uppercase tracking-widest font-black text-right">Action</th>
              </tr>
            </thead>
            <tbody>
              {currentOrders.map((order) => {
                // Truncate ID for display
                const shortId = order.id.startsWith('ORD-') ? `#${order.id.substring(4, 8)}` : `#${order.id.substring(0, 4)}`;
                const firstItem = order.items && Array.isArray(order.items) && order.items.length > 0 ? order.items[0] : null;
                const totalQty = order.items && Array.isArray(order.items) ? order.items.reduce((sum: number, item: any) => sum + (item.quantity || 1), 0) : 0;
                const additionalCount = order.items && Array.isArray(order.items) ? order.items.length - 1 : 0;

                return (
                  <tr 
                    key={order.id} 
                    onClick={() => router.push(`/account/orders/${order.id}`)}
                    className="group bg-gray-50 hover:bg-[#2064ff] transition-all duration-300 shadow-[0_1px_3px_0_rgba(0,0,0,0.05)] hover:shadow-xl cursor-pointer border border-gray-100"
                  >
                    <td className="px-6 py-4 rounded-l-xl font-bold text-sm text-gray-500 group-hover:text-blue-100 transition-colors">
                      {shortId}
                    </td>
                    <td className="px-4 py-4 transition-colors">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg overflow-hidden bg-white shadow-sm border border-gray-100 group-hover:border-blue-400 transition-colors flex-shrink-0">
                          {firstItem?.image ? (
                             <img src={firstItem.image} alt={firstItem.name} className="w-full h-full object-cover" />
                          ) : (
                             <div className="w-full h-full bg-gray-100 flex items-center justify-center text-gray-400">
                               <Settings size={14} />
                             </div>
                          )}
                        </div>
                        <div className="flex flex-col justify-center">
                           <span className="font-bold text-sm text-gray-700 group-hover:text-white transition-colors max-w-[200px] truncate">{firstItem?.name || 'Order Items'}</span>
                           {additionalCount > 0 && (
                             <span className="text-xs font-medium text-gray-400 group-hover:text-blue-200">+{additionalCount} more item{additionalCount > 1 ? 's' : ''}</span>
                           )}
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4 font-bold text-xs text-gray-500 group-hover:text-blue-100 transition-colors">
                      {totalQty} Item{totalQty !== 1 ? 's' : ''}
                    </td>
                    <td className="px-4 py-4 font-bold text-xs text-gray-500 group-hover:text-blue-100 transition-colors whitespace-nowrap">
                      {order.date}
                    </td>
                    <td className="px-4 py-4 font-bold text-sm text-gray-700 group-hover:text-white transition-colors">
                      ${order.total.toFixed(2)}
                    </td>
                    <td className="px-4 py-4 transition-colors">
                      <div className={`flex items-center gap-2 text-xs font-bold ${getStatusBgColor(order.status as string)} group-hover:text-blue-100 transition-colors`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${getStatusColor(order.status as string)} group-hover:bg-blue-200 transition-colors`}></span>
                        {order.status as string}
                      </div>
                    </td>
                    <td className="px-6 py-4 rounded-r-xl transition-colors">
                      <div className="flex items-center justify-end gap-2">
                        <button className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-[#1853d9] transition-colors bg-white group-hover:bg-white/10" title="Download Invoice (PDF)" onClick={(e) => { e.stopPropagation(); alert('Downloading Invoice PDF...'); }}>
                          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
                        </button>
                        <button className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-[#1853d9] transition-colors bg-white group-hover:bg-white/10" title="Re-order" onClick={(e) => { e.stopPropagation(); alert('Added items to cart for re-order!'); }}>
                          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"></path><polyline points="3 3 3 8 8 8"></polyline></svg>
                        </button>
                        <button className="px-4 py-1.5 rounded-lg font-bold text-xs bg-white text-gray-600 shadow-sm group-hover:bg-[#1853d9] group-hover:text-white transition-all hover:scale-105 border border-gray-200 group-hover:border-transparent">
                          Details
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination */}
      {!isLoading && filteredOrders.length > 0 && (
        <div className="flex flex-col sm:flex-row justify-between items-center mt-6 px-2">
          <p className="text-xs font-bold text-gray-400 mb-4 sm:mb-0">
            Showing {(indexOfFirstItem + 1).toString().padStart(2, '0')}-{Math.min(indexOfLastItem, filteredOrders.length).toString().padStart(2, '0')} of {filteredOrders.length}
          </p>
          <div className="flex items-center gap-1">
            <button 
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-[#2064ff] disabled:opacity-30 transition-colors"
            >
              <ChevronLeft size={16} />
            </button>
            
            {[...Array(totalPages)].map((_, i) => (
              <button 
                key={i} 
                onClick={() => setCurrentPage(i + 1)}
                className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                  currentPage === i + 1 
                    ? 'text-[#2064ff] bg-blue-50' 
                    : 'text-gray-400 hover:bg-gray-50'
                }`}
              >
                {i + 1}
              </button>
            ))}
            
            <button 
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-[#2064ff] disabled:opacity-30 transition-colors"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
