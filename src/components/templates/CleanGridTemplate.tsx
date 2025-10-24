"use client";

import React from "react";

interface CleanGridTemplateProps {
  images: string[]; // 8-10 images
  keywords: string[];
}

export default function CleanGridTemplate({
  images,
  keywords,
}: CleanGridTemplateProps) {
  return (
    <div className="relative w-full h-[768px] bg-gradient-to-br from-stone-100 to-neutral-50 overflow-hidden">
      {/* Grid container with 3x3 layout */}
      <div className="grid grid-cols-3 grid-rows-3 gap-0 w-full h-full">
        {/* Row 1 */}
        {/* Image 1 - Top Left */}
        <div className="relative overflow-hidden border-2 border-white">
          {images[0] && (
            <img
              src={images[0]}
              alt="Vision 1"
              className="w-full h-full object-cover"
            />
          )}
          <div className="absolute top-3 left-3 bg-white/90 px-3 py-1 rounded">
            <p className="text-xs font-semibold text-gray-700 uppercase">
              {keywords[0] || "Traveling"}
            </p>
          </div>
        </div>

        {/* Image 2 - Top Center */}
        <div className="relative overflow-hidden border-2 border-white">
          {images[1] && (
            <img
              src={images[1]}
              alt="Vision 2"
              className="w-full h-full object-cover"
            />
          )}
        </div>

        {/* Image 3 - Top Right */}
        <div className="relative overflow-hidden border-2 border-white">
          {images[2] && (
            <img
              src={images[2]}
              alt="Vision 3"
              className="w-full h-full object-cover"
            />
          )}
        </div>

        {/* Row 2 */}
        {/* Image 4 - Middle Left */}
        <div className="relative overflow-hidden border-2 border-white">
          {images[3] && (
            <img
              src={images[3]}
              alt="Vision 4"
              className="w-full h-full object-cover"
            />
          )}
          <div className="absolute bottom-3 left-3 bg-black/70 px-3 py-1 rounded">
            <p className="text-xs font-bold text-white">
              {keywords[1] || "I Love What I Do"}
            </p>
          </div>
        </div>

        {/* Center - Text Overlay */}
        <div className="relative flex items-center justify-center bg-gradient-to-br from-amber-50 via-white to-stone-50 border-2 border-white">
          <div className="text-center space-y-3 px-6">
            <h1 className="text-5xl font-serif font-light text-gray-800">
              Make it
            </h1>
            <h2 className="text-6xl font-serif font-bold text-gray-900">
              Happen
            </h2>
            <p className="text-sm font-light text-gray-600 italic">
              Vision Board
            </p>
            <p className="text-2xl font-bold text-gray-900">2025</p>
          </div>
        </div>

        {/* Image 5 - Middle Right */}
        <div className="relative overflow-hidden border-2 border-white">
          {images[4] && (
            <img
              src={images[4]}
              alt="Vision 5"
              className="w-full h-full object-cover"
            />
          )}
        </div>

        {/* Row 3 */}
        {/* Image 6 - Bottom Left */}
        <div className="relative overflow-hidden border-2 border-white">
          {images[5] && (
            <img
              src={images[5]}
              alt="Vision 6"
              className="w-full h-full object-cover"
            />
          )}
          <div className="absolute bottom-3 right-3 bg-white/90 px-3 py-1 rounded">
            <p className="text-xs font-semibold text-gray-700 capitalize">
              {keywords[2] || "Meditation"}
            </p>
          </div>
        </div>

        {/* Image 7 - Bottom Center */}
        <div className="relative overflow-hidden border-2 border-white">
          {images[6] && (
            <img
              src={images[6]}
              alt="Vision 7"
              className="w-full h-full object-cover"
            />
          )}
        </div>

        {/* Image 8 - Bottom Right */}
        <div className="relative overflow-hidden border-2 border-white">
          {images[7] && (
            <img
              src={images[7]}
              alt="Vision 8"
              className="w-full h-full object-cover"
            />
          )}
        </div>
      </div>

      {/* Optional 9th and 10th images as overlays */}
      {images[8] && (
        <div className="absolute top-4 right-4 w-32 h-32 border-4 border-white shadow-2xl transform rotate-12">
          <img
            src={images[8]}
            alt="Vision 9"
            className="w-full h-full object-cover"
          />
        </div>
      )}

      {images[9] && (
        <div className="absolute bottom-4 left-4 w-32 h-32 border-4 border-white shadow-2xl transform -rotate-6">
          <img
            src={images[9]}
            alt="Vision 10"
            className="w-full h-full object-cover"
          />
        </div>
      )}
    </div>
  );
}
