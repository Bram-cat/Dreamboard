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

  // Polaroid scrapbook layout - 11 images with MAXIMIZED middle row and aesthetic borders
  // Middle row frames significantly larger to fill space
  const gridPositions = [
    // Top scattered row - 4 LARGER frames
    {
      top: 10,
      left: 10,
      width: 500,
      height: 400,
      rotation: -8,
      label: "",
      frameColor: frameColors[0],
    },
    {
      top: 15,
      left: 520,
      width: 490,
      height: 390,
      rotation: 5,
      label: "",
      frameColor: frameColors[1],
    },
    {
      top: 12,
      left: 1020,
      width: 480,
      height: 385,
      rotation: -3,
      label: "",
      frameColor: frameColors[2],
    },
    {
      top: 18,
      left: 1510,
      width: 590,
      height: 400,
      rotation: 7,
      label: "",
      frameColor: frameColors[3],
    },

    // Middle scattered row - 3 MAXIMIZED frames (around center card) - ADDED ONE MORE
    {
      top: 320,
      left: 10,
      width: 570,
      height: 480,
      rotation: 6,
      label: "",
      frameColor: frameColors[6],
    },
    // CENTER CARD SPACE (700x350, 420x315)
    {
      top: 340,
      left: 1100,
      width: 360,
      height: 440,
      rotation: -4,
      label: "",
      frameColor: frameColors[7],
    },
    {
      top: 325,
      left: 1480,
      width: 620,
      height: 480,
      rotation: 5,
      label: "",
      frameColor: frameColors[8],
    },

    // Bottom scattered row - 4 LARGER frames
    {
      top: 630,
      left: 15,
      width: 490,
      height: 390,
      rotation: -7,
      label: "",
      frameColor: frameColors[10],
    },
    {
      top: 638,
      left: 520,
      width: 480,
      height: 385,
      rotation: 6,
      label: "",
      frameColor: frameColors[11],
    },
    {
      top: 635,
      left: 1010,
      width: 500,
      height: 400,
      rotation: -4,
      label: "",
      frameColor: frameColors[12],
    },
    {
      top: 642,
      left: 1520,
      width: 580,
      height: 400,
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

      // Set canvas size - LARGER dimensions for bigger board
      canvas.width = 2100;
      canvas.height = 945;

      // Draw beige background
      ctx.fillStyle = "#f5f1ed";
      ctx.fillRect(0, 0, 2100, 945);

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

      // Draw all polaroid frames with rotation (max 10 frames)
      for (let idx = 0; idx < Math.min(10, images.length); idx++) {
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

      // Draw center card - scrapbook style on LARGER board
      const centerW = 420;
      const centerH = 315;
      const centerX = (2100 - centerW) / 2; // ~840px - horizontally centered
      const centerY = (945 - centerH) / 2; // ~315px - vertically centered

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

      // Purple border (scaled for LARGER card)
      ctx.strokeStyle = "#8b5cf6";
      ctx.lineWidth = 7;
      ctx.strokeRect(
        -centerW / 2 + 14,
        -centerH / 2 + 14,
        centerW - 28,
        centerH - 28
      );

      // Decorative stars - top (scaled for LARGER card)
      ctx.fillStyle = "#2a2a2a";
      ctx.font = "32px Arial";
      ctx.textAlign = "center";
      ctx.fillText("★", -80, -115);
      ctx.fillText("★", 80, -115);

      // Center text - scaled for LARGER card
      ctx.fillStyle = "#2a2a2a";
      ctx.font = "bold 70px Arial, sans-serif";
      ctx.textAlign = "center";
      ctx.fillText("2025", 0, -35);

      ctx.font = 'italic 28px "Brush Script MT", cursive, Georgia';
      ctx.fillText("VISION BOARD", 0, 10);

      // Wavy line decoration - below text (scaled for LARGER card)
      ctx.strokeStyle = "#2a2a2a";
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.moveTo(-95, 55);
      ctx.quadraticCurveTo(-48, 48, 0, 55);
      ctx.quadraticCurveTo(48, 62, 95, 55);
      ctx.stroke();

      // Bottom star (scaled for LARGER card)
      ctx.font = "32px Arial";
      ctx.fillText("★", 0, 115);

      ctx.restore();

      // Add inspirational quotes in containers - using random quotes from pool
      // Positioned at borders between images or in empty spaces
      const quotePositions = [
        { x: 600, y: 55, size: 18, rotation: -3, width: 110, height: 75, radius: 8 }, // Top center empty space
        { x: 1140, y: 145, size: 16, rotation: 4, width: 100, height: 70, radius: 8 }, // Right edge between top images
        { x: 405, y: 270, size: 18, rotation: -2, width: 110, height: 75, radius: 8 }, // Left center between rows
        { x: 1140, y: 280, size: 16, rotation: 5, width: 100, height: 70, radius: 8 }, // Right center
        { x: 820, y: 430, size: 18, rotation: 2, width: 110, height: 75, radius: 8 }, // Bottom center between images
        { x: 320, y: 510, size: 16, rotation: -4, width: 100, height: 70, radius: 8 }, // Bottom left edge
        { x: 1050, y: 510, size: 16, rotation: 3, width: 100, height: 70, radius: 8 }, // Bottom right corner
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
        width={2100}
        height={945}
        style={{ display: "none" }}
      />

      {/* Visible Vision Board - LARGER dimensions */}
      <div
        ref={containerRef}
        className="relative w-[2100px] h-[945px] mx-auto overflow-hidden"
        style={{
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
            top: "55px",
            left: "600px",
            width: "110px",
            height: "75px",
            transform: "rotate(-3deg)",
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
              __html: selectedQuotes[0].replace("\n", "<br/>"),
            }}
          />
        </div>

        {/* Quote 2 - Right edge between top images */}
        <div
          style={{
            position: "absolute",
            top: "145px",
            left: "1140px",
            width: "100px",
            height: "70px",
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
            top: "270px",
            left: "405px",
            width: "110px",
            height: "75px",
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
            top: "280px",
            left: "1140px",
            width: "100px",
            height: "70px",
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
            top: "430px",
            left: "820px",
            width: "110px",
            height: "75px",
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
            top: "510px",
            left: "320px",
            width: "100px",
            height: "70px",
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
            top: "510px",
            left: "1050px",
            width: "100px",
            height: "70px",
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

        {/* Center Card - LARGER size and centered on bigger board */}
        <div
          className="absolute flex flex-col items-center justify-center bg-white"
          style={{
            top: "315px",
            left: "840px",
            width: "420px",
            height: "315px",
            transform: "rotate(-2deg)",
            boxShadow: "7px 7px 20px rgba(0, 0, 0, 0.25)",
          }}
        >
          {/* Purple Border */}
          <div
            style={{
              position: "absolute",
              top: "14px",
              left: "14px",
              right: "14px",
              bottom: "14px",
              border: "7px solid #8b5cf6",
            }}
          />

          {/* Decorative Stars */}
          <div
            style={{
              position: "absolute",
              top: "32px",
              fontSize: "32px",
              color: "#2a2a2a",
              display: "flex",
              gap: "160px",
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
              gap: "8px",
              marginTop: "-14px",
            }}
          >
            <div
              style={{
                fontSize: "70px",
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
                fontSize: "28px",
                color: "#2a2a2a",
                marginTop: "8px",
              }}
            >
              VISION BOARD
            </div>
          </div>

          {/* Bottom Star */}
          <div
            style={{
              position: "absolute",
              bottom: "35px",
              fontSize: "32px",
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
      </div>
    </>
  );
}
