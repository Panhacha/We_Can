"use client";
import React, { useRef } from 'react';
import { Order } from '@/context/AdminContext';
import { X, Printer } from 'lucide-react';

export default function InvoiceModal({ isOpen, onClose, order }: { isOpen: boolean; onClose: () => void; order: Order | null }) {
  const printRef = useRef<HTMLDivElement>(null);

  const handlePrint = () => {
    const printContent = printRef.current;
    if (!printContent) return;
    const windowPrint = window.open('', '', 'left=0,top=0,width=800,height=900,toolbar=0,scrollbars=0,status=0');
    if (!windowPrint) return;
    
    windowPrint.document.write(`
      <html>
        <head>
          <title>Invoice - ${order?.id}</title>
          <script src="https://cdn.tailwindcss.com"></script>
        </head>
        <body class="bg-white text-black p-8">
          ${printContent.innerHTML}
        </body>
      </html>
    `);
    
    windowPrint.document.close();
    windowPrint.focus();
    setTimeout(() => {
      windowPrint.print();
      windowPrint.close();
    }, 500);
  };

  if (!isOpen || !order) return null;

  return (
    <div className="fixed inset-0 bg-[#111c44]/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-[24px] shadow-2xl w-full max-w-3xl overflow-hidden flex flex-col max-h-[90vh]">
        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
          <h2 className="text-lg font-bold text-[#111c44]">Invoice # {order.id}</h2>
          <div className="flex gap-2">
            <button onClick={handlePrint} className="flex items-center gap-2 px-4 py-2 bg-[#111c44] text-white rounded-lg hover:bg-black transition-colors font-bold text-sm">
              <Printer className="w-4 h-4" /> Print
            </button>
            <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-700 rounded-full hover:bg-gray-100 transition-colors">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="p-8 overflow-y-auto flex-1 bg-gray-50">
          {/* Printable Area */}
          <div ref={printRef} className="bg-white p-10 max-w-2xl mx-auto shadow-sm border border-gray-100">
            <div className="flex justify-between items-start border-b border-gray-200 pb-8 mb-8">
              <div>
                <h1 className="text-3xl font-black text-[#111c44] uppercase tracking-tighter">
                  WE can <span className="text-blue-500">Shop</span>
                </h1>
                <p className="text-gray-500 text-sm mt-1">123 Street Name, Phnom Penh, Cambodia</p>
                <p className="text-gray-500 text-sm">contact@wecanshop.com | +855 12 345 678</p>
              </div>
              <div className="text-right">
                <h2 className="text-2xl font-bold text-gray-300 uppercase tracking-widest mb-2">Invoice</h2>
                <p className="text-sm font-bold text-[#111c44]"># {order.id}</p>
                <p className="text-sm text-gray-500">Date: {order.date}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-8 mb-8">
              <div>
                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Billed To:</h3>
                <p className="font-bold text-[#111c44]">{order.customerName}</p>
                <p className="text-sm text-gray-600 mt-1">Payment: {order.paymentMethod === 'aba' ? 'ABA PayWay' : 'Cash on Delivery'}</p>
              </div>
              <div className="text-right">
                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Delivery Info:</h3>
                <p className="font-bold text-[#111c44]">{order.courier || 'Pending Assignment'}</p>
                {order.trackingNumber && <p className="text-sm text-gray-600 mt-1">Tracking: {order.trackingNumber}</p>}
              </div>
            </div>

            <table className="w-full text-left border-collapse mb-8">
              <thead>
                <tr className="border-b-2 border-[#111c44]">
                  <th className="py-3 font-bold text-[#111c44]">Item</th>
                  <th className="py-3 font-bold text-[#111c44] text-center">Qty</th>
                  <th className="py-3 font-bold text-[#111c44] text-right">Price</th>
                  <th className="py-3 font-bold text-[#111c44] text-right">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {order.items?.map((item: any, idx: number) => (
                  <tr key={idx}>
                    <td className="py-4">
                      <p className="font-bold text-[#111c44]">{item.name}</p>
                      <p className="text-xs text-gray-500">{item.color} | {item.size}</p>
                    </td>
                    <td className="py-4 text-center text-gray-600">{item.quantity}</td>
                    <td className="py-4 text-right text-gray-600">${item.price?.toFixed(2)}</td>
                    <td className="py-4 text-right font-bold text-[#111c44]">${(item.price * item.quantity).toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="flex justify-end">
              <div className="w-64 space-y-3">
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Subtotal</span>
                  <span>${(order.total > 100 ? order.total : order.total - 5).toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Shipping</span>
                  <span>${(order.total > 100 ? 0 : 5).toFixed(2)}</span>
                </div>
                <div className="flex justify-between border-t-2 border-[#111c44] pt-3">
                  <span className="font-bold text-[#111c44] text-lg">Total</span>
                  <span className="font-bold text-blue-500 text-xl">${order.total.toFixed(2)}</span>
                </div>
              </div>
            </div>

            <div className="mt-16 text-center text-sm text-gray-500">
              <p>Thank you for shopping with WE can Shop!</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
