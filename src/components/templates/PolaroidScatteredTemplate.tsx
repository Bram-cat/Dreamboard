"use client";

import React from "react";

interface PolaroidScatteredTemplateProps {
  images: string[]; // 10 images
  keywords: string[];
}

export default function PolaroidScatteredTemplate({
  images,
  keywords,
}: PolaroidScatteredTemplateProps) {
  // Positions for 10 images - LARGER sizes to fill canvas, evenly distributed across 1344x768
  // Reference: sample5.jpg shows images in all quadrants
  // Increased sizes from 150-240px to 280-400px to eliminate empty space
  const polaroidPositions = [
    // TOP LEFT quadrant (2 images) - LARGER
    { top: 10, left: 30, rotate: -8, width: 320, height: 260, zIndex: 12 },
    { top: 60, left: 350, rotate: 12, width: 300, height: 240, zIndex: 11 },

    // TOP CENTER quadrant (2 images) - LARGER
    { top: 5, left: 640, rotate: -5, width: 340, height: 280, zIndex: 13 },
    { top: 70, left: 950, rotate: 8, width: 290, height: 230, zIndex: 10 },

    // TOP RIGHT quadrant (1 image) - LARGER
    { top: 15, left: 1000, rotate: -10, width: 310, height: 250, zIndex: 14 },

    // MIDDLE LEFT (1 image) - LARGER
    { top: 300, left: 20, rotate: 6, width: 330, height: 270, zIndex: 9 },

    // MIDDLE RIGHT (1 image) - LARGER
    { top: 320, left: 1000, rotate: -7, width: 300, height: 240, zIndex: 8 },

    // BOTTOM LEFT quadrant (1 image) - LARGER
    { top: 480, left: 60, rotate: -10, width: 320, height: 260, zIndex: 7 },

    // BOTTOM CENTER quadrant (1 image) - LARGER
    { top: 470, left: 520, rotate: 5, width: 340, height: 280, zIndex: 6 },

    // BOTTOM RIGHT quadrant (1 image) - LARGER
    { top: 460, left: 850, rotate: -6, width: 310, height: 250, zIndex: 5 },
  ];

  // Quotes positioned between images
  const quotePositions = [
    { top: 160, left: 900, text: keywords[0] || "I am worthy of my dreams", color: "purple" },
    { top: 430, left: 350, text: keywords[1] || "Every day I grow stronger", color: "rose" },
    { top: 200, left: 100, text: keywords[2] || "My potential is limitless", color: "amber" },
    { top: 480, left: 700, text: keywords[3] || "I create my own reality", color: "blue" },
  ];

  return (
    <div className="relative w-[1344px] h-[768px] bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 overflow-hidden">
      {/* Subtle texture */}
      <div className="absolute inset-0 opacity-30 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0iIzAwMCIgc3Ryb2tlLXdpZHRoPSIwLjUiIG9wYWNpdHk9IjAuMSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNncmlkKSIvPjwvc3ZnPg==')]"></div>

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

      {/* POLAROID IMAGES - 10 images distributed across entire canvas */}
      {images.slice(0, 10).map((image, idx) => {
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
              className="w-full bg-gray-100 overflow-hidden"
              style={{ height: `${pos.height * 0.85 - 24}px` }}
            >
              <img
                src={image}
                alt={`Vision ${idx + 1}`}
                className="w-full h-full object-cover"
              />
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
          purple: { bg: "from-purple-50 to-white", border: "border-purple-300", dot: "bg-purple-400" },
          rose: { bg: "from-rose-50 to-white", border: "border-rose-300", dot: "bg-rose-400" },
          amber: { bg: "from-amber-50 to-white", border: "border-amber-300", dot: "bg-amber-400" },
          blue: { bg: "from-blue-50 to-white", border: "border-blue-300", dot: "bg-blue-400" },
        };
        const colorScheme = colors[quote.color as keyof typeof colors] || colors.purple;

        return (
          <div
            key={`quote-${idx}`}
            className={`absolute bg-gradient-to-br ${colorScheme.bg} backdrop-blur-sm px-5 py-3 shadow-lg transform z-25 max-w-[160px] border-2 ${colorScheme.border} rounded-lg`}
            style={{
              top: `${quote.top}px`,
              left: `${quote.left}px`,
              rotate: `${Math.random() > 0.5 ? '' : '-'}${Math.floor(Math.random() * 8 + 2)}deg`,
            }}
          >
            <div className={`absolute -top-2 -left-2 w-3 h-3 ${colorScheme.dot} rounded-full`}></div>
            <p className="text-sm font-medium text-gray-800 leading-snug text-center" style={{ fontFamily: 'cursive' }}>
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
