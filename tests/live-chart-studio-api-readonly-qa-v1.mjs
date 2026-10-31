/**
 * Genuine Supabase Auth-backed, QA-only, READ-ONLY Chart Studio acceptance.
 * Expected identity James_Test is previously verified and holds a temporary
 * real Advanced Lumen pass. No account, wallet, payment, role, tier, workspace
 * or other-member data modification. Browser UI remains a separate gate.
 * Requires preexisting LAB_QA_EMAIL and LAB_QA_PASSWORD GitHub Secrets.
 */
import {readFileSync} from 'node:fs';
import assert from 'node:assert/strict';
const origin='https://stock-market-from-the-ground-up-d1r.pages.dev';
const expectedUser='f42f9301-18e6-43a3-8531-32d371fd22c1';
const expectedTier='ADVANCED';
const email=process.env.LAB_QA_EMAIL||'',password=process.env.LAB_QA_PASSWORD||'';
const cfg=readFileSync('config.js','utf8');
const sb=cfg.match(/SUPABASE_URL:\s*'([^']+)'/)?.[1];
const key=cfg.match(/SUPABASE_ANON_KEY:\s*'([^']+)'/)?.[1];
if(!email||!password||!sb||!key)throw Error('BLOCKED: existing QA credentials/config missing');
const request=async(url,init={})=>{
 const r=await fetch(url,{cache:'no-store',signal:AbortSignal.timeout(25000),...init});
 const body=await r.json().catch(()=>({}));
 return {status:r.status,body,cache:r.headers.get('cache-control')};
};
const authRequest=async (accessToken,path,init={})=>request(origin+path,{
 ...init,
 headers:{authorization:'Bearer '+accessToken,...init.headers}
});
const deniesGuest=(r)=>[401,403].includes(r.status)||
  (r.status===200&&r.body?.eligible===false);
