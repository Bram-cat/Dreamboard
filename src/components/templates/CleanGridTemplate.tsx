"use client";

import React, { useRef, useEffect } from "react";

interface CleanGridTemplateProps {
  images: string[]; // 8 personalized images for 3x3 grid (-1 for center logo)
  keywords: string[];
}

export default function CleanGridTemplate({
  images,
  keywords,
}: CleanGridTemplateProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // 3x3 grid layout - 8 equal-sized images (center is logo)
  const gridSize = 680; // Equal size for all images
  const gap = 10; // Gap between images
  const gridPositions = [
    // Top row - 3 images (grid positions 0, 1, 2)
    { top: 20, left: 20, width: gridSize, height: gridSize, keyword: "" },
    { top: 20, left: 20 + gridSize + gap, width: gridSize, height: gridSize, keyword: "" },
    { top: 20, left: 20 + (gridSize + gap) * 2, width: gridSize, height: gridSize, keyword: "" },

    // Middle row - left image, CENTER LOGO, right image (grid positions 3, 4=LOGO, 5)
    { top: 20 + gridSize + gap, left: 20, width: gridSize, height: gridSize, keyword: "" },
    null, // Position 4 - CENTER LOGO (placeholder)
    { top: 20 + gridSize + gap, left: 20 + (gridSize + gap) * 2, width: gridSize, height: gridSize, keyword: "" },

    // Bottom row - 3 images (grid positions 6, 7, 8)
    { top: 20 + (gridSize + gap) * 2, left: 20, width: gridSize, height: gridSize, keyword: "" },
    { top: 20 + (gridSize + gap) * 2, left: 20 + gridSize + gap, width: gridSize, height: gridSize, keyword: "" },
    { top: 20 + (gridSize + gap) * 2, left: 20 + (gridSize + gap) * 2, width: gridSize, height: gridSize, keyword: "" },
  ];

  // Canvas rendering for download
  useEffect(() => {
    const renderToCanvas = async () => {
      if (!canvasRef.current || images.length === 0) return;

      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      // Load Telma font for canvas
      const telmaFont = new FontFace('Telma', 'url(/fonts/Telma-Bold.woff2)');
      try {
        await telmaFont.load();
        document.fonts.add(telmaFont);
      } catch (error) {
        console.error('Failed to load Telma font:', error);
      }

      // Set canvas size - 3x3 grid dimensions
      const totalWidth = 20 + (gridSize + gap) * 3;
      const totalHeight = 20 + (gridSize + gap) * 3;
      canvas.width = totalWidth;
      canvas.height = totalHeight;

      // Draw gradient background (soft, professional)
      const gradient = ctx.createLinearGradient(0, 0, totalWidth, totalHeight);
      gradient.addColorStop(0, '#f8fafc');
      gradient.addColorStop(0.5, '#f1f5f9');
      gradient.addColorStop(1, '#e2e8f0');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, totalWidth, totalHeight);

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

      // Draw all grid images in 3x3 grid (position 4 is logo)
      for (let posIndex = 0; posIndex < gridPositions.length; posIndex++) {
        // Skip position 4 (center logo)
        if (posIndex === 4) continue;

        const pos = gridPositions[posIndex];
        if (!pos) continue;

        // Calculate which image to use (accounting for skipped position 4)
        const imageIndex = posIndex < 4 ? posIndex : posIndex - 1;
        if (imageIndex >= images.length) continue;

        try {
          const img = await loadImage(images[imageIndex]);

          ctx.save();

          // Draw soft blue-tinted card to complement gradient background
          ctx.fillStyle = '#f0f4f8';
          ctx.shadowColor = 'rgba(99, 102, 241, 0.15)';
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

          // Calculate proper aspect ratio for image scaling (cover mode)
          const imgRatio = img.width / img.height;
          const boxRatio = pos.width / pos.height;
          let drawWidth, drawHeight, drawX, drawY;

          // Always fill the frame completely (cover mode - image fills entire space)
          if (imgRatio > boxRatio) {
            // Image is wider - match height, let width overflow
            drawHeight = pos.height;
            drawWidth = drawHeight * imgRatio;
            drawX = pos.left - (drawWidth - pos.width) / 2;
            drawY = pos.top;
          } else {
            // Image is taller - match width, let height overflow
            drawWidth = pos.width;
            drawHeight = drawWidth / imgRatio;
            drawX = pos.left;
            drawY = pos.top - (drawHeight - pos.height) / 2;
          }

          ctx.drawImage(img, drawX, drawY, drawWidth, drawHeight);

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
          console.error(`Failed to load image ${imageIndex}:`, error);
        }
      }

      // Draw center logo image - perfectly rounded circle in 3x3 grid center
      const logoSize = gridSize * 0.9; // 90% of grid cell size
      const logoRadius = logoSize / 2;
      const centerX = 20 + gridSize + gap + gridSize / 2; // Center of middle column
      const centerY = 20 + gridSize + gap + gridSize / 2; // Center of middle row

      try {
        const logoImg = await loadImage('/Gemini_Generated_Image_q3n49dq3n49dq3n4.png');

        ctx.save();

        // Create circular clip path
        ctx.beginPath();
        ctx.arc(centerX, centerY, logoRadius, 0, Math.PI * 2);
        ctx.closePath();
        ctx.clip();

        // Draw shadow
        ctx.shadowColor = 'rgba(0, 0, 0, 0.2)';
        ctx.shadowBlur = 30;
        ctx.shadowOffsetX = 0;
        ctx.shadowOffsetY = 4;

        // Draw logo image (will be clipped to circle)
        ctx.drawImage(
          logoImg,
          centerX - logoRadius,
          centerY - logoRadius,
          logoSize,
          logoSize
        );

        ctx.restore();
      } catch (error) {
        console.error('Failed to load logo image:', error);
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
        width={20 + (gridSize + gap) * 3}
        height={20 + (gridSize + gap) * 3}
        style={{ display: 'none' }}
      />

      {/* Scaled Container to fit screen */}
      <div className="w-screen h-screen flex items-center justify-center overflow-hidden">
        <div
          style={{
            transform: 'scale(0.42)',
            transformOrigin: 'center center',
          }}
        >
          {/* Visible Vision Board - 3x3 Grid */}
          <div
            ref={containerRef}
            className="relative"
            style={{
              width: `${20 + (gridSize + gap) * 3}px`,
              height: `${20 + (gridSize + gap) * 3}px`,
              background: 'linear-gradient(to bottom right, #f8fafc, #f1f5f9, #e2e8f0)'
            }}
          >
        {/* Grid Images - 8 images in 3x3 grid (position 4 is logo) */}
        {gridPositions.map((pos, posIndex) => {
          // Skip position 4 (center logo)
          if (posIndex === 4 || !pos) return null;

          // Calculate which image to use (accounting for skipped position 4)
          const imageIndex = posIndex < 4 ? posIndex : posIndex - 1;
          const image = images[imageIndex];
          if (!image) return null;

          return (
            <div
              key={posIndex}
              className="absolute shadow-lg"
              style={{
                top: `${pos.top}px`,
                left: `${pos.left}px`,
                width: `${pos.width}px`,
                height: `${pos.height}px`,
                borderRadius: '12px',
                overflow: 'hidden',
                backgroundColor: '#f0f4f8',
                boxShadow: '0 2px 20px rgba(99, 102, 241, 0.15)',
              }}
            >
              {/* Image - COVER mode to fill entire container */}
              <img
                src={image}
                alt={`Vision ${imageIndex + 1}`}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  objectPosition: 'center center',
                  display: 'block'
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

        {/* Center Logo - Perfectly Rounded Circle in 3x3 Grid */}
        <div
          className="absolute shadow-2xl"
          style={{
            top: `${20 + gridSize + gap}px`,
            left: `${20 + gridSize + gap}px`,
            width: `${gridSize}px`,
            height: `${gridSize}px`,
            borderRadius: '50%',
            overflow: 'hidden',
            zIndex: 20,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <img
            src="/Gemini_Generated_Image_q3n49dq3n49dq3n4.png"
            alt="MY 2025 VISION BOARD"
            style={{
              width: '90%',
              height: '90%',
              objectFit: 'cover',
              borderRadius: '50%',
            }}
          />
        </div>

          </div>
        </div>
      </div>
    </>
  );
}
