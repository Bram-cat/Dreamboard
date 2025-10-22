"use client";

import { useRef } from "react";
import html2canvas from "html2canvas";

interface Image {
  url: string;
  keyword: string;
  source: string;
}

interface PolaroidCollageProps {
  images: Image[];
  userKeywords: string[];
}

export default function PolaroidCollage({ images, userKeywords }: PolaroidCollageProps) {
  const collageRef = useRef<HTMLDivElement>(null);

  const handleDownload = async () => {
    if (!collageRef.current) return;

    try {
      const canvas = await html2canvas(collageRef.current, {
        backgroundColor: "#F5F1E8",
        scale: 2, // Higher quality
        logging: false,
        useCORS: true, // Allow cross-origin images
      });

      const link = document.createElement("a");
      link.download = "vision-board-2025.png";
      link.href = canvas.toDataURL("image/png");
      link.click();
    } catch (error) {
      console.error("Failed to download collage:", error);
      alert("Failed to download. Please try again.");
    }
  };

  // Define polaroid positions, rotations, and sizes
  const polaroidStyles = [
    { top: "5%", left: "5%", rotate: "-5deg", size: "280px", zIndex: 10 },
    { top: "8%", left: "25%", rotate: "3deg", size: "320px", zIndex: 15 },
    { top: "5%", left: "50%", rotate: "-2deg", size: "300px", zIndex: 12 },
    { top: "10%", left: "75%", rotate: "4deg", size: "260px", zIndex: 8 },

    { top: "30%", left: "8%", rotate: "6deg", size: "300px", zIndex: 14 },
    { top: "28%", left: "32%", rotate: "-4deg", size: "280px", zIndex: 11 },
    { top: "32%", left: "55%", rotate: "2deg", size: "320px", zIndex: 16 },
    { top: "35%", left: "78%", rotate: "-3deg", size: "270px", zIndex: 9 },

    { top: "55%", left: "5%", rotate: "-3deg", size: "290px", zIndex: 13 },
    { top: "58%", left: "28%", rotate: "5deg", size: "310px", zIndex: 17 },
    { top: "60%", left: "52%", rotate: "-6deg", size: "280px", zIndex: 10 },
    { top: "55%", left: "75%", rotate: "2deg", size: "300px", zIndex: 12 },

    { top: "80%", left: "10%", rotate: "4deg", size: "270px", zIndex: 8 },
    { top: "82%", left: "35%", rotate: "-2deg", size: "290px", zIndex: 14 },
    { top: "78%", left: "60%", rotate: "3deg", size: "260px", zIndex: 11 },
  ];

  return (
    <div className="relative">
      {/* Collage Container */}
      <div
        ref={collageRef}
        className="relative w-full overflow-hidden rounded-lg shadow-2xl"
        style={{
          backgroundColor: "#F5F1E8", // Beige background like sample1.png
          aspectRatio: "16/9",
          minHeight: "768px",
        }}
      >
        {/* Text Overlays (like sample1.png) */}
        <div className="absolute top-8 left-8 z-50">
          <h1 className="text-6xl font-black text-purple-900 tracking-tight drop-shadow-lg">
            VISION BOARD
          </h1>
          <p className="text-3xl font-bold text-pink-600 mt-2">2025</p>
        </div>

        <div className="absolute top-8 right-8 z-50 text-right">
          <p className="text-2xl font-bold text-purple-800">{images.length}+ ELEMENTS</p>
          <p className="text-xl font-semibold text-gray-700 mt-1">
            {userKeywords.slice(0, 3).join(" • ").toUpperCase()}
          </p>
        </div>

        {/* User Keywords as Text Labels */}
        <div className="absolute bottom-8 left-8 z-50">
          <div className="flex flex-wrap gap-3">
            {userKeywords.slice(0, 5).map((keyword, index) => (
              <div
                key={index}
                className="px-4 py-2 bg-white/90 rounded-full shadow-md"
              >
                <p className="text-sm font-bold text-purple-900 uppercase tracking-wide">
                  {keyword}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Polaroid Images */}
        {images.map((image, index) => {
          const style = polaroidStyles[index % polaroidStyles.length];

          return (
            <div
              key={index}
              className="absolute"
              style={{
                top: style.top,
                left: style.left,
                transform: `rotate(${style.rotate})`,
                zIndex: style.zIndex,
                width: style.size,
              }}
            >
              {/* Polaroid Frame */}
              <div
                className="bg-white p-3 shadow-2xl"
                style={{
                  boxShadow: "0 10px 30px rgba(0,0,0,0.3)",
                }}
              >
                {/* Image */}
                <div className="relative" style={{ aspectRatio: "1/1" }}>
                  <img
                    src={image.url}
                    alt={image.keyword}
                    className="w-full h-full object-cover"
                    crossOrigin="anonymous"
                  />
                </div>

                {/* Polaroid Caption */}
                <div className="mt-3 text-center">
                  <p className="text-xs font-handwriting text-gray-800 truncate">
                    {image.keyword}
                  </p>
                </div>
              </div>
            </div>
          );
        })}

        {/* Additional decorative text overlays */}
        <div className="absolute bottom-8 right-8 z-50 text-right">
          <p className="text-lg font-bold text-purple-700 italic">
            &ldquo;Dream it. Believe it. Achieve it.&rdquo;
          </p>
        </div>
      </div>

      {/* Download Button */}
      <button
        onClick={handleDownload}
        className="absolute top-4 right-4 z-50 bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 shadow-lg"
      >
        📥 Download Vision Board
      </button>
    </div>
  );
}
