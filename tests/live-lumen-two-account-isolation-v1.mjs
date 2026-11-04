/* Real two-member account isolation. Requires separate QA passwords stored
 * exclusively as GitHub Actions secrets. Read only, with no private details logged. */
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const origin=process.env.SMFGU_QA_ORIGIN||'https://stock-market-from-the-ground-up-d1r.pages.dev';
const config=readFileSync('config.js','utf8');
const url=config.match(/SUPABASE_URL:\s*'([^']+)'/)?.[1];
const key=config.match(/SUPABASE_ANON_KEY:\s*'([^']+)'/)?.[1];
const users=[[process.env.LAB_QA_EMAIL,process.env.LAB_QA_PASSWORD],
 [process.env.LAB_QA_SECOND_EMAIL,process.env.LAB_QA_SECOND_PASSWORD]];
if(!url||!key||users.some(x=>!x[0]||!x[1]))
 throw Error('BLOCKED: Two genuine QA members require four configured GitHub Actions secrets');
const login=async([email,password])=>{
 const r=await fetch(url+'/auth/v1/token?grant_type=password',{method:'POST',
  headers:{apikey:key,'content-type':'application/json'},
  body:JSON.stringify({email,password}),signal:AbortSignal.timeout(25000)});
 const d=await r.json().catch(()=>({}));
 assert(r.ok&&d.access_token&&d.user?.id,'Genuine QA account authentication failed');
 return {id:d.user.id,token:d.access_token};
};
const [a,b]=await Promise.all(users.map(login));
assert.notEqual(a.id,b.id,'QA users must have different authentic Supabase IDs');
const get=async(user,path)=>{
 const r=await fetch(origin+path,{headers:{authorization:'Bearer '+user.token},
  cache:'no-store',signal:AbortSignal.timeout(35000)});
 assert.equal(r.status,200,'Authenticated wallet access failed: '+path.split('?')[0]);
 assert.match(r.headers.get('cache-control')||'',/private.*no-store/,
  'Private wallet cache controls are missing');
 const d=await r.json();
 assert.equal(d.ok,true);
 return d;
};
for(const [user,other] of [[a,b],[b,a]]){
 const balance=await get(user,'/api/member-lumen-integrity');
 assert.equal(balance.balanced,true,'Authoritative member wallet must reconcile');
 assert.deepEqual(await get(user,'/api/member-lumen-integrity?user_id='+other.id),balance,
  'Member cannot substitute a different wallet ID');
 const history=await get(user,'/api/member-lumen-activity');
 assert(Array.isArray(history.events),'Member history must be available');
 assert.deepEqual(await get(user,'/api/member-lumen-activity?user_id='+other.id),history,
  'Member cannot substitute a different wallet history ID');
 assert.equal((await get(user,'/api/member-lumen-gifts')).enabled,false,'V2 gifts remain disabled');
}
for(const path of ['/api/member-lumen-integrity','/api/member-lumen-activity','/api/member-lumen-gifts']){
 const r=await fetch(origin+path,{cache:'no-store',signal:AbortSignal.timeout(25000)});
 assert([401,403].includes(r.status()),'Anonymous private API must deny requests');
}
console.log('PASS: two real separate authenticated members and read-only wallet privacy.');
console.log('Verified ID-spoof rejection, balance integrity, history privacy and V2 gift deferral.');
console.log('No account credentials, IDs, balances, charges or wallet mutations logged.');
