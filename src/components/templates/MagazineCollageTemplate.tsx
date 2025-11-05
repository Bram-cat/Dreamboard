"use client";

import React, { useRef, useEffect } from "react";

interface MagazineCollageTemplateProps {
  images: string[]; // 14 images (7 DALL-E + 7 Gemini)
  keywords: string[];
}

export default function MagazineCollageTemplate({
  images,
  keywords,
}: MagazineCollageTemplateProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Magazine collage positions - OVERLAPPING, ANGLED, DYNAMIC
  // Like sample.png with tight clustering
  const collagePositions = [
    // Top left cluster (4 images)
    { top: 10, left: 10, width: 320, height: 240, rotate: -4, zIndex: 10, keyword: keywords[0] },
    { top: 40, left: 280, width: 280, height: 200, rotate: 6, zIndex: 11, keyword: "" },
    { top: 180, left: 50, width: 260, height: 180, rotate: -2, zIndex: 9, keyword: "" },
    { top: 160, left: 320, width: 240, height: 200, rotate: 3, zIndex: 12, keyword: keywords[1] },

    // Top right cluster (3 images)
    { top: 15, left: 900, width: 300, height: 220, rotate: 5, zIndex: 13, keyword: "" },
    { top: 60, left: 1150, width: 260, height: 190, rotate: -3, zIndex: 11, keyword: keywords[2] },
    { top: 200, left: 950, width: 280, height: 200, rotate: -6, zIndex: 10, keyword: "" },

    // Bottom left cluster (3 images)
    { top: 480, left: 20, width: 300, height: 220, rotate: 3, zIndex: 8, keyword: "" },
    { top: 520, left: 280, width: 270, height: 200, rotate: -4, zIndex: 9, keyword: keywords[3] },
    { top: 560, left: 550, width: 250, height: 180, rotate: 5, zIndex: 7, keyword: "" },

    // Bottom right cluster (4 images)
    { top: 490, left: 820, width: 280, height: 210, rotate: -5, zIndex: 10, keyword: "" },
    { top: 530, left: 1060, width: 260, height: 190, rotate: 4, zIndex: 11, keyword: keywords[4] },
    { top: 420, left: 1100, width: 240, height: 200, rotate: -2, zIndex: 9, keyword: "" },
    { top: 560, left: 780, width: 220, height: 180, rotate: 6, zIndex: 8, keyword: "" },
  ];

  // Canvas rendering for download
  useEffect(() => {
    const renderToCanvas = async () => {
      if (!canvasRef.current || images.length === 0) return;

      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      // Set canvas size
      canvas.width = 1344;
      canvas.height = 768;

      // Draw cork board background
      ctx.fillStyle = '#d4a574';
      ctx.fillRect(0, 0, 1344, 768);

      // Add texture (noise pattern)
      for (let i = 0; i < 3000; i++) {
        const x = Math.random() * 1344;
        const y = Math.random() * 768;
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

          // Draw keyword sticker if exists
          if (pos.keyword) {
            const stickerY = pos.height - 50;
            const stickerW = pos.width - 40;

            // Sticker background (colorful)
            const colors = ['#ff6b9d', '#ffd93d', '#6bcf7f', '#4d9fff', '#c77dff'];
            ctx.fillStyle = colors[idx % colors.length];
            ctx.fillRect(20, stickerY, stickerW, 35);

            // Sticker border
            ctx.strokeStyle = 'rgba(0, 0, 0, 0.2)';
            ctx.lineWidth = 2;
            ctx.strokeRect(20, stickerY, stickerW, 35);

            // Keyword text
            ctx.fillStyle = '#ffffff';
            ctx.font = 'bold 16px Arial, sans-serif';
            ctx.textAlign = 'center';
            ctx.shadowColor = 'rgba(0, 0, 0, 0.3)';
            ctx.shadowBlur = 2;
            ctx.fillText(pos.keyword.toUpperCase(), pos.width / 2, stickerY + 22);
            ctx.shadowColor = 'transparent';
          }

          ctx.restore();
        } catch (error) {
          console.error(`Failed to load image ${idx}:`, error);
        }
      }

      // Draw center banner
      const bannerY = 320;
      ctx.save();
      ctx.translate(672, bannerY);
      ctx.rotate((-2 * Math.PI) / 180);

      // Banner background
      ctx.fillStyle = '#2d3748';
      ctx.shadowColor = 'rgba(0, 0, 0, 0.5)';
      ctx.shadowBlur = 20;
      ctx.shadowOffsetX = 0;
      ctx.shadowOffsetY = 4;
      ctx.fillRect(-280, -60, 560, 120);

      // Banner text
      ctx.shadowColor = 'transparent';
      ctx.fillStyle = '#ffd93d';
      ctx.font = 'bold 52px Impact, Arial, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('MY 2025 VISION', 0, 0);

      ctx.fillStyle = '#ffffff';
      ctx.font = '20px Arial, sans-serif';
      ctx.fillText('DREAM • BELIEVE • ACHIEVE', 0, 35);

      ctx.restore();

      // Draw decorative pins
      const drawPin = (x: number, y: number, color: string) => {
        ctx.save();
        ctx.fillStyle = color;
        ctx.shadowColor = 'rgba(0, 0, 0, 0.3)';
        ctx.shadowBlur = 3;
        ctx.beginPath();
        ctx.arc(x, y, 6, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      };

      drawPin(100, 100, '#ff6b9d');
      drawPin(1244, 120, '#4d9fff');
      drawPin(150, 668, '#6bcf7f');
      drawPin(1200, 650, '#ffd93d');
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
        width={1344}
        height={768}
        style={{ display: 'none' }}
      />

      {/* Visible Vision Board */}
      <div
        ref={containerRef}
        className="relative w-[1344px] h-[768px] mx-auto overflow-hidden"
        style={{
          backgroundColor: '#d4a574',
          backgroundImage: 'url("data:image/svg+xml,%3Csvg width="100" height="100" xmlns="http://www.w3.org/2000/svg"%3E%3Cfilter id="noise"%3E%3CfeTurbulence baseFrequency="0.9" /%3E%3C/filter%3E%3Crect width="100" height="100" filter="url(%23noise)" opacity="0.1" /%3E%3C/svg%3E")',
        }}
      >
        {/* Collage Images */}
        {images.slice(0, 14).map((image, idx) => {
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

              {/* Keyword sticker */}
              {pos.keyword && (
                <div
                  className="absolute bottom-5 left-5 right-5 h-9 flex items-center justify-center border-2"
                  style={{
                    backgroundColor: ['#ff6b9d', '#ffd93d', '#6bcf7f', '#4d9fff', '#c77dff'][idx % 5],
                    borderColor: 'rgba(0, 0, 0, 0.2)',
                  }}
                >
                  <span className="text-white font-bold text-sm uppercase drop-shadow">
                    {pos.keyword}
                  </span>
                </div>
              )}
            </div>
          );
        })}

        {/* Center Banner */}
        <div
          className="absolute bg-gray-800 shadow-2xl flex flex-col items-center justify-center"
          style={{
            top: '320px',
            left: '392px',
            width: '560px',
            height: '120px',
            transform: 'rotate(-2deg)',
            zIndex: 100,
          }}
        >
          <div className="text-yellow-300 text-5xl font-black tracking-wide">MY 2025 VISION</div>
          <div className="text-white text-lg mt-2">DREAM • BELIEVE • ACHIEVE</div>
        </div>

        {/* Decorative pins */}
        <div className="absolute w-3 h-3 rounded-full bg-pink-500 shadow-md" style={{ top: '100px', left: '100px' }} />
        <div className="absolute w-3 h-3 rounded-full bg-blue-500 shadow-md" style={{ top: '120px', right: '100px' }} />
        <div className="absolute w-3 h-3 rounded-full bg-green-500 shadow-md" style={{ bottom: '100px', left: '150px' }} />
        <div className="absolute w-3 h-3 rounded-full bg-yellow-400 shadow-md" style={{ bottom: '118px', right: '144px' }} />
      </div>
    </>
  );
}
