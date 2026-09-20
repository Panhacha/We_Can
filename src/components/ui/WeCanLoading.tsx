import React from 'react';

export default function WeCanLoading() {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center w-full min-h-[300px]">
      <div className="flex flex-col items-center justify-center gap-6">
        
        {/* iOS style dot spinner using SVG for reliable animation */}
        <div className="relative w-16 h-16 flex items-center justify-center">
          <svg className="w-14 h-14 text-gray-400 animate-[spin_1s_steps(8)_infinite]" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" fill="currentColor">
            <circle cx="50" cy="15" r="5" opacity="0.1" />
            <circle cx="74.7" cy="25.3" r="5" opacity="0.2" />
            <circle cx="85" cy="50" r="5" opacity="0.3" />
            <circle cx="74.7" cy="74.7" r="5" opacity="0.4" />
            <circle cx="50" cy="85" r="5" opacity="0.5" />
            <circle cx="25.3" cy="74.7" r="5" opacity="0.65" />
            <circle cx="15" cy="50" r="5" opacity="0.8" />
            <circle cx="25.3" cy="25.3" r="5" opacity="1" />
          </svg>
        </div>

        {/* Text Section */}
        <div className="flex flex-col items-center gap-1.5 animate-pulse">
          <h2 className="text-2xl md:text-3xl font-black uppercase tracking-wide flex items-center gap-2">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-500 via-indigo-500 to-sky-400">
              WE CAN
            </span>
            <span className="text-gray-800">
              Shop
            </span>
          </h2>
          <p className="text-gray-500 font-bold text-[10px] uppercase tracking-[0.4em] ml-2">
            Loading...
          </p>
        </div>
      </div>
    </div>
  );
}
