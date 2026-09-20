"use client";
import { useState, useEffect, useRef } from 'react';
import { supabase } from '@/lib/supabase';
import QRCode from 'react-qr-code';

export type BankProvider = 'aba' | 'acleda' | 'canadia' | 'wing';
export type PaymentType = 'qr' | 'transfer';

interface BankPaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  total: number;
  onPaymentSuccess: () => void;
  orderId: string | null;
  bankProvider: BankProvider;
  paymentType: PaymentType;
}

const BANK_INFO = {
  aba: {
    name: 'ABA',
    sub: 'PAY',
    color: 'bg-[#e3000f]',
    border: 'border-[#e3000f]',
    text: 'text-[#e3000f]',
    bgLight: 'bg-[#e3000f]/10',
    accName: 'WE CAN SHOP',
    accNo: '000 123 456',
    logo: '/images/banks/aba.png'
  },
  acleda: {
    name: 'ACLEDA',
    sub: 'ToanChet',
    color: 'bg-[#003399]',
    border: 'border-[#003399]',
    text: 'text-[#003399]',
    bgLight: 'bg-[#003399]/10',
    accName: 'WE CAN SHOP',
    accNo: '0000-12-345678-99',
    logo: '/images/banks/acleda.png'
  },
  canadia: {
    name: 'CANADIA',
    sub: 'Bank',
    color: 'bg-[#005B9F]',
    border: 'border-[#005B9F]',
    text: 'text-[#005B9F]',
    bgLight: 'bg-[#005B9F]/10',
    accName: 'WE CAN SHOP',
    accNo: '012 345 678',
    logo: '/images/banks/canadia.png'
  },
  wing: {
    name: 'WING',
    sub: 'Bank',
    color: 'bg-[#8dc63f]',
    border: 'border-[#8dc63f]',
    text: 'text-[#8dc63f]',
    bgLight: 'bg-[#8dc63f]/10',
    accName: 'WE CAN SHOP',
    accNo: '088 123 4567',
    logo: '/images/banks/wing.png'
  }
};

