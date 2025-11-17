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

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-6 overflow-hidden">
        {/* Animated gradient orbs */}
        <div className="absolute top-20 left-10 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-pink-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-16">
            <div className="inline-block mb-6 px-6 py-2 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-full border border-purple-500/30">
              <span className="text-sm font-semibold bg-gradient-to-r from-[#E0AAFF] to-[#9D4EDD] bg-clip-text text-transparent">
                ✨ Powered by Advanced AI Technology
              </span>
            </div>

            <h1
              className="text-6xl md:text-8xl lg:text-9xl font-bold mb-8 leading-tight"
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

            <p className="text-xl md:text-2xl text-gray-300 max-w-4xl mx-auto mb-12 leading-relaxed">
              Transform your goals into stunning AI-powered vision boards.
              <br />
              Upload your photos, set your intentions, and watch the magic happen.
            </p>

            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
              <Button variant="primary" size="lg" className="min-w-[200px]">
                <Link href="/create" className="flex items-center gap-2">
                  Create Free Board
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </Link>
              </Button>
              <Button variant="outline" size="lg" className="min-w-[200px]">
                <Link href="/about">Learn More</Link>
              </Button>
            </div>

            <div className="mt-12 flex items-center justify-center gap-8 text-sm text-gray-400">
              <div className="flex items-center gap-2">
                <span className="text-green-400">✓</span> No credit card required
              </div>
              <div className="flex items-center gap-2">
                <span className="text-green-400">✓</span> Free forever plan
              </div>
              <div className="flex items-center gap-2">
                <span className="text-green-400">✓</span> Instant results
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* Vision Board Showcase Section - Lattice-inspired */}
      <section className="py-20 px-6 bg-[#0D0C1D]/50">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-3 gap-6">
            {/* Display 1 */}
            <div className="relative group overflow-hidden rounded-3xl">
              <img
                src="/display.png"
                alt="Vision Board Example 1"
                className="w-full h-auto object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
            </div>

            {/* Display 2 */}
            <div className="relative group overflow-hidden rounded-3xl">
              <img
                src="/display2.png"
                alt="Vision Board Example 2"
                className="w-full h-auto object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
            </div>

            {/* Display 3 with Testimonial Overlay */}
            <div className="relative group overflow-hidden rounded-3xl">
              <img
                src="/display3.png"
                alt="Vision Board Example 3"
                className="w-full h-auto object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-br from-[#0D0C1D]/95 via-[#1A1A2E]/90 to-[#16213E]/95 flex items-center justify-center p-8">
                <div className="text-center">
                  <div className="text-6xl mb-6">✨</div>
                  <blockquote className="text-lg text-gray-200 mb-6 leading-relaxed" style={{ fontFamily: "'Switzer', sans-serif" }}>
                    &quot;We use Dreamboard to visualize our goals and manifest success. Creating vision boards has never been easier.&quot;
                  </blockquote>
                  <div>
                    <p className="font-bold text-white text-lg" style={{ fontFamily: "'Switzer', sans-serif", fontWeight: 700 }}>
                      SARAH JOHNSON
                    </p>
                    <p className="text-purple-300 text-sm">CEO, Vision Consulting</p>
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

      {/* Social Proof */}
      <section className="py-20 px-6 bg-[#0D0C1D]/50">
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
                4.9★
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

      {/* CTA Section */}
      <section className="py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="relative overflow-hidden rounded-3xl">
            <div className="absolute inset-0 bg-gradient-to-r from-[#7209B7] via-[#9D4EDD] to-[#C77DFF]"></div>
            <div className="relative p-12 md:p-16 text-center">
              <h2
                className="text-4xl md:text-6xl font-bold text-white mb-6"
                style={{ fontFamily: "'Switzer', sans-serif", fontWeight: 700 }}
              >
                START MANIFESTING TODAY
              </h2>
              <p className="text-xl text-purple-100 mb-8 max-w-2xl mx-auto">
                Join thousands who are turning their dreams into reality with AI-powered vision boards
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button variant="secondary" size="lg" className="bg-white text-[#7209B7] hover:bg-gray-100">
                  <Link href="/create">Create Your First Board Free</Link>
                </Button>
                <Button variant="outline" size="lg" className="border-white text-white hover:bg-white/10">
                  <Link href="/pricing">View Pricing</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 border-t border-purple-500/10">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <h3 className="font-bold text-white mb-4">Product</h3>
              <ul className="space-y-2">
                <li><Link href="/create" className="text-gray-400 hover:text-white transition">Create Board</Link></li>
                <li><Link href="/pricing" className="text-gray-400 hover:text-white transition">Pricing</Link></li>
                <li><Link href="#" className="text-gray-400 hover:text-white transition">Templates</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold text-white mb-4">Company</h3>
              <ul className="space-y-2">
                <li><Link href="/about" className="text-gray-400 hover:text-white transition">About</Link></li>
                <li><Link href="#" className="text-gray-400 hover:text-white transition">Blog</Link></li>
                <li><Link href="#" className="text-gray-400 hover:text-white transition">Careers</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold text-white mb-4">Resources</h3>
              <ul className="space-y-2">
                <li><Link href="#" className="text-gray-400 hover:text-white transition">Help Center</Link></li>
                <li><Link href="#" className="text-gray-400 hover:text-white transition">Documentation</Link></li>
                <li><Link href="#" className="text-gray-400 hover:text-white transition">API</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold text-white mb-4">Legal</h3>
              <ul className="space-y-2">
                <li><Link href="#" className="text-gray-400 hover:text-white transition">Privacy</Link></li>
                <li><Link href="#" className="text-gray-400 hover:text-white transition">Terms</Link></li>
                <li><Link href="#" className="text-gray-400 hover:text-white transition">Security</Link></li>
              </ul>
            </div>
          </div>
          <div className="pt-8 border-t border-purple-500/10 text-center text-gray-400">
            <p>&copy; 2025 Dreamboard AI. All rights reserved. Manifest your dreams.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
