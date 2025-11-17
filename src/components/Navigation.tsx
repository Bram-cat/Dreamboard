"use client";

import Link from "next/link";
import { useState } from "react";
import { Button } from "./ui/Button";

export default function Navigation() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <nav className="fixed top-0 w-full z-50 bg-[#22223B]/95 backdrop-blur-xl border-b border-[#4A4E69]/30">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex justify-between items-center">
          {/* Logo - DB that expands on hover with smooth slow animation */}
          <Link href="/" className="group relative inline-block">
            <h1
              className="text-2xl font-bold bg-gradient-to-r from-[#9A8C98] to-[#C9ADA7] bg-clip-text text-transparent"
              style={{ fontFamily: "'Switzer', sans-serif", fontWeight: 700 }}
            >
              <span className="inline-block transition-all duration-700 ease-in-out group-hover:opacity-0 group-hover:w-0 overflow-hidden whitespace-nowrap">
                DB
              </span>
              <span className="absolute left-0 top-0 opacity-0 transition-all duration-700 ease-in-out group-hover:opacity-100 whitespace-nowrap">
                Dream Board
              </span>
            </h1>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            <Link href="/" className="text-[#C9ADA7] hover:text-[#F2E9E4] transition-colors duration-300">
              Home
            </Link>
            <Link href="/about" className="text-[#C9ADA7] hover:text-[#F2E9E4] transition-colors duration-300">
              About
            </Link>
            <Link href="/pricing" className="text-[#C9ADA7] hover:text-[#F2E9E4] transition-colors duration-300">
              Pricing
            </Link>
            <Link href="/create">
              <Button variant="primary" size="sm" className="bg-gradient-to-r from-[#9A8C98] to-[#C9ADA7] hover:from-[#C9ADA7] hover:to-[#F2E9E4] text-[#22223B] font-semibold shadow-lg hover:shadow-xl transition-all duration-300">
                Create Board
              </Button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-[#F2E9E4]"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {mobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden mt-4 pb-4 space-y-4">
            <Link href="/" className="block text-[#C9ADA7] hover:text-[#F2E9E4] transition-colors">
              Home
            </Link>
            <Link href="/about" className="block text-[#C9ADA7] hover:text-[#F2E9E4] transition-colors">
              About
            </Link>
            <Link href="/pricing" className="block text-[#C9ADA7] hover:text-[#F2E9E4] transition-colors">
              Pricing
            </Link>
            <Link href="/create" className="block">
              <Button variant="primary" size="sm" className="w-full bg-gradient-to-r from-[#9A8C98] to-[#C9ADA7] hover:from-[#C9ADA7] hover:to-[#F2E9E4] text-[#22223B] font-semibold">
                Create Board
              </Button>
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
}
