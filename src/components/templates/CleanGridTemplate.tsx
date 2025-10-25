"use client";

import React from "react";

interface CleanGridTemplateProps {
  images: string[]; // 12-15 images
  keywords: string[];
}

export default function CleanGridTemplate({
  images,
  keywords,
}: CleanGridTemplateProps) {
  return (
    <div className="relative w-full h-[768px] bg-gradient-to-br from-stone-50 to-neutral-100 overflow-hidden">
      {/* Tight 4x4 grid layout with no gaps */}
      <div className="grid grid-cols-4 grid-rows-4 gap-0 w-full h-full">
        {/* Row 1 */}
        <div className="relative overflow-hidden border border-white">
          {images[0] && <img src={images[0]} alt="Vision 1" className="w-full h-full object-cover" />}
          <div className="absolute top-2 left-2 bg-white/95 px-2 py-1 rounded-sm shadow">
            <p className="text-[10px] font-bold text-gray-800 uppercase tracking-wide">{keywords[0] || "GOALS"}</p>
          </div>
        </div>

        <div className="relative overflow-hidden border border-white">
          {images[1] && <img src={images[1]} alt="Vision 2" className="w-full h-full object-cover" />}
          <div className="absolute bottom-2 right-2 bg-pink-400/90 px-2 py-1 rounded-sm shadow">
            <p className="text-[9px] font-bold text-white uppercase">{keywords[1] || "LOVE"}</p>
          </div>
        </div>

        <div className="relative overflow-hidden border border-white">
          {images[2] && <img src={images[2]} alt="Vision 3" className="w-full h-full object-cover" />}
        </div>

        <div className="relative overflow-hidden border border-white">
          {images[3] && <img src={images[3]} alt="Vision 4" className="w-full h-full object-cover" />}
          <div className="absolute top-2 right-2 bg-purple-500/90 px-2 py-1 rounded-sm shadow">
            <p className="text-[9px] font-bold text-white">{keywords[2] || "DREAMS"}</p>
          </div>
        </div>

        {/* Row 2 */}
        <div className="relative overflow-hidden border border-white">
          {images[4] && <img src={images[4]} alt="Vision 5" className="w-full h-full object-cover" />}
        </div>

        <div className="relative overflow-hidden border border-white">
          {images[5] && <img src={images[5]} alt="Vision 6" className="w-full h-full object-cover" />}
          <div className="absolute bottom-2 left-2 bg-black/80 px-2 py-1 rounded-sm shadow">
            <p className="text-[9px] font-bold text-white uppercase tracking-wide">{keywords[3] || "GROW"}</p>
          </div>
        </div>

        {/* Center text panel - spans 2 cells */}
        <div className="relative col-span-2 row-span-2 flex items-center justify-center bg-gradient-to-br from-rose-50 via-white to-amber-50 border-2 border-white">
          <div className="text-center space-y-2 px-4">
            <div className="mb-2">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-widest">My</p>
              <h1 className="text-6xl font-serif font-light text-gray-800 italic leading-tight">Vision</h1>
              <h2 className="text-7xl font-serif font-black text-gray-900 leading-tight">Board</h2>
            </div>
            <div className="pt-2 border-t border-gray-200">
              <p className="text-4xl font-bold text-gray-900">2025</p>
              <p className="text-xs text-gray-600 italic mt-1">Make it happen</p>
            </div>
          </div>
        </div>

        {/* Row 3 */}
        <div className="relative overflow-hidden border border-white">
          {images[6] && <img src={images[6]} alt="Vision 7" className="w-full h-full object-cover" />}
          <div className="absolute top-2 left-2 bg-yellow-300/95 px-2 py-1 rounded-sm shadow">
            <p className="text-[9px] font-black text-gray-900">{keywords[4] || "SHINE"}</p>
          </div>
        </div>

        <div className="relative overflow-hidden border border-white">
          {images[7] && <img src={images[7]} alt="Vision 8" className="w-full h-full object-cover" />}
        </div>

        {/* Row 4 */}
        <div className="relative overflow-hidden border border-white">
          {images[8] && <img src={images[8]} alt="Vision 9" className="w-full h-full object-cover" />}
        </div>

        <div className="relative overflow-hidden border border-white">
          {images[9] && <img src={images[9]} alt="Vision 10" className="w-full h-full object-cover" />}
          <div className="absolute bottom-2 right-2 bg-green-400/90 px-2 py-1 rounded-full shadow">
            <p className="text-[8px] font-bold text-white uppercase">YES</p>
          </div>
        </div>

        <div className="relative overflow-hidden border border-white">
          {images[10] && <img src={images[10]} alt="Vision 11" className="w-full h-full object-cover" />}
        </div>

        <div className="relative overflow-hidden border border-white">
          {images[11] && <img src={images[11]} alt="Vision 12" className="w-full h-full object-cover" />}
          <div className="absolute top-2 left-2 bg-white/95 px-2 py-1 rounded-sm shadow">
            <p className="text-[9px] font-bold text-gray-800">{keywords[5] || "BELIEVE"}</p>
          </div>
        </div>
      </div>

      {/* Overlay images for 13-15 to add visual interest */}
      {images[12] && (
        <div className="absolute top-[30%] left-[5%] w-28 h-28 border-3 border-white shadow-2xl transform -rotate-12 z-10">
          <img src={images[12]} alt="Vision 13" className="w-full h-full object-cover" />
        </div>
      )}

      {images[13] && (
        <div className="absolute top-[15%] right-[8%] w-32 h-32 border-3 border-white shadow-2xl transform rotate-15 z-10">
          <img src={images[13]} alt="Vision 14" className="w-full h-full object-cover" />
        </div>
      )}

      {images[14] && (
        <div className="absolute bottom-[10%] left-[12%] w-30 h-30 border-3 border-white shadow-2xl transform rotate-8 z-10">
          <img src={images[14]} alt="Vision 15" className="w-full h-full object-cover" />
        </div>
      )}

      {/* Decorative text badges */}
      <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-pink-400 to-purple-500 px-4 py-1 rounded-full shadow-lg z-10">
        <p className="text-sm font-black text-white uppercase tracking-wide">Manifest Your Dreams</p>
      </div>
    </div>
  );
}
