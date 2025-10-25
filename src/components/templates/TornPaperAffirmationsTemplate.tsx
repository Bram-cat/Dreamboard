"use client";

import React from "react";

interface TornPaperAffirmationsTemplateProps {
  images: string[]; // 12-15 images
  keywords: string[];
}

export default function TornPaperAffirmationsTemplate({
  images,
  keywords,
}: TornPaperAffirmationsTemplateProps) {
  const affirmations = [
    "Money flows to me effortlessly.",
    "Aligned, abundant, & unstoppable.",
    "I nourish my body, mind, and soul.",
    "I am capable.",
    "Confidence, courage, and clarity.",
    "Grateful, glowing, & growing.",
    "Growth over perfection.",
    "I create joy every day.",
    "My dreams are becoming reality.",
    "Limitless potential lives within me.",
  ];

  return (
    <div className="relative w-full h-[768px] bg-gradient-to-br from-stone-50 via-neutral-50 to-amber-50 overflow-hidden">
      {/* Subtle paper texture background */}
      <div className="absolute inset-0 opacity-20 bg-[repeating-linear-gradient(0deg,transparent,transparent_2px,rgba(0,0,0,0.02)_2px,rgba(0,0,0,0.02)_4px)]"></div>

      {/* Dense torn paper collage - no gaps */}
      <div className="absolute inset-0 p-1">
        {/* Top row - 3 images */}
        <div className="flex gap-1 h-[33%]">
          <div className="relative flex-1 overflow-hidden shadow-lg" style={{ clipPath: "polygon(0% 1%, 99% 0%, 100% 99%, 1% 100%)" }}>
            {images[0] && <img src={images[0]} alt="Vision 1" className="w-full h-full object-cover" />}
            <div className="absolute bottom-3 left-3 bg-white/95 backdrop-blur-sm px-3 py-2 max-w-[85%] shadow-md">
              <p className="text-[10px] font-light text-gray-800 italic leading-relaxed">{affirmations[0]}</p>
            </div>
          </div>

          <div className="relative flex-[0.6] overflow-hidden shadow-lg" style={{ clipPath: "polygon(1% 0%, 100% 2%, 99% 100%, 0% 98%)" }}>
            {images[1] && <img src={images[1]} alt="Vision 2" className="w-full h-full object-cover" />}
          </div>

          <div className="relative flex-1 overflow-hidden shadow-lg" style={{ clipPath: "polygon(0% 2%, 98% 0%, 100% 98%, 2% 100%)" }}>
            {images[2] && <img src={images[2]} alt="Vision 3" className="w-full h-full object-cover" />}
            <div className="absolute top-3 right-3 bg-black/80 backdrop-blur-sm px-3 py-2 max-w-[80%] shadow-md">
              <p className="text-[10px] font-light text-white italic leading-relaxed">{affirmations[1]}</p>
            </div>
          </div>
        </div>

        {/* Middle row - Central text with flanking images */}
        <div className="flex gap-1 h-[34%] mt-1">
          <div className="relative w-[25%] overflow-hidden shadow-lg" style={{ clipPath: "polygon(0% 1%, 99% 0%, 100% 99%, 1% 100%)" }}>
            {images[3] && <img src={images[3]} alt="Vision 4" className="w-full h-full object-cover" />}
          </div>

          {/* Center text panel */}
          <div className="relative flex-1 flex items-center justify-center bg-white/90 backdrop-blur-sm shadow-xl">
            <div className="text-center space-y-2 px-6">
              <h1 className="text-8xl font-bold text-gray-900 tracking-tight">2025</h1>
              <div className="border-t border-gray-300 pt-2 space-y-1">
                {keywords.slice(0, 3).map((keyword, idx) => (
                  <p key={idx} className="text-sm font-light text-gray-700 italic">
                    {keyword}
                  </p>
                ))}
              </div>
              <p className="text-xs text-gray-500 pt-2 font-serif">✨ Affirmations Included ✨</p>
            </div>
          </div>

          <div className="relative w-[25%] overflow-hidden shadow-lg" style={{ clipPath: "polygon(1% 0%, 100% 2%, 99% 100%, 0% 98%)" }}>
            {images[4] && <img src={images[4]} alt="Vision 5" className="w-full h-full object-cover" />}
            <div className="absolute bottom-3 left-2 bg-amber-100/95 backdrop-blur-sm px-2 py-2 max-w-[90%] shadow-md">
              <p className="text-[9px] font-light text-gray-900 italic leading-tight">{affirmations[2]}</p>
            </div>
          </div>
        </div>

        {/* Bottom row - 3 images */}
        <div className="flex gap-1 h-[32%] mt-1">
          <div className="relative flex-1 overflow-hidden shadow-lg" style={{ clipPath: "polygon(0% 2%, 98% 0%, 100% 98%, 2% 100%)" }}>
            {images[5] && <img src={images[5]} alt="Vision 6" className="w-full h-full object-cover" />}
            <div className="absolute top-3 left-3 bg-pink-100/95 backdrop-blur-sm px-3 py-2 max-w-[80%] shadow-md">
              <p className="text-[10px] font-light text-gray-900 italic leading-relaxed">{affirmations[3]}</p>
            </div>
          </div>

          <div className="relative flex-[0.7] overflow-hidden shadow-lg" style={{ clipPath: "polygon(1% 0%, 100% 1%, 99% 100%, 0% 99%)" }}>
            {images[6] && <img src={images[6]} alt="Vision 7" className="w-full h-full object-cover" />}
          </div>

          <div className="relative flex-1 overflow-hidden shadow-lg" style={{ clipPath: "polygon(0% 1%, 99% 0%, 100% 99%, 1% 100%)" }}>
            {images[7] && <img src={images[7]} alt="Vision 8" className="w-full h-full object-cover" />}
            <div className="absolute bottom-3 right-3 bg-white/95 backdrop-blur-sm px-3 py-2 max-w-[75%] shadow-md">
              <p className="text-[10px] font-light text-gray-800 italic leading-relaxed">{affirmations[4]}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Overlay torn paper images for 9-15 */}
      {images[8] && (
        <div className="absolute top-[8%] left-[6%] w-32 h-36 shadow-2xl transform -rotate-8 z-20" style={{ clipPath: "polygon(0% 2%, 98% 0%, 100% 98%, 2% 100%)" }}>
          <img src={images[8]} alt="Vision 9" className="w-full h-full object-cover" />
          <div className="absolute bottom-2 left-2 bg-purple-100/95 backdrop-blur-sm px-2 py-1 max-w-[88%] shadow-md">
            <p className="text-[8px] font-light text-gray-900 italic">{affirmations[5]}</p>
          </div>
        </div>
      )}

      {images[9] && (
        <div className="absolute top-[10%] right-[7%] w-36 h-40 shadow-2xl transform rotate-10 z-20" style={{ clipPath: "polygon(1% 0%, 100% 1%, 99% 100%, 0% 99%)" }}>
          <img src={images[9]} alt="Vision 10" className="w-full h-full object-cover" />
        </div>
      )}

      {images[10] && (
        <div className="absolute bottom-[10%] left-[8%] w-34 h-38 shadow-2xl transform rotate-6 z-20" style={{ clipPath: "polygon(0% 1%, 99% 0%, 100% 99%, 1% 100%)" }}>
          <img src={images[10]} alt="Vision 11" className="w-full h-full object-cover" />
          <div className="absolute top-2 right-2 bg-green-100/95 backdrop-blur-sm px-2 py-1 max-w-[85%] shadow-md">
            <p className="text-[8px] font-light text-gray-900 italic">{affirmations[6]}</p>
          </div>
        </div>
      )}

      {images[11] && (
        <div className="absolute bottom-[8%] right-[6%] w-30 h-34 shadow-2xl transform -rotate-12 z-20" style={{ clipPath: "polygon(1% 0%, 100% 2%, 99% 100%, 0% 98%)" }}>
          <img src={images[11]} alt="Vision 12" className="w-full h-full object-cover" />
        </div>
      )}

      {images[12] && (
        <div className="absolute top-[40%] left-[3%] w-28 h-32 shadow-2xl transform rotate-15 z-20" style={{ clipPath: "polygon(0% 2%, 98% 0%, 100% 98%, 2% 100%)" }}>
          <img src={images[12]} alt="Vision 13" className="w-full h-full object-cover" />
        </div>
      )}

      {images[13] && (
        <div className="absolute top-[45%] right-[4%] w-32 h-36 shadow-2xl transform -rotate-9 z-20" style={{ clipPath: "polygon(1% 0%, 100% 1%, 99% 100%, 0% 99%)" }}>
          <img src={images[13]} alt="Vision 14" className="w-full h-full object-cover" />
          <div className="absolute bottom-2 left-2 bg-blue-100/95 backdrop-blur-sm px-2 py-1 max-w-[85%] shadow-md">
            <p className="text-[8px] font-light text-gray-900 italic">{affirmations[7]}</p>
          </div>
        </div>
      )}

      {images[14] && (
        <div className="absolute bottom-[35%] left-[12%] w-26 h-30 shadow-2xl transform -rotate-6 z-20" style={{ clipPath: "polygon(0% 1%, 99% 0%, 100% 99%, 1% 100%)" }}>
          <img src={images[14]} alt="Vision 15" className="w-full h-full object-cover" />
        </div>
      )}

      {/* Main affirmation banner */}
      <div className="absolute top-6 left-1/2 -translate-x-1/2 bg-white/98 backdrop-blur-sm px-8 py-3 shadow-2xl transform -rotate-1 z-30">
        <h2 className="text-2xl font-serif font-light text-gray-800 tracking-wide italic">{affirmations[3]}</h2>
      </div>

      {/* Bottom motivational text */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-pink-400 to-purple-500 px-6 py-2 shadow-xl transform rotate-1 z-25">
        <p className="text-sm font-bold text-white uppercase tracking-widest">{affirmations[8]}</p>
      </div>
    </div>
  );
}
