"use client";
import React, { createContext, useContext, useState, useEffect, Suspense } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import WeCanLoading from '@/components/ui/WeCanLoading';

function LoadingStateObserver({ setIsLoading }: { setIsLoading: (s: boolean) => void }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    setIsLoading(false);
  }, [pathname, searchParams, setIsLoading]);

  return null;
}

interface GlobalLoadingContextType {
  isLoading: boolean;
  setGlobalLoading: (state: boolean) => void;
}

const GlobalLoadingContext = createContext<GlobalLoadingContextType | undefined>(undefined);

export function GlobalLoadingProvider({ children }: { children: React.ReactNode }) {
  const [isLoading, setIsLoading] = useState(false);

  // Listen for clicks on links to trigger the loading screen immediately
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const target = (e.target as Element).closest('a');
      if (target && target.href) {
        // Ignore links that open in a new tab
        if (target.target === '_blank') return;
        
        try {
          const url = new URL(target.href);
          const currentUrl = new URL(window.location.href);
          
          // Only trigger for internal links that actually change the path
          if (
            url.origin === currentUrl.origin && 
            (url.pathname !== currentUrl.pathname || url.search !== currentUrl.search) &&
            !url.hash
          ) {
            setIsLoading(true);
          }
        } catch (err) {
          // Ignore invalid URLs
        }
      }
    };
    
    // Use capture phase to catch the click before default actions
    document.addEventListener('click', handleClick, true);
    return () => document.removeEventListener('click', handleClick, true);
  }, []);

  return (
    <GlobalLoadingContext.Provider value={{ isLoading, setGlobalLoading: setIsLoading }}>
      <Suspense fallback={null}>
        <LoadingStateObserver setIsLoading={setIsLoading} />
      </Suspense>
      {children}
      {isLoading && (
        <div className="fixed inset-0 z-[99999] bg-white/70 backdrop-blur-sm flex items-center justify-center">
          <WeCanLoading />
        </div>
      )}
    </GlobalLoadingContext.Provider>
  );
}

export function useGlobalLoading() {
  const context = useContext(GlobalLoadingContext);
  if (!context) throw new Error('useGlobalLoading must be used within GlobalLoadingProvider');
  return context;
}
