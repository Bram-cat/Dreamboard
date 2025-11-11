"use client";

import { useState, useRef, useEffect } from "react";
import html2canvas from "html2canvas";
import VisionBoardCanvas from "@/components/VisionBoardCanvas";
import {
  CleanGridTemplate,
  PolaroidScatteredTemplate,
  MagazineCollageTemplate,
  MinimalScrapbookTemplate,
  TemplateType,
} from "@/components/templates";
import { Progress } from "@/components/ui/progress";

interface GeneratedImage {
  url: string;
  keyword: string;
  source?: string;
}

interface BoardElement {
  id: string;
  type: "person" | "lifestyle" | "quote";
  imageUrl: string;
  description: string;
  size?: "small" | "medium" | "large";
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
  const [keywords, setKeywords] = useState<string[]>([]);
  const [quotes, setQuotes] = useState<string[]>([]);
  const [images, setImages] = useState<GeneratedImage[]>([]);
  const [categorizedUploads, setCategorizedUploads] = useState<CategorizedUploads>({
    selfie: null,
    dreamHouse: null,
    dreamCar: null,
    destination: null
  });
  const [selectedStyle, setSelectedStyle] = useState<"bold" | "polaroid" | "torn" | "random">("random");
  const [selectedTemplate, setSelectedTemplate] = useState<TemplateType | "ai" | "random">("ai");
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState("");
  const [step, setStep] = useState<"input" | "upload" | "preview">("input");
  const [collageReady, setCollageReady] = useState(false);
  const [useHtmlTemplate, setUseHtmlTemplate] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Generation mode selection
  const [generationMode] = useState<"component" | "single" | "openai">("openai"); // Default to OpenAI mode
  const [boardElements, setBoardElements] = useState<BoardElement[]>([]);

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
    setProgress(0);
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
      console.log("Generation mode:", generationMode);

      setProgress(10); // Starting generation

