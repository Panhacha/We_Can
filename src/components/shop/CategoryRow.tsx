import Image from 'next/image';
import { useAdmin } from '@/context/AdminContext';

interface CategoryRowProps {
  selectedCategory: string | null;
  onSelectCategory: (category: string) => void;
}

export default function CategoryRow({ selectedCategory, onSelectCategory }: CategoryRowProps) {
  const { categories, products } = useAdmin();

  // Split categories into two rows for the marquee
  const midIndex = Math.ceil(categories.length / 2);
  const baseRow1 = categories.slice(0, midIndex);
  const baseRow2 = categories.slice(midIndex);

  // Duplicate arrays heavily so the loop is seamless even on ultra-wide screens
  const row1 = Array(12).fill(baseRow1).flat();
  const row2 = Array(12).fill(baseRow2).flat();

  const renderCategoryCard = (cat: any, idx: number) => (
    <div 
      key={`${cat.id}-${idx}`} 
      onClick={() => onSelectCategory(cat.name)}
      className={`group flex items-center justify-between p-4 sm:p-5 cursor-pointer rounded-2xl w-[300px] shrink-0 transition-all duration-300 ${
        selectedCategory === cat.name 
          ? 'bg-blue-50 border-2 border-primary shadow-md' 
          : 'bg-white border-2 border-gray-100 hover:border-gray-200 hover:shadow-xl'
      }`}
    >
      <div className="flex flex-col pr-4">
        <span className={`text-base font-bold mb-1 transition-colors ${selectedCategory === cat.name ? 'text-primary' : 'text-gray-900 group-hover:text-primary'}`}>
          {cat.name}
        </span>
        <span className={`text-sm font-medium ${selectedCategory === cat.name ? 'text-blue-600/80' : 'text-gray-400'}`}>
          {products.filter(p => p.category === cat.name && p.status === 'Active').length} Products
        </span>
      </div>
      
      <div className={`relative w-16 h-16 rounded-full overflow-hidden flex-shrink-0 transition-transform duration-500 group-hover:scale-110 ${selectedCategory === cat.name ? 'ring-4 ring-white shadow-lg' : 'shadow-sm'}`}>
        <Image 
          src={cat.image} 
          alt={cat.name} 
          fill 
          sizes="96px" 
          className="object-cover" 
        />
      </div>
    </div>
  );

  return (
    <div className="mb-20 overflow-hidden relative">
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes scroll-rtl {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        @keyframes scroll-ltr {
          0% { transform: translateX(-50%); }
          100% { transform: translateX(0); }
        }
        .animate-scroll-rtl {
          animation: scroll-rtl 180s linear infinite;
        }
        .animate-scroll-ltr {
          animation: scroll-ltr 180s linear infinite;
        }
        .marquee-container:hover .animate-scroll-rtl,
        .marquee-container:hover .animate-scroll-ltr {
          animation-play-state: paused;
        }
      `}} />

      <div className="flex justify-between items-end mb-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 tracking-tight mb-1">Shop by Category</h2>
          <p className="text-gray-500 text-sm">Discover our curated collections</p>
        </div>
        <button 
          onClick={() => onSelectCategory('All')}
          className="text-sm font-bold text-primary hover:text-primary-dark flex items-center gap-1.5 transition-colors group"
        >
          View all 
          <svg className="transform group-hover:translate-x-1 transition-transform" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
        </button>
      </div>
      
      {/* Marquee Container */}
      <div className="flex flex-col gap-4 marquee-container">
        
        {/* Row 1: Right to Left */}
        <div className="flex w-max animate-scroll-rtl gap-4">
          {row1.map((cat, idx) => renderCategoryCard(cat, idx))}
        </div>

        {/* Row 2: Left to Right */}
        <div className="flex w-max animate-scroll-ltr gap-4">
          {row2.map((cat, idx) => renderCategoryCard(cat, idx))}
        </div>

      </div>
    </div>
  );
}
