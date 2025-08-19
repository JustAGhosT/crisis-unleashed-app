/** @type {import('next').NextConfig} */
if (process.env.NEXT_DEBUG === 'true') {
  console.log('[frontend-next] Loading next.config.js');
}
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
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        console.warn('[next.config] Failed to resolve CJS exports:', error.message);
      }
    }
    try {
      const esmIndex = require.resolve('next/dist/esm/server/web/exports/index.js');
      config.resolve.alias['next/dist/esm/server/web/exports/next-response'] = esmIndex;
      config.resolve.alias['next/dist/esm/server/web/exports/next-response.js'] = esmIndex;
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        console.warn('[next.config] Failed to resolve ESM exports:', error.message);
      }
    }
    return config;
  },
  // Ensure Next always receives a valid generator to avoid internal crash in generate-build-id
  async generateBuildId() {
    // 1) Allow explicit override via env (useful in CI)
    if (process.env.NEXT_BUILD_ID && process.env.NEXT_BUILD_ID.trim()) {
      return process.env.NEXT_BUILD_ID.trim();
    }
    // 2) Prefer current git commit hash if available
    try {
      const { execSync } = await import('node:child_process');
      const hash = execSync('git rev-parse --short=12 HEAD', { stdio: ['ignore', 'pipe', 'ignore'] })
        .toString()
        .trim();
      if (hash) return `cu_${hash}`;
    } catch {
      // ignore and fall back
    }
    // 3) Fallback: timestamp-based ID (still cache-busting per deploy)
    const ts = new Date().toISOString().replace(/[-:TZ.]/g, '').slice(0, 14);
    return `cu_${ts}`;
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

