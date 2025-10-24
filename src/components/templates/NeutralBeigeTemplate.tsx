"use client";

import React from "react";

interface NeutralBeigeTemplateProps {
  images: string[]; // 8-10 images
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
  ];

  return (
    <div className="relative w-full h-[768px] bg-gradient-to-br from-amber-50 via-stone-100 to-neutral-100 overflow-hidden">
      {/* Grid layout - 3x3 with center text */}
      <div className="grid grid-cols-3 grid-rows-3 gap-1 w-full h-full p-2">
        {/* Image 1 - Top Left */}
        <div className="relative overflow-hidden rounded-sm">
          {images[0] && (
            <img
              src={images[0]}
              alt="Vision 1"
              className="w-full h-full object-cover"
            />
          )}
          <div className="absolute top-2 left-2 bg-amber-100/80 backdrop-blur-sm px-2 py-1 rounded-sm">
            <p className="text-[10px] font-medium text-amber-900 uppercase tracking-wide">
              {sections[0].label}
            </p>
          </div>
        </div>

        {/* Image 2 - Top Center */}
        <div className="relative overflow-hidden rounded-sm">
          {images[1] && (
            <img
              src={images[1]}
              alt="Vision 2"
              className="w-full h-full object-cover"
            />
          )}
          <div className="absolute top-2 right-2 text-2xl">{sections[1].emoji}</div>
        </div>

        {/* Image 3 - Top Right */}
        <div className="relative overflow-hidden rounded-sm">
          {images[2] && (
            <img
              src={images[2]}
              alt="Vision 3"
              className="w-full h-full object-cover"
            />
          )}
          <div className="absolute bottom-2 right-2 bg-stone-100/80 backdrop-blur-sm px-2 py-1 rounded-sm">
            <p className="text-[10px] font-medium text-stone-900 uppercase tracking-wide">
              {sections[2].label}
            </p>
          </div>
        </div>

        {/* Image 4 - Middle Left */}
        <div className="relative overflow-hidden rounded-sm">
          {images[3] && (
            <img
              src={images[3]}
              alt="Vision 4"
              className="w-full h-full object-cover"
            />
          )}
        </div>

        {/* Center - Main Text */}
        <div className="relative flex items-center justify-center bg-gradient-to-br from-amber-50 to-stone-100 rounded-sm">
          <div className="text-center space-y-2">
            <div className="text-3xl mb-2">✨</div>
            <p className="text-6xl font-light text-stone-800">2025</p>
            <div className="space-y-1">
              <p className="text-xl font-serif text-stone-700 italic">
                VISION
              </p>
              <p className="text-2xl font-serif font-bold text-stone-900">
                BOARD
              </p>
            </div>
          </div>
        </div>

        {/* Image 5 - Middle Right */}
        <div className="relative overflow-hidden rounded-sm">
          {images[4] && (
            <img
              src={images[4]}
              alt="Vision 5"
              className="w-full h-full object-cover"
            />
          )}
          <div className="absolute bottom-2 left-2 bg-neutral-100/80 backdrop-blur-sm px-2 py-1 rounded-sm">
            <p className="text-[10px] font-medium text-neutral-900 uppercase tracking-wide">
              {sections[3].label}
            </p>
          </div>
        </div>

        {/* Image 6 - Bottom Left */}
        <div className="relative overflow-hidden rounded-sm">
          {images[5] && (
            <img
              src={images[5]}
              alt="Vision 6"
              className="w-full h-full object-cover"
            />
          )}
        </div>

        {/* Image 7 - Bottom Center */}
        <div className="relative overflow-hidden rounded-sm">
          {images[6] && (
            <img
              src={images[6]}
              alt="Vision 7"
              className="w-full h-full object-cover"
            />
          )}
          <div className="absolute top-2 left-2 text-2xl">{sections[4].emoji}</div>
        </div>

        {/* Image 8 - Bottom Right */}
        <div className="relative overflow-hidden rounded-sm">
          {images[7] && (
            <img
              src={images[7]}
              alt="Vision 8"
              className="w-full h-full object-cover"
            />
          )}
          <div className="absolute bottom-2 right-2 bg-stone-100/80 backdrop-blur-sm px-2 py-1 rounded-sm">
            <p className="text-[10px] font-medium text-stone-900 uppercase tracking-wide">
              {sections[4].label}
            </p>
          </div>
        </div>
      </div>

      {/* Optional decorative text overlays */}
      {images[8] && (
        <div className="absolute top-[200px] right-8 w-24 h-28 overflow-hidden rounded-sm shadow-lg border-2 border-white transform rotate-12">
          <img
            src={images[8]}
            alt="Vision 9"
            className="w-full h-full object-cover"
          />
        </div>
      )}

      {images[9] && (
        <div className="absolute bottom-[200px] left-8 w-24 h-28 overflow-hidden rounded-sm shadow-lg border-2 border-white transform -rotate-12">
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
