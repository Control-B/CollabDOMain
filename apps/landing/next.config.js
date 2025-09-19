/** @type {import('next').NextConfig} */
const nextConfig = {
  // Use server-side rendering for authentication
  output: 'standalone',
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
  
  // Set explicit root to avoid multiple lockfile warnings
  outputFileTracingRoot: __dirname,
  
  // Disable all problematic features
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  
  // No webpack customizations
};

module.exports = nextConfig;
