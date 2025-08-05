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
        // Use env var to keep config environment-agnostic
        destination: `${process.env.NEXT_PUBLIC_API_URL}/:path*`,
      },
    ];
  },
};

module.exports = nextConfig;