"use client";

import React, { useRef, useEffect } from "react";

interface PolaroidScatteredTemplateProps {
  images: string[]; // 14 images (7 DALL-E + 7 Gemini)
  keywords: string[];
}

export default function PolaroidScatteredTemplate({
  images,
  keywords,
}: PolaroidScatteredTemplateProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Clean grid layout - Scaled for 1920x1080 (16:9 aspect ratio)
  // Large tiles with proper spacing for widescreen display
  const gridPositions = [
    // Row 1 - 4 large tiles across top
    { top: 20, left: 20, width: 440, height: 320, keyword: keywords[0] || "" },
    { top: 20, left: 480, width: 440, height: 320, keyword: "" },
    { top: 20, left: 940, width: 440, height: 320, keyword: keywords[1] || "" },
    { top: 20, left: 1400, width: 500, height: 320, keyword: "" },

    // Row 2 - 3 tiles + CENTER CARD
    { top: 360, left: 20, width: 350, height: 340, keyword: "" },
    // CENTER CARD: 390-1010 (620px wide) x 360-700 (340px tall)
    { top: 360, left: 1030, width: 870, height: 340, keyword: keywords[2] || "" },

    // Row 3 - 4 large tiles across bottom
    { top: 720, left: 20, width: 440, height: 340, keyword: keywords[3] || "" },
    { top: 720, left: 480, width: 440, height: 340, keyword: "" },
    { top: 720, left: 940, width: 440, height: 340, keyword: keywords[4] || "" },
    { top: 720, left: 1400, width: 500, height: 340, keyword: "" },

    // Additional tiles for variety
    { top: 360, left: 1030, width: 425, height: 340, keyword: "" },
    { top: 360, left: 1475, width: 425, height: 340, keyword: "" },
    { top: 20, left: 1400, width: 245, height: 155, keyword: "" },
  ];

  // Canvas rendering for download
  useEffect(() => {
    const renderToCanvas = async () => {
      if (!canvasRef.current || images.length === 0) return;

      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      // Set canvas size - Standard 16:9 aspect ratio for better display
      canvas.width = 1920;
      canvas.height = 1080;

      // Draw beige background
      ctx.fillStyle = '#f5f1ed';
      ctx.fillRect(0, 0, 1920, 1080);

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

      // Draw all grid images (13 images, 14th position is center card)
      for (let idx = 0; idx < Math.min(13, images.length); idx++) {
        const pos = gridPositions[idx];
        if (!pos) continue;

        try {
          const img = await loadImage(images[idx]);

          ctx.save();

          // Draw image with cover fit (fills entire tile)
          const imgRatio = img.width / img.height;
          const boxRatio = pos.width / pos.height;
          let drawWidth, drawHeight, drawX, drawY;

          if (imgRatio > boxRatio) {
            drawHeight = pos.height;
            drawWidth = drawHeight * imgRatio;
            drawX = pos.left - (drawWidth - pos.width) / 2;
            drawY = pos.top;
          } else {
            drawWidth = pos.width;
            drawHeight = drawWidth / imgRatio;
            drawX = pos.left;
            drawY = pos.top - (drawHeight - pos.height) / 2;
          }

          ctx.drawImage(img, drawX, drawY, drawWidth, drawHeight);

          // Draw keyword label overlay (beige box in corner like image.png)
          if (pos.keyword) {
            const labelW = 140;
            const labelH = 50;
            const labelX = pos.left + pos.width - labelW - 15;
            const labelY = pos.top + pos.height - labelH - 15;

            // Beige semi-transparent background
            ctx.fillStyle = 'rgba(214, 193, 177, 0.9)';
            ctx.fillRect(labelX, labelY, labelW, labelH);

            // Text
            ctx.fillStyle = '#ffffff';
            ctx.font = 'bold 16px Arial, sans-serif';
            ctx.textAlign = 'center';
            ctx.fillText(pos.keyword.toUpperCase(), labelX + labelW / 2, labelY + labelH / 2 + 6);
          }

          ctx.restore();
        } catch (error) {
          console.error(`Failed to load image ${idx}:`, error);
        }
      }

      // Draw center card (beige with white text) - positioned for 1920x1080
      const centerX = 390;
      const centerY = 360;
      const centerW = 620;
      const centerH = 340;

      ctx.save();
      ctx.fillStyle = '#d6c1b1'; // Beige matching image.png
      ctx.fillRect(centerX, centerY, centerW, centerH);

      // Add decorative plus signs
      ctx.fillStyle = '#ffffff';
      ctx.font = '32px Arial';
      ctx.textAlign = 'center';
      ctx.fillText('+', centerX + centerW / 2, centerY + 70);
      ctx.fillText('+', centerX + centerW / 2, centerY + centerH - 50);

      // Center text
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 60px Arial, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('2025', centerX + centerW / 2, centerY + centerH / 2 - 30);

      ctx.font = 'bold 36px Arial, sans-serif';
      ctx.fillText('VISION', centerX + centerW / 2, centerY + centerH / 2 + 20);

      ctx.font = 'bold 36px Arial, sans-serif';
      ctx.fillText('BOARD', centerX + centerW / 2, centerY + centerH / 2 + 65);

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
      link.download = 'vision-board-2025.png';
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
        width={1920}
        height={1080}
        style={{ display: 'none' }}
      />

      {/* Visible Vision Board - Scales to fit screen */}
      <div
        ref={containerRef}
        className="relative w-full mx-auto overflow-hidden"
        style={{
          backgroundColor: '#f5f1ed',
          aspectRatio: '16 / 9',
          maxWidth: '1920px',
          maxHeight: '1080px'
        }}
      >
        {/* Grid Images - 13 tiles */}
        {images.slice(0, 13).map((image, idx) => {
          const pos = gridPositions[idx];
          if (!pos) return null;

          // Convert pixels to percentages for responsive scaling
          const topPercent = (pos.top / 1080) * 100;
          const leftPercent = (pos.left / 1920) * 100;
          const widthPercent = (pos.width / 1920) * 100;
          const heightPercent = (pos.height / 1080) * 100;

          return (
            <div
              key={idx}
              className="absolute overflow-hidden"
              style={{
                top: `${topPercent}%`,
                left: `${leftPercent}%`,
                width: `${widthPercent}%`,
                height: `${heightPercent}%`,
              }}
            >
              {/* Image with cover fit */}
              <img
                src={image}
                alt={`Vision ${idx + 1}`}
                className="w-full h-full"
                style={{
                  objectFit: 'cover',
                  width: '100%',
                  height: '100%'
                }}
              />

              {/* Keyword label (beige box in corner) */}
              {pos.keyword && (
                <div
                  className="absolute flex items-center justify-center"
                  style={{
                    bottom: '15px',
                    right: '15px',
                    width: '140px',
                    height: '50px',
                    backgroundColor: 'rgba(214, 193, 177, 0.9)',
                  }}
                >
                  <span className="text-white font-bold text-base uppercase tracking-wide">
                    {pos.keyword}
                  </span>
                </div>
              )}
            </div>
          );
        })}

        {/* Center Card (beige with white text) */}
        <div
          className="absolute flex flex-col items-center justify-center"
          style={{
            top: '33.33%',
            left: '20.31%',
            width: '32.29%',
            height: '31.48%',
            backgroundColor: '#d6c1b1',
          }}
        >
          <div className="text-white text-4xl mb-8">+</div>
          <div className="text-white text-6xl font-bold mb-4">2025</div>
          <div className="text-white text-4xl font-bold">VISION</div>
          <div className="text-white text-4xl font-bold mb-8">BOARD</div>
          <div className="text-white text-4xl">+</div>
        </div>
      </div>
    </>
  );
}
