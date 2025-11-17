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

  const testimonials = [
    {
      quote: "Dreamboard's AI technology is incredible. I created a stunning vision board in less than 5 minutes that would have taken me hours to make manually.",
      author: "Christina Donnelly",
      role: "Chief People Officer, BARK",
      color: "from-pink-500/10 to-purple-500/10"
    },
    {
      quote: "The template variety and customization options are outstanding. Every vision board feels unique and personal to my goals.",
      author: "Shveta Malhan",
      role: "VP People Insights, Klick Health",
      color: "from-blue-500/10 to-cyan-500/10"
    },
    {
      quote: "As a coach, I recommend Dreamboard to all my clients. It's the perfect tool for visualization and manifestation work.",
      author: "Heather Dunn",
      role: "Chief People Officer, Brex",
      color: "from-violet-500/10 to-purple-500/10"
    },
    {
      quote: "I love how easy it is to incorporate my own photos. The AI perfectly arranges everything into a beautiful, professional layout.",
      author: "Kevin McCarthy",
      role: "CEO, UNREAL Snacks",
      color: "from-indigo-500/10 to-blue-500/10"
    }
  ];

  const logos = [
    "ANTHROPIC",
    "Robinhood",
    "loom",
    "duolingo",
    "Discord",
    "brooklinen",
    "npr",
    "gusto"
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0D0C1D] via-[#1A1A2E] to-[#0D0C1D]">
      <Navigation />

      {/* Hero Section - Improved */}
      <section className="relative pt-32 pb-32 px-6 overflow-hidden">
        {/* Animated gradient orbs */}
        <div className="absolute top-20 left-10 w-[600px] h-[600px] bg-purple-500/30 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-[500px] h-[500px] bg-pink-500/20 rounded-full blur-3xl animate-pulse"></div>

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-20">
            {/* Badge */}
            <div className="inline-block mb-8 px-4 py-2 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-full border border-purple-400/30 backdrop-blur-sm">
              <span className="text-sm font-semibold bg-gradient-to-r from-[#E0AAFF] to-[#C77DFF] bg-clip-text text-transparent">
                Powered by Advanced AI Technology
              </span>
            </div>

            {/* Main Heading */}
            <h1
              className="text-7xl md:text-8xl lg:text-[10rem] font-bold mb-10 leading-[0.9]"
              style={{ fontFamily: "'Switzer', sans-serif", fontWeight: 700 }}
            >
              <span className="bg-gradient-to-r from-[#E0AAFF] via-[#C77DFF] to-[#9D4EDD] bg-clip-text text-transparent">
                MANIFEST
              </span>
              <br />
              <span className="text-white">YOUR DREAMS</span>
              <br />
              <span className="bg-gradient-to-r from-[#9D4EDD] via-[#7209B7] to-[#560BAD] bg-clip-text text-transparent">
                IN 2025
              </span>
            </h1>

            {/* Subheading */}
            <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto mb-12 leading-relaxed">
              Transform your goals into stunning AI-powered vision boards.
              <br />
              Upload your photos, set your intentions, and watch the magic happen.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
              <Button variant="primary" size="lg" className="min-w-[220px] text-lg">
                <Link href="/create" className="flex items-center gap-2">
                  Create Free Board
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </Link>
              </Button>
              <Button variant="outline" size="lg" className="min-w-[220px] text-lg border-2">
                <Link href="/pricing">View Pricing</Link>
              </Button>
            </div>

            {/* Features List */}
            <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-gray-400">
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                No credit card required
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                Free forever plan
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                Instant results
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Vision Board Showcase Section - Updated to look like sample2 */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8">
            {/* Display 1 - Simple hover effect */}
            <div className="relative group overflow-hidden rounded-2xl bg-gradient-to-br from-[#1A1A2E] to-[#16213E] p-1">
              <div className="relative overflow-hidden rounded-xl">
                <img
                  src="/display.png"
                  alt="Vision Board Example 1"
                  className="w-full h-auto object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
            </div>

            {/* Display 2 - Simple hover effect */}
            <div className="relative group overflow-hidden rounded-2xl bg-gradient-to-br from-[#1A1A2E] to-[#16213E] p-1">
              <div className="relative overflow-hidden rounded-xl">
                <img
                  src="/display2.png"
                  alt="Vision Board Example 2"
                  className="w-full h-auto object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
            </div>

            {/* Display 3 with Dark Overlay + Quote */}
            <div className="relative group overflow-hidden rounded-2xl bg-gradient-to-br from-[#1A1A2E] to-[#16213E] p-1">
              <div className="relative overflow-hidden rounded-xl">
                <img
                  src="/display3.png"
                  alt="Vision Board Example 3"
                  className="w-full h-auto object-cover"
                />
                {/* Dark gradient overlay with testimonial */}
                <div className="absolute inset-0 bg-gradient-to-br from-[#0D0C1D]/98 via-[#1A1A2E]/95 to-[#16213E]/98 flex items-center justify-center p-8">
                  <div className="text-center max-w-sm">
                    <div className="text-5xl mb-6 opacity-20">
                      <svg className="w-12 h-12 mx-auto text-purple-400" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                      </svg>
                    </div>
                    <blockquote className="text-lg text-gray-200 mb-6 leading-relaxed" style={{ fontFamily: "'Switzer', sans-serif" }}>
                      We use Dreamboard to visualize our goals and manifest success. Creating vision boards has never been easier.
                    </blockquote>
                    <div>
                      <p className="font-bold text-white text-base tracking-wide" style={{ fontFamily: "'Switzer', sans-serif", fontWeight: 700 }}>
                        SARAH JOHNSON
                      </p>
                      <p className="text-purple-300 text-sm mt-1">CEO, Vision Consulting</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-6 bg-[#0D0C1D]/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2
              className="text-5xl md:text-6xl font-bold mb-6"
              style={{ fontFamily: "'Switzer', sans-serif", fontWeight: 700 }}
            >
              <span className="bg-gradient-to-r from-[#E0AAFF] to-[#9D4EDD] bg-clip-text text-transparent">
                POWERFUL FEATURES
              </span>
            </h2>
            <p className="text-xl text-gray-400">Everything you need to bring your dreams to life</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <Card key={index} hover>
                <div className="text-purple-400 mb-4">{feature.icon}</div>
                <h3 className="text-xl font-bold text-white mb-3">{feature.title}</h3>
                <p className="text-gray-400 leading-relaxed">{feature.description}</p>
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
              className="text-5xl md:text-6xl font-bold mb-6"
              style={{ fontFamily: "'Switzer', sans-serif", fontWeight: 700 }}
            >
              <span className="bg-gradient-to-r from-[#E0AAFF] to-[#9D4EDD] bg-clip-text text-transparent">
                HOW IT WORKS
              </span>
            </h2>
            <p className="text-xl text-gray-400">Four simple steps to your dream vision board</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, index) => (
              <div key={index} className="relative">
                <div className="text-center">
                  <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-r from-[#7209B7] to-[#9D4EDD] text-white text-2xl font-bold mb-6">
                    {step.number}
                  </div>
                  <h3 className="text-xl font-bold text-white mb-3">{step.title}</h3>
                  <p className="text-gray-400">{step.description}</p>
                </div>
                {index < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-10 left-full w-full h-0.5 bg-gradient-to-r from-purple-500/50 to-transparent"></div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Lattice-Inspired Testimonial Section */}
      <section className="py-32 px-6 bg-[#0D0C1D]/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2
              className="text-5xl md:text-6xl font-bold mb-6"
              style={{ fontFamily: "'Switzer', sans-serif", fontWeight: 700 }}
            >
              <span className="bg-gradient-to-r from-[#E0AAFF] to-[#9D4EDD] bg-clip-text text-transparent">
                Built to power your entire vision
              </span>
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="group">
                <div className={`relative overflow-hidden rounded-3xl bg-gradient-to-br ${testimonial.color} p-8 md:p-12 border border-purple-500/20 hover:border-purple-400/40 transition-all duration-300`}>
                  {/* Quote Icon */}
                  <div className="mb-6 opacity-30">
                    <svg className="w-10 h-10 text-purple-400" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                    </svg>
                  </div>

                  {/* Quote Text */}
                  <blockquote className="text-xl text-white mb-8 leading-relaxed font-medium">
                    {testimonial.quote}
                  </blockquote>

                  {/* Author */}
                  <div>
                    <p className="font-bold text-white text-lg" style={{ fontFamily: "'Switzer', sans-serif", fontWeight: 700 }}>
                      {testimonial.author}
                    </p>
                    <p className="text-gray-400 text-sm mt-1">{testimonial.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Trusted By Section - Logo Grid */}
      <section className="py-16 px-6 bg-[#0D0C1D]/30">
        <div className="max-w-7xl mx-auto">
          <p className="text-center text-gray-500 text-sm mb-8 uppercase tracking-wider">Trusted by dreamers at</p>
          <div className="flex flex-wrap items-center justify-center gap-12 opacity-50">
            {logos.map((logo, index) => (
              <div key={index} className="text-gray-400 text-xl font-semibold tracking-wide" style={{ fontFamily: "'Switzer', sans-serif", fontWeight: 600 }}>
                {logo}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Social Proof Stats */}
      <section className="py-20 px-6">
        <div className="max-w-5xl mx-auto text-center">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-12">
            <div>
              <div className="text-4xl font-bold bg-gradient-to-r from-[#E0AAFF] to-[#9D4EDD] bg-clip-text text-transparent mb-2">
                10K+
              </div>
              <div className="text-gray-400">Vision Boards Created</div>
            </div>
            <div>
              <div className="text-4xl font-bold bg-gradient-to-r from-[#E0AAFF] to-[#9D4EDD] bg-clip-text text-transparent mb-2">
                99%
              </div>
              <div className="text-gray-400">Satisfaction Rate</div>
            </div>
            <div>
              <div className="text-4xl font-bold bg-gradient-to-r from-[#E0AAFF] to-[#9D4EDD] bg-clip-text text-transparent mb-2">
                4.9
              </div>
              <div className="text-gray-400">Average Rating</div>
            </div>
            <div>
              <div className="text-4xl font-bold bg-gradient-to-r from-[#E0AAFF] to-[#9D4EDD] bg-clip-text text-transparent mb-2">
                24/7
              </div>
              <div className="text-gray-400">AI Availability</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section - Redesigned */}
      <section className="py-32 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#7209B7] via-[#9D4EDD] to-[#C77DFF] p-16 md:p-24">
            {/* Decorative elements */}
            <div className="absolute top-0 left-0 w-full h-full opacity-10">
              <div className="absolute top-10 right-10 w-32 h-32 border-2 border-white rounded-full"></div>
              <div className="absolute bottom-10 left-10 w-24 h-24 border-2 border-white rounded-full"></div>
            </div>

            <div className="relative z-10 text-center">
              <h2
                className="text-5xl md:text-7xl font-bold text-white mb-8 leading-tight"
                style={{ fontFamily: "'Switzer', sans-serif", fontWeight: 700 }}
              >
                Ready to manifest
                <br />
                your 2025 goals?
              </h2>
              <p className="text-xl md:text-2xl text-purple-100 mb-12 max-w-2xl mx-auto leading-relaxed">
                Join thousands who are turning their dreams into reality with AI-powered vision boards
              </p>
              <div className="flex flex-col sm:flex-row gap-6 justify-center">
                <Button variant="secondary" size="lg" className="bg-white text-[#7209B7] hover:bg-gray-100 shadow-2xl hover:scale-105 text-lg min-w-[220px]">
                  <Link href="/create">Start Creating Free</Link>
                </Button>
                <Button variant="outline" size="lg" className="border-2 border-white text-white hover:bg-white/20 text-lg min-w-[220px]">
                  <Link href="/about">Learn More</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer - Redesigned */}
      <footer className="bg-[#0D0C1D] border-t border-purple-500/10">
        <div className="max-w-7xl mx-auto px-6 py-16">
          {/* Top Section - Logo and Description */}
          <div className="grid md:grid-cols-5 gap-12 mb-12">
            <div className="md:col-span-2">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-[#7209B7] to-[#9D4EDD] flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-white" style={{ fontFamily: "'Switzer', sans-serif", fontWeight: 700 }}>
                  DREAMBOARD
                </h3>
              </div>
              <p className="text-gray-400 leading-relaxed max-w-sm">
                AI-powered vision boards to help you manifest your dreams and achieve your 2025 goals.
              </p>
            </div>

            {/* Product Links */}
            <div>
              <h4 className="text-sm font-bold text-white mb-4 uppercase tracking-wider">Product</h4>
              <ul className="space-y-3">
                <li><Link href="/create" className="text-gray-400 hover:text-white transition-colors">Create Board</Link></li>
                <li><Link href="/pricing" className="text-gray-400 hover:text-white transition-colors">Pricing</Link></li>
                <li><Link href="#" className="text-gray-400 hover:text-white transition-colors">Templates</Link></li>
                <li><Link href="#" className="text-gray-400 hover:text-white transition-colors">Features</Link></li>
              </ul>
            </div>

            {/* Company Links */}
            <div>
              <h4 className="text-sm font-bold text-white mb-4 uppercase tracking-wider">Company</h4>
              <ul className="space-y-3">
                <li><Link href="/about" className="text-gray-400 hover:text-white transition-colors">About</Link></li>
                <li><Link href="#" className="text-gray-400 hover:text-white transition-colors">Blog</Link></li>
                <li><Link href="#" className="text-gray-400 hover:text-white transition-colors">Careers</Link></li>
                <li><Link href="#" className="text-gray-400 hover:text-white transition-colors">Contact</Link></li>
              </ul>
            </div>

            {/* Legal Links */}
            <div>
              <h4 className="text-sm font-bold text-white mb-4 uppercase tracking-wider">Legal</h4>
              <ul className="space-y-3">
                <li><Link href="#" className="text-gray-400 hover:text-white transition-colors">Privacy Policy</Link></li>
                <li><Link href="#" className="text-gray-400 hover:text-white transition-colors">Terms of Service</Link></li>
                <li><Link href="#" className="text-gray-400 hover:text-white transition-colors">Cookie Policy</Link></li>
                <li><Link href="#" className="text-gray-400 hover:text-white transition-colors">Security</Link></li>
              </ul>
            </div>
          </div>

          {/* Bottom Section */}
          <div className="pt-8 border-t border-purple-500/10 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-500 text-sm">
              &copy; 2025 Dreamboard AI. All rights reserved.
            </p>
            <div className="flex items-center gap-6">
              <Link href="#" className="text-gray-400 hover:text-white transition-colors">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                </svg>
              </Link>
              <Link href="#" className="text-gray-400 hover:text-white transition-colors">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                </svg>
              </Link>
              <Link href="#" className="text-gray-400 hover:text-white transition-colors">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
