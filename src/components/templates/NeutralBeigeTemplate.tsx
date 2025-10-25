"use client";

import React from "react";

interface NeutralBeigeTemplateProps {
  images: string[]; // 12-15 images
  keywords: string[];
}

export default function NeutralBeigeTemplate({
  images,
  keywords,
}: NeutralBeigeTemplateProps) {
  const sections = [
    { label: keywords[0] || "LEARNING", emoji: "📚" },
    { label: keywords[1] || "CAREER", emoji: "💼" },
    { label: keywords[2] || "TRAVEL", emoji: "✈️" },
    { label: keywords[3] || "HEALTH", emoji: "🧘" },
    { label: keywords[4] || "LOVE", emoji: "💕" },
    { label: keywords[5] || "WEALTH", emoji: "💰" },
    { label: keywords[6] || "PEACE", emoji: "🌸" },
  ];

  // Inspirational quotes pool
  const quotesPool = [
    "I am worthy of my dreams",
    "Every day I grow stronger",
    "My potential is limitless",
    "I create my own reality",
    "Success flows to me naturally",
    "I am grateful for this journey",
    "My best days are ahead",
    "I trust the process",
  ];

  // Randomly select 3-4 quotes
  const selectedQuotes = quotesPool.slice(0, 3 + Math.floor(Math.random() * 2));

  return (
    <div className="relative w-full h-[768px] bg-gradient-to-br from-amber-50 via-stone-50 to-neutral-100 overflow-hidden">
      {/* Dense masonry-style layout */}
      <div className="absolute inset-0 p-1">
        {/* Top row - 4 columns */}
        <div className="flex gap-1 h-[32%]">
          <div className="relative flex-1 overflow-hidden rounded-sm">
            {images[0] && <img src={images[0]} alt="Vision 1" className="w-full h-full object-cover" />}
            <div className="absolute top-2 left-2 bg-amber-100/90 backdrop-blur-sm px-2 py-1 rounded-sm shadow">
              <p className="text-[9px] font-semibold text-amber-900 uppercase tracking-wide">{sections[0].label}</p>
            </div>
          </div>

          <div className="relative flex-1 overflow-hidden rounded-sm">
            {images[1] && <img src={images[1]} alt="Vision 2" className="w-full h-full object-cover" />}
            <div className="absolute top-2 right-2 text-xl">{sections[1].emoji}</div>
          </div>

          <div className="relative flex-1 overflow-hidden rounded-sm">
            {images[2] && <img src={images[2]} alt="Vision 3" className="w-full h-full object-cover" />}
            <div className="absolute bottom-2 left-2 bg-stone-200/90 backdrop-blur-sm px-2 py-1 rounded-sm shadow">
              <p className="text-[9px] font-semibold text-stone-900 uppercase tracking-wide">{sections[2].label}</p>
            </div>
          </div>

          <div className="relative flex-1 overflow-hidden rounded-sm">
            {images[3] && <img src={images[3]} alt="Vision 4" className="w-full h-full object-cover" />}
          </div>
        </div>

        {/* Middle row - Center text with flanking images */}
        <div className="flex gap-1 h-[36%] mt-1">
          <div className="relative w-[30%] overflow-hidden rounded-sm">
            {images[4] && <img src={images[4]} alt="Vision 5" className="w-full h-full object-cover" />}
            <div className="absolute top-2 left-2 text-xl">{sections[3].emoji}</div>
          </div>

          {/* Center text panel - larger */}
          <div className="relative flex-1 flex items-center justify-center bg-gradient-to-br from-stone-50 via-amber-50 to-neutral-50 rounded-sm border border-stone-200/50">
            <div className="text-center space-y-2 px-6">
              <div className="text-2xl mb-1">✨</div>
              <p className="text-7xl font-extralight text-stone-800 tracking-wide">2025</p>
              <div className="space-y-0.5">
                <p className="text-2xl font-serif text-stone-700 italic tracking-wider">VISION</p>
                <p className="text-3xl font-serif font-bold text-stone-900 tracking-wide">BOARD</p>
              </div>
              <div className="pt-2 flex justify-center gap-2 text-xs text-stone-600">
                {sections.slice(0, 3).map((s, i) => (
                  <span key={i} className="opacity-60">{s.emoji}</span>
                ))}
              </div>
            </div>
          </div>

          <div className="relative w-[30%] overflow-hidden rounded-sm">
            {images[5] && <img src={images[5]} alt="Vision 6" className="w-full h-full object-cover" />}
            <div className="absolute bottom-2 right-2 bg-neutral-200/90 backdrop-blur-sm px-2 py-1 rounded-sm shadow">
              <p className="text-[9px] font-semibold text-neutral-900 uppercase tracking-wide">{sections[4].label}</p>
            </div>
          </div>
        </div>

        {/* Bottom row - 4 columns */}
        <div className="flex gap-1 h-[31%] mt-1">
          <div className="relative flex-1 overflow-hidden rounded-sm">
            {images[6] && <img src={images[6]} alt="Vision 7" className="w-full h-full object-cover" />}
            <div className="absolute bottom-2 left-2 text-xl">{sections[5].emoji}</div>
          </div>

          <div className="relative flex-1 overflow-hidden rounded-sm">
            {images[7] && <img src={images[7]} alt="Vision 8" className="w-full h-full object-cover" />}
          </div>

          <div className="relative flex-1 overflow-hidden rounded-sm">
            {images[8] && <img src={images[8]} alt="Vision 9" className="w-full h-full object-cover" />}
            <div className="absolute top-2 right-2 bg-stone-100/90 backdrop-blur-sm px-2 py-1 rounded-sm shadow">
              <p className="text-[9px] font-semibold text-stone-900 uppercase tracking-wide">{sections[6].label}</p>
            </div>
          </div>

          <div className="relative flex-1 overflow-hidden rounded-sm">
            {images[9] && <img src={images[9]} alt="Vision 10" className="w-full h-full object-cover" />}
          </div>
        </div>
      </div>

      {/* Overlay polaroid-style images for 11-15 - positioned to not block main content */}
      {images[10] && (
        <div className="absolute bottom-[2%] left-[2%] w-24 h-28 bg-white p-2 rounded-sm shadow-2xl transform -rotate-8 z-10">
          <div className="w-full h-[80%] overflow-hidden">
            <img src={images[10]} alt="Vision 11" className="w-full h-full object-cover" />
          </div>
          <p className="text-[8px] text-center text-stone-600 mt-1" style={{fontFamily: 'cursive'}}>{keywords[7] || ""}</p>
        </div>
      )}

      {images[11] && (
        <div className="absolute bottom-[2%] right-[2%] w-26 h-30 bg-white p-2 rounded-sm shadow-2xl transform rotate-10 z-10">
          <div className="w-full h-[80%] overflow-hidden">
            <img src={images[11]} alt="Vision 12" className="w-full h-full object-cover" />
          </div>
          <p className="text-[8px] text-center text-stone-600 mt-1" style={{fontFamily: 'cursive'}}>{keywords[8] || ""}</p>
        </div>
      )}

      {images[12] && (
        <div className="absolute bottom-[32%] left-[2%] w-22 h-26 bg-white p-2 rounded-sm shadow-2xl transform rotate-6 z-10">
          <div className="w-full h-[80%] overflow-hidden">
            <img src={images[12]} alt="Vision 13" className="w-full h-full object-cover" />
          </div>
        </div>
      )}

      {images[13] && (
        <div className="absolute bottom-[32%] right-[2%] w-24 h-28 bg-white p-2 rounded-sm shadow-2xl transform -rotate-8 z-10">
          <div className="w-full h-[80%] overflow-hidden">
            <img src={images[13]} alt="Vision 14" className="w-full h-full object-cover" />
          </div>
        </div>
      )}

      {images[14] && (
        <div className="absolute bottom-[15%] left-[15%] w-20 h-24 bg-white p-2 rounded-sm shadow-2xl transform rotate-12 z-10">
          <div className="w-full h-[80%] overflow-hidden">
            <img src={images[14]} alt="Vision 15" className="w-full h-full object-cover" />
          </div>
        </div>
      )}

      {/* Subtle text overlays */}
      <div className="absolute top-3 left-1/2 -translate-x-1/2 bg-stone-800/80 backdrop-blur-sm px-4 py-1 rounded-full shadow-lg z-5">
        <p className="text-xs font-light text-amber-50 tracking-widest">MY DREAMS & GOALS</p>
      </div>

      {/* Quote boxes positioned at bottom edges - big and visible */}
      {selectedQuotes[0] && (
        <div className="absolute bottom-[34%] right-[28%] bg-white/95 backdrop-blur-sm px-5 py-3 shadow-2xl transform rotate-3 z-15 max-w-[200px]">
          <p className="text-sm font-serif italic text-gray-800 leading-relaxed text-center">{selectedQuotes[0]}</p>
        </div>
      )}

      {selectedQuotes[1] && (
        <div className="absolute bottom-[1%] left-[35%] bg-amber-50/95 backdrop-blur-sm px-5 py-3 shadow-2xl transform -rotate-2 z-15 max-w-[180px]">
          <p className="text-xs font-light text-stone-900 leading-relaxed text-center tracking-wide">{selectedQuotes[1]}</p>
        </div>
      )}

      {selectedQuotes[2] && (
        <div className="absolute top-[2%] left-[45%] bg-stone-100/95 backdrop-blur-sm px-4 py-2 shadow-xl transform rotate-1 z-15 max-w-[160px]">
          <p className="text-xs font-medium text-gray-700 leading-tight text-center">{selectedQuotes[2]}</p>
        </div>
      )}

      {selectedQuotes[3] && (
        <div className="absolute bottom-[34%] left-[28%] bg-neutral-100/95 backdrop-blur-sm px-4 py-3 shadow-xl transform -rotate-4 z-15 max-w-[170px]">
          <p className="text-xs font-serif italic text-gray-800 leading-relaxed text-center">{selectedQuotes[3]}</p>
        </div>
      )}
    </div>
  );
}
