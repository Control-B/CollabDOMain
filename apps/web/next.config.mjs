/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  async redirects() {
    return [{ source: '/ops', destination: '/dashboard', permanent: true }];
  },
};
export default nextConfig;
