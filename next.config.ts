import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: ["res.cloudinary.com"], // 👈 allow Cloudinary
  },
  eslint: {
    ignoreDuringBuilds: true, // 👈 this will skip ESLint errors on Vercel
  },
  /* config options here */
};

export default nextConfig;
