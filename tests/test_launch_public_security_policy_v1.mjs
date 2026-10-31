// SMFGU launch readiness: production, anonymous-only, noncharging boundary.
// No private credentials, Stripe actions, member impersonation, or modifications.
import assert from 'node:assert/strict';
const origin='https://stock-market-from-the-ground-up-d1r.pages.dev';
const tools=['INTERACTIVE_LEARNING','JOURNAL_ANALYTICS','MARKET_SIMULATOR','MARKET_TUTOR'];
const publicPages=['/terms.html','/refund-policy.html','/subscription-terms.html',
 '/privacy.html','/digital-books-terms.html','/founding-600-terms.html'];
const failures=[];
async function probe(path){
 const url=new URL(path,origin);
 const response=await fetch(url,{method:'GET',redirect:'follow',headers:{'accept':'application/json, text/html;q=0.9'},
  signal:AbortSignal.timeout(20000),cache:'no-store'});
 const final=new URL(response.url);
 if(final.origin!==url.origin)throw Error('Unexpected cross-origin redirect '+final.origin);
 return {status:response.status,finalPath:final.pathname,contentType:response.headers.get('content-type')||'',body:(await response.text()).slice(0,900)};
}
for(const tool of tools){
 try{
  const path='/api/member-tool-access?tool='+encodeURIComponent(tool);
  const r=await probe(path);
  if(r.status!==401||!/sign.?in|invalid session/i.test(r.body))throw Error('expected authenticated gate 401, got '+r.status+'; '+r.body.slice(0,170));
  console.log('PASS: anonymous '+tool+' denied (HTTP '+r.status+')');
 }catch(e){failures.push(tool+': '+String(e.message||e))}
}
for(const path of publicPages){
 try{
  const r=await probe(path);
  if(r.status!==200||!r.contentType.includes('text/html')||!/<html|<!doctype/i.test(r.body)||!r.finalPath.toLowerCase().includes(path.replace('.html','').slice(1)))
   throw Error('expected HTML 200, got '+r.status+' ('+r.contentType+')');
  console.log('PASS: public legal page '+path+' -> '+r.finalPath+' (HTTP 200)');
 }catch(e){failures.push(path+': '+String(e.message||e))}
}
if(failures.length){
 for(const f of failures)console.error('FAIL:',f);
 process.exitCode=1;
}else console.log('PASS: 4 production tool authorization gates + 6 public policy pages; no payment or member state changed.');
