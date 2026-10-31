/* Read-only live anonymous HTTP privacy acceptance.
 * Uses no secrets, cookies, paying services, or authenticated user identities.
 */
import assert from 'node:assert/strict';
const base=process.env.PT_LIVE_BASE||'https://stock-market-from-the-ground-up-d1r.pages.dev';
const get=async path=>{
 const response=await fetch(new URL(path,base),{redirect:'manual',headers:{accept:'text/html,application/json'},cache:'no-store',signal:AbortSignal.timeout(20000)});
 const body=await response.text();
 return {status:response.status,headers:response.headers,body};
};
const page=await get('/prototype.html');
assert.equal(page.status,200,'anonymous navigation must display the public access launcher, never the internal application');
assert.match(page.body,/prototype-bootstrap-v3\.js/);
assert.doesNotMatch(page.body,/id="pt-app"/);
assert.doesNotMatch(page.body,/id="pt-nav"/);
assert.match(page.headers.get('cache-control')||'',/no-store/i);
assert.match(page.headers.get('x-robots-tag')||'',/noindex/i);
const alias=await get('/prototype');
assert.equal(alias.status,200);
assert.doesNotMatch(alias.body,/id="pt-app"/);
for(const path of ['/api/prototype-document','/api/prototype-training-cases']){
 const response=await get(path);
 assert.equal(response.status,401,path+' must require valid authentication');
 assert.match(response.headers.get('cache-control')||'',/no-store/i);
 assert.doesNotMatch(response.body,/id="pt-app"|Fictional VWAP reclaim at a decision boundary/);
}
const head=await fetch(new URL('/prototype.html',base),{method:'HEAD',redirect:'manual',signal:AbortSignal.timeout(20000)});
assert.equal(head.status,200);
assert.match(head.headers.get('cache-control')||'',/no-store/i);
console.log('PASS live public HTTP: only anonymous access launcher served; protected source and fictional API return 401; no-store and noindex confirmed.');
