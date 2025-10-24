"use client";

import React from "react";

interface TornPaperAffirmationsTemplateProps {
  images: string[]; // 8-10 images
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
  ];

  return (
    <div className="relative w-full h-[768px] bg-gradient-to-br from-neutral-50 via-stone-50 to-amber-50 overflow-hidden">
      {/* Background texture */}
      <div className="absolute inset-0 bg-[url('/paper-texture.jpg')] opacity-30"></div>

      {/* Main collage layout */}
      <div className="grid grid-cols-4 grid-rows-4 gap-2 w-full h-full p-4">
        {/* Image 1 - Top Left Large (2x2) */}
        <div
          className="col-span-2 row-span-2 relative overflow-hidden"
          style={{
            clipPath: "polygon(0% 2%, 98% 0%, 100% 98%, 2% 100%)",
          }}
        >
          {images[0] && (
            <img
              src={images[0]}
              alt="Vision 1"
              className="w-full h-full object-cover"
            />
          )}
          {/* Affirmation overlay */}
          <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-2 max-w-[80%] shadow-lg">
            <p className="text-xs font-light text-gray-800 italic leading-relaxed">
              {affirmations[0]}
            </p>
          </div>
        </div>

        {/* Image 2 - Top Right Tall */}
        <div
          className="col-span-2 row-span-2 relative overflow-hidden"
          style={{
            clipPath: "polygon(2% 0%, 100% 1%, 98% 100%, 0% 99%)",
          }}
        >
          {images[1] && (
            <img
              src={images[1]}
              alt="Vision 2"
              className="w-full h-full object-cover"
            />
          )}
          <div className="absolute top-4 right-4 bg-black/70 backdrop-blur-sm px-3 py-2 max-w-[70%] shadow-lg">
            <p className="text-xs font-light text-white italic leading-relaxed">
              {affirmations[1]}
            </p>
          </div>
        </div>

        {/* Center text - 2025 */}
        <div className="col-span-2 row-span-2 relative flex items-center justify-center bg-white/80 backdrop-blur-sm shadow-xl">
          <div className="text-center space-y-3 px-4">
            <h1 className="text-7xl font-bold text-gray-900">2025</h1>
            <div className="space-y-1">
              {keywords.slice(0, 3).map((keyword, idx) => (
                <p
                  key={idx}
                  className="text-sm font-light text-gray-700 italic"
                >
                  {keyword}
                </p>
              ))}
            </div>
          </div>
        </div>

        {/* Image 3 - Middle Right */}
        <div
          className="col-span-2 relative overflow-hidden"
          style={{
            clipPath: "polygon(1% 3%, 99% 0%, 100% 97%, 0% 100%)",
          }}
        >
          {images[2] && (
            <img
              src={images[2]}
              alt="Vision 3"
              className="w-full h-full object-cover"
            />
          )}
        </div>

        {/* Image 4 - Middle Left */}
        <div
          className="col-span-1 row-span-2 relative overflow-hidden"
          style={{
            clipPath: "polygon(0% 1%, 98% 0%, 100% 99%, 2% 100%)",
          }}
        >
          {images[3] && (
            <img
              src={images[3]}
              alt="Vision 4"
              className="w-full h-full object-cover"
            />
          )}
          <div className="absolute top-4 left-2 bg-amber-100/90 backdrop-blur-sm px-2 py-1 max-w-[90%] shadow-lg">
            <p className="text-[9px] font-light text-gray-800 italic leading-tight">
              {affirmations[2]}
            </p>
          </div>
        </div>

        {/* Image 5 - Center Small */}
        <div
          className="col-span-1 row-span-1 relative overflow-hidden"
          style={{
            clipPath: "polygon(2% 0%, 100% 2%, 98% 100%, 0% 98%)",
          }}
        >
          {images[4] && (
            <img
              src={images[4]}
              alt="Vision 5"
              className="w-full h-full object-cover"
            />
          )}
        </div>

        {/* Image 6 - Bottom Center */}
        <div
          className="col-span-2 row-span-2 relative overflow-hidden"
          style={{
            clipPath: "polygon(0% 2%, 99% 0%, 100% 98%, 1% 100%)",
          }}
        >
          {images[5] && (
            <img
              src={images[5]}
              alt="Vision 6"
              className="w-full h-full object-cover"
            />
          )}
          <div className="absolute bottom-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-2 max-w-[70%] shadow-lg">
            <p className="text-xs font-light text-gray-800 italic leading-relaxed">
              {affirmations[3]}
            </p>
          </div>
        </div>

        {/* Image 7 - Bottom Right Tall */}
        <div
          className="col-span-1 row-span-2 relative overflow-hidden"
          style={{
            clipPath: "polygon(1% 0%, 100% 2%, 99% 100%, 0% 98%)",
          }}
        >
          {images[6] && (
            <img
              src={images[6]}
              alt="Vision 7"
              className="w-full h-full object-cover"
            />
          )}
        </div>

        {/* Image 8 - Bottom Left */}
        <div
          className="col-span-1 relative overflow-hidden"
          style={{
            clipPath: "polygon(0% 3%, 97% 0%, 100% 97%, 3% 100%)",
          }}
        >
          {images[7] && (
            <img
              src={images[7]}
              alt="Vision 8"
              className="w-full h-full object-cover"
            />
          )}
        </div>
      </div>

      {/* Additional images as overlays */}
      {images[8] && (
        <div
          className="absolute top-[15%] left-[5%] w-32 h-36 shadow-2xl transform -rotate-6"
          style={{
            clipPath: "polygon(1% 2%, 99% 0%, 100% 98%, 0% 100%)",
            zIndex: 20,
          }}
        >
          <img
            src={images[8]}
            alt="Vision 9"
            className="w-full h-full object-cover"
          />
          <div className="absolute bottom-2 left-2 bg-pink-200/90 backdrop-blur-sm px-2 py-1 max-w-[85%] shadow-lg">
            <p className="text-[8px] font-light text-gray-900 italic">
              {affirmations[4]}
            </p>
          </div>
        </div>
      )}

      {images[9] && (
        <div
          className="absolute bottom-[12%] right-[8%] w-28 h-32 shadow-2xl transform rotate-8"
          style={{
            clipPath: "polygon(0% 1%, 98% 0%, 100% 99%, 2% 100%)",
            zIndex: 20,
          }}
        >
          <img
            src={images[9]}
            alt="Vision 10"
            className="w-full h-full object-cover"
          />
        </div>
      )}

      {/* Main title overlay */}
      <div className="absolute top-8 left-1/2 -translate-x-1/2 bg-white/95 backdrop-blur-sm px-8 py-3 shadow-2xl transform -rotate-1 z-30">
        <h2 className="text-2xl font-serif font-light text-gray-800 tracking-wide">
          I am capable.
        </h2>
      </div>
    </div>
  );
}
