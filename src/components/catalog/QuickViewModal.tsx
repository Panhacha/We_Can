import { useState } from 'react';
import Image from 'next/image';
import { Product } from '@/lib/mockProducts';

interface QuickViewModalProps {
  product: Product;
  onClose: () => void;
}

export default function QuickViewModal({ product, onClose }: QuickViewModalProps) {
  const [activeVariantIdx, setActiveVariantIdx] = useState(0);
  const activeVariant = product.variants[activeVariantIdx];
  
  const [activeSizeIdx, setActiveSizeIdx] = useState(0);
  const activeSize = activeVariant.sizes[activeSizeIdx];

  const handleColorChange = (idx: number) => {
    setActiveVariantIdx(idx);
    setActiveSizeIdx(0); // Reset size when color changes
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />
      
      {/* Modal Content */}
      <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-4xl overflow-hidden flex flex-col md:flex-row animate-in fade-in zoom-in-95 duration-200">
        
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 bg-white/80 backdrop-blur-md rounded-full text-gray-500 hover:text-gray-900 transition-colors shadow-sm"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
        </button>

        {/* Left: Product Image */}
        <div className="w-full md:w-1/2 relative bg-gray-100 aspect-square md:aspect-auto md:min-h-[600px]">
          <Image 
            src={activeVariant.images[0]} 
            alt={product.name} 
            fill sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover"
          />
        </div>

        {/* Right: Product Details */}
        <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col">
          <div className="mb-2">
            <span className="text-xs font-bold tracking-widest text-primary uppercase">{product.brand}</span>
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">{product.name}</h2>
          <p className="text-gray-500 text-sm leading-relaxed mb-6 pb-6 border-b border-gray-100">
            {product.subtitle}
          </p>

          <div className="mb-8">
            <div className="text-3xl font-bold text-gray-900 mb-1">
              ${activeSize.price.toFixed(2)}
            </div>
            <p className="text-sm text-green-600 font-medium">In Stock</p>
          </div>

          {/* Color Selection */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider">Color</h3>
              <span className="text-sm text-gray-500 font-medium">{activeVariant.colorName}</span>
            </div>
            <div className="flex flex-wrap gap-3">
              {product.variants.map((variant, idx) => (
                <button 
                  key={idx}
                  onClick={() => handleColorChange(idx)}
                  className={`w-10 h-10 rounded-full ${variant.colorCode} border-2 ring-offset-2 transition-all focus:outline-none ${activeVariantIdx === idx ? 'ring-2 ring-primary border-white shadow-md' : 'border-gray-200 hover:ring-2 hover:ring-gray-300'}`}
                  title={variant.colorName}
                />
              ))}
            </div>
          </div>

          {/* Size Selection */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider">Size</h3>
            </div>
            <div className="flex flex-wrap gap-3">
              {activeVariant.sizes.map((sizeObj, idx) => (
                <button 
                  key={idx}
                  onClick={() => setActiveSizeIdx(idx)}
                  className={`min-w-[3rem] px-4 py-2 rounded-xl text-sm font-semibold transition-all focus:outline-none ${activeSizeIdx === idx ? 'bg-primary text-white shadow-md shadow-primary/30' : 'bg-gray-50 text-gray-700 border border-gray-200 hover:border-primary hover:text-primary'}`}
                >
                  {sizeObj.size}
                </button>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="mt-auto flex gap-4 pt-6 border-t border-gray-100">
            <button className="flex-1 bg-gray-900 text-white font-semibold rounded-full py-4 px-8 hover:bg-black transition-colors shadow-lg hover:shadow-xl hover:-translate-y-0.5 transform duration-200">
              Add to Cart - ${activeSize.price.toFixed(2)}
            </button>
            <button className="flex-shrink-0 w-14 h-14 rounded-full border-2 border-gray-200 flex items-center justify-center text-gray-400 hover:text-red-500 hover:border-red-500 transition-colors">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg>
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}