      if (generationMode === "openai") {
        // NEW: DALL-E 3 + Gemini Imagen workflow (individual images for HTML collage)
        console.log("🎨 Generating individual images with DALL-E 3 + Gemini Imagen...");

        // Extract keywords from goals (split by comma or use as-is)
        const extractedKeywords = goals.split(",").map((k) => k.trim()).filter((k) => k.length > 0);
        setKeywords(extractedKeywords);

        setProgress(20); // Keywords extracted

        setProgress(30); // Starting API call

        const response = await fetch("/api/generate-with-openai", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            keywords: extractedKeywords,
            categorizedUploads,
            selectedTemplate,
          }),
        });

        setProgress(70); // API call completed

        if (!response.ok) {
          const errorData = await response.json();
          console.error("Image generation error:", errorData);
          throw new Error(errorData.details || errorData.error || "Failed to generate images");
        }

        const data = await response.json();
        setProgress(90); // Processing results
        console.log(`✓ Generated ${data.metadata?.total_images || 0} total images`);
        console.log(`   - Gemini images: ${data.metadata?.gemini_images || 0}`);
        console.log(`   - DALL-E images: ${data.metadata?.dalle_images || 0}`);

        // If AI-generated template, use final collage; otherwise use individual images for HTML templates
        if (selectedTemplate === "ai") {
          console.log(`✓ AI-generated collage created!`);
          setImages([{ url: data.final_vision_board, keyword: "Vision Board 2025" }]);
        } else {
          console.log(`✓ Using template: ${selectedTemplate} with ${data.individual_images?.length} images`);
          setImages(data.individual_images.map((url: string, idx: number) => ({
            url,
            keyword: extractedKeywords[idx] || `Vision ${idx + 1}`
          })));

          // Store quotes from API response
          if (data.quotes && Array.isArray(data.quotes)) {
            console.log(`✓ Received ${data.quotes.length} inspirational quotes`);
            setQuotes(data.quotes);
          }
        }
        setProgress(100); // Complete
        setCollageReady(true);
      } else if (generationMode === "component") {
        // Component-based generation
        console.log("🎨 Generating component-based vision board...");

        const response = await fetch("/api/generate-board-elements", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            goals,
            categorizedUploads,
            uploadContext,
            style: selectedStyle === "random" ? undefined : selectedStyle,
          }),
        });

        if (!response.ok) {
          throw new Error("Failed to generate board elements");
        }

        const data = await response.json();
        console.log(`✓ Generated ${data.totalElements} elements!`);

        setBoardElements(data.elements);
        setCollageReady(true);
      } else {
        // OLD: Single-image collage generation
        console.log("Generating dense magazine-style collage with 10-15+ elements...");
        const collageResponse = await fetch("/api/collage-direct", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            goals,
            categorizedUploads,
            uploadContext,
            style: selectedStyle === "random" ? undefined : selectedStyle,
          }),
        });

        if (!collageResponse.ok) {
          throw new Error("Failed to create vision board");
        }

        const collageData = await collageResponse.json();
        console.log("✓ Vision board created successfully!");

        // Display the final collage
        const finalCollageImage = {
          url: collageData.collageUrl,
          keyword: "Vision Board 2025",
        };

        setImages([finalCollageImage]);
        setCollageReady(true);
      }

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
      // Check if the template has its own download function (for canvas-based templates)
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      if (typeof (window as any).downloadVisionBoard === 'function') {
        // Use the template's built-in canvas download (CleanGridTemplate, etc.)
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (window as any).downloadVisionBoard();
        return;
      }

      // Fallback to html2canvas for templates without canvas download
      const boardElement = document.querySelector('.vision-board-template') as HTMLElement;
      if (!boardElement) {
        setError("Could not find board to download");
        return;
      }

      // Hide the download button temporarily
      const downloadBtn = document.querySelector('.download-button') as HTMLElement;
      if (downloadBtn) downloadBtn.style.display = 'none';

      // Capture the board with html2canvas
      const canvas = await html2canvas(boardElement, {
        scale: 2, // Higher quality
        useCORS: true,
        allowTaint: true,
        backgroundColor: null,
      });

      // Show the button again
      if (downloadBtn) downloadBtn.style.display = 'flex';

      // Convert canvas to blob and download
      canvas.toBlob((blob) => {
        if (blob) {
          const link = document.createElement("a");
          link.download = "my-vision-board-2025.png";
          link.href = URL.createObjectURL(blob);
          link.click();
          URL.revokeObjectURL(link.href);
        }
      });
    } catch (error) {
      console.error("Download error:", error);
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

            {/* Info about the generation method */}
            <div className="mb-6 p-4 bg-purple-50 border-2 border-purple-200 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <div className="text-2xl">✨</div>
                <h3 className="font-bold text-purple-900">Clean Vision Board Design</h3>
              </div>
              <p className="text-sm text-gray-700">
                Uses Gemini AI to edit YOUR uploads into dream scenarios (you at your dream house, driving your dream car, at your destination). Generates additional lifestyle images with DALL-E 3. Final magazine-style collage matches sample1.png with bold text overlays.
              </p>
            </div>

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

            {/* Template Selection */}
            <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg p-6 mb-6">
              <h3 className="font-bold text-gray-800 mb-3 text-center">Choose Your Vision Board Template</h3>
              <p className="text-xs text-gray-600 mb-4 text-center">Professional Canva-inspired frame styles</p>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
                <button
                  onClick={() => { setSelectedTemplate("ai"); setUseHtmlTemplate(false); }}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    selectedTemplate === "ai"
                      ? "border-purple-600 bg-purple-100 shadow-lg"
                      : "border-gray-300 bg-white hover:border-purple-400"
                  }`}
                >
                  <div className="text-2xl mb-2">🤖</div>
                  <div className="font-bold text-sm">AI Generated</div>
                  <div className="text-xs text-gray-600">Gemini creates unique collage</div>
                </button>

                <button
                  onClick={() => { setSelectedTemplate("polaroid"); setUseHtmlTemplate(true); }}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    selectedTemplate === "polaroid"
                      ? "border-blue-600 bg-blue-100 shadow-lg"
                      : "border-gray-300 bg-white hover:border-blue-400"
                  }`}
                >
                  <div className="text-2xl mb-2">📸</div>
                  <div className="font-bold text-sm">Polaroid</div>
                  <div className="text-xs text-gray-600">Vintage scattered style</div>
                </button>

                <button
                  onClick={() => { setSelectedTemplate("grid"); setUseHtmlTemplate(true); }}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    selectedTemplate === "grid"
                      ? "border-indigo-600 bg-indigo-100 shadow-lg"
                      : "border-gray-300 bg-white hover:border-indigo-400"
                  }`}
                >
                  <div className="text-2xl mb-2">📊</div>
                  <div className="font-bold text-sm">Clean Grid</div>
                  <div className="text-xs text-gray-600">Modern minimal design</div>
                </button>

                <button
                  onClick={() => { setSelectedTemplate("magazine"); setUseHtmlTemplate(true); }}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    selectedTemplate === "magazine"
                      ? "border-pink-600 bg-pink-100 shadow-lg"
                      : "border-gray-300 bg-white hover:border-pink-400"
                  }`}
                >
                  <div className="text-2xl mb-2">📰</div>
                  <div className="font-bold text-sm">Magazine</div>
                  <div className="text-xs text-gray-600">Dynamic collage</div>
                </button>

                <button
                  onClick={() => { setSelectedTemplate("scrapbook"); setUseHtmlTemplate(true); }}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    selectedTemplate === "scrapbook"
                      ? "border-amber-600 bg-amber-100 shadow-lg"
                      : "border-gray-300 bg-white hover:border-amber-400"
                  }`}
                >
                  <div className="text-2xl mb-2">✂️</div>
                  <div className="font-bold text-sm">Scrapbook</div>
                  <div className="text-xs text-gray-600">Handmade pastel</div>
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
            {/* Back Button - ALWAYS VISIBLE at Top Left */}
            <button
              onClick={() => {
                setStep("input");
                setImages([]);
                setBoardElements([]);
                setCategorizedUploads({
                  selfie: null,
                  dreamHouse: null,
                  dreamCar: null,
                  destination: null
                });
                setCollageReady(false);
                setGoals("");
                setSelectedTemplate("ai");
              }}
              className="flex items-center gap-2 bg-white hover:bg-gray-50 text-gray-700 font-semibold py-3 px-6 rounded-lg transition-colors duration-200 shadow-md border-2 border-gray-200 mb-4"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back to Start
            </button>

            {/* Display component-based vision board */}
            {collageReady && generationMode === "component" && boardElements.length > 0 && (
              <VisionBoardCanvas
                elements={boardElements}
                onElementClick={(id) => console.log("Element clicked:", id)}
                onDownload={handleDownload}
              />
            )}

            {/* Display HTML Template or AI-generated collage */}
            {collageReady && images.length > 0 && (
              <div className="relative">
                {selectedTemplate !== "ai" ? (
                  // Render HTML template with individual images
                  <>
                    <div className="vision-board-template">
                      {selectedTemplate === "grid" && (
                        <CleanGridTemplate
                          images={images.map((img) => img.url)}
                          keywords={keywords}
                        />
                      )}
                      {selectedTemplate === "polaroid" && (
                        <PolaroidScatteredTemplate
                          images={images.map((img) => img.url)}
                          quotes={quotes}
                        />
                      )}
                      {selectedTemplate === "magazine" && (
                        <MagazineCollageTemplate
                          images={images.map((img) => img.url)}
                          keywords={keywords}
                        />
                      )}
                      {selectedTemplate === "scrapbook" && (
                        <MinimalScrapbookTemplate
                          images={images.map((img) => img.url)}
                          keywords={keywords}
                        />
                      )}
                    </div>
                    {/* Download button for HTML templates - repositioned to bottom-right */}
                    <button
                      onClick={handleDownload}
                      className="download-button absolute bottom-6 right-6 bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 shadow-lg hover:shadow-2xl hover:scale-105 z-50 flex items-center gap-2"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                      </svg>
                      Download Vision Board
                    </button>
                  </>
                ) : (
                  // Render AI-generated Gemini collage
                  <>
                    <div className="vision-board-template">
                      <img
                        src={images[0].url}
                        alt="Your Vision Board 2025"
                        className="w-full h-auto rounded-lg shadow-2xl"
                      />
                    </div>
                    <button
                      onClick={handleDownload}
                      className="download-button absolute bottom-6 right-6 bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 shadow-lg hover:shadow-2xl hover:scale-105 flex items-center gap-2"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                      </svg>
                      Download Vision Board
                    </button>
                  </>
                )}
              </div>
            )}

            {/* Loading state with progress bar */}
            {!collageReady && (
              <div className="bg-white rounded-2xl shadow-2xl p-8 text-center">
                <div className="space-y-6">
                  {/* Progress bar */}
                  <div className="space-y-3">
                    <p className="text-purple-600 font-bold text-xl flex items-center justify-center gap-2">
                      <svg className="w-6 h-6 animate-pulse" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z"/>
                      </svg>
                      Creating your personalized vision board...
                    </p>

                    {/* Progress Bar Component */}
                    <div className="w-full max-w-xl mx-auto">
                      <Progress value={progress} className="h-3" />
                      <p className="text-sm text-purple-600 font-medium mt-2">{progress}%</p>
                    </div>
                  </div>

                  {/* Preview placeholder with shimmer effect */}
                  <div className="relative h-96 bg-gradient-to-br from-purple-100 to-pink-100 rounded-lg overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-40 animate-shimmer"></div>
                  </div>

                  <div className="space-y-3">
                    <div className="space-y-2">
                      <p className="text-purple-500 text-sm">🎨 Step 1/3: Using Gemini AI to edit YOUR images into dream scenarios</p>
                      <p className="text-purple-500 text-sm">✨ Step 2/3: Generating lifestyle images with DALL-E 3</p>
                      <p className="text-purple-500 text-sm">🖼️ Step 3/3: Composing final collage with bold text overlays</p>
                    </div>
                    <p className="text-gray-500 text-xs mt-4">
                      ⏱️ Takes ~2 minutes (scenario editing + lifestyle images + final composition)
                    </p>
                  </div>
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
                    setBoardElements([]);
                    setCategorizedUploads({
                      selfie: null,
                      dreamHouse: null,
                      dreamCar: null,
                      destination: null
                    });
                    setCollageReady(false);
                    setGoals("");
                    // Don't reset generation mode - keep user's preference
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
