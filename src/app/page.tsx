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

// Categorized user uploads
interface CategorizedUploads {
  selfie: string | null;
  dreamHouse: string | null;
  dreamCar: string | null;
  destination: string | null;
}

export default function Home() {
  const [goals, setGoals] = useState("");
  const [images, setImages] = useState<GeneratedImage[]>([]);
  const [categorizedUploads, setCategorizedUploads] = useState<CategorizedUploads>({
    selfie: null,
    dreamHouse: null,
    dreamCar: null,
    destination: null
  });
  const [selectedStyle, setSelectedStyle] = useState<"bold" | "polaroid" | "torn" | "random">("random");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [step, setStep] = useState<"input" | "upload" | "preview">("input");
  const [collageReady, setCollageReady] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const handleGenerate = async () => {
    if (!goals.trim()) {
      setError("Please enter your goals");
      return;
    }

    setStep("upload"); // Move to upload step
    setCollageReady(false);
  };

  // Helper to resize image to valid aspect ratio (0.5 to 2.0 for Runway API)
  const resizeImageToValidRatio = (file: File, category: keyof CategorizedUploads) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new window.Image();
      img.onload = () => {
        const aspectRatio = img.width / img.height;

        // If aspect ratio is valid (0.5 to 2.0), use as-is
        if (aspectRatio >= 0.5 && aspectRatio <= 2.0) {
          setCategorizedUploads(prev => ({
            ...prev,
            [category]: e.target?.result as string
          }));
          return;
        }

        // Need to crop to valid ratio
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let sourceX = 0;
        let sourceY = 0;
        let sourceWidth = img.width;
        let sourceHeight = img.height;

        // If too wide (> 2.0), crop to 2:1 ratio
        if (aspectRatio > 2.0) {
          sourceWidth = img.height * 2.0;
          sourceX = (img.width - sourceWidth) / 2;
          canvas.width = 1024;
          canvas.height = 512;
        }
        // If too tall (< 0.5), crop to 1:2 ratio
        else {
          sourceHeight = img.width * 2.0;
          sourceY = (img.height - sourceHeight) / 2;
          canvas.width = 512;
          canvas.height = 1024;
        }

        // Draw cropped image
        ctx.drawImage(
          img,
          sourceX, sourceY, sourceWidth, sourceHeight,
          0, 0, canvas.width, canvas.height
        );

        // Convert to data URI
        const resizedDataUri = canvas.toDataURL('image/jpeg', 0.92);
        setCategorizedUploads(prev => ({
          ...prev,
          [category]: resizedDataUri
        }));

        console.log(`Resized ${category} from ${aspectRatio.toFixed(2)} to ${(canvas.width / canvas.height).toFixed(2)} aspect ratio`);
      };

      img.src = e.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  // Handle categorized file upload
  const handleCategorizedUpload = (category: keyof CategorizedUploads, file: File) => {
    resizeImageToValidRatio(file, category);
  };

  const removeCategorizedImage = (category: keyof CategorizedUploads) => {
    setCategorizedUploads(prev => ({
      ...prev,
      [category]: null
    }));
  };

  const proceedToCollage = async () => {
    setLoading(true);
    setStep("preview");

    try {
      // Build categorized context from uploads
      const uploadContext = {
        hasSelfie: !!categorizedUploads.selfie,
        hasDreamHouse: !!categorizedUploads.dreamHouse,
        hasDreamCar: !!categorizedUploads.dreamCar,
        hasDestination: !!categorizedUploads.destination
      };

      console.log("User uploads:", uploadContext);

      // STEP 1: Analyze goals with DeepSeek to generate specific scenarios
      console.log("Step 1/3: Analyzing your goals to create specific scenarios...");
      const analyzeResponse = await fetch("/api/analyze-goals", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          goals,
          uploadContext,
        }),
      });

      if (!analyzeResponse.ok) {
        throw new Error("Failed to analyze goals");
      }

      const analyzeData = await analyzeResponse.json();
      console.log(`✓ Generated ${analyzeData.scenarios.length} specific scenarios`);

      // STEP 2: Generate individual images with Gemini for better facial consistency
      console.log(`Step 2/3: Generating ${analyzeData.scenarios.length} individual images with facial consistency...`);
      const generateResponse = await fetch("/api/generate-images", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          scenarios: analyzeData.scenarios,
          categorizedUploads,
        }),
      });

      if (!generateResponse.ok) {
        throw new Error("Failed to generate individual images");
      }

      const generateData = await generateResponse.json();
      console.log(`✓ Generated ${generateData.images.length} images successfully`);

      // STEP 3: Stitch images into final collage
      console.log("Step 3/3: Stitching images into final collage...");
      const stitchResponse = await fetch("/api/stitch-collage", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          images: generateData.images,
          goals,
        }),
      });

      if (!stitchResponse.ok) {
        throw new Error("Failed to stitch collage");
      }

      const stitchData = await stitchResponse.json();
      console.log("✓ Vision board created successfully!");

      // Display the final collage
      const finalCollageImage = {
        url: stitchData.collageUrl,
        keyword: "Vision Board 2025",
      };

      setImages([finalCollageImage]);
      setCollageReady(true);

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

    // Use only AI generated images (final collage from Runway)
    const allImages = images.map((img) => img.url);

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
  }, [step, collageReady, images]);

  const handleDownload = async () => {
    if (!collageReady || images.length === 0) return;

    try {
      // Download the final collage image from Runway AI
      const imageUrl = images[0].url;

      // Fetch the image and convert to blob
      const response = await fetch(imageUrl);
      const blob = await response.blob();

      // Create download link
      const link = document.createElement("a");
      link.download = "my-vision-board-2025.png";
      link.href = URL.createObjectURL(blob);
      link.click();

      // Clean up
      URL.revokeObjectURL(link.href);
    } catch {
      setError("Failed to download board");
    }
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

        {/* Step 2: Upload Your Images (Categorized) */}
        {step === "upload" && (
          <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
            <h2 className="text-2xl font-bold text-purple-900 mb-4">
              Add Your Personal Touch
            </h2>
            <p className="text-gray-600 mb-6">
              Upload images to personalize your vision board. All uploads are optional!
            </p>

            {/* Categorized Upload Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              {/* Selfie Upload */}
              <div className="border-2 border-dashed border-purple-300 rounded-lg p-6 hover:border-purple-500 transition-colors">
                <div className="text-center">
                  <div className="text-4xl mb-2">📸</div>
                  <h3 className="font-bold text-gray-800 mb-2">Your Selfie</h3>
                  <p className="text-sm text-gray-600 mb-4">
                    We&apos;ll show YOU achieving your goals
                  </p>
                  {categorizedUploads.selfie ? (
                    <div className="relative">
                      <img src={categorizedUploads.selfie} alt="Selfie" className="w-full h-32 object-cover rounded-lg mb-2" />
                      <button onClick={() => removeCategorizedImage('selfie')} className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6">×</button>
                    </div>
                  ) : (
                    <label className="block">
                      <input type="file" accept="image/*" onChange={(e) => e.target.files?.[0] && handleCategorizedUpload('selfie', e.target.files[0])} className="hidden" />
                      <span className="block w-full bg-purple-100 hover:bg-purple-200 text-purple-700 font-semibold py-2 px-4 rounded cursor-pointer">Upload Selfie</span>
                    </label>
                  )}
                </div>
              </div>

              {/* Dream House Upload */}
              <div className="border-2 border-dashed border-pink-300 rounded-lg p-6 hover:border-pink-500 transition-colors">
                <div className="text-center">
                  <div className="text-4xl mb-2">🏠</div>
                  <h3 className="font-bold text-gray-800 mb-2">Dream House</h3>
                  <p className="text-sm text-gray-600 mb-4">
                    Show you AT your dream home
                  </p>
                  {categorizedUploads.dreamHouse ? (
                    <div className="relative">
                      <img src={categorizedUploads.dreamHouse} alt="Dream House" className="w-full h-32 object-cover rounded-lg mb-2" />
                      <button onClick={() => removeCategorizedImage('dreamHouse')} className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6">×</button>
                    </div>
                  ) : (
                    <label className="block">
                      <input type="file" accept="image/*" onChange={(e) => e.target.files?.[0] && handleCategorizedUpload('dreamHouse', e.target.files[0])} className="hidden" />
                      <span className="block w-full bg-pink-100 hover:bg-pink-200 text-pink-700 font-semibold py-2 px-4 rounded cursor-pointer">Upload House</span>
                    </label>
                  )}
                </div>
              </div>

              {/* Dream Car Upload */}
              <div className="border-2 border-dashed border-blue-300 rounded-lg p-6 hover:border-blue-500 transition-colors">
                <div className="text-center">
                  <div className="text-4xl mb-2">🚗</div>
                  <h3 className="font-bold text-gray-800 mb-2">Dream Car</h3>
                  <p className="text-sm text-gray-600 mb-4">
                    Show you DRIVING your dream car
                  </p>
                  {categorizedUploads.dreamCar ? (
                    <div className="relative">
                      <img src={categorizedUploads.dreamCar} alt="Dream Car" className="w-full h-32 object-cover rounded-lg mb-2" />
                      <button onClick={() => removeCategorizedImage('dreamCar')} className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6">×</button>
                    </div>
                  ) : (
                    <label className="block">
                      <input type="file" accept="image/*" onChange={(e) => e.target.files?.[0] && handleCategorizedUpload('dreamCar', e.target.files[0])} className="hidden" />
                      <span className="block w-full bg-blue-100 hover:bg-blue-200 text-blue-700 font-semibold py-2 px-4 rounded cursor-pointer">Upload Car</span>
                    </label>
                  )}
                </div>
              </div>

              {/* Dream Destination Upload */}
              <div className="border-2 border-dashed border-green-300 rounded-lg p-6 hover:border-green-500 transition-colors">
                <div className="text-center">
                  <div className="text-4xl mb-2">✈️</div>
                  <h3 className="font-bold text-gray-800 mb-2">Dream Destination</h3>
                  <p className="text-sm text-gray-600 mb-4">
                    Show you AT your dream location
                  </p>
                  {categorizedUploads.destination ? (
                    <div className="relative">
                      <img src={categorizedUploads.destination} alt="Destination" className="w-full h-32 object-cover rounded-lg mb-2" />
                      <button onClick={() => removeCategorizedImage('destination')} className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6">×</button>
                    </div>
                  ) : (
                    <label className="block">
                      <input type="file" accept="image/*" onChange={(e) => e.target.files?.[0] && handleCategorizedUpload('destination', e.target.files[0])} className="hidden" />
                      <span className="block w-full bg-green-100 hover:bg-green-200 text-green-700 font-semibold py-2 px-4 rounded cursor-pointer">Upload Destination</span>
                    </label>
                  )}
                </div>
              </div>
            </div>

            {/* Style Selection */}
            <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg p-6 mb-6">
              <h3 className="font-bold text-gray-800 mb-3 text-center">Choose Your Vision Board Style</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <button
                  onClick={() => setSelectedStyle("bold")}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    selectedStyle === "bold"
                      ? "border-purple-600 bg-purple-100 shadow-lg"
                      : "border-gray-300 bg-white hover:border-purple-400"
                  }`}
                >
                  <div className="text-2xl mb-2">💪</div>
                  <div className="font-bold text-sm">Bold</div>
                  <div className="text-xs text-gray-600">Graphic & modern</div>
                </button>

                <button
                  onClick={() => setSelectedStyle("polaroid")}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    selectedStyle === "polaroid"
                      ? "border-pink-600 bg-pink-100 shadow-lg"
                      : "border-gray-300 bg-white hover:border-pink-400"
                  }`}
                >
                  <div className="text-2xl mb-2">📸</div>
                  <div className="font-bold text-sm">Polaroid</div>
                  <div className="text-xs text-gray-600">Scattered photos</div>
                </button>

                <button
                  onClick={() => setSelectedStyle("torn")}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    selectedStyle === "torn"
                      ? "border-purple-600 bg-purple-100 shadow-lg"
                      : "border-gray-300 bg-white hover:border-purple-400"
                  }`}
                >
                  <div className="text-2xl mb-2">✨</div>
                  <div className="font-bold text-sm">Torn Paper</div>
                  <div className="text-xs text-gray-600">Soft & dreamy</div>
                </button>

                <button
                  onClick={() => setSelectedStyle("random")}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    selectedStyle === "random"
                      ? "border-gradient-to-r from-purple-600 to-pink-600 bg-gradient-to-r from-purple-100 to-pink-100 shadow-lg"
                      : "border-gray-300 bg-white hover:border-purple-400"
                  }`}
                >
                  <div className="text-2xl mb-2">🎲</div>
                  <div className="font-bold text-sm">Surprise Me</div>
                  <div className="text-xs text-gray-600">Random style</div>
                </button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4">
              <button
                onClick={() => {
                  setStep("input");
                  setImages([]);
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

        {/* Step 3: Final Vision Board Collage */}
        {step === "preview" && (
          <div className="space-y-6">
            {/* Display the final collage fullscreen */}
            {collageReady && images.length > 0 && (
              <div className="relative">
                {/* Fullscreen collage - no frames, no padding */}
                <img
                  src={images[0].url}
                  alt="Your Vision Board 2025"
                  className="w-full h-auto rounded-lg shadow-2xl"
                />

                {/* Download button overlay */}
                <button
                  onClick={handleDownload}
                  className="absolute top-4 right-4 bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 shadow-lg"
                >
                  📥 Download
                </button>
              </div>
            )}

            {/* Loading state */}
            {!collageReady && (
              <div className="bg-white rounded-2xl shadow-2xl p-8 text-center">
                <div className="animate-pulse space-y-4">
                  <div className="h-96 bg-gradient-to-br from-purple-100 to-pink-100 rounded-lg"></div>
                  <p className="text-purple-600 font-medium text-lg">
                    🎨 Creating your personalized vision board...
                  </p>
                  <p className="text-purple-500 text-sm">
                    Step 1: Analyzing your goals with AI
                  </p>
                  <p className="text-purple-500 text-sm">
                    Step 2: Generating individual photos with YOUR face for consistency
                  </p>
                  <p className="text-purple-500 text-sm">
                    Step 3: Stitching everything into a beautiful collage
                  </p>
                  <p className="text-gray-500 text-xs">This may take 60-90 seconds for best quality</p>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            {collageReady && (
              <div className="flex gap-4 justify-center">
                <button
                  onClick={() => {
                    setStep("input");
                    setImages([]);
                    setCategorizedUploads({
                      selfie: null,
                      dreamHouse: null,
                      dreamCar: null,
                      destination: null
                    });
                    setCollageReady(false);
                    setGoals("");
                  }}
                  className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-3 px-8 rounded-lg transition-colors duration-200"
                >
                  🔄 Create New Board
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
