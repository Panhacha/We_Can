"use client";

import Hero from "@/components/home/Hero";
import AllProducts from '@/components/home/AllProducts';
import TaobaoSearchTop from '@/components/home/TaobaoSearchTop';
import TaobaoCategories from '@/components/home/TaobaoCategories';

export default function Home() {
  return (
    <div className="bg-gray-50 min-h-screen">
      <TaobaoSearchTop />
      <Hero />
      <TaobaoCategories />
      <AllProducts />
    </div>
  );
}
