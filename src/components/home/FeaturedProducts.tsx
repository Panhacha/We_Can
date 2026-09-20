"use client";

import Link from 'next/link';
import ProductCard from '@/components/catalog/ProductCard';
import { useAdmin } from '@/context/AdminContext';

export default function FeaturedProducts() {
  const { products } = useAdmin();
  
  // Get only popular products for Best Sellers (show up to 12 to fill 2 rows of 6)
  const popularProducts = products.filter(p => p.status === 'Active').slice(0, 12);

  return (
    <section className="py-20 bg-white">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-end mb-12">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Best Sellers</h2>
            <p className="text-gray-500">Our most popular items this week.</p>
          </div>
          <div className="hidden sm:flex items-center">
            <Link href="/shop" className="text-primary hover:text-primary-dark font-medium transition-colors">
              View All →
            </Link>
          </div>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4 pt-4">
          {popularProducts.map((product) => (
            <div key={product.id} className="w-full">
              <ProductCard 
                product={product} 
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
