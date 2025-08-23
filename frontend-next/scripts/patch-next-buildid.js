/* eslint-disable */
/* Patches next/dist/build/index.js to guard undefined config.generateBuildId (idempotent) */
/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable import/no-commonjs */
const fs = require('fs');
const path = require('path');
// Resolve relative to the package root (this script sits in frontend-next/scripts)
const frontendRoot = path.resolve(__dirname, '..');
let target;
try {
  target = require.resolve('next/dist/build/index.js', { paths: [frontendRoot] });
} catch {
  // Fallback: try default Node resolution without custom paths
  try {
    target = require.resolve('next/dist/build/index.js');
  } catch (err) {
    console.error('[patch-next-buildid] Unable to resolve Next build file from', frontendRoot);
    console.error(err && err.message);
    process.exit(2);
  }
}
let src = fs.readFileSync(target, 'utf8');
// If already patched, exit idempotently
if (
  src.includes("typeof config.generateBuildId==='function'?config.generateBuildId:()=>undefined") ||
  src.includes("typeof config.generateBuildId==='function'?config.generateBuildId:()=>null")
) {
  if (process.env.NEXT_PATCH_DEBUG === 'true') {
    console.log('[patch-next-buildid] Already patched:', target);
  }
  process.exit(0);
}
// Support both double-quoted and single-quoted variants across Next versions
const beforeDouble = 'return await nextBuildSpan.traceChild("generate-buildid").traceAsyncFn(()=>(0, _generatebuildid.generateBuildId)(config.generateBuildId, _indexcjs.nanoid));';
const beforeSingle = "return await nextBuildSpan.traceChild('generate-buildid').traceAsyncFn(()=>(0, _generatebuildid.generateBuildId)(config.generateBuildId, _indexcjs.nanoid));";
const after = "return await nextBuildSpan.traceChild('generate-buildid').traceAsyncFn(()=>(0, _generatebuildid.generateBuildId)(typeof config.generateBuildId==='function'?config.generateBuildId:()=>undefined, _indexcjs.nanoid));";
if (src.includes(beforeDouble)) {
  src = src.replace(beforeDouble, after);
} else if (src.includes(beforeSingle)) {
  src = src.replace(beforeSingle, after);
} else {
  // Fallback: patch the generateBuildId(...) call defensively via regex
  const callPattern = /(generateBuildId)\(config\.generateBuildId,\s*_indexcjs\.nanoid\)/;
  if (!callPattern.test(src)) {
    if (process.env.NEXT_PATCH_DEBUG === 'true') {
      console.log('[patch-next-buildid] Target call site not found (possibly different Next version):', target);
    }
    // No-op
    process.exit(0);
  }
  src = src.replace(callPattern, "generateBuildId(typeof config.generateBuildId==='function'?config.generateBuildId:()=>undefined, _indexcjs.nanoid)");
}
fs.writeFileSync(target, src, 'utf8');
if (process.env.NEXT_PATCH_DEBUG === 'true') {
  console.log('[patch-next-buildid] Patched:', target);
}
