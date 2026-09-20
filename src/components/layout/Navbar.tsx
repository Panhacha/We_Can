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
      <div className="fixed top-4 sm:top-6 z-50 w-full px-4 sm:px-6 lg:px-8 max-w-6xl left-1/2 -translate-x-1/2 transition-all duration-300">
        <nav className="bg-white/95 backdrop-blur-md shadow-[0_8px_30px_rgb(0,0,0,0.06)] border border-gray-100 rounded-full px-4 sm:px-8" suppressHydrationWarning>
          <div className="flex justify-between items-center h-16">
          
          {/* Logo & Profile */}
          <div className="flex-shrink-0 flex items-center gap-8 lg:gap-12 lg:w-auto">
            <Link 
              href={isAuthenticated ? "/account" : "/login"} 
              className="flex items-center justify-center transition-all group hover:opacity-80"
            >
              <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 overflow-hidden border-2 border-[#ff6600] shadow-[0_0_8px_rgba(255,102,0,0.4)]">
                {isAuthenticated && user?.avatarUrl ? (
                  <img src={user.avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
                ) : (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
                )}
              </div>
            </Link>

            <Link href="/" className="flex flex-col items-start leading-none group">
              <span className="text-2xl font-black tracking-tighter bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent uppercase group-hover:opacity-80 transition-opacity">
                WE can
              </span>
              <span className="text-[10px] font-bold text-gray-500 tracking-widest uppercase mt-0.5 ml-1">
                Ma La Ra
              </span>
            </Link>
          </div>

          <div className="hidden lg:flex flex-1 justify-center space-x-8 items-center">
            <Link href="/" className={`text-[13px] font-bold transition-all hover:text-gray-900 ${pathname === '/' ? 'text-gray-900 border-b-2 border-gray-900 pb-1' : 'text-gray-500'}`}>Home</Link>
            <Link href="/shop" className={`text-[13px] font-bold transition-all hover:text-gray-900 ${pathname.startsWith('/shop') ? 'text-gray-900 border-b-2 border-gray-900 pb-1' : 'text-gray-500'}`}>Shop</Link>
            <Link href="/about" className={`text-[13px] font-bold transition-all hover:text-gray-900 ${pathname === '/about' ? 'text-gray-900 border-b-2 border-gray-900 pb-1' : 'text-gray-500'}`}>About</Link>
            <Link href="/contact" className={`text-[13px] font-bold transition-all hover:text-gray-900 ${pathname === '/contact' ? 'text-gray-900 border-b-2 border-gray-900 pb-1' : 'text-gray-500'}`}>Contact</Link>
          </div>

          {/* Mobile Menu Icon (Hidden on Desktop) */}
          <div className="lg:hidden flex items-center">
            <button className="text-gray-600 hover:text-gray-900 focus:outline-none" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
              {isMobileMenuOpen ? (
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
              ) : (
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>
              )}
            </button>
          </div>

          {/* Right Actions */}
          <div className="hidden lg:flex items-center justify-end space-x-5 lg:w-auto">
            <form action="/shop" method="GET" className="relative flex items-center group transition-all duration-300 w-9 hover:w-56 focus-within:w-56 bg-white hover:bg-gray-50 focus-within:bg-gray-50 rounded-full border border-transparent hover:border-gray-200 focus-within:border-gray-200 overflow-hidden">
              <button type="submit" className="text-gray-400 hover:text-gray-900 transition-colors flex-shrink-0 flex items-center justify-center h-9 w-9">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
              </button>
              <input 
                type="text" 
                name="q" 
                placeholder="Search..." 
                className="w-full bg-transparent border-none outline-none text-sm pr-4 opacity-0 group-hover:opacity-100 focus-within:opacity-100 transition-opacity duration-300"
                autoComplete="off"
              />
            </form>

            <Link href="/track" className={`flex items-center gap-1.5 text-[13px] font-bold transition-all hover:text-gray-900 ${pathname === '/track' ? 'text-gray-900' : 'text-gray-500'}`}>
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
      </nav>
    </div>

    {/* Mobile Menu Drawer */}
    {isMobileMenuOpen && (
      <div className="lg:hidden fixed inset-0 z-40 bg-white/95 backdrop-blur-xl pt-28 px-6 overflow-y-auto">
        <div className="flex flex-col space-y-6 text-center">
          <Link href="/" onClick={() => setIsMobileMenuOpen(false)} className={`text-xl font-bold ${pathname === '/' ? 'text-gray-900' : 'text-gray-500'}`}>Home</Link>
          <Link href="/shop" onClick={() => setIsMobileMenuOpen(false)} className={`text-xl font-bold ${pathname.startsWith('/shop') ? 'text-gray-900' : 'text-gray-500'}`}>Shop</Link>
          <Link href="/about" onClick={() => setIsMobileMenuOpen(false)} className={`text-xl font-bold ${pathname === '/about' ? 'text-gray-900' : 'text-gray-500'}`}>About</Link>
          <Link href="/contact" onClick={() => setIsMobileMenuOpen(false)} className={`text-xl font-bold ${pathname === '/contact' ? 'text-gray-900' : 'text-gray-500'}`}>Contact</Link>
          <Link href="/track" onClick={() => setIsMobileMenuOpen(false)} className={`text-xl font-bold ${pathname === '/track' ? 'text-gray-900' : 'text-gray-500'}`}>Track Orders</Link>
          <div className="pt-6 flex flex-col gap-4">
            <form action="/shop" method="GET" className="relative flex items-center bg-gray-100 rounded-full overflow-hidden w-full h-12 px-4" onSubmit={() => setIsMobileMenuOpen(false)}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-500 mr-2"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
              <input type="text" name="q" placeholder="Search products..." className="bg-transparent border-none outline-none w-full text-sm" />
            </form>
            <div className="flex justify-center gap-4 pb-12">
              <Link href="/wishlist" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center justify-center gap-2 bg-pink-50 text-pink-500 px-6 py-3 rounded-full font-bold flex-1">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>
                Wishlist ({wishlistItems})
              </Link>
              <Link href="/cart" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center justify-center gap-2 bg-gray-900 text-white px-6 py-3 rounded-full font-bold flex-1">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path><line x1="3" y1="6" x2="21" y2="6"></line><path d="M16 10a4 4 0 0 1-8 0"></path></svg>
                Cart ({totalItems})
              </Link>
            </div>
          </div>
        </div>
      </div>
    )}
    
    {pathname !== '/' && <div className="h-28"></div>}
    </>
  );
}
