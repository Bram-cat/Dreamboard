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

  // Scrapbook style polaroid layout - COMPLETE coverage with overlapping frames
  const gridPositions = [
    // Top row - 5 overlapping frames covering full width
    { top: 0, left: 5, width: 380, height: 300, rotation: -4, label: "" },
    { top: 15, left: 395, width: 380, height: 310, rotation: 3, label: "" },
    { top: 5, left: 785, width: 360, height: 290, rotation: -3, label: "Just living my best life" },
    { top: 10, left: 1155, width: 380, height: 310, rotation: 4, label: "MY DREAMS" },
    { top: 0, left: 1545, width: 370, height: 300, rotation: -3, label: "" },

    // Middle row - Frames surrounding center card
    { top: 310, left: 0, width: 320, height: 280, rotation: 5, label: "TRAVEL" },
    { top: 330, left: 335, width: 300, height: 260, rotation: -4, label: "" },
    // CENTER CARD SPACE: 580-1040 x 280-640
    { top: 305, left: 1065, width: 340, height: 300, rotation: 3, label: "" },
    { top: 320, left: 1420, width: 320, height: 280, rotation: -5, label: "" },
    { top: 315, left: 1755, width: 160, height: 140, rotation: 4, label: "" },

    // Lower row - Fill gap between center and bottom
    { top: 605, left: 5, width: 340, height: 300, rotation: -3, label: "Inspiration" },
    { top: 620, left: 360, width: 310, height: 270, rotation: 4, label: "" },
    { top: 615, left: 685, width: 360, height: 290, rotation: -3, label: "" },
    { top: 610, left: 1060, width: 360, height: 300, rotation: 3, label: "" },
    { top: 625, left: 1435, width: 320, height: 280, rotation: -4, label: "Happiness" },

    // Bottom row - Wide frames covering entire bottom
    { top: 920, left: 10, width: 470, height: 155, rotation: 3, label: "" },
    { top: 935, left: 500, width: 440, height: 140, rotation: -2, label: "" },
    { top: 930, left: 960, width: 420, height: 145, rotation: 2, label: "" },
    { top: 925, left: 1400, width: 450, height: 150, rotation: -3, label: "" },
    { top: 920, left: 1720, width: 195, height: 155, rotation: 4, label: "" },
  ];

  // Handwritten text overlays - Fill remaining empty spaces with quotes
  const textOverlays = [
    { text: quotes[0] || "towards my ultimate freedom", top: 575, left: 720, rotation: -2, fontSize: 32 },
    { text: quotes[1] || "Stop dreaming and start doing", top: 895, left: 240, rotation: 3, fontSize: 30 },
    { text: quotes[2] || "Driving my dream car now", top: 895, left: 1760, rotation: -3, fontSize: 28 },
  ];

  // Additional decorative quote positions
  const quotePositions = [
    { top: 320, left: 665, maxWidth: 350, rotation: 2 },      // Center area above card
    { top: 570, left: 1090, maxWidth: 320, rotation: -1 },    // Center area below card
    { top: 895, left: 1180, maxWidth: 340, rotation: 1 },     // Bottom center
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
      for (let idx = 0; idx < Math.min(20, images.length); idx++) {
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
      const centerX = 580;
      const centerY = 280;
      const centerW = 460;
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
        {images.slice(0, 20).map((image, idx) => {
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
            top: '25.93%',
            left: '30.21%',
            width: '23.96%',
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
