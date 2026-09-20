"use client";
import { useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

export default function AccountLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { isAuthenticated, isLoaded, logout } = useAuth();

  useEffect(() => {
    if (isLoaded && !isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, isLoaded, router]);

  // Show nothing (or a loader) while checking auth status
  if (!isLoaded || !isAuthenticated) return null;

  return (
    <div className="bg-[#f8f9fc] min-h-screen py-8" suppressHydrationWarning>
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8" suppressHydrationWarning>
        
        {/* Header Area */}
        <div className="flex justify-between items-center mb-6" suppressHydrationWarning>
          <div>
            <h1 className="text-3xl font-extrabold text-[#1c2331] mb-2">Account</h1>
            <div className="flex items-center text-sm text-gray-500 space-x-2" suppressHydrationWarning>
              <Link href="/" className="hover:text-primary transition-colors">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>
              </Link>
              <span>&gt;</span>
              <Link href="/shop" className="hover:text-primary transition-colors">E-Commerce</Link>
              <span>&gt;</span>
              <span className="text-gray-900 font-medium">Account</span>
            </div>
          </div>
          
          <div className="flex space-x-3" suppressHydrationWarning>
            <Link href="/account/orders" className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-gray-500 hover:text-primary shadow-sm hover:shadow transition-all" title="Order History">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path><polyline points="3.29 7 12 12 20.71 7"></polyline><line x1="12" y1="22" x2="12" y2="12"></line></svg>
            </Link>
            <button onClick={() => logout()} className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-red-400 hover:text-red-600 hover:bg-red-50 shadow-sm hover:shadow transition-all" title="Logout">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>
            </button>
          </div>
        </div>

        {/* Dashboard Content */}
        {children}

      </div>
    </div>
  );
}
