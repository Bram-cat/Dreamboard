"use client";

import Link from "next/link";
import { useState } from "react";
import { Button } from "./ui/Button";

export default function Navigation() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <nav className="fixed top-0 w-full z-50 bg-[#0d0c1d]/80 backdrop-blur-xl border-b border-[#474973]/20">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex justify-between items-center">
          {/* Logo - DB that expands on hover with smooth animation */}
          <Link href="/" className="group relative">
            <h1
              className="text-2xl font-bold bg-gradient-to-r from-[#a69cac] to-[#474973] bg-clip-text text-transparent"
              style={{ fontFamily: "'Switzer', sans-serif", fontWeight: 700 }}
            >
              <span className="inline-block transition-all duration-500 ease-in-out group-hover:opacity-0 group-hover:w-0 overflow-hidden">
                DB
              </span>
              <span className="absolute left-0 opacity-0 w-0 transition-all duration-500 ease-in-out group-hover:opacity-100 group-hover:w-auto overflow-hidden whitespace-nowrap">
                DreamBoard
              </span>
            </h1>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            <Link href="/" className="text-gray-300 hover:text-white transition-colors">
              Home
            </Link>
            <Link href="/about" className="text-gray-300 hover:text-white transition-colors">
              About
            </Link>
            <Link href="/pricing" className="text-gray-300 hover:text-white transition-colors">
              Pricing
            </Link>
            <Button variant="primary" size="sm">
              <Link href="/create">Create Board</Link>
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-white"
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
            <Link href="/" className="block text-gray-300 hover:text-white transition-colors">
              Home
            </Link>
            <Link href="/about" className="block text-gray-300 hover:text-white transition-colors">
              About
            </Link>
            <Link href="/pricing" className="block text-gray-300 hover:text-white transition-colors">
              Pricing
            </Link>
            <Button variant="primary" size="sm" className="w-full">
              <Link href="/create">Create Board</Link>
            </Button>
          </div>
        )}
      </div>
    </nav>
  );
}
