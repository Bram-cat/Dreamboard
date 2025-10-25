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

  // Densely packed polaroid grid - completely fills canvas with 15 polaroids
  const polaroidPositions = [
    // Top row - 5 polaroids across entire width
    { top: "1%", left: "1%", rotate: "-8deg", size: "small", zIndex: 12 },
    { top: "2%", left: "19%", rotate: "5deg", size: "small", zIndex: 11 },
    { top: "0%", left: "38%", rotate: "-3deg", size: "small", zIndex: 10 },
    { top: "2%", left: "57%", rotate: "7deg", size: "small", zIndex: 13 },
    { top: "1%", left: "76%", rotate: "-5deg", size: "small", zIndex: 9 },

    // Upper-middle row - 5 polaroids (left side, skip center for card, right side)
    { top: "23%", left: "0%", rotate: "6deg", size: "small", zIndex: 8 },
    { top: "24%", left: "18%", rotate: "-9deg", size: "small", zIndex: 7 },
    { top: "22%", left: "58%", rotate: "8deg", size: "small", zIndex: 14 },
    { top: "23%", left: "76%", rotate: "-4deg", size: "small", zIndex: 6 },
    { top: "24%", left: "37%", rotate: "3deg", size: "small", zIndex: 16 },

    // Bottom row - 5 polaroids to densely fill bottom including bottom-left corner
    { bottom: "1%", left: "0%", rotate: "7deg", size: "small", zIndex: 2 },
    { bottom: "2%", left: "18%", rotate: "-6deg", size: "small", zIndex: 1 },
    { bottom: "0%", left: "37%", rotate: "4deg", size: "small", zIndex: 4 },
    { bottom: "1%", left: "57%", rotate: "-8deg", size: "small", zIndex: 3 },
    { bottom: "2%", left: "76%", rotate: "5deg", size: "small", zIndex: 5 },
  ];

  const sizeClasses = {
    small: "w-32 h-40",
    medium: "w-36 h-44",
  };

  return (
    <div className="relative w-full h-[768px] bg-gradient-to-br from-slate-100 via-stone-50 to-neutral-100 overflow-hidden">
      {/* Subtle background texture */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(255,255,255,0.9),transparent_70%)]"></div>

      {/* Center text card - compact design without keywords */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white px-8 py-6 rounded-sm shadow-2xl transform -rotate-2 z-30 border-4 border-white">
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
              ...(pos.top && { top: pos.top }),
              ...(pos.left !== undefined && { left: pos.left }),
              ...(pos.bottom && { bottom: pos.bottom }),
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
            {/* Polaroid caption area - left empty for clean look */}
            <div className="w-full h-[20%] flex items-center justify-center">
              <p className="text-xs text-gray-700" style={{ fontFamily: 'cursive' }}>
                {/* No caption - clean aesthetic */}
              </p>
            </div>
          </div>
        );
      })}

      {/* Quote boxes positioned strategically between polaroids */}
      {selectedQuotes[0] && (
        <div className="absolute top-[46%] left-[9%] bg-white/98 backdrop-blur-sm px-4 py-3 shadow-2xl transform rotate-2 z-25 max-w-[140px] border-2 border-white">
          <p className="text-xs font-serif italic text-gray-900 leading-relaxed text-center">{selectedQuotes[0]}</p>
        </div>
      )}

      {selectedQuotes[1] && (
        <div className="absolute bottom-[23%] right-[10%] bg-rose-50/98 backdrop-blur-sm px-4 py-3 shadow-2xl transform -rotate-3 z-25 max-w-[130px] border-2 border-white">
          <p className="text-xs font-light text-gray-800 leading-relaxed text-center tracking-wide">{selectedQuotes[1]}</p>
        </div>
      )}

      {selectedQuotes[2] && (
        <div className="absolute bottom-[22%] left-[39%] bg-amber-50/98 backdrop-blur-sm px-4 py-2 shadow-2xl transform rotate-4 z-25 max-w-[120px] border-2 border-white">
          <p className="text-xs font-medium text-gray-800 leading-tight text-center">{selectedQuotes[2]}</p>
        </div>
      )}

      {selectedQuotes[3] && (
        <div className="absolute top-[45%] right-[9%] bg-stone-50/98 backdrop-blur-sm px-4 py-2 shadow-2xl transform -rotate-5 z-25 max-w-[130px] border-2 border-white">
          <p className="text-xs font-serif italic text-gray-900 leading-relaxed text-center">{selectedQuotes[3]}</p>
        </div>
      )}
    </div>
  );
}
