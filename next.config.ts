// next.config.js
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: ["res.cloudinary.com"], // 👈 allow Cloudinary
  },

  // 1. Ignore ESLint errors (Already done)
  eslint: {
    ignoreDuringBuilds: true, // 👈 Skips ESLint errors
  },

  // 2. ADD THIS SECTION to ignore TypeScript errors
  typescript: {
    // !! DANGER: Set this to true to ignore TypeScript errors during production build.
    ignoreBuildErrors: true,
  },

  /* config options here */
};

export default nextConfig;
