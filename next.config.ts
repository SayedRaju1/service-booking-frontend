import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactStrictMode: true,
  // Suppress hydration warnings in development
  onDemandEntries: {
    maxInactiveAge: 25 * 1000,
    pagesBufferLength: 2,
  },
  // Ensure proper client/server component handling
  transpilePackages: [],
  // Disable static optimization for pages with client components
  trailingSlash: false,
  // Move serverComponentsExternalPackages to the correct location
  serverExternalPackages: [],
};

export default nextConfig;
