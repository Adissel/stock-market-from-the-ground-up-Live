/* Two-member production isolation proof using pre-existing encrypted QA secrets.
 * No entitlement, wallet, payment or workspace mutations. Genuine GoTrue sessions.
 * Fails BLOCKED if the second distinct QA identity is not configured.
 */
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const origin='https://stock-market-from-the-ground-up-d1r.pages.dev';
const cfg=readFileSync('config.js','utf8');
const url=cfg.match(/SUPABASE_URL:\s*'([^']+)'/)?.[1];
const key=cfg.match(/SUPABASE_ANON_KEY:\s*'([^']+)'/)?.[1];
assert(url&&key,'Missing public Supabase config');
const members=[
 {label:'ADVANCED',email:process.env.LAB_QA_EMAIL,password:process.env.LAB_QA_PASSWORD,expected:'ADVANCED'},
 {label:'SECOND',email:process.env.LAB_QA_SECOND_EMAIL||process.env.CROWN_QA_FREE_EMAIL||process.env.CROWN_QA_FOUNDING_60_EMAIL,
  password:process.env.LAB_QA_SECOND_PASSWORD||process.env.CROWN_QA_FREE_PASSWORD||process.env.CROWN_QA_FOUNDING_60_PASSWORD,
  expected:process.env.LAB_QA_SECOND_EMAIL||process.env.CROWN_QA_FREE_EMAIL?'STANDARD':'PROFESSIONAL'}
];
for(const item of members)if(!item.email||!item.password)
 throw Error('BLOCKED: Missing second independent QA credential pair. No cross-account acceptance claimed.');
async function req(resource,init={}){
 const r=await fetch(resource,{...init,cache:'no-store',signal:AbortSignal.timeout(25000)});
 return {status:r.status,cache:r.headers.get('cache-control'),body:await r.json().catch(()=>({}))};
}
async function login(item){
 const grant=await req(url+'/auth/v1/token?grant_type=password',{
  method:'POST',headers:{apikey:key,'content-type':'application/json'},
  body:JSON.stringify({email:item.email,password:item.password})});
 assert.equal(grant.status,200,'Real '+item.label+' QA sign-in required');
 assert(grant.body?.access_token&&grant.body?.user?.id);
 const user=await req(url+'/auth/v1/user',{headers:{
  apikey:key,authorization:'Bearer '+grant.body.access_token}});
 assert.equal(user.status,200);
 assert.equal(user.body.id,grant.body.user.id);
 return {label:item.label,expected:item.expected,uid:user.body.id,token:grant.body.access_token};
}
const a=await login(members[0]),b=await login(members[1]);
assert.notEqual(a.uid,b.uid,'Two distinct GoTrue users required');
assert.equal(a.uid,'f42f9301-18e6-43a3-8531-32d371fd22c1');
async function get(actor,path){
 return req(origin+path,{headers:{authorization:'Bearer '+actor.token}});
}
const data=new Map();
for(const actor of [a,b]){
 const tier=await get(actor,'/api/chart-tier-access');
 assert.equal(tier.status,200);
 assert.equal(tier.body.tier,actor.expected,'Unexpected live member entitlement');
 assert.deepEqual(tier.body.allowed,actor.expected==='ADVANCED'?['STANDARD','ADVANCED']:
  actor.expected==='PROFESSIONAL'?['STANDARD','ADVANCED','PROFESSIONAL']:['STANDARD']);
 const workspace=await get(actor,'/api/chart-workspace');
 assert.equal(workspace.status,200);
 assert.equal(workspace.body.ok,true);
 assert.equal(workspace.body.tier,actor.expected);
 assert.match(workspace.cache||'',/no-store/);
 data.set(actor.uid,workspace.body);
 const foreign=[a,b].find(x=>x.uid!==actor.uid);
 const attempt=await get(actor,'/api/chart-workspace?user_id='+encodeURIComponent(foreign.uid)+
  '&member_id='+encodeURIComponent(foreign.uid));
 assert.equal(attempt.status,200);
 assert.deepEqual(attempt.body.workspace,workspace.body.workspace);
 assert.equal(attempt.body.updatedAt,workspace.body.updatedAt);
}
assert.equal(data.get(a.uid).workspace.selected,'ADVANCED');
assert.deepEqual(data.get(a.uid).workspace.studies,['EMA','RSI']);
assert(data.get(a.uid).updatedAt,'Original QA workspace revision must exist');
assert.notEqual(data.get(b.uid).updatedAt,data.get(a.uid).updatedAt,
 'Different member must not receive original workspace revision');
const guest=await req(origin+'/api/chart-workspace');
assert([401,403].includes(guest.status));

for(const endpoint of ['/api/member-learning-quick-view','/api/member-lumen-activity']){
 const ownA=await get(a,endpoint),ownB=await get(b,endpoint);
 assert.equal(ownA.status,200,'Member A private endpoint unavailable');
 assert.equal(ownB.status,200,'Member B private endpoint unavailable');
 assert.equal(ownA.body?.ok,true);assert.equal(ownB.body?.ok,true);
 const fakeA=await get(a,endpoint+'?user_id='+encodeURIComponent(b.uid));
 const fakeB=await get(b,endpoint+'?user_id='+encodeURIComponent(a.uid));
 assert.equal(fakeA.status,200);assert.equal(fakeB.status,200);
 assert.deepEqual(fakeA.body,ownA.body,'Member A read another member\'s learning/wallet records');
 assert.deepEqual(fakeB.body,ownB.body,'Member B read another member\'s learning/wallet records');
 const guest=await req(origin+endpoint);assert([401,403].includes(guest.status));
}
console.log('PASS two real users: private learning progress and Lumen activity scoped to authenticated actor, forged selectors ignored.');
console.log('PASS real two-member cross-account Chart Studio API isolation and exact Standard/Advanced entitlements');
console.log('RESULT '+JSON.stringify({scope:'REAL_DISTINCT_GOTRUE_TOKENS',actors:2,
 tiers:[members[1].expected,'ADVANCED'],foreignAccountSelectorDenied:true,
 crossUserPrivateWorkspaceLeak:false,productionWrites:0,at:new Date().toISOString()}));
