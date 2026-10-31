/* Real, noncommercial, two-identity Chart Studio privacy acceptance.
 * Manual GitHub Actions invocation only; never creates users or entitlements.
 * Requires two separate existing Supabase Auth member password credentials in
 * encrypted GitHub secrets. No username/password/token is printed. No writes.
 */
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const origin='https://stock-market-from-the-ground-up-d1r.pages.dev';
const primaryEmail=process.env.LAB_QA_EMAIL||'';
const primaryPassword=process.env.LAB_QA_PASSWORD||'';
const secondEmail=process.env.LAB_QA_SECOND_EMAIL||'';
const secondPassword=process.env.LAB_QA_SECOND_PASSWORD||'';
if(!primaryEmail||!primaryPassword||!secondEmail||!secondPassword)
 throw Error('BLOCKED: two separate existing QA login secret pairs are required. No second identity will be simulated.');
const config=readFileSync('config.js','utf8');
const url=config.match(/SUPABASE_URL:\s*'([^']+)'/)?.[1];
const publicKey=config.match(/SUPABASE_ANON_KEY:\s*'([^']+)'/)?.[1];
assert(url&&publicKey,'Public Supabase Auth config missing');
const make=async (target,headers={})=>{
 const r=await fetch(target,{headers,cache:'no-store',signal:AbortSignal.timeout(26000)});
 return {status:r.status,body:await r.json().catch(()=>({})),headers:r.headers};
};
async function login(email,password){
 const r=await fetch(url+'/auth/v1/token?grant_type=password',{
  method:'POST',headers:{apikey:publicKey,'content-type':'application/json'},
  body:JSON.stringify({email,password}),cache:'no-store',signal:AbortSignal.timeout(26000)
 });
 const b=await r.json().catch(()=>({}));
 if(r.status!==200||!b.access_token||!b.user?.id)
  throw Error('BLOCKED: genuine Supabase QA sign-in denied HTTP '+r.status+
   '; use normal authorized credentials, never bypass CAPTCHA or grant roles');
 const check=await make(url+'/auth/v1/user',{
  apikey:publicKey,authorization:'Bearer '+b.access_token
 });
 assert.equal(check.status,200,'Auth endpoint must independently verify the issued token');
 assert.equal(check.body.id,b.user.id);
 return {token:b.access_token,id:b.user.id};
}
const a=await login(primaryEmail,primaryPassword);
const b=await login(secondEmail,secondPassword);
assert.notEqual(a.id,b.id,'Two independent Auth users are mandatory: reused account is not isolation');
const get=async (actor,path)=>make(origin+path,{
 authorization:'Bearer '+actor.token
});
const guest=await make(origin+'/api/chart-workspace');
assert([401,403].includes(guest.status),'Guest workspace data exposed');
const [aTier,bTier]=await Promise.all([
 get(a,'/api/chart-tier-access'),
 get(b,'/api/chart-tier-access')
]);
assert.equal(aTier.status,200);
assert.equal(aTier.body?.eligible,true);
assert.equal(bTier.status,200);
assert.equal(bTier.body?.eligible,true,
 'Second QA identity must be a genuinely eligible member before comparing workspaces');
const [ownA,ownB]=await Promise.all([
 get(a,'/api/chart-workspace'),get(b,'/api/chart-workspace')
]);
assert.equal(ownA.status,200);
assert.equal(ownB.status,200);
assert.equal(ownA.body?.ok,true);
assert.equal(ownB.body?.ok,true);
assert.equal(ownA.body?.tier,aTier.body?.tier);
assert.equal(ownB.body?.tier,bTier.body?.tier);
const [bTryA,aTryB]=await Promise.all([
 get(b,'/api/chart-workspace?user_id='+encodeURIComponent(a.id)+
  '&member_id='+encodeURIComponent(a.id)),
 get(a,'/api/chart-workspace?user_id='+encodeURIComponent(b.id)+
  '&member_id='+encodeURIComponent(b.id))
]);
assert.equal(bTryA.status,200);
assert.equal(aTryB.status,200);
assert.deepEqual(bTryA.body,ownB.body,
 'A real second member switched the server ownership query to member A');
assert.deepEqual(aTryB.body,ownA.body,
 'Member A switched the server ownership query to member B');
const [directA,directB]=await Promise.all([
 make(url+'/rest/v1/crownlight_chart_workspaces_v1?select=settings%2Cuser_id&limit=2',{
  apikey:publicKey,authorization:'Bearer '+a.token}),
 make(url+'/rest/v1/crownlight_chart_workspaces_v1?select=settings%2Cuser_id&limit=2',{
  apikey:publicKey,authorization:'Bearer '+b.token})
]);
for(const direct of [directA,directB]){
 assert([401,403].includes(direct.status)||
  direct.status===200&&Array.isArray(direct.body)&&direct.body.length===0,
  'Direct authenticated Data API disclosed member-private chart settings');
}
const caps=[aTier.body?.tier,bTier.body?.tier];
assert(caps.every(t=>['STANDARD','ADVANCED','PROFESSIONAL'].includes(t)),
 'Both Chart tier decisions must be resolved by live server');
console.log('PASS genuine two-account Supabase Auth, separate user IDs, respective server Chart tiers and workspace snapshots');
console.log('PASS both directions forged user_id/member_id ignored; direct table reads denied; guest denied; no writes');
console.log('RESULT '+JSON.stringify({
 status:'REAL_TWO_MEMBER_CHART_WORKSPACE_READ_ONLY_ISOLATION_PASS',
 testedCommit:process.env.GITHUB_SHA||'LOCAL_SOURCE_SHA_REQUIRED',
 time:new Date().toISOString(),
 distinctAuthenticatedMembers:2,
 actualTierA:caps[0],actualTierB:caps[1],
 noCredentialsLogged:true,privateWorkspaceWrites:0,
 enrollmentOrRoleChanges:0,paymentOrLumenWrites:0,
 notCovered:['Member-initiated workspace save revision CAS','Interactive CAPTCHA form',
  'All tier matrix combinations','Revoked and suspended user behavior',
  'Second account browser visual testing']
}));
