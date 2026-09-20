"use client";
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface WishlistItem {
  productId: string;
  name: string;
  price: number;
  image: string;
}

interface WishlistContextType {
  items: WishlistItem[];
  addToWishlist: (item: WishlistItem) => void;
  removeFromWishlist: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;
  clearWishlist: () => void;
  totalItems: number;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export function WishlistProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<WishlistItem[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem('wishlist');
      if (stored) setItems(JSON.parse(stored));
    } catch (e) {
      console.error(e);
    }
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (isLoaded) {
      try {
        if (items.length === 0) {
          localStorage.removeItem('wishlist');
        } else {
          localStorage.setItem('wishlist', JSON.stringify(items));
        }
      } catch (error) {
        console.error('Storage Error in WishlistContext:', error);
      }
    }
  }, [items, isLoaded]);

  const addToWishlist = (newItem: WishlistItem) => {
    setItems(prev => {
      if (prev.find(item => item.productId === newItem.productId)) return prev;
      return [...prev, newItem];
    });
  };

  const removeFromWishlist = (productId: string) => {
    setItems(prev => prev.filter(item => item.productId !== productId));
  };

  const isInWishlist = (productId: string) => {
    return items.some(item => item.productId === productId);
  };

  const clearWishlist = () => setItems([]);

  return (
    <WishlistContext.Provider value={{
      items,
      addToWishlist,
      removeFromWishlist,
      isInWishlist,
      clearWishlist,
      totalItems: items.length
    }}>
      {children}
    </WishlistContext.Provider>
  );
}

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (context === undefined) throw new Error('useWishlist must be used within a WishlistProvider');
  return context;
};
