"use client";

import React, { useRef, useEffect } from "react";

interface MagazineCollageTemplateProps {
  images: string[]; // 13 personalized images (all Gemini) - reduced to fit around center card
  keywords: string[];
}

export default function MagazineCollageTemplate({
  images,
  keywords,
}: MagazineCollageTemplateProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // TIGHT-FIT Magazine collage - 13 visible images properly arranged around center card
  // Compact layout with center "2025 VISION BOARD" card - LARGER FRAMES to fill gaps
  const collagePositions = [
    // Top row - 6 images (much larger frames, overlapping edges)
    { top: 5, left: 5, width: 280, height: 200, rotate: -3, zIndex: 20 },
    { top: 8, left: 270, width: 280, height: 200, rotate: 2, zIndex: 21 },
    { top: 5, left: 535, width: 280, height: 200, rotate: -2, zIndex: 22 },
    { top: 8, left: 800, width: 280, height: 200, rotate: 3, zIndex: 23 },
    { top: 5, left: 1065, width: 280, height: 200, rotate: -2, zIndex: 24 },
    { top: 8, left: 1330, width: 285, height: 200, rotate: 3, zIndex: 25 },

    // Middle row - 4 images around center card (much larger frames)
    { top: 195, left: 5, width: 280, height: 200, rotate: 2, zIndex: 26 },
    { top: 200, left: 270, width: 280, height: 200, rotate: -3, zIndex: 27 },
    // CENTER CARD SPACE (540x210, 280x200) - NO IMAGES HERE
    { top: 195, left: 1055, width: 280, height: 200, rotate: 3, zIndex: 28 },
    { top: 200, left: 1330, width: 285, height: 200, rotate: -2, zIndex: 29 },

    // Bottom row - 3 images (MUCH larger to fill all bottom space)
    { top: 415, left: 5, width: 530, height: 200, rotate: -2, zIndex: 30 },
    { top: 418, left: 545, width: 530, height: 200, rotate: 3, zIndex: 31 },
    { top: 415, left: 1085, width: 530, height: 200, rotate: -3, zIndex: 32 },
  ];

  // Canvas rendering for download
  useEffect(() => {
    const renderToCanvas = async () => {
      if (!canvasRef.current || images.length === 0) return;

      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      // Set canvas size - Compact tight-fit layout
      canvas.width = 1620;
      canvas.height = 620;

      // Draw cork board background
      ctx.fillStyle = '#d4a574';
      ctx.fillRect(0, 0, 1620, 620);

      // Add texture (noise pattern)
      for (let i = 0; i < 3500; i++) {
        const x = Math.random() * 1620;
        const y = Math.random() * 620;
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

          // Draw white photo border with shadow
          ctx.fillStyle = '#ffffff';
          ctx.shadowColor = 'rgba(0, 0, 0, 0.4)';
          ctx.shadowBlur = 15;
          ctx.shadowOffsetX = 3;
          ctx.shadowOffsetY = 3;
          ctx.fillRect(0, 0, pos.width, pos.height);
          ctx.shadowColor = 'transparent';

          // Draw image inside the border
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

          // Draw tape decorations AFTER image (so they appear on top)
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

          ctx.restore();
        } catch (error) {
          console.error(`Failed to load image ${idx}:`, error);
        }
      }

      // Draw center "2025 VISION BOARD" card
      const centerX = 540;
      const centerY = 210;
      const centerW = 280;
      const centerH = 200;

      ctx.save();
      ctx.translate(centerX + centerW / 2, centerY + centerH / 2);
      ctx.rotate(0); // No rotation for center card

      // White background card
      ctx.fillStyle = '#ffffff';
      ctx.shadowColor = 'rgba(0, 0, 0, 0.3)';
      ctx.shadowBlur = 20;
      ctx.shadowOffsetX = 4;
      ctx.shadowOffsetY = 4;
      ctx.fillRect(-centerW / 2, -centerH / 2, centerW, centerH);
      ctx.shadowColor = 'transparent';

      // Purple border
      ctx.strokeStyle = '#8b5cf6';
      ctx.lineWidth = 5;
      ctx.strokeRect(-centerW / 2 + 12, -centerH / 2 + 12, centerW - 24, centerH - 24);

      // Decorative stars at top
      ctx.fillStyle = '#2a2a2a';
      ctx.font = '20px Arial';
      ctx.textAlign = 'center';
      ctx.fillText('★', -50, -65);
      ctx.fillText('★', 50, -65);

      // "2025" text
      ctx.fillStyle = '#2a2a2a';
      ctx.font = 'bold 48px Arial, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('2025', 0, -15);

      // "VISION BOARD" text
      ctx.font = 'italic 18px "Brush Script MT", cursive, Georgia';
      ctx.fillText('VISION BOARD', 0, 15);

      // Wavy line decoration
      ctx.strokeStyle = '#2a2a2a';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(-60, 45);
      ctx.quadraticCurveTo(-30, 40, 0, 45);
      ctx.quadraticCurveTo(30, 50, 60, 45);
      ctx.stroke();

      // Bottom star
      ctx.font = '20px Arial';
      ctx.fillText('★', 0, 75);

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
        width={1620}
        height={620}
        style={{ display: 'none' }}
      />

      {/* Visible Vision Board - Compact tight-fit layout */}
      <div
        ref={containerRef}
        className="relative w-[1620px] h-[620px] mx-auto overflow-hidden"
        style={{
          backgroundColor: '#d4a574',
          backgroundImage: 'url("data:image/svg+xml,%3Csvg width="100" height="100" xmlns="http://www.w3.org/2000/svg"%3E%3Cfilter id="noise"%3E%3CfeTurbulence baseFrequency="0.9" /%3E%3C/filter%3E%3Crect width="100" height="100" filter="url(%23noise)" opacity="0.1" /%3E%3C/svg%3E")',
        }}
      >
        {/* Collage Images - 13 total (around center card) */}
        {images.slice(0, 13).map((image, idx) => {
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

        {/* Center "2025 VISION BOARD" Card */}
        <div
          className="absolute bg-white shadow-2xl flex flex-col items-center justify-center"
          style={{
            top: '210px',
            left: '540px',
            width: '280px',
            height: '200px',
            zIndex: 100,
          }}
        >
          {/* Purple Border */}
          <div
            style={{
              position: 'absolute',
              top: '12px',
              left: '12px',
              right: '12px',
              bottom: '12px',
              border: '5px solid #8b5cf6',
            }}
          />

          {/* Decorative Stars at top */}
          <div style={{
            position: 'absolute',
            top: '18%',
            fontSize: '20px',
            color: '#2a2a2a',
            display: 'flex',
            gap: '100px'
          }}>
            <span>★</span>
            <span>★</span>
          </div>

          {/* Main Text Container */}
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '8px',
            marginTop: '0'
          }}>
            <div style={{
              fontSize: '48px',
              fontWeight: 'bold',
              color: '#2a2a2a',
              lineHeight: '1'
            }}>
              2025
            </div>
            <div style={{
              fontFamily: '"Brush Script MT", cursive, Georgia',
              fontStyle: 'italic',
              fontSize: '18px',
              color: '#2a2a2a',
            }}>
              VISION BOARD
            </div>
          </div>

          {/* Wavy Line */}
          <svg style={{
            position: 'absolute',
            bottom: '22%',
            width: '50%'
          }} height="12" viewBox="0 0 100 10">
            <path d="M0,5 Q25,0 50,5 T100,5" stroke="#2a2a2a" strokeWidth="1.5" fill="none" />
          </svg>

          {/* Bottom Star */}
          <div style={{
            position: 'absolute',
            bottom: '12%',
            fontSize: '20px',
            color: '#2a2a2a'
          }}>
            ★
          </div>
        </div>
      </div>
    </>
  );
}
