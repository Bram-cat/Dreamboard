"use client";

import React, { useRef, useEffect } from "react";

interface PolaroidScatteredTemplateProps {
  images: string[]; // 15 personalized images (all Gemini)
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

  // Polaroid scrapbook layout - 15 images scattered with vibrant colors
  // Scaled to 1200px width for laptop screens
  const gridPositions = [
    // Top scattered row - 5 frames
    {
      top: 5,
      left: 5,
      width: 200,
      height: 160,
      rotation: -8,
      label: "",
      frameColor: frameColors[0],
    },
    {
      top: 10,
      left: 215,
      width: 195,
      height: 155,
      rotation: 5,
      label: "",
      frameColor: frameColors[1],
    },
    {
      top: 8,
      left: 420,
      width: 190,
      height: 150,
      rotation: -3,
      label: "",
      frameColor: frameColors[2],
    },
    {
      top: 12,
      left: 620,
      width: 200,
      height: 160,
      rotation: 7,
      label: "",
      frameColor: frameColors[3],
    },
    {
      top: 6,
      left: 830,
      width: 195,
      height: 155,
      rotation: -5,
      label: "",
      frameColor: frameColors[4],
    },
    {
      top: 10,
      left: 1035,
      width: 160,
      height: 130,
      rotation: 4,
      label: "",
      frameColor: frameColors[5],
    },

    // Middle scattered row - 4 frames (around center card)
    {
      top: 185,
      left: 8,
      width: 190,
      height: 150,
      rotation: 6,
      label: "",
      frameColor: frameColors[6],
    },
    {
      top: 190,
      left: 208,
      width: 185,
      height: 145,
      rotation: -4,
      label: "",
      frameColor: frameColors[7],
    },
    // CENTER CARD SPACE (400x200, 240x180)
    {
      top: 188,
      left: 825,
      width: 190,
      height: 150,
      rotation: 5,
      label: "",
      frameColor: frameColors[8],
    },
    {
      top: 192,
      left: 1025,
      width: 170,
      height: 135,
      rotation: -6,
      label: "",
      frameColor: frameColors[9],
    },

    // Bottom scattered row - 5 frames
    {
      top: 360,
      left: 10,
      width: 195,
      height: 155,
      rotation: -7,
      label: "",
      frameColor: frameColors[10],
    },
    {
      top: 365,
      left: 215,
      width: 190,
      height: 150,
      rotation: 6,
      label: "",
      frameColor: frameColors[11],
    },
    {
      top: 362,
      left: 415,
      width: 185,
      height: 145,
      rotation: -4,
      label: "",
      frameColor: frameColors[12],
    },
    {
      top: 368,
      left: 610,
      width: 200,
      height: 160,
      rotation: 5,
      label: "",
      frameColor: frameColors[13],
    },
    {
      top: 363,
      left: 1020,
      width: 175,
      height: 140,
      rotation: -8,
      label: "",
      frameColor: frameColors[14],
    },
  ];

