"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { supabase } from '@/lib/supabase';

const slides = [
  {
    id: 1,
    title: "Discover Your",
    highlight: "True Style",
    description: "Explore our new collection designed for comfort and modern aesthetics. Get 20% off on your first order.",
    image: "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=1200&q=80",
    primaryCta: "Shop Collection",
    secondaryCta: "View Promotions"
  },
  {
    id: 2,
    title: "The Summer",
    highlight: "Collection",
    description: "Embrace the heat with our breathable, vibrant new arrivals. Perfect for your next getaway.",
    image: "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=1200&q=80",
    primaryCta: "Explore Summer",
    secondaryCta: "Lookbook"
  },
  {
    id: 3,
    title: "Premium",
    highlight: "Accessories",
    description: "Complete your look with our curated selection of bags, watches, and jewelry.",
    image: "https://images.unsplash.com/photo-1492707892479-7bc8d5a4ee93?w=1200&q=80",
    primaryCta: "Shop Accessories",
    secondaryCta: "Gift Guide"
  }
];

export default function Hero() {
  const [current, setCurrent] = useState(0);
  const [activeSlides, setActiveSlides] = useState<any[]>([]); // Start empty to prevent flashing default banners
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchBanners() {
      try {
        const { data, error } = await supabase
          .from('banners')
          .select('*')
          .eq('position', 'Hero')
          .eq('is_active', true)
          .order('sort_order', { ascending: true });

        if (error) throw error;

        if (data && data.length > 0) {
          const now = new Date();
          const validBanners = data.filter(b => {
            if (b.start_date && new Date(b.start_date) > now) return false;
            if (b.end_date && new Date(b.end_date) < now) return false;
            return true;
          });

          if (validBanners.length > 0) {
            // Map DB structure to slide structure
            const mappedSlides = validBanners.map(b => ({
              id: b.id,
              title: b.title || 'Discover',
              highlight: '',
              description: b.subtitle || '',
              image: b.desktop_image,
              mobileImage: b.mobile_image || b.desktop_image,
              primaryCta: b.cta_text || 'Shop Now',
              targetUrl: b.target_url || '/shop',
              isDbBanner: true
            }));
            setActiveSlides(mappedSlides);
          } else {
            setActiveSlides(slides);
          }
        } else {
          setActiveSlides(slides);
        }
      } catch (err) {
        console.error("Failed to load banners", err);
        setActiveSlides(slides);
      } finally {
        setIsLoading(false);
      }
    }
    fetchBanners();
  }, []);

  useEffect(() => {
    if (activeSlides.length <= 1) return;
    const timer = setInterval(() => {
      setCurrent((prev) => (prev === activeSlides.length - 1 ? 0 : prev + 1));
    }, 5000);
    return () => clearInterval(timer);
  }, [activeSlides.length]);

  const handleBannerClick = async (slide: any) => {
    if (slide.isDbBanner) {
      const { error } = await supabase.rpc('increment_banner_clicks', { banner_id: slide.id });
      if (error) console.error(error);
    }
  };

  return (
    <div className="bg-white px-3 sm:px-4 pb-4">
      <div className="relative overflow-hidden h-32 sm:h-40 md:h-56 lg:h-64 rounded-xl shadow-sm flex items-center bg-gray-50 border border-gray-100">
        
        {/* Background Image Carousel */}
        {activeSlides.map((slide, idx) => (
          <div 
            key={slide.id}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out`}
            style={{ opacity: current === idx ? 1 : 0, visibility: current === idx ? 'visible' : 'hidden' }}
          >
            {/* Gradient overlay to ensure text readability from right */}
            <div className="absolute inset-0 left-auto right-0 bg-gradient-to-l from-[#fdfbf7] via-[#fdfbf7]/90 to-transparent z-10 w-3/4 md:w-1/2"></div>
            <Image 
              src={slide.image} 
              alt={slide.title} 
              fill sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="hidden md:block object-cover object-left md:object-center"
              priority={idx === 0}
            />
            {slide.mobileImage && (
              <Image 
                src={slide.mobileImage} 
                alt={slide.title} 
                fill sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                className="block md:hidden object-cover object-left"
                priority={idx === 0}
              />
            )}
            {/* Fallback if no mobile image */}
            {!slide.mobileImage && (
               <Image 
                src={slide.image} 
                alt={slide.title} 
                fill sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                className="block md:hidden object-cover object-left"
                priority={idx === 0}
              />
            )}
          </div>
        ))}

        <div className="w-full h-full relative z-20 flex items-center justify-end px-4 sm:px-8 text-right">
          <div className="w-2/3 md:w-1/2 flex flex-col items-end">
            {activeSlides.map((slide, idx) => (
              <div 
                key={slide.id}
                className={`transition-all duration-700 ease-out flex flex-col items-end ${current === idx ? 'translate-y-0 relative' : 'translate-y-4 absolute top-0 right-0 pointer-events-none'}`}
                style={{ opacity: current === idx ? 1 : 0, visibility: current === idx ? 'visible' : 'hidden' }}
              >
                <h1 className="text-sm sm:text-xl md:text-3xl font-extrabold text-[#7a4b3a] tracking-tight leading-tight mb-1 sm:mb-2">
                  {slide.title}
                </h1>
                {slide.highlight && (
                  <span className="text-xl sm:text-2xl md:text-4xl font-black text-[#d35400] mb-2 sm:mb-3 uppercase tracking-wider">
                    {slide.highlight}
                  </span>
                )}
                
                <Link 
                  href={slide.targetUrl || '/shop'} 
                  onClick={() => handleBannerClick(slide)}
                  className="inline-flex justify-center items-center px-3 py-1 sm:px-6 sm:py-2 border border-transparent text-[10px] sm:text-sm font-bold rounded-full text-white bg-[#ff6600] hover:bg-[#e65c00] transition-all shadow-md transform hover:-translate-y-0.5"
                >
                  {slide.primaryCta || 'Shop Now'} &gt;
                </Link>
              </div>
            ))}
          </div>
        </div>

        {/* Carousel Indicators */}
        {activeSlides.length > 1 && (
          <div className="absolute bottom-2 sm:bottom-4 right-4 sm:right-6 flex justify-end gap-1.5 z-30">
            {activeSlides.map((_, idx) => (
              <button 
                key={idx}
                onClick={() => setCurrent(idx)}
                className={`h-1 rounded-full transition-all duration-300 ${current === idx ? 'w-4 bg-[#ff6600]' : 'w-1.5 bg-gray-300 hover:bg-gray-400'}`}
                aria-label={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

