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

  // Randomly select 4 quotes from the pool
  const getRandomQuotes = () => {
    const shuffled = [...quotePool].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, 4);
  };

  // Use useMemo to maintain same quotes on re-renders
  const selectedQuotes = React.useMemo(() => getRandomQuotes(), []);

  // TIGHT-FIT Magazine collage - 13 visible images properly arranged around center card
  // Scaled to 1200px width (74% of original 1620px) for laptop screens
  const collagePositions = [
    // Top row - 6 LARGE images (overlapping, filling entire top)
    { top: 0, left: 0, width: 237, height: 167, rotate: -3, zIndex: 20 },
    { top: 4, left: 215, width: 237, height: 167, rotate: 2, zIndex: 21 },
    { top: 0, left: 430, width: 237, height: 167, rotate: -2, zIndex: 22 },
    { top: 4, left: 645, width: 237, height: 167, rotate: 3, zIndex: 23 },
    { top: 0, left: 860, width: 237, height: 167, rotate: -2, zIndex: 24 },
    { top: 4, left: 1075, width: 125, height: 167, rotate: 3, zIndex: 25 },

    // Middle row - 4 LARGE images around center card
    { top: 156, left: 0, width: 237, height: 167, rotate: 2, zIndex: 26 },
    { top: 160, left: 215, width: 193, height: 163, rotate: -3, zIndex: 27 },
    // CENTER CARD SPACE (400x156, 207x148) - NO IMAGES HERE
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

          // Draw image inside the border with proper scaling to cover the frame (true cover mode)
          const padding = 12;
          const imgRatio = img.width / img.height;
          const boxRatio = (pos.width - padding * 2) / (pos.height - padding * 2);
          let drawWidth, drawHeight, drawX, drawY;

          // Always fill the frame completely (cover mode - image fills entire space)
          if (imgRatio > boxRatio) {
            // Image is wider - match height, let width overflow
            drawHeight = pos.height - padding * 2;
            drawWidth = drawHeight * imgRatio;
            drawX = padding - (drawWidth - (pos.width - padding * 2)) / 2;
            drawY = padding;
          } else {
            // Image is taller - match width, let height overflow
            drawWidth = pos.width - padding * 2;
            drawHeight = drawWidth / imgRatio;
            drawX = padding;
            drawY = padding - (drawHeight - (pos.height - padding * 2)) / 2;
          }

          // Clip to ensure image doesn't overflow
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

      // Add inspirational quotes in containers - positioned between images with transparent backgrounds
      const quotePositions = [
        { x: 600, y: 230, size: 15, rotation: -2, width: 95, height: 70, radius: 8, transparent: true }, // Center area (red marked zone)
        { x: 215, y: 140, size: 14, rotation: 3, width: 90, height: 65, radius: 6, transparent: false }, // Between top-left and middle-left
        { x: 1030, y: 140, size: 14, rotation: -3, width: 90, height: 65, radius: 6, transparent: false }, // Between top-right and middle-right
        { x: 600, y: 380, size: 14, rotation: 2, width: 90, height: 65, radius: 6, transparent: false }, // Between middle and bottom center
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

        // Fill background - transparent for center quote, white for others
        if (quote.transparent) {
          // Transparent background - no fill, no border
          ctx.shadowColor = "transparent";
        } else {
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
        }

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

      // Draw center "2025 VISION BOARD" card (scaled to 74%)
      const centerX = 400;
      const centerY = 156;
      const centerW = 207;
      const centerH = 148;

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
        {/* Collage Images - 13 total (around center card) */}
        {images.slice(0, 13).map((image, idx) => {
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

        {/* Inspirational Quotes in Containers - Positioned between images */}

        {/* Quote 1 - Center area (transparent background) - Red marked zone */}
        <div
          style={{
            position: "absolute",
            top: "195px",
            left: "555px",
            width: "95px",
            height: "70px",
            transform: "rotate(-2deg)",
            backgroundColor: "transparent",
            border: "none",
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
              fontSize: "15px",
              color: "#000000",
              textAlign: "center",
              lineHeight: "1.2",
            }}
            dangerouslySetInnerHTML={{
              __html: selectedQuotes[0].replace("\n", "<br/>"),
            }}
          />
        </div>

        {/* Quote 2 - Between top-left and middle-left */}
        <div
          style={{
            position: "absolute",
            top: "107px",
            left: "170px",
            width: "90px",
            height: "65px",
            transform: "rotate(3deg)",
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

        {/* Quote 3 - Between top-right and middle-right */}
        <div
          style={{
            position: "absolute",
            top: "107px",
            left: "985px",
            width: "90px",
            height: "65px",
            transform: "rotate(-3deg)",
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

        {/* Quote 4 - Between middle and bottom center */}
        <div
          style={{
            position: "absolute",
            top: "347px",
            left: "555px",
            width: "90px",
            height: "65px",
            transform: "rotate(2deg)",
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
              __html: selectedQuotes[3].replace("\n", "<br/>"),
            }}
          />
        </div>

        {/* Center "2025 VISION BOARD" Card */}
        <div
          className="absolute bg-white shadow-2xl flex flex-col items-center justify-center"
          style={{
            top: '156px',
            left: '400px',
            width: '207px',
            height: '148px',
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
