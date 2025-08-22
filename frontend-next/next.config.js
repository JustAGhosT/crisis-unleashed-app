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
    ignoreDuringBuilds: true,
  },
  // Next.js 15: typedRoutes moved out of experimental
  typedRoutes: true,
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
    const api = process.env.NEXT_PUBLIC_API_URL;
    if (!api) {
      if (process.env.NEXT_DEBUG === 'true') {
        console.warn('[frontend-next] NEXT_PUBLIC_API_URL is not set; skipping rewrites');
      }
      // Without a destination, return no rewrites to avoid invalid config
      return [];
    }
    // Normalize URL to avoid double slashes
    const normalized = api.endsWith('/') ? api.slice(0, -1) : api;
    return [
      {
        source: '/api/:path*',
        destination: `${normalized}/:path*`,
      },
    ];
  },
};

module.exports = nextConfig;

