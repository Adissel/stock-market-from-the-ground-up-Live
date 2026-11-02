/* Free, deterministic V2 sitemap security and canonical fixture tests. */
import assert from 'node:assert/strict';
import {mkdtempSync,writeFileSync,readFileSync,rmSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {buildPublicSitemapV2} from '../scripts/build-public-sitemap-v2.mjs';

const root=mkdtempSync(join(tmpdir(),'smfgu-sitemap-v2-'));
const origin='https://example.test';
const page=(url,robots='')=>'<!doctype html><html lang="en"><head><link rel="canonical" href="'+url+'">'+
 (robots?'<meta name="robots" content="'+robots+'">':'')+'</head><body>Original public education</body></html>';
const entries=[{path:'/',canonical:origin+'/'},{path:'/about',canonical:origin+'/about'}];
let passed=0;
const ok=(name,fn)=>{fn();passed++;console.log('PASS sitemap-v2 '+name)};
try{
 writeFileSync(join(root,'index.html'),page(origin+'/'));
 writeFileSync(join(root,'about.html'),page(origin+'/about'));
 const result=buildPublicSitemapV2({root,origin,pages:entries});
 ok('two actual canonical files and standard XML',()=>{
  assert.equal(result.count,2);
  assert.equal(readFileSync(join(root,'sitemap.xml'),'utf8'),result.xml);
  assert.match(result.xml,/^<\?xml version="1\.0" encoding="UTF-8"\?>\n<urlset xmlns="http:\/\/www\.sitemaps\.org\/schemas\/sitemap\/0\.9">/);
  assert.equal((result.xml.match(/<loc>/g)||[]).length,2);
  assert(result.xml.includes('<loc>'+origin+'/about</loc>'));
  assert(!/\.html<\/loc>|<lastmod>|<priority>|<changefreq>/.test(result.xml));
 });
 ok('duplicate canonical route fails closed',()=>{
  assert.throws(()=>buildPublicSitemapV2({root,origin,pages:[...entries,entries[1]]}),/Duplicate/);
 });
 ok('no admin, forum or member pages',()=>{
  for(const route of ['/admin','/dashboard','/account','/api/anything','/labs','/market-commons','/bootcamp-academy']){
   assert.throws(()=>buildPublicSitemapV2({root,origin,pages:[{path:route,canonical:origin+route}]}),/Private/);
  }
 });
 ok('redirected .html paths excluded',()=>{
  assert.throws(()=>buildPublicSitemapV2({root,origin,pages:[{path:'/about.html',canonical:origin+'/about.html'}]}),/extensionless/);
 });
 ok('missing static artifacts excluded',()=>{
  assert.throws(()=>buildPublicSitemapV2({root,origin,pages:[{path:'/absent',canonical:origin+'/absent'}]}),/absent/);
 });
 ok('mismatched or unverified canonical excluded',()=>{
  assert.throws(()=>buildPublicSitemapV2({root,origin,pages:[{path:'/about',canonical:origin+'/elsewhere'}]}),/match/);
 });
 ok('public pages marked noindex cannot be published',()=>{
  writeFileSync(join(root,'about.html'),page(origin+'/about','noindex,nofollow'));
  assert.throws(()=>buildPublicSitemapV2({root,origin,pages:entries}),/Noindex/);
  writeFileSync(join(root,'about.html'),page(origin+'/about'));
 });
 ok('invalid site origins rejected',()=>{
  for(const bad of ['http://example.test','https://example.test/other','https://example.test?x=1','https://user:pass@example.test']){
   assert.throws(()=>buildPublicSitemapV2({root,origin:bad,pages:entries}));
  }
 });
 ok('empty page inventory and cross-site canonical excluded',()=>{
  assert.throws(()=>buildPublicSitemapV2({root,origin,pages:[]}),/bounded/);
  assert.throws(()=>buildPublicSitemapV2({root,origin,pages:[{path:'/about',canonical:'https://other.test/about'}]}),/match/);
 });
 ok('stable, deterministic regenerated XML',()=>{
  const first=buildPublicSitemapV2({root,origin,pages:entries}).xml;
  assert.equal(buildPublicSitemapV2({root,origin,pages:entries}).xml,first);
 });
 console.log('PASS all '+passed+' independent sitemap-v2 gates');
}finally{rmSync(root,{recursive:true,force:true})}
