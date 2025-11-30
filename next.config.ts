import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Disable static export for API routes to work on Netlify
  output: undefined,

  // Enable serverless functions
  experimental: {
    // Ensure API routes are treated as serverless functions
  },

  // Image optimization settings
  images: {
    unoptimized: true, // Required for Netlify deployment
  },
};

export default nextConfig;
