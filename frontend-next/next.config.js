/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    // Enable strict mode for better type checking
    ignoreBuildErrors: false,
  },
  eslint: {
    // Run ESLint during builds
    ignoreDuringBuilds: false,
  },
  experimental: {
    // Enable latest Next.js features
    typedRoutes: true,
  },
  // API routes for backend communication
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'http://localhost:8000/:path*', // FastAPI backend
      },
    ];
  },
};

module.exports = nextConfig;