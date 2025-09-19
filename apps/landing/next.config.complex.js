/** @type {import('next').NextConfig} */
const nextConfig = {
  // Basic configuration for App Platform
  output: 'standalone',
  
  // Disable problematic features
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  
  // Minimal webpack config to avoid memory issues
  webpack: (config, { dev, isServer }) => {
    if (!dev && !isServer) {
      // Only apply optimizations for production builds
      config.optimization = {
        ...config.optimization,
        splitChunks: {
          chunks: 'all',
          maxInitialRequests: 20,
          maxAsyncRequests: 20,
          cacheGroups: {
            default: {
              minChunks: 1,
              priority: -20,
              reuseExistingChunk: true,
            },
            vendor: {
              test: /[\\/]node_modules[\\/]/,
              name: 'vendors',
              priority: -10,
              chunks: 'all',
            },
          },
        },
      };
    }
    
    return config;
  },
};

module.exports = nextConfig;
