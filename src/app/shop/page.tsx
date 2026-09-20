"use client";

import { useState, useMemo, useRef, useEffect } from 'react';
import CategoryRow from '@/components/shop/CategoryRow';
import ProductCard from '@/components/catalog/ProductCard';
import { useAdmin } from '@/context/AdminContext';
import WeCanLoading from '@/components/ui/WeCanLoading';

export default function ShopPage() {
  const { products, isLoading } = useAdmin();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const category = params.get('category');
    const q = params.get('q');
    
    if (q) {
      setSearchQuery(q);
    }
    if (category) {
      setSelectedCategory(category);
      // Wait a tick for render then scroll
      setTimeout(() => {
        if (productsRef.current) {
          const y = productsRef.current.getBoundingClientRect().top + window.scrollY - 100;
          window.scrollTo({ top: y, behavior: 'smooth' });
        }
      }, 100);
    }
  }, []);
  const productsRef = useRef<HTMLDivElement>(null);

  const filteredProductsBase = useMemo(() => {
    let result = products.filter(p => p.status === 'Active');
    
    if (selectedCategory && selectedCategory !== 'All') {
      result = result.filter(p => p.category === selectedCategory);
    }
    
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(p => 
        p.name.toLowerCase().includes(q) || 
        p.description?.toLowerCase().includes(q)
      );
    }
    
    return result;
  }, [selectedCategory, searchQuery, products]);

  // Duplicate to simulate many products for the grid (since we only have 12 mocks)
  const displayProducts = filteredProductsBase;

  if (isLoading) return <div className="min-h-[80vh] flex items-center justify-center"><WeCanLoading /></div>;

  const handleSelectCategory = (category: string) => {
    setSelectedCategory(category);
    // Smooth scroll to the products section so user sees the change
    if (productsRef.current) {
      const y = productsRef.current.getBoundingClientRect().top + window.scrollY - 100;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-white" suppressHydrationWarning>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        
        <CategoryRow 
          selectedCategory={selectedCategory} 
          onSelectCategory={handleSelectCategory} 
        />
        
        {/* Products Grid */}
        <div ref={productsRef} className="pt-8 scroll-mt-24">
          <div className="flex justify-between items-center mb-8 flex-wrap gap-4">
            <h2 className="text-2xl font-bold text-gray-900 tracking-tight">
              {searchQuery ? (
                <>Search results for <span className="text-primary">"{searchQuery}"</span></>
              ) : (
                selectedCategory && selectedCategory !== 'All' ? `${selectedCategory} Products` : 'Trending Products'
              )}
            </h2>
            <span className="text-sm font-medium text-gray-500">
              {displayProducts.length} Results
            </span>
          </div>
          
          {displayProducts.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-gray-500 text-lg">No products found in this category.</p>
            </div>
          ) : (
            <div className="grid grid-cols-4 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-6 2xl:grid-cols-6 gap-x-2 gap-y-6 md:gap-x-4 md:gap-y-8">
              {displayProducts.map((product, idx) => (
                <ProductCard 
                  key={`${product.id}-${idx}`} 
                  product={product} 
                />
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
