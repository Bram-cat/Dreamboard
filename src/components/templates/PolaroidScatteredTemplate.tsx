"use client";

import React, { useRef, useEffect } from "react";

interface PolaroidScatteredTemplateProps {
  images: string[]; // 15 images (8 DALL-E + 7 Gemini)
  quotes: string[];
}

export default function PolaroidScatteredTemplate({
  images,
  quotes,
}: PolaroidScatteredTemplateProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Polaroid scrapbook layout - 15 images scattered with center card
  const gridPositions = [
    // Top row - 5 frames
    { top: 10, left: 10, width: 360, height: 290, rotation: -4, label: "" },
    { top: 20, left: 390, width: 350, height: 280, rotation: 3, label: "" },
    { top: 15, left: 760, width: 340, height: 270, rotation: -2, label: "" },
    { top: 25, left: 1120, width: 360, height: 290, rotation: 5, label: "" },
    { top: 12, left: 1500, width: 380, height: 300, rotation: -3, label: "" },

    // Middle row - 4 frames (around center card)
    { top: 330, left: 15, width: 350, height: 280, rotation: 4, label: "" },
    { top: 340, left: 385, width: 340, height: 270, rotation: -3, label: "" },
    // CENTER CARD SPACE
    { top: 335, left: 1140, width: 350, height: 280, rotation: 3, label: "" },
    { top: 350, left: 1510, width: 360, height: 290, rotation: -4, label: "" },

    // Bottom row - 6 frames
    { top: 640, left: 10, width: 340, height: 270, rotation: -5, label: "" },
    { top: 655, left: 370, width: 350, height: 280, rotation: 4, label: "" },
    { top: 645, left: 740, width: 360, height: 290, rotation: -2, label: "" },
    { top: 660, left: 1120, width: 340, height: 270, rotation: 3, label: "" },
    { top: 650, left: 1480, width: 350, height: 280, rotation: -4, label: "" },
    { top: 670, left: 220, width: 330, height: 260, rotation: 5, label: "" },
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

      // Draw all polaroid frames with rotation (max 15 frames)
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

      // Draw center card (SMALLER, redesigned) - scrapbook style
      const centerW = 320;
      const centerH = 300;
      const centerX = (1920 - centerW) / 2; // 800px - horizontally centered
      const centerY = (1080 - centerH) / 2; // 390px - vertically centered

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

      // Decorative stars - top (smaller card)
      ctx.fillStyle = '#2a2a2a';
      ctx.font = '24px Arial';
      ctx.textAlign = 'center';
      ctx.fillText('★', -60, -105);
      ctx.fillText('★', 60, -105);

      // Center text - scaled for smaller card
      ctx.fillStyle = '#2a2a2a';
      ctx.font = 'bold 52px Arial, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('2025', 0, -30);

      ctx.font = 'italic 20px "Brush Script MT", cursive, Georgia';
      ctx.fillText('VISION BOARD', 0, 5);

      // Wavy line decoration - below text
      ctx.strokeStyle = '#2a2a2a';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(-70, 40);
      ctx.quadraticCurveTo(-35, 35, 0, 40);
      ctx.quadraticCurveTo(35, 45, 70, 40);
      ctx.stroke();

      // Bottom star
      ctx.font = '24px Arial';
      ctx.fillText('★', 0, 100);

      ctx.restore();

      // NO QUOTES - Focus on frame arrangement only
    };

    renderToCanvas();
  }, [images]);

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

        {/* NO QUOTES - Focus on frame arrangement only */}

        {/* Center Card - SMALLER and Properly Centered */}
        <div
          className="absolute flex flex-col items-center justify-center bg-white"
          style={{
            top: '50%',
            left: '50%',
            width: '16.7%',
            height: '27.8%',
            transform: 'translate(-50%, -50%) rotate(-2deg)',
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
          <div style={{
            position: 'absolute',
            top: '12%',
            fontSize: '1.25vw',
            color: '#2a2a2a',
            display: 'flex',
            gap: '3.2vw'
          }}>
            <span>★</span>
            <span>★</span>
          </div>

          {/* Main Text Container */}
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '0.2vw',
            marginTop: '-0.5vw'
          }}>
            <div style={{
              fontSize: '2.7vw',
              fontWeight: 'bold',
              color: '#2a2a2a',
              lineHeight: '1'
            }}>
              2025
            </div>
            <div style={{
              fontFamily: '"Brush Script MT", cursive, Georgia',
              fontStyle: 'italic',
              fontSize: '1.05vw',
              color: '#2a2a2a',
              marginTop: '0.3vw'
            }}>
              VISION BOARD
            </div>
          </div>

          {/* Bottom Star */}
          <div style={{
            position: 'absolute',
            bottom: '12%',
            fontSize: '1.25vw',
            color: '#2a2a2a'
          }}>
            ★
          </div>

          {/* Wavy Line */}
          <svg style={{
            position: 'absolute',
            bottom: '20%',
            width: '50%'
          }} height="12" viewBox="0 0 100 10">
            <path d="M0,5 Q25,0 50,5 T100,5" stroke="#2a2a2a" strokeWidth="1.5" fill="none" />
          </svg>
        </div>
      </div>
    </>
  );
}
