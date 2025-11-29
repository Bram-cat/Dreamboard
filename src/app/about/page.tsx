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
      description: "We believe in the power of visualization to transform dreams into reality. Every feature we build serves this mission."
    },
    {
      icon: "🤖",
      title: "AI-First",
      description: "Leveraging cutting-edge AI to make vision boards accessible to everyone, regardless of design skills."
    },
    {
      icon: "💜",
      title: "User-Centric",
      description: "Your success and satisfaction are at the heart of everything we do. We listen, adapt, and improve constantly."
    },
    {
      icon: "🌟",
      title: "Innovation",
      description: "Constantly pushing boundaries to deliver the best manifestation tools. We're never satisfied with 'good enough'."
    }
  ];

  const milestones = [
    { year: "2024", event: "The Idea", description: "Two friends dreaming of making vision boarding accessible to everyone", icon: "💡" },
    { year: "2024", event: "First Prototype", description: "Built and launched our first AI-powered vision board generator", icon: "🚀" },
    { year: "2024", event: "10K Boards Created", description: "Our community created over 10,000 vision boards!", icon: "🎉" },
    { year: "2025", event: "Premium Launch", description: "Introduced premium features based on user feedback", icon: "⭐" }
  ];

  const team = [
    {
      name: "Co-Founder 1",
      role: "Co-Founder & CEO",
      bio: "Passionate about helping people achieve their goals through visualization. Combining tech expertise with a love for personal development.",
      avatar: "👨‍💼",
      social: { twitter: "#", linkedin: "#" }
    },
    {
      name: "Co-Founder 2",
      role: "Co-Founder & CTO",
      bio: "Building AI-powered tools that make a difference. Believes that everyone deserves beautiful, personalized vision boards.",
      avatar: "👨‍💻",
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
            <span className="text-2xl">✨</span>
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
            Empowering dreamers worldwide to visualize and manifest their goals
            through the magic of AI-generated vision boards.
          </p>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-20 px-6 bg-[#0D0C1D]/50">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <div className="text-6xl mb-6">📖</div>
              <h2
                className="text-4xl md:text-5xl font-bold mb-6"
                style={{ fontFamily: "'Switzer', sans-serif", fontWeight: 700 }}
              >
                <span className="bg-gradient-to-r from-[#E0AAFF] to-[#9D4EDD] bg-clip-text text-transparent">
                  THE STORY BEHIND DREAMBOARD
                </span>
              </h2>
              <div className="space-y-4 text-gray-300 leading-relaxed text-lg">
                <p>
                  Dreamboard started with a simple observation: vision boards work, but creating them
                  is time-consuming, expensive, and often intimidating for beginners.
                </p>
                <p>
                  Two friends, both passionate about personal development and technology, came together
                  with a shared vision: democratize the power of visual manifestation by combining traditional
                  vision boarding with cutting-edge AI technology.
                </p>
                <p>
                  What began as a weekend project quickly grew into a platform that makes it possible for
                  anyone to create professional, personalized vision boards in minutes—not hours.
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
                <div className="text-center space-y-8">
                  <div className="text-8xl mb-6">✨</div>
                  <div>
                    <p className="text-5xl font-bold text-white mb-2">10,000+</p>
                    <p className="text-gray-400">Vision Boards Created</p>
                  </div>
                  <div>
                    <p className="text-5xl font-bold text-white mb-2">5,000+</p>
                    <p className="text-gray-400">Happy Dreamers</p>
                  </div>
                  <div>
                    <p className="text-5xl font-bold text-white mb-2">2024</p>
                    <p className="text-gray-400">Founded with Passion</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Meet the Co-Founders */}
      <section className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <div className="text-6xl mb-6">👥</div>
            <h2
              className="text-5xl md:text-6xl font-bold mb-6"
              style={{ fontFamily: "'Switzer', sans-serif", fontWeight: 700 }}
            >
              <span className="bg-gradient-to-r from-[#E0AAFF] to-[#9D4EDD] bg-clip-text text-transparent">
                MEET THE CO-FOUNDERS
              </span>
            </h2>
            <p className="text-xl text-gray-400">The dreamers behind Dreamboard</p>
          </div>

          <div className="grid md:grid-cols-2 gap-12">
            {team.map((member, index) => (
              <div
                key={index}
                className="relative p-10 rounded-3xl bg-gradient-to-br from-[#1A1A2E] to-[#16213E] border border-purple-500/20 hover:border-purple-400/60 hover:shadow-2xl hover:shadow-purple-500/20 transition-all duration-300 group"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-violet-500/10 opacity-0 group-hover:opacity-100 transition-opacity rounded-3xl"></div>
                <div className="relative z-10">
                  <div className="text-8xl mb-6 text-center">{member.avatar}</div>
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
                <div className="text-6xl mb-4 group-hover:scale-110 transition-transform">{value.icon}</div>
                <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-[#E0AAFF] transition-colors">{value.title}</h3>
                <p className="text-gray-400 leading-relaxed">{value.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Journey Timeline */}
      <section className="py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <div className="text-6xl mb-6">🗺️</div>
            <h2
              className="text-5xl md:text-6xl font-bold mb-6"
              style={{ fontFamily: "'Switzer', sans-serif", fontWeight: 700 }}
            >
              <span className="bg-gradient-to-r from-[#E0AAFF] to-[#9D4EDD] bg-clip-text text-transparent">
                OUR JOURNEY
              </span>
            </h2>
            <p className="text-xl text-gray-400">Key milestones in our growth story</p>
          </div>

          <div className="space-y-8">
            {milestones.map((milestone, index) => (
              <div
                key={index}
                className="flex gap-6 items-start group hover:scale-[1.02] transition-transform"
              >
                <div className="flex-shrink-0 w-24 h-24 rounded-full bg-gradient-to-r from-[#7209B7] to-[#9D4EDD] flex items-center justify-center group-hover:shadow-2xl group-hover:shadow-purple-500/40 transition-shadow">
                  <div className="text-center">
                    <div className="text-3xl mb-1">{milestone.icon}</div>
                    <span className="text-sm font-bold text-white">{milestone.year}</span>
                  </div>
                </div>
                <div className="flex-1 bg-gradient-to-br from-[#1A1A2E] to-[#16213E] rounded-2xl p-6 border border-purple-500/20 group-hover:border-purple-400/60 transition-colors">
                  <h3 className="text-2xl font-bold text-white mb-2">{milestone.event}</h3>
                  <p className="text-gray-400 leading-relaxed text-lg">{milestone.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why We Built This */}
      <section className="py-20 px-6 bg-[#0D0C1D]/50">
        <div className="max-w-4xl mx-auto text-center">
          <div className="text-6xl mb-8">❤️</div>
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
              We&apos;ve both experienced the transformative power of vision boards in our own lives. They helped us
              land dream jobs, achieve fitness goals, travel the world, and build meaningful relationships.
            </p>
            <p>
              But we also remember the struggle: cutting magazines for hours, finding the perfect images,
              spending money on printing and supplies. We thought, &quot;There has to be a better way.&quot;
            </p>
            <p>
              Dreamboard is our answer. A tool that makes creating beautiful, personalized vision boards as easy
              as describing your dreams. No scissors required, no design skills needed—just pure manifestation magic.
            </p>
            <p className="text-2xl font-bold text-white">
              We built Dreamboard because we believe everyone deserves to dream big and achieve their goals. ✨
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
              <div className="text-6xl mb-6">🚀</div>
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