export default function BankPaymentModal({ isOpen, onClose, total, onPaymentSuccess, orderId, bankProvider, paymentType }: BankPaymentModalProps) {
  const [timeLeft, setTimeLeft] = useState(180);
  const [isSimulating, setIsSimulating] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const bank = BANK_INFO[bankProvider];

  useEffect(() => {
    if (!isOpen) return;
    setTimeLeft(180);
    setFile(null);
    
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setTimeout(() => onClose(), 0);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    
    return () => clearInterval(timer);
  }, [isOpen, onClose]);

  // Realtime Subscription (Only for QR)
  useEffect(() => {
    if (!isOpen || !orderId || paymentType !== 'qr') return;

    const subscription = supabase
      .channel(`order_${orderId}`)
      .on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'orders', filter: `id=eq.${orderId}` },
        (payload) => {
          if (payload.new.payment_status === 'Verified') {
            onPaymentSuccess();
          }
        }
      )
      .subscribe();

    return () => { supabase.removeChannel(subscription); };
  }, [isOpen, orderId, paymentType, onPaymentSuccess]);

  const handleSimulateWebhook = async () => {
    if (!orderId) return;
    setIsSimulating(true);
    try {
      await fetch('/api/aba/webhook', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tran_id: orderId, status: 'SUCCESS' })
      });
    } catch (err) {
      console.error(err);
      setIsSimulating(false);
    }
  };

  const handleUploadSlip = async () => {
    if (!file || !orderId) return;
    setIsSimulating(true);
    try {
      // In a real app, you would upload to Supabase Storage here.
      // const fileExt = file.name.split('.').pop();
      // const filePath = `slips/${orderId}.${fileExt}`;
      // await supabase.storage.from('payment_slips').upload(filePath, file);
      // const { data } = supabase.storage.from('payment_slips').getPublicUrl(filePath);

      // Simulate URL
      const fakeUrl = 'https://mock.url/slip.jpg';

      const { error } = await supabase.from('orders').update({
        payment_slip_url: fakeUrl,
        payment_status: 'Pending Verification',
      }).eq('id', orderId);

      if (error) throw error;
      
      onPaymentSuccess();
    } catch (error) {
      console.error(error);
      alert('Failed to upload slip');
      setIsSimulating(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-[#1c2331]/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
      <div className="bg-white rounded-[24px] shadow-2xl w-full max-w-md overflow-hidden flex flex-col relative animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className={`px-6 py-4 flex justify-between items-center text-white ${bank.color}`}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg overflow-hidden bg-white shadow-sm border-2 border-white/20">
              <img src={bank.logo} alt={bank.name} className="w-full h-full object-cover" />
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-lg tracking-wider leading-none">{bank.name}</span>
              <span className="font-medium opacity-80 text-xs mt-1">{bank.sub}</span>
            </div>
          </div>
          <button onClick={onClose} className="text-white hover:opacity-75 transition-opacity">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
          </button>
        </div>

        {/* Content */}
        <div className="p-8 flex flex-col items-center text-center">
          <p className="text-gray-500 font-medium mb-1">Total Payment</p>
          <h2 className="text-4xl font-black text-[#1c2331] mb-6">${total.toFixed(2)}</h2>
          
          {paymentType === 'qr' ? (
            <>
              <div className="bg-white p-2 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.08)] border border-gray-100 mb-6 relative">
                <div className="w-48 h-48 flex items-center justify-center p-2">
                  <QRCode 
                    value={`${bankProvider}://pay?tran_id=${orderId || 'DEMO'}&amount=${total}`}
                    size={180}
                    bgColor="#ffffff"
                    fgColor="#1c2331"
                    level="M"
                  />
                </div>
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className={`w-12 h-12 bg-white rounded-xl shadow-md border-2 ${bank.border} overflow-hidden p-0.5`}>
                    <img src={bank.logo} alt="logo" className="w-full h-full object-cover rounded-lg" />
                  </div>
                </div>
              </div>
              <p className="text-sm font-medium text-gray-600">Scan with <span className="font-bold text-[#1c2331]">{bank.name} App</span> to pay</p>
              <p className={`text-xs mt-2 font-bold flex items-center justify-center gap-1 ${bank.text}`}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
                Expires in {Math.floor(timeLeft / 60)}:{String(timeLeft % 60).padStart(2, '0')}
              </p>
            </>
          ) : (
            <>
              {/* Transfer Details */}
              <div className="w-full bg-gray-50 rounded-xl p-4 mb-6 border border-gray-100 text-left">
                <p className="text-xs text-gray-500 font-medium uppercase tracking-wider mb-1">Account Name</p>
                <p className="text-lg font-bold text-gray-900 mb-4">{bank.accName}</p>
                
                <p className="text-xs text-gray-500 font-medium uppercase tracking-wider mb-1">Account Number</p>
                <div className="flex items-center justify-between">
                  <p className={`text-2xl font-black tracking-widest ${bank.text}`}>{bank.accNo}</p>
                  <button className="text-gray-400 hover:text-gray-900" onClick={() => navigator.clipboard.writeText(bank.accNo)}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>
                  </button>
                </div>
              </div>

              {/* Upload Slip */}
              <div className="w-full">
                <input 
                  type="file" 
                  accept="image/*" 
                  className="hidden" 
                  ref={fileInputRef}
                  onChange={(e) => setFile(e.target.files?.[0] || null)}
                />
                {!file ? (
                  <button 
                    onClick={() => fileInputRef.current?.click()}
                    className={`w-full border-2 border-dashed border-gray-300 rounded-xl py-6 flex flex-col items-center justify-center gap-2 hover:${bank.border} hover:${bank.bgLight} transition-colors`}
                  >
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-gray-400"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="17 8 12 3 7 8"></polyline><line x1="12" y1="3" x2="12" y2="15"></line></svg>
                    <span className="font-medium text-gray-600">Upload Transfer Receipt</span>
                  </button>
                ) : (
                  <div className={`w-full border-2 ${bank.border} ${bank.bgLight} rounded-xl p-4 flex items-center justify-between`}>
                    <div className="flex items-center gap-3 overflow-hidden">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={bank.text}><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
                      <span className="font-medium text-gray-900 truncate">{file.name}</span>
                    </div>
                    <button onClick={() => setFile(null)} className="text-red-500 p-1 hover:bg-white rounded">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                    </button>
                  </div>
                )}
              </div>
            </>
          )}
        </div>

        {/* Action Button */}
        <div className="bg-gray-50 p-6 border-t border-gray-100">
          {paymentType === 'qr' ? (
            <>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-3 text-center">Developer Sandbox</p>
              <button 
                onClick={handleSimulateWebhook}
                disabled={isSimulating}
                className="w-full bg-[#1c2331] text-white py-3 rounded-xl text-sm font-bold shadow-lg hover:bg-black transition-all flex items-center justify-center gap-2"
              >
                {isSimulating ? 'Waiting for Webhook...' : 'Simulate API Payment Webhook'}
              </button>
            </>
          ) : (
            <button 
              onClick={handleUploadSlip}
              disabled={isSimulating || !file}
              className={`w-full text-white py-3.5 rounded-xl text-base font-bold shadow-lg transition-all flex items-center justify-center gap-2 ${file ? bank.color + ' hover:opacity-90' : 'bg-gray-300 cursor-not-allowed'}`}
            >
              {isSimulating ? 'Submitting...' : 'Submit Payment Receipt'}
            </button>
          )}
        </div>
        
      </div>
    </div>
  );
}
