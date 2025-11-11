"use client";

import React, { useRef, useEffect } from "react";

interface CleanGridTemplateProps {
  images: string[]; // 8 images (4 OpenAI + 4 Gemini)
  keywords: string[];
}

export default function CleanGridTemplate({
  images,
  keywords,
}: CleanGridTemplateProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Simple 3x3 grid layout - 8 images with minimal gaps and larger sizes
  const gridPositions = [
    // Top row - 3 images (minimal gaps: 10px)
    { top: 10, left: 10, width: 435, height: 240, keyword: "" },
    { top: 10, left: 455, width: 435, height: 240, keyword: "" },
    { top: 10, left: 900, width: 435, height: 240, keyword: "" },

    // Middle row - 2 side images (center card in middle)
    { top: 260, left: 10, width: 435, height: 240, keyword: "" },
    // CENTER CARD HERE (positioned between middle images)
    { top: 260, left: 900, width: 435, height: 240, keyword: "" },

    // Bottom row - 3 images
    { top: 510, left: 10, width: 435, height: 240, keyword: "" },
    { top: 510, left: 455, width: 435, height: 240, keyword: "" },
    { top: 510, left: 900, width: 435, height: 240, keyword: "" },
  ];

  // Canvas rendering for download
  useEffect(() => {
    const renderToCanvas = async () => {
      if (!canvasRef.current || images.length === 0) return;

      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      // Set canvas size (3x3 grid optimized)
      canvas.width = 1345;
      canvas.height = 760;

      // Draw gradient background (soft, professional)
      const gradient = ctx.createLinearGradient(0, 0, 1345, 760);
      gradient.addColorStop(0, '#f8fafc');
      gradient.addColorStop(0.5, '#f1f5f9');
      gradient.addColorStop(1, '#e2e8f0');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, 1345, 760);

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

      // Draw all grid images
      for (let idx = 0; idx < Math.min(8, images.length); idx++) {
        const pos = gridPositions[idx];
        if (!pos) continue;

        try {
          const img = await loadImage(images[idx]);

          ctx.save();

          // Draw white card with subtle shadow
          ctx.fillStyle = '#ffffff';
          ctx.shadowColor = 'rgba(0, 0, 0, 0.1)';
          ctx.shadowBlur = 20;
          ctx.shadowOffsetX = 0;
          ctx.shadowOffsetY = 2;

          // Rounded corners
          const radius = 12;
          ctx.beginPath();
          ctx.moveTo(pos.left + radius, pos.top);
          ctx.lineTo(pos.left + pos.width - radius, pos.top);
          ctx.quadraticCurveTo(pos.left + pos.width, pos.top, pos.left + pos.width, pos.top + radius);
          ctx.lineTo(pos.left + pos.width, pos.top + pos.height - radius);
          ctx.quadraticCurveTo(pos.left + pos.width, pos.top + pos.height, pos.left + pos.width - radius, pos.top + pos.height);
          ctx.lineTo(pos.left + radius, pos.top + pos.height);
          ctx.quadraticCurveTo(pos.left, pos.top + pos.height, pos.left, pos.top + pos.height - radius);
          ctx.lineTo(pos.left, pos.top + radius);
          ctx.quadraticCurveTo(pos.left, pos.top, pos.left + radius, pos.top);
          ctx.closePath();
          ctx.fill();
          ctx.shadowColor = 'transparent';

          // Clip for rounded corners
          ctx.clip();

          // Images are pre-processed to exact 435x240 dimensions, so draw them directly
          // Use 'cover' fit to fill frame completely
          const imgRatio = img.width / img.height;
          const boxRatio = pos.width / pos.height;

          // Check if image matches expected aspect ratio (within 1% tolerance)
          const aspectRatioMatch = Math.abs(imgRatio - boxRatio) < 0.01;

          if (aspectRatioMatch) {
            // Perfect match - draw directly
            ctx.drawImage(img, pos.left, pos.top, pos.width, pos.height);
          } else {
            // Fallback for images that weren't properly pre-processed
            let drawWidth, drawHeight, drawX, drawY;

            if (imgRatio > boxRatio) {
              // Image is wider - fit to height, crop sides
              drawHeight = pos.height;
              drawWidth = drawHeight * imgRatio;
              drawX = pos.left - (drawWidth - pos.width) / 2;
              drawY = pos.top;
            } else {
              // Image is taller - fit to width, show upper portion
              drawWidth = pos.width;
              drawHeight = drawWidth / imgRatio;
              drawX = pos.left;
              drawY = pos.top - (drawHeight - pos.height) * 0.3;
            }

            ctx.drawImage(img, drawX, drawY, drawWidth, drawHeight);
          }

          // Draw keyword label at bottom if exists
          if (pos.keyword) {
            const labelHeight = 40;
            const labelY = pos.top + pos.height - labelHeight;

            // Semi-transparent gradient overlay
            const labelGradient = ctx.createLinearGradient(0, labelY, 0, pos.top + pos.height);
            labelGradient.addColorStop(0, 'rgba(0, 0, 0, 0.5)');
            labelGradient.addColorStop(1, 'rgba(0, 0, 0, 0.7)');
            ctx.fillStyle = labelGradient;
            ctx.fillRect(pos.left, labelY, pos.width, labelHeight);

            // Keyword text
            ctx.fillStyle = '#ffffff';
            ctx.font = 'bold 16px Inter, system-ui, sans-serif';
            ctx.textAlign = 'center';
            ctx.fillText(pos.keyword.toUpperCase(), pos.left + pos.width / 2, labelY + 25);
          }

          ctx.restore();
        } catch (error) {
          console.error(`Failed to load image ${idx}:`, error);
        }
      }

      // Draw center card - Larger, more prominent size
      const centerX = 500;
      const centerY = 290;
      const centerW = 345;
      const centerH = 180;

      ctx.save();
      ctx.fillStyle = '#6366f1'; // Indigo
      ctx.shadowColor = 'rgba(0, 0, 0, 0.2)';
      ctx.shadowBlur = 30;
      ctx.shadowOffsetX = 0;
      ctx.shadowOffsetY = 4;

      // Rounded rectangle
      const radius = 16;
      ctx.beginPath();
      ctx.moveTo(centerX + radius, centerY);
      ctx.lineTo(centerX + centerW - radius, centerY);
      ctx.quadraticCurveTo(centerX + centerW, centerY, centerX + centerW, centerY + radius);
      ctx.lineTo(centerX + centerW, centerY + centerH - radius);
      ctx.quadraticCurveTo(centerX + centerW, centerY + centerH, centerX + centerW - radius, centerY + centerH);
      ctx.lineTo(centerX + radius, centerY + centerH);
      ctx.quadraticCurveTo(centerX, centerY + centerH, centerX, centerY + centerH - radius);
      ctx.lineTo(centerX, centerY + radius);
      ctx.quadraticCurveTo(centerX, centerY, centerX + radius, centerY);
      ctx.closePath();
      ctx.fill();

      // Center text - Larger, more readable
      ctx.shadowColor = 'transparent';
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 56px Inter, system-ui, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('2025', centerX + centerW / 2, centerY + 80);

      ctx.font = '18px Inter, system-ui, sans-serif';
      ctx.letterSpacing = '3px';
      ctx.fillText('YOUR VISION BOARD', centerX + centerW / 2, centerY + 115);

      ctx.restore();
    };

    renderToCanvas();
  }, [images, keywords]);

  // Download function
  const handleDownload = () => {
    if (!canvasRef.current) return;

    try {
      const dataUrl = canvasRef.current.toDataURL('image/png', 1.0);
      const link = document.createElement('a');
      link.download = 'vision-board-clean-grid-2025.png';
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
        width={1345}
        height={760}
        style={{ display: 'none' }}
      />

      {/* Visible Vision Board */}
      <div
        ref={containerRef}
        className="relative w-[1345px] h-[760px] mx-auto overflow-hidden"
        style={{ background: 'linear-gradient(to bottom right, #f8fafc, #f1f5f9, #e2e8f0)' }}
      >
        {/* Grid Images */}
        {images.slice(0, 8).map((image, idx) => {
          const pos = gridPositions[idx];
          if (!pos) return null;

          return (
            <div
              key={idx}
              className="absolute bg-white shadow-lg"
              style={{
                top: `${pos.top}px`,
                left: `${pos.left}px`,
                width: `${pos.width}px`,
                height: `${pos.height}px`,
                borderRadius: '12px',
                overflow: 'hidden',
              }}
            >
              {/* Image */}
              <img
                src={image}
                alt={`Vision ${idx + 1}`}
                className="w-full h-full"
                style={{
                  objectFit: 'fill', // Images are pre-processed to exact dimensions, so fill works perfectly
                  width: '100%',
                  height: '100%'
                }}
              />

              {/* Keyword label */}
              {pos.keyword && (
                <div
                  className="absolute bottom-0 left-0 right-0 h-10 flex items-center justify-center"
                  style={{
                    background: 'linear-gradient(to bottom, rgba(0,0,0,0.5), rgba(0,0,0,0.7))',
                  }}
                >
                  <span className="text-white font-bold text-sm uppercase">
                    {pos.keyword}
                  </span>
                </div>
              )}
            </div>
          );
        })}

        {/* Center Card - Larger, more prominent */}
        <div
          className="absolute bg-indigo-500 shadow-2xl flex flex-col items-center justify-center"
          style={{
            top: '290px',
            left: '500px',
            width: '345px',
            height: '180px',
            borderRadius: '16px',
          }}
        >
          <div className="text-white text-6xl font-bold mb-2">2025</div>
          <div className="text-white text-lg tracking-widest">YOUR VISION BOARD</div>
        </div>
      </div>
    </>
  );
}
