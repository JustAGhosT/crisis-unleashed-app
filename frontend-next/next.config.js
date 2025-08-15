/** @type {import('next').NextConfig} */
// Debug: verify config file is actually being loaded by Next.js
console.log('[frontend-next] Loading next.config.js');
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
  // Workaround: Guard internal path changes between Next versions
  webpack: (config) => {
    config.resolve = config.resolve || {};
    config.resolve.alias = config.resolve.alias || {};
    // Some Next versions reference this internal path which no longer exists; alias it to the current exports index (CJS & ESM, with/without .js suffix).
    try {
      const cjsIndex = require.resolve('next/dist/server/web/exports/index.js');
      config.resolve.alias['next/dist/server/web/exports/next-response'] = cjsIndex;
      config.resolve.alias['next/dist/server/web/exports/next-response.js'] = cjsIndex;
    } catch {}
    try {
      const esmIndex = require.resolve('next/dist/esm/server/web/exports/index.js');
      config.resolve.alias['next/dist/esm/server/web/exports/next-response'] = esmIndex;
      config.resolve.alias['next/dist/esm/server/web/exports/next-response.js'] = esmIndex;
    } catch {}
    return config;
  },
  // Ensure Next always receives a valid generator to avoid internal crash in generate-build-id
  async generateBuildId() {
    return "crisis-unleashed-build";
  },
  // API routes for backend communication
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        // Use env var to keep config environment-agnostic
        destination: `${process.env.NEXT_PUBLIC_API_URL}/:path*`,
      },
    ];
  },
};

module.exports = nextConfig;

