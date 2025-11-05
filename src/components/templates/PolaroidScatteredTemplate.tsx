"use client";

import React from "react";

interface PolaroidScatteredTemplateProps {
  images: string[]; // 14 images (7 DALL-E + 7 Gemini)
  keywords: string[];
}

export default function PolaroidScatteredTemplate({
  images,
  keywords,
}: PolaroidScatteredTemplateProps) {
  // Positions for 14 images - Magazine collage style like sample.png
  // Reference: sample.png shows tight collage with images filling entire canvas
  // Canvas: 1344x768, Center card takes middle area
  // Layout: Images arranged in a collage grid around center card
  const polaroidPositions = [
    // TOP LEFT CORNER (3 images)
    { top: 5, left: 5, rotate: -4, width: 200, height: 240, zIndex: 12, keyword: keywords[0] },
    { top: 15, left: 220, rotate: 6, width: 180, height: 210, zIndex: 11, keyword: "" },
    { top: 5, left: 415, rotate: -3, width: 190, height: 230, zIndex: 10, keyword: keywords[1] },

    // TOP RIGHT CORNER (3 images)
    { top: 10, left: 750, rotate: 4, width: 195, height: 235, zIndex: 13, keyword: "" },
    { top: 8, left: 960, rotate: -5, width: 185, height: 220, zIndex: 12, keyword: keywords[2] },
    { top: 15, left: 1160, rotate: 3, width: 175, height: 200, zIndex: 11, keyword: "" },

    // MIDDLE LEFT (2 images)
    { top: 270, left: 10, rotate: 5, width: 190, height: 230, zIndex: 9, keyword: "" },
    { top: 280, left: 215, rotate: -4, width: 180, height: 215, zIndex: 8, keyword: keywords[3] },

    // MIDDLE RIGHT (2 images)
    { top: 275, left: 950, rotate: -6, width: 185, height: 225, zIndex: 10, keyword: "" },
    { top: 285, left: 1150, rotate: 4, width: 175, height: 210, zIndex: 9, keyword: keywords[4] },

    // BOTTOM LEFT CORNER (2 images)
    { top: 520, left: 5, rotate: -5, width: 200, height: 240, zIndex: 7, keyword: "" },
    { top: 530, left: 220, rotate: 7, width: 190, height: 225, zIndex: 6, keyword: "" },

    // BOTTOM RIGHT CORNER (3 images)
    { top: 525, left: 750, rotate: -4, width: 180, height: 220, zIndex: 8, keyword: "" },
    { top: 520, left: 945, rotate: 5, width: 195, height: 240, zIndex: 7, keyword: "" },
  ];

  // Quotes positioned between images
  const quotePositions = [
    { top: 160, left: 900, text: keywords[0] || "I am worthy of my dreams", color: "purple" },
    { top: 430, left: 350, text: keywords[1] || "Every day I grow stronger", color: "rose" },
    { top: 200, left: 100, text: keywords[2] || "My potential is limitless", color: "amber" },
    { top: 480, left: 700, text: keywords[3] || "I create my own reality", color: "blue" },
  ];

  return (
    <div className="relative w-[1344px] h-[768px] overflow-hidden" style={{ backgroundColor: '#ffffff' }}>
      {/* Clean white background like sample5.jpg - no gradients to avoid oklch errors */}

      {/* CENTER CARD - "2025 Guided Vision Board" */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white px-12 py-8 rounded-sm shadow-2xl transform -rotate-1 z-30 border-4 border-white">
        <div className="text-center space-y-2">
          <p className="text-xs font-medium text-gray-500 uppercase tracking-widest">800+</p>
          <p className="text-sm font-bold text-gray-600">elements</p>
          <p className="text-5xl font-light text-gray-800 italic" style={{ fontFamily: 'Georgia, serif' }}>2025</p>
          <h2 className="text-5xl font-serif font-normal text-gray-900 leading-tight mt-2">
            Guided<br/>Vision board
          </h2>
          <p className="text-base text-gray-600 mt-3" style={{ fontFamily: 'cursive' }}>
            affirmations included ♡
          </p>
        </div>
      </div>

      {/* POLAROID IMAGES - 14 images in magazine collage style */}
      {images.slice(0, 14).map((image, idx) => {
        const pos = polaroidPositions[idx];
        if (!pos) return null;

        return (
          <div
            key={idx}
            className="absolute bg-white p-3 shadow-xl hover:shadow-2xl transition-all duration-300"
            style={{
              top: `${pos.top}px`,
              left: `${pos.left}px`,
              width: `${pos.width}px`,
              height: `${pos.height}px`,
              transform: `rotate(${pos.rotate}deg)`,
              zIndex: pos.zIndex,
            }}
          >
            {/* Photo area - 85% of height */}
            <div
              className="w-full bg-gray-100 overflow-hidden relative"
              style={{ height: `${pos.height * 0.85 - 24}px` }}
            >
              <img
                src={image}
                alt={`Vision ${idx + 1}`}
                className="w-full h-full object-cover"
              />
              {/* Overlay keyword directly ON image like sample.png */}
              {pos.keyword && (
                <div className="absolute bottom-2 left-2 right-2 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-md">
                  <p className="text-sm font-medium text-gray-800 text-center" style={{ fontFamily: 'Arial, sans-serif' }}>
                    {pos.keyword}
                  </p>
                </div>
              )}
            </div>
            {/* Caption area - 15% of height, empty for clean look */}
            <div
              className="w-full flex items-center justify-center"
              style={{ height: `${pos.height * 0.15}px` }}
            >
              {/* Empty for polaroid aesthetic */}
            </div>
          </div>
        );
      })}

      {/* QUOTE BOXES - positioned between images */}
      {quotePositions.slice(0, Math.min(4, keywords.length)).map((quote, idx) => {
        const colors = {
          purple: { bg: "#f3e8ff", border: "#d8b4fe", dot: "#c084fc" },
          rose: { bg: "#ffe4e6", border: "#fda4af", dot: "#fb7185" },
          amber: { bg: "#fef3c7", border: "#fcd34d", dot: "#f59e0b" },
          blue: { bg: "#dbeafe", border: "#93c5fd", dot: "#60a5fa" },
        };
        const colorScheme = colors[quote.color as keyof typeof colors] || colors.purple;

        return (
          <div
            key={`quote-${idx}`}
            className="absolute px-5 py-3 shadow-lg transform z-25 max-w-[160px] rounded-lg"
            style={{
              backgroundColor: colorScheme.bg,
              borderWidth: '2px',
              borderColor: colorScheme.border,
              top: `${quote.top}px`,
              left: `${quote.left}px`,
              rotate: `${Math.random() > 0.5 ? '' : '-'}${Math.floor(Math.random() * 8 + 2)}deg`,
            }}
          >
            <div className="absolute -top-2 -left-2 w-3 h-3 rounded-full" style={{ backgroundColor: colorScheme.dot }}></div>
            <p className="text-sm font-medium leading-snug text-center" style={{ fontFamily: 'cursive', color: '#1f2937' }}>
              {quote.text}
            </p>
          </div>
        );
      })}

      {/* Decorative elements like sample5.jpg */}
      <div className="absolute top-[140px] left-[520px] text-4xl z-4 opacity-70">✨</div>
      <div className="absolute top-[420px] right-[280px] text-3xl z-4 opacity-60">⭐</div>
      <div className="absolute bottom-[120px] left-[380px] text-3xl z-4 opacity-60">🌸</div>
      <div className="absolute top-[260px] right-[120px] text-2xl z-4 opacity-70">💫</div>
    </div>
  );
}
