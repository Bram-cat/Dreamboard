"use client";

import { useState, useRef, useEffect } from "react";

interface GeneratedImage {
  url: string;
  keyword: string;
}

const INSPIRATIONAL_QUOTES = [
  "Make your dreams happen",
  "Don't be the same, be better",
  "Love what you do",
  "Go create",
  "You are your only limit",
  "Dream big, work hard",
  "Believe in yourself",
  "Make it happen",
  "Stay focused",
  "Never give up",
  "Success is earned",
  "Keep pushing forward",
  "You got this",
  "Manifest your dreams",
  "Take action today",
  "Be unstoppable",
  "Chase your vision",
  "Create your future",
  "Hustle in silence",
  "Rise and grind",
];

export default function Home() {
  const [goals, setGoals] = useState("");
  const [images, setImages] = useState<GeneratedImage[]>([]);
  const [userImages, setUserImages] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [step, setStep] = useState<"input" | "upload" | "preview">("input");
  const [uploadCategories, setUploadCategories] = useState<string[]>([]);
  const [collageReady, setCollageReady] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleGenerate = async () => {
    if (!goals.trim()) {
      setError("Please enter your goals");
      return;
    }

    setLoading(true);
    setError("");
    setImages([]);

    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ goals }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to generate images");
      }

      const data = await response.json();
      const generatedImages = data.images.map(
        (url: string, index: number) => ({
          url,
          keyword: data.keywords[index],
        })
      );

      setImages(generatedImages);

      // Generate smart upload categories based on keywords
      const categories = generateUploadCategories(goals);
      setUploadCategories(categories);

      setStep("upload"); // Move to upload step
      setCollageReady(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const fileReaders: Promise<string>[] = [];

    Array.from(files).forEach((file) => {
      const reader = new FileReader();
      const promise = new Promise<string>((resolve) => {
        reader.onload = (e) => {
          resolve(e.target?.result as string);
        };
        reader.readAsDataURL(file);
      });
      fileReaders.push(promise);
    });

    Promise.all(fileReaders).then((results) => {
      setUserImages((prev) => [...prev, ...results]);
    });
  };

  const removeUserImage = (index: number) => {
    setUserImages((prev) => prev.filter((_, i) => i !== index));
  };

  const proceedToCollage = async () => {
    setLoading(true);
    setStep("preview");

    try {
      // Step 1: Use DeepSeek to analyze goals and user images to create prompts
      console.log("Step 1: Analyzing goals with DeepSeek...");
      const analyzeResponse = await fetch("/api/analyze", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          goals,
          userImages, // Pass all user uploaded images
        }),
      });

      if (!analyzeResponse.ok) {
        throw new Error("Failed to analyze goals");
      }

      const analyzeData = await analyzeResponse.json();
      const prompts = analyzeData.prompts;
      console.log(`Received ${prompts.length} prompts from DeepSeek`);

      // Step 2: Use Runway AI to generate images from prompts
      console.log("Step 2: Generating images with Runway AI...");
      const runwayResponse = await fetch("/api/runway", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prompts,
          userImages, // Pass user images as references for Runway AI
        }),
      });

      if (!runwayResponse.ok) {
        throw new Error("Failed to generate images with Runway AI");
      }

      const runwayData = await runwayResponse.json();
      console.log(`Generated ${runwayData.images.length} images with Runway AI`);

      // Add generated images to the board
      const generatedImages = runwayData.images.map((url: string, index: number) => ({
        url,
        keyword: prompts[index]?.split(",")[0] || "inspiration",
      }));

      setImages((prev) => [...prev, ...generatedImages]);

      console.log("Vision board ready!");
    } catch (err) {
      console.error("Failed to generate vision board:", err);
      setError(err instanceof Error ? err.message : "Failed to generate vision board");
    }

    setLoading(false);
  };

  const createCollage = async () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Canvas size
    const canvasWidth = 1200;
    const canvasHeight = 1600;
    canvas.width = canvasWidth;
    canvas.height = canvasHeight;

    // Gradient background
    const gradient = ctx.createLinearGradient(0, 0, canvasWidth, canvasHeight);
    gradient.addColorStop(0, "#fef3c7");
    gradient.addColorStop(1, "#fce7f3");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);

    // Combine AI and user images
    const allImages = [...images.map((img) => img.url), ...userImages];

    // Polaroid positions (scattered, overlapping layout)
    const polaroidSize = 200; // Smaller size to fit more
    const polaroidPadding = 15;
    const imageSize = polaroidSize - polaroidPadding * 2;

    const positions: { x: number; y: number; rotation: number; hasQuote: boolean }[] = [];
    const cols = 5; // More columns
    const rows = Math.ceil(allImages.length / cols);

    // Generate scattered positions
    for (let i = 0; i < allImages.length; i++) {
      const col = i % cols;
      const row = Math.floor(i / cols);
      const baseX = 100 + col * (canvasWidth - 200) / cols;
      const baseY = 150 + row * (canvasHeight - 300) / rows;

      positions.push({
        x: baseX + (Math.random() - 0.5) * 80,
        y: baseY + (Math.random() - 0.5) * 80,
        rotation: (Math.random() - 0.5) * 0.3,
        hasQuote: Math.random() > 0.7
      });
    }

    // Draw each polaroid
    const drawPromises = allImages.map((imgSrc, index) => {
      return new Promise<void>((resolve) => {
        const img = new Image();
        // Don't set crossOrigin for data URLs (user uploads)
        if (!imgSrc.startsWith("data:")) {
          img.crossOrigin = "anonymous";
        }

        img.onload = () => {
          const pos = positions[index];

          ctx.save();
          ctx.translate(pos.x + polaroidSize / 2, pos.y + polaroidSize / 2);
          ctx.rotate(pos.rotation);

          // Polaroid shadow
          ctx.shadowColor = "rgba(0, 0, 0, 0.3)";
          ctx.shadowBlur = 15;
          ctx.shadowOffsetX = 5;
          ctx.shadowOffsetY = 5;

          // Polaroid white frame
          ctx.fillStyle = "white";
          ctx.fillRect(-polaroidSize / 2, -polaroidSize / 2, polaroidSize, polaroidSize + 40);

          ctx.shadowColor = "transparent";

          // Draw image
          ctx.drawImage(
            img,
            -polaroidSize / 2 + polaroidPadding,
            -polaroidSize / 2 + polaroidPadding,
            imageSize,
            imageSize
          );

          // Add quote overlay if selected
          if (pos.hasQuote) {
            const quote = INSPIRATIONAL_QUOTES[Math.floor(Math.random() * INSPIRATIONAL_QUOTES.length)];

            ctx.fillStyle = "rgba(0, 0, 0, 0.5)";
            ctx.fillRect(
              -polaroidSize / 2 + polaroidPadding,
              -polaroidSize / 2 + polaroidPadding,
              imageSize,
              imageSize
            );

            ctx.fillStyle = "white";
            ctx.font = "bold 18px Arial";
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";

            // Word wrap for quote
            const words = quote.split(" ");
            const lines: string[] = [];
            let currentLine = words[0];

            for (let i = 1; i < words.length; i++) {
              const testLine = currentLine + " " + words[i];
              if (ctx.measureText(testLine).width > imageSize - 20) {
                lines.push(currentLine);
                currentLine = words[i];
              } else {
                currentLine = testLine;
              }
            }
            lines.push(currentLine);

            lines.forEach((line, i) => {
              ctx.fillText(line, 0, -20 + i * 24);
            });
          }

          ctx.restore();
          resolve();
        };

        img.onerror = () => resolve();
        img.src = imgSrc;
      });
    });

    await Promise.all(drawPromises);

    // Add title
    ctx.fillStyle = "#1f2937";
    ctx.font = "bold 56px Arial";
    ctx.textAlign = "center";
    ctx.fillText("MY VISION BOARD", canvasWidth / 2, 80);

    ctx.font = "italic 28px Arial";
    ctx.fillText("✨ 2024 Goals ✨", canvasWidth / 2, canvasHeight - 50);

    setCollageReady(true);
  };

  // Create collage when user proceeds to preview
  useEffect(() => {
    if (step === "preview" && !collageReady && images.length > 0) {
      createCollage();
    }
  }, [step, collageReady, images, userImages]);

  const handleDownload = async () => {
    const canvas = canvasRef.current;
    if (!canvas || !collageReady) return;

    try {
      const link = document.createElement("a");
      link.download = "my-vision-board.png";
      link.href = canvas.toDataURL("image/png");
      link.click();
    } catch (err) {
      setError("Failed to download board");
    }
  };

  // Generate smart upload categories based on user's goals
  const generateUploadCategories = (goalsText: string): string[] => {
    const categories: string[] = [];
    const lowerGoals = goalsText.toLowerCase();

    // Always ask for a selfie first
    categories.push("your photo/selfie (we'll add it to your dream scenarios!)");

    if (lowerGoals.includes("car") || lowerGoals.includes("vehicle")) {
      categories.push("your dream car");
    }
    if (lowerGoals.includes("home") || lowerGoals.includes("house") || lowerGoals.includes("property")) {
      categories.push("your dream home/property");
    }
    if (lowerGoals.includes("travel") || lowerGoals.includes("vacation")) {
      categories.push("your favorite travel destination");
    }
    if (lowerGoals.includes("fitness") || lowerGoals.includes("body") || lowerGoals.includes("health")) {
      categories.push("your fitness/workout inspiration");
    }
    if (lowerGoals.includes("fashion") || lowerGoals.includes("style") || lowerGoals.includes("clothes")) {
      categories.push("your style/fashion inspiration");
    }
    if (lowerGoals.includes("food") || lowerGoals.includes("healthy eating")) {
      categories.push("your healthy food/meal inspiration");
    }

    // Add general categories for women
    if (categories.length < 4) {
      categories.push("favorite healthy meals/food");
      categories.push("workout/fitness inspiration");
      categories.push("travel memories or dream destinations");
    }

    return categories.slice(0, 6);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-purple-900 mb-3">
            DreamBoard AI ✨
          </h1>
          <p className="text-gray-600 text-lg">
            Turn your dreams into a visual vision board
          </p>
        </div>

        {/* Step 1: Input Goals */}
        {step === "input" && (
          <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
            <label
              htmlFor="goals"
              className="block text-gray-700 font-medium mb-3 text-lg"
            >
              What are your goals?
            </label>
            <input
              id="goals"
              type="text"
              value={goals}
              onChange={(e) => setGoals(e.target.value)}
              placeholder="travel, dream car, luxury home, fitness, success"
              className="w-full px-4 py-3 border-2 border-purple-200 rounded-lg focus:outline-none focus:border-purple-500 text-gray-800 mb-4"
              disabled={loading}
            />
            <button
              onClick={handleGenerate}
              disabled={loading}
              className="w-full bg-purple-600 hover:bg-purple-700 disabled:bg-gray-400 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200"
            >
              {loading ? "Generating inspiration..." : "Generate Images"}
            </button>
            {error && (
              <p className="mt-3 text-red-600 text-sm text-center">{error}</p>
            )}
          </div>
        )}

        {/* Step 2: Upload Your Images */}
        {step === "upload" && (
          <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
            <h2 className="text-2xl font-bold text-purple-900 mb-4">
              Add Your Personal Touch
            </h2>
            <p className="text-gray-600 mb-4">
              Upload images that represent YOUR vision:
            </p>

            {/* Smart upload suggestions */}
            <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg p-4 mb-6">
              <p className="font-semibold text-purple-900 mb-2">📸 Suggested uploads based on your goals:</p>
              <ul className="space-y-1 text-sm text-gray-700">
                {uploadCategories.map((category, index) => (
                  <li key={index} className="flex items-start">
                    <span className="text-purple-500 mr-2">•</span>
                    <span className="capitalize">{category}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* File Upload */}
            <div className="mb-6">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                multiple
                onChange={handleFileUpload}
                className="hidden"
              />
              <button
                onClick={() => fileInputRef.current?.click()}
                className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold py-4 px-6 rounded-lg transition-all duration-200 shadow-md"
              >
                📸 Upload Images
              </button>
            </div>

            {/* Preview uploaded images */}
            {userImages.length > 0 && (
              <div className="mb-6">
                <h3 className="font-semibold text-gray-700 mb-3">
                  Your Images ({userImages.length})
                </h3>
                <div className="grid grid-cols-3 md:grid-cols-4 gap-3">
                  {userImages.map((img, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={img}
                        alt={`Upload ${index + 1}`}
                        className="w-full h-24 object-cover rounded-lg"
                      />
                      <button
                        onClick={() => removeUserImage(index)}
                        className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Info Box */}
            <div className="bg-gradient-to-r from-purple-50 to-pink-50 border-l-4 border-purple-500 p-4 mb-6">
              <p className="text-purple-900 text-sm mb-2">
                🤖 <strong>AI-Powered Enhancement:</strong>
              </p>
              <ul className="text-sm text-gray-700 space-y-1 ml-4">
                <li>✨ <strong>DeepSeek AI</strong> analyzes your goals to create personalized scenarios</li>
                <li>🎨 Generates images showing YOU living your dream life</li>
                <li>🚀 Creates 30+ inspiring images: luxury lifestyle, success moments, dream possessions</li>
                <li>💎 Combines your uploads with AI-generated aspirational content</li>
              </ul>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4">
              <button
                onClick={() => {
                  setStep("input");
                  setImages([]);
                  setUserImages([]);
                }}
                className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-3 px-6 rounded-lg transition-colors duration-200"
              >
                ← Back
              </button>
              <button
                onClick={proceedToCollage}
                disabled={loading}
                className="flex-1 bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700 disabled:bg-gray-400 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 shadow-lg"
              >
                {loading ? "🤖 AI Creating Your Board..." : "✨ Generate AI Vision Board →"}
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Vision Board Collage */}
        {step === "preview" && (
          <div className="space-y-6">
            {/* Hidden Canvas for collage generation */}
            <canvas ref={canvasRef} style={{ display: "none" }} />

            {/* Display the collage */}
            {collageReady && (
              <div className="bg-white rounded-2xl shadow-2xl p-4 md:p-6">
                <img
                  src={canvasRef.current?.toDataURL()}
                  alt="Vision Board Collage"
                  className="w-full h-auto rounded-lg shadow-lg"
                />
              </div>
            )}

            {/* Loading state */}
            {!collageReady && (
              <div className="bg-white rounded-2xl shadow-2xl p-8 text-center">
                <div className="animate-pulse">
                  <div className="h-96 bg-gradient-to-br from-purple-100 to-pink-100 rounded-lg mb-4"></div>
                  <p className="text-purple-600 font-medium text-lg">
                    ✨ Creating your vision board with Polaroid frames and quotes...
                  </p>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            {collageReady && (
              <div className="flex gap-4 max-w-2xl mx-auto">
                <button
                  onClick={() => {
                    setStep("upload");
                    setCollageReady(false);
                  }}
                  className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-3 px-6 rounded-lg transition-colors duration-200"
                >
                  ← Edit Images
                </button>
                <button
                  onClick={handleDownload}
                  className="flex-1 bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 shadow-lg"
                >
                  📥 Download Vision Board
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
