"use client";
import { useAdmin } from '@/context/AdminContext';
import { useMemo } from 'react';
import { DollarSign, ShoppingBag, Users, TrendingUp } from 'lucide-react';

export default function AdminDashboard() {
  const { products, orders, customers } = useAdmin();

  // Calculate metrics
  const totalRevenue = useMemo(() => {
    return orders
      .filter(o => o.status === 'Delivered' || o.status === 'Shipped' || o.status === 'Confirmed' || o.status === 'Pending') // Actually maybe just delivered/shipped for real revenue, but let's count all non-cancelled
      .reduce((sum, order) => sum + order.total, 0);
  }, [orders]);

  const activeOrders = useMemo(() => {
    return orders.filter(o => o.status !== 'Delivered' && o.status !== 'Cancelled').length;
  }, [orders]);

  const outOfStock = useMemo(() => {
    return products.filter(p => p.stock === 0).length;
  }, [products]);

  const cards = [
    { title: 'Total Revenue', value: `$${totalRevenue.toFixed(2)}`, icon: <DollarSign className="w-6 h-6 text-white" />, color: 'bg-primary', trend: '+12.5%' },
    { title: 'Total Orders', value: orders.length, icon: <ShoppingBag className="w-6 h-6 text-white" />, color: 'bg-blue-500', trend: '+5.2%' },
    { title: 'Total Customers', value: customers.length, icon: <Users className="w-6 h-6 text-white" />, color: 'bg-green-500', trend: '+2.4%' },
    { title: 'Active Orders', value: activeOrders, icon: <TrendingUp className="w-6 h-6 text-white" />, color: 'bg-orange-500', trend: '-1.5%' },
  ];

  return (
    <div className="space-y-8">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {cards.map((card, idx) => (
          <div key={idx} className="bg-white/[0.03] backdrop-blur-2xl rounded-3xl p-6 border border-white/10 shadow-2xl flex items-center gap-6 group hover:bg-white/[0.06] transition-all">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${card.color} bg-opacity-10`}>
              {/* Note: I'm tweaking the icons to use the text color corresponding to the background color class for a subtle glowing effect */}
              <div className={card.color.replace('bg-', 'text-')}>
                {card.icon}
              </div>
            </div>
            <div>
              <p className="text-[13px] font-medium text-gray-400 mb-1">{card.title}</p>
              <div className="flex items-end gap-3">
                <h3 className="text-2xl font-bold text-white leading-none tracking-tight">{card.value}</h3>
                <span className={`text-[11px] font-semibold flex items-center gap-1 ${card.trend.startsWith('+') ? 'text-emerald-500' : 'text-red-500'}`}>
                   {card.trend.startsWith('+') ? (
                     <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="22 7 13.5 15.5 8.5 10.5 2 17"></polyline><polyline points="16 7 22 7 22 13"></polyline></svg>
                   ) : (
                     <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="22 17 13.5 8.5 8.5 13.5 2 7"></polyline><polyline points="16 17 22 17 22 11"></polyline></svg>
                   )}
                  {card.trend}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Orders Table */}
        <div className="lg:col-span-2 bg-white/[0.03] backdrop-blur-2xl rounded-[2rem] border border-white/10 shadow-2xl overflow-hidden">
          <div className="p-6 border-b border-white/10 flex justify-between items-center">
            <h3 className="font-semibold text-lg text-white">Recent Orders</h3>
            <button className="text-gray-400 hover:text-white transition-colors">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="1"></circle><circle cx="19" cy="12" r="1"></circle><circle cx="5" cy="12" r="1"></circle></svg>
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="py-4 px-6 text-[11px] font-medium text-white/50 uppercase tracking-wider">Order ID</th>
                  <th className="py-4 px-6 text-[11px] font-medium text-white/50 uppercase tracking-wider">Customer</th>
                  <th className="py-4 px-6 text-[11px] font-medium text-white/50 uppercase tracking-wider">Date</th>
                  <th className="py-4 px-6 text-[11px] font-medium text-white/50 uppercase tracking-wider">Status</th>
                  <th className="py-4 px-6 text-[11px] font-medium text-white/50 uppercase tracking-wider text-right">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {orders.slice(0, 5).map((order) => (
                  <tr key={order.id} className="hover:bg-white/5 transition-colors">
                    <td className="py-4 px-6 font-medium text-gray-300 text-sm">{order.id}</td>
                    <td className="py-4 px-6 font-medium text-gray-300 text-sm flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-[#2a2a30] flex items-center justify-center text-xs font-bold text-gray-400">
                        {order.customerName.charAt(0)}
                      </div>
                      {order.customerName}
                    </td>
                    <td className="py-4 px-6 text-gray-400 text-sm">{order.date}</td>
                    <td className="py-4 px-6">
                      <span className={`px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider border ${
                        order.status === 'Delivered' ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' :
                        order.status === 'Shipped' ? 'bg-blue-500/10 text-blue-500 border-blue-500/20' :
                        order.status === 'Cancelled' ? 'bg-red-500/10 text-red-500 border-red-500/20' :
                        'bg-amber-500/10 text-amber-500 border-amber-500/20'
                      }`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="py-4 px-6 font-medium text-white text-sm text-right">${order.total.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Inventory Alerts */}
        <div className="bg-white/[0.03] backdrop-blur-2xl rounded-[2rem] border border-white/10 shadow-2xl p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-semibold text-lg text-white">Inventory Alerts</h3>
            <button className="text-gray-400 hover:text-white transition-colors">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="1"></circle><circle cx="19" cy="12" r="1"></circle><circle cx="5" cy="12" r="1"></circle></svg>
            </button>
          </div>
          
          <div className="space-y-4">
            {products.filter(p => p.stock < 10).map((product) => (
              <div key={product.id} className="flex items-center gap-4 pb-4 border-b border-white/10 last:border-0 last:pb-0">
                <img src={product.image} alt={product.name} className="w-10 h-10 rounded-xl object-cover bg-white/5 mix-blend-lighten" />
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-gray-200 text-[13px] truncate">{product.name}</p>
                  <p className={`text-[11px] font-medium mt-1 ${product.stock === 0 ? 'text-red-500' : 'text-amber-500'}`}>
                    {product.stock === 0 ? 'Out of Stock' : `Only ${product.stock} left`}
                  </p>
                </div>
              </div>
            ))}
            
            {products.filter(p => p.stock < 10).length === 0 && (
              <div className="text-gray-500 text-[13px] text-center py-10 flex flex-col items-center">
                 <svg className="w-8 h-8 mb-2 opacity-50" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
                 All products are well stocked.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
