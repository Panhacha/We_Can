"use client";
import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';
const MapPin = (props: any) => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={props.className}><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>;
const User = (props: any) => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={props.className}><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>;
const Phone = (props: any) => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={props.className}><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>;
const CheckCircle2 = (props: any) => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={props.className}><circle cx="12" cy="12" r="10"></circle><path d="m9 12 2 2 4-4"></path></svg>;
const Plus = (props: any) => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={props.className}><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>;
const X = (props: any) => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={props.className}><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>;

export default function AddressesPage() {
  const { addresses, addAddress, deleteAddress, setDefaultAddress } = useAuth();
  const [isAdding, setIsAdding] = useState(false);
  
  const [formData, setFormData] = useState({
    firstName: '', lastName: '', address: '',  phone: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addAddress({ ...formData, city: 'Unknown', postalCode: '00000', isDefault: false });
    setIsAdding(false);
    setFormData({ firstName: '', lastName: '', address: '',  phone: '' });
  };

  return (
    <div className="max-w-4xl mx-auto pb-20" suppressHydrationWarning>
      
      <div className="flex justify-between items-center mb-8" suppressHydrationWarning>
        <div>
          <h2 className="text-2xl font-bold text-[#1c2331]">Saved Addresses</h2>
          <p className="text-gray-500 mt-1 text-sm">Manage your shipping and billing locations</p>
        </div>
        {!isAdding && (
          <button onClick={() => setIsAdding(true)} className="flex items-center text-sm font-bold text-white bg-primary px-5 py-3 rounded-xl shadow-lg shadow-primary/20 hover:bg-primary-dark transition-all hover:-translate-y-0.5">
            <Plus className="w-4 h-4 mr-2" />
            Add New Address
          </button>
        )}
      </div>

      {isAdding && (
        <div className="bg-white rounded-[24px] shadow-[0_8px_30px_rgb(0,0,0,0.04)] mb-10 overflow-hidden border border-gray-50 relative" suppressHydrationWarning>
          
          <div className="bg-gradient-to-r from-gray-50 to-white px-8 py-6 border-b border-gray-100 flex justify-between items-center" suppressHydrationWarning>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white rounded-full shadow-sm flex items-center justify-center text-primary">
                <MapPin className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-[#1c2331] text-xl">Add New Address</h3>
            </div>
            <button onClick={() => setIsAdding(false)} className="text-gray-400 hover:text-gray-700 transition-colors bg-white p-2 rounded-full shadow-sm">
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8" suppressHydrationWarning>
              {/* First Name */}
              <div className="relative group">
                <label className="block text-sm font-semibold text-[#1c2331] mb-2">First Name</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-primary transition-colors">
                    <User className="w-5 h-5" />
                  </div>
                  <input required type="text" value={formData.firstName} onChange={(e) => setFormData({...formData, firstName: e.target.value})} 
                    className="w-full bg-white border border-gray-200 rounded-xl pl-11 pr-4 py-3.5 text-[#1c2331] text-sm focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all hover:border-gray-300" 
                    placeholder="e.g. John" 
                  />
                </div>
              </div>

              {/* Last Name */}
              <div className="relative group">
                <label className="block text-sm font-semibold text-[#1c2331] mb-2">Last Name</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-primary transition-colors">
                    <User className="w-5 h-5" />
                  </div>
                  <input required type="text" value={formData.lastName} onChange={(e) => setFormData({...formData, lastName: e.target.value})} 
                    className="w-full bg-white border border-gray-200 rounded-xl pl-11 pr-4 py-3.5 text-[#1c2331] text-sm focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all hover:border-gray-300" 
                    placeholder="e.g. Doe" 
                  />
                </div>
              </div>
            </div>
            
            {/* Address */}
            <div className="relative group mb-8">
              <label className="block text-sm font-semibold text-[#1c2331] mb-2">Complete Address</label>
              <div className="relative">
                <div className="absolute top-3.5 left-4 flex items-start pointer-events-none text-gray-400 group-focus-within:text-primary transition-colors">
                  <MapPin className="w-5 h-5" />
                </div>
                <textarea required value={formData.address} onChange={(e) => setFormData({...formData, address: e.target.value})} 
                  className="w-full bg-white border border-gray-200 rounded-xl pl-11 pr-4 py-3.5 text-[#1c2331] text-sm focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all hover:border-gray-300 min-h-[100px] resize-none" 
                  placeholder="House/Apartment Number, Street Name, Sangkat, Khan, City..." 
                />
              </div>
            </div>
            
            {/* Phone Number */}
            <div className="relative group mb-8">
              <label className="block text-sm font-semibold text-[#1c2331] mb-2">Phone Number</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-primary transition-colors">
                  <Phone className="w-5 h-5" />
                </div>
                <input required type="tel" value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} 
                  className="w-full bg-white border border-gray-200 rounded-xl pl-11 pr-4 py-3.5 text-[#1c2331] text-sm focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all hover:border-gray-300" 
                  placeholder="e.g. 012 345 678" 
                />
              </div>
              <p className="text-xs text-gray-500 mt-2 flex items-center">
                <CheckCircle2 className="w-3.5 h-3.5 mr-1 text-green-500" />
                Used for delivery coordination
              </p>
            </div>
            
            <div className="flex gap-4 pt-6 border-t border-gray-100" suppressHydrationWarning>
              <button type="submit" className="flex-1 bg-primary text-white px-8 py-4 rounded-xl text-sm font-bold shadow-lg shadow-primary/20 hover:bg-primary-dark transition-all hover:-translate-y-0.5">
                Save Address
              </button>
              <button type="button" onClick={() => setIsAdding(false)} className="px-8 py-4 rounded-xl text-sm font-bold text-gray-600 bg-gray-50 hover:bg-gray-100 transition-colors border border-gray-200">
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {addresses.length === 0 && !isAdding ? (
        <div className="bg-white rounded-[24px] p-12 text-center shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] border border-dashed border-gray-200 flex flex-col items-center justify-center" suppressHydrationWarning>
          <div className="w-20 h-20 bg-gray-50 text-gray-300 rounded-full flex items-center justify-center mb-6">
             <MapPin className="w-10 h-10" />
          </div>
          <h3 className="text-xl font-bold text-[#1c2331] mb-2">No addresses saved</h3>
          <p className="text-gray-500 mb-8 max-w-sm mx-auto">You haven't saved any delivery addresses yet. Add one now to make your next checkout faster.</p>
          <button onClick={() => setIsAdding(true)} className="flex items-center text-sm font-bold text-white bg-[#1c2331] px-6 py-3 rounded-xl shadow-lg shadow-gray-200 hover:bg-black transition-all hover:-translate-y-0.5">
            <Plus className="w-4 h-4 mr-2" />
            Add New Address
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6" suppressHydrationWarning>
          {addresses.map((addr) => (
            <div key={addr.id} className={`bg-white rounded-[24px] p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] relative border-2 transition-all hover:border-primary/30 ${addr.isDefault ? 'border-primary shadow-primary/5' : 'border-transparent'}`} suppressHydrationWarning>
              {addr.isDefault && (
                <div className="absolute top-0 right-8 -translate-y-1/2 bg-primary text-white text-[10px] font-bold tracking-wider uppercase px-4 py-1.5 rounded-full shadow-md">
                  Default Address
                </div>
              )}
              
              <div className="flex items-start mb-6">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary mr-4 flex-shrink-0">
                  <MapPin className="w-6 h-6" />
                </div>
                <div>
                  <p className="font-bold text-[#1c2331] text-lg">{addr.firstName} {addr.lastName}</p>
                  <p className="text-sm text-gray-500 font-medium flex items-center mt-1">
                    <Phone className="w-3.5 h-3.5 mr-1" />
                    {addr.phone}
                  </p>
                </div>
              </div>
              
              <div className="pl-16">
                <div className="bg-gray-50 p-4 rounded-xl mb-6 border border-gray-100">
                  <p className="text-sm text-gray-700 leading-relaxed font-medium">
                    {addr.address}
                  </p>
                </div>
                
                <div className="flex gap-4">
                  {!addr.isDefault && (
                    <button onClick={() => setDefaultAddress(addr.id)} className="flex-1 py-2.5 bg-gray-50 hover:bg-primary hover:text-white border border-gray-200 hover:border-primary rounded-lg text-xs font-bold text-gray-600 uppercase tracking-wider transition-all">
                      Set Default
                    </button>
                  )}
                  <button onClick={() => deleteAddress(addr.id)} className="flex-1 py-2.5 bg-red-50 hover:bg-red-500 hover:text-white border border-red-100 hover:border-red-500 rounded-lg text-xs font-bold text-red-600 uppercase tracking-wider transition-all">
                    Remove
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

