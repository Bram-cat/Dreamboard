"use client";

import React, { useRef, useEffect } from "react";

interface MinimalScrapbookTemplateProps {
  images: string[]; // 14 images (7 DALL-E + 7 Gemini)
  keywords: string[];
}

export default function MinimalScrapbookTemplate({
  images,
  keywords,
}: MinimalScrapbookTemplateProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Minimal scrapbook positions - GENTLE ROTATIONS, IMPROVED PASTEL THEME
  // Mix of different sizes, organized but casual - softer, more harmonious colors
  const scrapbookPositions = [
    // Top row (large focus images) - warm pastels
    { top: 30, left: 30, width: 380, height: 280, rotate: -1.5, border: '#fde4e9', keyword: keywords[0] },
    { top: 30, left: 450, width: 420, height: 280, rotate: 1, border: '#e3f2fd', keyword: "" },
    { top: 30, left: 910, width: 400, height: 280, rotate: -0.8, border: '#fff9e6', keyword: keywords[1] },

    // Middle row (medium + small mix) - cool pastels
    { top: 340, left: 30, width: 280, height: 200, rotate: 1.2, border: '#e8f5e9', keyword: "" },
    { top: 340, left: 340, width: 240, height: 200, rotate: -1, border: '#ffe8d9', keyword: keywords[2] },
    // CENTER SPACE
    { top: 340, left: 1030, width: 280, height: 200, rotate: 0.9, border: '#f3e5f5', keyword: "" },

    // Bottom row (varied sizes) - mixed pastels
    { top: 570, left: 30, width: 320, height: 170, rotate: -1.3, border: '#e0f7fa', keyword: "" },
    { top: 570, left: 380, width: 260, height: 170, rotate: 1.5, border: '#fce4ec', keyword: keywords[3] },
    { top: 570, left: 670, width: 300, height: 170, rotate: -0.6, border: '#f9fbe7', keyword: "" },
    { top: 570, left: 1000, width: 310, height: 170, rotate: 1.1, border: '#e8eaf6', keyword: keywords[4] },

    // Accent small images - complementary pastels
    { top: 350, left: 610, width: 180, height: 130, rotate: 2, border: '#fff3e0', keyword: "" },
    { top: 350, left: 820, width: 180, height: 130, rotate: -1.8, border: '#fce4ec', keyword: "" },
    { top: 490, left: 660, width: 160, height: 120, rotate: 1.5, border: '#ede7f6', keyword: "" },
    { top: 490, left: 850, width: 160, height: 120, rotate: -1.2, border: '#e0f2f1', keyword: "" },
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

      // Draw cream background
      ctx.fillStyle = '#fffef7';
      ctx.fillRect(0, 0, 1344, 768);

      // Subtle texture
      for (let i = 0; i < 1500; i++) {
        const x = Math.random() * 1344;
        const y = Math.random() * 768;
        ctx.fillStyle = `rgba(240, 235, 220, ${Math.random() * 0.3})`;
        ctx.fillRect(x, y, 1, 1);
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

      // Draw all scrapbook images
      for (let idx = 0; idx < Math.min(14, images.length); idx++) {
        const pos = scrapbookPositions[idx];
        if (!pos) continue;

        try {
          const img = await loadImage(images[idx]);

          ctx.save();
          ctx.translate(pos.left + pos.width / 2, pos.top + pos.height / 2);
          ctx.rotate((pos.rotate * Math.PI) / 180);
          ctx.translate(-(pos.width / 2), -(pos.height / 2));

          // Draw colored border/frame
          const borderWidth = 16;
          ctx.fillStyle = pos.border;
          ctx.shadowColor = 'rgba(0, 0, 0, 0.15)';
          ctx.shadowBlur = 12;
          ctx.shadowOffsetX = 2;
          ctx.shadowOffsetY = 3;
          ctx.fillRect(0, 0, pos.width, pos.height);
          ctx.shadowColor = 'transparent';

          // Draw white inner border
          ctx.fillStyle = '#ffffff';
          ctx.fillRect(borderWidth / 2, borderWidth / 2, pos.width - borderWidth, pos.height - borderWidth);

          // Draw image with proper scaling to cover the frame
          const padding = borderWidth;
          const imgRatio = img.width / img.height;
          const boxRatio = (pos.width - padding * 2) / (pos.height - padding * 2);
          let drawWidth, drawHeight, drawX, drawY;

          // Always fill the frame completely (cover mode)
          if (imgRatio > boxRatio) {
            // Image is wider - match width
            drawWidth = pos.width - padding * 2;
            drawHeight = drawWidth / imgRatio;
            drawX = padding;
            drawY = padding + (pos.height - padding * 2 - drawHeight) / 2;
          } else {
            // Image is taller - match height
            drawHeight = pos.height - padding * 2;
            drawWidth = drawHeight * imgRatio;
            drawX = padding + (pos.width - padding * 2 - drawWidth) / 2;
            drawY = padding;
          }

          // Clip to ensure image doesn't overflow
          ctx.save();
          ctx.beginPath();
          ctx.rect(padding, padding, pos.width - padding * 2, pos.height - padding * 2);
          ctx.clip();
          ctx.drawImage(img, drawX, drawY, drawWidth, drawHeight);
          ctx.restore();

          // Keywords removed - no captions on vision board

          ctx.restore();
        } catch (error) {
          console.error(`Failed to load image ${idx}:`, error);
        }
      }

      // Draw center handwritten title
      const centerX = 600;
      const centerY = 370;

      ctx.save();
      ctx.translate(centerX, centerY);
      ctx.rotate((-1 * Math.PI) / 180);

      // Title background (soft paper)
      ctx.fillStyle = 'rgba(255, 255, 255, 0.95)';
      ctx.shadowColor = 'rgba(0, 0, 0, 0.2)';
      ctx.shadowBlur = 15;
      ctx.fillRect(-140, -50, 280, 100);

      // Dashed border
      ctx.strokeStyle = '#d4a5a5';
      ctx.lineWidth = 2;
      ctx.setLineDash([5, 5]);
      ctx.strokeRect(-135, -45, 270, 90);
      ctx.setLineDash([]);

      // Title text
      ctx.shadowColor = 'transparent';
      ctx.fillStyle = '#8b6f47';
      ctx.font = 'italic bold 36px Georgia, serif';
      ctx.textAlign = 'center';
      ctx.fillText('My 2025', 0, -5);
      ctx.font = 'italic 24px Georgia, serif';
      ctx.fillText('Vision Board', 0, 28);

      ctx.restore();

      // Draw decorative elements (washi tape corners)
      const drawWashiTape = (x: number, y: number, width: number, color: string) => {
        ctx.fillStyle = color;
        ctx.globalAlpha = 0.6;
        ctx.fillRect(x, y, width, 20);
        ctx.globalAlpha = 1;
      };

      drawWashiTape(0, 0, 200, '#ffc9e5');
      drawWashiTape(1144, 0, 200, '#c9e5ff');
      drawWashiTape(0, 748, 200, '#fffcc9');
      drawWashiTape(1144, 748, 200, '#d4ffc9');
    };

    renderToCanvas();
  }, [images, keywords]);

  // Download function
  const handleDownload = () => {
    if (!canvasRef.current) return;

    try {
      const dataUrl = canvasRef.current.toDataURL('image/png', 1.0);
      const link = document.createElement('a');
      link.download = 'vision-board-scrapbook-2025.png';
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
          backgroundColor: '#fffef7',
        }}
      >
        {/* Washi tape decoration */}
        <div className="absolute top-0 left-0 w-[200px] h-5 bg-pink-200 opacity-60" />
        <div className="absolute top-0 right-0 w-[200px] h-5 bg-blue-200 opacity-60" />
        <div className="absolute bottom-0 left-0 w-[200px] h-5 bg-yellow-100 opacity-60" />
        <div className="absolute bottom-0 right-0 w-[200px] h-5 bg-green-100 opacity-60" />

        {/* Scrapbook Images */}
        {images.slice(0, 14).map((image, idx) => {
          const pos = scrapbookPositions[idx];
          if (!pos) return null;

          return (
            <div
              key={idx}
              className="absolute shadow-lg"
              style={{
                top: `${pos.top}px`,
                left: `${pos.left}px`,
                width: `${pos.width}px`,
                height: `${pos.height}px`,
                transform: `rotate(${pos.rotate}deg)`,
                backgroundColor: pos.border,
                padding: '8px',
              }}
            >
              {/* White inner frame */}
              <div className="w-full h-full bg-white p-2">
                {/* Image */}
                <img
                  src={image}
                  alt={`Vision ${idx + 1}`}
                  className="w-full h-full object-cover"
                  style={{ objectFit: 'cover' }}
                />
              </div>

              {/* Keywords removed - no captions displayed */}
            </div>
          );
        })}

        {/* Center Title */}
        <div
          className="absolute bg-white/95 shadow-xl flex flex-col items-center justify-center border-2 border-dashed"
          style={{
            top: '320px',
            left: '460px',
            width: '280px',
            height: '100px',
            transform: 'rotate(-1deg)',
            borderColor: '#d4a5a5',
            zIndex: 100,
          }}
        >
          <div className="text-amber-800 text-4xl font-bold italic" style={{ fontFamily: 'Georgia, serif' }}>
            My 2025
          </div>
          <div className="text-amber-700 text-xl italic" style={{ fontFamily: 'Georgia, serif' }}>
            Vision Board
          </div>
        </div>
      </div>
    </>
  );
}
