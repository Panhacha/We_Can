"use client";
import { useState, useRef } from 'react';
import Image from 'next/image';

interface ImageGalleryProps {
  images: string[];
}

export default function ImageGallery({ images }: ImageGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [backgroundPos, setBackgroundPos] = useState('0% 0%');
  const [isHovering, setIsHovering] = useState(false);
  const imageRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!imageRef.current) return;
    const { left, top, width, height } = imageRef.current.getBoundingClientRect();
    const x = ((e.pageX - left) / width) * 100;
    const y = ((e.pageY - top) / height) * 100;
    setBackgroundPos(`${x}% ${y}%`);
  };

  return (
    <div className="flex flex-col-reverse lg:flex-row gap-4">
      {/* Thumbnails */}
      <div className="flex lg:flex-col gap-4 overflow-x-auto lg:overflow-y-auto lg:w-24 flex-shrink-0 hide-scrollbar">
        {images.map((img, idx) => (
          <button 
            key={idx} 
            onClick={() => setActiveIndex(idx)}
            className={`relative w-20 lg:w-full aspect-[4/5] rounded-xl overflow-hidden flex-shrink-0 transition-all border-2 ${activeIndex === idx ? 'border-primary shadow-md' : 'border-transparent hover:opacity-75'}`}
          >
            <Image src={img} alt={`Thumbnail ${idx}`} fill sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" className="object-cover" />
          </button>
        ))}
      </div>
      
      {/* Main Image with Zoom */}
      <div 
        ref={imageRef}
        className="relative w-full aspect-[4/5] bg-gray-100 rounded-3xl overflow-hidden cursor-zoom-in group"
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
      >
        <Image 
          src={images[activeIndex]} 
          alt="Main Product Image" 
          fill sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          priority
          className={`object-cover transition-opacity duration-300 ${isHovering ? 'opacity-0' : 'opacity-100'}`}
        />
        
        {/* Zoomed Background */}
        <div 
          className={`absolute inset-0 bg-no-repeat transition-opacity duration-300 pointer-events-none ${isHovering ? 'opacity-100' : 'opacity-0'}`}
          style={{
            backgroundImage: `url(${images[activeIndex]})`,
            backgroundPosition: backgroundPos,
            backgroundSize: '200%' // 2x zoom
          }}
        />
      </div>
    </div>
  );
}

