import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // Silence incorrect root inference in monorepos and ensure PostCSS/Tailwind config is discovered
  outputFileTracingRoot: __dirname,

  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
