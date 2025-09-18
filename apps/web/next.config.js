/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  // Allow dev overlay/assets when opened via 127.0.0.1 in embedded browsers
  // See: https://nextjs.org/docs/app/api-reference/config/next-config-js/allowedDevOrigins
  allowedDevOrigins: ['127.0.0.1', 'localhost'],
};

module.exports = nextConfig;
