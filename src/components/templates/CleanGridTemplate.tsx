"use client";

import React, { useRef, useEffect } from "react";

interface CleanGridTemplateProps {
  images: string[]; // 8 personalized images for 3x3 grid (-1 for center logo)
  keywords: string[];
}

export default function CleanGridTemplate({
  images,
  keywords,
}: CleanGridTemplateProps) {
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

  // Randomly select 4 quotes from the pool (for gaps between images)
  const getRandomQuotes = () => {
    const shuffled = [...quotePool].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, 4);
  };

  // Use useMemo to maintain same quotes on re-renders
  const selectedQuotes = React.useMemo(() => getRandomQuotes(), []);

  // 3x3 grid layout - 8 equal-sized images (center is logo)
  const gridSize = 680; // Equal size for all images
  const gap = 10; // Gap between images
  const gridPositions = [
    // Top row - 3 equal images
    { top: 20, left: 20, width: gridSize, height: gridSize, keyword: "" },
    { top: 20, left: 20 + gridSize + gap, width: gridSize, height: gridSize, keyword: "" },
    { top: 20, left: 20 + (gridSize + gap) * 2, width: gridSize, height: gridSize, keyword: "" },

    // Middle row - 2 images (center is logo)
    { top: 20 + gridSize + gap, left: 20, width: gridSize, height: gridSize, keyword: "" },
    // CENTER LOGO SPACE
    { top: 20 + gridSize + gap, left: 20 + (gridSize + gap) * 2, width: gridSize, height: gridSize, keyword: "" },

    // Bottom row - 3 equal images
    { top: 20 + (gridSize + gap) * 2, left: 20, width: gridSize, height: gridSize, keyword: "" },
    { top: 20 + (gridSize + gap) * 2, left: 20 + gridSize + gap, width: gridSize, height: gridSize, keyword: "" },
    { top: 20 + (gridSize + gap) * 2, left: 20 + (gridSize + gap) * 2, width: gridSize, height: gridSize, keyword: "" },
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

      // Set canvas size - 3x3 grid dimensions
      const totalWidth = 20 + (gridSize + gap) * 3;
      const totalHeight = 20 + (gridSize + gap) * 3;
      canvas.width = totalWidth;
      canvas.height = totalHeight;

      // Draw gradient background (soft, professional)
      const gradient = ctx.createLinearGradient(0, 0, totalWidth, totalHeight);
      gradient.addColorStop(0, '#f8fafc');
      gradient.addColorStop(0.5, '#f1f5f9');
      gradient.addColorStop(1, '#e2e8f0');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, totalWidth, totalHeight);

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

      // Draw all grid images (max 8 - skip index 4 which is center)
      for (let idx = 0; idx < Math.min(8, images.length); idx++) {
        const posIndex = idx < 4 ? idx : idx + 1; // Skip center position (index 4)
        const pos = gridPositions[posIndex];
        if (!pos) continue;

        try {
          const img = await loadImage(images[idx]);

          ctx.save();

          // Draw soft blue-tinted card to complement gradient background
          ctx.fillStyle = '#f0f4f8';
          ctx.shadowColor = 'rgba(99, 102, 241, 0.15)';
          ctx.shadowBlur = 20;
          ctx.shadowOffsetX = 0;
          ctx.shadowOffsetY = 2;

          // Rounded corners
          const radius = 12;
          ctx.beginPath();
          ctx.moveTo(pos.left + radius, pos.top);
          ctx.lineTo(pos.left + pos.width - radius, pos.top);
          ctx.quadraticCurveTo(pos.left + pos.width, pos.top, pos.left + pos.width, pos.top + radius);
          ctx.lineTo(pos.left + pos.width, pos.top + pos.height - radius);
          ctx.quadraticCurveTo(pos.left + pos.width, pos.top + pos.height, pos.left + pos.width - radius, pos.top + pos.height);
          ctx.lineTo(pos.left + radius, pos.top + pos.height);
          ctx.quadraticCurveTo(pos.left, pos.top + pos.height, pos.left, pos.top + pos.height - radius);
          ctx.lineTo(pos.left, pos.top + radius);
          ctx.quadraticCurveTo(pos.left, pos.top, pos.left + radius, pos.top);
          ctx.closePath();
          ctx.fill();
          ctx.shadowColor = 'transparent';

          // Clip for rounded corners
          ctx.clip();

          // Calculate proper aspect ratio for image scaling (cover mode)
          const imgRatio = img.width / img.height;
          const boxRatio = pos.width / pos.height;
          let drawWidth, drawHeight, drawX, drawY;

          // Always fill the frame completely (cover mode - image fills entire space)
          if (imgRatio > boxRatio) {
            // Image is wider - match height, let width overflow
            drawHeight = pos.height;
            drawWidth = drawHeight * imgRatio;
            drawX = pos.left - (drawWidth - pos.width) / 2;
            drawY = pos.top;
          } else {
            // Image is taller - match width, let height overflow
            drawWidth = pos.width;
            drawHeight = drawWidth / imgRatio;
            drawX = pos.left;
            drawY = pos.top - (drawHeight - pos.height) / 2;
          }

          ctx.drawImage(img, drawX, drawY, drawWidth, drawHeight);

          // Draw keyword label at bottom if exists
          if (pos.keyword) {
            const labelHeight = 40;
            const labelY = pos.top + pos.height - labelHeight;

            // Semi-transparent gradient overlay
            const labelGradient = ctx.createLinearGradient(0, labelY, 0, pos.top + pos.height);
            labelGradient.addColorStop(0, 'rgba(0, 0, 0, 0.5)');
            labelGradient.addColorStop(1, 'rgba(0, 0, 0, 0.7)');
            ctx.fillStyle = labelGradient;
            ctx.fillRect(pos.left, labelY, pos.width, labelHeight);

            // Keyword text
            ctx.fillStyle = '#ffffff';
            ctx.font = 'bold 16px Inter, system-ui, sans-serif';
            ctx.textAlign = 'center';
            ctx.fillText(pos.keyword.toUpperCase(), pos.left + pos.width / 2, labelY + 25);
          }

          ctx.restore();
        } catch (error) {
          console.error(`Failed to load image ${idx}:`, error);
        }
      }

      // Draw center logo image - perfectly rounded circle in 3x3 grid center
      const logoSize = gridSize * 0.9; // 90% of grid cell size
      const logoRadius = logoSize / 2;
      const centerX = 20 + gridSize + gap + gridSize / 2; // Center of middle column
      const centerY = 20 + gridSize + gap + gridSize / 2; // Center of middle row

      try {
        const logoImg = await loadImage('/Gemini_Generated_Image_q3n49dq3n49dq3n4.png');

        ctx.save();

        // Create circular clip path
        ctx.beginPath();
        ctx.arc(centerX, centerY, logoRadius, 0, Math.PI * 2);
        ctx.closePath();
        ctx.clip();

        // Draw shadow
        ctx.shadowColor = 'rgba(0, 0, 0, 0.2)';
        ctx.shadowBlur = 30;
        ctx.shadowOffsetX = 0;
        ctx.shadowOffsetY = 4;

        // Draw logo image (will be clipped to circle)
        ctx.drawImage(
          logoImg,
          centerX - logoRadius,
          centerY - logoRadius,
          logoSize,
          logoSize
        );

        ctx.restore();
      } catch (error) {
        console.error('Failed to load logo image:', error);
      }

      // Add 4 quotes in gaps between images
      const quotePositions = [
        { x: 20 + gridSize / 2, y: 20 + gridSize + gap / 2, size: 28 }, // Between top-left and middle-left
        { x: 20 + (gridSize + gap) * 2.5, y: 20 + gridSize / 2, size: 28 }, // Between top-right and middle-right
        { x: 20 + gridSize + gap + gridSize / 2, y: 20 + (gridSize + gap) * 2.5, size: 28 }, // Between middle-center and bottom-center
        { x: totalWidth - 100, y: 20 + (gridSize + gap) * 1.5, size: 26 }, // Right edge middle
      ];

      quotePositions.forEach((qPos, index) => {
        if (!selectedQuotes[index]) return;

        ctx.save();
        ctx.translate(qPos.x, qPos.y);

        // White rounded rectangle background
        const qWidth = 120;
        const qHeight = 80;
        const qRadius = 8;

        ctx.beginPath();
        ctx.moveTo(-qWidth/2 + qRadius, -qHeight/2);
        ctx.lineTo(qWidth/2 - qRadius, -qHeight/2);
        ctx.quadraticCurveTo(qWidth/2, -qHeight/2, qWidth/2, -qHeight/2 + qRadius);
        ctx.lineTo(qWidth/2, qHeight/2 - qRadius);
        ctx.quadraticCurveTo(qWidth/2, qHeight/2, qWidth/2 - qRadius, qHeight/2);
        ctx.lineTo(-qWidth/2 + qRadius, qHeight/2);
        ctx.quadraticCurveTo(-qWidth/2, qHeight/2, -qWidth/2, qHeight/2 - qRadius);
        ctx.lineTo(-qWidth/2, -qHeight/2 + qRadius);
        ctx.quadraticCurveTo(-qWidth/2, -qHeight/2, -qWidth/2 + qRadius, -qHeight/2);
        ctx.closePath();

        ctx.fillStyle = '#ffffff';
        ctx.shadowColor = 'rgba(0, 0, 0, 0.15)';
        ctx.shadowBlur = 8;
        ctx.shadowOffsetX = 2;
        ctx.shadowOffsetY = 2;
        ctx.fill();
        ctx.shadowColor = 'transparent';

        ctx.strokeStyle = '#000000';
        ctx.lineWidth = 2;
        ctx.stroke();

        // Draw quote text
        ctx.fillStyle = '#000000';
        ctx.font = `bold ${qPos.size}px Telma, Arial, sans-serif`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';

        const lines = selectedQuotes[index].split('\n');
        lines.forEach((line, i) => {
          const yOffset = (i - (lines.length - 1) / 2) * (qPos.size + 4);
          ctx.fillText(line, 0, yOffset);
        });

        ctx.restore();
      });
    };

    renderToCanvas();
  }, [images, keywords]);

  // Download function
  const handleDownload = () => {
    if (!canvasRef.current) return;

    try {
      const dataUrl = canvasRef.current.toDataURL('image/png', 1.0);
      const link = document.createElement('a');
      link.download = 'vision-board-clean-grid-2025.png';
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
        width={20 + (gridSize + gap) * 3}
        height={20 + (gridSize + gap) * 3}
        style={{ display: 'none' }}
      />

      {/* Scaled Container to fit screen */}
      <div className="w-screen h-screen flex items-center justify-center overflow-hidden">
        <div
          style={{
            transform: 'scale(0.75)',
            transformOrigin: 'center center',
          }}
        >
          {/* Visible Vision Board - 3x3 Grid */}
          <div
            ref={containerRef}
            className="relative"
            style={{
              width: `${20 + (gridSize + gap) * 3}px`,
              height: `${20 + (gridSize + gap) * 3}px`,
              background: 'linear-gradient(to bottom right, #f8fafc, #f1f5f9, #e2e8f0)'
            }}
          >
        {/* Grid Images - 8 images (skip center position 4) */}
        {images.slice(0, 8).map((image, idx) => {
          const posIndex = idx < 4 ? idx : idx + 1; // Skip center position
          const pos = gridPositions[posIndex];
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
                borderRadius: '12px',
                overflow: 'hidden',
                backgroundColor: '#f0f4f8',
                boxShadow: '0 2px 20px rgba(99, 102, 241, 0.15)',
              }}
            >
              {/* Image - COVER mode to fill entire container */}
              <img
                src={image}
                alt={`Vision ${idx + 1}`}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  objectPosition: 'center center',
                  display: 'block'
                }}
              />

              {/* Keyword label */}
              {pos.keyword && (
                <div
                  className="absolute bottom-0 left-0 right-0 h-10 flex items-center justify-center"
                  style={{
                    background: 'linear-gradient(to bottom, rgba(0,0,0,0.5), rgba(0,0,0,0.7))',
                  }}
                >
                  <span className="text-white font-bold text-sm uppercase">
                    {pos.keyword}
                  </span>
                </div>
              )}
            </div>
          );
        })}

        {/* Inspirational Quotes in Containers - Between grid gaps */}

        {/* Quote 1 - Top center gap - Indigo */}
        <div
          style={{
            position: "absolute",
            top: "130px",
            left: "445px",
            width: "100px",
            height: "70px",
            transform: "rotate(0deg)",
            backgroundColor: "#6366f1",
            border: "3px solid #4f46e5",
            borderRadius: "8px",
            boxShadow: "4px 4px 10px rgba(0,0,0,0.2)",
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
              color: "#ffffff",
              textAlign: "center",
              lineHeight: "1.2",
            }}
            dangerouslySetInnerHTML={{
              __html: selectedQuotes[0].replace("\n", "<br/>"),
            }}
          />
        </div>

        {/* Quote 2 - Top right gap - Amber */}
        <div
          style={{
            position: "absolute",
            top: "130px",
            left: "890px",
            width: "100px",
            height: "70px",
            transform: "rotate(0deg)",
            backgroundColor: "#f59e0b",
            border: "3px solid #d97706",
            borderRadius: "8px",
            boxShadow: "4px 4px 10px rgba(0,0,0,0.2)",
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
              color: "#ffffff",
              textAlign: "center",
              lineHeight: "1.2",
            }}
            dangerouslySetInnerHTML={{
              __html: selectedQuotes[1].replace("\n", "<br/>"),
            }}
          />
        </div>

        {/* Quote 3 - Middle left gap - Emerald */}
        <div
          style={{
            position: "absolute",
            top: "380px",
            left: "445px",
            width: "100px",
            height: "70px",
            transform: "rotate(0deg)",
            backgroundColor: "#10b981",
            border: "3px solid #059669",
            borderRadius: "8px",
            boxShadow: "4px 4px 10px rgba(0,0,0,0.2)",
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
              color: "#ffffff",
              textAlign: "center",
              lineHeight: "1.2",
            }}
            dangerouslySetInnerHTML={{
              __html: selectedQuotes[2].replace("\n", "<br/>"),
            }}
          />
        </div>

        {/* Quote 4 - Middle right gap - Pink */}
        <div
          style={{
            position: "absolute",
            top: "380px",
            left: "890px",
            width: "100px",
            height: "70px",
            transform: "rotate(0deg)",
            backgroundColor: "#ec4899",
            border: "3px solid #db2777",
            borderRadius: "8px",
            boxShadow: "4px 4px 10px rgba(0,0,0,0.2)",
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
              color: "#ffffff",
              textAlign: "center",
              lineHeight: "1.2",
            }}
            dangerouslySetInnerHTML={{
              __html: selectedQuotes[3].replace("\n", "<br/>"),
            }}
          />
        </div>

        {/* Quote 5 - Bottom right gap - Purple */}
        <div
          style={{
            position: "absolute",
            top: "630px",
            left: "890px",
            width: "100px",
            height: "70px",
            transform: "rotate(0deg)",
            backgroundColor: "#8b5cf6",
            border: "3px solid #7c3aed",
            borderRadius: "8px",
            boxShadow: "4px 4px 10px rgba(0,0,0,0.2)",
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
              color: "#ffffff",
              textAlign: "center",
              lineHeight: "1.2",
            }}
            dangerouslySetInnerHTML={{
              __html: selectedQuotes[4].replace("\n", "<br/>"),
            }}
          />
        </div>

        {/* Center Logo - Perfectly Rounded Circle in 3x3 Grid */}
        <div
          className="absolute shadow-2xl"
          style={{
            top: `${20 + gridSize + gap}px`,
            left: `${20 + gridSize + gap}px`,
            width: `${gridSize}px`,
            height: `${gridSize}px`,
            borderRadius: '50%',
            overflow: 'hidden',
            zIndex: 20,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <img
            src="/Gemini_Generated_Image_q3n49dq3n49dq3n4.png"
            alt="MY 2025 VISION BOARD"
            style={{
              width: '90%',
              height: '90%',
              objectFit: 'cover',
              borderRadius: '50%',
            }}
          />
        </div>

        {/* 4 Quotes between images - positioned in the gaps */}
        {selectedQuotes.slice(0, 4).map((quote, i) => {
          // Safety check for undefined quotes
          if (!quote) return null;

          // Position quotes in the horizontal and vertical gaps between images
          const positions = [
            // Quote 1: Between Image1 and Image2 (top row, left gap)
            { top: 20 + gridSize / 2 - 40, left: 20 + gridSize + gap / 2 - 60 },
            // Quote 2: Between Image2 and Image3 (top row, right gap)
            { top: 20 + gridSize / 2 - 40, left: 20 + (gridSize + gap) * 2 + gap / 2 - 60 },
            // Quote 3: Between Image6 and Image7 (bottom row, left gap)
            { top: 20 + (gridSize + gap) * 2 + gridSize / 2 - 40, left: 20 + gridSize + gap / 2 - 60 },
            // Quote 4: Between Image7 and Image8 (bottom row, right gap)
            { top: 20 + (gridSize + gap) * 2 + gridSize / 2 - 40, left: 20 + (gridSize + gap) * 2 + gap / 2 - 60 },
          ];
          const pos = positions[i];

          return (
            <div
              key={i}
              style={{
                position: "absolute",
                top: `${pos.top}px`,
                left: `${pos.left}px`,
                width: "120px",
                height: "80px",
                backgroundColor: "#ffffff",
                border: "2px solid #000000",
                borderRadius: "8px",
                boxShadow: "2px 2px 8px rgba(0,0,0,0.15)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                padding: "8px",
                zIndex: 15,
              }}
            >
              <div
                style={{
                  fontFamily: "Telma, Arial, sans-serif",
                  fontWeight: "bold",
                  fontSize: i % 2 === 0 ? "28px" : "26px",
                  color: "#000000",
                  textAlign: "center",
                  lineHeight: "1.2",
                }}
                dangerouslySetInnerHTML={{
                  __html: quote.replace("\n", "<br/>"),
                }}
              />
            </div>
          );
        })}
          </div>
        </div>
      </div>
    </>
  );
}
