/* Create shims for Next internal next-response path in CJS and ESM builds */
const fs = require('fs');
const path = require('path');

function ensureFile(filePath, content) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, content, 'utf8');
  console.log('[patch-next-response] Wrote', filePath);
}

function main() {
  // Resolve CJS and ESM exports directories from the frontend-next workspace
  const frontendNextDir = path.resolve(__dirname, '..', 'frontend-next');
  const cjsExportsDir = require.resolve('next/dist/server/web/exports/index.js', { paths: [frontendNextDir] });
  const esmExportsDir = require.resolve('next/dist/esm/server/web/exports/index.js', { paths: [frontendNextDir] });

  const cjsDir = path.dirname(cjsExportsDir);
  const esmDir = path.dirname(esmExportsDir);

  const cjsShim = path.join(cjsDir, 'next-response.js');
  const esmShim = path.join(esmDir, 'next-response.js');

  // CJS shim re-exports from index.js
  ensureFile(cjsShim, "module.exports = require('./index.js');\n");
  // ESM shim re-exports from index.js
  ensureFile(esmShim, "export * from './index.js';\n");
}

try {
  main();
} catch (e) {
  console.error('[patch-next-response] Failed:', e && e.message);
  process.exit(2);
}
