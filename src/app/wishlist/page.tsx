"use client";
import Link from 'next/link';
import Image from 'next/image';
import { useWishlist } from '@/context/WishlistContext';
import { useCart } from '@/context/CartContext';
import { useRouter } from 'next/navigation';

export default function WishlistPage() {
  const { items, removeFromWishlist } = useWishlist();
  const { addToCart } = useCart();
  const router = useRouter();

  const handleAddToCart = (item: any) => {
    // We add a generic default variant for simplicity here
    // In a real app, it might prompt to select size/color first
    addToCart({
      productId: item.productId,
      name: item.name,
      price: item.price,
      image: item.image,
      quantity: 1,
      color: 'Default',
      size: 'Default'
    });
    router.push('/cart');
  };

  return (
    <div className="bg-gray-50 min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-extrabold text-gray-900">My Wishlist</h1>
          <span className="text-gray-500 font-medium">{items.length} items</span>
        </div>

        {items.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center shadow-sm border border-gray-100">
            <div className="w-20 h-20 bg-pink-50 text-pink-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">Your wishlist is empty</h2>
            <p className="text-gray-500 mb-8">Save items you love here to easily find them later.</p>
            <Link href="/shop" className="inline-block bg-primary text-white font-bold py-3 px-8 rounded-full hover:bg-primary-dark transition-colors shadow-lg hover:shadow-xl hover:-translate-y-0.5 transform duration-200">
              Discover Products
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {items.map((item) => (
              <div key={item.productId} className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 group relative">
                {/* Remove Button */}
                <button 
                  onClick={() => removeFromWishlist(item.productId)}
                  className="absolute top-3 right-3 z-10 w-8 h-8 bg-white/90 backdrop-blur rounded-full flex items-center justify-center text-gray-400 hover:text-red-500 shadow-sm transition-colors"
                  aria-label="Remove from wishlist"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                </button>

                <Link href={`/shop/${item.productId}`} className="block relative aspect-[4/5] bg-gray-100 overflow-hidden">
                  <Image src={item.image} alt={item.name} fill sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" className="object-cover group-hover:scale-105 transition-transform duration-500" />
                </Link>
                
                <div className="p-4">
                  <Link href={`/shop/${item.productId}`} className="block">
                    <h3 className="font-bold text-gray-900 mb-1 truncate group-hover:text-primary transition-colors">{item.name}</h3>
                  </Link>
                  <p className="text-sm font-medium text-gray-900 mb-4">${(item.price).toFixed(2)}</p>
                  
                  <button 
                    onClick={() => handleAddToCart(item)}
                    className="w-full bg-gray-900 text-white font-bold py-2.5 rounded-lg hover:bg-black transition-colors text-sm"
                  >
                    Add to Cart
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

