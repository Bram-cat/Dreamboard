"use client";

import { useState, useRef } from "react";
import html2canvas from "html2canvas";

interface GeneratedImage {
  url: string;
  keyword: string;
}

export default function Home() {
  const [goals, setGoals] = useState("");
  const [images, setImages] = useState<GeneratedImage[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const boardRef = useRef<HTMLDivElement>(null);

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
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async () => {
    if (!boardRef.current) return;

    try {
      const canvas = await html2canvas(boardRef.current, {
        backgroundColor: "#faf5ff",
        scale: 2,
      });

      const link = document.createElement("a");
      link.download = "dreamboard.jpg";
      link.href = canvas.toDataURL("image/jpeg", 0.9);
      link.click();
    } catch (err) {
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

        {/* Input Section */}
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
            placeholder="travel, new home, peace of mind, fitness, career growth"
            className="w-full px-4 py-3 border-2 border-purple-200 rounded-lg focus:outline-none focus:border-purple-500 text-gray-800 mb-4"
            disabled={loading}
          />
          <button
            onClick={handleGenerate}
            disabled={loading}
            className="w-full bg-purple-600 hover:bg-purple-700 disabled:bg-gray-400 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200"
          >
            {loading ? "Generating your vision board..." : "Generate Board"}
          </button>
          {error && (
            <p className="mt-3 text-red-600 text-sm text-center">{error}</p>
          )}
        </div>

        {/* Image Grid */}
        {images.length > 0 && (
          <div className="space-y-6">
            <div
              ref={boardRef}
              className="bg-purple-50 rounded-2xl shadow-lg p-8"
            >
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {images.map((img, index) => (
                  <div
                    key={index}
                    className="relative aspect-square rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-shadow"
                  >
                    <img
                      src={img.url}
                      alt={img.keyword}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white py-2 px-3 text-sm font-medium text-center">
                      {img.keyword}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Download Button */}
            <button
              onClick={handleDownload}
              className="w-full bg-pink-600 hover:bg-pink-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200"
            >
              Download Board
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
