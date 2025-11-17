"use client";

import Link from "next/link";
import { useState } from "react";

export default function PricingPage() {
  const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">("monthly");

  const plans = [
    {
      name: "Free",
      price: 0,
      description: "Perfect for trying out Dreamboard",
      features: [
        "1 vision board per account",
        "All template styles",
        "Basic AI image generation",
        "HD downloads",
        "Personal use only"
      ],
      limitations: [
        "Limited to 1 board",
        "Standard processing speed"
      ],
      cta: "Start Free",
      popular: false,
      gradient: "from-gray-600 to-gray-700"
    },
    {
      name: "Premium",
      price: 10,
      description: "Unlimited manifestation power",
      features: [
        "20 vision boards per month",
        "All premium templates",
        "Advanced AI generation",
        "4K Ultra HD downloads",
        "Priority processing",
        "Commercial use license",
        "Early access to new features",
        "Email support"
      ],
      limitations: [],
      cta: "Go Premium",
      popular: true,
      gradient: "from-[#7209B7] to-[#9D4EDD]"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0D0C1D] via-[#1A1A2E] to-[#0D0C1D]">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-[#0D0C1D]/80 backdrop-blur-lg border-b border-purple-900/20">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <Link href="/landing" className="flex items-center gap-2">
            <span className="text-4xl">✨</span>
            <h1 className="text-2xl font-bold" style={{ fontFamily: "'Bespoke Stencil', sans-serif" }}>
              <span className="bg-gradient-to-r from-[#E0AAFF] via-[#C77DFF] to-[#9D4EDD] bg-clip-text text-transparent">
                DREAMBOARD
              </span>
            </h1>
          </Link>

          <div className="hidden md:flex items-center gap-8">
            <Link href="/landing" className="text-gray-300 hover:text-white transition">Home</Link>
            <Link href="/pricing" className="text-white font-semibold">Pricing</Link>
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
      <section className="pt-32 pb-12 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h1
            className="text-5xl md:text-7xl font-bold mb-6"
            style={{ fontFamily: "'Bespoke Stencil', sans-serif" }}
          >
            <span className="bg-gradient-to-r from-[#E0AAFF] via-[#C77DFF] to-[#9D4EDD] bg-clip-text text-transparent">
              SIMPLE, TRANSPARENT
            </span>
            <br />
            <span className="text-white">PRICING</span>
          </h1>

          <p className="text-xl text-gray-300 mb-8">
            Start free, upgrade when you need more power
          </p>

          {/* Billing Toggle */}
          <div className="inline-flex items-center gap-4 p-2 bg-[#1A1A2E] rounded-lg">
            <button
              onClick={() => setBillingCycle("monthly")}
              className={`px-6 py-2 rounded-lg transition ${
                billingCycle === "monthly"
                  ? "bg-gradient-to-r from-[#7209B7] to-[#9D4EDD] text-white font-semibold"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setBillingCycle("yearly")}
              className={`px-6 py-2 rounded-lg transition relative ${
                billingCycle === "yearly"
                  ? "bg-gradient-to-r from-[#7209B7] to-[#9D4EDD] text-white font-semibold"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              Yearly
              <span className="absolute -top-2 -right-2 px-2 py-0.5 bg-green-500 text-white text-xs rounded-full">
                Save 20%
              </span>
            </button>
          </div>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="py-12 px-6">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-8">
          {plans.map((plan, index) => (
            <div
              key={index}
              className={`relative rounded-3xl p-8 ${
                plan.popular
                  ? "bg-gradient-to-br from-[#1A1A2E] to-[#16213E] border-2 border-purple-400"
                  : "bg-[#1A1A2E] border-2 border-purple-500/20"
              } hover:scale-105 transition-transform`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-6 py-1 bg-gradient-to-r from-[#7209B7] to-[#9D4EDD] rounded-full text-sm font-bold text-white">
                  MOST POPULAR
                </div>
              )}

              <div className="text-center mb-8">
                <h3 className="text-3xl font-bold text-white mb-2" style={{ fontFamily: "'Bespoke Stencil', sans-serif" }}>
                  {plan.name}
                </h3>
                <p className="text-gray-400">{plan.description}</p>
              </div>

              <div className="text-center mb-8">
                <div className="flex items-baseline justify-center gap-2">
                  <span className="text-6xl font-bold text-white">
                    ${billingCycle === "yearly" ? Math.floor(plan.price * 0.8) : plan.price}
                  </span>
                  {plan.price > 0 && (
                    <span className="text-gray-400">/{billingCycle === "yearly" ? "year" : "month"}</span>
                  )}
                </div>
                {billingCycle === "yearly" && plan.price > 0 && (
                  <p className="text-sm text-green-400 mt-2">Save ${plan.price * 12 * 0.2}/year</p>
                )}
              </div>

              <ul className="space-y-4 mb-8">
                {plan.features.map((feature, idx) => (
                  <li key={idx} className="flex items-start gap-3">
                    <span className="text-green-400 mt-1">✓</span>
                    <span className="text-gray-300">{feature}</span>
                  </li>
                ))}
                {plan.limitations.map((limitation, idx) => (
                  <li key={idx} className="flex items-start gap-3 opacity-50">
                    <span className="text-gray-500 mt-1">○</span>
                    <span className="text-gray-500">{limitation}</span>
                  </li>
                ))}
              </ul>

              <Link
                href="/create"
                className={`block w-full text-center px-8 py-4 rounded-lg font-bold text-lg transition ${
                  plan.popular
                    ? `bg-gradient-to-r ${plan.gradient} text-white hover:opacity-90 shadow-lg shadow-purple-500/30`
                    : "bg-[#16213E] text-white hover:bg-[#1A1A2E]"
                }`}
              >
                {plan.cta}
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 px-6">
        <div className="max-w-3xl mx-auto">
          <h2
            className="text-4xl font-bold text-center mb-12"
            style={{ fontFamily: "'Bespoke Stencil', sans-serif" }}
          >
            <span className="bg-gradient-to-r from-[#E0AAFF] to-[#9D4EDD] bg-clip-text text-transparent">
              FREQUENTLY ASKED QUESTIONS
            </span>
          </h2>

          <div className="space-y-6">
            {[
              {
                q: "Can I try before I buy?",
                a: "Absolutely! Our free plan gives you 1 vision board to try all features and templates."
              },
              {
                q: "What happens if I exceed 20 boards?",
                a: "Premium allows 20 boards per month. The counter resets monthly. You can always upgrade mid-month."
              },
              {
                q: "Can I cancel anytime?",
                a: "Yes! Cancel your subscription anytime. You'll keep access until the end of your billing period."
              },
              {
                q: "Do you offer refunds?",
                a: "We offer a 30-day money-back guarantee if you're not satisfied with premium features."
              },
              {
                q: "What's included in commercial use?",
                a: "Premium users can use generated boards for business presentations, social media, and marketing."
              }
            ].map((faq, index) => (
              <div key={index} className="p-6 bg-[#1A1A2E] rounded-xl border border-purple-500/20">
                <h3 className="text-xl font-bold text-white mb-3">{faq.q}</h3>
                <p className="text-gray-400 leading-relaxed">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto text-center bg-gradient-to-r from-[#7209B7] to-[#9D4EDD] rounded-3xl p-12">
          <h2
            className="text-4xl md:text-5xl font-bold mb-6"
            style={{ fontFamily: "'Bespoke Stencil', sans-serif" }}
          >
            READY TO MANIFEST?
          </h2>
          <p className="text-xl text-purple-100 mb-8">
            Start creating your dream vision board today
          </p>
          <Link
            href="/create"
            className="inline-block px-10 py-4 bg-white text-[#7209B7] rounded-lg hover:bg-gray-100 transition font-bold text-lg"
          >
            Get Started Free
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 border-t border-purple-900/20">
        <div className="max-w-7xl mx-auto text-center text-gray-400">
          <p>&copy; 2025 Dreamboard. All rights reserved.</p>
          <div className="flex justify-center gap-6 mt-4">
            <a href="#" className="hover:text-white transition">Privacy</a>
            <a href="#" className="hover:text-white transition">Terms</a>
            <a href="#" className="hover:text-white transition">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
