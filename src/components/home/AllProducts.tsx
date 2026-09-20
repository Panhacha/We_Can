"use client";

import { useState } from 'react';
import ProductCard from '@/components/catalog/ProductCard';
import { useAdmin } from '@/context/AdminContext';

export default function AllProducts() {
  const { products } = useAdmin();
  const [displayCount, setDisplayCount] = useState(24);
  
  const activeProducts = products.filter(p => p.status === 'Active');
  const displayedProducts = activeProducts.slice(0, displayCount);

  const handleLoadMore = () => {
    setDisplayCount(prev => prev + 12);
  };

  if (activeProducts.length === 0) return null;

  return (
    <section className="py-4 md:py-8 bg-gray-50 pb-24">
      <div className="max-w-[1600px] mx-auto px-2 sm:px-4 lg:px-8">
        <div className="flex justify-between items-end mb-4">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-1">You may also like</h2>
          </div>
        </div>

        {/* Product Grid - Staggered look on mobile */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-2 sm:gap-4 md:gap-6">
          {displayedProducts.map((product) => (
            <div key={product.id} className="w-full">
              <ProductCard product={product} />
            </div>
          ))}
        </div>

        {/* Load More Button */}
        {displayCount < activeProducts.length && (
          <div className="mt-12 flex justify-center">
            <button 
              onClick={handleLoadMore}
              className="px-8 py-3 bg-white border-2 border-primary text-primary font-bold rounded-full hover:bg-primary hover:text-white transition-all shadow-sm"
            >
              Load More Products
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
