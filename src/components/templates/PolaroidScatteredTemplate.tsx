"use client";

import React, { useRef, useEffect } from "react";

interface PolaroidScatteredTemplateProps {
  images: string[]; // 14 images (7 DALL-E + 7 Gemini)
  keywords: string[];
}

export default function PolaroidScatteredTemplate({
  images,
  keywords,
}: PolaroidScatteredTemplateProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  // Positions for 14 images - Magazine collage style like sample.png
  // Reference: sample.png shows tight collage with images filling entire canvas
  // Canvas: 1344x768, Center card takes middle area
  // BIGGER polaroids filling more space, matching sample.png aesthetic
  const polaroidPositions = [
    // TOP LEFT CORNER (3 images) - BIGGER sizes
    { top: 5, left: 5, rotate: -3, width: 240, height: 280, zIndex: 12, keyword: keywords[0] },
    { top: 20, left: 260, rotate: 4, width: 220, height: 260, zIndex: 11, keyword: "" },
    { top: 10, left: 495, rotate: -2, width: 230, height: 270, zIndex: 10, keyword: keywords[1] },

    // TOP RIGHT CORNER (3 images) - BIGGER sizes
    { top: 15, left: 740, rotate: 3, width: 225, height: 265, zIndex: 13, keyword: "" },
    { top: 5, left: 980, rotate: -4, width: 235, height: 275, zIndex: 12, keyword: keywords[2] },
    { top: 20, left: 1230, rotate: 2, width: 210, height: 250, zIndex: 11, keyword: "" },

    // MIDDLE LEFT (2 images) - BIGGER sizes
    { top: 300, left: 10, rotate: 4, width: 230, height: 270, zIndex: 9, keyword: "" },
    { top: 310, left: 255, rotate: -3, width: 220, height: 260, zIndex: 8, keyword: keywords[3] },

    // MIDDLE RIGHT (2 images) - BIGGER sizes
    { top: 305, left: 985, rotate: -4, width: 225, height: 265, zIndex: 10, keyword: "" },
    { top: 315, left: 1225, rotate: 3, width: 215, height: 255, zIndex: 9, keyword: keywords[4] },

    // BOTTOM LEFT CORNER (2 images) - BIGGER sizes
    { top: 580, left: 5, rotate: -4, width: 240, height: 280, zIndex: 7, keyword: "" },
    { top: 590, left: 260, rotate: 5, width: 230, height: 270, zIndex: 6, keyword: "" },

    // BOTTOM RIGHT CORNER (2 images) - BIGGER sizes + 14th image added!
    { top: 585, left: 800, rotate: -3, width: 220, height: 260, zIndex: 8, keyword: "" },
    { top: 575, left: 1035, rotate: 4, width: 235, height: 275, zIndex: 7, keyword: "" },
  ];

  // Quotes positioned between images
  const quotePositions = [
    { top: 160, left: 900, text: keywords[0] || "I am worthy of my dreams", color: "purple" },
    { top: 430, left: 350, text: keywords[1] || "Every day I grow stronger", color: "rose" },
    { top: 200, left: 100, text: keywords[2] || "My potential is limitless", color: "amber" },
    { top: 480, left: 700, text: keywords[3] || "I create my own reality", color: "blue" },
  ];

  // Canvas rendering for download
  useEffect(() => {
    const renderToCanvas = async () => {
      if (!canvasRef.current || images.length === 0) return;

      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      // Set canvas size
      canvas.width = 1344;
      canvas.height = 768;

      // Draw white background
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, 1344, 768);

      // Load and draw all images
      const loadImage = (src: string): Promise<HTMLImageElement> => {
        return new Promise((resolve, reject) => {
          const img = new Image();
          img.crossOrigin = 'anonymous';
          img.onload = () => resolve(img);
          img.onerror = reject;
          img.src = src;
        });
      };

      // Draw all polaroid images
      for (let idx = 0; idx < Math.min(14, images.length); idx++) {
        const pos = polaroidPositions[idx];
        if (!pos) continue;

        try {
          const img = await loadImage(images[idx]);

          ctx.save();
          ctx.translate(pos.left + pos.width / 2, pos.top + pos.height / 2);
          ctx.rotate((pos.rotate * Math.PI) / 180);
          ctx.translate(-(pos.width / 2), -(pos.height / 2));

          // Draw polaroid frame (white background)
          ctx.fillStyle = '#ffffff';
          ctx.shadowColor = 'rgba(0, 0, 0, 0.3)';
          ctx.shadowBlur = 15;
          ctx.shadowOffsetX = 0;
          ctx.shadowOffsetY = 4;
          ctx.fillRect(0, 0, pos.width, pos.height);
          ctx.shadowColor = 'transparent';

          // Draw photo area
          const photoHeight = pos.height * 0.85 - 24;
          const padding = 12;
          ctx.fillStyle = '#f3f4f6';
          ctx.fillRect(padding, padding, pos.width - padding * 2, photoHeight);

          // Draw image (contain fit)
          const imgRatio = img.width / img.height;
          const boxRatio = (pos.width - padding * 2) / photoHeight;
          let drawWidth, drawHeight, drawX, drawY;

          if (imgRatio > boxRatio) {
            drawWidth = pos.width - padding * 2;
            drawHeight = drawWidth / imgRatio;
            drawX = padding;
            drawY = padding + (photoHeight - drawHeight) / 2;
          } else {
            drawHeight = photoHeight;
            drawWidth = drawHeight * imgRatio;
            drawX = padding + ((pos.width - padding * 2) - drawWidth) / 2;
            drawY = padding;
          }

          ctx.drawImage(img, drawX, drawY, drawWidth, drawHeight);

          // Draw keyword overlay if exists
          if (pos.keyword) {
            const keywordY = padding + photoHeight - 30;
            ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
            ctx.fillRect(padding + 8, keywordY, pos.width - padding * 2 - 16, 24);
            ctx.fillStyle = '#1f2937';
            ctx.font = '14px Arial, sans-serif';
            ctx.textAlign = 'center';
            ctx.fillText(pos.keyword, pos.width / 2, keywordY + 16);
          }

          ctx.restore();
        } catch (error) {
          console.error(`Failed to load image ${idx}:`, error);
        }
      }

      // Draw center card
      ctx.save();
      ctx.translate(672, 384);
      ctx.rotate(-0.017); // -1 degree
      ctx.translate(-150, -100);

      ctx.fillStyle = '#ffffff';
      ctx.shadowColor = 'rgba(0, 0, 0, 0.5)';
      ctx.shadowBlur = 30;
      ctx.fillRect(0, 0, 300, 200);
      ctx.shadowColor = 'transparent';

      // Draw center card border
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 8;
      ctx.strokeRect(0, 0, 300, 200);

      // Draw center card text
      ctx.fillStyle = '#9ca3af';
      ctx.font = '10px Arial';
      ctx.textAlign = 'center';
      ctx.fillText('800+', 150, 40);

      ctx.font = 'bold 12px Arial';
      ctx.fillStyle = '#4b5563';
      ctx.fillText('elements', 150, 55);

      ctx.font = 'italic 48px Georgia';
      ctx.fillStyle = '#1f2937';
      ctx.fillText('2025', 150, 105);

      ctx.font = '48px serif';
      ctx.fillText('Guided', 150, 145);
      ctx.fillText('Vision board', 150, 175);

      ctx.font = '14px cursive';
      ctx.fillStyle = '#4b5563';
      ctx.fillText('affirmations included ♡', 150, 195);

      ctx.restore();

      // Draw quote boxes
      const colors = {
        purple: { bg: "#f3e8ff", border: "#d8b4fe", dot: "#c084fc" },
        rose: { bg: "#ffe4e6", border: "#fda4af", dot: "#fb7185" },
        amber: { bg: "#fef3c7", border: "#fcd34d", dot: "#f59e0b" },
        blue: { bg: "#dbeafe", border: "#93c5fd", dot: "#60a5fa" },
      };

      quotePositions.slice(0, Math.min(4, keywords.length)).forEach((quote) => {
        const colorScheme = colors[quote.color as keyof typeof colors] || colors.purple;
        const rotation = (Math.random() > 0.5 ? 1 : -1) * (Math.floor(Math.random() * 8) + 2);

        ctx.save();
        ctx.translate(quote.left + 80, quote.top + 20);
        ctx.rotate((rotation * Math.PI) / 180);
        ctx.translate(-80, -20);

        // Draw quote box
        ctx.fillStyle = colorScheme.bg;
        ctx.strokeStyle = colorScheme.border;
        ctx.lineWidth = 2;
        ctx.shadowColor = 'rgba(0, 0, 0, 0.1)';
        ctx.shadowBlur = 10;
        roundRect(ctx, 0, 0, 160, 40, 8);
        ctx.fill();
        ctx.stroke();
        ctx.shadowColor = 'transparent';

        // Draw dot
        ctx.fillStyle = colorScheme.dot;
        ctx.beginPath();
        ctx.arc(-8, -8, 6, 0, Math.PI * 2);
        ctx.fill();

        // Draw text
        ctx.fillStyle = '#1f2937';
        ctx.font = '14px cursive';
        ctx.textAlign = 'center';
        ctx.fillText(quote.text, 80, 25);

        ctx.restore();
      });

      // Draw decorative emojis
      ctx.font = '32px Arial';
      ctx.fillText('✨', 520, 170);
      ctx.font = '24px Arial';
      ctx.fillText('⭐', 1064, 450);
      ctx.fillText('🌸', 380, 648);
      ctx.font = '18px Arial';
      ctx.fillText('💫', 1224, 290);
    };

    renderToCanvas();
  }, [images, keywords]);

  // Helper function for rounded rectangles
  const roundRect = (ctx: CanvasRenderingContext2D, x: number, y: number, width: number, height: number, radius: number) => {
    ctx.beginPath();
    ctx.moveTo(x + radius, y);
    ctx.lineTo(x + width - radius, y);
    ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
    ctx.lineTo(x + width, y + height - radius);
    ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
    ctx.lineTo(x + radius, y + height);
    ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
    ctx.lineTo(x, y + radius);
    ctx.quadraticCurveTo(x, y, x + radius, y);
    ctx.closePath();
  };

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

  // Make download function available globally
  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (window as any).downloadVisionBoard = handleDownload;
    return () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      delete (window as any).downloadVisionBoard;
    };
  }, [handleDownload]);

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
      <div ref={containerRef} className="relative w-[1344px] h-[768px] overflow-hidden" style={{ backgroundColor: '#ffffff' }}>
        {/* Clean white background like sample5.jpg - no gradients to avoid oklch errors */}

        {/* CENTER CARD - "2025 Guided Vision Board" */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white px-12 py-8 rounded-sm shadow-2xl transform -rotate-1 z-30 border-4 border-white">
        <div className="text-center space-y-2">
          <p className="text-xs font-medium text-gray-500 uppercase tracking-widest">800+</p>
          <p className="text-sm font-bold text-gray-600">elements</p>
          <p className="text-5xl font-light text-gray-800 italic" style={{ fontFamily: 'Georgia, serif' }}>2025</p>
          <h2 className="text-5xl font-serif font-normal text-gray-900 leading-tight mt-2">
            Guided<br/>Vision board
          </h2>
          <p className="text-base text-gray-600 mt-3" style={{ fontFamily: 'cursive' }}>
            affirmations included ♡
          </p>
        </div>
      </div>

      {/* POLAROID IMAGES - 14 images in magazine collage style */}
      {images.slice(0, 14).map((image, idx) => {
        const pos = polaroidPositions[idx];
        if (!pos) return null;

        return (
          <div
            key={idx}
            className="absolute bg-white p-3 shadow-xl hover:shadow-2xl transition-all duration-300"
            style={{
              top: `${pos.top}px`,
              left: `${pos.left}px`,
              width: `${pos.width}px`,
              height: `${pos.height}px`,
              transform: `rotate(${pos.rotate}deg)`,
              zIndex: pos.zIndex,
            }}
          >
            {/* Photo area - 85% of height */}
            <div
              className="w-full bg-gray-100 overflow-hidden relative"
              style={{ height: `${pos.height * 0.85 - 24}px` }}
            >
              <img
                src={image}
                alt={`Vision ${idx + 1}`}
                className="w-full h-full object-contain"
                style={{ objectFit: 'contain' }}
              />
              {/* Overlay keyword directly ON image like sample.png */}
              {pos.keyword && (
                <div className="absolute bottom-2 left-2 right-2 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-md">
                  <p className="text-sm font-medium text-gray-800 text-center" style={{ fontFamily: 'Arial, sans-serif' }}>
                    {pos.keyword}
                  </p>
                </div>
              )}
            </div>
            {/* Caption area - 15% of height, empty for clean look */}
            <div
              className="w-full flex items-center justify-center"
              style={{ height: `${pos.height * 0.15}px` }}
            >
              {/* Empty for polaroid aesthetic */}
            </div>
          </div>
        );
      })}

      {/* QUOTE BOXES - positioned between images - using only hex colors to avoid oklch error */}
      {quotePositions.slice(0, Math.min(4, keywords.length)).map((quote, idx) => {
        const colors = {
          purple: { bg: "#f3e8ff", border: "#d8b4fe", dot: "#c084fc" },
          rose: { bg: "#ffe4e6", border: "#fda4af", dot: "#fb7185" },
          amber: { bg: "#fef3c7", border: "#fcd34d", dot: "#f59e0b" },
          blue: { bg: "#dbeafe", border: "#93c5fd", dot: "#60a5fa" },
        };
        const colorScheme = colors[quote.color as keyof typeof colors] || colors.purple;

        return (
          <div
            key={`quote-${idx}`}
            className="absolute z-25"
            style={{
              backgroundColor: colorScheme.bg,
              borderWidth: '2px',
              borderStyle: 'solid',
              borderColor: colorScheme.border,
              borderRadius: '8px',
              padding: '12px 20px',
              maxWidth: '160px',
              boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
              top: `${quote.top}px`,
              left: `${quote.left}px`,
              transform: `rotate(${Math.random() > 0.5 ? '' : '-'}${Math.floor(Math.random() * 8 + 2)}deg)`,
            }}
          >
            <div
              style={{
                position: 'absolute',
                top: '-8px',
                left: '-8px',
                width: '12px',
                height: '12px',
                borderRadius: '50%',
                backgroundColor: colorScheme.dot
              }}
            ></div>
            <p style={{
              fontSize: '14px',
              fontWeight: '500',
              lineHeight: '1.375',
              textAlign: 'center',
              fontFamily: 'cursive',
              color: '#1f2937',
              margin: 0
            }}>
              {quote.text}
            </p>
          </div>
        );
      })}

      {/* Decorative elements like sample5.jpg */}
      <div className="absolute top-[140px] left-[520px] text-4xl z-4 opacity-70">✨</div>
      <div className="absolute top-[420px] right-[280px] text-3xl z-4 opacity-60">⭐</div>
      <div className="absolute bottom-[120px] left-[380px] text-3xl z-4 opacity-60">🌸</div>
      <div className="absolute top-[260px] right-[120px] text-2xl z-4 opacity-70">💫</div>
    </div>
    </>
  );
}
