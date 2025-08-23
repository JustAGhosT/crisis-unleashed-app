/* Create shims for Next internal next-response path in CJS and ESM builds */
/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable @typescript-eslint/no-require-imports */
/* eslint-disable import/no-commonjs */
const fs = require('fs');
const path = require('path');

function ensureDir(dir) {
  try {
    fs.mkdirSync(dir, { recursive: true });
  } catch (e) {
    console.error('[patch-next-response] Failed to create directory:', dir, '-', e && e.message);
    if (process.env.NEXT_PATCH_DEBUG === 'true' && e && e.stack) {
      console.error(e.stack);
    }
    throw e;
  }
}

function writeFile(filePath, content) {
  try {
    fs.writeFileSync(filePath, content, 'utf8');
    if (process.env.NEXT_PATCH_DEBUG === 'true') {
      console.log('[patch-next-response] Wrote', filePath);
    }
  } catch (e) {
    const code = e && e.code;
    const isReadOnly = code === 'EROFS' || code === 'EPERM';
    console.error('[patch-next-response] Failed to write file:', filePath, '-', e && e.message);
    if (process.env.NEXT_PATCH_DEBUG === 'true' && e && e.stack) {
      console.error(e.stack);
    }
    if (isReadOnly) {
      console.warn('[patch-next-response] Detected read-only or permission-restricted node_modules (PNPM store immutability or hardlinks).');
      console.warn('[patch-next-response] Skip patching Next internals. Use an alias-based shim instead:');
      console.warn(' - Webpack: config.resolve.alias[\'next/dist/server/web/exports/next-response\'] = path.resolve(__dirname, \'src/shims/next-response.js\')');
      console.warn(' - Turbopack experimental.turbo.resolveAlias:');
      console.warn("   { 'next/dist/server/web/exports/next-response': './src/shims/next-response.js', 'next/dist/esm/server/web/exports/next-response': './src/shims/next-response.js' }");
      // Don't crash the build; allow callers to fall back to alias approach.
      return;
    }
    throw e;
  }
}

function ensureFile(filePath, content) {
  const dir = path.dirname(filePath);
  ensureDir(dir);
  writeFile(filePath, content);
}

function main() {
  // Resolve CJS and ESM exports directories from the package root (this script sits in frontend-next/scripts)
  const frontendRoot = path.resolve(__dirname, '..');
  let cjsExportsDir;
  let esmExportsDir;
  try {
    cjsExportsDir = require.resolve('next/dist/server/web/exports/index.js', { paths: [frontendRoot] });
    esmExportsDir = require.resolve('next/dist/esm/server/web/exports/index.js', { paths: [frontendRoot] });
  } catch {
    // Fallback: default Node resolution (in case Next is hoisted)
    cjsExportsDir = require.resolve('next/dist/server/web/exports/index.js');
    esmExportsDir = require.resolve('next/dist/esm/server/web/exports/index.js');
  }

  const cjsDir = path.dirname(cjsExportsDir);
  const esmDir = path.dirname(esmExportsDir);

  const cjsShim = path.join(cjsDir, 'next-response.js');
  const esmShim = path.join(esmDir, 'next-response.js');

  // CJS shim re-exports from index.js
  if (cjsDir) ensureFile(cjsShim, "module.exports = require('./index.js');\n");
  // ESM shim re-exports from index.js
  if (esmDir) ensureFile(esmShim, "export * from './index.js';\n");
}

try {
  main();
} catch (e) {
  console.error('[patch-next-response] Failed:', e && e.message);
  process.exit(2);
}
