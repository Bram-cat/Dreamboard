"use client";

import Link from "next/link";
import Navigation from "@/components/Navigation";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";

export default function AboutPage() {
  const values = [
    {
      title: "Purpose-Driven",
      description: "We believe in the power of visualization to transform dreams into reality. Every feature we build serves this mission."
    },
    {
      title: "AI-First",
      description: "Leveraging cutting-edge AI to make vision boards accessible to everyone, regardless of design skills."
    },
    {
      title: "User-Centric",
      description: "Your success and satisfaction are at the heart of everything we do. We listen, adapt, and improve constantly."
    },
    {
      title: "Innovation",
      description: "Constantly pushing boundaries to deliver the best manifestation tools. We're never satisfied with 'good enough'."
    }
  ];

  const stats = [
    { number: "10,000+", label: "Vision Boards Created", subtext: "That's a lot of dreams" },
    { number: "5,000+", label: "Happy Users", subtext: "And counting" },
    { number: "0", label: "Scissors Needed", subtext: "We're scissor-free" },
    { number: "100%", label: "AI-Powered", subtext: "The future is now" }
  ];

  const team = [
    {
      name: "Co-Founder 1",
      role: "Co-Founder & CEO",
      bio: "Vision board enthusiast turned entrepreneur. Still has magazines from 2015. Refuses to throw them away 'just in case.'",
      social: { twitter: "#", linkedin: "#" }
    },
    {
      name: "Co-Founder 2",
      role: "Co-Founder & CTO",
      bio: "Coded this entire platform fueled by coffee and the belief that cutting magazines is a cruel punishment.",
      social: { twitter: "#", linkedin: "#" }
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0D0C1D] via-[#1A1A2E] to-[#0D0C1D]">
      <Navigation />

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6 relative overflow-hidden">
        {/* Animated gradient orbs */}
        <div className="absolute top-20 right-20 w-96 h-96 bg-gradient-to-r from-[#7209B7]/20 to-[#9D4EDD]/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 left-20 w-96 h-96 bg-gradient-to-r from-[#C77DFF]/20 to-[#E0AAFF]/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>

        <div className="max-w-5xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-[#7209B7]/10 to-[#9D4EDD]/10 border border-[#9D4EDD]/20 mb-8">
            <span className="text-[#E0AAFF] text-sm font-semibold">Built by Dreamers, for Dreamers</span>
          </div>

          <h1
            className="text-6xl md:text-8xl font-bold mb-8"
            style={{ fontFamily: "'Switzer', sans-serif", fontWeight: 700 }}
          >
            <span className="bg-gradient-to-r from-[#E0AAFF] via-[#C77DFF] to-[#9D4EDD] bg-clip-text text-transparent">
              OUR MISSION
            </span>
          </h1>
          <p className="text-2xl text-gray-300 max-w-3xl mx-auto mb-12 leading-relaxed">
            Helping dreamers worldwide turn their goals into reality with AI-powered vision boards.
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
                style={{ fontFamily: "'Switzer', sans-serif", fontWeight: 700 }}
              >
                <span className="bg-gradient-to-r from-[#E0AAFF] to-[#9D4EDD] bg-clip-text text-transparent">
                  THE STORY
                </span>
              </h2>
              <div className="space-y-4 text-gray-300 leading-relaxed text-lg">
                <p>
                  Picture this: two friends spending hours cutting up magazines, desperately searching for the perfect images for their vision boards. There had to be a better way.
                </p>
                <p>
                  Fast forward through countless late nights, way too much coffee, and a shared obsession with AI—Dreamboard was born. We built the tool we wished existed: vision boards that don't require scissors, glue sticks, or a design degree.
                </p>
                <p>
                  Today, thousands of people use Dreamboard to create beautiful vision boards in minutes. No mess, no stress, just manifestation.
                </p>
              </div>
            </div>
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-[#7209B7] to-[#9D4EDD] rounded-3xl blur-2xl opacity-20"></div>
              <img
                src="/about.png"
                alt="Dreamboard Vision Boards"
                className="relative rounded-3xl border-2 border-purple-500/30 w-full h-auto shadow-2xl shadow-purple-500/20"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Meet the Co-Founders */}
      <section className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2
              className="text-5xl md:text-6xl font-bold mb-6"
              style={{ fontFamily: "'Switzer', sans-serif", fontWeight: 700 }}
            >
              <span className="bg-gradient-to-r from-[#E0AAFF] to-[#9D4EDD] bg-clip-text text-transparent">
                THE HUMANS BEHIND THE AI
              </span>
            </h2>
            <p className="text-xl text-gray-400">Two friends who really hate cutting magazines</p>
          </div>

          <div className="grid md:grid-cols-2 gap-12">
            {team.map((member, index) => (
              <div
                key={index}
                className="relative p-10 rounded-3xl bg-gradient-to-br from-[#1A1A2E] to-[#16213E] border border-purple-500/20 hover:border-purple-400/60 hover:shadow-2xl hover:shadow-purple-500/20 transition-all duration-300 group"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-violet-500/10 opacity-0 group-hover:opacity-100 transition-opacity rounded-3xl"></div>
                <div className="relative z-10">
                  <div className="text-center mb-6">
                    <h3 className="text-3xl font-bold text-white mb-2">{member.name}</h3>
                    <p className="text-lg text-[#E0AAFF] font-semibold">{member.role}</p>
                  </div>
                  <p className="text-gray-300 leading-relaxed text-lg mb-6 text-center">
                    {member.bio}
                  </p>
                  <div className="flex justify-center gap-4">
                    <a
                      href={member.social.twitter}
                      className="w-12 h-12 rounded-full bg-gradient-to-r from-[#7209B7] to-[#9D4EDD] flex items-center justify-center text-white hover:scale-110 transition-transform"
                    >
                      𝕏
                    </a>
                    <a
                      href={member.social.linkedin}
                      className="w-12 h-12 rounded-full bg-gradient-to-r from-[#7209B7] to-[#9D4EDD] flex items-center justify-center text-white hover:scale-110 transition-transform"
                    >
                      in
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 px-6 bg-[#0D0C1D]/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2
              className="text-5xl md:text-6xl font-bold mb-6"
              style={{ fontFamily: "'Switzer', sans-serif", fontWeight: 700 }}
            >
              <span className="bg-gradient-to-r from-[#E0AAFF] to-[#9D4EDD] bg-clip-text text-transparent">
                OUR VALUES
              </span>
            </h2>
            <p className="text-xl text-gray-400">The principles that guide everything we do</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <Card key={index} hover className="group">
                <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-[#E0AAFF] transition-colors">{value.title}</h3>
                <p className="text-gray-400 leading-relaxed">{value.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2
              className="text-5xl md:text-6xl font-bold mb-6"
              style={{ fontFamily: "'Switzer', sans-serif", fontWeight: 700 }}
            >
              <span className="bg-gradient-to-r from-[#E0AAFF] to-[#9D4EDD] bg-clip-text text-transparent">
                BY THE NUMBERS
              </span>
            </h2>
            <p className="text-xl text-gray-400">Stats we're actually proud of</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div
                key={index}
                className="bg-gradient-to-br from-[#1A1A2E] to-[#16213E] rounded-3xl p-8 border border-purple-500/20 hover:border-purple-400/60 hover:shadow-2xl hover:shadow-purple-500/20 transition-all duration-300 text-center"
              >
                <div className="text-6xl font-bold bg-gradient-to-r from-[#E0AAFF] to-[#9D4EDD] bg-clip-text text-transparent mb-3">
                  {stat.number}
                </div>
                <div className="text-white font-semibold text-lg mb-2">{stat.label}</div>
                <div className="text-gray-400 text-sm">{stat.subtext}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why We Built This */}
      <section className="py-20 px-6 bg-[#0D0C1D]/50">
        <div className="max-w-4xl mx-auto text-center">
          <h2
            className="text-4xl md:text-5xl font-bold mb-8"
            style={{ fontFamily: "'Switzer', sans-serif", fontWeight: 700 }}
          >
            <span className="bg-gradient-to-r from-[#E0AAFF] to-[#9D4EDD] bg-clip-text text-transparent">
              WHY WE BUILT THIS
            </span>
          </h2>
          <div className="space-y-6 text-gray-300 text-lg leading-relaxed">
            <p>
              Vision boards work. They helped us land dream jobs, hit fitness goals, and actually stick to our resolutions (most of them, anyway).
            </p>
            <p>
              But the traditional process? Exhausting. Cutting magazines for hours, hunting for the perfect images, dropping cash on supplies—only to end up with something that looked like a middle school art project.
            </p>
            <p>
              Dreamboard is our solution. Beautiful vision boards in minutes, not hours. No scissors, no glue sticks, no artistic talent required. Just your dreams and some AI magic.
            </p>
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
                JOIN OUR COMMUNITY
              </h2>
              <p className="text-xl text-purple-100 mb-8 max-w-2xl mx-auto leading-relaxed">
                Be part of a growing community of dreamers manifesting their goals and supporting each other&apos;s journey
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/create">
                  <Button variant="secondary" size="lg" className="min-w-[200px] bg-white text-[#7209B7] hover:bg-gray-100 shadow-2xl hover:scale-105">
                    Start Creating Today →
                  </Button>
                </Link>
                <Link href="/pricing">
                  <Button variant="outline" size="lg" className="min-w-[200px] border-2 border-white text-white hover:bg-white/10">
                    View Pricing
                  </Button>
                </Link>
              </div>
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
