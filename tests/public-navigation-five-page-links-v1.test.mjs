import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync,existsSync} from 'node:fs';
import {resolve,sep} from 'node:path';
const pages=['index.html','store.html','labs.html','bootcamp-academy.html','dashboard.html'];
for(const page of pages){
 test(page+' has no unresolved local anchor destination',()=>{
  const html=readFileSync(page,'utf8');
  const anchors=[...html.matchAll(/<a\b[^>]*\bhref\s*=\s*["']([^"']+)["']/gi)].map(m=>m[1]);
  assert.ok(anchors.length>=4,'Expected visible navigation on '+page);
  let checked=0;
  for(const href of anchors){
   if(!href||href.startsWith('#')||/^(https?:|mailto:|tel:|sms:|data:|javascript:|\/\/)/i.test(href))continue;
   assert.ok(!href.includes('${'),'Unresolved template destination on '+page);
   const target=new URL(href,'https://site.example/'+page);
   if(target.origin!=='https://site.example')continue;
   const pathname=decodeURIComponent(target.pathname);
   assert.ok(!pathname.includes('..'),'Path traversal in '+page+' → '+href);
   const filename=pathname==='/'?'index.html':pathname.replace(/^\//,'');
   const absolute=resolve(filename);
   assert.ok(absolute.startsWith(resolve('.')+sep),'Navigation escapes repository: '+href);
   assert.ok(existsSync(absolute),'Broken local anchor on '+page+': '+href);
   checked++;
  }
  assert.ok(checked>=3,'No meaningful links verified on '+page);
 });
}
