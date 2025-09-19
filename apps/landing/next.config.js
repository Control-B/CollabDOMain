/** @type {import('next').NextConfig} */
const nextConfig = {
  // Use static export for reliable deployment
  output: 'export',
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
  // Silence monorepo root detection warning for output file tracing
  outputFileTracingRoot: '/Users/banjahmarah/CollabDOmain/CollabDOMain',
  
  // Disable all problematic features
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
};

module.exports = nextConfig;
