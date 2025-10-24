"use client";

import React from "react";

interface MagazineCollageTemplateProps {
  images: string[]; // 8-10 images
  keywords: string[];
  style?: "bold" | "neutral" | "colorful";
}

export default function MagazineCollageTemplate({
  images,
  keywords,
  style = "bold",
}: MagazineCollageTemplateProps) {
  const motivationalTexts = [
    "FINANCIAL FREEDOM",
    "2025",
    "VISION BOARD",
    "PASSIVE INCOME",
    "SUCCESS",
    "positive mindset",
    "MAKE IT HAPPEN",
  ];

  return (
    <div className="relative w-full h-[768px] bg-gradient-to-br from-amber-50 to-stone-100 overflow-hidden">
      {/* Background texture */}
      <div className="absolute inset-0 bg-[url('/cork-texture.jpg')] opacity-20"></div>

      {/* Image Frame 1 - Top Left Large */}
      <div
        className="absolute top-8 left-8 w-64 h-72 bg-white shadow-2xl transform -rotate-3"
        style={{ zIndex: 10 }}
      >
        {images[0] && (
          <img
            src={images[0]}
            alt="Vision 1"
            className="w-full h-full object-cover"
          />
        )}
      </div>

      {/* Text Overlay - "FINANCIAL FREEDOM" */}
      <div
        className="absolute top-16 right-12 bg-white px-6 py-3 shadow-lg transform rotate-2"
        style={{ zIndex: 15 }}
      >
        <h2 className="text-2xl font-black text-gray-900 tracking-tight">
          {keywords[0]?.toUpperCase() || "FINANCIAL FREEDOM"}
        </h2>
      </div>

      {/* Image Frame 2 - Top Right */}
      <div
        className="absolute top-24 right-24 w-56 h-64 bg-white shadow-2xl transform rotate-6"
        style={{ zIndex: 8 }}
      >
        {images[1] && (
          <img
            src={images[1]}
            alt="Vision 2"
            className="w-full h-full object-cover"
          />
        )}
      </div>

      {/* Text - "2025" */}
      <div
        className="absolute top-[280px] left-1/2 -translate-x-1/2 transform -rotate-3"
        style={{ zIndex: 20 }}
      >
        <div className="bg-gradient-to-r from-purple-400 to-pink-400 px-8 py-4 rounded-lg shadow-xl">
          <h1 className="text-6xl font-black text-white tracking-wider">
            2025
          </h1>
        </div>
      </div>

      {/* Image Frame 3 - Center Large */}
      <div
        className="absolute top-80 left-1/2 -translate-x-1/2 w-80 h-72 bg-white shadow-2xl transform rotate-1"
        style={{ zIndex: 5 }}
      >
        {images[2] && (
          <img
            src={images[2]}
            alt="Vision 3"
            className="w-full h-full object-cover"
          />
        )}
      </div>

      {/* Image Frame 4 - Middle Left */}
      <div
        className="absolute top-96 left-4 w-48 h-56 bg-white shadow-2xl transform -rotate-6"
        style={{ zIndex: 12 }}
      >
        {images[3] && (
          <img
            src={images[3]}
            alt="Vision 4"
            className="w-full h-full object-cover"
          />
        )}
      </div>

      {/* Text - "VISION BOARD" */}
      <div
        className="absolute top-[420px] left-20 bg-black px-6 py-3 shadow-lg transform -rotate-2"
        style={{ zIndex: 18 }}
      >
        <h2 className="text-3xl font-black text-white tracking-wide">
          VISION BOARD
        </h2>
      </div>

      {/* Image Frame 5 - Bottom Left Small */}
      <div
        className="absolute bottom-8 left-8 w-52 h-48 bg-white shadow-2xl transform rotate-3"
        style={{ zIndex: 9 }}
      >
        {images[4] && (
          <img
            src={images[4]}
            alt="Vision 5"
            className="w-full h-full object-cover"
          />
        )}
      </div>

      {/* Image Frame 6 - Bottom Center */}
      <div
        className="absolute bottom-16 left-1/2 -translate-x-1/2 w-56 h-52 bg-white shadow-2xl transform -rotate-2"
        style={{ zIndex: 7 }}
      >
        {images[5] && (
          <img
            src={images[5]}
            alt="Vision 6"
            className="w-full h-full object-cover"
          />
        )}
      </div>

      {/* Text - "PASSIVE INCOME" */}
      <div
        className="absolute bottom-[140px] right-16 bg-yellow-300 px-5 py-2 shadow-lg transform rotate-6"
        style={{ zIndex: 16 }}
      >
        <h3 className="text-xl font-black text-gray-900 tracking-tight">
          {keywords[1]?.toUpperCase() || "PASSIVE INCOME"}
        </h3>
      </div>

      {/* Image Frame 7 - Bottom Right */}
      <div
        className="absolute bottom-12 right-12 w-48 h-56 bg-white shadow-2xl transform rotate-4"
        style={{ zIndex: 11 }}
      >
        {images[6] && (
          <img
            src={images[6]}
            alt="Vision 7"
            className="w-full h-full object-cover"
          />
        )}
      </div>

      {/* Image Frame 8 - Middle Right Small */}
      <div
        className="absolute top-[380px] right-8 w-40 h-44 bg-white shadow-2xl transform -rotate-4"
        style={{ zIndex: 13 }}
      >
        {images[7] && (
          <img
            src={images[7]}
            alt="Vision 8"
            className="w-full h-full object-cover"
          />
        )}
      </div>

      {/* Text - Keyword Label */}
      <div
        className="absolute bottom-[220px] left-12 bg-pink-400 px-4 py-2 rounded-full shadow-lg transform -rotate-3"
        style={{ zIndex: 17 }}
      >
        <p className="text-sm font-bold text-white">
          {keywords[2]?.toLowerCase() || "positive mindset"}
        </p>
      </div>

      {/* Optional 9th and 10th images if provided */}
      {images[8] && (
        <div
          className="absolute top-[200px] right-48 w-36 h-40 bg-white shadow-2xl transform rotate-8"
          style={{ zIndex: 6 }}
        >
          <img
            src={images[8]}
            alt="Vision 9"
            className="w-full h-full object-cover"
          />
        </div>
      )}

      {images[9] && (
        <div
          className="absolute top-[480px] left-[360px] w-32 h-36 bg-white shadow-2xl transform -rotate-5"
          style={{ zIndex: 14 }}
        >
          <img
            src={images[9]}
            alt="Vision 10"
            className="w-full h-full object-cover"
          />
        </div>
      )}

      {/* Text - "SUCCESS" sticker */}
      <div
        className="absolute top-[520px] right-[280px] bg-green-400 px-5 py-2 rounded-lg shadow-lg transform rotate-3"
        style={{ zIndex: 19 }}
      >
        <h3 className="text-lg font-black text-white">SUCCESS</h3>
      </div>

      {/* Decorative elements */}
      <div
        className="absolute top-12 right-48 text-6xl transform rotate-12"
        style={{ zIndex: 4 }}
      >
        ✨
      </div>
      <div
        className="absolute bottom-24 left-48 text-5xl transform -rotate-12"
        style={{ zIndex: 4 }}
      >
        💫
      </div>
    </div>
  );
}
