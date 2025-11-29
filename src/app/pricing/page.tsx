"use client";

import Link from "next/link";
import { useState } from "react";
import Navigation from "@/components/Navigation";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";

export default function PricingPage() {
  const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">(
    "monthly"
  );

  const plans = [
    {
      name: "Free",
      price: 0,
      description: "Perfect for trying out Dreamboard",
      features: [
        "1 vision board per account",
        "All 4 template styles (Magazine, Polaroid, Scrapbook, Grid)",
        "AI-powered image generation",
        "HD quality downloads (1200x800px)",
        "Personal use only",
        "Community support",
      ],
      limitations: ["Limited to 1 board total", "Standard processing speed"],
      cta: "Start Free",
      popular: false,
      gradient: "from-gray-600 to-gray-700",
    },
    {
      name: "Premium",
      price: 10,
      yearlyPrice: 96,
      description: "Unlimited manifestation power",
      features: [
        "20 vision boards per month",
        "All premium templates with exclusive designs",
        "Advanced AI generation with priority processing",
        "4K Ultra HD downloads (2800x2000px)",
        "Lightning-fast processing (3x faster)",
        "Commercial use license",
        "Remove watermarks",
        "Early access to new features",
        "Priority email support",
        "Custom template requests",
      ],
      limitations: [],
      cta: "Go Premium",
      popular: true,
      gradient: "from-[#7209B7] to-[#9D4EDD]",
    },
  ];

  const comparisonFeatures = [
    {
      feature: "Vision Boards per Month",
      free: "1 total",
      premium: "20/month",
    },
    {
      feature: "Template Styles",
      free: "All 4 templates",
      premium: "All + Exclusive",
    },
    { feature: "AI Image Quality", free: "Standard", premium: "Advanced" },
    {
      feature: "Download Quality",
      free: "HD (1200x800)",
      premium: "4K (2800x2000)",
    },
    { feature: "Processing Speed", free: "Standard", premium: "3x Faster" },
    { feature: "Commercial Use", free: "✗", premium: "✓" },
    { feature: "Watermark", free: "Yes", premium: "Removed" },
    { feature: "Support", free: "Community", premium: "Priority Email" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0D0C1D] via-[#1A1A2E] to-[#0D0C1D]">
      <Navigation />

      {/* Hero Section */}
      <section className="relative pt-32 pb-12 px-6 overflow-hidden">
        {/* Animated gradient orbs */}
        <div className="absolute top-20 right-10 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div
          className="absolute bottom-20 left-10 w-72 h-72 bg-violet-500/20 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "1s" }}
        ></div>

        <div className="max-w-4xl mx-auto text-center relative z-10">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-[#7209B7]/10 to-[#9D4EDD]/10 border border-[#9D4EDD]/20 mb-8">
            <span className="text-[#E0AAFF] text-sm font-semibold">
              Affordable Plans for Every Dreamer
            </span>
          </div>

          <h1
            className="text-6xl md:text-8xl font-bold mb-6 leading-tight"
            style={{ fontFamily: "'Switzer', sans-serif", fontWeight: 700 }}
          >
            <span className="bg-gradient-to-r from-[#E0AAFF] via-[#C77DFF] to-[#9D4EDD] bg-clip-text text-transparent">
              PRICING THAT
            </span>
            <br />
            <span className="text-white">MAKES SENSE</span>
          </h1>

          <p className="text-2xl text-gray-300 mb-12 leading-relaxed">
            Start free, upgrade when you&apos;re ready. No hidden fees, no
            surprises.
          </p>

          {/* Billing Toggle */}
          <div className="inline-flex items-center gap-4 p-2 bg-gradient-to-br from-[#1A1A2E] to-[#16213E] rounded-xl border border-purple-500/20">
            <button
              onClick={() => setBillingCycle("monthly")}
              className={`px-8 py-3 rounded-lg transition-all duration-300 ${
                billingCycle === "monthly"
                  ? "bg-gradient-to-r from-[#7209B7] to-[#9D4EDD] text-white font-semibold shadow-lg shadow-purple-500/30"
                  : "text-gray-400 hover:text-white hover:bg-white/5"
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setBillingCycle("yearly")}
              className={`px-8 py-3 rounded-lg transition-all duration-300 relative ${
                billingCycle === "yearly"
                  ? "bg-gradient-to-r from-[#7209B7] to-[#9D4EDD] text-white font-semibold shadow-lg shadow-purple-500/30"
                  : "text-gray-400 hover:text-white hover:bg-white/5"
              }`}
            >
              Yearly
              <span className="absolute -top-3 -right-3 px-3 py-1 bg-gradient-to-r from-green-500 to-emerald-500 text-white text-xs font-bold rounded-full shadow-lg">
                Save 20%
              </span>
            </button>
          </div>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12">
          {plans.map((plan, index) => (
            <div
              key={index}
              className={`relative group ${plan.popular ? "md:scale-105" : ""}`}
            >
              {plan.popular && (
                <div className="absolute -top-5 left-1/2 -translate-x-1/2 px-8 py-2 bg-gradient-to-r from-[#7209B7] to-[#9D4EDD] rounded-full text-sm font-bold text-white shadow-lg shadow-purple-500/50 z-10 animate-pulse">
                  MOST POPULAR
                </div>
              )}

              <div
                className={`relative overflow-hidden rounded-3xl p-10 ${
                  plan.popular
                    ? "bg-gradient-to-br from-[#1A1A2E] via-[#16213E] to-[#1A1A2E] border-2 border-purple-400/60"
                    : "bg-gradient-to-br from-[#1A1A2E] to-[#16213E] border border-purple-500/20"
                } hover:border-purple-400/80 transition-all duration-300 ${
                  plan.popular ? "shadow-2xl shadow-purple-500/20" : ""
                }`}
              >
                {/* Glow effect for popular plan */}
                {plan.popular && (
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-violet-500/10 opacity-50"></div>
                )}

                <div className="relative z-10">
                  <div className="text-center mb-10">
                    <h3
                      className="text-4xl font-bold text-white mb-3"
                      style={{
                        fontFamily: "'Switzer', sans-serif",
                        fontWeight: 700,
                      }}
                    >
                      {plan.name}
                    </h3>
                    <p className="text-gray-400 text-lg">{plan.description}</p>
                  </div>

                  <div className="text-center mb-10 py-6 border-y border-purple-500/20">
                    <div className="flex items-baseline justify-center gap-2">
                      <span className="text-7xl font-bold bg-gradient-to-r from-[#E0AAFF] to-[#9D4EDD] bg-clip-text text-transparent">
                        $
                        {billingCycle === "yearly" && plan.yearlyPrice
                          ? plan.yearlyPrice
                          : plan.price}
                      </span>
                      {plan.price > 0 && (
                        <span className="text-gray-400 text-xl">
                          /{billingCycle === "yearly" ? "year" : "month"}
                        </span>
                      )}
                    </div>
                    {billingCycle === "yearly" && plan.price > 0 && (
                      <p className="text-sm text-green-400 mt-3 font-semibold">
                        Save ${plan.price * 12 - (plan.yearlyPrice || 0)}/year
                      </p>
                    )}
                  </div>

                  <ul className="space-y-4 mb-10">
                    {plan.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start gap-3">
                        <span className="text-green-400 text-xl mt-0.5 flex-shrink-0">
                          ✓
                        </span>
                        <span className="text-gray-300 text-lg">{feature}</span>
                      </li>
                    ))}
                    {plan.limitations.map((limitation, idx) => (
                      <li
                        key={idx}
                        className="flex items-start gap-3 opacity-40"
                      >
                        <span className="text-gray-500 text-xl mt-0.5 flex-shrink-0">
                          ○
                        </span>
                        <span className="text-gray-500 text-lg">
                          {limitation}
                        </span>
                      </li>
                    ))}
                  </ul>

                  <Link
                    href="/create"
                    className={`block w-full text-center px-8 py-5 rounded-xl font-bold text-lg transition-all duration-300 ${
                      plan.popular
                        ? "bg-gradient-to-r from-[#7209B7] to-[#9D4EDD] text-white hover:from-[#560BAD] hover:to-[#7209B7] shadow-xl shadow-purple-500/40 hover:shadow-purple-500/60 hover:scale-[1.02]"
                        : "bg-gradient-to-r from-[#16213E] to-[#1A1A2E] text-white border border-purple-500/30 hover:border-purple-400 hover:bg-[#1A1A2E]"
                    }`}
                  >
                    {plan.cta} →
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Detailed Comparison Table */}
      <section className="py-20 px-6 bg-[#0D0C1D]/50">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2
              className="text-5xl md:text-6xl font-bold mb-6"
              style={{ fontFamily: "'Switzer', sans-serif", fontWeight: 700 }}
            >
              <span className="bg-gradient-to-r from-[#E0AAFF] to-[#9D4EDD] bg-clip-text text-transparent">
                FEATURE COMPARISON
              </span>
            </h2>
            <p className="text-xl text-gray-400">
              See exactly what you get with each plan
            </p>
          </div>

          <div className="bg-gradient-to-br from-[#1A1A2E] to-[#16213E] rounded-3xl border border-purple-500/20 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-purple-500/20">
                    <th className="text-left p-6 text-gray-400 font-semibold">
                      Feature
                    </th>
                    <th className="text-center p-6 text-white font-bold">
                      Free
                    </th>
                    <th className="text-center p-6 text-white font-bold">
                      Premium
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {comparisonFeatures.map((item, index) => (
                    <tr
                      key={index}
                      className="border-b border-purple-500/10 hover:bg-purple-500/5 transition-colors"
                    >
                      <td className="p-6 text-gray-300 font-medium">
                        {item.feature}
                      </td>
                      <td className="p-6 text-center text-gray-400">
                        {item.free}
                      </td>
                      <td className="p-6 text-center text-white font-semibold">
                        {item.premium}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section - More Fun */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2
              className="text-5xl md:text-6xl font-bold mb-6"
              style={{ fontFamily: "'Switzer', sans-serif", fontWeight: 700 }}
            >
              <span className="bg-gradient-to-r from-[#E0AAFF] to-[#9D4EDD] bg-clip-text text-transparent">
                GOT QUESTIONS?
              </span>
            </h2>
            <p className="text-xl text-gray-400">We&apos;ve got answers!</p>
          </div>

          <div className="space-y-6">
            {[
              {
                q: "Can I try before I buy?",
                a: "Absolutely! Our free plan gives you 1 full vision board to try all features and templates. No credit card required, no strings attached. Create your board and see the magic happen!",
              },
              {
                q: "What if I want to create more than 20 boards?",
                a: "Premium allows 20 boards per month, which resets on your billing date. Need more? Contact us for custom enterprise pricing. We're here to support your manifestation journey!",
              },
              {
                q: "Can I cancel anytime?",
                a: "Yes! Cancel your subscription anytime with just one click. You'll keep access to premium features until the end of your billing period. No hassle, no hard feelings!",
              },
              {
                q: "Do you offer refunds?",
                a: "We offer a 30-day money-back guarantee if you're not satisfied with premium features. Just email us and we'll process your refund within 48 hours. Your satisfaction is our priority!",
              },
              {
                q: "What's included in commercial use?",
                a: "Premium users can use generated boards for business presentations, social media posts, marketing materials, client projects, coaching programs, and more. Unlimited commercial rights!",
              },
              {
                q: "How does the AI generation work?",
                a: "We use advanced AI models (Gemini & DALL-E) to generate personalized images based on your uploaded photos and keywords. It's like having a professional designer and photographer in your pocket!",
              },
            ].map((faq, index) => (
              <Card key={index} hover className="group">
                <div>
                  <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-[#E0AAFF] transition-colors">
                    {faq.q}
                  </h3>
                  <p className="text-gray-400 leading-relaxed text-lg">
                    {faq.a}
                  </p>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Money-Back Guarantee Badge */}
      <section className="py-16 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="bg-gradient-to-r from-green-500/10 to-emerald-500/10 border-2 border-green-500/30 rounded-3xl p-12 text-center">
            <h3 className="text-3xl font-bold text-white mb-4">
              30-Day Money-Back Guarantee
            </h3>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Try Premium risk-free. If you&apos;re not 100% satisfied within 30
              days, we&apos;ll refund every penny. No questions asked.
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="relative overflow-hidden rounded-3xl">
            <div className="absolute inset-0 bg-gradient-to-br from-[#7209B7] via-[#9D4EDD] to-[#E0AAFF]"></div>
            <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10"></div>
            <div className="relative p-16 text-center">
              <h2
                className="text-5xl md:text-7xl font-bold text-white mb-6"
                style={{ fontFamily: "'Switzer', sans-serif", fontWeight: 700 }}
              >
                START MANIFESTING
                <br />
                YOUR DREAMS TODAY
              </h2>
              <p className="text-2xl text-white/90 mb-10 max-w-2xl mx-auto leading-relaxed">
                Join thousands creating vision boards and achieving their 2025
                goals
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/create">
                  <Button
                    variant="secondary"
                    size="lg"
                    className="min-w-[240px] bg-[#0D0C1D] text-white hover:bg-[#1A1A2E] shadow-2xl hover:scale-105 font-bold text-lg py-6"
                  >
                    Start Free Today →
                  </Button>
                </Link>
                <Link href="/about">
                  <Button
                    variant="outline"
                    size="lg"
                    className="min-w-[240px] border-2 border-white text-white hover:bg-white/20 font-semibold text-lg py-6"
                  >
                    Learn More
                  </Button>
                </Link>
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
              <h3
                className="text-lg font-bold text-white mb-4"
                style={{ fontFamily: "'Switzer', sans-serif", fontWeight: 700 }}
              >
                <span className="bg-gradient-to-r from-[#E0AAFF] to-[#9D4EDD] bg-clip-text text-transparent">
                  DREAMBOARD
                </span>
              </h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                AI-powered vision boards to manifest your dreams in 2025
              </p>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-white mb-4">Product</h4>
              <ul className="space-y-2 text-sm">
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
              <h4 className="text-sm font-semibold text-white mb-4">Legal</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-white transition"
                  >
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-white transition"
                  >
                    Terms of Service
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-white transition"
                  >
                    Cookie Policy
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-white mb-4">Connect</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-white transition"
                  >
                    Twitter
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-white transition"
                  >
                    Instagram
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-white transition"
                  >
                    Support
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="pt-8 border-t border-purple-500/10 text-center text-gray-400 text-sm">
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
