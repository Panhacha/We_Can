"use client";
import { useState, useEffect } from 'react';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useGlobalLoading } from '@/components/providers/GlobalLoadingProvider';
import Link from 'next/link';
import BankPaymentModal, { BankProvider, PaymentType } from '@/components/payment/BankPaymentModal';
import { supabase } from '@/lib/supabase';
import { z } from 'zod';

export default function CheckoutPage() {
  const { items: cart, clearCart } = useCart();
  const { addresses, addOrder } = useAuth();
  const router = useRouter();
  
  const [currentStep, setCurrentStep] = useState<'shipping' | 'payment'>('shipping');
  
  const [formData, setFormData] = useState({
    email: '',
    fullName: '',
    address1: '',
    address2: '',
    city: '',
    state: '',
    zip: '',
    country: 'Cambodia',
    saveInfo: true,
  });

  const [paymentMethod, setPaymentMethod] = useState<'bank' | 'cod'>('bank');
  const [bankProvider, setBankProvider] = useState<BankProvider>('aba');
  const [paymentType, setPaymentType] = useState<PaymentType>('qr');
  const [isQRModalOpen, setIsQRModalOpen] = useState(false);
  const { setGlobalLoading } = useGlobalLoading();
  const [createdOrderId, setCreatedOrderId] = useState<string | null>(null);
  
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    const defaultAddr = addresses.find(a => a.isDefault) || addresses[0];
    if (defaultAddr) {
      setFormData(prev => ({
        ...prev,
        fullName: `${defaultAddr.firstName} ${defaultAddr.lastName}`,
        address1: defaultAddr.address,
        city: defaultAddr.city || '',
        zip: defaultAddr.postalCode || '',
      }));
    }
  }, [addresses]);

  const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const shipping = total > 100 ? 0 : 5.00;
  const discount = total > 200 ? total * 0.1 : 0; 
  const finalTotal = total + shipping - discount;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target as any;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
  };

  const handleContinueToPayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.email || !formData.fullName || !formData.address1 || !formData.city) {
      alert("Please fill in all required fields.");
      return;
    }
    setCurrentStep('payment');
  };

  const handlePlaceOrder = async () => {
    setGlobalLoading(true);
    try {
      const orderId = `ORD-${Math.floor(Math.random() * 1000000)}`;
      
      const { data, error } = await supabase.from('orders').insert([{
        id: orderId,
        customer_name: formData.fullName || 'Guest',
        customer_phone: '',
        total: finalTotal,
        payment_method: paymentMethod === 'bank' ? `${bankProvider.toUpperCase()} - ${paymentType === 'qr' ? 'QR' : 'Transfer'}` : 'Cash on Delivery',
        payment_status: 'Pending',
        status: 'Pending',
      }]);

      if (error) throw error;

      const orderItems = cart.map(item => ({
        order_id: orderId,
        product_id: item.productId,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        color: item.color || 'Default',
        size: item.size || 'Default'
      }));

      await supabase.from('order_items').insert(orderItems);

      setCreatedOrderId(orderId);

      if (paymentMethod === 'bank') {
        setGlobalLoading(false);
        setIsQRModalOpen(true);
      } else {
        addOrder({
          id: orderId,
          date: new Date().toISOString().split('T')[0],
          total: finalTotal,
          status: 'Order Placed',
          items: cart,
          customerName: formData.fullName,
          customerPhone: '',
          shippingAddress: `${formData.address1}, ${formData.city} ${formData.zip}`,
          shippingFee: shipping
        });
        clearCart();
        setGlobalLoading(false);
        router.push('/checkout/success');
      }
    } catch (err) {
      console.error("Order creation failed", err);
      alert("Failed to create order.");
      setGlobalLoading(false);
    }
  };

  const handlePaymentSuccess = () => {
    if (createdOrderId) {
      addOrder({
        id: createdOrderId,
        date: new Date().toISOString().split('T')[0],
        total: finalTotal,
        status: 'Order Placed',
        items: cart,
        customerName: formData.fullName,
        customerPhone: '',
        shippingAddress: `${formData.address1}, ${formData.city} ${formData.zip}`,
        shippingFee: shipping
      });
    }
    clearCart();
    setIsQRModalOpen(false);
    router.push('/checkout/success');
  };

  if (!isMounted) {
    return null; // Prevent hydration errors
  }

  if (cart.length === 0) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center p-8 text-center bg-white" suppressHydrationWarning>
        <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-6">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-gray-400"><circle cx="9" cy="21" r="1"></circle><circle cx="20" cy="21" r="1"></circle><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path></svg>
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Your cart is empty</h2>
        <p className="text-gray-500 mb-8 max-w-md mx-auto">Looks like you haven't added anything to your cart yet. Let's fix that!</p>
        <Link href="/shop" className="bg-[#f26522] text-white px-8 py-3.5 rounded-lg font-bold shadow hover:bg-[#d8581d] transition-all">
          Start Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-white min-h-screen text-gray-800 font-sans" suppressHydrationWarning>
      
      {/* Top Header */}
      <div className="max-w-6xl mx-auto px-6 py-6 flex justify-between items-center border-b border-gray-100">
        <Link href="/cart" className="flex items-center text-[#f26522] font-semibold hover:text-[#d8581d] transition-colors">
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
          Back to Cart
        </Link>
        <div className="flex items-center text-gray-500 text-sm font-medium">
          <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
          Secure Checkout
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20">
          
          {/* Left Column */}
          <div className="lg:col-span-7">
            <h1 className="text-4xl font-bold text-gray-900 mb-8">Checkout</h1>
            
            {/* Stepper */}
            <div className="flex items-center mb-12">
              <button 
                onClick={() => setCurrentStep('shipping')}
                className={`flex items-center transition-colors ${currentStep === 'shipping' ? 'text-[#f26522]' : 'text-gray-400'}`}
              >
                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold mr-2 ${currentStep === 'shipping' ? 'bg-[#f26522] text-white' : 'border border-gray-300'}`}>1</div>
                <span className="font-semibold text-sm">Shipping</span>
              </button>
              <div className="flex-1 h-px bg-gray-200 mx-4"></div>
              
              <div className={`flex items-center transition-colors ${currentStep === 'payment' ? 'text-[#f26522]' : 'text-gray-400'}`}>
                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold mr-2 ${currentStep === 'payment' ? 'bg-[#f26522] text-white' : 'border border-gray-300'}`}>2</div>
                <span className="font-semibold text-sm">Payment</span>
              </div>
              <div className="flex-1 h-px bg-gray-200 mx-4"></div>
              
              <div className="flex items-center text-gray-400">
                <div className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold mr-2 border border-gray-300">3</div>
                <span className="font-semibold text-sm">Review</span>
              </div>
            </div>

            {currentStep === 'shipping' && (
              <form onSubmit={handleContinueToPayment} className="space-y-8 transition-opacity duration-300">
                
                {/* Contact Information */}
                <div>
                  <h2 className="text-xl font-bold text-gray-900 mb-4">Contact Information</h2>
                  <div className="border border-gray-200 rounded-lg overflow-hidden focus-within:border-[#f26522] focus-within:ring-1 focus-within:ring-[#f26522] transition-colors">
                    <label className="block px-4 pt-2 text-xs font-medium text-gray-500">Email address</label>
                    <input 
                      type="email" 
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="youremail@example.com"
                      className="w-full px-4 pb-3 pt-1 text-gray-900 focus:outline-none"
                      required
                    />
                  </div>
                </div>

                {/* Shipping Address */}
                <div>
                  <h2 className="text-xl font-bold text-gray-900 mb-4">Shipping Address</h2>
                  
                  <div className="space-y-4">
                    <div className="border border-gray-200 rounded-lg overflow-hidden focus-within:border-[#f26522] focus-within:ring-1 focus-within:ring-[#f26522] transition-colors">
                      <label className="block px-4 pt-2 text-xs font-medium text-gray-500">Full Name</label>
                      <input 
                        type="text" 
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleInputChange}
                        className="w-full px-4 pb-3 pt-1 text-gray-900 focus:outline-none"
                        required
                      />
                    </div>

                    <div className="border border-gray-200 rounded-lg overflow-hidden focus-within:border-[#f26522] focus-within:ring-1 focus-within:ring-[#f26522] transition-colors">
                      <label className="block px-4 pt-2 text-xs font-medium text-gray-500">Address Line 1</label>
                      <input 
                        type="text" 
                        name="address1"
                        value={formData.address1}
                        onChange={handleInputChange}
                        placeholder="House number and street name"
                        className="w-full px-4 pb-3 pt-1 text-gray-900 focus:outline-none"
                        required
                      />
                    </div>

                    <div className="border border-gray-200 rounded-lg overflow-hidden focus-within:border-[#f26522] focus-within:ring-1 focus-within:ring-[#f26522] transition-colors">
                      <label className="block px-4 pt-2 text-xs font-medium text-gray-500">Address Line 2 (Optional)</label>
                      <input 
                        type="text" 
                        name="address2"
                        value={formData.address2}
                        onChange={handleInputChange}
                        placeholder="Apartment, suite, etc."
                        className="w-full px-4 pb-3 pt-1 text-gray-900 focus:outline-none"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="border border-gray-200 rounded-lg overflow-hidden focus-within:border-[#f26522] focus-within:ring-1 focus-within:ring-[#f26522] transition-colors">
                        <label className="block px-4 pt-2 text-xs font-medium text-gray-500">City</label>
                        <input 
                          type="text" 
                          name="city"
                          value={formData.city}
                          onChange={handleInputChange}
                          className="w-full px-4 pb-3 pt-1 text-gray-900 focus:outline-none"
                          required
                        />
                      </div>
                      
                      <div className="border border-gray-200 rounded-lg overflow-hidden focus-within:border-[#f26522] focus-within:ring-1 focus-within:ring-[#f26522] transition-colors relative">
                        <label className="block px-4 pt-2 text-xs font-medium text-gray-500">State / Province</label>
                        <select 
                          name="state"
                          value={formData.state}
                          onChange={handleInputChange}
                          className="w-full px-4 pb-3 pt-1 text-gray-900 bg-transparent focus:outline-none appearance-none"
                        >
                          <option value="">Select...</option>
                          <option value="PP">Phnom Penh</option>
                          <option value="SR">Siem Reap</option>
                          <option value="BT">Battambang</option>
                        </select>
                        <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="6 9 12 15 18 9"></polyline></svg>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="border border-gray-200 rounded-lg overflow-hidden focus-within:border-[#f26522] focus-within:ring-1 focus-within:ring-[#f26522] transition-colors">
                        <label className="block px-4 pt-2 text-xs font-medium text-gray-500">ZIP / Postal Code</label>
                        <input 
                          type="text" 
                          name="zip"
                          value={formData.zip}
                          onChange={handleInputChange}
                          className="w-full px-4 pb-3 pt-1 text-gray-900 focus:outline-none"
                        />
                      </div>
                      
                      <div className="border border-gray-200 rounded-lg overflow-hidden bg-gray-50 relative">
                        <label className="block px-4 pt-2 text-xs font-medium text-gray-500">Country</label>
                        <select 
                          name="country"
                          value={formData.country}
                          onChange={handleInputChange}
                          className="w-full px-4 pb-3 pt-1 text-gray-900 bg-transparent focus:outline-none appearance-none"
                          disabled
                        >
                          <option value="Cambodia">Cambodia</option>
                        </select>
                        <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="6 9 12 15 18 9"></polyline></svg>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <label className="flex items-center cursor-pointer">
                  <input 
                    type="checkbox"
                    name="saveInfo"
                    checked={formData.saveInfo}
                    onChange={handleInputChange}
                    className="w-5 h-5 rounded border-gray-300 text-[#f26522] focus:ring-[#f26522]" 
                  />
                  <span className="ml-3 text-sm text-gray-600">Save this information for next time</span>
                </label>

                <button 
                  type="submit"
                  className="w-full bg-[#f26522] text-white py-4 rounded-lg font-bold hover:bg-[#d8581d] transition-colors flex justify-center items-center"
                >
                  Continue to Payment
                  <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                </button>
              </form>
            )}

            {currentStep === 'payment' && (
              <div className="space-y-6 transition-opacity duration-300">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Payment Method</h2>
                
                <div className="space-y-4">
                  {/* Bank Transfer */}
                  <div className={`border-2 rounded-xl overflow-hidden transition-all ${paymentMethod === 'bank' ? 'border-[#f26522]' : 'border-gray-200 hover:border-gray-300'}`}>
                    <label className={`flex items-center p-5 cursor-pointer ${paymentMethod === 'bank' ? 'bg-[#f26522]/5' : ''}`}>
                      <input 
                        type="radio" 
                        name="payment" 
                        value="bank" 
                        checked={paymentMethod === 'bank'}
                        onChange={() => setPaymentMethod('bank')}
                        className="w-5 h-5 text-[#f26522] focus:ring-[#f26522] border-gray-300"
                      />
                      <div className="ml-4 flex-1">
                        <p className="font-bold text-gray-900">Mobile Banking / Transfer</p>
                        <p className="text-xs text-gray-500">Pay via QR code or direct transfer</p>
                      </div>
                    </label>
                    
                    {paymentMethod === 'bank' && (
                      <div className="p-5 border-t border-gray-200 bg-white">
                        <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Select Bank</p>
                        <div className="grid grid-cols-4 gap-2 sm:gap-3 mb-6">
                          <button 
                            onClick={() => setBankProvider('aba')}
                            className={`flex flex-col items-center p-3 border-2 rounded-xl transition-all ${bankProvider === 'aba' ? 'border-[#e3000f] bg-[#e3000f]/5' : 'border-gray-100 hover:border-gray-200'}`}
                          >
                            <div className="w-12 h-12 rounded-xl overflow-hidden shadow-sm mb-2 border border-gray-100">
                              <img src="/images/banks/aba.png" alt="ABA" className="w-full h-full object-cover" />
                            </div>
                            <span className={`text-xs font-bold ${bankProvider === 'aba' ? 'text-[#e3000f]' : 'text-gray-500'}`}>ABA</span>
                          </button>
                          
                          <button 
                            onClick={() => setBankProvider('acleda')}
                            className={`flex flex-col items-center p-3 border-2 rounded-xl transition-all ${bankProvider === 'acleda' ? 'border-[#003399] bg-[#003399]/5' : 'border-gray-100 hover:border-gray-200'}`}
                          >
                            <div className="w-12 h-12 rounded-xl overflow-hidden shadow-sm mb-2 border border-gray-100">
                              <img src="/images/banks/acleda.png" alt="ACLEDA" className="w-full h-full object-cover" />
                            </div>
                            <span className={`text-xs font-bold ${bankProvider === 'acleda' ? 'text-[#003399]' : 'text-gray-500'}`}>Acleda</span>
                          </button>

                          <button 
                            onClick={() => setBankProvider('canadia')}
                            className={`flex flex-col items-center p-3 border-2 rounded-xl transition-all ${bankProvider === 'canadia' ? 'border-[#005B9F] bg-[#005B9F]/5' : 'border-gray-100 hover:border-gray-200'}`}
                          >
                            <div className="w-12 h-12 rounded-xl overflow-hidden shadow-sm mb-2 border border-gray-100">
                              <img src="/images/banks/canadia.png" alt="Canadia" className="w-full h-full object-cover" />
                            </div>
                            <span className={`text-xs font-bold ${bankProvider === 'canadia' ? 'text-[#005B9F]' : 'text-gray-500'}`}>Canadia</span>
                          </button>

                          <button 
                            onClick={() => setBankProvider('wing')}
                            className={`flex flex-col items-center p-3 border-2 rounded-xl transition-all ${bankProvider === 'wing' ? 'border-[#8dc63f] bg-[#8dc63f]/5' : 'border-gray-100 hover:border-gray-200'}`}
                          >
                            <div className="w-12 h-12 rounded-xl overflow-hidden shadow-sm mb-2 border border-gray-100">
                              <img src="/images/banks/wing.png" alt="Wing" className="w-full h-full object-cover" />
                            </div>
                            <span className={`text-xs font-bold ${bankProvider === 'wing' ? 'text-[#8dc63f]' : 'text-gray-500'}`}>Wing</span>
                          </button>
                        </div>

                        <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Payment Type</p>
                        <div className="grid grid-cols-2 gap-3">
                          <label className={`flex flex-col items-center justify-center p-4 border-2 rounded-xl cursor-pointer transition-all ${paymentType === 'qr' ? 'border-[#f26522] bg-[#f26522]/5 text-[#f26522]' : 'border-gray-100 text-gray-500 hover:border-gray-200'}`}>
                            <input type="radio" name="paymentType" value="qr" checked={paymentType === 'qr'} onChange={() => setPaymentType('qr')} className="hidden" />
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="mb-2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><rect x="7" y="7" width="3" height="3"></rect><rect x="14" y="7" width="3" height="3"></rect><rect x="7" y="14" width="3" height="3"></rect><rect x="14" y="14" width="3" height="3"></rect></svg>
                            <span className="text-sm font-bold">Scan QR Code</span>
                          </label>
                          
                          <label className={`flex flex-col items-center justify-center p-4 border-2 rounded-xl cursor-pointer transition-all ${paymentType === 'transfer' ? 'border-[#f26522] bg-[#f26522]/5 text-[#f26522]' : 'border-gray-100 text-gray-500 hover:border-gray-200'}`}>
                            <input type="radio" name="paymentType" value="transfer" checked={paymentType === 'transfer'} onChange={() => setPaymentType('transfer')} className="hidden" />
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="mb-2"><line x1="12" y1="2" x2="12" y2="22"></line><polyline points="17 5 12 2 7 5"></polyline><polyline points="7 19 12 22 17 19"></polyline></svg>
                            <span className="text-sm font-bold">Direct Transfer</span>
                          </label>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Cash on Delivery */}
                  <label className={`flex items-center justify-between p-5 rounded-xl border-2 cursor-pointer transition-all ${paymentMethod === 'cod' ? 'border-[#f26522] bg-[#f26522]/5' : 'border-gray-200 hover:border-gray-300'}`}>
                    <div className="flex items-center">
                      <input 
                        type="radio" 
                        name="payment" 
                        value="cod" 
                        checked={paymentMethod === 'cod'}
                        onChange={() => setPaymentMethod('cod')}
                        className="w-5 h-5 text-[#f26522] focus:ring-[#f26522] border-gray-300"
                      />
                      <div className="ml-4 flex items-center gap-3">
                        <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center text-gray-500 shadow-sm border border-gray-200">
                          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="6" width="20" height="12" rx="2"></rect><circle cx="12" cy="12" r="2"></circle><path d="M6 12h.01M18 12h.01"></path></svg>
                        </div>
                        <div>
                          <p className="font-bold text-gray-900">Cash on Delivery</p>
                          <p className="text-xs text-gray-500">Pay when you receive</p>
                        </div>
                      </div>
                    </div>
                  </label>
                </div>

                <div className="pt-6 flex gap-4">
                  <button 
                    onClick={() => setCurrentStep('shipping')}
                    className="px-6 py-4 rounded-lg font-bold text-gray-600 bg-gray-100 hover:bg-gray-200 transition-colors"
                  >
                    Back
                  </button>
                  <button 
                    onClick={handlePlaceOrder}
                    className="flex-1 bg-[#f26522] text-white py-4 rounded-lg font-bold hover:bg-[#d8581d] transition-colors flex justify-center items-center gap-2 disabled:opacity-70"
                  >
                    Complete Order
                  </button>
                </div>
              </div>
            )}
          </div>
          
          {/* Right Column - Order Summary */}
          <div className="lg:col-span-5">
            <div className="bg-white rounded-2xl p-8 border border-gray-200 sticky top-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
              <h2 className="text-xl font-bold text-gray-900 mb-8">Order Summary</h2>
              
              <div className="space-y-6 mb-8 max-h-[40vh] overflow-y-auto pr-2">
                {cart.map((item) => (
                  <div key={item.id} className="flex gap-4">
                    <div className="w-20 h-20 rounded-xl overflow-hidden bg-gray-50 flex-shrink-0 border border-gray-100">
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 min-w-0 py-1">
                      <p className="font-bold text-gray-900 text-sm truncate">{item.name}</p>
                      <p className="text-xs text-gray-500 mt-1">{item.color} / {item.size}</p>
                      <p className="text-xs text-gray-500 mt-1">Qty: {item.quantity}</p>
                    </div>
                    <div className="py-1">
                      <p className="font-bold text-gray-900 text-sm">${(item.price * item.quantity).toFixed(2)}</p>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="border-t border-gray-200 pt-6 space-y-4 text-sm">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span className="font-semibold text-gray-900">${total.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Shipping</span>
                  <span className="font-semibold text-gray-900">{shipping === 0 ? 'Free' : `$${shipping.toFixed(2)}`}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-[#f26522]">
                    <span>Discount</span>
                    <span className="font-semibold">-${discount.toFixed(2)}</span>
                  </div>
                )}
                
                <div className="border-t border-gray-200 pt-6 mt-6 flex justify-between items-center">
                  <span className="font-bold text-xl text-gray-900">Total</span>
                  <span className="font-black text-2xl text-[#f26522]">${finalTotal.toFixed(2)}</span>
                </div>
              </div>
              
              {/* Trust Badges */}
              <div className="grid grid-cols-3 gap-4 mt-10 pt-8 border-t border-gray-100">
                <div className="flex flex-col items-center text-center">
                  <div className="w-10 h-10 rounded-full bg-[#f26522]/10 text-[#f26522] flex items-center justify-center mb-2">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path><polyline points="9 12 11 14 15 10"></polyline></svg>
                  </div>
                  <span className="text-[10px] font-bold text-gray-500 uppercase">Secure<br/>Checkout</span>
                </div>
                <div className="flex flex-col items-center text-center">
                  <div className="w-10 h-10 rounded-full bg-[#f26522]/10 text-[#f26522] flex items-center justify-center mb-2">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="1" y="3" width="15" height="13"></rect><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"></polygon><circle cx="5.5" cy="18.5" r="2.5"></circle><circle cx="18.5" cy="18.5" r="2.5"></circle></svg>
                  </div>
                  <span className="text-[10px] font-bold text-gray-500 uppercase">Free<br/>Shipping</span>
                </div>
                <div className="flex flex-col items-center text-center">
                  <div className="w-10 h-10 rounded-full bg-[#f26522]/10 text-[#f26522] flex items-center justify-center mb-2">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M2 12a10 10 0 1 0 10-10 10 10 0 0 0-10 10z"></path><path d="M12 8v4l3 3"></path><path d="M2.5 9h5v-5"></path></svg>
                  </div>
                  <span className="text-[10px] font-bold text-gray-500 uppercase">Easy<br/>Returns</span>
                </div>
              </div>
            </div>
          </div>
          
        </div>
      </div>
      
      <BankPaymentModal 
        isOpen={isQRModalOpen} 
        onClose={() => setIsQRModalOpen(false)} 
        total={finalTotal} 
        onPaymentSuccess={handlePaymentSuccess} 
        orderId={createdOrderId}
        bankProvider={bankProvider}
        paymentType={paymentType}
      />
    </div>
  );
}
