/** @type {import('next').NextConfig} */
const nextConfig = {
  // Optimize for App Platform deployment
  output: 'standalone',
  
  // Set explicit root to avoid multiple lockfile warnings
  outputFileTracingRoot: __dirname,
  
  // Allow dev overlay/assets when opened via 127.0.0.1 in embedded browsers
  allowedDevOrigins: ['127.0.0.1', 'localhost'],

  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  
  // Optimize webpack for limited memory environments
  webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
    // Reduce memory usage
    config.optimization = {
      ...config.optimization,
      splitChunks: {
        chunks: 'all',
        cacheGroups: {
          default: {
            minChunks: 1,
            priority: -20,
            reuseExistingChunk: true,
          },
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            priority: -10,
            chunks: 'all',
          },
        },
      },
    };
    
    // Reduce bundle size
    if (!dev && !isServer) {
      config.resolve.alias = {
        ...config.resolve.alias,
        '@': __dirname,
      };
    }
    
    return config;
  },
};

module.exports = nextConfig;
