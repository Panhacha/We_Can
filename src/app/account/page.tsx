"use client";
import { useState, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from '@/context/AuthContext';
import { useWishlist } from '@/context/WishlistContext';

export default function AccountDashboard() {
  const { user, updateProfile, addresses } = useAuth();
  const { items: wishlistItems } = useWishlist();
  
  // Find default address
  const defaultAddress = addresses.find(a => a.isDefault) || addresses[0];

  // Local state for Account Details Edit Mode
  const [isEditingDetails, setIsEditingDetails] = useState(false);
  const [detailsData, setDetailsData] = useState({
    firstName: user?.name ? user.name.split(' ')[0] : 'Felecia',
    lastName: user?.name ? user.name.split(' ').slice(1).join(' ') || '' : 'Burke',
    dob: user?.dob || '1990-06-10',
    gender: user?.gender || 'Female'
  });

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Handle Avatar Upload via FileReader
  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        updateProfile({ avatarUrl: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  // Save Account Details
  const handleSaveDetails = () => {
    updateProfile({
      name: `${detailsData.firstName} ${detailsData.lastName}`.trim(),
      dob: detailsData.dob,
      gender: detailsData.gender
    });
    setIsEditingDetails(false);
  };

  return (
    <div className="space-y-6 pb-20">
      
      {/* Profile Banner */}
      <div className="bg-white rounded-[24px] p-6 lg:px-8 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] relative overflow-hidden flex flex-col md:flex-row items-center md:items-start gap-8">
          {/* Avatar Upload */}
          <div 
            className="w-28 h-28 flex-shrink-0 rounded-3xl overflow-hidden bg-gray-100 shadow-sm relative group cursor-pointer"
            onClick={() => fileInputRef.current?.click()}
          >
             <Image 
               src={user?.avatarUrl || "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&q=80"} 
               alt="User Avatar"
               fill
               className="object-cover"
             />
             <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z"></path><circle cx="12" cy="13" r="3"></circle></svg>
                <span className="text-white text-xs font-bold mt-1">Change</span>
             </div>
             <input type="file" ref={fileInputRef} onChange={handleAvatarChange} accept="image/*" className="hidden" />
          </div>
          
          <div className="flex-1 text-center md:text-left flex flex-col justify-center h-full">
            <h2 className="text-2xl font-bold text-[#1c2331]">{user?.name || "Guest User"}</h2>
            <div className="bg-[#007aff] text-white text-sm font-semibold px-4 py-1.5 rounded-full mt-2 mb-4 inline-flex items-center shadow-[0_4px_12px_rgba(0,122,255,0.3)] w-max mx-auto md:mx-0">
              <svg className="w-4 h-4 mr-1.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12V7H5a2 2 0 0 1 0-4h14v4"></path><path d="M3 5v14a2 2 0 0 0 2 2h16v-5"></path><path d="M18 12a2 2 0 0 0 0 4h4v-4Z"></path></svg>
              Balance: $5,000
            </div>
            
            <div className="flex flex-col md:flex-row gap-4 md:gap-8 text-sm text-gray-500">
              <div className="flex items-center justify-center md:justify-start">
                <svg className="w-4 h-4 mr-2 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"></path><circle cx="12" cy="10" r="3"></circle></svg>
                <span className="truncate max-w-[200px]">{defaultAddress ? defaultAddress.address : "Phnom Penh, Cambodia"}</span>
              </div>
              <div className="flex items-center justify-center md:justify-start group cursor-pointer" onClick={() => {}}> 
                <svg className="w-4 h-4 mr-2 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect width="20" height="16" x="2" y="4" rx="2"></rect><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"></path></svg>
                <span className="truncate max-w-[200px]">{user?.email || 'guest@example.com'}</span>
              </div>
              <div className="flex items-center justify-center md:justify-start group cursor-pointer" onClick={() => {}}>
                <svg className="w-4 h-4 mr-2 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect width="14" height="20" x="5" y="2" rx="2" ry="2"></rect><path d="M12 18h.01"></path></svg>
                <span className="truncate">{user?.phone || '+855 12 345 678'}</span>
              </div>
            </div>
          </div>
      </div>

      {/* Row of 3 Columns */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Account Details */}
        <div className="bg-white rounded-[24px] p-6 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] relative flex flex-col">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-bold text-[#1c2331]">Account Details</h3>
            {!isEditingDetails ? (
              <button onClick={() => setIsEditingDetails(true)} className="text-gray-400 hover:text-primary transition-colors">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"></path><path d="m15 5 4 4"></path></svg>
              </button>
            ) : (
              <div className="flex space-x-2">
                <button onClick={() => setIsEditingDetails(false)} className="text-gray-400 hover:text-gray-600 text-xs font-medium">Cancel</button>
                <button onClick={handleSaveDetails} className="bg-primary text-white px-3 py-1 rounded text-xs font-medium shadow-sm hover:bg-primary-dark">Save</button>
              </div>
            )}
          </div>
          
          <div className="space-y-4 flex-1">
            {isEditingDetails ? (
              <>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-400 w-1/3">First Name</span>
                  <input type="text" value={detailsData.firstName} onChange={e => setDetailsData({...detailsData, firstName: e.target.value})} className="w-2/3 border border-gray-200 rounded px-2 py-1 text-right focus:ring-1 focus:ring-primary focus:border-primary outline-none" />
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-400 w-1/3">Last Name</span>
                  <input type="text" value={detailsData.lastName} onChange={e => setDetailsData({...detailsData, lastName: e.target.value})} className="w-2/3 border border-gray-200 rounded px-2 py-1 text-right focus:ring-1 focus:ring-primary focus:border-primary outline-none" />
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-400 w-1/3">Date of Birth</span>
                  <input type="date" value={detailsData.dob} onChange={e => setDetailsData({...detailsData, dob: e.target.value})} className="w-2/3 border border-gray-200 rounded px-2 py-1 text-right focus:ring-1 focus:ring-primary focus:border-primary outline-none text-gray-700" />
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-400 w-1/3">Gender</span>
                  <select value={detailsData.gender} onChange={e => setDetailsData({...detailsData, gender: e.target.value})} className="w-2/3 border border-gray-200 rounded px-2 py-1 text-right focus:ring-1 focus:ring-primary focus:border-primary outline-none bg-white text-gray-700">
                     <option>Female</option>
                     <option>Male</option>
                     <option>Other</option>
                  </select>
                </div>
              </>
            ) : (
              <div className="flex flex-col h-full justify-between">
                <div className="flex justify-between items-center py-2.5 border-b border-gray-50 text-sm">
                  <span className="text-gray-400 flex items-center gap-2">
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
                    First Name
                  </span>
                  <span className="font-bold text-gray-900">{user?.name ? user.name.split(' ')[0] : 'Guest'}</span>
                </div>
                <div className="flex justify-between items-center py-2.5 border-b border-gray-50 text-sm">
                  <span className="text-gray-400 flex items-center gap-2">
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
                    Last Name
                  </span>
                  <span className="font-bold text-gray-900">{user?.name ? user.name.split(' ').slice(1).join(' ') || '-' : 'User'}</span>
                </div>
                <div className="flex justify-between items-center py-2.5 border-b border-gray-50 text-sm">
                  <span className="text-gray-400 flex items-center gap-2">
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
                    Date of Birth
                  </span>
                  <span className="font-bold text-gray-900">{user?.dob || '10 June, 1990'}</span>
                </div>
                <div className="flex justify-between items-center py-2.5 text-sm">
                  <span className="text-gray-400 flex items-center gap-2">
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>
                    Gender
                  </span>
                  <span className="font-bold text-gray-900">{user?.gender || 'Female'}</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Shipping Address */}
        <div className="bg-white rounded-[24px] p-6 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] relative flex flex-col">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-bold text-[#1c2331]">Shipping Address</h3>
            <Link href="/account/addresses" className="text-[#007aff] hover:underline text-xs font-bold transition-colors">
              Manage
            </Link>
          </div>
          <div className="flex-1 flex flex-col justify-between">
             <div className="bg-gray-50 rounded-2xl p-4 flex gap-4 border border-gray-100">
               <div className="w-10 h-10 rounded-full bg-blue-100 text-[#007aff] flex items-center justify-center flex-shrink-0">
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"></path><circle cx="12" cy="10" r="3"></circle></svg>
               </div>
               <div>
                 <div className="text-xs font-bold text-gray-900 mb-1.5 flex items-center gap-2">
                   Home Address <span className="px-1.5 py-0.5 bg-[#007aff] text-white text-[9px] rounded uppercase font-bold tracking-wider">Default</span>
                 </div>
                 <p className="text-[13px] text-gray-500 leading-relaxed line-clamp-2">
                   {defaultAddress?.address || "898 Joanne Lane Street, Phnom Penh, Cambodia"}
                 </p>
               </div>
             </div>
             
             <button className="w-full mt-auto pt-4 pb-1 group flex items-center justify-center gap-2 text-sm font-bold text-gray-400 hover:text-[#1c2331] transition-colors">
               <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
               Add New Address
             </button>
          </div>
        </div>

        {/* Track Your Orders */}
        <div className="bg-white rounded-[24px] p-6 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] border border-blue-50 relative overflow-hidden flex flex-col">
          <div className="absolute top-0 right-0 -mr-16 -mt-16 w-48 h-48 rounded-full bg-blue-50 blur-3xl opacity-50"></div>
          <div className="flex justify-between items-center mb-4 relative z-10">
            <h3 className="font-bold text-[#1c2331] flex items-center">
              <svg className="w-5 h-5 mr-2 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path><polyline points="3.29 7 12 12 20.71 7"></polyline><line x1="12" y1="22" x2="12" y2="12"></line></svg>
              Track Orders
            </h3>
          </div>
          <div className="flex-1 relative z-10 flex flex-col justify-between">
            <div>
              <p className="text-gray-500 text-sm mb-4 leading-relaxed">Track shipping status and manage returns directly from your dashboard.</p>
              
              <div className="bg-white/60 p-4 rounded-2xl border border-blue-50/50 backdrop-blur-sm mb-4 shadow-sm">
                 <div className="flex justify-between text-[10px] font-bold text-gray-400 mb-2 uppercase tracking-wider">
                   <span>Order Placed</span>
                   <span className="text-[#007aff]">In Transit</span>
                   <span>Delivered</span>
                 </div>
                 <div className="h-2 w-full bg-blue-100/50 rounded-full overflow-hidden shadow-inner">
                    <div className="h-full bg-gradient-to-r from-blue-400 to-[#007aff] w-[55%] rounded-full relative">
                       <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full shadow border-2 border-[#007aff]"></div>
                    </div>
                 </div>
              </div>
            </div>
            <Link href="/account/orders" className="bg-[#1c2331] hover:bg-black text-white px-6 py-3 rounded-xl font-bold shadow-lg shadow-black/10 transition-all hover:-translate-y-0.5 whitespace-nowrap flex items-center justify-center w-full">
              View My Orders
              <svg className="w-4 h-4 ml-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"></path><path d="m12 5 7 7-7 7"></path></svg>
            </Link>
          </div>
        </div>

      </div>

      {/* Row of 2 Columns */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Security / Password */}
        <div className="bg-white rounded-[24px] p-6 lg:p-8 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] flex flex-col">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-bold text-[#1c2331] flex items-center gap-2">
               <svg className="w-5 h-5 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
               Security Settings
            </h3>
          </div>
          <div className="space-y-4 flex-1 flex flex-col justify-between">
             <div className="space-y-4">
               <div className="flex flex-col gap-1.5">
                 <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Current Password</label>
                 <div className="relative">
                   <svg className="w-4 h-4 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
                   <input type="password" placeholder="••••••••" className="w-full bg-gray-50/80 border border-transparent focus:border-primary focus:bg-white pl-11 pr-4 py-3 rounded-xl outline-none text-sm transition-all shadow-sm" />
                 </div>
               </div>
               <div className="flex flex-col gap-1.5">
                 <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">New Password</label>
                 <div className="relative">
                   <svg className="w-4 h-4 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
                   <input type="password" placeholder="Enter new password" className="w-full bg-gray-50/80 border border-transparent focus:border-primary focus:bg-white pl-11 pr-4 py-3 rounded-xl outline-none text-sm transition-all shadow-sm" />
                 </div>
               </div>
             </div>
             <div className="pt-2">
               <button className="bg-gray-900 hover:bg-black text-white px-5 py-3 rounded-xl font-bold text-sm transition-colors shadow-lg shadow-black/10 w-full flex justify-center items-center gap-2" onClick={() => alert('Password changed successfully!')}>
                 Update Password
                 <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"></path><path d="m12 5 7 7-7 7"></path></svg>
               </button>
             </div>
          </div>
        </div>

        {/* Notifications */}
        <div className="bg-white rounded-[24px] p-6 lg:p-8 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] flex flex-col">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-bold text-[#1c2331] flex items-center gap-2">
               <svg className="w-5 h-5 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path><path d="M13.73 21a2 2 0 0 1-3.46 0"></path></svg>
               Notifications
            </h3>
          </div>
          <div className="space-y-6 flex-1">
             <div className="flex items-center justify-between">
               <div>
                 <h4 className="font-bold text-gray-900 text-sm mb-1">Email Updates</h4>
                 <p className="text-xs text-gray-500">Receive order status and promos via Email.</p>
               </div>
               <label className="relative inline-flex items-center cursor-pointer">
                 <input type="checkbox" className="sr-only peer" checked={user?.notifications?.email ?? true} onChange={() => updateProfile({ notifications: { ...user?.notifications, email: !(user?.notifications?.email ?? true) } as any })} />
                 <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
               </label>
             </div>
             
             <div className="flex items-center justify-between">
               <div>
                 <h4 className="font-bold text-gray-900 text-sm mb-1">SMS Alerts</h4>
                 <p className="text-xs text-gray-500">Get text messages for delivery tracking.</p>
               </div>
               <label className="relative inline-flex items-center cursor-pointer">
                 <input type="checkbox" className="sr-only peer" checked={user?.notifications?.sms ?? false} onChange={() => updateProfile({ notifications: { ...user?.notifications, sms: !(user?.notifications?.sms ?? false) } as any })} />
                 <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
               </label>
             </div>
             
             <div className="flex items-center justify-between">
               <div>
                 <h4 className="font-bold text-gray-900 text-sm mb-1">Telegram Bot</h4>
                 <p className="text-xs text-gray-500">Instant notifications via Telegram app.</p>
               </div>
               <label className="relative inline-flex items-center cursor-pointer">
                 <input type="checkbox" className="sr-only peer" checked={user?.notifications?.telegram ?? true} onChange={() => updateProfile({ notifications: { ...user?.notifications, telegram: !(user?.notifications?.telegram ?? true) } as any })} />
                 <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#0088cc]"></div>
               </label>
             </div>
          </div>
        </div>
      </div>

      {/* Bottom Section - Wish List */}
      <div className="bg-white rounded-[24px] p-6 lg:p-8 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)]">
        <div className="flex justify-between items-center mb-8">
          <h3 className="text-lg font-bold text-[#1c2331]">Wish List</h3>
          <Link href="/wishlist" className="text-sm font-medium text-[#007aff] hover:underline flex items-center">
            View All
            <svg className="w-4 h-4 ml-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"></path></svg>
          </Link>
        </div>

        {wishlistItems.length === 0 ? (
           <div className="text-center py-12 text-gray-400">
             Your wish list is empty. Explore the shop to add items!
           </div>
        ) : (
          <div className="overflow-hidden relative w-full -mx-4 px-4 sm:mx-0 sm:px-0 py-2">
            <div className="flex w-max animate-marquee gap-6 hover:pause">
              {[...wishlistItems, ...wishlistItems, ...wishlistItems].map((item, idx) => (
                <div key={`${item.productId}-${idx}`} className="flex gap-4 p-4 rounded-2xl bg-[#f8f9fc] hover:shadow-md transition-shadow w-[300px] flex-shrink-0 border border-transparent hover:border-blue-100 cursor-pointer">
                  <div className="w-24 h-24 bg-white rounded-xl overflow-hidden shadow-sm flex-shrink-0 relative group">
                    <Image src={item.image} alt={item.name} fill sizes="100px" className="object-cover p-2 group-hover:scale-110 transition-transform" />
                  </div>
                  <div className="flex flex-col justify-center overflow-hidden">
                    <h4 className="font-bold text-[#1c2331] text-sm truncate" title={item.name}>{item.name}</h4>
                    <div className="text-[11px] text-gray-400 mt-1 mb-2">Product ID: {item.productId.substring(0,6)}</div>
                    <div className="text-xs font-bold text-[#1c2331] mb-2">Price: ${(item.price).toFixed(2)}</div>
                    <div className="bg-[#007aff] text-white text-[10px] font-bold px-3 py-1 rounded-[4px] w-max shadow-sm shadow-blue-500/20">
                      In Stock
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

    </div>
  );
}
