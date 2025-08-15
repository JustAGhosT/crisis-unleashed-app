const fs = require('fs');
const path = require.resolve('next/dist/build/index.js');
let src = fs.readFileSync(path, 'utf8');
const find = /(generateBuildId\)\(\s*config\.generateBuildId\s*,\s*_indexcjs\.nanoid\s*\)\)/;
if(!find.test(src)){
  console.error('Pattern not found in', path);
  process.exit(2);
}
src = src.replace(find, "generateBuildId)(typeof config.generateBuildId==='function'?config.generateBuildId:()=>null, _indexcjs.nanoid))");
fs.writeFileSync(path, src, 'utf8');
console.log('Patched:', path);
