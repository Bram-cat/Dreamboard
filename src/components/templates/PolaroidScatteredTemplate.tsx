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

  // Scrapbook style polaroid layout - Rotated frames with overlaps
  // Reference: second image style with angled polaroids
  const gridPositions = [
    // Top row - scattered polaroids
    { top: 20, left: 30, width: 320, height: 280, rotation: -8, label: "" },
    { top: 50, left: 380, width: 280, height: 240, rotation: 5, label: "" },
    { top: 30, left: 690, width: 300, height: 260, rotation: -3, label: "Just living my best life" },
    { top: 60, left: 1020, width: 260, height: 220, rotation: 7, label: "" },
    { top: 40, left: 1310, width: 300, height: 260, rotation: -5, label: "MY DREAMS" },
    { top: 70, left: 1640, width: 240, height: 200, rotation: 4, label: "" },

    // Middle row - overlapping polaroids
    { top: 340, left: 50, width: 280, height: 240, rotation: 6, label: "TRAVEL" },
    { top: 370, left: 360, width: 260, height: 220, rotation: -7, label: "" },
    { top: 350, left: 1050, width: 280, height: 240, rotation: 5, label: "" },
    { top: 380, left: 1360, width: 300, height: 260, rotation: -4, label: "" },

    // Bottom row - final scattered polaroids
    { top: 640, left: 30, width: 300, height: 260, rotation: -5, label: "Inspiration" },
    { top: 670, left: 360, width: 280, height: 240, rotation: 3, label: "" },
    { top: 650, left: 1080, width: 260, height: 220, rotation: -6, label: "" },
    { top: 680, left: 1370, width: 280, height: 240, rotation: 8, label: "" },
    { top: 660, left: 1680, width: 240, height: 200, rotation: -4, label: "Happiness" },
  ];

  // Handwritten text overlays and decorative elements
  const textOverlays = [
    { text: "towards my ultimate freedom", top: 420, left: 680, rotation: -2, fontSize: 32 },
    { text: "Stop dreaming and start doing", top: 880, left: 1200, rotation: 3, fontSize: 22 },
  ];

  // Inspirational quote positions - Handwritten style
  const quotePositions = [
    { top: 320, left: 680, maxWidth: 280, rotation: -2 },    // Center area
    { top: 940, left: 80, maxWidth: 300, rotation: 1 },      // Bottom left
    { top: 940, left: 1450, maxWidth: 300, rotation: -1 },   // Bottom right
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

      // Draw all polaroid frames with rotation
      for (let idx = 0; idx < Math.min(15, images.length); idx++) {
        const pos = gridPositions[idx];
        if (!pos) continue;

        try {
          const img = await loadImage(images[idx]);

          ctx.save();

          // Translate to polaroid center and rotate
          const centerX = pos.left + pos.width / 2;
          const centerY = pos.top + pos.height / 2;
          ctx.translate(centerX, centerY);
          ctx.rotate((pos.rotation * Math.PI) / 180);

          // Draw white polaroid frame (larger than image)
          const frameWidth = pos.width + 40;
          const frameHeight = pos.height + 60; // Extra space at bottom for label
          ctx.fillStyle = '#ffffff';
          ctx.shadowColor = 'rgba(0, 0, 0, 0.3)';
          ctx.shadowBlur = 15;
          ctx.shadowOffsetX = 5;
          ctx.shadowOffsetY = 5;
          ctx.fillRect(-frameWidth / 2, -frameHeight / 2, frameWidth, frameHeight);
          ctx.shadowColor = 'transparent';

          // Draw image inside polaroid frame
          const imgRatio = img.width / img.height;
          const boxRatio = pos.width / pos.height;
          let drawWidth, drawHeight;

          if (imgRatio > boxRatio) {
            drawHeight = pos.height;
            drawWidth = drawHeight * imgRatio;
          } else {
            drawWidth = pos.width;
            drawHeight = drawWidth / imgRatio;
          }

          // Center image within frame
          const imgX = -pos.width / 2;
          const imgY = -frameHeight / 2 + 20; // 20px from top edge

          ctx.save();
          ctx.beginPath();
          ctx.rect(imgX, imgY, pos.width, pos.height);
          ctx.clip();
          ctx.drawImage(img, imgX - (drawWidth - pos.width) / 2, imgY - (drawHeight - pos.height) / 2, drawWidth, drawHeight);
          ctx.restore();

          // Draw label if exists (handwritten style)
          if (pos.label) {
            ctx.fillStyle = '#2a2a2a';
            ctx.font = 'italic 22px "Brush Script MT", cursive, Georgia';
            ctx.textAlign = 'center';
            ctx.fillText(pos.label, 0, frameHeight / 2 - 15);
          }

          ctx.restore();
        } catch (error) {
          console.error(`Failed to load image ${idx}:`, error);
        }
      }

      // Draw center card (beige with decorative border) - scrapbook style
      const centerX = 680;
      const centerY = 320;
      const centerW = 380;
      const centerH = 360;

      ctx.save();
      ctx.translate(centerX + centerW / 2, centerY + centerH / 2);
      ctx.rotate(-2 * Math.PI / 180); // Slight rotation

      // White background with shadow
      ctx.fillStyle = '#ffffff';
      ctx.shadowColor = 'rgba(0, 0, 0, 0.25)';
      ctx.shadowBlur = 12;
      ctx.shadowOffsetX = 4;
      ctx.shadowOffsetY = 4;
      ctx.fillRect(-centerW / 2, -centerH / 2, centerW, centerH);
      ctx.shadowColor = 'transparent';

      // Purple border
      ctx.strokeStyle = '#8b5cf6';
      ctx.lineWidth = 6;
      ctx.strokeRect(-centerW / 2 + 10, -centerH / 2 + 10, centerW - 20, centerH - 20);

      // Decorative stars
      ctx.fillStyle = '#2a2a2a';
      ctx.font = '32px Arial';
      ctx.textAlign = 'center';
      ctx.fillText('★', -100, -120);
      ctx.fillText('★', 100, -120);
      ctx.fillText('★', 0, 140);

      // Center text
      ctx.fillStyle = '#2a2a2a';
      ctx.font = 'bold 72px Arial, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('2025', 0, -20);

      ctx.font = '28px "Brush Script MT", cursive, Georgia';
      ctx.fillText('VISION BOARD', 0, 30);

      // Wavy line decoration
      ctx.strokeStyle = '#2a2a2a';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(-100, 80);
      ctx.quadraticCurveTo(-50, 70, 0, 80);
      ctx.quadraticCurveTo(50, 90, 100, 80);
      ctx.stroke();

      ctx.restore();

      // Draw handwritten text overlays
      textOverlays.forEach(overlay => {
        ctx.save();
        ctx.translate(overlay.left, overlay.top);
        ctx.rotate((overlay.rotation * Math.PI) / 180);

        ctx.fillStyle = '#2a2a2a';
        ctx.font = `italic ${overlay.fontSize}px "Brush Script MT", cursive, Georgia`;
        ctx.textAlign = 'center';
        ctx.fillText(overlay.text, 0, 0);

        ctx.restore();
      });

      // Draw inspirational quotes - handwritten style with rotation
      quotes.slice(0, 3).forEach((quote, idx) => {
        const pos = quotePositions[idx];
        if (!pos) return;

        ctx.save();
        ctx.translate(pos.left, pos.top);
        ctx.rotate((pos.rotation * Math.PI) / 180);

        // Measure quote dimensions
        ctx.font = 'italic 24px "Brush Script MT", cursive, Georgia';
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

        // Draw text (handwritten style, no background)
        ctx.fillStyle = '#2a2a2a';
        ctx.textAlign = 'left';
        let y = 0;
        const lineHeight = 34;

        lines.forEach(textLine => {
          ctx.fillText(textLine, 0, y);
          y += lineHeight;
        });

        ctx.restore();
      });
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
        {/* Polaroid Frames - Rotated Scrapbook Style */}
        {images.slice(0, 15).map((image, idx) => {
          const pos = gridPositions[idx];
          if (!pos) return null;

          const topPercent = (pos.top / 1080) * 100;
          const leftPercent = (pos.left / 1920) * 100;
          const widthPercent = ((pos.width + 40) / 1920) * 100;
          const heightPercent = ((pos.height + 60) / 1080) * 100;

          return (
            <div
              key={idx}
              className="absolute"
              style={{
                top: `${topPercent}%`,
                left: `${leftPercent}%`,
                width: `${widthPercent}%`,
                height: `${heightPercent}%`,
                transform: `rotate(${pos.rotation}deg)`,
                transformOrigin: 'center center',
              }}
            >
              {/* White Polaroid Frame */}
              <div
                className="w-full h-full bg-white relative"
                style={{
                  boxShadow: '5px 5px 15px rgba(0, 0, 0, 0.3)',
                  padding: '2% 2% 6% 2%', // Extra padding at bottom
                }}
              >
                {/* Image */}
                <img
                  src={image}
                  alt={`Vision ${idx + 1}`}
                  className="w-full"
                  style={{
                    objectFit: 'cover',
                    height: '85%',
                  }}
                />

                {/* Label */}
                {pos.label && (
                  <div
                    className="absolute bottom-2 w-full text-center"
                    style={{
                      fontFamily: '"Brush Script MT", cursive, Georgia',
                      fontStyle: 'italic',
                      fontSize: '1.1vw',
                      color: '#2a2a2a',
                    }}
                  >
                    {pos.label}
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {/* Handwritten Text Overlays */}
        {textOverlays.map((overlay, idx) => (
          <div
            key={`overlay-${idx}`}
            className="absolute"
            style={{
              top: `${(overlay.top / 1080) * 100}%`,
              left: `${(overlay.left / 1920) * 100}%`,
              transform: `rotate(${overlay.rotation}deg)`,
              fontFamily: '"Brush Script MT", cursive, Georgia',
              fontStyle: 'italic',
              fontSize: `${(overlay.fontSize / 1920) * 100}vw`,
              color: '#2a2a2a',
              whiteSpace: 'nowrap',
            }}
          >
            {overlay.text}
          </div>
        ))}

        {/* Inspirational Quotes - Handwritten Style */}
        {quotes.slice(0, 3).map((quote, idx) => {
          const pos = quotePositions[idx];
          if (!pos) return null;

          return (
            <div
              key={`quote-${idx}`}
              className="absolute"
              style={{
                top: `${(pos.top / 1080) * 100}%`,
                left: `${(pos.left / 1920) * 100}%`,
                width: `${(pos.maxWidth / 1920) * 100}%`,
                transform: `rotate(${pos.rotation}deg)`,
                fontFamily: '"Brush Script MT", cursive, Georgia',
                fontStyle: 'italic',
                fontSize: '1.25vw',
                lineHeight: '1.5',
                color: '#2a2a2a',
              }}
            >
              {quote}
            </div>
          );
        })}

        {/* Center Card - Scrapbook Style with Border */}
        <div
          className="absolute flex flex-col items-center justify-center bg-white"
          style={{
            top: '29.63%',
            left: '35.42%',
            width: '19.79%',
            height: '33.33%',
            transform: 'rotate(-2deg)',
            boxShadow: '4px 4px 12px rgba(0, 0, 0, 0.25)',
          }}
        >
          {/* Purple Border */}
          <div
            style={{
              position: 'absolute',
              top: '10px',
              left: '10px',
              right: '10px',
              bottom: '10px',
              border: '6px solid #8b5cf6',
            }}
          />

          {/* Decorative Stars */}
          <div style={{ position: 'absolute', top: '15%', fontSize: '2vw', color: '#2a2a2a' }}>
            ★ &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; ★
          </div>

          {/* Main Text */}
          <div style={{ fontSize: '3.75vw', fontWeight: 'bold', color: '#2a2a2a', marginBottom: '0.5vw' }}>
            2025
          </div>
          <div style={{
            fontFamily: '"Brush Script MT", cursive, Georgia',
            fontStyle: 'italic',
            fontSize: '1.45vw',
            color: '#2a2a2a',
          }}>
            VISION BOARD
          </div>

          {/* Bottom Star */}
          <div style={{ position: 'absolute', bottom: '15%', fontSize: '2vw', color: '#2a2a2a' }}>
            ★
          </div>

          {/* Wavy Line */}
          <svg style={{ position: 'absolute', bottom: '10%', width: '60%' }} height="20">
            <path d="M0,10 Q25,5 50,10 T100,10" stroke="#2a2a2a" strokeWidth="2" fill="none" />
          </svg>
        </div>
      </div>
    </>
  );
}
