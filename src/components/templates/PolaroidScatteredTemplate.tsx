"use client";

import React, { useRef, useEffect } from "react";

interface PolaroidScatteredTemplateProps {
  images: string[]; // 20 images (10 DALL-E + 10 Gemini)
  quotes: string[];
}

export default function PolaroidScatteredTemplate({
  images,
  quotes,
}: PolaroidScatteredTemplateProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Balanced grid layout - More square/proportional for 1920x1080
  // Better spacing and more symmetrical arrangement
  const gridPositions = [
    // Row 1 - 3 tiles across top (left side)
    { top: 30, left: 30, width: 380, height: 300 },
    { top: 30, left: 430, width: 380, height: 300 },
    { top: 30, left: 830, width: 380, height: 300 },

    // Row 2 - Left side tiles + CENTER CARD space
    { top: 350, left: 30, width: 380, height: 320 },
    { top: 350, left: 430, width: 380, height: 320 },
    // CENTER CARD: 850-1400 x 350-690

    // Row 3 - Bottom row (left side)
    { top: 690, left: 30, width: 380, height: 320 },
    { top: 690, left: 430, width: 380, height: 320 },
    { top: 690, left: 830, width: 380, height: 320 },

    // Right side - Vertical arrangement
    { top: 30, left: 1230, width: 320, height: 240 },
    { top: 290, left: 1230, width: 320, height: 240 },
    { top: 550, left: 1230, width: 320, height: 240 },
    { top: 810, left: 1230, width: 320, height: 200 },

    // Far right column
    { top: 30, left: 1570, width: 320, height: 320 },
    { top: 370, left: 1570, width: 320, height: 320 },
    { top: 710, left: 1570, width: 320, height: 300 },
  ];

  // Inspirational quote positions - More visible in empty spaces
  const quotePositions = [
    { top: 360, left: 860, maxWidth: 240 },    // Near center card top
    { top: 600, left: 860, maxWidth: 240 },    // Near center card bottom
    { top: 1035, left: 50, maxWidth: 350 },    // Bottom left
    { top: 1035, left: 860, maxWidth: 350 },   // Bottom center
    { top: 1035, left: 1500, maxWidth: 350 },  // Bottom right
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

          ctx.restore();
        } catch (error) {
          console.error(`Failed to load image ${idx}:`, error);
        }
      }

      // Draw center card (beige with white text) - positioned for balanced layout
      const centerX = 850;
      const centerY = 350;
      const centerW = 550;
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

      // Draw inspirational quotes in empty spaces with background
      ctx.save();

      quotes.slice(0, 5).forEach((quote, idx) => {
        const pos = quotePositions[idx];
        if (!pos) return;

        // Measure quote dimensions for background
        ctx.font = 'italic bold 26px Georgia, serif';
        const words = quote.split(' ');
        const lines: string[] = [];
        let line = '';

        for (let i = 0; i < words.length; i++) {
          const testLine = line + words[i] + ' ';
          const metrics = ctx.measureText(testLine);

          if (metrics.width > pos.maxWidth && i > 0) {
            lines.push(line.trim());
            line = words[i] + ' ';
          } else {
            line = testLine;
          }
        }
        if (line.trim()) lines.push(line.trim());

        // Draw semi-transparent background
        const lineHeight = 38;
        const padding = 12;
        const bgHeight = (lines.length * lineHeight) + (padding * 2);
        const bgWidth = pos.maxWidth + (padding * 2);

        ctx.fillStyle = 'rgba(255, 255, 255, 0.75)';
        ctx.fillRect(pos.left - padding, pos.top - padding - 10, bgWidth, bgHeight);

        // Draw text
        ctx.fillStyle = '#5a4a3a'; // Darker brown for better visibility
        ctx.textAlign = 'left';
        let y = pos.top + 18;

        lines.forEach(textLine => {
          ctx.fillText(textLine, pos.left, y);
          y += lineHeight;
        });
      });

      ctx.restore();
    };

    renderToCanvas();
  }, [images, quotes]);

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
            </div>
          );
        })}

        {/* Inspirational Quotes in empty spaces with background */}
        {quotes.slice(0, 5).map((quote, idx) => {
          const pos = quotePositions[idx];
          if (!pos) return null;

          const topPercent = (pos.top / 1080) * 100;
          const leftPercent = (pos.left / 1920) * 100;
          const widthPercent = ((pos.maxWidth + 24) / 1920) * 100;

          return (
            <div
              key={`quote-${idx}`}
              className="absolute"
              style={{
                top: `${topPercent}%`,
                left: `${leftPercent}%`,
                width: `${widthPercent}%`,
                backgroundColor: 'rgba(255, 255, 255, 0.75)',
                padding: '0.6vw',
                color: '#5a4a3a',
                fontFamily: 'Georgia, serif',
                fontStyle: 'italic',
                fontWeight: 'bold',
                fontSize: '1.35vw',
                lineHeight: '1.5',
                transform: 'translateY(-1%)',
              }}
            >
              {quote}
            </div>
          );
        })}

        {/* Center Card (beige with white text) */}
        <div
          className="absolute flex flex-col items-center justify-center"
          style={{
            top: '32.41%',
            left: '44.27%',
            width: '28.65%',
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
