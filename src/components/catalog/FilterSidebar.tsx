"use client";

interface FilterSidebarProps {
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
}

const categories = ["All Categories", "Men", "Women", "Kids", "Accessories"];

export default function FilterSidebar({ selectedCategory, onCategoryChange }: FilterSidebarProps) {
  return (
    <div className="w-full lg:w-1/4 flex-shrink-0">
      <div className="sticky top-24">
        <h3 className="text-sm font-bold text-gray-900 uppercase tracking-widest mb-6 border-b border-gray-100 pb-4">Category</h3>
        <ul className="space-y-2">
          {categories.map((cat) => (
            <li key={cat}>
              <button
                onClick={() => onCategoryChange(cat)}
                className={`text-[15px] transition-all flex items-center justify-between w-full text-left py-2 px-3 rounded-lg ${
                  selectedCategory === cat 
                    ? 'bg-gray-50 text-primary font-bold' 
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                {cat}
                {selectedCategory === cat && (
                   <span className="w-1.5 h-1.5 rounded-full bg-primary"></span>
                )}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
