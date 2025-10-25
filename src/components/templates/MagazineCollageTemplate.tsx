"use client";

import React from "react";

interface MagazineCollageTemplateProps {
  images: string[]; // 12-15 images
  keywords: string[];
  style?: "bold" | "neutral" | "colorful";
}

export default function MagazineCollageTemplate({
  images,
  keywords,
  style = "bold",
}: MagazineCollageTemplateProps) {
  return (
    <div className="relative w-full h-[768px] bg-gradient-to-br from-amber-50 via-rose-50 to-stone-100 overflow-hidden">
      {/* Background texture overlay */}
      <div className="absolute inset-0 opacity-10 bg-[repeating-linear-gradient(45deg,transparent,transparent_10px,rgba(0,0,0,0.03)_10px,rgba(0,0,0,0.03)_20px)]"></div>

      {/* TOP ROW - Densely packed */}
      {/* Image 1 - Top Left */}
      <div className="absolute top-2 left-2 w-52 h-60 bg-white p-2 shadow-xl transform -rotate-6" style={{ zIndex: 14 }}>
        {images[0] && <img src={images[0]} alt="Vision 1" className="w-full h-full object-cover" />}
      </div>

      {/* Image 2 - Top Left-Center overlap */}
      <div className="absolute top-8 left-48 w-48 h-56 bg-white p-2 shadow-xl transform rotate-4" style={{ zIndex: 12 }}>
        {images[1] && <img src={images[1]} alt="Vision 2" className="w-full h-full object-cover" />}
      </div>

      {/* Bold Text Overlay 1 */}
      <div className="absolute top-4 left-[380px] bg-white px-6 py-3 shadow-2xl transform rotate-2" style={{ zIndex: 18 }}>
        <h2 className="text-3xl font-black text-gray-900 uppercase tracking-tight">
          {keywords[0] || "DREAM BIG"}
        </h2>
      </div>

      {/* Image 3 - Top Right */}
      <div className="absolute top-1 right-2 w-56 h-64 bg-white p-2 shadow-xl transform rotate-8" style={{ zIndex: 13 }}>
        {images[2] && <img src={images[2]} alt="Vision 3" className="w-full h-full object-cover" />}
      </div>

      {/* Image 4 - Top Right overlap */}
      <div className="absolute top-12 right-52 w-44 h-52 bg-white p-2 shadow-xl transform -rotate-5" style={{ zIndex: 11 }}>
        {images[3] && <img src={images[3]} alt="Vision 4" className="w-full h-full object-cover" />}
      </div>

      {/* MIDDLE ROW */}
      {/* Image 5 - Middle Left */}
      <div className="absolute top-[240px] left-1 w-50 h-58 bg-white p-2 shadow-xl transform rotate-3" style={{ zIndex: 10 }}>
        {images[4] && <img src={images[4]} alt="Vision 5" className="w-full h-full object-cover" />}
      </div>

      {/* Central Year Badge */}
      <div className="absolute top-[280px] left-1/2 -translate-x-1/2 bg-gradient-to-br from-pink-400 to-purple-500 px-10 py-5 shadow-2xl transform -rotate-2" style={{ zIndex: 20 }}>
        <h1 className="text-7xl font-black text-white tracking-wider">2025</h1>
      </div>

      {/* Text Overlay 2 - "VISION BOARD" */}
      <div className="absolute top-[360px] left-[60px] bg-black px-5 py-2 shadow-xl transform rotate-4" style={{ zIndex: 19 }}>
        <h3 className="text-2xl font-black text-white uppercase tracking-wide">VISION BOARD</h3>
      </div>

      {/* Image 6 - Middle Center-Left */}
      <div className="absolute top-[300px] left-[180px] w-46 h-54 bg-white p-2 shadow-xl transform -rotate-8" style={{ zIndex: 8 }}>
        {images[5] && <img src={images[5]} alt="Vision 6" className="w-full h-full object-cover" />}
      </div>

      {/* Image 7 - Middle Center-Right */}
      <div className="absolute top-[305px] right-[160px] w-48 h-56 bg-white p-2 shadow-xl transform rotate-6" style={{ zIndex: 9 }}>
        {images[6] && <img src={images[6]} alt="Vision 7" className="w-full h-full object-cover" />}
      </div>

      {/* Image 8 - Middle Right */}
      <div className="absolute top-[250px] right-3 w-52 h-60 bg-white p-2 shadow-xl transform -rotate-4" style={{ zIndex: 15 }}>
        {images[7] && <img src={images[7]} alt="Vision 8" className="w-full h-full object-cover" />}
      </div>

      {/* Colorful text sticker */}
      <div className="absolute top-[260px] right-[240px] bg-yellow-300 px-4 py-2 shadow-lg transform rotate-8" style={{ zIndex: 17 }}>
        <p className="text-lg font-black text-gray-900 uppercase">{keywords[1] || "BELIEVE"}</p>
      </div>

      {/* BOTTOM ROW - Fill remaining space */}
      {/* Image 9 - Bottom Left */}
      <div className="absolute bottom-2 left-3 w-54 h-62 bg-white p-2 shadow-xl transform rotate-5" style={{ zIndex: 7 }}>
        {images[8] && <img src={images[8]} alt="Vision 9" className="w-full h-full object-cover" />}
      </div>

      {/* Image 10 - Bottom Left-Center */}
      <div className="absolute bottom-8 left-[220px] w-46 h-54 bg-white p-2 shadow-xl transform -rotate-7" style={{ zIndex: 6 }}>
        {images[9] && <img src={images[9]} alt="Vision 10" className="w-full h-full object-cover" />}
      </div>

      {/* Pink text bubble */}
      <div className="absolute bottom-[180px] left-[380px] bg-pink-400 px-4 py-2 rounded-full shadow-xl transform -rotate-4" style={{ zIndex: 16 }}>
        <p className="text-sm font-bold text-white">{keywords[2] || "manifest"}</p>
      </div>

      {/* Image 11 - Bottom Center-Right */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 w-50 h-58 bg-white p-2 shadow-xl transform rotate-3" style={{ zIndex: 5 }}>
        {images[10] && <img src={images[10]} alt="Vision 11" className="w-full h-full object-cover" />}
      </div>

      {/* Image 12 - Bottom Right */}
      <div className="absolute bottom-1 right-2 w-52 h-60 bg-white p-2 shadow-xl transform -rotate-6" style={{ zIndex: 4 }}>
        {images[11] && <img src={images[11]} alt="Vision 12" className="w-full h-full object-cover" />}
      </div>

      {/* Image 13 - Bottom Right overlap */}
      {images[12] && (
        <div className="absolute bottom-10 right-[200px] w-44 h-52 bg-white p-2 shadow-xl transform rotate-9" style={{ zIndex: 3 }}>
          <img src={images[12]} alt="Vision 13" className="w-full h-full object-cover" />
        </div>
      )}

      {/* Green success badge */}
      <div className="absolute bottom-[140px] right-[60px] bg-green-400 px-5 py-2 rounded-md shadow-xl transform rotate-5" style={{ zIndex: 18 }}>
        <h4 className="text-xl font-black text-white uppercase">SUCCESS</h4>
      </div>

      {/* Additional images for 14-15 */}
      {images[13] && (
        <div className="absolute top-[180px] left-[340px] w-40 h-48 bg-white p-2 shadow-xl transform -rotate-12" style={{ zIndex: 7 }}>
          <img src={images[13]} alt="Vision 14" className="w-full h-full object-cover" />
        </div>
      )}

      {images[14] && (
        <div className="absolute bottom-[260px] right-[100px] w-38 h-46 bg-white p-2 shadow-xl transform rotate-11" style={{ zIndex: 6 }}>
          <img src={images[14]} alt="Vision 15" className="w-full h-full object-cover" />
        </div>
      )}

      {/* Decorative sparkles */}
      <div className="absolute top-16 right-[160px] text-4xl transform rotate-15" style={{ zIndex: 2 }}>✨</div>
      <div className="absolute bottom-[100px] left-[140px] text-3xl transform -rotate-20" style={{ zIndex: 2 }}>💫</div>
    </div>
  );
}