try{
 const [guestTier,guestWorkspace]=await Promise.all([
  request(origin+'/api/chart-tier-access'),request(origin+'/api/chart-workspace')
 ]);
 assert(deniesGuest(guestTier),'Guest Chart entitlement request must not authorize');
 assert([401,403].includes(guestWorkspace.status),'Guest workspace access must be denied');
 const login=await request(sb+'/auth/v1/token?grant_type=password',{
  method:'POST',headers:{apikey:key,'content-type':'application/json'},body:JSON.stringify({email,password})
 });
 if(login.status!==200||!login.body?.access_token||!login.body?.refresh_token)
  throw Error('BLOCKED: real QA password sign-in not accepted; HTTP '+login.status+
   '. Do not disable CAPTCHA or impersonate session.');
 const actor=await request(sb+'/auth/v1/user',{
  headers:{apikey:key,authorization:'Bearer '+login.body.access_token}
 });
 assert.equal(actor.status,200,'Supabase must verify issued token');
 assert.equal(actor.body?.id,expectedUser,'Unexpected QA identity');
 assert.equal(login.body?.user?.id,expectedUser);
 const access=await authRequest(login.body.access_token,'/api/chart-tier-access');
 assert.equal(access.status,200,'Real member Chart tier API unavailable');
 assert.equal(access.body?.ok,true);
 assert.equal(access.body?.eligible,true);
 assert.equal(access.body?.tier,expectedTier,'Expected real Advanced Lumen pass');
 assert.deepEqual(access.body.allowed,['STANDARD','ADVANCED'],'Actual tier allows unexpected engines');
 assert.equal(access.body.ownerChartAccess,false,'QA user cannot be Owner override');
 assert.equal(access.body.staffChartRole,null,'QA user cannot receive staff override');
 assert.equal(access.body.qaTierCeiling?.active,false,
  'Unexpected restrictive QA override; this test must verify the real active pass');
 assert.equal(access.body.temporaryAccess?.kind,'SPARKS',
  'Expected existing single-wallet temporary chart pass, not simulated QA ceiling');
 assert(access.body.temporaryAccess?.expiresAt,'Missing pass expiry');
 assert(Date.parse(access.body.temporaryAccess.expiresAt)>Date.now(),'Pass has expired');
 const first=await authRequest(login.body.access_token,'/api/chart-workspace');
 assert.equal(first.status,200,'Real private workspace inaccessible');
 assert.equal(first.body?.ok,true);
 assert.equal(first.body?.tier,expectedTier);
 assert.equal(first.body?.workspace?.selected,'ADVANCED',
  'Saved former Professional engine must be projected to a safe allowed layout');
 assert.equal(typeof first.body?.updatedAt,'string','Expected existing saved QA workspace');
 assert(/private/.test(first.cache||'')&&/no-store/.test(first.cache||''),
  'Member-private workspace must not be shared-cacheable');
 const forged=await authRequest(login.body.access_token,
  '/api/chart-workspace?user_id=00000000-0000-4000-8000-000000000000');
 assert.equal(forged.status,200);
 assert.deepEqual(forged.body?.workspace,first.body.workspace,
  'Query parameter must never select another member workspace');
 assert.equal(forged.body?.updatedAt,first.body.updatedAt);
 // Negative PUT paths must reject BEFORE storage RPC and never alter settings.
 const forbidden=await authRequest(login.body.access_token,'/api/chart-workspace',{
  method:'PUT',headers:{origin:'https://untrusted.example','content-type':'application/json'},
  body:JSON.stringify({selected:'PROFESSIONAL',expectedUpdatedAt:first.body.updatedAt})
 });
 assert.equal(forbidden.status,403,'Foreign-origin workspace write must be rejected');
 const stale=await authRequest(login.body.access_token,'/api/chart-workspace',{
  method:'PUT',headers:{origin, 'content-type':'application/json'},
  body:JSON.stringify({selected:'PROFESSIONAL'})
 });
 assert.equal(stale.status,409,'Missing CAS revision must be rejected');
 const refresh=await request(sb+'/auth/v1/token?grant_type=refresh_token',{
  method:'POST',headers:{apikey:key,'content-type':'application/json'},
  body:JSON.stringify({refresh_token:login.body.refresh_token})
 });
 assert.equal(refresh.status,200,'Genuine QA session refresh failed');
 assert(refresh.body?.access_token,'Refresh grant returned no access token');
 const identity=await request(sb+'/auth/v1/user',{
  headers:{apikey:key,authorization:'Bearer '+refresh.body.access_token}
 });
 assert.equal(identity.status,200);
 assert.equal(identity.body?.id,expectedUser,'Refreshed credential changed member');
 const second=await authRequest(refresh.body.access_token,'/api/chart-workspace');
 assert.equal(second.status,200);
 assert.equal(second.body?.tier,expectedTier);
 assert.deepEqual(second.body.workspace,first.body.workspace,
  'Workspace changed across authenticated token refresh');
 assert.equal(second.body.updatedAt,first.body.updatedAt,'Workspace revision changed without authorized save');
 console.log('PASS PRODUCTION signed-in Chart Studio Advanced tier, guest denial, staff exclusion, workspace projection and reload');
 console.log('PASS forged user selector ignored, foreign Origin 403, missing revision 409, refreshed user continuity');
 console.log('RESULT '+JSON.stringify({
  status:'AUTHENTICATED_CHART_API_READ_ONLY_PASS',
  sourceSha:process.env.GITHUB_SHA||'LOCAL',
  checkedUtc:new Date().toISOString(),
  expectedTier:'ADVANCED',memberRole:'QA_FREE_BASELINE',
  savedWorkspaceReopened:true,workspaceWritePerformed:false,
  providerChargePerformed:false,tokenExposed:false,
  notAccepted:['Actual member browser UI and CAPTCHA','Second live account isolation',
   'Full Standard and Professional authenticated tier matrix','New workspace save/revision CAS success',
   'Independent source licensing']
 }));
}catch(error){
 console.error('FAIL_OR_BLOCKED real Chart Studio API QA: '+String(error?.message||error).slice(0,400));
 process.exitCode=1;
}