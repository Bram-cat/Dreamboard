"use client";

import React from "react";

interface BoardElementProps {
  id: string;
  type: "person" | "lifestyle" | "quote";
  imageUrl: string;
  description: string;
  size?: "small" | "medium" | "large";
  position?: { row: number; col: number };
  onElementClick?: (id: string) => void;
}

export default function BoardElement({
  id,
  type,
  imageUrl,
  description,
  size = "medium",
  onElementClick,
}: BoardElementProps) {
  // Define size classes
  const sizeClasses = {
    small: "w-32 h-32 md:w-40 md:h-40",
    medium: "w-40 h-40 md:w-52 md:h-52",
    large: "w-52 h-52 md:w-64 md:h-64",
  };

  // Add rotation for polaroid effect
  const rotations = [
    "-rotate-2",
    "rotate-1",
    "rotate-2",
    "-rotate-1",
    "rotate-3",
    "-rotate-3",
  ];
  const randomRotation = rotations[Math.floor(Math.random() * rotations.length)];

  return (
    <div
      className={`
        ${sizeClasses[size]}
        ${randomRotation}
        relative
        cursor-pointer
        transition-all
        duration-300
        hover:scale-105
        hover:z-10
        hover:shadow-2xl
        group
      `}
      onClick={() => onElementClick?.(id)}
    >
      {/* Polaroid frame */}
      <div className="w-full h-full bg-white shadow-lg p-2 md:p-3">
        {/* Image */}
        <div className="w-full h-[85%] overflow-hidden bg-gray-100">
          <img
            src={imageUrl}
            alt={description}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Caption area */}
        <div className="h-[15%] flex items-center justify-center">
          <p className="text-[8px] md:text-xs text-gray-600 text-center truncate px-1">
            {type === "quote" ? description : ""}
          </p>
        </div>
      </div>

      {/* Hover overlay for editing (future feature) */}
      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all duration-300 pointer-events-none" />
    </div>
  );
}
