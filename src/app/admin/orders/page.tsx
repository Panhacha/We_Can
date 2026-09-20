"use client";
import { useState } from 'react';
import { useAdmin, Order } from '@/context/AdminContext';
import { Search, Eye, FileText, Truck, Edit3, X, CheckCircle, AlertTriangle } from 'lucide-react';
import InvoiceModal from '@/components/admin/InvoiceModal';

export default function AdminOrders() {
  const { orders, updateOrderStatus, updateOrderDelivery, updateOrderPayment, updateOrderRefund } = useAdmin();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [isInvoiceModalOpen, setIsInvoiceModalOpen] = useState(false);
  
  // Temporary state for the modal
  const [tempStatus, setTempStatus] = useState<Order['status']>('Pending Payment');
  const [tempPaymentStatus, setTempPaymentStatus] = useState<Order['paymentStatus']>('Pending');
  const [tempCourier, setTempCourier] = useState<Order['courier']>('');
  const [tempTracking, setTempTracking] = useState('');
  const [tempRefundStatus, setTempRefundStatus] = useState<Order['refundStatus']>('None');

  const filteredOrders = orders.filter(o => {
    const matchesSearch = o.id.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          o.customerName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'All' || o.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleOpenDetails = (order: Order) => {
    setSelectedOrder(order);
    setTempStatus(order.status);
    setTempPaymentStatus(order.paymentStatus);
    setTempCourier(order.courier);
    setTempTracking(order.trackingNumber || '');
    setTempRefundStatus(order.refundStatus);
    setIsDetailsModalOpen(true);
  };

  const handleSaveChanges = () => {
    if (!selectedOrder) return;
    
    // Save Status
    if (tempStatus !== selectedOrder.status) {
      updateOrderStatus(selectedOrder.id, tempStatus);
    }
    // Save Payment Status
    if (tempPaymentStatus !== selectedOrder.paymentStatus) {
      updateOrderPayment(selectedOrder.id, tempPaymentStatus);
    }
    // Save Delivery
    if (tempCourier !== selectedOrder.courier || tempTracking !== selectedOrder.trackingNumber) {
      updateOrderDelivery(selectedOrder.id, tempCourier, tempTracking);
    }
    // Save Refund
    if (tempRefundStatus !== selectedOrder.refundStatus) {
      updateOrderRefund(selectedOrder.id, tempRefundStatus);
    }
    
    setIsDetailsModalOpen(false);
  };

  return (
    <div className="space-y-6 pb-20">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-[11px] font-bold text-gray-500 uppercase tracking-widest mb-1">PAGES / ORDERS</h2>
          <h1 className="text-2xl font-semibold text-white tracking-tight">Order Management</h1>
        </div>
      </div>

      {/* Header Actions */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
          <input 
            type="text" 
            placeholder="Search by Order ID or Customer..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-white/[0.03] backdrop-blur-2xl border border-white/10 rounded-xl pl-11 pr-4 py-2.5 text-sm text-gray-200 placeholder-gray-500 focus:outline-none focus:border-blue-500 transition-colors"
          />
        </div>
        
        <div className="flex gap-2 bg-white/[0.03] backdrop-blur-2xl p-1.5 rounded-xl border border-white/10 overflow-x-auto w-full md:w-auto">
          {['All', 'Pending', 'Confirmed', 'Delivered', 'Cancelled'].map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`px-4 py-1.5 rounded-lg text-[13px] font-medium transition-all whitespace-nowrap ${
                statusFilter === status ? 'bg-white/10 text-white shadow-sm' : 'text-gray-400 hover:text-gray-200'
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white/[0.03] backdrop-blur-2xl rounded-[2rem] border border-white/10 shadow-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[1000px]">
            <thead>
              <tr className="border-b border-white/10">
                <th className="py-4 px-6 text-[11px] font-medium text-white/50 uppercase tracking-wider">Order Info</th>
                <th className="py-4 px-6 text-[11px] font-medium text-white/50 uppercase tracking-wider">Customer</th>
                <th className="py-4 px-6 text-[11px] font-medium text-white/50 uppercase tracking-wider">Payment</th>
                <th className="py-4 px-6 text-[11px] font-medium text-white/50 uppercase tracking-wider">Status</th>
                <th className="py-4 px-6 text-[11px] font-medium text-white/50 uppercase tracking-wider">Logistics</th>
                <th className="py-4 px-6 text-[11px] font-medium text-white/50 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredOrders.length > 0 ? filteredOrders.map((order) => (
                <tr key={order.id} className="hover:bg-white/5 transition-colors">
                  <td className="py-4 px-6">
                    <span className="font-medium text-gray-200 block text-sm">#{order.id.slice(0, 8).toUpperCase()}</span>
                    <span className="text-[11px] text-gray-500">{order.date}</span>
                    <span className="block mt-1 text-sm font-semibold text-white">${order.total.toFixed(2)}</span>
                  </td>
                  <td className="py-4 px-6">
                    <span className="font-medium text-gray-300 block text-sm">{order.customerName}</span>
                    <span className="text-[11px] text-gray-500">{order.customerPhone || 'No phone'}</span>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex flex-col gap-1.5">
                      <span className="text-[11px] font-medium text-gray-500">{order.paymentMethod}</span>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded border w-fit uppercase tracking-wider ${
                        order.paymentStatus === 'Verified' ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' :
                        order.paymentStatus === 'Pending' ? 'bg-amber-500/10 text-amber-500 border-amber-500/20' :
                        order.paymentStatus === 'Refunded' ? 'bg-blue-500/10 text-blue-500 border-blue-500/20' :
                        'bg-red-500/10 text-red-500 border-red-500/20'
                      }`}>
                        {order.paymentStatus}
                      </span>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <span className={`px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider rounded border ${
                      order.status === 'Delivered' ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' : 
                      order.status === 'Cancelled' ? 'bg-red-500/10 text-red-500 border-red-500/20' : 
                      order.status === 'Confirmed' ? 'bg-blue-500/10 text-blue-500 border-blue-500/20' :
                      'bg-purple-500/10 text-purple-400 border-purple-500/20'
                    }`}>
                      {order.status}
                    </span>
                    {order.refundStatus !== 'None' && (
                      <span className="block mt-2 text-[10px] font-medium text-red-400">
                        Refund: {order.refundStatus}
                      </span>
                    )}
                  </td>
                  <td className="py-4 px-6">
                    {order.courier ? (
                      <div className="flex items-center gap-2">
                        <Truck className="w-4 h-4 text-gray-400" />
                        <div>
                          <span className="block text-xs font-medium text-gray-300">{order.courier}</span>
                          <span className="text-[10px] text-gray-500">{order.trackingNumber}</span>
                        </div>
                      </div>
                    ) : (
                      <span className="text-[11px] text-gray-500">Not assigned</span>
                    )}
                  </td>
                  <td className="py-4 px-6 text-right">
                    <div className="flex justify-end gap-1">
                      <button 
                        onClick={() => { setSelectedOrder(order); setIsInvoiceModalOpen(true); }}
                        className="p-2 text-gray-400 hover:text-blue-500 hover:bg-white/5 rounded transition-colors"
                        title="Print Invoice"
                      >
                        <FileText className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => handleOpenDetails(order)}
                        className="p-2 text-gray-400 hover:text-white hover:bg-white/5 rounded transition-colors"
                        title="Manage Order"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-gray-400 font-medium">
                    No orders found matching your criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Invoice Modal */}
      {isInvoiceModalOpen && selectedOrder && (
        <InvoiceModal 
          isOpen={isInvoiceModalOpen} 
          onClose={() => setIsInvoiceModalOpen(false)} 
          order={selectedOrder} 
        />
      )}

      {/* Advanced Order Management Modal */}
      {isDetailsModalOpen && selectedOrder && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-[#16161a] border border-[#2a2a30] rounded-3xl w-full max-w-5xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 my-8 flex flex-col max-h-[90vh]">
            
            <div className="px-8 py-5 border-b border-[#2a2a30] flex justify-between items-center bg-[#16161a] shrink-0 sticky top-0 z-10">
              <div>
                <h3 className="text-xl font-bold text-white">Manage Order #{selectedOrder.id.slice(0, 8).toUpperCase()}</h3>
                <p className="text-sm text-gray-400 mt-1">{selectedOrder.date}</p>
              </div>
              <button onClick={() => setIsDetailsModalOpen(false)} className="text-gray-400 hover:text-white transition-colors bg-white/5 hover:bg-white/10 rounded-full p-2">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-8">
              <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">
                
                {/* Left Column: Items & Customer */}
                <div className="lg:col-span-3 space-y-8">
                  {/* Customer Info */}
                  <div className="bg-[#1c1c21] p-5 rounded-2xl border border-[#2a2a30] shadow-sm">
                    <h4 className="text-sm font-medium text-white mb-4 flex items-center gap-2"><User className="w-4 h-4 text-gray-400" /> Customer Details</h4>
                    <div className="space-y-3 text-sm">
                      <p><span className="font-bold text-gray-500 w-20 inline-block">Name:</span> <span className="font-bold text-gray-200">{selectedOrder.customerName}</span></p>
                      <p><span className="font-bold text-gray-500 w-20 inline-block">Phone:</span> <span className="font-bold text-gray-200">{selectedOrder.customerPhone || 'N/A'}</span></p>
                      <p><span className="font-bold text-gray-500 w-20 inline-block">Email:</span> <span className="font-bold text-gray-200">{selectedOrder.customerEmail || 'N/A'}</span></p>
                    </div>
                  </div>

                  {/* Order Items */}
                  <div className="bg-[#1c1c21] p-5 rounded-2xl border border-[#2a2a30] shadow-sm">
                    <h4 className="text-sm font-medium text-white mb-4 flex items-center gap-2"><Package className="w-4 h-4 text-gray-400" /> Order Items</h4>
                    <div className="space-y-4">
                      {selectedOrder.items.map((item, idx) => (
                        <div key={idx} className="flex justify-between items-center bg-white/5 border border-[#2a2a30] p-4 rounded-xl shadow-sm">
                          <div>
                            <p className="font-bold text-gray-200">{item.name}</p>
                            <p className="text-xs text-gray-400 mt-1">
                              {item.color && item.color !== 'Default' && <span className="mr-2">Color: {item.color}</span>}
                              {item.size && item.size !== 'Default' && <span>Size: {item.size}</span>}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="font-bold text-blue-400">${item.price.toFixed(2)}</p>
                            <p className="text-xs text-gray-400 mt-1">Qty: {item.quantity}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="mt-4 flex justify-between items-center bg-[#16161a] text-white p-4 rounded-xl border border-[#2a2a30]">
                      <span className="font-bold uppercase tracking-wider text-sm">Total Amount</span>
                      <span className="font-black text-xl">${selectedOrder.total.toFixed(2)}</span>
                    </div>
                  </div>
                </div>

                {/* Right Column: Workflow Controls */}
                <div className="lg:col-span-2 space-y-8 bg-[#1c1c21] border border-[#2a2a30] shadow-sm p-6 rounded-2xl h-fit">
                  
                  {/* Overall Status */}
                  <div>
                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Order Workflow Status</label>
                    <select 
                      value={tempStatus} 
                      onChange={(e) => setTempStatus(e.target.value as any)}
                      className="w-full bg-[#16161a] border border-[#2a2a30] rounded-xl px-4 py-3 text-sm font-bold text-white focus:outline-none focus:border-blue-500 transition-all"
                    >
                      <option value="Pending">Pending</option>
                      <option value="Confirmed">Confirmed</option>
                      <option value="Delivered">Delivered</option>
                      <option value="Cancelled">Cancelled</option>
                    </select>
                  </div>

                  {/* Payment Verification */}
                  <div className="pt-6 border-t border-[#2a2a30]">
                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Finance & Payment</label>
                    <div className="bg-amber-500/10 p-4 rounded-xl border border-amber-500/20 mb-3">
                      <p className="text-xs font-bold text-amber-400 mb-1">Method: {selectedOrder.paymentMethod}</p>
                      {selectedOrder.paymentSlipUrl ? (
                        <a href={selectedOrder.paymentSlipUrl} target="_blank" rel="noreferrer" className="text-sm text-blue-400 hover:underline font-bold flex items-center gap-1">
                          <Eye className="w-4 h-4" /> View Payment Slip
                        </a>
                      ) : (
                        <p className="text-xs text-gray-400">No payment slip uploaded by customer.</p>
                      )}
                    </div>
                    <select 
                      value={tempPaymentStatus} 
                      onChange={(e) => setTempPaymentStatus(e.target.value as any)}
                      className="w-full bg-[#16161a] border border-[#2a2a30] rounded-xl px-4 py-3 text-sm font-bold text-white focus:outline-none focus:border-blue-500 transition-all"
                    >
                      <option value="Pending">Pending (Unverified)</option>
                      <option value="Verified">Verified (Paid)</option>
                      <option value="Failed">Failed / Invalid</option>
                      <option value="Refunded">Refunded</option>
                    </select>
                  </div>

                  {/* Shipping & Logistics */}
                  <div className="pt-6 border-t border-[#2a2a30]">
                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Shipping & Logistics</label>
                    <div className="space-y-3">
                      <select 
                        value={tempCourier} 
                        onChange={(e) => setTempCourier(e.target.value as any)}
                        className="w-full bg-[#16161a] border border-[#2a2a30] rounded-xl px-4 py-3 text-sm font-bold text-white focus:outline-none focus:border-blue-500 transition-all"
                      >
                        <option value="">Select Courier...</option>
                        <option value="VET">VET Express</option>
                        <option value="J&T">J&T Express</option>
                        <option value="Speed">Capitol / Speed</option>
                        <option value="Manual">Manual Delivery</option>
                      </select>
                      <input 
                        type="text" 
                        placeholder="Tracking Number" 
                        value={tempTracking}
                        onChange={(e) => setTempTracking(e.target.value)}
                        className="w-full bg-[#16161a] border border-[#2a2a30] rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-blue-500 transition-all"
                      />
                    </div>
                  </div>

                  {/* Refunds */}
                  <div className="pt-6 border-t border-[#2a2a30]">
                    <label className="block text-xs font-bold text-red-400 uppercase tracking-wider mb-2 flex items-center gap-1">
                      <AlertTriangle className="w-3 h-3" /> Returns & Refunds
                    </label>
                    {selectedOrder.refundReason && (
                      <div className="bg-red-500/10 p-3 rounded-xl text-xs text-red-400 mb-3 border border-red-500/20">
                        <span className="font-bold">Reason:</span> {selectedOrder.refundReason}
                      </div>
                    )}
                    <select 
                      value={tempRefundStatus} 
                      onChange={(e) => setTempRefundStatus(e.target.value as any)}
                      className="w-full bg-[#16161a] border border-[#2a2a30] rounded-xl px-4 py-3 text-sm font-bold text-red-400 focus:outline-none focus:border-red-500 transition-all"
                    >
                      <option value="None">No Refund Request</option>
                      <option value="Requested">Refund Requested</option>
                      <option value="Approved">Refund Approved</option>
                      <option value="Rejected">Refund Rejected</option>
                    </select>
                  </div>

                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="px-8 py-5 border-t border-[#2a2a30] flex justify-end gap-3 bg-[#16161a] shrink-0">
              <button type="button" onClick={() => setIsDetailsModalOpen(false)} className="px-6 py-3 rounded-xl font-medium text-sm text-gray-400 hover:text-white hover:bg-white/5 transition-colors">
                Discard Changes
              </button>
              <button type="button" onClick={handleSaveChanges} className="bg-blue-600 text-white px-8 py-3 rounded-xl font-bold text-sm hover:bg-blue-700 transition-all shadow-lg shadow-blue-600/30 flex items-center gap-2">
                <CheckCircle className="w-4 h-4" /> Save Order Details
              </button>
            </div>
            
          </div>
        </div>
      )}
    </div>
  );
}