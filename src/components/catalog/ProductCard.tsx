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
    <div className="group flex flex-col gap-3 relative">
      {/* Badges */}
      {product.isNew && (
        <div className="absolute top-2 left-2 z-10 px-2 py-1 text-[11px] font-bold uppercase tracking-wider text-white rounded bg-gray-900">
          New
        </div>
      )}
      {product.status === 'Out of Stock' && (
        <div className="absolute top-2 right-2 z-10 px-2 py-1 text-[11px] font-bold uppercase tracking-wider text-white rounded bg-red-600">
          Out of Stock
        </div>
      )}

      {/* Image */}
      <Link href={`/shop/${product.id}`} className="relative aspect-[4/5] w-full rounded-2xl overflow-hidden bg-[#f5f7f9] block">
        {product.image ? (
          <Image 
            src={product.image} 
            alt={product.name || 'Product'} 
            fill sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105 mix-blend-multiply"
          />
        ) : (
          <div className="w-full h-full bg-[#f5f7f9] flex items-center justify-center text-gray-400">No Image</div>
        )}
      </Link>

      {/* Info */}
      <div className="flex flex-col gap-1 mt-2">
        <Link href={`/shop/${product.id}`} className="text-[15px] font-bold text-gray-900 hover:text-primary transition-colors line-clamp-1 leading-snug">{product.name}</Link>
        
        {/* Description fallback */}
        <p className="text-[12px] text-gray-400 line-clamp-2 leading-relaxed">
           {product.description || `Minimalist ${product.category?.toLowerCase() || 'design'} built for city adventures and daily wear.`}
        </p>
        
        <div className="flex items-center justify-between mt-1.5">
          <div className="flex items-center gap-1.5">
            <span className="text-[14px] font-black text-gray-900">${Number(product.price || 0).toFixed(2)}</span>
            {product.originalPrice && (
              <span className="text-[11px] font-medium text-gray-400 line-through">${Number(product.originalPrice).toFixed(2)}</span>
            )}
          </div>
          
          <div className="flex items-center gap-1.5">
            {/* Wishlist Icon */}
            <button 
              className={`w-8 h-8 flex items-center justify-center rounded transition-colors focus:outline-none hover:bg-gray-100 text-gray-400`}
              onClick={handleToggleWishlist}
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill={isLiked ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={isLiked ? "text-red-500" : ""}><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>
            </button>
            
            {/* Cart Icon */}
            <button 
              className={`w-8 h-8 flex items-center justify-center rounded border border-gray-200 transition-colors focus:outline-none ${product.status === 'Out of Stock' ? 'text-gray-300 cursor-not-allowed' : 'text-gray-500 hover:text-gray-900 hover:border-gray-300 hover:bg-gray-50'}`}
              onClick={handleQuickAdd}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path><line x1="3" y1="6" x2="21" y2="6"></line><path d="M16 10a4 4 0 0 1-8 0"></path></svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
