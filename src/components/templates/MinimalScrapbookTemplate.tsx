"use client";

import React, { useRef, useEffect } from "react";

interface MinimalScrapbookTemplateProps {
  images: string[]; // 14 images (7 DALL-E + 7 Gemini)
  keywords: string[];
}

export default function MinimalScrapbookTemplate({
  images,
  keywords,
}: MinimalScrapbookTemplateProps) {
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

  // Randomly select 6 quotes from the pool
  const getRandomQuotes = () => {
    const shuffled = [...quotePool].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, 6);
  };

  // Use useMemo to maintain same quotes on re-renders
  const selectedQuotes = React.useMemo(() => getRandomQuotes(), []);

  // Minimal scrapbook positions - GENTLE ROTATIONS, IMPROVED PASTEL THEME
  // Mix of different sizes, organized but casual - softer, more harmonious colors
  // 11 images total with center space for "My 2025 Vision Board" tag
  const scrapbookPositions = [
    // Top row (large focus images) - warm pastels
    { top: 30, left: 30, width: 380, height: 280, rotate: -1.5, border: '#fde4e9', keyword: keywords[0] },
    { top: 30, left: 450, width: 420, height: 280, rotate: 1, border: '#e3f2fd', keyword: "" },
    { top: 30, left: 910, width: 400, height: 280, rotate: -0.8, border: '#fff9e6', keyword: keywords[1] },

    // Middle row (medium + small mix) - cool pastels
    { top: 340, left: 30, width: 280, height: 200, rotate: 1.2, border: '#e8f5e9', keyword: "" },
    { top: 340, left: 340, width: 240, height: 200, rotate: -1, border: '#ffe8d9', keyword: keywords[2] },
    // CENTER SPACE FOR "MY 2025 VISION BOARD" TAG
    { top: 340, left: 1030, width: 280, height: 200, rotate: 0.9, border: '#f3e5f5', keyword: "" },

    // Bottom row (varied sizes) - mixed pastels
    { top: 570, left: 30, width: 320, height: 170, rotate: -1.3, border: '#e0f7fa', keyword: "" },
    { top: 570, left: 380, width: 260, height: 170, rotate: 1.5, border: '#fce4ec', keyword: keywords[3] },
    { top: 570, left: 670, width: 300, height: 170, rotate: -0.6, border: '#f9fbe7', keyword: "" },
    { top: 570, left: 1000, width: 310, height: 170, rotate: 1.1, border: '#e8eaf6', keyword: keywords[4] },

    // Additional right image - larger accent on right side
    { top: 340, left: 820, width: 180, height: 190, rotate: -1.5, border: '#ede7f6', keyword: "" },
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

      // Set canvas size
      canvas.width = 1344;
      canvas.height = 768;

      // Draw cream background
      ctx.fillStyle = '#fffef7';
      ctx.fillRect(0, 0, 1344, 768);

      // Subtle texture
      for (let i = 0; i < 1500; i++) {
        const x = Math.random() * 1344;
        const y = Math.random() * 768;
        ctx.fillStyle = `rgba(240, 235, 220, ${Math.random() * 0.3})`;
        ctx.fillRect(x, y, 1, 1);
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

      // Draw all scrapbook images
      for (let idx = 0; idx < Math.min(14, images.length); idx++) {
        const pos = scrapbookPositions[idx];
        if (!pos) continue;

        try {
          const img = await loadImage(images[idx]);

          ctx.save();
          ctx.translate(pos.left + pos.width / 2, pos.top + pos.height / 2);
          ctx.rotate((pos.rotate * Math.PI) / 180);
          ctx.translate(-(pos.width / 2), -(pos.height / 2));

          // Draw colored border/frame
          const borderWidth = 16;
          ctx.fillStyle = pos.border;
          ctx.shadowColor = 'rgba(0, 0, 0, 0.15)';
          ctx.shadowBlur = 12;
          ctx.shadowOffsetX = 2;
          ctx.shadowOffsetY = 3;
          ctx.fillRect(0, 0, pos.width, pos.height);
          ctx.shadowColor = 'transparent';

          // Draw white inner border
          ctx.fillStyle = '#ffffff';
          ctx.fillRect(borderWidth / 2, borderWidth / 2, pos.width - borderWidth, pos.height - borderWidth);

          // Draw image with proper scaling to cover the frame (true cover mode)
          const padding = borderWidth;
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

          // Keywords removed - no captions on vision board

          ctx.restore();
        } catch (error) {
          console.error(`Failed to load image ${idx}:`, error);
        }
      }

      // Add inspirational quotes in containers - positioned between images
      const quotePositions = [
        { x: 220, y: 320, size: 16, rotation: -2, width: 100, height: 70, radius: 8 }, // Between top-left and middle-left
        { x: 700, y: 320, size: 16, rotation: 2, width: 100, height: 70, radius: 8 }, // Between top-center and center
        { x: 1170, y: 260, size: 16, rotation: -1, width: 100, height: 70, radius: 8 }, // Between top-right and middle-right
        { x: 360, y: 550, size: 16, rotation: 1, width: 100, height: 70, radius: 8 }, // Between middle and bottom left
        { x: 850, y: 550, size: 16, rotation: -2, width: 100, height: 70, radius: 8 }, // Between middle and bottom center
        { x: 1170, y: 550, size: 16, rotation: 2, width: 100, height: 70, radius: 8 }, // Between middle-right and bottom-right
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

        // Fill white background with shadow
        ctx.fillStyle = "#ffffff";
        ctx.shadowColor = "rgba(0, 0, 0, 0.15)";
        ctx.shadowBlur = 8;
        ctx.shadowOffsetX = 3;
        ctx.shadowOffsetY = 3;
        ctx.fill();

        // Draw black border
        ctx.strokeStyle = "#000000";
        ctx.lineWidth = 3;
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
          const yOffset = (index - (lines.length - 1) / 2) * (quote.size + 4);
          ctx.fillText(line, 0, yOffset);
        });

        ctx.restore();
      });

      // Draw center handwritten title
      const centerX = 600;
      const centerY = 370;

      ctx.save();
      ctx.translate(centerX, centerY);
      ctx.rotate((-1 * Math.PI) / 180);

      // Title background - semi-transparent white with border
      const titleWidth = 250;
      const titleHeight = 90;
      const titleX = -titleWidth / 2;
      const titleY = -titleHeight / 2;
      const titleRadius = 8;

      // Draw rounded rectangle background
      ctx.beginPath();
      ctx.moveTo(titleX + titleRadius, titleY);
      ctx.lineTo(titleX + titleWidth - titleRadius, titleY);
      ctx.quadraticCurveTo(titleX + titleWidth, titleY, titleX + titleWidth, titleY + titleRadius);
      ctx.lineTo(titleX + titleWidth, titleY + titleHeight - titleRadius);
      ctx.quadraticCurveTo(titleX + titleWidth, titleY + titleHeight, titleX + titleWidth - titleRadius, titleY + titleHeight);
      ctx.lineTo(titleX + titleRadius, titleY + titleHeight);
      ctx.quadraticCurveTo(titleX, titleY + titleHeight, titleX, titleY + titleHeight - titleRadius);
      ctx.lineTo(titleX, titleY + titleRadius);
      ctx.quadraticCurveTo(titleX, titleY, titleX + titleRadius, titleY);
      ctx.closePath();

      // Fill with semi-transparent white
      ctx.fillStyle = 'rgba(255, 255, 255, 0.85)';
      ctx.shadowColor = 'rgba(0, 0, 0, 0.1)';
      ctx.shadowBlur = 15;
      ctx.shadowOffsetX = 0;
      ctx.shadowOffsetY = 2;
      ctx.fill();

      // Draw border
      ctx.strokeStyle = 'rgba(139, 111, 71, 0.3)';
      ctx.lineWidth = 2;
      ctx.shadowColor = 'transparent';
      ctx.stroke();

      // Title text
      ctx.shadowColor = 'transparent';
      ctx.fillStyle = '#8b6f47';
      ctx.font = 'italic bold 36px Georgia, serif';
      ctx.textAlign = 'center';
      ctx.fillText('My 2025', 0, -5);
      ctx.font = 'italic 24px Georgia, serif';
      ctx.fillText('Vision Board', 0, 28);

      ctx.restore();

      // Draw decorative elements (washi tape corners)
      const drawWashiTape = (x: number, y: number, width: number, color: string) => {
        ctx.fillStyle = color;
        ctx.globalAlpha = 0.6;
        ctx.fillRect(x, y, width, 20);
        ctx.globalAlpha = 1;
      };

      drawWashiTape(0, 0, 200, '#ffc9e5');
      drawWashiTape(1144, 0, 200, '#c9e5ff');
      drawWashiTape(0, 748, 200, '#fffcc9');
      drawWashiTape(1144, 748, 200, '#d4ffc9');
    };

    renderToCanvas();
  }, [images, keywords]);

  // Download function
  const handleDownload = () => {
    if (!canvasRef.current) return;

    try {
      const dataUrl = canvasRef.current.toDataURL('image/png', 1.0);
      const link = document.createElement('a');
      link.download = 'vision-board-scrapbook-2025.png';
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
        height={768}
        style={{ display: 'none' }}
      />

      {/* Visible Vision Board */}
      <div
        ref={containerRef}
        className="relative w-[1344px] h-[768px] mx-auto overflow-hidden"
        style={{
          backgroundColor: '#fffef7',
        }}
      >
        {/* Washi tape decoration */}
        <div className="absolute top-0 left-0 w-[200px] h-5 bg-pink-200 opacity-60" />
        <div className="absolute top-0 right-0 w-[200px] h-5 bg-blue-200 opacity-60" />
        <div className="absolute bottom-0 left-0 w-[200px] h-5 bg-yellow-100 opacity-60" />
        <div className="absolute bottom-0 right-0 w-[200px] h-5 bg-green-100 opacity-60" />

        {/* Scrapbook Images */}
        {images.slice(0, 11).map((image, idx) => {
          const pos = scrapbookPositions[idx];
          if (!pos) return null;

          return (
            <div
              key={idx}
              className="absolute shadow-lg"
              style={{
                top: `${pos.top}px`,
                left: `${pos.left}px`,
                width: `${pos.width}px`,
                height: `${pos.height}px`,
                transform: `rotate(${pos.rotate}deg)`,
                backgroundColor: pos.border,
                padding: '8px',
              }}
            >
              {/* White inner frame */}
              <div className="w-full h-full bg-white p-2">
                {/* Image */}
                <img
                  src={image}
                  alt={`Vision ${idx + 1}`}
                  className="w-full h-full object-cover"
                  style={{ objectFit: 'cover' }}
                />
              </div>

              {/* Keywords removed - no captions displayed */}
            </div>
          );
        })}

        {/* Inspirational Quotes in Containers - Positioned between images */}

        {/* Quote 1 - Between top-left and middle-left */}
        <div
          style={{
            position: "absolute",
            top: "285px",
            left: "170px",
            width: "100px",
            height: "70px",
            transform: "rotate(-2deg)",
            backgroundColor: "#ffffff",
            border: "3px solid #000000",
            borderRadius: "8px",
            boxShadow: "3px 3px 8px rgba(0,0,0,0.15)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "8px",
            zIndex: 10,
          }}
        >
          <div
            style={{
              fontFamily: "Telma, Arial, sans-serif",
              fontWeight: "bold",
              fontSize: "16px",
              color: "#000000",
              textAlign: "center",
              lineHeight: "1.2",
            }}
            dangerouslySetInnerHTML={{
              __html: selectedQuotes[0].replace("\n", "<br/>"),
            }}
          />
        </div>

        {/* Quote 2 - Between top-center and center */}
        <div
          style={{
            position: "absolute",
            top: "285px",
            left: "650px",
            width: "100px",
            height: "70px",
            transform: "rotate(2deg)",
            backgroundColor: "#ffffff",
            border: "3px solid #000000",
            borderRadius: "8px",
            boxShadow: "3px 3px 8px rgba(0,0,0,0.15)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "8px",
            zIndex: 10,
          }}
        >
          <div
            style={{
              fontFamily: "Telma, Arial, sans-serif",
              fontWeight: "bold",
              fontSize: "16px",
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
            top: "225px",
            left: "1120px",
            width: "100px",
            height: "70px",
            transform: "rotate(-1deg)",
            backgroundColor: "#ffffff",
            border: "3px solid #000000",
            borderRadius: "8px",
            boxShadow: "3px 3px 8px rgba(0,0,0,0.15)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "8px",
            zIndex: 10,
          }}
        >
          <div
            style={{
              fontFamily: "Telma, Arial, sans-serif",
              fontWeight: "bold",
              fontSize: "16px",
              color: "#000000",
              textAlign: "center",
              lineHeight: "1.2",
            }}
            dangerouslySetInnerHTML={{
              __html: selectedQuotes[2].replace("\n", "<br/>"),
            }}
          />
        </div>

        {/* Quote 4 - Between middle and bottom left */}
        <div
          style={{
            position: "absolute",
            top: "515px",
            left: "310px",
            width: "100px",
            height: "70px",
            transform: "rotate(1deg)",
            backgroundColor: "#ffffff",
            border: "3px solid #000000",
            borderRadius: "8px",
            boxShadow: "3px 3px 8px rgba(0,0,0,0.15)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "8px",
            zIndex: 10,
          }}
        >
          <div
            style={{
              fontFamily: "Telma, Arial, sans-serif",
              fontWeight: "bold",
              fontSize: "16px",
              color: "#000000",
              textAlign: "center",
              lineHeight: "1.2",
            }}
            dangerouslySetInnerHTML={{
              __html: selectedQuotes[3].replace("\n", "<br/>"),
            }}
          />
        </div>

        {/* Quote 5 - Between middle and bottom center */}
        <div
          style={{
            position: "absolute",
            top: "515px",
            left: "800px",
            width: "100px",
            height: "70px",
            transform: "rotate(-2deg)",
            backgroundColor: "#ffffff",
            border: "3px solid #000000",
            borderRadius: "8px",
            boxShadow: "3px 3px 8px rgba(0,0,0,0.15)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "8px",
            zIndex: 10,
          }}
        >
          <div
            style={{
              fontFamily: "Telma, Arial, sans-serif",
              fontWeight: "bold",
              fontSize: "16px",
              color: "#000000",
              textAlign: "center",
              lineHeight: "1.2",
            }}
            dangerouslySetInnerHTML={{
              __html: selectedQuotes[4].replace("\n", "<br/>"),
            }}
          />
        </div>

        {/* Quote 6 - Between middle-right and bottom-right */}
        <div
          style={{
            position: "absolute",
            top: "515px",
            left: "1120px",
            width: "100px",
            height: "70px",
            transform: "rotate(2deg)",
            backgroundColor: "#ffffff",
            border: "3px solid #000000",
            borderRadius: "8px",
            boxShadow: "3px 3px 8px rgba(0,0,0,0.15)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "8px",
            zIndex: 10,
          }}
        >
          <div
            style={{
              fontFamily: "Telma, Arial, sans-serif",
              fontWeight: "bold",
              fontSize: "16px",
              color: "#000000",
              textAlign: "center",
              lineHeight: "1.2",
            }}
            dangerouslySetInnerHTML={{
              __html: selectedQuotes[5].replace("\n", "<br/>"),
            }}
          />
        </div>

        {/* Center Title - Semi-transparent background */}
        <div
          className="absolute flex flex-col items-center justify-center rounded-lg"
          style={{
            top: '320px',
            left: '475px',
            width: '250px',
            height: '90px',
            transform: 'rotate(-1deg)',
            backgroundColor: 'rgba(255, 255, 255, 0.85)',
            border: '2px solid rgba(139, 111, 71, 0.3)',
            boxShadow: '0 2px 15px rgba(0, 0, 0, 0.1)',
            zIndex: 100,
          }}
        >
          <div className="text-amber-800 text-4xl font-bold italic" style={{ fontFamily: 'Georgia, serif' }}>
            My 2025
          </div>
          <div className="text-amber-700 text-xl italic" style={{ fontFamily: 'Georgia, serif' }}>
            Vision Board
          </div>
        </div>
      </div>
    </>
  );
}
