"use client";

import React, { useRef, useEffect } from "react";

interface MagazineCollageTemplateProps {
  images: string[]; // 15 images (8 DALL-E + 7 Gemini)
  keywords: string[];
}

export default function MagazineCollageTemplate({
  images,
  keywords,
}: MagazineCollageTemplateProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // LANDSCAPE Magazine collage - 15 images scattered across wide canvas
  // Dynamic arrangement with varying sizes for authentic collage feel
  const collagePositions = [
    // Top row - 5 images
    { top: 20, left: 20, width: 280, height: 200, rotate: -4, zIndex: 12 },
    { top: 40, left: 320, width: 260, height: 180, rotate: 3, zIndex: 10 },
    { top: 15, left: 600, width: 290, height: 200, rotate: -2, zIndex: 11 },
    { top: 35, left: 910, width: 270, height: 190, rotate: 5, zIndex: 9 },
    { top: 25, left: 1200, width: 280, height: 200, rotate: -3, zIndex: 13 },

    // Middle row - 5 images
    { top: 250, left: 30, width: 290, height: 200, rotate: 2, zIndex: 14 },
    { top: 260, left: 340, width: 270, height: 190, rotate: -4, zIndex: 8 },
    { top: 240, left: 630, width: 280, height: 200, rotate: 3, zIndex: 10 },
    { top: 270, left: 930, width: 260, height: 180, rotate: -2, zIndex: 12 },
    { top: 250, left: 1210, width: 270, height: 190, rotate: 4, zIndex: 11 },

    // Bottom row - 5 images
    { top: 480, left: 40, width: 280, height: 200, rotate: -5, zIndex: 13 },
    { top: 500, left: 340, width: 270, height: 190, rotate: 3, zIndex: 9 },
    { top: 490, left: 630, width: 290, height: 200, rotate: -3, zIndex: 11 },
    { top: 510, left: 940, width: 260, height: 180, rotate: 4, zIndex: 10 },
    { top: 495, left: 1220, width: 270, height: 190, rotate: -2, zIndex: 12 },
  ];

  // Canvas rendering for download
  useEffect(() => {
    const renderToCanvas = async () => {
      if (!canvasRef.current || images.length === 0) return;

      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      // Set canvas size - LANDSCAPE orientation (wide format)
      canvas.width = 1500;
      canvas.height = 900;

      // Draw cork board background
      ctx.fillStyle = '#d4a574';
      ctx.fillRect(0, 0, 1500, 900);

      // Add texture (noise pattern)
      for (let i = 0; i < 5000; i++) {
        const x = Math.random() * 1500;
        const y = Math.random() * 900;
        const brightness = Math.random() * 30 - 15;
        ctx.fillStyle = `rgba(${120 + brightness}, ${80 + brightness}, ${50 + brightness}, 0.3)`;
        ctx.fillRect(x, y, 2, 2);
      }

      // Load and draw images
      const loadImage = (src: string): Promise<HTMLImageElement> => {
        return new Promise((resolve, reject) => {
          const img = new Image();
          img.crossOrigin = 'anonymous';
          img.onload = () => resolve(img);
          img.onerror = reject;
          img.src = src;
        });
      };

      // Sort by zIndex (draw lower z-index first)
      const sortedPositions = collagePositions
        .map((pos, idx) => ({ pos, idx }))
        .sort((a, b) => a.pos.zIndex - b.pos.zIndex);

      // Draw all collage images
      for (const { pos, idx } of sortedPositions) {
        if (idx >= images.length) continue;

        try {
          const img = await loadImage(images[idx]);

          ctx.save();
          ctx.translate(pos.left + pos.width / 2, pos.top + pos.height / 2);
          ctx.rotate((pos.rotate * Math.PI) / 180);
          ctx.translate(-(pos.width / 2), -(pos.height / 2));

          // Draw tape at corners (before image)
          const drawTape = (x: number, y: number, angle: number) => {
            ctx.save();
            ctx.translate(x, y);
            ctx.rotate((angle * Math.PI) / 180);
            ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
            ctx.fillRect(-25, -8, 50, 16);
            ctx.strokeStyle = 'rgba(200, 200, 200, 0.5)';
            ctx.lineWidth = 1;
            ctx.strokeRect(-25, -8, 50, 16);
            ctx.restore();
          };

          // Tape at top corners
          drawTape(10, -5, 45);
          drawTape(pos.width - 10, -5, -45);

          // Draw white photo border
          ctx.fillStyle = '#ffffff';
          ctx.shadowColor = 'rgba(0, 0, 0, 0.4)';
          ctx.shadowBlur = 15;
          ctx.shadowOffsetX = 3;
          ctx.shadowOffsetY = 3;
          ctx.fillRect(0, 0, pos.width, pos.height);
          ctx.shadowColor = 'transparent';

          // Draw image
          const padding = 12;
          const imgRatio = img.width / img.height;
          const boxRatio = (pos.width - padding * 2) / (pos.height - padding * 2);
          let drawWidth, drawHeight, drawX, drawY;

          if (imgRatio > boxRatio) {
            drawHeight = pos.height - padding * 2;
            drawWidth = drawHeight * imgRatio;
            drawX = padding - (drawWidth - (pos.width - padding * 2)) / 2;
            drawY = padding;
          } else {
            drawWidth = pos.width - padding * 2;
            drawHeight = drawWidth / imgRatio;
            drawX = padding;
            drawY = padding - (drawHeight - (pos.height - padding * 2)) / 2;
          }

          ctx.drawImage(img, drawX, drawY, drawWidth, drawHeight);

          ctx.restore();
        } catch (error) {
          console.error(`Failed to load image ${idx}:`, error);
        }
      }
    };

    renderToCanvas();
  }, [images, keywords]);

  // Download function
  const handleDownload = () => {
    if (!canvasRef.current) return;

    try {
      const dataUrl = canvasRef.current.toDataURL('image/png', 1.0);
      const link = document.createElement('a');
      link.download = 'vision-board-magazine-2025.png';
      link.href = dataUrl;
      link.click();
    } catch (error) {
      console.error('Download error:', error);
      alert('Download failed. Please try again.');
    }
  };

  // Expose download function globally
  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (window as any).downloadVisionBoard = handleDownload;
    return () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      delete (window as any).downloadVisionBoard;
    };
  }, []);

  return (
    <>
      {/* Hidden Canvas for download */}
      <canvas
        ref={canvasRef}
        width={1500}
        height={900}
        style={{ display: 'none' }}
      />

      {/* Visible Vision Board - LANDSCAPE orientation */}
      <div
        ref={containerRef}
        className="relative w-[1500px] h-[900px] mx-auto overflow-hidden"
        style={{
          backgroundColor: '#d4a574',
          backgroundImage: 'url("data:image/svg+xml,%3Csvg width="100" height="100" xmlns="http://www.w3.org/2000/svg"%3E%3Cfilter id="noise"%3E%3CfeTurbulence baseFrequency="0.9" /%3E%3C/filter%3E%3Crect width="100" height="100" filter="url(%23noise)" opacity="0.1" /%3E%3C/svg%3E")',
        }}
      >
        {/* Collage Images - 15 total */}
        {images.slice(0, 15).map((image, idx) => {
          const pos = collagePositions[idx];
          if (!pos) return null;

          return (
            <div
              key={idx}
              className="absolute bg-white shadow-xl"
              style={{
                top: `${pos.top}px`,
                left: `${pos.left}px`,
                width: `${pos.width}px`,
                height: `${pos.height}px`,
                transform: `rotate(${pos.rotate}deg)`,
                zIndex: pos.zIndex,
                padding: '12px',
              }}
            >
              {/* Tape decoration */}
              <div
                className="absolute bg-white/70 border border-gray-300"
                style={{
                  top: '-5px',
                  left: '10px',
                  width: '50px',
                  height: '16px',
                  transform: 'rotate(45deg)',
                }}
              />
              <div
                className="absolute bg-white/70 border border-gray-300"
                style={{
                  top: '-5px',
                  right: '10px',
                  width: '50px',
                  height: '16px',
                  transform: 'rotate(-45deg)',
                }}
              />

              {/* Image */}
              <img
                src={image}
                alt={`Vision ${idx + 1}`}
                className="w-full h-full object-cover"
                style={{ objectFit: 'cover' }}
              />
            </div>
          );
        })}
      </div>
    </>
  );
}