  // Canvas rendering for download
  useEffect(() => {
    const renderToCanvas = async () => {
      if (!canvasRef.current || images.length === 0) return;

      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      // Set canvas size - Laptop-friendly dimensions (1200x540)
      canvas.width = 1200;
      canvas.height = 540;

      // Draw beige background
      ctx.fillStyle = "#f5f1ed";
      ctx.fillRect(0, 0, 1200, 540);

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

          // Draw vibrant colored polaroid frame (larger than image)
          const frameWidth = pos.width + 40;
          const frameHeight = pos.height + 60; // Extra space at bottom for label
          ctx.fillStyle = pos.frameColor || "#faf8f3";
          ctx.shadowColor = "rgba(60, 50, 40, 0.25)";
          ctx.shadowBlur = 15;
          ctx.shadowOffsetX = 5;
          ctx.shadowOffsetY = 5;
          ctx.fillRect(
            -frameWidth / 2,
            -frameHeight / 2,
            frameWidth,
            frameHeight
          );
          ctx.shadowColor = "transparent";

          // Draw image inside polaroid frame with proper cover scaling
          const imgRatio = img.width / img.height;
          const boxRatio = pos.width / pos.height;
          let drawWidth, drawHeight, offsetX, offsetY;

          // Fill the frame completely (cover mode)
          if (imgRatio > boxRatio) {
            // Image is wider - fit to height
            drawHeight = pos.height;
            drawWidth = drawHeight * imgRatio;
            offsetX = -(drawWidth - pos.width) / 2;
            offsetY = 0;
          } else {
            // Image is taller - fit to width
            drawWidth = pos.width;
            drawHeight = drawWidth / imgRatio;
            offsetX = 0;
            offsetY = -(drawHeight - pos.height) / 2;
          }

          // Center image within frame
          const imgX = -pos.width / 2;
          const imgY = -frameHeight / 2 + 20; // 20px from top edge

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

      // Draw center card - scrapbook style (scaled to 1200px width)
      const centerW = 240;
      const centerH = 180;
      const centerX = (1200 - centerW) / 2; // ~480px - horizontally centered
      const centerY = (540 - centerH) / 2; // ~180px - vertically centered

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

      // Purple border (scaled)
      ctx.strokeStyle = "#8b5cf6";
      ctx.lineWidth = 4;
      ctx.strokeRect(
        -centerW / 2 + 8,
        -centerH / 2 + 8,
        centerW - 16,
        centerH - 16
      );

      // Decorative stars - top (scaled for smaller card)
      ctx.fillStyle = "#2a2a2a";
      ctx.font = "18px Arial";
      ctx.textAlign = "center";
      ctx.fillText("★", -45, -65);
      ctx.fillText("★", 45, -65);

      // Center text - scaled for smaller card
      ctx.fillStyle = "#2a2a2a";
      ctx.font = "bold 40px Arial, sans-serif";
      ctx.textAlign = "center";
      ctx.fillText("2025", 0, -20);

      ctx.font = 'italic 16px "Brush Script MT", cursive, Georgia';
      ctx.fillText("VISION BOARD", 0, 5);

      // Wavy line decoration - below text (scaled)
      ctx.strokeStyle = "#2a2a2a";
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(-55, 30);
      ctx.quadraticCurveTo(-28, 26, 0, 30);
      ctx.quadraticCurveTo(28, 34, 55, 30);
      ctx.stroke();

      // Bottom star (scaled)
      ctx.font = "18px Arial";
      ctx.fillText("★", 0, 65);

      ctx.restore();

      // Add inspirational quotes in containers - using random quotes from pool
      const quotePositions = [
        { x: 25, y: 175, size: 22, rotation: -5, width: 90, height: 65 },
        { x: 1105, y: 75, size: 20, rotation: 4, width: 85, height: 60 },
        { x: 405, y: 185, size: 22, rotation: -3, width: 95, height: 70 },
        { x: 1105, y: 350, size: 20, rotation: 5, width: 85, height: 60 },
        { x: 25, y: 345, size: 22, rotation: -4, width: 90, height: 65 },
        { x: 820, y: 355, size: 20, rotation: 3, width: 85, height: 60 },
        { x: 615, y: 185, size: 22, rotation: -2, width: 90, height: 65 },
      ];

      const inspirationalQuotes = quotePositions.map((pos, index) => ({
        text: selectedQuotes[index],
        ...pos,
      }));

      // Draw each quote container
      inspirationalQuotes.forEach((quote) => {
        ctx.save();
        ctx.translate(quote.x, quote.y);
        ctx.rotate((quote.rotation * Math.PI) / 180);

        // Draw white container with black border
        ctx.fillStyle = "#ffffff";
        ctx.shadowColor = "rgba(0, 0, 0, 0.15)";
        ctx.shadowBlur = 8;
        ctx.shadowOffsetX = 3;
        ctx.shadowOffsetY = 3;
        ctx.fillRect(-quote.width / 2, -quote.height / 2, quote.width, quote.height);

        // Draw black border
        ctx.strokeStyle = "#000000";
        ctx.lineWidth = 3;
        ctx.strokeRect(-quote.width / 2, -quote.height / 2, quote.width, quote.height);
        ctx.shadowColor = "transparent";

        // Draw text in black using Telma font
        ctx.fillStyle = "#000000";
        ctx.font = `bold ${quote.size}px Arial, sans-serif`; // Will be replaced with Telma in DOM
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
        width={1200}
        height={540}
        style={{ display: "none" }}
      />

      {/* Visible Vision Board - Laptop-friendly size (1200x540) */}
      <div
        ref={containerRef}
        className="relative w-[1200px] h-[540px] mx-auto overflow-hidden"
        style={{
          backgroundColor: "#f5f1ed",
        }}
      >
        {/* Polaroid Frames - Rotated Scrapbook Style */}
        {images.slice(0, 15).map((image, idx) => {
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
              {/* Vibrant Colored Polaroid Frame */}
              <div
                className="w-full h-full relative"
                style={{
                  backgroundColor: pos.frameColor || "#faf8f3",
                  boxShadow: "5px 5px 15px rgba(60, 50, 40, 0.25)",
                  padding: "2% 2% 6% 2%", // Extra padding at bottom
                }}
              >
                {/* Image */}
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

        {/* Quote 1 - Left side */}
        <div
          style={{
            position: "absolute",
            top: "175px",
            left: "25px",
            width: "90px",
            height: "65px",
            transform: "rotate(-5deg)",
            backgroundColor: "#ffffff",
            border: "3px solid #000000",
            boxShadow: "3px 3px 8px rgba(0,0,0,0.15)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
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

        {/* Quote 2 - Top right */}
        <div
          style={{
            position: "absolute",
            top: "75px",
            left: "1105px",
            width: "85px",
            height: "60px",
            transform: "rotate(4deg)",
            backgroundColor: "#ffffff",
            border: "3px solid #000000",
            boxShadow: "3px 3px 8px rgba(0,0,0,0.15)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div
            style={{
              fontFamily: "Telma, Arial, sans-serif",
              fontWeight: "bold",
              fontSize: "20px",
              color: "#000000",
              textAlign: "center",
              lineHeight: "1.2",
            }}
            dangerouslySetInnerHTML={{
              __html: selectedQuotes[1].replace("\n", "<br/>"),
            }}
          />
        </div>

        {/* Quote 3 - Center left */}
        <div
          style={{
            position: "absolute",
            top: "185px",
            left: "405px",
            width: "95px",
            height: "70px",
            transform: "rotate(-3deg)",
            backgroundColor: "#ffffff",
            border: "3px solid #000000",
            boxShadow: "3px 3px 8px rgba(0,0,0,0.15)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
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
              __html: selectedQuotes[2].replace("\n", "<br/>"),
            }}
          />
        </div>

        {/* Quote 4 - Middle right */}
        <div
          style={{
            position: "absolute",
            top: "350px",
            left: "1105px",
            width: "85px",
            height: "60px",
            transform: "rotate(5deg)",
            backgroundColor: "#ffffff",
            border: "3px solid #000000",
            boxShadow: "3px 3px 8px rgba(0,0,0,0.15)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div
            style={{
              fontFamily: "Telma, Arial, sans-serif",
              fontWeight: "bold",
              fontSize: "20px",
              color: "#000000",
              textAlign: "center",
              lineHeight: "1.2",
            }}
            dangerouslySetInnerHTML={{
              __html: selectedQuotes[3].replace("\n", "<br/>"),
            }}
          />
        </div>

        {/* Quote 5 - Bottom left */}
        <div
          style={{
            position: "absolute",
            top: "345px",
            left: "25px",
            width: "90px",
            height: "65px",
            transform: "rotate(-4deg)",
            backgroundColor: "#ffffff",
            border: "3px solid #000000",
            boxShadow: "3px 3px 8px rgba(0,0,0,0.15)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
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
              __html: selectedQuotes[4].replace("\n", "<br/>"),
            }}
          />
        </div>

        {/* Quote 6 - Bottom center */}
        <div
          style={{
            position: "absolute",
            top: "355px",
            left: "820px",
            width: "85px",
            height: "60px",
            transform: "rotate(3deg)",
            backgroundColor: "#ffffff",
            border: "3px solid #000000",
            boxShadow: "3px 3px 8px rgba(0,0,0,0.15)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div
            style={{
              fontFamily: "Telma, Arial, sans-serif",
              fontWeight: "bold",
              fontSize: "20px",
              color: "#000000",
              textAlign: "center",
              lineHeight: "1.2",
            }}
            dangerouslySetInnerHTML={{
              __html: selectedQuotes[5].replace("\n", "<br/>"),
            }}
          />
        </div>

        {/* Quote 7 - Center right */}
        <div
          style={{
            position: "absolute",
            top: "185px",
            left: "615px",
            width: "90px",
            height: "65px",
            transform: "rotate(-2deg)",
            backgroundColor: "#ffffff",
            border: "3px solid #000000",
            boxShadow: "3px 3px 8px rgba(0,0,0,0.15)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
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
              __html: selectedQuotes[6].replace("\n", "<br/>"),
            }}
          />
        </div>

        {/* Center Card - Properly sized and centered */}
        <div
          className="absolute flex flex-col items-center justify-center bg-white"
          style={{
            top: "180px",
            left: "480px",
            width: "240px",
            height: "180px",
            transform: "rotate(-2deg)",
            boxShadow: "4px 4px 12px rgba(0, 0, 0, 0.25)",
          }}
        >
          {/* Purple Border */}
          <div
            style={{
              position: "absolute",
              top: "8px",
              left: "8px",
              right: "8px",
              bottom: "8px",
              border: "4px solid #8b5cf6",
            }}
          />

          {/* Decorative Stars */}
          <div
            style={{
              position: "absolute",
              top: "18px",
              fontSize: "18px",
              color: "#2a2a2a",
              display: "flex",
              gap: "90px",
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
              gap: "4px",
              marginTop: "-8px",
            }}
          >
            <div
              style={{
                fontSize: "40px",
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
                fontSize: "16px",
                color: "#2a2a2a",
                marginTop: "4px",
              }}
            >
              VISION BOARD
            </div>
          </div>

          {/* Bottom Star */}
          <div
            style={{
              position: "absolute",
              bottom: "20px",
              fontSize: "18px",
              color: "#2a2a2a",
            }}
          >
            ★
          </div>

          {/* Wavy Line */}
          <svg
            style={{
              position: "absolute",
              bottom: "35px",
              width: "50%",
            }}
            height="12"
            viewBox="0 0 100 10"
          >
            <path
              d="M0,5 Q25,0 50,5 T100,5"
              stroke="#2a2a2a"
              strokeWidth="1.5"
              fill="none"
            />
          </svg>
        </div>
      </div>
    </>
  );
}
