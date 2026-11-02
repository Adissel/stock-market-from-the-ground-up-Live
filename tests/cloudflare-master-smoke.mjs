import assert from 'node:assert/strict';
const origin='https://stock-market-from-the-ground-up-d1r.pages.dev';
const oldOrigin='https://stock-market-from-the-ground-up.pages.dev';
const expectedSitekey='0x4AAAAAAFlx7GxnPwFqJCMc';
const results={origin,passed:[],blocked:[],failures:[],livePaymentOperations:0};
async function get(path){
 const url=new URL(path,origin);
 assert.equal(url.origin,origin);
 const r=await fetch(url,{method:'GET',redirect:'manual',cache:'no-store',
  headers:{'accept':'*/*'},signal:AbortSignal.timeout(18000)});
 return {r,t:await r.text()};
}
async function check(name,path,status,fn){
 try{
  const {r,t}=await get(path);
  assert.equal(r.status,status,'HTTP '+r.status+' expected '+status);
  if(fn)fn(t,r);
  results.passed.push(name);
 }catch(e){results.failures.push({name,error:String(e.message||e)})}
}
// Cloudflare's native GitHub deployment is eventually consistent with Pages build env changes.
let ready=false;
for(let i=0;i<16;i++){
 try{
  const [home,auth]=await Promise.all([get('/'),get('/api/auth-guard-v0135')]);
  ready=home.r.status===200&&home.t.includes('https://stock-market-from-the-ground-up-d1r.pages.dev/')
    &&auth.r.status===200&&JSON.parse(auth.t).sitekey===expectedSitekey;
  if(ready)break;
 }catch{}
 if(i!==15)await new Promise(r=>setTimeout(r,7000));
}
if(!ready)results.failures.push({name:'master configuration propagation',error:'Master canonical or Turnstile site key not deployed'});
for(const [name,path,match] of [
 ['homepage','/','The Stock Market: From the Ground Up'],
 ['store','/store','Memberships'],
 ['labs','/labs','419'],
 ['boot camp academy','/bootcamp-academy','Boot Camp Academy']
])await check(name,path,200,t=>assert.ok(t.includes(match),'Missing expected site content'));
await check('home canonical master domain','/',200,t=>{
 assert.match(t,/<link[^>]*rel=["']canonical["'][^>]*href=["']https:\/\/stock-market-from-the-ground-up-d1r\.pages\.dev\//i);
});
await check('sitemap valid XML and canonical master domain','/sitemap.xml',200,(t,r)=>{
 assert.match(r.headers.get('content-type')||'',/^(application|text)\/xml\\b/i,'Sitemap must be served as XML');
 assert.match(t,/^<\\?xml version="1\\.0" encoding="UTF-8"\\?>\\s*<urlset xmlns="http:\/\/www\\.sitemaps\\.org\/schemas\/sitemap\/0\\.9">/);
 assert.match(t,/<\\/urlset>\\s*$/);
 assert.doesNotMatch(t,/<html\\b|<!DOCTYPE|<script\\b/i,'Sitemap must not be an HTML fallback');
 const entries=[...t.matchAll(/<url>\\s*<loc>([^<]+)<\\/loc>\\s*<\\/url>/g)].map(m=>m[1]);
 assert.ok(entries.length>=1,'Sitemap must include at least one public URL');
 assert.ok(entries.includes(origin+'/'),'Homepage must be indexed');
 assert.equal((t.match(/<url>/g)||[]).length,entries.length,'Every URL entry must have one loc');
 assert.equal((t.match(/<loc>/g)||[]).length,entries.length,'No malformed loc elements');
 assert.equal(new Set(entries).size,entries.length,'Duplicate sitemap URLs');
 for(const entry of entries){
  const u=new URL(entry);assert.equal(u.origin,origin,'Off-domain canonical sitemap URL');
  assert.equal(u.protocol,'https:');assert.equal(u.username,'');assert.equal(u.password,'');
  assert.equal(u.search,'');assert.equal(u.hash,'');
  assert.doesNotMatch(u.pathname,/^\\/(api|admin|dashboard|account|journal|simulator)(\\/|$)/i,'Private sitemap URL');
 }
 assert.ok(!t.includes(oldOrigin+'/'),'Old canonical hostname must not appear');
});
await check('robots sitemap master domain','/robots.txt',200,(t,r)=>{
 assert.match(r.headers.get('content-type')||'',/^text\/plain\\b/i);
 const sitemapDirectives=t.split(/\\r?\\n/).filter(line=>/^Sitemap:/i.test(line.trim()));
 assert.deepEqual(sitemapDirectives,['Sitemap: '+origin+'/sitemap.xml'],'robots.txt must advertise exactly the production sitemap');
});
await check('Pages health','/api/runtime-health-v014259',200,t=>{
 const j=JSON.parse(t);assert.equal(j.ok,true);assert.equal(j.readOnly,true);
});
await check('Pages edge probe','/api/edge-probe-v014266',200,t=>{
 const j=JSON.parse(t);assert.equal(j.ok,true);
});
await check('new Turnstile site key only','/api/auth-guard-v0135',200,t=>{
 const j=JSON.parse(t);assert.equal(j.ok,true);assert.equal(j.enabled,true);
 assert.equal(j.sitekey,expectedSitekey);assert.equal(j.secret,undefined);
});
for(const path of ['/.git/config','/.mcp.json','/supabase/migrations/private.sql','/workers/billing-scheduler.js']){
 await check('private path hidden '+path,path,404);
}
for(const [path,code] of [['/api/gu39-stripe-webhook',405],['/api/stripe-live-webhook',405],
 ['/api/admin-prelive-v014247',401],['/api/owner-zero-live-checkout',401],
 ['/api/gu39-sandbox',401]]){
 await check('safe HTTP rejection '+path,path,code);
}
await check('zero-monthly LIVE QA closed','/api/store-zero-monthly-qa',200,t=>{
 const j=JSON.parse(t);assert.equal(j.available,false);assert.equal(j.offerClosed,true);
});
await check('public config excludes secret values','/config.js',200,t=>{
 for(const re of [/sb_secret_/i,/sk_live_/i,/sk_test_/i,/whsec_/i,/SUPABASE_SECRET_KEY\s*:/i])
  assert.doesNotMatch(t,re);
});
// Server credential is now present: the public advertising backend must read
// exactly the three approved package records without exposing payments.
await check('advertising Supabase integration (GET only)','/api/ad-sales',200,t=>{
 const j=JSON.parse(t);
 assert.equal(j.ok,true);
 assert.equal(j.onlineCheckoutEnabled,false);
 assert.equal(j.turnstileSiteKey,expectedSitekey);
 assert.equal(j.acceptingInquiries,true);
 assert.ok(Array.isArray(j.packages));
 assert.deepEqual(j.packages.map(p=>p.code).sort(),
  ['RESOURCE_SPONSOR','SECTION_SPONSOR','SITE_SPONSOR']);
 assert.ok(j.packages.every(p=>p.public_visible===true));
});
console.log(JSON.stringify({origin,passed:results.passed.length,blocked:results.blocked,
 failures:results.failures,livePaymentOperations:0},null,2));
if(results.failures.length)process.exitCode=1;
