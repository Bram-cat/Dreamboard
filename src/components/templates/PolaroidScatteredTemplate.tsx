"use client";

import React, { useRef, useEffect } from "react";

interface PolaroidScatteredTemplateProps {
  images: string[]; // 11 personalized images (all Gemini) with LARGER Polaroid frames
  quotes: string[];
}

export default function PolaroidScatteredTemplate({
  images,
  quotes,
}: PolaroidScatteredTemplateProps) {
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

  // Randomly select 7 quotes from the pool
  const getRandomQuotes = () => {
    const shuffled = [...quotePool].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, 7);
  };

  // Use useMemo to maintain same quotes on re-renders
  const selectedQuotes = React.useMemo(() => getRandomQuotes(), []);

  // Vibrant colored Polaroid frames - each with unique pastel color
  const frameColors = [
    "#FFE5EC", // soft pink
    "#aadbf5ff", // sky blue
    "#89732aff", // cream yellow
    "#7dfa87ff", // mint green
    "#76407eff", // lavender
    "#f5dcb4ff", // peach
    "#FCE4EC", // rose
    "#a1d3eaff", // light blue
    "#FFF9C4", // light yellow
    "#F1F8E9", // pale green
    "#EDE7F6", // pale purple
    "#FFE0B2", // light orange
    "#e8437cff", // pink
    "#056a78ff", // cyan
    "#FFECB3", // amber
  ];

  // Polaroid scrapbook layout - 11 MUCH LARGER images with border offset and better arrangement
  // Scaled up by ~1.3x and offset by 120px for decorative border
  const gridPositions = [
    // Top scattered row - 4 MUCH LARGER frames
    {
      top: 120,
      left: 120,
      width: 650,
      height: 520,
      rotation: -8,
      label: "",
      frameColor: frameColors[0],
    },
    {
      top: 130,
      left: 800,
      width: 630,
      height: 510,
      rotation: 5,
      label: "",
      frameColor: frameColors[1],
    },
    {
      top: 125,
      left: 1460,
      width: 620,
      height: 500,
      rotation: -3,
      label: "",
      frameColor: frameColors[2],
    },
    {
      top: 135,
      left: 2110,
      width: 570,
      height: 520,
      rotation: 7,
      label: "",
      frameColor: frameColors[3],
    },

    // Middle scattered row - 3 MAXIMIZED frames (around center card)
    {
      top: 560,
      left: 120,
      width: 740,
      height: 620,
      rotation: 6,
      label: "",
      frameColor: frameColors[6],
    },
    // CENTER CARD SPACE
    {
      top: 585,
      left: 1580,
      width: 470,
      height: 570,
      rotation: -4,
      label: "",
      frameColor: frameColors[7],
    },
    {
      top: 565,
      left: 2090,
      width: 590,
      height: 620,
      rotation: 5,
      label: "",
      frameColor: frameColors[8],
    },

    // Bottom scattered row - 4 MUCH LARGER frames
    {
      top: 1060,
      left: 130,
      width: 630,
      height: 510,
      rotation: -7,
      label: "",
      frameColor: frameColors[10],
    },
    {
      top: 1070,
      left: 790,
      width: 620,
      height: 500,
      rotation: 6,
      label: "",
      frameColor: frameColors[11],
    },
    {
      top: 1065,
      left: 1440,
      width: 650,
      height: 520,
      rotation: -4,
      label: "",
      frameColor: frameColors[12],
    },
    {
      top: 1075,
      left: 2120,
      width: 560,
      height: 520,
      rotation: 5,
      label: "",
      frameColor: frameColors[13],
    },
  ];

  // Canvas rendering for download
  useEffect(() => {
    const renderToCanvas = async () => {
      if (!canvasRef.current || images.length === 0) return;

      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");
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
      canvas.width = 2800;
      canvas.height = 1600;

      // Draw outer decorative border background (elegant dark frame)
      ctx.fillStyle = '#1a1a1a';
      ctx.fillRect(0, 0, 2800, 1600);

      // Draw inner shadow gradient for depth
      const borderGradient = ctx.createLinearGradient(0, 0, 2800, 1600);
      borderGradient.addColorStop(0, 'rgba(0, 0, 0, 0.4)');
      borderGradient.addColorStop(0.5, 'rgba(0, 0, 0, 0)');
      borderGradient.addColorStop(1, 'rgba(0, 0, 0, 0.4)');
      ctx.fillStyle = borderGradient;
      ctx.fillRect(60, 60, 2680, 1480);

      // Draw decorative silver/metallic accent borders
      ctx.strokeStyle = '#c0c0c0';
      ctx.lineWidth = 10;
      ctx.strokeRect(70, 70, 2660, 1460);

      // Inner metallic border
      ctx.strokeStyle = '#e8e8e8';
      ctx.lineWidth = 4;
      ctx.strokeRect(95, 95, 2610, 1410);

      // Draw main beige background (content area)
      ctx.fillStyle = "#f5f1ed";
      ctx.fillRect(120, 120, 2560, 1360);

      // Load and draw images
      const loadImage = (src: string): Promise<HTMLImageElement> => {
        return new Promise((resolve, reject) => {
          const img = new Image();
          img.crossOrigin = "anonymous";
          img.onload = () => resolve(img);
          img.onerror = reject;
          img.src = src;
        });
      };

      // Draw all polaroid frames with rotation (max 11 frames)
      for (let idx = 0; idx < Math.min(11, images.length); idx++) {
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

          // Draw vibrant colored polaroid frame with enhanced aesthetic border
          const frameWidth = pos.width + 40;
          const frameHeight = pos.height + 60; // Extra space at bottom for label
          ctx.fillStyle = pos.frameColor || "#faf8f3";
          ctx.shadowColor = "rgba(60, 50, 40, 0.35)";
          ctx.shadowBlur = 20;
          ctx.shadowOffsetX = 7;
          ctx.shadowOffsetY = 7;
          ctx.fillRect(
            -frameWidth / 2,
            -frameHeight / 2,
            frameWidth,
            frameHeight
          );
          ctx.shadowColor = "transparent";

          // Add subtle decorative border around frame
          ctx.strokeStyle = "rgba(0, 0, 0, 0.1)";
          ctx.lineWidth = 3;
          ctx.strokeRect(
            -frameWidth / 2 + 5,
            -frameHeight / 2 + 5,
            frameWidth - 10,
            frameHeight - 10
          );

          // Draw image inside polaroid frame with COVER mode - fill entire container
          const imgRatio = img.width / img.height;
          const boxRatio = pos.width / pos.height;
          let drawWidth, drawHeight, offsetX, offsetY;

          // Cover mode - fill entire frame while maintaining aspect ratio
          if (imgRatio > boxRatio) {
            // Image is wider - match height, let width overflow
            drawHeight = pos.height;
            drawWidth = drawHeight * imgRatio;
            offsetX = -(drawWidth - pos.width) / 2;
            offsetY = 0;
          } else {
            // Image is taller - match width, let height overflow
            drawWidth = pos.width;
            drawHeight = drawWidth / imgRatio;
            offsetX = 0;
            offsetY = -(drawHeight - pos.height) / 2;
          }

          // Center image within frame
          const imgX = -pos.width / 2;
          const imgY = -frameHeight / 2 + 35; // 35px from top edge for larger frames

          // Clip to frame and draw image
          ctx.save();
          ctx.beginPath();
          ctx.rect(imgX, imgY, pos.width, pos.height);
          ctx.clip();
          ctx.drawImage(
            img,
            imgX + offsetX,
            imgY + offsetY,
            drawWidth,
            drawHeight
          );
          ctx.restore();

          // Draw label if exists (handwritten style)
          if (pos.label) {
            ctx.fillStyle = "#2a2a2a";
            ctx.font = 'italic 22px "Brush Script MT", cursive, Georgia';
            ctx.textAlign = "center";
            ctx.fillText(pos.label, 0, frameHeight / 2 - 15);
          }

          ctx.restore();
        } catch (error) {
          console.error(`Failed to load image ${idx}:`, error);
        }
      }

      // Draw center card - scrapbook style on MUCH LARGER board
      const centerW = 550;
      const centerH = 420;
      const centerX = (2800 - centerW) / 2; // ~1125px - horizontally centered
      const centerY = (1600 - centerH) / 2; // ~590px - vertically centered

      ctx.save();
      ctx.translate(centerX + centerW / 2, centerY + centerH / 2);
      ctx.rotate((-2 * Math.PI) / 180); // Slight rotation

      // White background with shadow
      ctx.fillStyle = "#ffffff";
      ctx.shadowColor = "rgba(0, 0, 0, 0.25)";
      ctx.shadowBlur = 12;
      ctx.shadowOffsetX = 4;
      ctx.shadowOffsetY = 4;
      ctx.fillRect(-centerW / 2, -centerH / 2, centerW, centerH);
      ctx.shadowColor = "transparent";

      // Purple border (scaled for MUCH LARGER card)
      ctx.strokeStyle = "#8b5cf6";
      ctx.lineWidth = 9;
      ctx.strokeRect(
        -centerW / 2 + 18,
        -centerH / 2 + 18,
        centerW - 36,
        centerH - 36
      );

      // Decorative stars - top (scaled for MUCH LARGER card)
      ctx.fillStyle = "#2a2a2a";
      ctx.font = "42px Arial";
      ctx.textAlign = "center";
      ctx.fillText("★", -105, -150);
      ctx.fillText("★", 105, -150);

      // Center text - scaled for MUCH LARGER card
      ctx.fillStyle = "#2a2a2a";
      ctx.font = "bold 95px Arial, sans-serif";
      ctx.textAlign = "center";
      ctx.fillText("2025", 0, -45);

      ctx.font = 'italic 38px "Brush Script MT", cursive, Georgia';
      ctx.fillText("VISION BOARD", 0, 15);

      // Wavy line decoration - below text (scaled for MUCH LARGER card)
      ctx.strokeStyle = "#2a2a2a";
      ctx.lineWidth = 3.5;
      ctx.beginPath();
      ctx.moveTo(-125, 75);
      ctx.quadraticCurveTo(-63, 67, 0, 75);
      ctx.quadraticCurveTo(63, 83, 125, 75);
      ctx.stroke();

      // Bottom star (scaled for MUCH LARGER card)
      ctx.font = "42px Arial";
      ctx.fillText("★", 0, 155);

      ctx.restore();

      // Add inspirational quotes in containers - scaled and repositioned for MUCH LARGER board
      const quotePositions = [
        { x: 900, y: 190, size: 22, rotation: -3, width: 140, height: 95, radius: 10 }, // Top center empty space
        { x: 1680, y: 310, size: 20, rotation: 4, width: 130, height: 90, radius: 10 }, // Right edge between top images
        { x: 650, y: 480, size: 22, rotation: -2, width: 140, height: 95, radius: 10 }, // Left center between rows
        { x: 1680, y: 500, size: 20, rotation: 5, width: 130, height: 90, radius: 10 }, // Right center
        { x: 1220, y: 720, size: 22, rotation: 2, width: 140, height: 95, radius: 10 }, // Bottom center between images
        { x: 530, y: 850, size: 20, rotation: -4, width: 130, height: 90, radius: 10 }, // Bottom left edge
        { x: 1530, y: 850, size: 20, rotation: 3, width: 130, height: 90, radius: 10 }, // Bottom right corner
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
    };

    renderToCanvas();
  }, [images]);

  // Download function
  const handleDownload = () => {
    if (!canvasRef.current) return;

    try {
      const dataUrl = canvasRef.current.toDataURL("image/png", 1.0);
      const link = document.createElement("a");
      link.download = "vision-board-2025.png";
      link.href = dataUrl;
      link.click();
    } catch (error) {
      console.error("Download error:", error);
      alert("Download failed. Please try again.");
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
        width={2800}
        height={1600}
        style={{ display: "none" }}
      />

      {/* Visible Vision Board - MUCH LARGER with decorative border */}
      <div
        ref={containerRef}
        className="relative w-[2800px] h-[1600px] mx-auto overflow-hidden"
        style={{
          backgroundColor: "#1a1a1a",
          boxShadow: '0 25px 70px rgba(0, 0, 0, 0.6)',
        }}
      >
        {/* Outer decorative border layers */}
        <div className="absolute inset-0" style={{
          background: 'linear-gradient(135deg, rgba(0,0,0,0.4) 0%, rgba(0,0,0,0) 50%, rgba(0,0,0,0.4) 100%)',
        }} />

        {/* Silver/metallic accent borders */}
        <div className="absolute top-[70px] left-[70px] right-[70px] bottom-[70px]" style={{
          border: '10px solid #c0c0c0',
        }} />
        <div className="absolute top-[95px] left-[95px] right-[95px] bottom-[95px]" style={{
          border: '4px solid #e8e8e8',
        }} />

        {/* Beige scrapbook content area */}
        <div className="absolute top-[120px] left-[120px] w-[2560px] h-[1360px]" style={{
          backgroundColor: "#f5f1ed",
        }}
      >
        {/* Polaroid Frames - Rotated Scrapbook Style - 11 LARGER frames */}
        {images.slice(0, 11).map((image, idx) => {
          const pos = gridPositions[idx];
          if (!pos) return null;

          const frameWidth = pos.width + 30; // Add polaroid frame padding
          const frameHeight = pos.height + 45; // Extra space at bottom for polaroid look

          return (
            <div
              key={idx}
              className="absolute"
              style={{
                top: `${pos.top}px`,
                left: `${pos.left}px`,
                width: `${frameWidth}px`,
                height: `${frameHeight}px`,
                transform: `rotate(${pos.rotation}deg)`,
                transformOrigin: "center center",
              }}
            >
              {/* Vibrant Colored Polaroid Frame with Enhanced Aesthetic Border */}
              <div
                className="w-full h-full relative"
                style={{
                  backgroundColor: pos.frameColor || "#faf8f3",
                  boxShadow: "7px 7px 20px rgba(60, 50, 40, 0.35)",
                  padding: "2% 2% 6% 2%", // Extra padding at bottom
                  border: "3px solid rgba(0, 0, 0, 0.1)",
                  borderRadius: "2px",
                }}
              >
                {/* Image - COVER mode to fill entire container */}
                <img
                  src={image}
                  alt={`Vision ${idx + 1}`}
                  className="w-full"
                  style={{
                    objectFit: "cover",
                    height: "85%",
                  }}
                />

                {/* Label */}
                {pos.label && (
                  <div
                    className="absolute bottom-2 w-full text-center"
                    style={{
                      fontFamily: '"Brush Script MT", cursive, Georgia',
                      fontStyle: "italic",
                      fontSize: "1.1vw",
                      color: "#2a2a2a",
                    }}
                  >
                    {pos.label}
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {/* Inspirational Quotes in Containers - Random from pool */}

        {/* Quote 1 - Top center empty space */}
        <div
          style={{
            position: "absolute",
            top: "190px",
            left: "900px",
            width: "140px",
            height: "95px",
            transform: "rotate(-3deg)",
            backgroundColor: "#ffffff",
            border: "3px solid #000000",
            borderRadius: "10px",
            boxShadow: "4px 4px 12px rgba(0,0,0,0.2)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "10px",
          }}
        >
          <div
            style={{
              fontFamily: "Telma, Arial, sans-serif",
              fontWeight: "bold",
              fontSize: "22px",
              color: "#000000",
              textAlign: "center",
              lineHeight: "1.2",
            }}
            dangerouslySetInnerHTML={{
              __html: selectedQuotes[0].replace("\n", "<br/>"),
            }}
          />
        </div>

        {/* Quote 2 - Right edge between top images */}
        <div
          style={{
            position: "absolute",
            top: "310px",
            left: "1680px",
            width: "130px",
            height: "90px",
            transform: "rotate(4deg)",
            backgroundColor: "#ffffff",
            border: "3px solid #000000",
            borderRadius: "8px",
            boxShadow: "3px 3px 8px rgba(0,0,0,0.15)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "8px",
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

        {/* Quote 3 - Left center between rows */}
        <div
          style={{
            position: "absolute",
            top: "480px",
            left: "650px",
            width: "140px",
            height: "95px",
            transform: "rotate(-2deg)",
            backgroundColor: "#ffffff",
            border: "3px solid #000000",
            borderRadius: "8px",
            boxShadow: "3px 3px 8px rgba(0,0,0,0.15)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "8px",
          }}
        >
          <div
            style={{
              fontFamily: "Telma, Arial, sans-serif",
              fontWeight: "bold",
              fontSize: "18px",
              color: "#000000",
              textAlign: "center",
              lineHeight: "1.2",
            }}
            dangerouslySetInnerHTML={{
              __html: selectedQuotes[2].replace("\n", "<br/>"),
            }}
          />
        </div>

        {/* Quote 4 - Right center */}
        <div
          style={{
            position: "absolute",
            top: "500px",
            left: "1680px",
            width: "130px",
            height: "90px",
            transform: "rotate(5deg)",
            backgroundColor: "#ffffff",
            border: "3px solid #000000",
            borderRadius: "8px",
            boxShadow: "3px 3px 8px rgba(0,0,0,0.15)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "8px",
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

        {/* Quote 5 - Bottom center between images */}
        <div
          style={{
            position: "absolute",
            top: "720px",
            left: "1220px",
            width: "140px",
            height: "95px",
            transform: "rotate(2deg)",
            backgroundColor: "#ffffff",
            border: "3px solid #000000",
            borderRadius: "8px",
            boxShadow: "3px 3px 8px rgba(0,0,0,0.15)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "8px",
          }}
        >
          <div
            style={{
              fontFamily: "Telma, Arial, sans-serif",
              fontWeight: "bold",
              fontSize: "18px",
              color: "#000000",
              textAlign: "center",
              lineHeight: "1.2",
            }}
            dangerouslySetInnerHTML={{
              __html: selectedQuotes[4].replace("\n", "<br/>"),
            }}
          />
        </div>

        {/* Quote 6 - Bottom left edge */}
        <div
          style={{
            position: "absolute",
            top: "850px",
            left: "530px",
            width: "130px",
            height: "90px",
            transform: "rotate(-4deg)",
            backgroundColor: "#ffffff",
            border: "3px solid #000000",
            borderRadius: "8px",
            boxShadow: "3px 3px 8px rgba(0,0,0,0.15)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "8px",
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

        {/* Quote 7 - Bottom right corner */}
        <div
          style={{
            position: "absolute",
            top: "850px",
            left: "1530px",
            width: "130px",
            height: "90px",
            transform: "rotate(3deg)",
            backgroundColor: "#ffffff",
            border: "3px solid #000000",
            borderRadius: "8px",
            boxShadow: "3px 3px 8px rgba(0,0,0,0.15)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "8px",
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
              __html: selectedQuotes[6].replace("\n", "<br/>"),
            }}
          />
        </div>

        {/* Center Card - MUCH LARGER size and centered on bigger board */}
        <div
          className="absolute flex flex-col items-center justify-center bg-white"
          style={{
            top: "590px",
            left: "1125px",
            width: "550px",
            height: "420px",
            transform: "rotate(-2deg)",
            boxShadow: "7px 7px 20px rgba(0, 0, 0, 0.25)",
          }}
        >
          {/* Purple Border - scaled for MUCH LARGER card */}
          <div
            style={{
              position: "absolute",
              top: "18px",
              left: "18px",
              right: "18px",
              bottom: "18px",
              border: "9px solid #8b5cf6",
            }}
          />

          {/* Decorative Stars - scaled */}
          <div
            style={{
              position: "absolute",
              top: "42px",
              fontSize: "42px",
              color: "#2a2a2a",
              display: "flex",
              gap: "210px",
            }}
          >
            <span>★</span>
            <span>★</span>
          </div>

          {/* Main Text Container */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "12px",
              marginTop: "-18px",
            }}
          >
            <div
              style={{
                fontSize: "95px",
                fontWeight: "bold",
                color: "#2a2a2a",
                lineHeight: "1",
              }}
            >
              2025
            </div>
            <div
              style={{
                fontFamily: '"Brush Script MT", cursive, Georgia',
                fontStyle: "italic",
                fontSize: "38px",
                color: "#2a2a2a",
                marginTop: "12px",
              }}
            >
              VISION BOARD
            </div>
          </div>

          {/* Bottom Star - scaled */}
          <div
            style={{
              position: "absolute",
              bottom: "48px",
              fontSize: "42px",
              color: "#2a2a2a",
            }}
          >
            ★
          </div>

          {/* Wavy Line */}
          <svg
            style={{
              position: "absolute",
              bottom: "60px",
              width: "50%",
            }}
            height="20"
            viewBox="0 0 100 10"
          >
            <path
              d="M0,5 Q25,0 50,5 T100,5"
              stroke="#2a2a2a"
              strokeWidth="2.5"
              fill="none"
            />
          </svg>
        </div>
        </div> {/* End of beige scrapbook content area */}
      </div> {/* End of outer container */}
    </>
  );
}
