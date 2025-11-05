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

  // REDESIGNED: Clean grid layout matching image.png reference
  // Large tiles (300-350px), minimal spacing, beige aesthetic
  const gridPositions = [
    // Row 1 - 3 large tiles across top
    { top: 10, left: 10, width: 310, height: 290, keyword: keywords[0] || "" },
    { top: 10, left: 340, width: 310, height: 290, keyword: "" },
    { top: 10, left: 670, width: 310, height: 290, keyword: keywords[1] || "" },

    // Row 2 - 2 tiles + CENTER CARD + 1 tile
    { top: 320, left: 10, width: 230, height: 290, keyword: "" },
    // CENTER CARD: 260-490 (230px wide) x 320-610 (290px tall)
    { top: 320, left: 750, width: 230, height: 290, keyword: keywords[2] || "" },

    // Row 3 - 3 large tiles across bottom
    { top: 630, left: 10, width: 310, height: 290, keyword: keywords[3] || "" },
    { top: 630, left: 340, width: 310, height: 290, keyword: "" },
    { top: 630, left: 670, width: 310, height: 290, keyword: keywords[4] || "" },

    // Right column - 3 tiles stacked
    { top: 10, left: 1000, width: 324, height: 200, keyword: "" },
    { top: 230, left: 1000, width: 324, height: 200, keyword: "" },
    { top: 450, left: 1000, width: 324, height: 200, keyword: "" },

    // Bottom right - 2 smaller tiles
    { top: 670, left: 1000, width: 158, height: 250, keyword: "" },
    { top: 670, left: 1172, width: 152, height: 250, keyword: "" },
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
      canvas.height = 940;

      // Draw beige background matching image.png
      ctx.fillStyle = '#f5f1ed';
      ctx.fillRect(0, 0, 1344, 940);

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

      // Draw center card (beige with white text)
      const centerX = 260;
      const centerY = 320;
      const centerW = 470;
      const centerH = 290;

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
        width={1344}
        height={940}
        style={{ display: 'none' }}
      />

      {/* Visible Vision Board */}
      <div
        ref={containerRef}
        className="relative w-[1344px] h-[940px] mx-auto overflow-hidden"
        style={{ backgroundColor: '#f5f1ed' }}
      >
        {/* Grid Images - 13 tiles */}
        {images.slice(0, 13).map((image, idx) => {
          const pos = gridPositions[idx];
          if (!pos) return null;

          return (
            <div
              key={idx}
              className="absolute overflow-hidden"
              style={{
                top: `${pos.top}px`,
                left: `${pos.left}px`,
                width: `${pos.width}px`,
                height: `${pos.height}px`,
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

        {/* Center Card (beige with white text) - matching image.png */}
        <div
          className="absolute flex flex-col items-center justify-center"
          style={{
            top: '320px',
            left: '260px',
            width: '470px',
            height: '290px',
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
