"use client";

import React, { useRef, useEffect } from "react";

interface CleanGridTemplateProps {
  images: string[]; // 6 personalized images (reduced for Netlify compatibility)
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

  // Randomly select 5 quotes from the pool
  const getRandomQuotes = () => {
    const shuffled = [...quotePool].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, 5);
  };

  // Use useMemo to maintain same quotes on re-renders
  const selectedQuotes = React.useMemo(() => getRandomQuotes(), []);

  // Simple 2x3 grid layout - 6 images MUCH LARGER to fill bigger board
  const gridPositions = [
    // Top row - 3 MUCH LARGER images
    { top: 20, left: 20, width: 780, height: 480, keyword: "" },
    { top: 20, left: 820, width: 780, height: 480, keyword: "" },
    { top: 20, left: 1620, width: 460, height: 480, keyword: "" },

    // Bottom row - 3 MUCH LARGER images
    { top: 720, left: 20, width: 780, height: 480, keyword: "" },
    { top: 720, left: 820, width: 780, height: 480, keyword: "" },
    { top: 720, left: 1620, width: 460, height: 480, keyword: "" },
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

      // Set canvas size - LARGER board dimensions
      canvas.width = 2100;
      canvas.height = 1220;

      // Draw gradient background (soft, professional)
      const gradient = ctx.createLinearGradient(0, 0, 2100, 1220);
      gradient.addColorStop(0, '#f8fafc');
      gradient.addColorStop(0.5, '#f1f5f9');
      gradient.addColorStop(1, '#e2e8f0');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, 2100, 1220);

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

      // Draw all grid images (max 6)
      for (let idx = 0; idx < Math.min(6, images.length); idx++) {
        const pos = gridPositions[idx];
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

      // Add inspirational quotes in containers - between grid gaps with varied colors
      const quotePositions = [
        { x: 445, y: 130, size: 16, rotation: 0, width: 100, height: 70, radius: 8, bgColor: '#6366f1', textColor: '#ffffff', borderColor: '#4f46e5' }, // Indigo - Top center gap
        { x: 890, y: 130, size: 16, rotation: 0, width: 100, height: 70, radius: 8, bgColor: '#f59e0b', textColor: '#ffffff', borderColor: '#d97706' }, // Amber - Top right gap
        { x: 445, y: 380, size: 16, rotation: 0, width: 100, height: 70, radius: 8, bgColor: '#10b981', textColor: '#ffffff', borderColor: '#059669' }, // Emerald - Middle left gap
        { x: 890, y: 380, size: 16, rotation: 0, width: 100, height: 70, radius: 8, bgColor: '#ec4899', textColor: '#ffffff', borderColor: '#db2777' }, // Pink - Middle right gap
        { x: 890, y: 630, size: 16, rotation: 0, width: 100, height: 70, radius: 8, bgColor: '#8b5cf6', textColor: '#ffffff', borderColor: '#7c3aed' }, // Purple - Bottom right gap
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

        // Fill colored background with shadow
        ctx.fillStyle = quote.bgColor;
        ctx.shadowColor = "rgba(0, 0, 0, 0.2)";
        ctx.shadowBlur = 10;
        ctx.shadowOffsetX = 4;
        ctx.shadowOffsetY = 4;
        ctx.fill();

        // Draw darker border
        ctx.strokeStyle = quote.borderColor;
        ctx.lineWidth = 3;
        ctx.shadowColor = "transparent";
        ctx.stroke();

        // Draw text in white using Telma font
        ctx.fillStyle = quote.textColor;
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

      // Draw center card - Centered between rows on LARGER board
      const centerX = 850;
      const centerY = 510;
      const centerW = 600;
      const centerH = 300;

      ctx.save();
      ctx.fillStyle = '#6366f1'; // Indigo
      ctx.shadowColor = 'rgba(0, 0, 0, 0.2)';
      ctx.shadowBlur = 30;
      ctx.shadowOffsetX = 0;
      ctx.shadowOffsetY = 4;

      // Rounded rectangle
      const radius = 16;
      ctx.beginPath();
      ctx.moveTo(centerX + radius, centerY);
      ctx.lineTo(centerX + centerW - radius, centerY);
      ctx.quadraticCurveTo(centerX + centerW, centerY, centerX + centerW, centerY + radius);
      ctx.lineTo(centerX + centerW, centerY + centerH - radius);
      ctx.quadraticCurveTo(centerX + centerW, centerY + centerH, centerX + centerW - radius, centerY + centerH);
      ctx.lineTo(centerX + radius, centerY + centerH);
      ctx.quadraticCurveTo(centerX, centerY + centerH, centerX, centerY + centerH - radius);
      ctx.lineTo(centerX, centerY + radius);
      ctx.quadraticCurveTo(centerX, centerY, centerX + radius, centerY);
      ctx.closePath();
      ctx.fill();

      // Center text - Larger, more readable
      ctx.shadowColor = 'transparent';
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 90px Inter, system-ui, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('2025', centerX + centerW / 2, centerY + 120);

      ctx.font = '28px Inter, system-ui, sans-serif';
      ctx.letterSpacing = '5px';
      ctx.fillText('YOUR VISION BOARD', centerX + centerW / 2, centerY + 170);

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
        width={2100}
        height={1220}
        style={{ display: 'none' }}
      />

      {/* Visible Vision Board - LARGER dimensions */}
      <div
        ref={containerRef}
        className="relative w-[2100px] h-[1220px] mx-auto overflow-hidden"
        style={{ background: 'linear-gradient(to bottom right, #f8fafc, #f1f5f9, #e2e8f0)' }}
      >
        {/* Grid Images - 6 larger images */}
        {images.slice(0, 6).map((image, idx) => {
          const pos = gridPositions[idx];
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

        {/* Center Card - Centered between image rows on LARGER board */}
        <div
          className="absolute bg-indigo-500 shadow-2xl flex flex-col items-center justify-center"
          style={{
            top: '510px',
            left: '850px',
            width: '600px',
            height: '300px',
            borderRadius: '24px',
            zIndex: 20,
          }}
        >
          <div className="text-white text-9xl font-bold mb-4">2025</div>
          <div className="text-white text-3xl tracking-widest">YOUR VISION BOARD</div>
        </div>
      </div>
    </>
  );
}
