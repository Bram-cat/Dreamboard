"use client";

import Link from "next/link";
import { useState } from "react";

export default function LandingPage() {
  const [email, setEmail] = useState("");

  const features = [
    {
      icon: "✨",
      title: "AI-Powered Generation",
      description:
        "Transform your goals into stunning visual boards using advanced AI technology",
    },
    {
      icon: "🎨",
      title: "Multiple Templates",
      description:
        "Choose from magazine, polaroid, scrapbook, and grid layouts",
    },
    {
      icon: "📸",
      title: "Personalized Images",
      description:
        "Upload your selfie and dream items to create truly personal vision boards",
    },
    {
      icon: "⚡",
      title: "Instant Download",
      description:
        "Generate and download your vision board in high quality within seconds",
    },
    {
      icon: "🔒",
      title: "Privacy First",
      description:
        "Your images and goals are processed securely and never shared",
    },
    {
      icon: "💎",
      title: "Premium Quality",
      description:
        "Professional-grade vision boards worthy of your biggest dreams",
    },
  ];

  const templates = [
    { name: "Magazine", image: "/sample.png" },
    { name: "Polaroid", image: "/sample2.png" },
    { name: "Scrapbook", image: "/sample3.png" },
    { name: "Grid", image: "/image.png" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0D0C1D] via-[#1A1A2E] to-[#0D0C1D]">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-[#0D0C1D]/80 backdrop-blur-lg border-b border-purple-900/20">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <span className="text-4xl">✨</span>
            <h1
              className="text-2xl font-bold"
              style={{ fontFamily: "'Switzer', sans-serif", fontWeight: 700 }}
            >
              <span className="bg-gradient-to-r from-[#E0AAFF] via-[#C77DFF] to-[#9D4EDD] bg-clip-text text-transparent">
                DREAMBOARD
              </span>
            </h1>
          </div>

          <div className="hidden md:flex items-center gap-8">
            <a
              href="#features"
              className="text-gray-300 hover:text-white transition"
            >
              Features
            </a>
            <a
              href="#templates"
              className="text-gray-300 hover:text-white transition"
            >
              Templates
            </a>
            <a
              href="#pricing"
              className="text-gray-300 hover:text-white transition"
            >
              Pricing
            </a>
            <Link
              href="/create"
              className="px-6 py-2 bg-gradient-to-r from-[#7209B7] to-[#9D4EDD] rounded-lg hover:from-[#560BAD] hover:to-[#7209B7] transition text-white font-semibold"
            >
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <h1
            className="text-6xl md:text-8xl font-bold mb-6 leading-tight"
            style={{ fontFamily: "'Switzer', sans-serif", fontWeight: 700 }}
          >
            <span className="bg-gradient-to-r from-[#E0AAFF] via-[#C77DFF] to-[#9D4EDD] bg-clip-text text-transparent">
              MANIFEST YOUR
            </span>
            <br />
            <span className="text-white">DREAMS IN 2025</span>
          </h1>

          <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-12 leading-relaxed">
            Create stunning, personalized vision boards powered by AI. Upload
            your photos, set your goals, and watch as artificial intelligence
            transforms them into beautiful visual manifestations.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <Link
              href="/create"
              className="px-8 py-4 bg-gradient-to-r from-[#7209B7] to-[#9D4EDD] rounded-lg hover:from-[#560BAD] hover:to-[#7209B7] transition text-white font-bold text-lg shadow-lg shadow-purple-500/30"
            >
              Create Free Vision Board
            </Link>
            <a
              href="#templates"
              className="px-8 py-4 bg-[#1A1A2E] border-2 border-purple-500/30 rounded-lg hover:border-purple-400 transition text-white font-bold text-lg"
            >
              View Templates
            </a>
          </div>

          {/* Email Signup */}
          <div className="max-w-md mx-auto">
            <div className="flex gap-2">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 bg-[#1A1A2E] border border-purple-500/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-400"
              />
              <button className="px-6 py-3 bg-gradient-to-r from-[#7209B7] to-[#9D4EDD] rounded-lg hover:from-[#560BAD] hover:to-[#7209B7] transition text-white font-semibold">
                Notify Me
              </button>
            </div>
            <p className="text-sm text-gray-500 mt-2">
              Get notified about new features and templates
            </p>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-6 bg-[#1A1A2E]/30">
        <div className="max-w-7xl mx-auto">
          <h2
            className="text-5xl md:text-6xl font-bold text-center mb-4"
            style={{ fontFamily: "'Switzer', sans-serif", fontWeight: 700 }}
          >
            <span className="bg-gradient-to-r from-[#E0AAFF] to-[#9D4EDD] bg-clip-text text-transparent">
              POWERFUL FEATURES
            </span>
          </h2>
          <p className="text-center text-gray-400 mb-16 text-lg">
            Everything you need to manifest your dreams
          </p>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="p-8 bg-gradient-to-br from-[#1A1A2E] to-[#16213E] rounded-2xl border border-purple-500/20 hover:border-purple-400/40 transition-all hover:scale-105"
              >
                <div className="text-5xl mb-4">{feature.icon}</div>
                <h3 className="text-2xl font-bold mb-3 text-white">
                  {feature.title}
                </h3>
                <p className="text-gray-400 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Templates Section */}
      <section id="templates" className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <h2
            className="text-5xl md:text-6xl font-bold text-center mb-4"
            style={{ fontFamily: "'Switzer', sans-serif", fontWeight: 700 }}
          >
            <span className="bg-gradient-to-r from-[#E0AAFF] to-[#9D4EDD] bg-clip-text text-transparent">
              BEAUTIFUL TEMPLATES
            </span>
          </h2>
          <p className="text-center text-gray-400 mb-16 text-lg">
            Choose from professionally designed layouts
          </p>

          <div className="grid md:grid-cols-2 gap-8">
            {templates.map((template, index) => (
              <div
                key={index}
                className="group relative overflow-hidden rounded-2xl border-2 border-purple-500/20 hover:border-purple-400/60 transition-all"
              >
                <div className="aspect-video bg-gradient-to-br from-[#1A1A2E] to-[#16213E] flex items-center justify-center">
                  <span className="text-6xl opacity-20">{template.name}</span>
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end">
                  <div className="p-6 w-full">
                    <h3 className="text-2xl font-bold text-white mb-2">
                      {template.name} Layout
                    </h3>
                    <p className="text-gray-300 text-sm">
                      Perfect for showcasing your dreams
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="relative overflow-hidden rounded-3xl">
            <div className="absolute inset-0 bg-gradient-to-br from-[#7209B7] via-[#9D4EDD] to-[#E0AAFF]"></div>
            <div className="relative text-center p-12">
              <h2
                className="text-4xl md:text-5xl font-bold text-white mb-6"
                style={{ fontFamily: "'Switzer', sans-serif", fontWeight: 700 }}
              >
                START YOUR JOURNEY TODAY
              </h2>
              <p className="text-xl text-white/90 mb-8">
                Join thousands manifesting their dreams with AI-powered vision
                boards
              </p>
              <Link href="/create">
                <button className="min-w-[200px] px-8 py-4 bg-white text-[#7209B7] hover:bg-white/95 shadow-2xl hover:scale-105 font-bold text-lg rounded-xl transition-all duration-300">
                  Start Creating Today →
                </button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 border-t border-purple-900/20">
        <div className="max-w-7xl mx-auto text-center text-gray-400">
          <p>&copy; 2025 Dreamboard. All rights reserved.</p>
          <div className="flex justify-center gap-6 mt-4">
            <a href="#" className="hover:text-white transition">
              Privacy
            </a>
            <a href="#" className="hover:text-white transition">
              Terms
            </a>
            <a href="#" className="hover:text-white transition">
              Contact
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
