"use client";

import React, { useState } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';

export default function TaobaoSearchTop() {
  const pathname = usePathname();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  
  if (pathname !== '/') return null;

  return (
    <div className="bg-gradient-to-b from-[#ffede1] to-[#f8f9fa] pt-4 sm:pt-6 pb-2 px-3 sm:px-4 rounded-b-2xl shadow-sm lg:hidden sticky top-0 z-50">
      {/* Logo & Search Row */}
      <div className="flex items-center justify-between w-full max-w-4xl mx-auto lg:hidden">
        {/* Logo for mobile */}
        <Link href="/" className={`flex-shrink-0 flex-col items-start leading-none group transition-all duration-300 ${isSearchOpen ? 'hidden sm:flex' : 'flex'}`}>
          <span className="text-[16px] sm:text-xl font-black tracking-tighter bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent uppercase group-hover:opacity-80 transition-opacity">
            WE can
          </span>
          <span className="text-[6px] sm:text-[8px] font-bold text-gray-500 tracking-widest uppercase mt-0.5 ml-0.5">
            Ma La Ra
          </span>
        </Link>

        {/* Collapsible Search Bar */}
        <div className={`relative flex items-center transition-all duration-300 ease-in-out ${isSearchOpen ? 'w-full bg-white rounded-full p-1 shadow-[0_2px_15px_rgba(0,0,0,0.06)] border border-gray-100 h-10 sm:h-11' : 'w-10 h-10 justify-end'}`}>
          {isSearchOpen ? (
            <>
              <input 
                type="text"
                autoFocus
                placeholder="Search for products..."
                className="flex-1 h-full bg-transparent outline-none text-[13px] sm:text-sm text-gray-700 w-full min-w-0 placeholder-gray-400 px-3"
              />
              
              <button 
                onClick={() => setIsSearchOpen(false)}
                className="text-gray-400 hover:text-gray-700 p-2 mr-1"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>

              <button className="group/btn bg-gradient-to-r from-[#60b6ea] to-[#3d98d2] shadow-md shadow-blue-500/20 text-white h-[32px] w-[32px] sm:h-[36px] sm:w-[36px] hover:w-[85px] rounded-full flex items-center justify-center overflow-hidden hover:shadow-lg hover:shadow-blue-500/30 transition-all duration-300 ease-out active:scale-95 flex-shrink-0 self-center mr-1">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="flex-shrink-0 sm:w-[18px] sm:h-[18px]">
                  <circle cx="11" cy="11" r="8"></circle>
                  <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                </svg>
                <span className="font-bold text-[13px] max-w-0 opacity-0 group-hover/btn:max-w-[50px] group-hover/btn:opacity-100 group-hover/btn:ml-1.5 transition-all duration-300 ease-out whitespace-nowrap">Search</span>
              </button>
            </>
          ) : (
            <button 
              onClick={() => setIsSearchOpen(true)}
              className="w-10 h-10 rounded-full flex items-center justify-center text-gray-600 bg-white/80 shadow-sm border border-gray-100 hover:bg-white hover:shadow-md transition-all"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#50a8df" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              </svg>
            </button>
          )}
        </div>
      </div>



      {/* Top Tabs */}
      <div className="mt-4 overflow-x-auto elegant-scrollbar pb-1">
        <div className="flex items-center gap-2 min-w-max px-2 py-1">
          {/* Active Tab */}
          <button className="bg-gradient-to-r from-[#60b6ea] to-[#3d98d2] text-white px-5 py-1.5 rounded-full shadow-md shadow-blue-500/20 text-[14px] font-bold transition-all active:scale-95">
            Explore
          </button>
          
          {/* Special Badge Tab */}
          <button className="bg-[#fff4ed] text-[#ff6600] px-3 py-1.5 rounded-full border border-[#ffedd5] flex items-center gap-1.5 text-[13px] font-bold hover:bg-[#ffebd6] transition-colors active:scale-95">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="3" width="15" height="13"></rect><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"></polygon><circle cx="5.5" cy="18.5" r="2.5"></circle><circle cx="18.5" cy="18.5" r="2.5"></circle></svg>
            FREE SHIPPING
          </button>
          
          {/* Default Tabs */}
          <button className="text-[14px] font-medium text-gray-500 hover:text-gray-900 px-4 py-1.5 rounded-full hover:bg-gray-100/80 transition-colors">Fashion</button>
          <button className="text-[14px] font-medium text-gray-500 hover:text-gray-900 px-4 py-1.5 rounded-full hover:bg-gray-100/80 transition-colors">Home</button>
          <button className="text-[14px] font-medium text-gray-500 hover:text-gray-900 px-4 py-1.5 rounded-full hover:bg-gray-100/80 transition-colors">Sports</button>
          <button className="text-[14px] font-medium text-gray-500 hover:text-gray-900 px-4 py-1.5 rounded-full hover:bg-gray-100/80 transition-colors">Electronics</button>
        </div>
      </div>
    </div>
  );
}
