"use client";

import React, { useRef, useEffect } from "react";

interface MagazineCollageTemplateProps {
  images: string[]; // 14 personalized images (all Gemini) - reduced to fit around center card
  keywords: string[];
}

export default function MagazineCollageTemplate({
  images,
  keywords,
}: MagazineCollageTemplateProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Pool of inspirational quotes
  const quotePool = [
    "DREAM\nBIG",
    "MAKE IT\nHAPPEN",
    "BELIEVE",
    "YOU GOT\nTHIS",
    "HUSTLE",
    "NEVER\nGIVE UP",
    "FOCUS",
    "STAY\nSTRONG",
    "BE\nFEARLESS",
    "RISE\nABOVE",
    "KEEP\nGOING",
    "PUSH\nHARDER",
    "TAKE\nACTION",
    "STAY\nHUNGRY",
    "WORK\nHARD",
    "DREAM\nBOLD",
    "BE\nGREAT",
    "THINK\nBIG",
    "STAY\nFOCUSED",
    "GRIND\nDAILY",
    "LEVEL\nUP",
    "NO\nLIMITS",
    "STAY\nPOSITIVE",
    "CHASE\nDREAMS",
    "MAKE\nMOVES",
  ];

  // Randomly select 3 quotes from the pool (reduced from 4)
  const getRandomQuotes = () => {
    const shuffled = [...quotePool].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, 3);
  };

  // Use useMemo to maintain same quotes on re-renders
  const selectedQuotes = React.useMemo(() => getRandomQuotes(), []);

  // TIGHT-FIT Magazine collage - 14 visible images properly arranged around center card
  // Scaled to 1200px width (74% of original 1620px) for laptop screens
  const collagePositions = [
    // Top row - 6 LARGE images (overlapping, filling entire top)
    { top: 0, left: 0, width: 237, height: 167, rotate: -3, zIndex: 20 },
    { top: 4, left: 215, width: 237, height: 167, rotate: 2, zIndex: 21 },
    { top: 0, left: 430, width: 237, height: 167, rotate: -2, zIndex: 22 },
    { top: 4, left: 645, width: 237, height: 167, rotate: 3, zIndex: 23 },
    { top: 0, left: 860, width: 237, height: 167, rotate: -2, zIndex: 24 },
    { top: 4, left: 1075, width: 125, height: 167, rotate: 3, zIndex: 25 },

    // Middle row - 5 images around center card (added one where quote was)
    { top: 156, left: 0, width: 237, height: 167, rotate: 2, zIndex: 26 },
    { top: 160, left: 215, width: 193, height: 163, rotate: -3, zIndex: 27 },
    // CENTER CARD SPACE (400x156, 207x148)
    // NEW IMAGE - Right of center card (replaces transparent quote) - Lower zIndex so card shows on top
    { top: 165, left: 620, width: 160, height: 138, rotate: 3, zIndex: 27 },
    { top: 156, left: 793, width: 237, height: 167, rotate: 3, zIndex: 28 },
    { top: 160, left: 1008, width: 193, height: 163, rotate: -2, zIndex: 29 },

    // Bottom row - 3 MASSIVE images (fill entire bottom)
    { top: 312, left: 0, width: 400, height: 148, rotate: -2, zIndex: 30 },
    { top: 314, left: 400, width: 400, height: 148, rotate: 3, zIndex: 31 },
    { top: 312, left: 800, width: 400, height: 148, rotate: -3, zIndex: 32 },
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

      // Set canvas size - Laptop-friendly dimensions (fits 1366px screens)
      canvas.width = 1200;
      canvas.height = 460;

      // Draw cork board background
      ctx.fillStyle = '#d4a574';
      ctx.fillRect(0, 0, 1200, 460);

      // Add texture (noise pattern)
      for (let i = 0; i < 2500; i++) {
        const x = Math.random() * 1200;
        const y = Math.random() * 460;
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

          // Draw warm cream-toned photo border to complement cork background
          ctx.fillStyle = '#fffef9';
          ctx.shadowColor = 'rgba(80, 60, 40, 0.35)';
          ctx.shadowBlur = 15;
          ctx.shadowOffsetX = 3;
          ctx.shadowOffsetY = 3;
          ctx.fillRect(0, 0, pos.width, pos.height);
          ctx.shadowColor = 'transparent';

          // Draw image inside the border - scale to fill frame with small white border
          const padding = 12;
          const imgRatio = img.width / img.height;
          const boxRatio = (pos.width - padding * 2) / (pos.height - padding * 2);
          let drawWidth, drawHeight, drawX, drawY;

          // Cover mode but scaled to 95% to show white border - fills frame nicely
          if (imgRatio > boxRatio) {
            // Image is wider - match height, let width overflow slightly
            drawHeight = (pos.height - padding * 2) * 0.95;
            drawWidth = drawHeight * imgRatio;
            drawX = padding + (pos.width - padding * 2 - drawWidth) / 2;
            drawY = padding + (pos.height - padding * 2 - drawHeight) / 2;
          } else {
            // Image is taller - match width, let height overflow slightly
            drawWidth = (pos.width - padding * 2) * 0.95;
            drawHeight = drawWidth / imgRatio;
            drawX = padding + (pos.width - padding * 2 - drawWidth) / 2;
            drawY = padding + (pos.height - padding * 2 - drawHeight) / 2;
          }

          // Clip to ensure image doesn't overflow the frame
          ctx.save();
          ctx.beginPath();
          ctx.rect(padding, padding, pos.width - padding * 2, pos.height - padding * 2);
          ctx.clip();
          ctx.drawImage(img, drawX, drawY, drawWidth, drawHeight);
          ctx.restore();

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

      // Add inspirational quotes in containers - positioned on outer edges (reduced to 3)
      const quotePositions = [
        { x: 60, y: 50, size: 14, rotation: -4, width: 90, height: 65, radius: 6 }, // Top left corner (outside)
        { x: 1140, y: 50, size: 14, rotation: 4, width: 90, height: 65, radius: 6 }, // Top right corner (outside)
        { x: 600, y: 420, size: 14, rotation: -2, width: 90, height: 65, radius: 6 }, // Bottom center (outside)
      ];

      const inspirationalQuotes = quotePositions.map((pos, index) => ({
        text: selectedQuotes[index],
        ...pos,
      }));

      // Draw each quote container with rounded corners
      inspirationalQuotes.forEach((quote) => {
        ctx.save();
        ctx.translate(quote.x, quote.y);
        ctx.rotate((quote.rotation * Math.PI) / 180);

        // Draw rounded rectangle for white container with black border
        const x = -quote.width / 2;
        const y = -quote.height / 2;
        const radius = quote.radius;

        // Create rounded rectangle path
        ctx.beginPath();
        ctx.moveTo(x + radius, y);
        ctx.lineTo(x + quote.width - radius, y);
        ctx.quadraticCurveTo(x + quote.width, y, x + quote.width, y + radius);
        ctx.lineTo(x + quote.width, y + quote.height - radius);
        ctx.quadraticCurveTo(x + quote.width, y + quote.height, x + quote.width - radius, y + quote.height);
        ctx.lineTo(x + radius, y + quote.height);
        ctx.quadraticCurveTo(x, y + quote.height, x, y + quote.height - radius);
        ctx.lineTo(x, y + radius);
        ctx.quadraticCurveTo(x, y, x + radius, y);
        ctx.closePath();

        // White background with shadow and border
        ctx.fillStyle = "#ffffff";
        ctx.shadowColor = "rgba(0, 0, 0, 0.15)";
        ctx.shadowBlur = 8;
        ctx.shadowOffsetX = 3;
        ctx.shadowOffsetY = 3;
        ctx.fill();

        // Draw black border
        ctx.strokeStyle = "#000000";
        ctx.lineWidth = 2;
        ctx.shadowColor = "transparent";
        ctx.stroke();

        // Draw text in black using Telma font
        ctx.fillStyle = "#000000";
        ctx.font = `bold ${quote.size}px Telma, Arial, sans-serif`;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";

        // Handle multi-line text
        const lines = quote.text.split("\n");
        lines.forEach((line, index) => {
          const yOffset = (index - (lines.length - 1) / 2) * (quote.size + 3);
          ctx.fillText(line, 0, yOffset);
        });

        ctx.restore();
      });

      // Draw center "2025 VISION BOARD" card - Improved styling
      const centerX = 400;
      const centerY = 156;
      const centerW = 207;
      const centerH = 148;
      const borderRadius = 8;

      ctx.save();
      ctx.translate(centerX + centerW / 2, centerY + centerH / 2);
      ctx.rotate(0); // No rotation for center card

      // White background card with rounded corners
      const x = -centerW / 2;
      const y = -centerH / 2;

      ctx.beginPath();
      ctx.moveTo(x + borderRadius, y);
      ctx.lineTo(x + centerW - borderRadius, y);
      ctx.quadraticCurveTo(x + centerW, y, x + centerW, y + borderRadius);
      ctx.lineTo(x + centerW, y + centerH - borderRadius);
      ctx.quadraticCurveTo(x + centerW, y + centerH, x + centerW - borderRadius, y + centerH);
      ctx.lineTo(x + borderRadius, y + centerH);
      ctx.quadraticCurveTo(x, y + centerH, x, y + centerH - borderRadius);
      ctx.lineTo(x, y + borderRadius);
      ctx.quadraticCurveTo(x, y, x + borderRadius, y);
      ctx.closePath();

      ctx.fillStyle = '#ffffff';
      ctx.shadowColor = 'rgba(0, 0, 0, 0.3)';
      ctx.shadowBlur = 20;
      ctx.shadowOffsetX = 4;
      ctx.shadowOffsetY = 4;
      ctx.fill();
      ctx.shadowColor = 'transparent';

      // Gradient border (purple to pink)
      const gradient = ctx.createLinearGradient(x, y, x + centerW, y + centerH);
      gradient.addColorStop(0, '#8b5cf6');
      gradient.addColorStop(1, '#ec4899');
      ctx.strokeStyle = gradient;
      ctx.lineWidth = 4;
      ctx.strokeRect(x + 10, y + 10, centerW - 20, centerH - 20);

      // "2025" text with gradient effect (simulated with solid color)
      ctx.fillStyle = '#8b5cf6';
      ctx.font = 'bold 52px Arial, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('2025', 0, -10);

      // "VISION BOARD" text
      ctx.fillStyle = '#4a5568';
      ctx.font = 'italic 600 16px Georgia, serif';
      ctx.fillText('VISION BOARD', 0, 15);

      // Decorative underline with gradient
      const underlineGradient = ctx.createLinearGradient(-60, 0, 60, 0);
      underlineGradient.addColorStop(0, 'rgba(139, 92, 246, 0)');
      underlineGradient.addColorStop(0.3, '#8b5cf6');
      underlineGradient.addColorStop(0.7, '#ec4899');
      underlineGradient.addColorStop(1, 'rgba(236, 72, 153, 0)');

      ctx.fillStyle = underlineGradient;
      ctx.fillRect(-60, 54, 120, 2);

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
        width={1200}
        height={460}
        style={{ display: 'none' }}
      />

      {/* Visible Vision Board - Laptop-friendly size (1200px) */}
      <div
        ref={containerRef}
        className="relative w-[1200px] h-[460px] mx-auto overflow-hidden"
        style={{
          backgroundColor: '#d4a574',
          backgroundImage: 'url("data:image/svg+xml,%3Csvg width="100" height="100" xmlns="http://www.w3.org/2000/svg"%3E%3Cfilter id="noise"%3E%3CfeTurbulence baseFrequency="0.9" /%3E%3C/filter%3E%3Crect width="100" height="100" filter="url(%23noise)" opacity="0.1" /%3E%3C/svg%3E")',
        }}
      >
        {/* Collage Images - 14 total (around center card) */}
        {images.slice(0, 14).map((image, idx) => {
          const pos = collagePositions[idx];
          if (!pos) return null;

          return (
            <div
              key={idx}
              className="absolute shadow-xl"
              style={{
                top: `${pos.top}px`,
                left: `${pos.left}px`,
                width: `${pos.width}px`,
                height: `${pos.height}px`,
                transform: `rotate(${pos.rotate}deg)`,
                zIndex: pos.zIndex,
                padding: '12px',
                backgroundColor: '#fffef9',
                boxShadow: '3px 3px 15px rgba(80, 60, 40, 0.35)',
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

              {/* Image - Cover mode scaled to 95% to show white border */}
              <img
                src={image}
                alt={`Vision ${idx + 1}`}
                className="w-[95%] h-[95%] m-auto"
                style={{
                  objectFit: 'cover',
                  objectPosition: 'center'
                }}
              />
            </div>
          );
        })}

        {/* Inspirational Quotes in Containers - Positioned on outer edges (3 quotes) */}

        {/* Quote 1 - Top left corner (outside) */}
        <div
          style={{
            position: "absolute",
            top: "50px",
            left: "60px",
            width: "90px",
            height: "65px",
            transform: "rotate(-4deg)",
            backgroundColor: "#ffffff",
            border: "2px solid #000000",
            borderRadius: "6px",
            boxShadow: "3px 3px 8px rgba(0,0,0,0.15)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "6px",
            zIndex: 50,
          }}
        >
          <div
            style={{
              fontFamily: "Telma, Arial, sans-serif",
              fontWeight: "bold",
              fontSize: "14px",
              color: "#000000",
              textAlign: "center",
              lineHeight: "1.2",
            }}
            dangerouslySetInnerHTML={{
              __html: selectedQuotes[0].replace("\n", "<br/>"),
            }}
          />
        </div>

        {/* Quote 2 - Top right corner (outside) */}
        <div
          style={{
            position: "absolute",
            top: "50px",
            left: "1140px",
            width: "90px",
            height: "65px",
            transform: "rotate(4deg)",
            backgroundColor: "#ffffff",
            border: "2px solid #000000",
            borderRadius: "6px",
            boxShadow: "3px 3px 8px rgba(0,0,0,0.15)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "6px",
            zIndex: 50,
          }}
        >
          <div
            style={{
              fontFamily: "Telma, Arial, sans-serif",
              fontWeight: "bold",
              fontSize: "14px",
              color: "#000000",
              textAlign: "center",
              lineHeight: "1.2",
            }}
            dangerouslySetInnerHTML={{
              __html: selectedQuotes[1].replace("\n", "<br/>"),
            }}
          />
        </div>

        {/* Quote 3 - Bottom center (outside) */}
        <div
          style={{
            position: "absolute",
            top: "420px",
            left: "600px",
            width: "90px",
            height: "65px",
            transform: "rotate(-2deg)",
            backgroundColor: "#ffffff",
            border: "2px solid #000000",
            borderRadius: "6px",
            boxShadow: "3px 3px 8px rgba(0,0,0,0.15)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "6px",
            zIndex: 50,
          }}
        >
          <div
            style={{
              fontFamily: "Telma, Arial, sans-serif",
              fontWeight: "bold",
              fontSize: "14px",
              color: "#000000",
              textAlign: "center",
              lineHeight: "1.2",
            }}
            dangerouslySetInnerHTML={{
              __html: selectedQuotes[2].replace("\n", "<br/>"),
            }}
          />
        </div>

        {/* Center "2025 VISION BOARD" Card - Improved Styling */}
        <div
          className="absolute bg-white shadow-2xl flex flex-col items-center justify-center"
          style={{
            top: '156px',
            left: '400px',
            width: '207px',
            height: '148px',
            zIndex: 100,
            borderRadius: '8px',
          }}
        >
          {/* Gradient Border */}
          <div
            style={{
              position: 'absolute',
              top: '10px',
              left: '10px',
              right: '10px',
              bottom: '10px',
              border: '4px solid',
              borderImage: 'linear-gradient(135deg, #8b5cf6, #ec4899) 1',
              borderRadius: '4px',
            }}
          />

          {/* Main Text Container */}
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '4px',
            marginTop: '0'
          }}>
            <div style={{
              fontSize: '52px',
              fontWeight: 'bold',
              background: 'linear-gradient(135deg, #8b5cf6, #ec4899)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              lineHeight: '1',
              letterSpacing: '2px',
            }}>
              2025
            </div>
            <div style={{
              fontFamily: 'Georgia, serif',
              fontStyle: 'italic',
              fontSize: '16px',
              color: '#4a5568',
              letterSpacing: '1px',
              fontWeight: '600',
            }}>
              VISION BOARD
            </div>
          </div>

          {/* Decorative underline */}
          <div style={{
            position: 'absolute',
            bottom: '20px',
            width: '60%',
            height: '2px',
            background: 'linear-gradient(to right, transparent, #8b5cf6, #ec4899, transparent)',
          }} />
        </div>
      </div>
    </>
  );
}
