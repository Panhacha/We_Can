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
    <div className="relative bg-white overflow-hidden min-h-[400px] md:min-h-[600px] flex items-center">
      
      {/* Background Image Carousel */}
      {activeSlides.map((slide, idx) => (
        <div 
          key={slide.id}
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out`}
          style={{ opacity: current === idx ? 1 : 0, visibility: current === idx ? 'visible' : 'hidden' }}
        >
          {/* Gradient overlay to ensure text readability */}
          <div className="absolute inset-0 bg-gradient-to-r from-white via-white/90 to-transparent z-10 w-full md:w-3/4 lg:w-2/3"></div>
          <Image 
            src={slide.image} 
            alt={slide.title} 
            fill sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="hidden md:block object-cover object-right md:object-center"
            priority={idx === 0}
          />
          {slide.mobileImage && (
            <Image 
              src={slide.mobileImage} 
              alt={slide.title} 
              fill sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="block md:hidden object-cover object-center"
              priority={idx === 0}
            />
          )}
        </div>
      ))}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24 lg:py-32 relative z-20 w-full">
        <div className="md:w-2/3 lg:w-1/2 relative min-h-[280px]">
          {activeSlides.map((slide, idx) => (
            <div 
              key={slide.id}
              className={`transition-all duration-700 ease-out ${current === idx ? 'translate-y-0 relative' : 'translate-y-8 absolute top-0 left-0 pointer-events-none'}`}
              style={{ opacity: current === idx ? 1 : 0, visibility: current === idx ? 'visible' : 'hidden' }}
            >
              <h1 className="text-4xl md:text-6xl font-extrabold text-gray-900 tracking-tight leading-tight mb-6">
                {slide.title} <br />
                {slide.highlight && (
                  <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                    {slide.highlight}
                  </span>
                )}
              </h1>
              <p className="text-lg text-gray-700 mb-10 leading-relaxed max-w-lg font-medium">
                {slide.description}
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link 
                  href={slide.targetUrl || '/shop'} 
                  onClick={() => handleBannerClick(slide)}
                  className="inline-flex justify-center items-center px-8 py-4 border border-transparent text-base font-medium rounded-full text-white bg-primary hover:bg-primary-dark transition-all shadow-lg hover:shadow-primary/50 transform hover:-translate-y-1"
                >
                  {slide.primaryCta}
                </Link>
                {slide.secondaryCta && (
                  <Link 
                    href="/promotions" 
                    className="inline-flex justify-center items-center px-8 py-4 border-2 border-gray-900 text-base font-medium rounded-full text-gray-900 hover:bg-gray-900 hover:text-white transition-all"
                  >
                    {slide.secondaryCta}
                  </Link>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Carousel Indicators */}
        {activeSlides.length > 1 && (
          <div className="absolute bottom-8 left-4 sm:left-6 lg:left-8 flex gap-3 z-30">
            {activeSlides.map((_, idx) => (
              <button 
                key={idx}
                onClick={() => setCurrent(idx)}
                className={`h-1.5 rounded-full transition-all duration-300 ${current === idx ? 'w-8 bg-primary' : 'w-2 bg-gray-300 hover:bg-gray-400'}`}
                aria-label={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

