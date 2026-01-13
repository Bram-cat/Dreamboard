"use client";

// next js update
import Link from "next/link";
import Navigation from "@/components/Navigation";
import { Button } from "@/components/ui/Button";
import { useState, useEffect } from "react";

export default function HomePage() {
  const [hoveredFeature, setHoveredFeature] = useState<number | null>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("animate-fade-in");
          }
        });
      },
      { threshold: 0.1 }
    );

    const sections = document.querySelectorAll(".animate-on-scroll");
    sections.forEach((section) => observer.observe(section));

    return () => observer.disconnect();
  }, []);

  const features = [
    {
      title: "AI-Powered Creation",
      description:
        "Advanced AI transforms your dreams into stunning visual boards in seconds using cutting-edge technology",
    },
    {
      title: "Personalized Images",
      description:
        "Upload your photos to create truly personal and meaningful vision boards that reflect your unique journey",
    },
    {
      title: "Multiple Templates",
      description:
        "Choose from magazine, polaroid, scrapbook, and grid layouts designed by professional artists",
    },
    {
      title: "Instant Download",
      description:
        "Get your vision board in 4K quality, ready to print or share across all your devices",
    },
  ];

  const stats = [
    { number: "10,000+", label: "Vision Boards Created" },
    { number: "5,000+", label: "Happy Dreamers" },
    { number: "4.9/5", label: "User Rating" },
    { number: "99%", label: "Satisfaction Rate" },
  ];

  const testimonials = [
    {
      quote:
        "Dreamboard helped me visualize my 2025 goals in ways I never imagined. The AI feature is incredible!",
      author: "Sarah M.",
      role: "Entrepreneur",
    },
    {
      quote:
        "I created my vision board in under 5 minutes. It's now my phone wallpaper and daily inspiration.",
      author: "Michael R.",
      role: "Software Engineer",
    },
    {
      quote:
        "The templates are beautiful and the personalization options are endless. Highly recommend!",
      author: "Emma L.",
      role: "Life Coach",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0D0C1D] via-[#1A1A2E] to-[#0D0C1D]">
      <Navigation />

      {/* Hero Section - Lattice-inspired */}
      <section className="relative pt-32 pb-24 px-6 overflow-hidden">
        {/* Animated gradient orbs */}
        <div className="absolute top-20 right-20 w-96 h-96 bg-gradient-to-r from-[#7209B7]/20 to-[#9D4EDD]/20 rounded-full blur-3xl animate-pulse"></div>
        <div
          className="absolute bottom-20 left-20 w-96 h-96 bg-gradient-to-r from-[#C77DFF]/20 to-[#E0AAFF]/20 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "1s" }}
        ></div>

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="flex flex-col items-center text-center">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-[#7209B7]/10 to-[#9D4EDD]/10 border border-[#9D4EDD]/20 mb-8">
              <span className="text-[#E0AAFF] text-sm font-semibold">
                AI-Powered Vision Boards for 2025
              </span>
            </div>

            {/* Main Heading */}
            <h1
              className="text-6xl md:text-7xl lg:text-8xl font-bold mb-8 leading-tight max-w-5xl"
              style={{ fontFamily: "'Switzer', sans-serif", fontWeight: 700 }}
            >
              <span className="bg-gradient-to-r from-[#E0AAFF] via-[#C77DFF] to-[#9D4EDD] bg-clip-text text-transparent">
                Manifest Your Dreams
              </span>
              <br />
              <span className="text-white">With AI Vision Boards</span>
            </h1>

            <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto mb-12 leading-relaxed">
              Create stunning, personalized vision boards in minutes. Transform
              your goals into beautiful visual reminders that inspire action
              every single day.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-16">
              <Link href="/create">
                <Button
                  variant="primary"
                  size="lg"
                  className="text-lg px-12 py-6 bg-gradient-to-r from-[#7209B7] to-[#9D4EDD] hover:from-[#560BAD] hover:to-[#7209B7] text-white font-bold shadow-2xl shadow-purple-500/40 hover:shadow-purple-500/60 hover:scale-105 transition-all duration-300"
                >
                  Create Free Vision Board →
                </Button>
              </Link>
              <a href="#examples">
                <Button
                  variant="outline"
                  size="lg"
                  className="text-lg px-12 py-6 border-2 border-[#9D4EDD] text-white hover:bg-[#9D4EDD]/10 font-semibold transition-all duration-300"
                >
                  View Examples
                </Button>
              </a>
            </div>

            {/* Trust Indicators */}
            <div className="flex flex-wrap justify-center gap-8 text-sm text-gray-400">
              <span className="flex items-center gap-2">
                <svg
                  className="w-5 h-5 text-[#9D4EDD]"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
                No credit card required
              </span>
              <span className="flex items-center gap-2">
                <svg
                  className="w-5 h-5 text-[#9D4EDD]"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
                100% secure
              </span>
              <span className="flex items-center gap-2">
                <svg
                  className="w-5 h-5 text-[#9D4EDD]"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
                Free forever plan
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 px-6 bg-[#0D0C1D]/50 animate-on-scroll">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-[#E0AAFF] to-[#9D4EDD] bg-clip-text text-transparent mb-2">
                  {stat.number}
                </div>
                <div className="text-gray-400">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-24 px-6 bg-[#0D0C1D]/50 animate-on-scroll">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2
              className="text-4xl md:text-6xl font-bold mb-4"
              style={{ fontFamily: "'Switzer', sans-serif", fontWeight: 700 }}
            >
              <span className="bg-gradient-to-r from-[#E0AAFF] to-[#9D4EDD] bg-clip-text text-transparent">
                How It Works
              </span>
            </h2>
            <p className="text-xl text-gray-400">
              From idea to manifestation in minutes
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="relative group overflow-hidden rounded-3xl border border-purple-500/20 hover:border-purple-400/60 transition-all duration-300">
              <img
                src="/db1.png"
                alt="Collaborative Vision Board Creation"
                className="w-full h-auto transition-transform duration-500 group-hover:scale-105"
              />
            </div>
            <div className="space-y-6">
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-12 h-12 rounded-full bg-gradient-to-r from-[#7209B7] to-[#9D4EDD] flex items-center justify-center text-white font-bold text-xl">
                  1
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-white mb-2">
                    Share Your Vision
                  </h3>
                  <p className="text-gray-400 leading-relaxed">
                    Tell us about your goals, dreams, and aspirations for 2025.
                    Upload personal photos or let our AI create perfect images.
                  </p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-12 h-12 rounded-full bg-gradient-to-r from-[#7209B7] to-[#9D4EDD] flex items-center justify-center text-white font-bold text-xl">
                  2
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-white mb-2">
                    AI Does the Magic
                  </h3>
                  <p className="text-gray-400 leading-relaxed">
                    Our advanced AI generates stunning, personalized images and
                    arranges them in beautiful templates.
                  </p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-12 h-12 rounded-full bg-gradient-to-r from-[#7209B7] to-[#9D4EDD] flex items-center justify-center text-white font-bold text-xl">
                  3
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-white mb-2">
                    Download & Manifest
                  </h3>
                  <p className="text-gray-400 leading-relaxed">
                    Get your high-resolution vision board instantly. Print it,
                    set it as your wallpaper, or share it with friends.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Examples Gallery - Bento Grid */}
      <section id="examples" className="py-24 px-6 animate-on-scroll">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2
              className="text-4xl md:text-6xl font-bold mb-4"
              style={{ fontFamily: "'Switzer', sans-serif", fontWeight: 700 }}
            >
              <span className="bg-gradient-to-r from-[#E0AAFF] to-[#9D4EDD] bg-clip-text text-transparent">
                Beautiful Examples
              </span>
            </h2>
            <p className="text-xl text-gray-400">
              Real vision boards created by our community
            </p>
          </div>

          {/* Bento Grid Layout */}
          <div className="grid grid-cols-12 gap-4 auto-rows-[240px]">
            {/* Magazine Layout - Large */}
            <div className="col-span-12 md:col-span-5 md:row-span-2 relative group overflow-hidden rounded-3xl border border-purple-500/20 hover:border-purple-400/60 transition-all duration-300">
              <img
                src="/display4.png"
                alt="Magazine Layout Vision Board"
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#7209B7]/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-8">
                <div className="text-white">
                  <h3 className="text-2xl font-bold mb-2">Magazine Layout</h3>
                  <p className="text-purple-100">Professional & polished</p>
                </div>
              </div>
            </div>

            {/* Polaroid - Wide */}
            <div className="col-span-12 md:col-span-7 relative group overflow-hidden rounded-3xl border border-purple-500/20 hover:border-purple-400/60 transition-all duration-300">
              <img
                src="/display2.png"
                alt="Polaroid Style Vision Board"
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#9D4EDD]/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-8">
                <div className="text-white">
                  <h3 className="text-2xl font-bold mb-2">Polaroid Style</h3>
                  <p className="text-purple-100">Casual & creative</p>
                </div>
              </div>
            </div>

            {/* Scrapbook - Small */}
            <div className="col-span-6 md:col-span-3 relative group overflow-hidden rounded-3xl border border-purple-500/20 hover:border-purple-400/60 transition-all duration-300">
              <img
                src="/display3.png"
                alt="Scrapbook Vision Board"
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#C77DFF]/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-8">
                <div className="text-white">
                  <h3 className="text-xl font-bold">Scrapbook</h3>
                </div>
              </div>
            </div>

            {/* Clean Grid - Tall */}
            <div className="col-span-6 md:col-span-4 md:row-span-2 relative group overflow-hidden rounded-3xl border border-purple-500/20 hover:border-purple-400/60 transition-all duration-300">
              <img
                src="/display5.png"
                alt="Clean Grid Vision Board"
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#E0AAFF]/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-8">
                <div className="text-white">
                  <h3 className="text-2xl font-bold mb-2">Clean Grid</h3>
                  <p className="text-purple-100">Minimal & organized</p>
                </div>
              </div>
            </div>

            {/* AI Generated - Wide */}
            <div className="col-span-12 md:col-span-8 relative group overflow-hidden rounded-3xl border border-purple-500/20 hover:border-purple-400/60 transition-all duration-300">
              <img
                src="/display.png"
                alt="AI Generated Vision Board"
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#9D4EDD]/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-8">
                <div className="text-white">
                  <h3 className="text-2xl font-bold mb-2">
                    AI Generated Layout
                  </h3>
                  <p className="text-purple-100">Smart & personalized</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section - Lattice-inspired cards */}
      <section className="py-24 px-6 bg-[#0D0C1D]/50 animate-on-scroll">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2
              className="text-4xl md:text-6xl font-bold mb-4"
              style={{ fontFamily: "'Switzer', sans-serif", fontWeight: 700 }}
            >
              <span className="bg-gradient-to-r from-[#E0AAFF] to-[#9D4EDD] bg-clip-text text-transparent">
                Everything You Need
              </span>
            </h2>
            <p className="text-xl text-gray-400">
              Powerful features to bring your vision to life
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <div
                key={index}
                onMouseEnter={() => setHoveredFeature(index)}
                onMouseLeave={() => setHoveredFeature(null)}
                className={`relative p-8 rounded-2xl bg-gradient-to-br from-[#1A1A2E] to-[#16213E] border transition-all duration-300 ${
                  hoveredFeature === index
                    ? "border-purple-400/60 shadow-2xl shadow-purple-500/20 scale-105"
                    : "border-purple-500/20"
                }`}
              >
                <h3 className="text-2xl font-bold text-white mb-4">
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

      {/* Testimonials Section */}
      <section className="py-24 px-6 animate-on-scroll">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2
              className="text-4xl md:text-6xl font-bold mb-4"
              style={{ fontFamily: "'Switzer', sans-serif", fontWeight: 700 }}
            >
              <span className="bg-gradient-to-r from-[#E0AAFF] to-[#9D4EDD] bg-clip-text text-transparent">
                Loved By Dreamers
              </span>
            </h2>
            <p className="text-xl text-gray-400">
              Join thousands manifesting their 2025 goals
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div
                key={index}
                className="relative p-8 rounded-2xl bg-gradient-to-br from-[#1A1A2E] to-[#16213E] border border-purple-500/20 hover:border-purple-400/60 hover:shadow-2xl hover:shadow-purple-500/20 transition-all duration-300"
              >
                <p className="text-gray-300 text-lg mb-6 italic leading-relaxed">
                  &ldquo;{testimonial.quote}&rdquo;
                </p>
                <div>
                  <div className="text-white font-bold">
                    {testimonial.author}
                  </div>
                  <div className="text-gray-400 text-sm">
                    {testimonial.role}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section - Gradient */}
      <section className="py-24 px-6 animate-on-scroll">
        <div className="max-w-5xl mx-auto">
          <div className="relative overflow-hidden rounded-3xl">
            <div className="absolute inset-0 bg-gradient-to-br from-[#7209B7] via-[#9D4EDD] to-[#E0AAFF]"></div>
            <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10"></div>
            <div className="relative p-16 md:p-20 text-center">
              <h2
                className="text-4xl md:text-6xl font-bold text-white mb-6"
                style={{ fontFamily: "'Switzer', sans-serif", fontWeight: 700 }}
              >
                Ready to Manifest
                <br />
                Your 2025 Dreams?
              </h2>
              <p className="text-xl md:text-2xl text-white/90 mb-12 max-w-2xl mx-auto leading-relaxed">
                Join thousands creating vision boards and turning their dreams
                into reality
              </p>
              <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
                <Link href="/create">
                  <Button
                    variant="secondary"
                    size="lg"
                    className="min-w-[240px] bg-[#0D0C1D] text-white hover:bg-[#1A1A2E] shadow-2xl hover:scale-105 font-bold text-lg py-6"
                  >
                    Start Creating Free →
                  </Button>
                </Link>
                <Link href="/pricing">
                  <Button
                    variant="outline"
                    size="lg"
                    className="min-w-[240px] border-2 border-white text-white hover:bg-white/20 text-lg py-6 font-semibold"
                  >
                    View Pricing
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-16 px-6 border-t border-purple-500/10">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-12 mb-12">
            <div className="md:col-span-2">
              <h3
                className="text-2xl font-bold mb-4"
                style={{ fontFamily: "'Switzer', sans-serif", fontWeight: 700 }}
              >
                <span className="bg-gradient-to-r from-[#E0AAFF] to-[#9D4EDD] bg-clip-text text-transparent">
                  DREAMBOARD
                </span>
              </h3>
              <p className="text-gray-400 leading-relaxed mb-6 max-w-md">
                Transform your 2025 goals into stunning visual boards with AI.
                Built by dreamers, for dreamers.
              </p>
              <div className="flex gap-4">
                <a
                  href="#"
                  className="w-10 h-10 rounded-full bg-gradient-to-r from-[#7209B7] to-[#9D4EDD] flex items-center justify-center text-white hover:scale-110 transition-transform"
                >
                  <span>𝕏</span>
                </a>
                <a
                  href="#"
                  className="w-10 h-10 rounded-full bg-gradient-to-r from-[#7209B7] to-[#9D4EDD] flex items-center justify-center text-white hover:scale-110 transition-transform"
                >
                  <span>in</span>
                </a>
                <a
                  href="#"
                  className="w-10 h-10 rounded-full bg-gradient-to-r from-[#7209B7] to-[#9D4EDD] flex items-center justify-center text-white hover:scale-110 transition-transform"
                >
                  <span>ig</span>
                </a>
              </div>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Product</h4>
              <ul className="space-y-3">
                <li>
                  <Link
                    href="/create"
                    className="text-gray-400 hover:text-white transition"
                  >
                    Create Board
                  </Link>
                </li>
                <li>
                  <Link
                    href="/pricing"
                    className="text-gray-400 hover:text-white transition"
                  >
                    Pricing
                  </Link>
                </li>
                <li>
                  <Link
                    href="/about"
                    className="text-gray-400 hover:text-white transition"
                  >
                    About
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Support</h4>
              <ul className="space-y-3">
                <li>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-white transition"
                  >
                    Help Center
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-white transition"
                  >
                    Contact Us
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-white transition"
                  >
                    Privacy Policy
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="pt-8 border-t border-purple-500/10 text-center text-gray-400">
            <p>
              &copy; 2025 Dreamboard AI. All rights reserved. Manifest your
              dreams.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
