"use client";

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useAdmin } from '@/context/AdminContext';

export default function TaobaoCategories() {
  const { categories } = useAdmin();

  const CategoryContent = () => (
    <>
      {/* Regular Categories from Admin Context */}
      {categories.map((cat, idx) => (
        <Link key={`${cat.id}-${idx}`} href={`/shop?category=${encodeURIComponent(cat.name)}`} className="flex-shrink-0 w-16 flex flex-col items-center gap-1.5 cursor-pointer hover:opacity-80 transition-opacity">
          <div className="w-12 h-12 rounded-2xl bg-gray-50 flex items-center justify-center shadow-sm border border-gray-100 overflow-hidden relative">
            {cat.image ? (
              <Image src={cat.image} alt={cat.name} fill sizes="48px" className="object-cover" />
            ) : (
              <span className="text-xl">📦</span>
            )}
          </div>
          <span className="text-[10px] text-center text-gray-700 font-medium leading-tight line-clamp-2">
            {cat.name}
          </span>
        </Link>
      ))}
    </>
  );

  return (
    <div className="bg-white py-4 px-2 group flex items-center gap-3 sticky top-[112px] sm:top-[124px] lg:top-[90px] xl:top-[96px] z-40 border-b border-gray-100">
      <style>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          animation: marquee 25s linear infinite;
          width: max-content;
        }
        .group:hover .animate-marquee {
          animation-play-state: paused;
        }
        /* For mobile touch devices, we also want to pause on active */
        .group:active .animate-marquee {
          animation-play-state: paused;
        }
      `}</style>
      
      {/* Fixed Left Card */}
      <Link href="/promotions" className="flex-shrink-0 w-28 h-20 bg-[#fff3e0] rounded-xl p-2 border border-[#ffe0b2] flex flex-col items-center justify-center relative hover:opacity-90 transition-opacity z-10 shadow-sm">
        <div className="absolute top-0 right-0 bg-[#ff3b30] text-white text-[10px] font-bold px-1.5 py-0.5 rounded-bl-lg rounded-tr-xl shadow-sm">
          $12 prize
        </div>
        <div className="text-2xl mb-1 mt-1">🎁</div>
        <span className="text-[11px] font-bold text-gray-800 text-center leading-tight">Go To Draw &gt;</span>
      </Link>

      {/* Scrolling Right Area */}
      <div className="flex-1 overflow-hidden relative">
        {/* Container that is exactly 2x the width of one content block */}
        <div className="flex animate-marquee">
          <div className="flex gap-3 pr-3">
            <CategoryContent />
          </div>
          <div className="flex gap-3 pr-3">
            <CategoryContent />
          </div>
        </div>
      </div>
    </div>
  );
}
