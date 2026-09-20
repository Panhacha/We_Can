"use client";
import React, { useState } from 'react';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { useWishlist } from '@/context/WishlistContext';
import { usePathname } from 'next/navigation';

export default function Navbar() {
  const pathname = usePathname();
  const { totalItems } = useCart();
  const { isAuthenticated, user } = useAuth();
  const { totalItems: wishlistItems } = useWishlist();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  if (pathname.startsWith('/admin')) return null;
  
  return (
    <>
      <div className={`fixed top-4 sm:top-6 z-50 w-full px-4 sm:px-6 lg:px-8 max-w-6xl left-1/2 -translate-x-1/2 transition-all duration-300 ${pathname === '/' ? 'hidden lg:block' : 'block'}`}>
        <nav className="bg-white/98 backdrop-blur-md shadow-[0_4px_20px_rgb(0,0,0,0.04)] border border-gray-100 rounded-full px-4 sm:px-6 lg:px-8" suppressHydrationWarning>
          <div className="flex justify-between items-center h-16">
          
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center lg:w-auto">
            <Link href="/" className="flex flex-col items-start leading-none group">
              <span className="text-2xl font-black tracking-tighter bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent uppercase group-hover:opacity-80 transition-opacity">
                WE can
              </span>
              <span className="text-[10px] font-bold text-gray-500 tracking-widest uppercase mt-0.5 ml-1">
                Ma La Ra
              </span>
            </Link>
          </div>

          <div className="hidden lg:flex flex-1 justify-start pl-6 xl:pl-10 space-x-1 xl:space-x-4 items-center">
            <Link href="/" className={`px-4 py-2 rounded-full text-[13px] transition-all ${pathname === '/' ? 'text-[#3d98d2] font-black bg-blue-50/60' : 'text-gray-500 font-bold hover:text-[#3d98d2] hover:bg-gray-50'}`}>Home</Link>
            <Link href="/shop" className={`px-4 py-2 rounded-full text-[13px] transition-all ${pathname.startsWith('/shop') ? 'text-[#3d98d2] font-black bg-blue-50/60' : 'text-gray-500 font-bold hover:text-[#3d98d2] hover:bg-gray-50'}`}>Shop</Link>
            <Link href="/about" className={`px-4 py-2 rounded-full text-[13px] transition-all ${pathname === '/about' ? 'text-[#3d98d2] font-black bg-blue-50/60' : 'text-gray-500 font-bold hover:text-[#3d98d2] hover:bg-gray-50'}`}>About</Link>
            <Link href="/contact" className={`px-4 py-2 rounded-full text-[13px] transition-all ${pathname === '/contact' ? 'text-[#3d98d2] font-black bg-blue-50/60' : 'text-gray-500 font-bold hover:text-[#3d98d2] hover:bg-gray-50'}`}>Contact</Link>
          </div>

          {/* Mobile Menu Icon (Removed for Bottom Nav) */}

          {/* Right Actions */}
          <div className="flex items-center justify-end gap-3 lg:gap-5 lg:w-auto">
            <div className="hidden lg:flex items-center space-x-5">
              <form action="/shop" method="GET" className="hidden lg:flex relative items-center w-[220px] xl:w-[300px] bg-white rounded-full p-1 shadow-[0_2px_15px_rgba(0,0,0,0.04)] border border-gray-100 h-[38px] group hover:border-[#50a8df]/50 transition-colors">
                <input 
                  type="text" 
                  name="q" 
                  placeholder="Search for products..." 
                  className="flex-1 h-full bg-transparent border-none outline-none text-[13px] text-gray-700 px-4"
                  autoComplete="off"
                />
                <button type="submit" className="group/btn bg-gradient-to-r from-[#60b6ea] to-[#3d98d2] shadow-sm shadow-blue-500/20 text-white h-[30px] w-[30px] hover:w-[85px] rounded-full flex items-center justify-center overflow-hidden hover:shadow-md hover:shadow-blue-500/30 transition-all duration-300 ease-out active:scale-95 flex-shrink-0">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="flex-shrink-0">
                    <circle cx="11" cy="11" r="8"></circle>
                    <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                  </svg>
                  <span className="font-bold text-[13px] max-w-0 opacity-0 group-hover/btn:max-w-[50px] group-hover/btn:opacity-100 group-hover/btn:ml-1.5 transition-all duration-300 ease-out whitespace-nowrap">Search</span>
                </button>
              </form>

              <Link href="/track" className={`flex items-center gap-1.5 text-[13px] font-bold whitespace-nowrap transition-all hover:text-gray-900 ${pathname === '/track' ? 'text-gray-900' : 'text-gray-500'}`}>
                <svg className="w-4 h-4 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path><polyline points="3.29 7 12 12 20.71 7"></polyline><line x1="12" y1="22" x2="12" y2="12"></line></svg>
                Track Orders
              </Link>

              <Link href="/wishlist" className="text-gray-400 hover:text-pink-500 transition-colors relative">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>
                {wishlistItems > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 bg-pink-500 text-white text-[9px] font-bold h-3.5 min-w-3.5 px-1 rounded-full flex items-center justify-center">
                    {wishlistItems}
                  </span>
                )}
              </Link>
              
              <Link href="/cart" className="flex items-center justify-center space-x-2 bg-gray-900 hover:bg-gray-800 text-white px-4 py-2 rounded-full transition-all text-[13px] font-bold flex-shrink-0">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path><line x1="3" y1="6" x2="21" y2="6"></line><path d="M16 10a4 4 0 0 1-8 0"></path></svg>
                <span>{totalItems > 0 ? `${totalItems}` : 'Cart'}</span>
              </Link>
            </div>
          </div>

        </div>
      </nav>
    </div>

    {/* Modern Floating Bottom Navigation for Mobile */}
    <div className="lg:hidden fixed bottom-4 left-4 right-4 z-50 pb-safe">
      <div className="bg-white/80 backdrop-blur-xl border border-white/60 shadow-[0_8px_32px_rgba(0,0,0,0.12)] rounded-3xl flex justify-around items-center h-16 px-2 relative overflow-hidden">
        <Link href={isAuthenticated ? "/account" : "/login"} className={`relative flex flex-col items-center justify-center w-full h-full transition-all duration-300 ${pathname.startsWith('/account') ? 'text-primary scale-105' : 'text-gray-400 hover:text-gray-900 hover:scale-105'}`}>
          {pathname.startsWith('/account') && <div className="absolute inset-0 bg-primary/10 rounded-2xl m-1.5 transition-all duration-300"></div>}
          <div className="relative z-10 flex flex-col items-center justify-center space-y-1">
            {isAuthenticated && user?.avatarUrl ? (
              <img src={user.avatarUrl} alt="Avatar" className="w-5 h-5 rounded-full object-cover border border-gray-200" />
            ) : (
              <svg width="22" height="22" viewBox="0 0 24 24" fill={pathname.startsWith('/account') ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth={pathname.startsWith('/account') ? '0' : '2'} strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4" fill={pathname.startsWith('/account') ? 'white' : 'none'}></circle></svg>
            )}
            <span className={`text-[10px] font-bold ${pathname.startsWith('/account') ? 'opacity-100' : 'opacity-80'}`}>Account</span>
          </div>
        </Link>

        <Link href="/wishlist" className={`relative flex flex-col items-center justify-center w-full h-full transition-all duration-300 ${pathname === '/wishlist' ? 'text-pink-500 scale-105' : 'text-gray-400 hover:text-gray-900 hover:scale-105'}`}>
          {pathname === '/wishlist' && <div className="absolute inset-0 bg-pink-50 rounded-2xl m-1.5 transition-all duration-300"></div>}
          <div className="relative z-10 flex flex-col items-center justify-center space-y-1">
            <svg width="22" height="22" viewBox="0 0 24 24" fill={pathname === '/wishlist' ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth={pathname === '/wishlist' ? '0' : '2'} strokeLinecap="round" strokeLinejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>
            <span className={`text-[10px] font-bold ${pathname === '/wishlist' ? 'opacity-100' : 'opacity-80'}`}>Wishlist</span>
            {wishlistItems > 0 && (
              <span className="absolute -top-1 -right-2 bg-pink-500 text-white text-[9px] font-bold h-4 min-w-4 px-1 rounded-full flex items-center justify-center shadow-sm">
                {wishlistItems}
              </span>
            )}
          </div>
        </Link>

        <Link href="/cart" className={`relative flex flex-col items-center justify-center w-full h-full transition-all duration-300 ${pathname === '/cart' ? 'text-primary scale-105' : 'text-gray-400 hover:text-gray-900 hover:scale-105'}`}>
          {pathname === '/cart' && <div className="absolute inset-0 bg-primary/10 rounded-2xl m-1.5 transition-all duration-300"></div>}
          <div className="relative z-10 flex flex-col items-center justify-center space-y-1">
            <svg width="22" height="22" viewBox="0 0 24 24" fill={pathname === '/cart' ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth={pathname === '/cart' ? '0' : '2'} strokeLinecap="round" strokeLinejoin="round"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path><line x1="3" y1="6" x2="21" y2="6"></line><path d="M16 10a4 4 0 0 1-8 0" stroke={pathname === '/cart' ? 'white' : 'currentColor'} strokeWidth="2"></path></svg>
            <span className={`text-[10px] font-bold ${pathname === '/cart' ? 'opacity-100' : 'opacity-80'}`}>Cart</span>
            {totalItems > 0 && (
              <span className="absolute -top-1 -right-2 bg-gray-900 text-white text-[9px] font-bold h-4 min-w-4 px-1 rounded-full flex items-center justify-center border-[1.5px] border-white shadow-sm">
                {totalItems}
              </span>
            )}
          </div>
        </Link>

        <Link href="/" className={`relative flex flex-col items-center justify-center w-full h-full transition-all duration-300 ${pathname === '/' ? 'text-primary scale-105' : 'text-gray-400 hover:text-gray-900 hover:scale-105'}`}>
          {pathname === '/' && <div className="absolute inset-0 bg-primary/10 rounded-2xl m-1.5 transition-all duration-300"></div>}
          <div className="relative z-10 flex flex-col items-center justify-center space-y-1">
            <svg width="22" height="22" viewBox="0 0 24 24" fill={pathname === '/' ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth={pathname === '/' ? '0' : '2'} strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22" stroke={pathname === '/' ? 'white' : 'currentColor'} strokeWidth="2"></polyline></svg>
            <span className={`text-[10px] font-bold ${pathname === '/' ? 'opacity-100' : 'opacity-80'}`}>Home</span>
          </div>
        </Link>
      </div>
    </div>
    
    {pathname !== '/' && <div className="h-28"></div>}
    </>
  );
}
