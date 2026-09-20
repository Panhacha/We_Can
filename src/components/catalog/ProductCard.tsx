"use client";
import Image from 'next/image';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';

export interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  category: string;
  image: string;
  isNew?: boolean;
  rating?: number;
  stock: number;
  status: 'Active' | 'Out of Stock' | 'Draft';
}

interface ProductCardProps {
  product: Product | any;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addToCart } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const isLiked = isInWishlist(product.id?.toString());

  const handleToggleWishlist = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    if (isLiked) {
      removeFromWishlist(product.id?.toString());
    } else {
      addToWishlist({
        productId: product.id?.toString(),
        name: product.name,
        price: product.price || 0,
        image: product.image || ''
      });
    }
  };

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    
    // Check if out of stock
    if (product.status === 'Out of Stock' || product.stock <= 0) {
      alert('This product is out of stock.');
      return;
    }
    
    addToCart({
      productId: product.id,
      name: product.name,
      price: product.price || 0,
      image: product.image || '',
      quantity: 1,
      color: 'Default',
      size: 'Default'
    });
  };

  return (
    <div className="group flex flex-col bg-white rounded-xl md:rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow h-full border border-gray-100/50">
      {/* Badges */}
      <div className="relative">
        {product.isNew && (
          <div className="absolute top-1 left-1 md:top-2 md:left-2 z-10 px-1 md:px-2 py-0.5 md:py-1 text-[8px] md:text-[10px] font-bold uppercase text-white rounded-md bg-gradient-to-r from-red-500 to-orange-500">
            New
          </div>
        )}
        {product.status === 'Out of Stock' && (
          <div className="absolute top-1 right-1 md:top-2 md:right-2 z-10 px-1 md:px-2 py-0.5 md:py-1 text-[8px] md:text-[10px] font-bold uppercase text-white rounded-md bg-gray-800/80">
            Sold Out
          </div>
        )}

        {/* Image */}
        <Link href={`/shop/${product.id}`} className="relative aspect-square w-full bg-[#f5f7f9] block">
          {product.image ? (
            <Image 
              src={product.image} 
              alt={product.name || 'Product'} 
              fill sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="w-full h-full bg-[#f5f7f9] flex items-center justify-center text-gray-400">No Image</div>
          )}
        </Link>
      </div>

      {/* Info */}
      <div className="flex flex-col flex-1 p-2 md:p-3">
        <Link href={`/shop/${product.id}`} className="text-[12px] md:text-[14px] font-medium text-gray-800 hover:text-primary transition-colors line-clamp-2 leading-tight mb-1">{product.name}</Link>
        
        {/* Free Shipping Tag (Taobao style) */}
        <div className="mt-1 mb-2">
          <span className="inline-block px-1.5 py-0.5 bg-green-50 text-green-600 text-[9px] md:text-[10px] font-bold rounded">
            Free Shipping
          </span>
        </div>
        
        <div className="mt-auto flex items-end justify-between">
          <div className="flex items-baseline gap-1">
            <span className="text-[10px] md:text-[12px] font-bold text-[#ff5000]">$</span>
            <span className="text-[15px] md:text-[18px] font-extrabold text-[#ff5000] leading-none">{Number(product.price || 0).toFixed(2)}</span>
            {product.originalPrice && (
              <span className="text-[9px] md:text-[11px] text-gray-400 line-through ml-1">${Number(product.originalPrice).toFixed(2)}</span>
            )}
          </div>
          
          <div className="flex items-center gap-2">
            <span className="text-[10px] text-gray-400 hidden sm:inline-block">{product.stock > 0 ? `${product.stock * 3} sold` : ''}</span>
            {/* Cart Icon */}
            <button 
              className={`w-6 h-6 md:w-7 md:h-7 flex items-center justify-center rounded-full transition-colors focus:outline-none ${product.status === 'Out of Stock' ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-[#ff5000] text-white shadow-sm shadow-orange-200 hover:bg-[#e64800]'}`}
              onClick={handleQuickAdd}
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="md:w-[14px] md:h-[14px]"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path><line x1="3" y1="6" x2="21" y2="6"></line><path d="M16 10a4 4 0 0 1-8 0"></path></svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
