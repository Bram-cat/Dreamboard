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
    <div className="min-h-screen bg-gradient-to-b from-[#0d0c1d] via-[#161b33] to-[#0d0c1d]">
      <Navigation />

      {/* Hero Section - Modern Split Layout */}
      <section className="relative pt-32 pb-20 px-6 overflow-hidden">
        {/* Subtle Background */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-20 left-1/4 w-96 h-96 bg-[#474973]/20 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-1/4 w-96 h-96 bg-[#a69cac]/10 rounded-full blur-3xl"></div>
        </div>

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="grid lg:grid-cols-5 gap-12 items-center">
            {/* Left Content - 60% */}
            <div className="lg:col-span-3 text-center lg:text-left">
              <h1
                className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight"
                style={{ fontFamily: "'Switzer', sans-serif", fontWeight: 700 }}
              >
                <span className="text-white">Transform Your Images into</span>
                <br />
                <span className="bg-gradient-to-r from-[#a69cac] via-[#474973] to-[#161b33] bg-clip-text text-transparent">
                  AI Vision Boards
                </span>
              </h1>

              <p className="text-lg md:text-xl text-[#a69cac] max-w-2xl mx-auto lg:mx-0 mb-10 leading-relaxed">
                Upload your photos and let our AI create beautiful, inspirational vision boards tailored to your style
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start items-center">
                <Link href="/create">
                  <Button
                    variant="primary"
                    size="lg"
                    className="text-lg px-10 py-5 bg-gradient-to-r from-[#a69cac] via-[#474973] to-[#161b33] hover:from-[#161b33] hover:via-[#474973] hover:to-[#a69cac] shadow-lg shadow-[#474973]/30 hover:shadow-[#a69cac]/40 hover:scale-105 transition-all duration-300"
                  >
                    Create Your Vision Board
                  </Button>
                </Link>
                <a href="#examples" className="text-[#a69cac] hover:text-white transition-colors text-lg font-medium">
                  View Examples →
                </a>
              </div>

              {/* Trust Indicators */}
              <div className="mt-10 flex flex-wrap justify-center lg:justify-start gap-6 text-sm text-[#a69cac]">
                <span className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  No credit card required
                </span>
                <span className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  Secure processing
                </span>
                <span className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  Free to use
                </span>
              </div>
            </div>

            {/* Right Preview - 40% */}
            <div className="lg:col-span-2">
              <div className="relative">
                {/* Glow Effect */}
                <div className="absolute inset-0 bg-gradient-to-br from-[#a69cac]/20 via-[#474973]/20 to-transparent rounded-3xl blur-2xl"></div>

                {/* Preview Area */}
                <div className="relative bg-gradient-to-br from-[#161b33]/80 to-[#0d0c1d]/80 backdrop-blur-sm rounded-3xl p-4 border border-[#474973]/40 hover:border-[#a69cac]/60 transition-all duration-300 shadow-2xl shadow-[#474973]/20">
                  <div className="aspect-video bg-[#0d0c1d] rounded-2xl overflow-hidden ring-1 ring-[#a69cac]/20">
                    <img
                      src="/display.png"
                      alt="AI Vision Board Preview"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="mt-3 text-center text-xs text-[#a69cac]/80 font-medium tracking-wide">
                    ✨ AI-GENERATED VISION BOARD
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Bento Box Gallery - Examples */}
      <section id="examples" className="py-20 px-6 bg-[#0d0c1d]/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2
              className="text-3xl md:text-4xl font-bold mb-3"
              style={{ fontFamily: "'Switzer', sans-serif", fontWeight: 700 }}
            >
              <span className="bg-gradient-to-r from-[#a69cac] to-[#474973] bg-clip-text text-transparent">
                Examples
              </span>
            </h2>
            <p className="text-[#a69cac]">Vision boards created with AI</p>
          </div>

          {/* Bento Grid - Asymmetric Layout */}
          <div className="grid grid-cols-12 gap-4 auto-rows-[200px]">
            {/* Top Left - Tall */}
            <div className="col-span-12 md:col-span-4 md:row-span-2 relative group overflow-hidden rounded-2xl border border-[#474973]/30 hover:border-[#a69cac]/60 transition-all">
              <img
                src="/display.png"
                alt="Vision Board Example"
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
            </div>

            {/* Top Right - Wide */}
            <div className="col-span-12 md:col-span-8 relative group overflow-hidden rounded-2xl border border-[#474973]/30 hover:border-[#a69cac]/60 transition-all">
              <img
                src="/display2.png"
                alt="Vision Board Example"
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
            </div>

            {/* Middle Left */}
            <div className="col-span-6 md:col-span-3 relative group overflow-hidden rounded-2xl border border-[#474973]/30 hover:border-[#a69cac]/60 transition-all">
              <img
                src="/display3.png"
                alt="Vision Board Example"
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
            </div>

            {/* Middle Right - Large */}
            <div className="col-span-6 md:col-span-5 md:row-span-2 relative group overflow-hidden rounded-2xl border border-[#474973]/30 hover:border-[#a69cac]/60 transition-all">
              <img
                src="/display4.png"
                alt="Vision Board Example"
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
            </div>

            {/* Bottom Left */}
            <div className="col-span-12 md:col-span-7 relative group overflow-hidden rounded-2xl border border-[#474973]/30 hover:border-[#a69cac]/60 transition-all">
              <img
                src="/display.png"
                alt="Vision Board Example"
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2
              className="text-4xl md:text-5xl font-bold mb-4"
              style={{ fontFamily: "'Switzer', sans-serif", fontWeight: 700 }}
            >
              <span className="bg-gradient-to-r from-[#a69cac] to-[#474973] bg-clip-text text-transparent">
                Everything You Need
              </span>
            </h2>
            <p className="text-lg text-[#a69cac]">Simple, powerful tools to create your perfect vision board</p>
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
      <section className="py-20 px-6 bg-[#0d0c1d]/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2
              className="text-4xl md:text-5xl font-bold mb-4"
              style={{ fontFamily: "'Switzer', sans-serif", fontWeight: 700 }}
            >
              <span className="bg-gradient-to-r from-[#a69cac] to-[#474973] bg-clip-text text-transparent">
                How It Works
              </span>
            </h2>
            <p className="text-lg text-[#a69cac]">Four simple steps to your dream vision board</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, index) => (
              <div key={index} className="relative">
                <div className="text-center">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r from-[#474973] to-[#161b33] text-white text-xl font-bold mb-4">
                    {step.number}
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2">{step.title}</h3>
                  <p className="text-[#a69cac] text-sm">{step.description}</p>
                </div>
                {index < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-8 left-full w-full h-0.5 bg-gradient-to-r from-[#474973]/50 to-transparent"></div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section - Better Visibility */}
      <section className="py-24 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#161b33] to-[#0d0c1d] border-2 border-[#474973]/40 p-12 md:p-16">
            <div className="relative z-10 text-center">
              <h2
                className="text-4xl md:text-5xl font-bold mb-6"
                style={{ fontFamily: "'Switzer', sans-serif", fontWeight: 700 }}
              >
                <span className="bg-gradient-to-r from-[#a69cac] to-[#474973] bg-clip-text text-transparent">
                  Ready to Start?
                </span>
              </h2>
              <p className="text-lg md:text-xl text-[#a69cac] mb-10 max-w-xl mx-auto">
                Create your vision board in minutes. No credit card required.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <Link href="/create">
                  <Button variant="primary" size="lg" className="min-w-[200px] bg-gradient-to-r from-[#474973] to-[#161b33] hover:from-[#161b33] hover:to-[#474973]">
                    Create Free Board
                  </Button>
                </Link>
                <Link href="/pricing">
                  <Button variant="outline" size="lg" className="border-2 border-[#474973] text-white hover:bg-[#474973]/20 min-w-[200px]">
                    View Pricing
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer - Personal & Simple */}
      <footer className="bg-[#0d0c1d] border-t border-[#474973]/20">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div>
              <h3 className="text-lg font-bold bg-gradient-to-r from-[#a69cac] to-[#474973] bg-clip-text text-transparent" style={{ fontFamily: "'Switzer', sans-serif", fontWeight: 700 }}>
                DreamBoard
              </h3>
            </div>

            <div className="flex items-center gap-6 text-sm">
              <Link href="/create" className="text-[#a69cac] hover:text-white transition-colors">Create</Link>
              <Link href="/pricing" className="text-[#a69cac] hover:text-white transition-colors">Pricing</Link>
              <Link href="/about" className="text-[#a69cac] hover:text-white transition-colors">About</Link>
            </div>

            <p className="text-[#a69cac] text-sm">
              Built with AI • 2025
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
