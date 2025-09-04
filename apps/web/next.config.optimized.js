/** @type {import('next').NextConfig} */

// High-performance Next.js configuration for 30M DAU
const nextConfig = {
  // Experimental features for performance
  experimental: {
    // React 18 features
    appDir: true,
    serverComponentsExternalPackages: ['phoenix'],

    // Performance optimizations
    optimizeCss: true,
    optimizePackageImports: ['lucide-react', '@tanstack/react-query'],

    // Memory optimization
    workerThreads: false,
    cpus: 4,

    // Edge runtime for faster cold starts
    runtime: 'nodejs',

    // Streaming and partial prerendering
    ppr: true, // Partial Prerendering
    reactCompiler: true,
  },

  // Image optimization for scale
  images: {
    // Multiple CDN domains for load distribution
    domains: [
      'cdn1.dispatchar.com',
      'cdn2.dispatchar.com',
      'cdn3.dispatchar.com',
      'images.dispatchar.com',
    ],

    // Format optimization
    formats: ['image/avif', 'image/webp'],

    // Size optimization
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],

    // Performance settings
    minimumCacheTTL: 31536000, // 1 year
    dangerouslyAllowSVG: false,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",

    // External image optimization service
    loader: 'custom',
    loaderFile: './lib/imageLoader.js',
  },

  // Bundle optimization
  webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
    // Production optimizations
    if (!dev) {
      // Bundle analyzer (conditional)
      if (process.env.ANALYZE === 'true') {
        const BundleAnalyzerPlugin = require('@next/bundle-analyzer')({
          enabled: true,
        });
        config.plugins.push(new BundleAnalyzerPlugin());
      }

      // Minimize bundle size
      config.optimization = {
        ...config.optimization,

        // Advanced tree shaking
        usedExports: true,
        sideEffects: false,

        // Code splitting optimization
        splitChunks: {
          chunks: 'all',
          cacheGroups: {
            // Vendor libraries
            vendor: {
              test: /[\\/]node_modules[\\/]/,
              name: 'vendors',
              chunks: 'all',
              maxSize: 244000, // ~244KB chunks
            },

            // Common components
            common: {
              name: 'common',
              minChunks: 2,
              chunks: 'all',
              enforce: true,
              maxSize: 244000,
            },

            // Framework (React, Next.js)
            framework: {
              test: /[\\/]node_modules[\\/](react|react-dom|next)[\\/]/,
              name: 'framework',
              chunks: 'all',
              enforce: true,
            },
          },
        },

        // Module concatenation for smaller bundles
        concatenateModules: true,
      };

      // Compression plugins
      config.plugins.push(
        new webpack.DefinePlugin({
          __DEV__: false,
          'process.env.NODE_ENV': JSON.stringify('production'),
        }),
      );
    }

    // Performance monitoring
    config.plugins.push(
      new webpack.DefinePlugin({
        __BUILD_ID__: JSON.stringify(buildId),
        __BUILD_TIME__: JSON.stringify(Date.now()),
      }),
    );

    return config;
  },

  // Compiler optimization
  compiler: {
    // Remove console logs in production
    removeConsole:
      process.env.NODE_ENV === 'production'
        ? {
            exclude: ['error', 'warn'],
          }
        : false,

    // React optimizations
    reactRemoveProperties: process.env.NODE_ENV === 'production',

    // Styled components optimization
    styledComponents: true,
  },

  // Output optimization
  output: 'standalone',

  // Static optimization
  trailingSlash: false,

  // Compression
  compress: true,

  // PWA and caching
  headers: async () => [
    {
      source: '/(.*)',
      headers: [
        {
          key: 'X-Frame-Options',
          value: 'DENY',
        },
        {
          key: 'X-Content-Type-Options',
          value: 'nosniff',
        },
        {
          key: 'X-XSS-Protection',
          value: '1; mode=block',
        },
        {
          key: 'Referrer-Policy',
          value: 'origin-when-cross-origin',
        },
      ],
    },
    {
      source: '/static/(.*)',
      headers: [
        {
          key: 'Cache-Control',
          value: 'public, max-age=31536000, immutable',
        },
      ],
    },
    {
      source: '/_next/static/(.*)',
      headers: [
        {
          key: 'Cache-Control',
          value: 'public, max-age=31536000, immutable',
        },
      ],
    },
    {
      source: '/api/(.*)',
      headers: [
        {
          key: 'Cache-Control',
          value: 'public, max-age=300, s-maxage=300',
        },
      ],
    },
  ],

  // Redirects for performance
  redirects: async () => [
    // Redirect old URLs to new optimized routes
    {
      source: '/chat/:id',
      destination: '/channels/:id',
      permanent: true,
    },
  ],

  // Rewrites for API optimization
  rewrites: async () => [
    {
      source: '/api/v1/:path*',
      destination: 'https://api.dispatchar.com/v1/:path*',
    },
  ],

  // Security and performance middleware
  poweredByHeader: false,
  reactStrictMode: true,

  // Environment variables for runtime optimization
  env: {
    NEXT_PUBLIC_BUILD_ID: process.env.BUILD_ID || 'development',
    NEXT_PUBLIC_CDN_URL: process.env.CDN_URL || '',
    NEXT_PUBLIC_API_URL: process.env.API_URL || 'http://localhost:5000',
    NEXT_PUBLIC_WS_URL: process.env.WS_URL || 'ws://localhost:4000',
  },

  // TypeScript optimization
  typescript: {
    // Build-time type checking (separate from bundling)
    ignoreBuildErrors: false,
  },

  // ESLint optimization
  eslint: {
    // Build-time linting
    ignoreDuringBuilds: false,
  },
};

// Performance monitoring wrapper
if (process.env.NODE_ENV === 'production') {
  const withBundleAnalyzer = require('@next/bundle-analyzer')({
    enabled: process.env.ANALYZE === 'true',
  });

  module.exports = withBundleAnalyzer(nextConfig);
} else {
  module.exports = nextConfig;
}



