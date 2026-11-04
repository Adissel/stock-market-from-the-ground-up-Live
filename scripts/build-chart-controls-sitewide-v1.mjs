/* Non-homepage chart chrome only: safe additive CSS, no data behavior. */
import {existsSync,readdirSync,readFileSync,writeFileSync} from 'node:fs';
import {join,resolve} from 'node:path';
const dir=resolve(process.env.GU_SITE_BUILD_DIR||'public');
const name='crownlight-unified-chart-controls-v1.css';
const href='/assets/css/'+name+'?v=20261104-unified-chart2';
if(!existsSync(join(dir,'assets','css',name)))throw Error('Shared chart controls stylesheet missing');
let covered=0,modified=0;
for(const file of readdirSync(dir).filter(f=>f.endsWith('.html')&&!['index.html','404.html'].includes(f)&&!/^google.*\.html$/i.test(f))){
 const path=join(dir,file),old=readFileSync(path,'utf8');
 if(!/<head\b/i.test(old)||!/<\/head>/i.test(old))continue;
 // Make all non-homepage charts use the same accessible control sizing,
 // including dynamically mounted learning and Tutor charts.
 let s=old.replace(/<link\b[^>]*\bhref\s*=\s*(['"])[^'"]*crownlight-unified-chart-controls-v1\.css(?:\?[^'"]*)?\1[^>]*>/gi,'');
 s=s.replace(/<\/head>/i,'<link rel="stylesheet" href="'+href+'"></head>');
 if(s!==old){writeFileSync(path,s);modified++}
 covered++;
}
console.log('Non-home chart control stylesheet: '+covered+' HTML destinations; '+modified+' updated; homepage untouched.');
