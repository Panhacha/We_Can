"use client";

import { useRouter } from 'next/navigation';
import Hero from "@/components/home/Hero";
import FeaturedProducts from "@/components/home/FeaturedProducts";
import NewArrivals from "@/components/home/NewArrivals";
import CategoryRow from '@/components/shop/CategoryRow';

export default function Home() {
  const router = useRouter();

  return (
    <div>
      <Hero />
      
      {/* Category Section on Homepage */}
      <div className="bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <CategoryRow 
            selectedCategory={null}
            onSelectCategory={(cat) => router.push(`/shop?category=${encodeURIComponent(cat)}`)}
          />
        </div>
      </div>

      <FeaturedProducts />
      <NewArrivals />
    </div>
  );
}
