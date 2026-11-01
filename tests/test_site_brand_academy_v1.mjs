/* Academy site branding regression: no book-series change or entitlements. */
import assert from 'node:assert/strict';
import {mkdtempSync,mkdirSync,writeFileSync,readFileSync,rmSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {spawnSync} from 'node:child_process';
const root=mkdtempSync(join(tmpdir(),'gu-academy-brand-'));
try{
 mkdirSync(join(root,'assets','css'),{recursive:true});
 writeFileSync(join(root,'assets','css','site-brand-academy-v1.css'),'/* fixture */');
 const header='<header class="site-header"><a class="brand" href="index.html">THE STOCK MARKET: <span>FROM THE GROUND UP</span></a></header>';
 const html=body=>'<!doctype html><html lang="en"><head><title>Books unchanged</title></head><body>'+body+'</body></html>';
 writeFileSync(join(root,'index.html'),html(header+'<main><p>Book series: THE STOCK MARKET: FROM THE GROUND UP.</p></main>'));
 writeFileSync(join(root,'dashboard.html'),html(header+'<main>Private member progress</main>'));
 writeFileSync(join(root,'other.html'),html('<header><a class="brand" href="/other">Different product</a></header>'));
 const invoke=()=>spawnSync(process.execPath,['scripts/build-site-brand-academy-v1.mjs'],{
  cwd:process.cwd(),encoding:'utf8',env:{...process.env,GU_SITE_BUILD_DIR:root}});
 assert.equal(invoke().status,0,'First academy build must succeed');
 const first=readFileSync(join(root,'index.html'),'utf8');
 const member=readFileSync(join(root,'dashboard.html'),'utf8');
 assert.match(first,/gu-academy-brand-title/);
 assert.match(first,/gu-academy-brand-subtitle">Learning Academy<\/span>/);
 assert.match(member,/gu-academy-brand-subtitle">Learning Academy<\/span>/);
 assert.equal((first.match(/site-brand-academy-v1\.css/g)||[]).length,1);
 assert.equal((first.match(/gu-academy-brand-subtitle/g)||[]).length,1);
 assert.match(first,/Book series: THE STOCK MARKET: FROM THE GROUND UP/);
 assert.match(first,/href="index.html"/);
 assert.match(member,/Private member progress/);
 assert.doesNotMatch(readFileSync(join(root,'other.html'),'utf8'),/Learning Academy/);
 assert.equal(invoke().status,0,'Rebuild must remain idempotent');
 assert.equal(readFileSync(join(root,'index.html'),'utf8'),first);
 const source=readFileSync('index.html','utf8');
 const seo=readFileSync('scripts/build-public-seo.mjs','utf8');
 const build=readFileSync('scripts/build-pages.sh','utf8');
 const css=readFileSync('assets/css/site-brand-academy-v1.css','utf8');
 assert.match(source,/<span class="gu-academy-brand-subtitle">Learning Academy<\/span>/);
 assert.match(seo,/name:'The Stock Market: From the Ground Up — Learning Academy'/);
 assert.ok(build.includes('node scripts/build-site-brand-academy-v1.mjs'));
 assert.ok(build.indexOf('node scripts/build-site-brand-academy-v1.mjs')<build.indexOf('node scripts/build-public-seo.mjs'));
 assert.match(css,/@media\(max-width:390px\)/);
 assert.match(css,/:focus-visible/);
 console.log('PASS Academy site subtitle: semantic desktop/mobile header, homepage, metadata, idempotence and unchanged protected/member/book content.');
}finally{rmSync(root,{recursive:true,force:true});}
