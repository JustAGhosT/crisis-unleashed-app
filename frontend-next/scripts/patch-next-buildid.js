/* Patches next/dist/build/index.js to guard undefined config.generateBuildId */
const fs = require('fs');
const path = require('path');
const frontendNextDir = path.resolve(__dirname, '..', 'frontend-next');
let target;
try {
  target = require.resolve('next/dist/build/index.js', { paths: [frontendNextDir] });
} catch (e) {
  console.error('[patch-next-buildid] Unable to resolve Next build file from', frontendNextDir);
  console.error(e && e.message);
  process.exit(2);
}
let src = fs.readFileSync(target, 'utf8');
// Support both double-quoted and single-quoted variants across Next versions
const beforeDouble = 'return await nextBuildSpan.traceChild("generate-buildid").traceAsyncFn(()=>(0, _generatebuildid.generateBuildId)(config.generateBuildId, _indexcjs.nanoid));';
const beforeSingle = "return await nextBuildSpan.traceChild('generate-buildid').traceAsyncFn(()=>(0, _generatebuildid.generateBuildId)(config.generateBuildId, _indexcjs.nanoid));";
const after = "return await nextBuildSpan.traceChild('generate-buildid').traceAsyncFn(()=>(0, _generatebuildid.generateBuildId)(typeof config.generateBuildId==='function'?config.generateBuildId:()=>null, _indexcjs.nanoid));";
if (src.includes(beforeDouble)) {
  src = src.replace(beforeDouble, after);
} else if (src.includes(beforeSingle)) {
  src = src.replace(beforeSingle, after);
} else {
  // Fallback: patch the generateBuildId(...) call defensively via regex
  const callPattern = /(generateBuildId)\(config\.generateBuildId,\s*_indexcjs\.nanoid\)/;
  if (!callPattern.test(src)) {
    console.error('[patch-next-buildid] Call site not found in', target);
    process.exit(3);
  }
  src = src.replace(callPattern, "generateBuildId(typeof config.generateBuildId==='function'?config.generateBuildId:()=>null, _indexcjs.nanoid)");
}
fs.writeFileSync(target, src, 'utf8');
console.log('[patch-next-buildid] Patched:', target);
