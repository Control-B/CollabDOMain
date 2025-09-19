/** @type {import('next').NextConfig} */
const nextConfig = {
  // Silence incorrect root inference in monorepos and ensure PostCSS/Tailwind config is discovered
  outputFileTracingRoot: __dirname,

  // Allow dev overlay/assets when opened via 127.0.0.1 in embedded browsers
  // See: https://nextjs.org/docs/app/api-reference/config/next-config-js/allowedDevOrigins
  allowedDevOrigins: ['127.0.0.1', 'localhost'],

  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  
  // Optimize for production deployment
  output: 'standalone',
};

module.exports = nextConfig;
