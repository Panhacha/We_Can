"use client";

import { CartProvider } from '@/context/CartContext';
import { AuthProvider } from '@/context/AuthContext';
import { WishlistProvider } from '@/context/WishlistContext';
import { AdminProvider } from '@/context/AdminContext';
import { GlobalLoadingProvider } from '@/components/providers/GlobalLoadingProvider';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <GlobalLoadingProvider>
      <AdminProvider>
        <AuthProvider>
          <WishlistProvider>
            <CartProvider>
              {children}
            </CartProvider>
          </WishlistProvider>
        </AuthProvider>
      </AdminProvider>
    </GlobalLoadingProvider>
  );
}
