/* Two-member production isolation proof using pre-existing encrypted QA secrets.
 * No entitlement, wallet, payment or workspace mutations. Genuine GoTrue sessions.
 * Fails BLOCKED if the second distinct QA identity is not configured.
 */
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createHmac,randomUUID} from 'node:crypto';
const origin='https://stock-market-from-the-ground-up-d1r.pages.dev';
const cfg=readFileSync('config.js','utf8');
const url=cfg.match(/SUPABASE_URL:\s*'([^']+)'/)?.[1];
const key=cfg.match(/SUPABASE_ANON_KEY:\s*'([^']+)'/)?.[1];
assert(url&&key,'Missing public Supabase config');
const explicitSecond=!!(process.env.LAB_QA_SECOND_EMAIL&&process.env.LAB_QA_SECOND_PASSWORD);
const secondaryPassword=explicitSecond?process.env.LAB_QA_SECOND_PASSWORD:
 process.env.LAB_QA_PASSWORD?createHmac('sha256',process.env.LAB_QA_PASSWORD)
 .update('smfgu:isolated-second-qa:2026-10-31:v1').digest('hex')+'Qa2!':'';
const members=[
 {label:'ADVANCED',email:process.env.LAB_QA_EMAIL,password:process.env.LAB_QA_PASSWORD,expected:'ADVANCED'},
 {label:'SECOND',email:explicitSecond?process.env.LAB_QA_SECOND_EMAIL:
  'stockmarketfromthegroundup+smfgu-qa2v1@gmail.com',password:secondaryPassword,expected:'STANDARD'}
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

for(const endpoint of ['/api/member-learning-quick-view','/api/member-lumen-activity','/api/member-lumen-integrity']){
 const ownA=await get(a,endpoint),ownB=await get(b,endpoint);
 assert.equal(ownA.status,200,'Member A private endpoint unavailable');
 assert.equal(ownB.status,200,'Member B private endpoint unavailable');
 assert.equal(ownA.body?.ok,true);assert.equal(ownB.body?.ok,true);
 if(endpoint.endsWith('integrity')){
  assert.equal(ownA.body.balanced,true,'Member A wallet must reconcile on server');
  assert.equal(ownB.body.balanced,true,'Member B wallet must reconcile on server');
  assert.equal(ownA.body.discrepancyCount,0);
  assert.equal(ownB.body.discrepancyCount,0);
 }
 const fakeA=await get(a,endpoint+'?user_id='+encodeURIComponent(b.uid));
 const fakeB=await get(b,endpoint+'?user_id='+encodeURIComponent(a.uid));
 assert.equal(fakeA.status,200);assert.equal(fakeB.status,200);
 assert.deepEqual(fakeA.body,ownA.body,'Member A read another member\'s learning/wallet records');
 assert.deepEqual(fakeB.body,ownB.body,'Member B read another member\'s learning/wallet records');
 const guest=await req(origin+endpoint);assert([401,403].includes(guest.status));
}

/* Genuine production gift-gate QA: zero transfers, zero writes, two separate
 * member tokens and mandatory recipient-consent/release restriction. */
for(const [actor,recipient] of [[a,b],[b,a]]){
 const start=await get(actor,'/api/member-lumen-integrity');
 assert.equal(start.status,200);
 assert.equal(start.body?.balanced,true);
 const policy=await get(actor,'/api/member-lumen-gifts');
 assert.equal(policy.status,200);
 assert.equal(policy.body?.enabled,false,'Gifting must remain disabled');
 const hidden=await get(actor,'/api/member-lumen-gifts?handle=@QA_Secondary');
 assert.equal(hidden.status,409,'Recipient lookup must be unavailable before release');
 const attempt=await req(origin+'/api/member-lumen-gifts',{
  method:'POST',headers:{authorization:'Bearer '+actor.token,origin,
   'content-type':'application/json'},
  body:JSON.stringify({action:'send',recipient:actor.uid===a.uid?'@QA_Secondary':'@James_Test',
   lumens:10,requestId:randomUUID()})});
 assert.equal(attempt.status,409,'Transfer must fail closed when not legally/security released');
 const optin=await req(origin+'/api/member-lumen-gifts',{
  method:'POST',headers:{authorization:'Bearer '+actor.token,origin,
   'content-type':'application/json'},
  body:JSON.stringify({action:'optin',discoverable:true,receivingEnabled:true})});
 assert.equal(optin.status,409,'No recipient enrollment before gifting release');
 const end=await get(actor,'/api/member-lumen-integrity');
 assert.equal(end.status,200);
 assert.deepEqual(end.body,start.body,'Disabled gift request must not change wallet or credit history');
}
const guestGift=await req(origin+'/api/member-lumen-gifts');
assert([401,403].includes(guestGift.status));
console.log('PASS two real member sessions: gifting disabled, private lookup denied, consent/transfer denied, balances unchanged, guests denied.');
console.log('PASS two real users: private learning progress and Lumen activity scoped to authenticated actor, forged selectors ignored.');
console.log('PASS real two-member cross-account Chart Studio API isolation and exact Standard/Advanced entitlements');
console.log('RESULT '+JSON.stringify({scope:'REAL_DISTINCT_GOTRUE_TOKENS',actors:2,
 tiers:[members[1].expected,'ADVANCED'],foreignAccountSelectorDenied:true,
 crossUserPrivateWorkspaceLeak:false,productionWrites:0,at:new Date().toISOString()}));
