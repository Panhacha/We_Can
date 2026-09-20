"use client";

import { useState } from 'react';
import Image from 'next/image';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';

export default function ProductDetailClient({ product, relatedProducts }: { product: any, relatedProducts: any[] }) {
  const { addToCart } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  
  const [selectedColor, setSelectedColor] = useState(product.variants?.colors?.[0] || '');
  const [selectedSize, setSelectedSize] = useState(product.variants?.sizes?.[0] || '');
  const [selectedMaterial, setSelectedMaterial] = useState(product.variants?.materials?.[0] || '');
  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState(product.image);

  const allImages = Array.from(new Set([product.image, ...(product.images || [])])).filter(Boolean);
  const isLiked = isInWishlist(product.id);

  const handleAddToCart = () => {
    if (product.stock <= 0) {
      alert("This product is out of stock.");
      return;
    }
    if (product.variants?.sizes?.length > 0 && !selectedSize) {
      alert("Please select a size.");
      return;
    }

    // Fly to cart animation
    const addToCartBtn = document.getElementById('add-to-cart-btn');
    const cartIcon = document.getElementById('cart-icon');

    if (addToCartBtn && cartIcon) {
      const sourceRect = addToCartBtn.getBoundingClientRect();
      const cartIconRect = cartIcon.getBoundingClientRect();

      const flyingImage = document.createElement('img');
      flyingImage.src = activeImage;
      flyingImage.style.position = 'fixed';
      flyingImage.style.top = `${sourceRect.top + sourceRect.height / 2 - 25}px`;
      flyingImage.style.left = `${sourceRect.left + sourceRect.width / 2 - 25}px`;
      flyingImage.style.width = '50px';
      flyingImage.style.height = '50px';
      flyingImage.style.borderRadius = '20px';
      flyingImage.style.objectFit = 'cover';
      flyingImage.style.zIndex = '9999';
      // More dynamic transition curve
      flyingImage.style.transition = 'all 0.9s cubic-bezier(0.175, 0.885, 0.32, 1.275)'; 
      flyingImage.style.boxShadow = '0 25px 50px -12px rgba(0, 0, 0, 0.5)';
      flyingImage.style.transform = 'rotate(0deg)';
      document.body.appendChild(flyingImage);

      // Trigger reflow
      void flyingImage.offsetWidth;

      // Animate to cart
      flyingImage.style.top = `${cartIconRect.top + cartIconRect.height / 2 - 15}px`;
      flyingImage.style.left = `${cartIconRect.left + cartIconRect.width / 2 - 15}px`;
      flyingImage.style.width = '30px';
      flyingImage.style.height = '30px';
      flyingImage.style.opacity = '0.4';
      flyingImage.style.borderRadius = '50%';
      // Spin it 2 times (720 degrees) as it flies
      flyingImage.style.transform = 'rotate(720deg)';

      setTimeout(() => {
        if (document.body.contains(flyingImage)) {
          document.body.removeChild(flyingImage);
        }
        
        // Cart icon pop effect
        if (cartIcon) {
          cartIcon.style.transition = 'transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
          cartIcon.style.transform = 'scale(1.4) rotate(-10deg)';
          
          setTimeout(() => {
            cartIcon.style.transform = 'scale(1) rotate(0deg)';
          }, 300);
        }
      }, 900);
    }

    addToCart({
      productId: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      quantity,
      color: selectedColor || 'Default',
      size: selectedSize || 'Default'
    });
  };

  const handleToggleWishlist = () => {
    if (isLiked) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist({
        productId: product.id,
        name: product.name,
        price: product.price,
        image: product.image
      });
    }
  };

  return (
    <div className="bg-white min-h-screen" suppressHydrationWarning><div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 mb-16 pt-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 w-full">
        
        {/* Images Gallery */}
        <div className="flex flex-col-reverse md:flex-row gap-4">
          <div className="flex md:flex-col gap-4 overflow-x-auto md:overflow-y-auto md:w-16 shrink-0 pb-2 md:pb-0 scrollbar-hide">
            {allImages.map((img: string, idx: number) => (
              <button 
                key={idx}
                onClick={() => setActiveImage(img)}
                className={`relative w-16 h-20 md:w-full md:h-24 shrink-0 rounded-xl overflow-hidden transition-all ${activeImage === img ? 'ring-2 ring-primary ring-offset-2 opacity-100' : 'opacity-60 hover:opacity-100'}`}
              >
                <Image src={img} alt="Thumbnail" fill className="object-cover" />
              </button>
            ))}
          </div>
          <div className="relative aspect-square w-full max-w-[320px] lg:max-w-[360px] mx-auto rounded-[20px] overflow-hidden bg-gray-50 border border-gray-100 shadow-sm">
            <Image id="product-image" src={activeImage} alt={product.name} fill className="object-cover" priority />
            {product.isNew && (
              <div className="absolute top-6 left-6 px-3 py-1.5 bg-gray-900 text-white text-xs font-bold uppercase tracking-wider rounded-md">
                New Arrival
              </div>
            )}
            {product.stock <= 0 && (
              <div className="absolute top-6 right-6 px-3 py-1.5 bg-red-600 text-white text-xs font-bold uppercase tracking-wider rounded-md">
                Out of Stock
              </div>
            )}
          </div>
        </div>

        {/* Info */}
        <div className="flex flex-col py-6">
          <nav className="flex text-xs text-gray-500 mb-4 font-medium">
            <a href="/" className="hover:text-primary">Home</a>
            <span className="mx-2">/</span>
            <a href={`/shop?category=${product.category}`} className="hover:text-primary">{product.category}</a>
            {product.subCategory && (
              <>
                <span className="mx-2">/</span>
                <span className="text-gray-900">{product.subCategory}</span>
              </>
            )}
          </nav>

          <h1 className="text-2xl sm:text-3xl font-black text-[#111c44] leading-tight mb-2">{product.name}</h1>
          
          <div className="flex items-center gap-4 mb-6">
            <div className="flex items-center gap-3">
              <span className="text-xl sm:text-2xl font-black text-primary">${product.price.toFixed(2)}</span>
              {product.originalPrice && (
                <span className="text-lg font-medium text-gray-400 line-through">${product.originalPrice.toFixed(2)}</span>
              )}
            </div>
            {product.originalPrice && (
              <span className="bg-red-100 text-red-700 px-2 py-1 rounded text-xs font-bold uppercase tracking-wider">
                {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% OFF
              </span>
            )}
          </div>

          <p className="text-gray-600 text-sm leading-relaxed mb-6">
            {product.description || 'Elevate your everyday style with this premium piece.'}
          </p>

          {/* Variants */}
          <div className="space-y-4 mb-6 border-y border-gray-100 py-5">
            
            {/* Colors */}
            {product.variants?.colors?.length > 0 && (
              <div>
                <div className="flex justify-between items-center mb-3">
                  <h3 className="font-bold text-gray-900">Color</h3>
                  <span className="text-sm text-gray-500 font-medium">{selectedColor}</span>
                </div>
                <div className="flex flex-wrap gap-3">
                  {product.variants.colors.map((c: string, idx: number) => (
                    <button 
                      key={idx}
                      onClick={() => setSelectedColor(c)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${selectedColor === c ? 'bg-gray-900 text-white shadow-lg' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                    >
                      {c}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Sizes */}
            {product.variants?.sizes?.length > 0 && (
              <div>
                <div className="flex justify-between items-center mb-3">
                  <h3 className="font-bold text-gray-900">Size</h3>
                </div>
                <div className="flex flex-wrap gap-3">
                  {product.variants.sizes.map((s: string, idx: number) => (
                    <button 
                      key={idx}
                      onClick={() => setSelectedSize(s)}
                      className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-xs transition-all ${selectedSize === s ? 'bg-primary text-white shadow-lg shadow-primary/30' : 'bg-white border-2 border-gray-200 text-gray-600 hover:border-gray-900'}`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-3 mb-6">
            <div className="flex items-center justify-between border-2 border-gray-200 rounded-xl p-1 w-full sm:w-32 bg-white">
              <button 
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="w-10 h-10 flex items-center justify-center text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-xl transition-colors"
              >-</button>
              <span className="font-bold text-lg w-8 text-center">{quantity}</span>
              <button 
                onClick={() => setQuantity(quantity + 1)}
                className="w-10 h-10 flex items-center justify-center text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-xl transition-colors"
              >+</button>
            </div>
            
            <button 
              id="add-to-cart-btn"
              onClick={handleAddToCart}
              disabled={product.stock <= 0}
              className={`flex-1 h-12 text-white rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all ${product.stock <= 0 ? 'bg-gray-400 cursor-not-allowed' : 'bg-[#111c44] hover:bg-black shadow-xl shadow-gray-900/20 hover:-translate-y-1'}`}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="9" cy="21" r="1"></circle><circle cx="20" cy="21" r="1"></circle><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path></svg>
              {product.stock <= 0 ? 'Out of Stock' : 'Add to Bag'}
            </button>
            
            <button 
              onClick={handleToggleWishlist}
              className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all ${isLiked ? 'bg-red-50 text-red-500 border-2 border-red-200' : 'bg-white border-2 border-gray-200 text-gray-400 hover:border-gray-900 hover:text-gray-900'}`}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill={isLiked ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>
            </button>
          </div>

          <div className="bg-gray-50 rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-2 text-sm text-gray-600">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-green-600"><rect x="1" y="3" width="15" height="13"></rect><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"></polygon><circle cx="5.5" cy="18.5" r="2.5"></circle><circle cx="18.5" cy="18.5" r="2.5"></circle></svg>
              Free shipping on orders over $150
            </div>
            <div className="flex items-center gap-3 text-sm text-gray-600">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-600"><path d="M21.5 12H16c-.7 2-2 3-4 3s-3.3-1-4-3H2.5"/><path d="M5.5 5.1L2 12v6c0 1.1.9 2 2 2h16a2 2 0 002-2v-6l-3.4-6.9A2 2 0 0016.8 4H7.2a2 2 0 00-1.8 1.1z"/></svg>
              Free 30-day returns
            </div>
          </div>
        </div>
      </div>
    </div>
    </div>
  );
}
