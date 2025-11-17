"use client";

import Link from "next/link";
import Navigation from "@/components/Navigation";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";

export default function HomePage() {
  const features = [
    {
      icon: (
        <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      ),
      title: "AI-Powered Creation",
      description: "Advanced AI transforms your dreams into stunning visual boards in seconds"
    },
    {
      icon: (
        <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      ),
      title: "Personalized Images",
      description: "Upload your photos to create truly personal and meaningful vision boards"
    },
    {
      icon: (
        <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
        </svg>
      ),
      title: "Multiple Templates",
      description: "Choose from magazine, polaroid, scrapbook, and grid layouts"
    },
    {
      icon: (
        <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
        </svg>
      ),
      title: "Instant Download",
      description: "Get your vision board in 4K quality, ready to print or share"
    }
  ];

  const steps = [
    { number: "01", title: "Set Your Goals", description: "Tell us what you want to achieve in 2025" },
    { number: "02", title: "Upload Photos", description: "Add your selfie and dream items (optional)" },
    { number: "03", title: "Choose Template", description: "Pick your favorite layout style" },
    { number: "04", title: "Generate & Download", description: "Get your personalized vision board instantly" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0D0C1D] via-[#1A1A2E] to-[#0D0C1D]">
      <Navigation />

      {/* Hero Section - Clean & Simple */}
      <section className="relative pt-32 pb-20 px-6 overflow-hidden">
        {/* Subtle Background */}
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-20 left-1/4 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-1/4 w-64 h-64 bg-pink-500/10 rounded-full blur-3xl"></div>
        </div>

        <div className="max-w-4xl mx-auto relative z-10 text-center">
          <h1
            className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight"
            style={{ fontFamily: "'Switzer', sans-serif", fontWeight: 700 }}
          >
            <span className="text-white">Create Your</span>
            <br />
            <span className="bg-gradient-to-r from-[#E0AAFF] via-[#C77DFF] to-[#9D4EDD] bg-clip-text text-transparent">
              2025 Vision Board
            </span>
          </h1>

          <p className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto mb-10">
            AI-powered vision boards in minutes. Set your goals, upload photos, download your board.
          </p>

          <Link href="/create">
            <Button variant="primary" size="lg" className="text-lg px-10 py-5">
              Create Free Board
            </Button>
          </Link>
        </div>
      </section>

      {/* Bento Box Gallery - Examples */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2
              className="text-3xl md:text-4xl font-bold mb-3"
              style={{ fontFamily: "'Switzer', sans-serif", fontWeight: 700 }}
            >
              <span className="bg-gradient-to-r from-[#E0AAFF] to-[#9D4EDD] bg-clip-text text-transparent">
                Examples
              </span>
            </h2>
            <p className="text-gray-400">Vision boards created with AI</p>
          </div>

          {/* Bento Grid */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Large - Spans 2 columns and 2 rows */}
            <div className="md:col-span-2 md:row-span-2 relative group overflow-hidden rounded-2xl border border-purple-500/20 hover:border-purple-400/40 transition-all">
              <img
                src="/display.png"
                alt="Vision Board Example"
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
            </div>

            {/* Top Right */}
            <div className="md:col-span-2 relative group overflow-hidden rounded-2xl border border-purple-500/20 hover:border-purple-400/40 transition-all">
              <img
                src="/display2.png"
                alt="Vision Board Example"
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
            </div>

            {/* Middle Right */}
            <div className="relative group overflow-hidden rounded-2xl border border-purple-500/20 hover:border-purple-400/40 transition-all">
              <img
                src="/display3.png"
                alt="Vision Board Example"
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
            </div>

            {/* Bottom Right */}
            <div className="relative group overflow-hidden rounded-2xl border border-purple-500/20 hover:border-purple-400/40 transition-all">
              <img
                src="/display4.png"
                alt="Vision Board Example"
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-6 bg-[#0D0C1D]/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2
              className="text-4xl md:text-5xl font-bold mb-4"
              style={{ fontFamily: "'Switzer', sans-serif", fontWeight: 700 }}
            >
              <span className="bg-gradient-to-r from-[#E0AAFF] to-[#9D4EDD] bg-clip-text text-transparent">
                Everything You Need
              </span>
            </h2>
            <p className="text-lg text-gray-400">Simple, powerful tools to create your perfect vision board</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <Card key={index} hover>
                <div className="text-purple-400 mb-4">{feature.icon}</div>
                <h3 className="text-lg font-bold text-white mb-2">{feature.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{feature.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2
              className="text-4xl md:text-5xl font-bold mb-4"
              style={{ fontFamily: "'Switzer', sans-serif", fontWeight: 700 }}
            >
              <span className="bg-gradient-to-r from-[#E0AAFF] to-[#9D4EDD] bg-clip-text text-transparent">
                How It Works
              </span>
            </h2>
            <p className="text-lg text-gray-400">Four simple steps to your dream vision board</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, index) => (
              <div key={index} className="relative">
                <div className="text-center">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r from-[#7209B7] to-[#9D4EDD] text-white text-xl font-bold mb-4">
                    {step.number}
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2">{step.title}</h3>
                  <p className="text-gray-400 text-sm">{step.description}</p>
                </div>
                {index < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-8 left-full w-full h-0.5 bg-gradient-to-r from-purple-500/50 to-transparent"></div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section - Better Visibility */}
      <section className="py-24 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#1A1A2E] to-[#16213E] border-2 border-purple-500/30 p-12 md:p-16">
            <div className="relative z-10 text-center">
              <h2
                className="text-4xl md:text-5xl font-bold mb-6"
                style={{ fontFamily: "'Switzer', sans-serif", fontWeight: 700 }}
              >
                <span className="bg-gradient-to-r from-[#E0AAFF] to-[#9D4EDD] bg-clip-text text-transparent">
                  Ready to Start?
                </span>
              </h2>
              <p className="text-lg md:text-xl text-gray-400 mb-10 max-w-xl mx-auto">
                Create your vision board in minutes. No credit card required.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <Link href="/create">
                  <Button variant="primary" size="lg" className="min-w-[200px]">
                    Create Free Board
                  </Button>
                </Link>
                <Link href="/pricing">
                  <Button variant="outline" size="lg" className="border-2 border-purple-400/60 text-white hover:bg-purple-500/10 min-w-[200px]">
                    View Pricing
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer - Personal & Simple */}
      <footer className="bg-[#0D0C1D] border-t border-purple-500/10">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-[#7209B7] to-[#9D4EDD] flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-white" style={{ fontFamily: "'Switzer', sans-serif", fontWeight: 700 }}>
                Dreamboard
              </h3>
            </div>

            <div className="flex items-center gap-6 text-sm">
              <Link href="/create" className="text-gray-400 hover:text-white transition-colors">Create</Link>
              <Link href="/pricing" className="text-gray-400 hover:text-white transition-colors">Pricing</Link>
              <Link href="/about" className="text-gray-400 hover:text-white transition-colors">About</Link>
            </div>

            <p className="text-gray-500 text-sm">
              Built with AI • 2025
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
