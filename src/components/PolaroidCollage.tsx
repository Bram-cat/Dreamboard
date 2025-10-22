"use client";

import { useRef } from "react";
import html2canvas from "html2canvas";

interface Image {
  url: string;
  keyword: string;
  source?: string;
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
        scale: 2,
        logging: false,
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

  // Smaller polaroid positions with MINIMAL overlap (75% visibility)
  // Positions are spread out more, smaller sizes (180-220px)
  const polaroidStyles = [
    { top: "8%", left: "6%", rotate: "-4deg", size: "200px", zIndex: 5 },
    { top: "12%", left: "35%", rotate: "3deg", size: "220px", zIndex: 8 },
    { top: "8%", left: "65%", rotate: "-2deg", size: "210px", zIndex: 6 },

    { top: "38%", left: "12%", rotate: "5deg", size: "190px", zIndex: 7 },
    { top: "42%", left: "45%", rotate: "-3deg", size: "200px", zIndex: 9 },
    { top: "40%", left: "72%", rotate: "2deg", size: "180px", zIndex: 4 },

    { top: "68%", left: "8%", rotate: "-2deg", size: "210px", zIndex: 6 },
    { top: "70%", left: "38%", rotate: "4deg", size: "195px", zIndex: 5 },
    { top: "68%", left: "68%", rotate: "-4deg", size: "200px", zIndex: 7 },
  ];

  // Affirmation texts like sample3.png
  const affirmations = [
    "Money flows to me effortlessly",
    "I am capable of amazing things",
    "Dream it. Believe it. Achieve it.",
    "I attract abundance",
    "Success is my birthright",
  ];

  return (
    <div className="relative">
      {/* Collage Container */}
      <div
        ref={collageRef}
        className="relative w-full overflow-hidden rounded-lg shadow-2xl"
        style={{
          backgroundColor: "#F5F1E8",
          aspectRatio: "16/9",
          minHeight: "768px",
        }}
      >
        {/* Large "2025" in center - handwritten style */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-1">
          <h1
            className="text-9xl font-bold text-gray-300 opacity-40"
            style={{ fontFamily: "'Brush Script MT', cursive" }}
          >
            2025
          </h1>
        </div>

        {/* "VISION BOARD" title - handwritten */}
        <div className="absolute top-6 left-6 z-50">
          <h2
            className="text-4xl font-bold text-purple-800"
            style={{ fontFamily: "'Brush Script MT', cursive" }}
          >
            VISION BOARD
          </h2>
        </div>

        {/* User Keywords - handwritten style */}
        <div className="absolute top-6 right-6 z-50 text-right">
          {userKeywords.slice(0, 3).map((keyword, index) => (
            <p
              key={index}
              className="text-lg font-semibold text-purple-700 capitalize"
              style={{ fontFamily: "'Brush Script MT', cursive" }}
            >
              {keyword}
            </p>
          ))}
        </div>

        {/* Polaroid Images - SMALLER and LESS OVERLAPPING */}
        {images.slice(0, 9).map((image, index) => {
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
                className="bg-white p-2 shadow-lg"
                style={{
                  boxShadow: "0 4px 15px rgba(0,0,0,0.2)",
                }}
              >
                {/* Image */}
                <div className="relative" style={{ aspectRatio: "1/1" }}>
                  <img
                    src={image.url}
                    alt={image.keyword}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Handwritten caption below image */}
                <div className="mt-2 text-center px-1">
                  <p
                    className="text-xs text-gray-800 capitalize"
                    style={{ fontFamily: "'Brush Script MT', cursive" }}
                  >
                    {image.keyword}
                  </p>
                </div>
              </div>
            </div>
          );
        })}

        {/* Affirmation texts scattered around - handwritten */}
        <div className="absolute bottom-12 left-8 z-50">
          <p
            className="text-lg font-semibold text-purple-800 italic"
            style={{ fontFamily: "'Brush Script MT', cursive" }}
          >
            {affirmations[0]}
          </p>
        </div>

        <div className="absolute bottom-12 right-8 z-50 text-right">
          <p
            className="text-lg font-semibold text-purple-800 italic"
            style={{ fontFamily: "'Brush Script MT', cursive" }}
          >
            {affirmations[2]}
          </p>
        </div>

        <div className="absolute top-48 left-1/2 transform -translate-x-1/2 z-2">
          <p
            className="text-base font-medium text-gray-600 italic"
            style={{ fontFamily: "'Brush Script MT', cursive" }}
          >
            {affirmations[3]}
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
