"use client";

import React, { useRef, useEffect } from "react";

interface MagazineCollageTemplateProps {
  images: string[]; // 11 personalized images (all Gemini) - arranged around center card with LARGER containers
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

  // TIGHT-FIT Magazine collage - 11 visible images SCALED UP with border offset
  // Positions scaled by 1.1x and offset by 100px for border
  const collagePositions = [
    // Top row - 4 LARGER images (scaled and offset)
    { top: 100, left: 100, width: 570, height: 410, rotate: -3, zIndex: 20 },
    { top: 110, left: 670, width: 570, height: 410, rotate: 2, zIndex: 21 },
    { top: 100, left: 1240, width: 570, height: 410, rotate: -2, zIndex: 22 },
    { top: 110, left: 1810, width: 590, height: 410, rotate: 3, zIndex: 23 },

    // Middle row - 3 MAXIMIZED images around center card (scaled and offset)
    { top: 400, left: 100, width: 750, height: 500, rotate: 2, zIndex: 26 },
    // CENTER CARD SPACE
    { top: 420, left: 1300, width: 510, height: 390, rotate: 3, zIndex: 27 },
    { top: 400, left: 1810, width: 590, height: 500, rotate: -2, zIndex: 28 },

    // Bottom row - 4 LARGER images (scaled and offset)
    { top: 800, left: 100, width: 570, height: 380, rotate: -2, zIndex: 30 },
    { top: 810, left: 670, width: 570, height: 380, rotate: 2, zIndex: 31 },
    { top: 800, left: 1240, width: 570, height: 380, rotate: -1, zIndex: 32 },
    { top: 810, left: 1810, width: 590, height: 380, rotate: 3, zIndex: 33 },
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

      // Set canvas size - MUCH LARGER dimensions with border space
      canvas.width = 2500;
      canvas.height = 1400;

      // Draw outer decorative border background (dark elegant frame)
      ctx.fillStyle = '#2a2a2a';
      ctx.fillRect(0, 0, 2500, 1400);

      // Draw inner shadow for depth
      const borderGradient = ctx.createLinearGradient(0, 0, 2500, 1400);
      borderGradient.addColorStop(0, 'rgba(0, 0, 0, 0.3)');
      borderGradient.addColorStop(0.5, 'rgba(0, 0, 0, 0)');
      borderGradient.addColorStop(1, 'rgba(0, 0, 0, 0.3)');
      ctx.fillStyle = borderGradient;
      ctx.fillRect(40, 40, 2420, 1320);

      // Draw decorative gold accent border
      ctx.strokeStyle = '#d4af37';
      ctx.lineWidth = 8;
      ctx.strokeRect(50, 50, 2400, 1300);

      // Inner gold border
      ctx.strokeStyle = '#d4af37';
      ctx.lineWidth = 3;
      ctx.strokeRect(70, 70, 2360, 1260);

      // Draw main cork board background (content area)
      ctx.fillStyle = '#d4a574';
      ctx.fillRect(100, 100, 2300, 1200);

      // Add texture (noise pattern) to cork board area only
      for (let i = 0; i < 6000; i++) {
        const x = 100 + Math.random() * 2300;
        const y = 100 + Math.random() * 1200;
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

      // Draw all collage images (max 11)
      for (const { pos, idx } of sortedPositions) {
        if (idx >= images.length || idx >= 11) continue;

        try {
          const img = await loadImage(images[idx]);

          ctx.save();
          ctx.translate(pos.left + pos.width / 2, pos.top + pos.height / 2);
          ctx.rotate((pos.rotate * Math.PI) / 180);
          ctx.translate(-(pos.width / 2), -(pos.height / 2));

          // Draw warm cream-toned photo border with enhanced shadow for depth
          ctx.fillStyle = '#fffef9';
          ctx.shadowColor = 'rgba(80, 60, 40, 0.45)';
          ctx.shadowBlur = 20;
          ctx.shadowOffsetX = 5;
          ctx.shadowOffsetY = 5;
          ctx.fillRect(0, 0, pos.width, pos.height);
          ctx.shadowColor = 'transparent';

          // Add subtle inner border for more aesthetic look
          ctx.strokeStyle = 'rgba(200, 180, 150, 0.3)';
          ctx.lineWidth = 2;
          ctx.strokeRect(15, 15, pos.width - 30, pos.height - 30);

          // Draw image inside the border - COVER mode to fill entire container
          const padding = 20;
          const imgRatio = img.width / img.height;
          const boxRatio = (pos.width - padding * 2) / (pos.height - padding * 2);
          let drawWidth, drawHeight, drawX, drawY;

          // Cover mode - fill entire frame while maintaining aspect ratio
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

          // Clip to frame and draw image
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

      // Load neon quote container image
      const quoteContainerImg = await loadImage('/quote container.png');

      // Add inspirational quotes with neon containers - NEW POSITIONS
      const quotePositions = [
        { x: 730, y: 340, size: 18, width: 200, height: 140 }, // Between top row images 1&2
        { x: 1870, y: 340, size: 18, width: 200, height: 140 }, // Between top row images 3&4
        { x: 1870, y: 1020, size: 18, width: 200, height: 140 }, // Between bottom row images 3&4
        { x: 730, y: 1020, size: 18, width: 200, height: 140 }, // Between bottom row images 1&2
      ];

      const inspirationalQuotes = quotePositions.map((pos, index) => ({
        text: selectedQuotes[index],
        ...pos,
      }));

      // Draw each quote with neon container background and circular clipping
      for (const quote of inspirationalQuotes) {
        ctx.save();

        // Create circular clip path for the quote container
        ctx.beginPath();
        ctx.arc(quote.x, quote.y, Math.max(quote.width, quote.height) / 2, 0, Math.PI * 2);
        ctx.closePath();
        ctx.clip();

        // Draw neon container image as background
        ctx.drawImage(
          quoteContainerImg,
          quote.x - quote.width / 2,
          quote.y - quote.height / 2,
          quote.width,
          quote.height
        );

        ctx.restore();
        ctx.save();

        // Draw text in white with glow effect (no clipping for text)
        ctx.fillStyle = "#ffffff";
        ctx.font = `bold ${quote.size}px Arial, sans-serif`;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";

        // Text shadow for glow effect
        ctx.shadowColor = "rgba(255, 255, 255, 0.5)";
        ctx.shadowBlur = 10;

        // Handle multi-line text
        const lines = quote.text.split("\n");
        const lineHeight = quote.size * 1.3;
        const totalHeight = lines.length * lineHeight;
        const startY = quote.y - totalHeight / 2 + lineHeight / 2;

        lines.forEach((line, index) => {
          ctx.fillText(line, quote.x, startY + index * lineHeight);
        });

        ctx.restore();
      }

      // Draw logo image - moved to left (where Quote 3 was)
      const logoX = 1040;
      const logoY = 705;
      const logoSize = 280; // Diameter of circular logo
      const logoRadius = logoSize / 2;

      try {
        const logoImg = await loadImage('/Gemini_Generated_Image_q3n49dq3n49dq3n4.png');

        ctx.save();

        // Create circular clip path
        ctx.beginPath();
        ctx.arc(logoX, logoY, logoRadius, 0, Math.PI * 2);
        ctx.closePath();
        ctx.clip();

        // Draw shadow
        ctx.shadowColor = 'rgba(0, 0, 0, 0.3)';
        ctx.shadowBlur = 20;
        ctx.shadowOffsetX = 4;
        ctx.shadowOffsetY = 4;

        // Draw logo image (will be clipped to circle)
        ctx.drawImage(
          logoImg,
          logoX - logoRadius,
          logoY - logoRadius,
          logoSize,
          logoSize
        );

        ctx.restore();
      } catch (error) {
        console.error('Failed to load logo image:', error);
      }
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
        width={2500}
        height={1400}
        style={{ display: 'none' }}
      />

      {/* Scaled Container to fit screen */}
      <div className="w-screen h-screen flex items-center justify-center overflow-hidden">
        <div
          style={{
            transform: 'scale(0.55)',
            transformOrigin: 'center center',
          }}
        >
          {/* Visible Vision Board - MUCH LARGER with decorative border */}
          <div
            ref={containerRef}
            className="relative w-[2500px] h-[1400px] mx-auto"
            style={{
              backgroundColor: '#2a2a2a',
              boxShadow: '0 20px 60px rgba(0, 0, 0, 0.5)',
            }}
          >
        {/* Outer decorative border layers */}
        <div className="absolute inset-0" style={{
          background: 'linear-gradient(135deg, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0) 50%, rgba(0,0,0,0.3) 100%)',
        }} />

        {/* Gold accent borders */}
        <div className="absolute top-[50px] left-[50px] right-[50px] bottom-[50px]" style={{
          border: '8px solid #d4af37',
        }} />
        <div className="absolute top-[70px] left-[70px] right-[70px] bottom-[70px]" style={{
          border: '3px solid #d4af37',
        }} />

        {/* Cork board content area */}
        <div className="absolute top-[100px] left-[100px] w-[2300px] h-[1200px]" style={{
          backgroundColor: '#d4a574',
          backgroundImage: 'url("data:image/svg+xml,%3Csvg width="100" height="100" xmlns="http://www.w3.org/2000/svg"%3E%3Cfilter id="noise"%3E%3CfeTurbulence baseFrequency="0.9" /%3E%3C/filter%3E%3Crect width="100" height="100" filter="url(%23noise)" opacity="0.1" /%3E%3C/svg%3E")',
        }}
      >
        {/* Collage Images - 11 total (around center card) with LARGER containers */}
        {images.slice(0, 11).map((image, idx) => {
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
                padding: '20px',
                backgroundColor: '#fffef9',
                boxShadow: '5px 5px 20px rgba(80, 60, 40, 0.45)',
                border: '2px solid rgba(200, 180, 150, 0.3)',
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

              {/* Image - COVER mode to fill entire container */}
              <img
                src={image}
                alt={`Vision ${idx + 1}`}
                className="w-full h-full"
                style={{
                  objectFit: 'cover',
                  objectPosition: 'center'
                }}
              />
            </div>
          );
        })}

        {/* Inspirational Quotes in Neon Containers - Positioned between images (4 quotes) */}

        {/* Quote 1 - Between top row images 1&2 */}
        <div
          style={{
            position: "absolute",
            top: "270px",
            left: "630px",
            width: "200px",
            height: "140px",
            backgroundImage: "url('/quote container.png')",
            backgroundSize: "cover",
            backgroundPosition: "center",
            borderRadius: "50%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "25px",
            zIndex: 50,
            overflow: "hidden",
          }}
        >
          <div
            style={{
              fontFamily: "Arial, sans-serif",
              fontWeight: "bold",
              fontSize: "18px",
              color: "#ffffff",
              textAlign: "center",
              lineHeight: "1.3",
              textShadow: "0 0 10px rgba(255,255,255,0.5)",
              wordWrap: "break-word",
              overflow: "hidden",
              maxWidth: "100%",
            }}
            dangerouslySetInnerHTML={{
              __html: selectedQuotes[0]?.replace(/\n/g, "<br/>") || "",
            }}
          />
        </div>

        {/* Quote 2 - Between top row images 3&4 */}
        <div
          style={{
            position: "absolute",
            top: "270px",
            left: "1770px",
            width: "200px",
            height: "140px",
            backgroundImage: "url('/quote container.png')",
            backgroundSize: "cover",
            backgroundPosition: "center",
            borderRadius: "50%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "25px",
            zIndex: 50,
            overflow: "hidden",
          }}
        >
          <div
            style={{
              fontFamily: "Arial, sans-serif",
              fontWeight: "bold",
              fontSize: "18px",
              color: "#ffffff",
              textAlign: "center",
              lineHeight: "1.3",
              textShadow: "0 0 10px rgba(255,255,255,0.5)",
              wordWrap: "break-word",
              overflow: "hidden",
              maxWidth: "100%",
            }}
            dangerouslySetInnerHTML={{
              __html: selectedQuotes[1]?.replace(/\n/g, "<br/>") || "",
            }}
          />
        </div>

        {/* Quote 3 - Between bottom row images 3&4 */}
        <div
          style={{
            position: "absolute",
            top: "950px",
            left: "1770px",
            width: "200px",
            height: "140px",
            backgroundImage: "url('/quote container.png')",
            backgroundSize: "cover",
            backgroundPosition: "center",
            borderRadius: "50%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "25px",
            zIndex: 50,
            overflow: "hidden",
          }}
        >
          <div
            style={{
              fontFamily: "Arial, sans-serif",
              fontWeight: "bold",
              fontSize: "18px",
              color: "#ffffff",
              textAlign: "center",
              lineHeight: "1.3",
              textShadow: "0 0 10px rgba(255,255,255,0.5)",
              wordWrap: "break-word",
              overflow: "hidden",
              maxWidth: "100%",
            }}
            dangerouslySetInnerHTML={{
              __html: selectedQuotes[2]?.replace(/\n/g, "<br/>") || "",
            }}
          />
        </div>

        {/* Quote 4 - Between bottom row images 1&2 */}
        <div
          style={{
            position: "absolute",
            top: "950px",
            left: "630px",
            width: "200px",
            height: "140px",
            backgroundImage: "url('/quote container.png')",
            backgroundSize: "cover",
            backgroundPosition: "center",
            borderRadius: "50%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "25px",
            zIndex: 50,
            overflow: "hidden",
          }}
        >
          <div
            style={{
              fontFamily: "Arial, sans-serif",
              fontWeight: "bold",
              fontSize: "18px",
              color: "#ffffff",
              textAlign: "center",
              lineHeight: "1.3",
              textShadow: "0 0 10px rgba(255,255,255,0.5)",
              wordWrap: "break-word",
              overflow: "hidden",
              maxWidth: "100%",
            }}
            dangerouslySetInnerHTML={{
              __html: selectedQuotes[3]?.replace(/\n/g, "<br/>") || "",
            }}
          />
        </div>

        {/* Logo - Moved to left (where Quote 3 was) */}
        <div
          className="absolute shadow-2xl"
          style={{
            top: '575px',
            left: '900px',
            width: '280px',
            height: '280px',
            zIndex: 50,
            borderRadius: '50%',
            overflow: 'hidden',
          }}
        >
          <img
            src="/Gemini_Generated_Image_q3n49dq3n49dq3n4.png"
            alt="MY 2025 VISION BOARD"
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
            }}
          />
        </div>
        </div> {/* End of cork board content area */}
          </div> {/* End of outer container */}
        </div>
      </div>
    </>
  );
}
