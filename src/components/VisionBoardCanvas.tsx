"use client";

import React, { useRef } from "react";
import BoardElement from "./BoardElement";

interface BoardElementData {
  id: string;
  type: "person" | "lifestyle" | "quote";
  imageUrl: string;
  description: string;
  size?: "small" | "medium" | "large";
  position?: { row: number; col: number };
}

interface VisionBoardCanvasProps {
  elements: BoardElementData[];
  onElementClick?: (id: string) => void;
  onDownload?: () => void;
}

export default function VisionBoardCanvas({
  elements,
  onElementClick,
  onDownload,
}: VisionBoardCanvasProps) {
  const canvasRef = useRef<HTMLDivElement>(null);

  const handleDownload = () => {
    if (onDownload) {
      onDownload();
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto">
      {/* Download button */}
      <div className="flex justify-end mb-4">
        <button
          onClick={handleDownload}
          className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
        >
          Download Vision Board
        </button>
      </div>

      {/* Vision Board Canvas */}
      <div
        ref={canvasRef}
        className="relative w-full bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 p-8 rounded-2xl shadow-2xl"
        style={{
          minHeight: "768px",
        }}
      >
        {/* Masonry-style grid layout */}
        <div className="flex flex-wrap gap-4 justify-center items-start">
          {elements.map((element) => (
            <BoardElement
              key={element.id}
              id={element.id}
              type={element.type}
              imageUrl={element.imageUrl}
              description={element.description}
              size={element.size}
              position={element.position}
              onElementClick={onElementClick}
            />
          ))}
        </div>

        {/* Watermark */}
        <div className="absolute bottom-4 right-4 opacity-70">
          <div className="text-white text-xl font-bold drop-shadow-lg">
            DreamBoard
          </div>
          <div className="text-white text-xs drop-shadow-lg">
            Free Version - Upgrade for HD
          </div>
        </div>
      </div>

      {/* Info */}
      <div className="mt-4 text-center text-sm text-gray-600">
        <p>
          Click on any element to edit (coming soon) • {elements.length} elements
        </p>
      </div>
    </div>
  );
}
