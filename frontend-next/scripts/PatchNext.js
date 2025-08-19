/* eslint-disable import/no-commonjs, @typescript-eslint/no-require-imports */
const fs = require('fs');
const nodePath = require('path');

// Optional: make this patch opt-in to avoid colliding with patch-next-buildid.js
if (process.env.NEXT_ENABLE_PATCHNEXT !== 'true') {
  if (process.env.NEXT_PATCH_DEBUG === 'true') {
    console.log('[PatchNext] Skipped (set NEXT_ENABLE_PATCHNEXT=true to enable)');
  }
  process.exit(0);
}

// Resolve Next's build file location robustly
let buildFilePath;
try {
  // Prefer resolving relative to this workspace to avoid monorepo resolution surprises
  const frontendNextDir = nodePath.resolve(__dirname, '..');
  buildFilePath = require.resolve('next/dist/build/index.js', { paths: [frontendNextDir] });
} catch {
  try {
    buildFilePath = require.resolve('next/dist/build/index.js');
  } catch (err) {
    console.error('[PatchNext] Unable to resolve Next build file');
    console.error(err && err.message);
    process.exit(2);
  }
}

let src = fs.readFileSync(buildFilePath, 'utf8');

// If already patched (guard present), exit idempotently
const alreadyGuarded = src.includes("typeof config.generateBuildId==='function'?config.generateBuildId:()=>null");
if (alreadyGuarded) {
  if (process.env.NEXT_PATCH_DEBUG === 'true') {
    console.log('[PatchNext] Already patched:', buildFilePath);
  }
  process.exit(0);
}

// Find the generateBuildId call that passes config.generateBuildId directly
const callPattern = /(generateBuildId)\(\s*config\.generateBuildId\s*,\s*_indexcjs\.nanoid\s*\)/;
if (!callPattern.test(src)) {
  // If the vulnerable call is not present and not already guarded, treat as no-op
  if (process.env.NEXT_PATCH_DEBUG === 'true') {
    console.log('[PatchNext] Target call site not found (possibly different Next version):', buildFilePath);
  }
  process.exit(0);
}

// Replace with guarded call
src = src.replace(
  callPattern,
  "generateBuildId(typeof config.generateBuildId==='function'?config.generateBuildId:()=>null, _indexcjs.nanoid)"
);

fs.writeFileSync(buildFilePath, src, 'utf8');
console.log('[PatchNext] Patched:', buildFilePath);
