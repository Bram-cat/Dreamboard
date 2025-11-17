"use client";

import Link from "next/link";
import Navigation from "@/components/Navigation";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";

export default function AboutPage() {
  const values = [
    {
      icon: "🎯",
      title: "Purpose-Driven",
      description: "We believe in the power of visualization to transform dreams into reality"
    },
    {
      icon: "🤖",
      title: "AI-First",
      description: "Leveraging cutting-edge AI to make vision boards accessible to everyone"
    },
    {
      icon: "💜",
      title: "User-Centric",
      description: "Your success and satisfaction are at the heart of everything we do"
    },
    {
      icon: "🌟",
      title: "Innovation",
      description: "Constantly pushing boundaries to deliver the best manifestation tools"
    }
  ];

  const milestones = [
    { year: "2024", event: "Company Founded", description: "Started with a vision to democratize vision boarding" },
    { year: "2024", event: "AI Integration", description: "Launched advanced AI-powered image generation" },
    { year: "2024", event: "10K Users", description: "Reached 10,000 vision boards created milestone" },
    { year: "2025", event: "Premium Launch", description: "Introduced premium features for power users" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0D0C1D] via-[#1A1A2E] to-[#0D0C1D]">
      <Navigation />

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6">
        <div className="max-w-5xl mx-auto text-center">
          <h1
            className="text-6xl md:text-8xl font-bold mb-8"
            style={{ fontFamily: "'Bespoke Stencil', sans-serif" }}
          >
            <span className="bg-gradient-to-r from-[#E0AAFF] via-[#C77DFF] to-[#9D4EDD] bg-clip-text text-transparent">
              OUR MISSION
            </span>
          </h1>
          <p className="text-2xl text-gray-300 max-w-3xl mx-auto mb-12 leading-relaxed">
            Empowering dreamers worldwide to visualize and manifest their goals
            through the power of AI-generated vision boards.
          </p>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-20 px-6 bg-[#0D0C1D]/50">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2
                className="text-4xl md:text-5xl font-bold mb-6"
                style={{ fontFamily: "'Bespoke Stencil', sans-serif" }}
              >
                <span className="bg-gradient-to-r from-[#E0AAFF] to-[#9D4EDD] bg-clip-text text-transparent">
                  THE STORY BEHIND DREAMBOARD
                </span>
              </h2>
              <div className="space-y-4 text-gray-300 leading-relaxed">
                <p>
                  Dreamboard was born from a simple observation: vision boards work, but creating them
                  is time-consuming, expensive, and often intimidating for beginners.
                </p>
                <p>
                  We set out to democratize the power of visual manifestation by combining traditional
                  vision boarding with cutting-edge AI technology. Our platform makes it possible for
                  anyone to create professional, personalized vision boards in minutes.
                </p>
                <p>
                  Today, we&apos;re proud to serve thousands of dreamers worldwide, helping them visualize
                  and achieve their goals for 2025 and beyond.
                </p>
              </div>
            </div>
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-[#7209B7] to-[#9D4EDD] rounded-3xl blur-2xl opacity-20"></div>
              <div className="relative bg-gradient-to-br from-[#1A1A2E] to-[#16213E] rounded-3xl p-12 border-2 border-purple-500/30">
                <div className="text-center">
                  <div className="text-8xl mb-6">✨</div>
                  <p className="text-xl text-gray-300">Making dreams visual since 2024</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2
              className="text-5xl md:text-6xl font-bold mb-6"
              style={{ fontFamily: "'Bespoke Stencil', sans-serif" }}
            >
              <span className="bg-gradient-to-r from-[#E0AAFF] to-[#9D4EDD] bg-clip-text text-transparent">
                OUR VALUES
              </span>
            </h2>
            <p className="text-xl text-gray-400">The principles that guide everything we do</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <Card key={index} hover>
                <div className="text-6xl mb-4">{value.icon}</div>
                <h3 className="text-2xl font-bold text-white mb-3">{value.title}</h3>
                <p className="text-gray-400 leading-relaxed">{value.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Milestones Section */}
      <section className="py-20 px-6 bg-[#0D0C1D]/50">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2
              className="text-5xl md:text-6xl font-bold mb-6"
              style={{ fontFamily: "'Bespoke Stencil', sans-serif" }}
            >
              <span className="bg-gradient-to-r from-[#E0AAFF] to-[#9D4EDD] bg-clip-text text-transparent">
                OUR JOURNEY
              </span>
            </h2>
            <p className="text-xl text-gray-400">Key milestones in our growth</p>
          </div>

          <div className="space-y-8">
            {milestones.map((milestone, index) => (
              <div
                key={index}
                className="flex gap-6 items-start"
              >
                <div className="flex-shrink-0 w-24 h-24 rounded-full bg-gradient-to-r from-[#7209B7] to-[#9D4EDD] flex items-center justify-center">
                  <span className="text-2xl font-bold text-white">{milestone.year}</span>
                </div>
                <div className="flex-1 bg-gradient-to-br from-[#1A1A2E] to-[#16213E] rounded-2xl p-6 border border-purple-500/20">
                  <h3 className="text-2xl font-bold text-white mb-2">{milestone.event}</h3>
                  <p className="text-gray-400">{milestone.description}</p>
                </div>
              </div>
            ))}
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
                style={{ fontFamily: "'Bespoke Stencil', sans-serif" }}
              >
                JOIN OUR COMMUNITY
              </h2>
              <p className="text-xl text-purple-100 mb-8 max-w-2xl mx-auto">
                Be part of a growing community of dreamers manifesting their goals
              </p>
              <Button variant="secondary" size="lg" className="bg-white text-[#7209B7] hover:bg-gray-100">
                <Link href="/create">Start Creating Today</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 border-t border-purple-500/10">
        <div className="max-w-7xl mx-auto text-center text-gray-400">
          <p>&copy; 2025 Dreamboard AI. All rights reserved. Manifest your dreams.</p>
        </div>
      </footer>
    </div>
  );
}
