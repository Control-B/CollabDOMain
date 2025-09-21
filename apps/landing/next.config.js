/** @type {import('next').NextConfig} */
const nextConfig = {
  // Default to Node server (standalone). Set NEXT_EXPORT=true to produce static export (out/).
  output: process.env.NEXT_EXPORT === 'true' ? 'export' : 'standalone',
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
  // Optional basePath/assetPrefix for subpath deployments (e.g., DigitalOcean App Platform)
  basePath: process.env.NEXT_PUBLIC_BASE_PATH || undefined,
  assetPrefix: process.env.NEXT_PUBLIC_ASSET_PREFIX || undefined,
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
