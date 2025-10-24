"use client";

import React from "react";

interface PolaroidScatteredTemplateProps {
  images: string[]; // 8-10 images
  keywords: string[];
}

export default function PolaroidScatteredTemplate({
  images,
  keywords,
}: PolaroidScatteredTemplateProps) {
  const polaroidPositions = [
    { top: "8%", left: "5%", rotate: "-8deg", size: "large" },
    { top: "5%", left: "35%", rotate: "12deg", size: "small" },
    { top: "12%", right: "8%", rotate: "-6deg", size: "medium" },
    { top: "35%", left: "8%", rotate: "5deg", size: "medium" },
    { top: "40%", left: "45%", rotate: "-10deg", size: "large" },
    { top: "38%", right: "5%", rotate: "8deg", size: "small" },
    { bottom: "8%", left: "12%", rotate: "7deg", size: "medium" },
    { bottom: "10%", left: "42%", rotate: "-5deg", size: "small" },
    { bottom: "5%", right: "10%", rotate: "10deg", size: "large" },
  ];

  const sizeClasses = {
    small: "w-32 h-36",
    medium: "w-40 h-44",
    large: "w-48 h-56",
  };

  return (
    <div className="relative w-full h-[768px] bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.8),transparent_50%)]"></div>

      {/* Center text card */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white p-8 rounded-lg shadow-2xl transform rotate-1 z-20">
        <div className="text-center space-y-3">
          <p className="text-5xl font-bold text-gray-800">2025</p>
          <h2 className="text-3xl font-serif font-light text-gray-700">
            Guided Vision Board
          </h2>
          <p className="text-sm text-gray-500 italic">
            affirmations included ♡
          </p>
          <div className="mt-4 space-y-1">
            {keywords.slice(0, 3).map((keyword, idx) => (
              <p
                key={idx}
                className="text-xs font-medium text-gray-600 uppercase tracking-wide"
              >
                {keyword}
              </p>
            ))}
          </div>
        </div>
      </div>

      {/* Polaroid images scattered */}
      {images.slice(0, 9).map((image, idx) => {
        const pos = polaroidPositions[idx] || polaroidPositions[0];
        const sizeClass =
          sizeClasses[pos.size as keyof typeof sizeClasses] || sizeClasses.medium;

        return (
          <div
            key={idx}
            className={`absolute ${sizeClass} bg-white p-2 shadow-2xl hover:shadow-3xl transition-shadow duration-300 cursor-pointer`}
            style={{
              ...pos,
              transform: `rotate(${pos.rotate})`,
              zIndex: idx < 5 ? 10 : 5,
            }}
          >
            {/* Polaroid photo */}
            <div className="w-full h-[75%] bg-gray-200 overflow-hidden">
              <img
                src={image}
                alt={`Vision ${idx + 1}`}
                className="w-full h-full object-cover"
              />
            </div>
            {/* Polaroid caption area */}
            <div className="w-full h-[25%] flex items-center justify-center">
              <p className="text-[10px] font-handwriting text-gray-700">
                {keywords[idx] || `Goal ${idx + 1}`}
              </p>
            </div>
          </div>
        );
      })}

      {/* Optional 10th image */}
      {images[9] && (
        <div
          className="absolute top-[45%] left-[20%] w-36 h-40 bg-white p-2 shadow-2xl transform rotate-15"
          style={{ zIndex: 15 }}
        >
          <div className="w-full h-[75%] bg-gray-200 overflow-hidden">
            <img
              src={images[9]}
              alt="Vision 10"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="w-full h-[25%] flex items-center justify-center">
            <p className="text-[10px] font-handwriting text-gray-700">
              {keywords[9] || "Bonus"}
            </p>
          </div>
        </div>
      )}

      {/* Decorative elements */}
      <div className="absolute top-[15%] right-[30%] text-4xl transform rotate-12 z-0">
        ✨
      </div>
      <div className="absolute bottom-[20%] left-[25%] text-4xl transform -rotate-12 z-0">
        💫
      </div>
      <div className="absolute top-[60%] right-[15%] text-3xl transform rotate-45 z-0">
        ⭐
      </div>
    </div>
  );
}
