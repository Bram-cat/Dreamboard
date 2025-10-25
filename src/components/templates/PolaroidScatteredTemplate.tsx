"use client";

import React from "react";

interface PolaroidScatteredTemplateProps {
  images: string[]; // 12-15 images
  keywords: string[];
}

export default function PolaroidScatteredTemplate({
  images,
  keywords,
}: PolaroidScatteredTemplateProps) {
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

  // Densely packed polaroid positions - tighter spacing, more overlap
  const polaroidPositions = [
    { top: "1%", left: "1%", rotate: "-8deg", size: "medium", zIndex: 12 },
    { top: "2%", left: "20%", rotate: "5deg", size: "medium", zIndex: 11 },
    { top: "0%", left: "40%", rotate: "-12deg", size: "medium", zIndex: 10 },
    { top: "3%", right: "18%", rotate: "8deg", size: "medium", zIndex: 13 },
    { top: "1%", right: "1%", rotate: "-5deg", size: "medium", zIndex: 9 },
    { top: "25%", left: "0%", rotate: "7deg", size: "medium", zIndex: 8 },
    { top: "27%", left: "19%", rotate: "-10deg", size: "medium", zIndex: 7 },
    { top: "26%", right: "19%", rotate: "12deg", size: "medium", zIndex: 14 },
    { top: "24%", right: "0%", rotate: "-6deg", size: "medium", zIndex: 6 },
    { bottom: "23%", left: "0%", rotate: "-15deg", size: "medium", zIndex: 5 },
    { bottom: "25%", left: "18%", rotate: "8deg", size: "medium", zIndex: 4 },
    { bottom: "24%", right: "0%", rotate: "-8deg", size: "medium", zIndex: 15 },
    { bottom: "1%", left: "2%", rotate: "10deg", size: "medium", zIndex: 3 },
    { bottom: "0%", left: "22%", rotate: "-7deg", size: "medium", zIndex: 2 },
    { bottom: "2%", right: "1%", rotate: "6deg", size: "medium", zIndex: 1 },
  ];

  const sizeClasses = {
    small: "w-36 h-40",
    medium: "w-40 h-48",
  };

  return (
    <div className="relative w-full h-[768px] bg-gradient-to-br from-slate-100 via-stone-50 to-neutral-100 overflow-hidden">
      {/* Subtle background texture */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(255,255,255,0.9),transparent_70%)]"></div>

      {/* Center text card - compact design */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white px-8 py-6 rounded-sm shadow-2xl transform -rotate-2 z-20 border-4 border-white">
        <div className="text-center space-y-2">
          <p className="text-xs font-medium text-gray-500 uppercase tracking-widest">800+</p>
          <p className="text-sm font-bold text-gray-600">elements</p>
          <p className="text-3xl font-light text-gray-800 italic" style={{ fontFamily: 'Georgia, serif' }}>2025</p>
          <h2 className="text-4xl font-serif font-normal text-gray-900 leading-tight">
            Guided<br/>Vision board
          </h2>
          <p className="text-sm text-gray-600" style={{ fontFamily: 'cursive' }}>
            affirmations included ♡
          </p>
        </div>
      </div>

      {/* Polaroid images - densely scattered to fill all space */}
      {images.slice(0, 15).map((image, idx) => {
        const pos = polaroidPositions[idx] || polaroidPositions[0];
        const sizeClass =
          sizeClasses[pos.size as keyof typeof sizeClasses] || sizeClasses.medium;

        return (
          <div
            key={idx}
            className={`absolute ${sizeClass} bg-white p-3 shadow-xl hover:shadow-2xl transition-all duration-300 cursor-pointer`}
            style={{
              top: pos.top,
              left: pos.left,
              right: pos.right,
              bottom: pos.bottom,
              transform: `rotate(${pos.rotate})`,
              zIndex: pos.zIndex,
            }}
          >
            {/* Polaroid photo */}
            <div className="w-full h-[80%] bg-gray-100 overflow-hidden">
              <img
                src={image}
                alt={`Vision ${idx + 1}`}
                className="w-full h-full object-cover"
              />
            </div>
            {/* Polaroid caption area */}
            <div className="w-full h-[20%] flex items-center justify-center">
              <p className="text-xs text-gray-700" style={{ fontFamily: 'cursive' }}>
                {keywords[idx] || ""}
              </p>
            </div>
          </div>
        );
      })}

      {/* Quote boxes positioned strategically - big and visible */}
      {selectedQuotes[0] && (
        <div className="absolute bottom-[48%] right-[38%] bg-white/98 backdrop-blur-sm px-6 py-4 shadow-2xl transform rotate-2 z-25 max-w-[220px] border-2 border-white">
          <p className="text-base font-serif italic text-gray-900 leading-relaxed text-center">{selectedQuotes[0]}</p>
        </div>
      )}

      {selectedQuotes[1] && (
        <div className="absolute bottom-[5%] right-[35%] bg-rose-50/98 backdrop-blur-sm px-5 py-3 shadow-2xl transform -rotate-3 z-25 max-w-[200px] border-2 border-white">
          <p className="text-sm font-light text-gray-800 leading-relaxed text-center tracking-wide">{selectedQuotes[1]}</p>
        </div>
      )}

      {selectedQuotes[2] && (
        <div className="absolute top-[48%] left-[40%] bg-amber-50/98 backdrop-blur-sm px-5 py-3 shadow-2xl transform rotate-4 z-25 max-w-[180px] border-2 border-white">
          <p className="text-sm font-medium text-gray-800 leading-tight text-center">{selectedQuotes[2]}</p>
        </div>
      )}

      {selectedQuotes[3] && (
        <div className="absolute bottom-[48%] left-[5%] bg-stone-50/98 backdrop-blur-sm px-5 py-3 shadow-2xl transform -rotate-5 z-25 max-w-[190px] border-2 border-white">
          <p className="text-sm font-serif italic text-gray-900 leading-relaxed text-center">{selectedQuotes[3]}</p>
        </div>
      )}
    </div>
  );
}
