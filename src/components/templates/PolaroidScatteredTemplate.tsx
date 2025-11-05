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
  // BIGGER polaroids filling more space, matching sample.png aesthetic
  const polaroidPositions = [
    // TOP LEFT CORNER (3 images) - BIGGER sizes
    { top: 5, left: 5, rotate: -3, width: 240, height: 280, zIndex: 12, keyword: keywords[0] },
    { top: 20, left: 260, rotate: 4, width: 220, height: 260, zIndex: 11, keyword: "" },
    { top: 10, left: 495, rotate: -2, width: 230, height: 270, zIndex: 10, keyword: keywords[1] },

    // TOP RIGHT CORNER (3 images) - BIGGER sizes
    { top: 15, left: 740, rotate: 3, width: 225, height: 265, zIndex: 13, keyword: "" },
    { top: 5, left: 980, rotate: -4, width: 235, height: 275, zIndex: 12, keyword: keywords[2] },
    { top: 20, left: 1230, rotate: 2, width: 210, height: 250, zIndex: 11, keyword: "" },

    // MIDDLE LEFT (2 images) - BIGGER sizes
    { top: 300, left: 10, rotate: 4, width: 230, height: 270, zIndex: 9, keyword: "" },
    { top: 310, left: 255, rotate: -3, width: 220, height: 260, zIndex: 8, keyword: keywords[3] },

    // MIDDLE RIGHT (2 images) - BIGGER sizes
    { top: 305, left: 985, rotate: -4, width: 225, height: 265, zIndex: 10, keyword: "" },
    { top: 315, left: 1225, rotate: 3, width: 215, height: 255, zIndex: 9, keyword: keywords[4] },

    // BOTTOM LEFT CORNER (2 images) - BIGGER sizes
    { top: 580, left: 5, rotate: -4, width: 240, height: 280, zIndex: 7, keyword: "" },
    { top: 590, left: 260, rotate: 5, width: 230, height: 270, zIndex: 6, keyword: "" },

    // BOTTOM RIGHT CORNER (2 images) - BIGGER sizes + 14th image added!
    { top: 585, left: 800, rotate: -3, width: 220, height: 260, zIndex: 8, keyword: "" },
    { top: 575, left: 1035, rotate: 4, width: 235, height: 275, zIndex: 7, keyword: "" },
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
                className="w-full h-full object-contain"
                style={{ objectFit: 'contain' }}
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

      {/* QUOTE BOXES - positioned between images - using only hex colors to avoid oklch error */}
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
            className="absolute z-25"
            style={{
              backgroundColor: colorScheme.bg,
              borderWidth: '2px',
              borderStyle: 'solid',
              borderColor: colorScheme.border,
              borderRadius: '8px',
              padding: '12px 20px',
              maxWidth: '160px',
              boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
              top: `${quote.top}px`,
              left: `${quote.left}px`,
              transform: `rotate(${Math.random() > 0.5 ? '' : '-'}${Math.floor(Math.random() * 8 + 2)}deg)`,
            }}
          >
            <div
              style={{
                position: 'absolute',
                top: '-8px',
                left: '-8px',
                width: '12px',
                height: '12px',
                borderRadius: '50%',
                backgroundColor: colorScheme.dot
              }}
            ></div>
            <p style={{
              fontSize: '14px',
              fontWeight: '500',
              lineHeight: '1.375',
              textAlign: 'center',
              fontFamily: 'cursive',
              color: '#1f2937',
              margin: 0
            }}>
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
