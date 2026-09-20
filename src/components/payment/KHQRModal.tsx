"use client";
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import QRCode from 'react-qr-code';

export default function KHQRModal({ isOpen, onClose, total, onPaymentSuccess, orderId }: { isOpen: boolean, onClose: () => void, total: number, onPaymentSuccess: () => void, orderId: string | null }) {
  const [timeLeft, setTimeLeft] = useState(180); // 3 minutes
  const [isSimulating, setIsSimulating] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          // Call onClose in next tick to avoid setState during render
          setTimeout(() => onClose(), 0);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    
    return () => clearInterval(timer);
  }, [isOpen, onClose]);

  // Realtime Subscription to Supabase Orders Table
  useEffect(() => {
    if (!isOpen || !orderId) return;

    const subscription = supabase
      .channel(`order_${orderId}`)
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'orders',
          filter: `id=eq.${orderId}`
        },
        (payload) => {
          if (payload.new.payment_status === 'Verified') {
            console.log("Payment Verified via Supabase Realtime!");
            onPaymentSuccess();
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(subscription);
    };
  }, [isOpen, orderId, onPaymentSuccess]);

  const handleSimulateWebhook = async () => {
    if (!orderId) return;
    setIsSimulating(true);
    
    try {
      // Send a POST request to our webhook to simulate ABA calling us
      const res = await fetch('/api/aba/webhook', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tran_id: orderId,
          status: 'SUCCESS'
        })
      });

      if (!res.ok) throw new Error('Webhook failed');
      // We don't call onPaymentSuccess() directly here.
      // We wait for the Supabase Realtime subscription above to catch the database change!
      console.log("Webhook simulated. Waiting for realtime database update...");
    } catch (err) {
      console.error(err);
      setIsSimulating(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-[#1c2331]/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
      <div className="bg-white rounded-[24px] shadow-2xl w-full max-w-md overflow-hidden flex flex-col relative">
        <div className="bg-red-600 px-6 py-4 flex justify-between items-center text-white">
          <div className="flex items-center gap-2">
            <span className="font-bold text-lg tracking-wider">ABA</span>
            <span className="font-medium text-red-200">PAY</span>
          </div>
          <button onClick={onClose} className="text-white hover:text-red-200 transition-colors">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
          </button>
        </div>

        <div className="p-8 flex flex-col items-center text-center">
          <p className="text-gray-500 font-medium mb-1">Total Payment</p>
          <h2 className="text-4xl font-black text-[#1c2331] mb-6">${total.toFixed(2)}</h2>
          
          <div className="bg-white p-4 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.08)] border border-gray-100 mb-6 relative">
            <div className="w-48 h-48 flex items-center justify-center p-2">
              <QRCode 
                value={`aba://pay?tran_id=${orderId || 'DEMO'}&amount=${total}`}
                size={180}
                bgColor="#ffffff"
                fgColor="#1c2331"
                level="M"
              />
            </div>
            
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="w-12 h-12 bg-white rounded-xl shadow-md border-2 border-red-600 flex items-center justify-center font-bold text-red-600 text-xs">
                KHQR
              </div>
            </div>
          </div>
          
          <p className="text-sm font-medium text-gray-600">Scan with <span className="font-bold text-[#1c2331]">ABA Mobile</span> to pay</p>
          <p className="text-xs text-red-500 mt-2 font-bold flex items-center justify-center gap-1">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
            QR expires in {Math.floor(timeLeft / 60)}:{String(timeLeft % 60).padStart(2, '0')}
          </p>
        </div>

        <div className="bg-gray-50 p-6 border-t border-gray-100">
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-3 text-center">Developer Sandbox</p>
          <button 
            onClick={handleSimulateWebhook}
            disabled={isSimulating}
            className="w-full bg-[#1c2331] text-white py-3 rounded-xl text-sm font-bold shadow-lg hover:bg-black transition-all flex items-center justify-center gap-2"
          >
            {isSimulating ? (
              <>
                <svg className="animate-spin h-4 w-4 text-white" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                Waiting for ABA Webhook...
              </>
            ) : (
              'Simulate ABA Payment Webhook'
            )}
          </button>
        </div>
      </div>
    </div>
  );
}