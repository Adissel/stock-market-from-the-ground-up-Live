/**
 * Genuine human-authenticated Chart Studio read-only acceptance.
 * Intended for Codex/owner workstation in a visible Chromium browser:
 *
 * CHART_QA_EXPECTED_TIER=ADVANCED node tests/test_chart_authenticated_manual_browser_v1.mjs
 *
 * A human signs into an existing authorized QA account, completing Turnstile
 * normally. No password, CAPTCHA bypass, fabricated token, extra entitlement
 * or production workspace write is created. Never use as a CI success
 * substitute without an actual visible authorized sign-in.
 */
import assert from 'node:assert/strict';
import { chromium } from 'playwright';

const base='https://stock-market-from-the-ground-up-d1r.pages.dev';
const expected=String(process.env.CHART_QA_EXPECTED_TIER||'').toUpperCase();
const expectedRole=String(process.env.CHART_QA_EXPECTED_ROLE||'').toUpperCase();
const expectedUser=String(process.env.CHART_QA_EXPECTED_USER_ID||'');
const ranks={STANDARD:0,ADVANCED:1,PROFESSIONAL:2};
if(!Object.hasOwn(ranks,expected))
 throw Error('BLOCKED: explicitly set CHART_QA_EXPECTED_TIER=STANDARD, ADVANCED or PROFESSIONAL');
if(expectedUser&&!/^[a-f0-9]{8}-(?:[a-f0-9]{4}-){3}[a-f0-9]{12}$/i.test(expectedUser))
 throw Error('Invalid CHART_QA_EXPECTED_USER_ID');
if(expectedRole&&!['FREE','OWNER','ADMIN','MODERATOR','QA','REVOKED'].includes(expectedRole))
 throw Error('Invalid CHART_QA_EXPECTED_ROLE');
const safeJson=async response=>response.json().catch(()=>({}));
const noAccess=response=>[401,403].includes(response.status)||
 response.status===200&&response.data?.eligible===false;
const guest=await Promise.all(['/api/chart-tier-access','/api/chart-workspace'].map(async path=>{
 const response=await fetch(base+path,{cache:'no-store'});
 return {path,status:response.status,data:await safeJson(response)};
}));
assert(noAccess(guest[0]),'Unauthenticated tier request must not authorize access');
assert([401,403].includes(guest[1].status),'Unauthenticated workspace GET must deny access');
console.log('PASS guest read authorization rejected; opening visible browser for HUMAN sign-in');
const browser=await chromium.launch({headless:false});
const context=await browser.newContext({viewport:{width:1440,height:900},serviceWorkers:'block'});
const page=await context.newPage();
try{
 await page.goto(base+'/signin.html?next=%2Fdashboard.html',{waitUntil:'domcontentloaded'});
 console.log('MANUAL ACTION REQUIRED: Sign in normally in Chromium and complete any CAPTCHA. No test bypass is permitted.');
 await page.waitForURL(u=>/^\/dashboard(?:\.html)?$/i.test(u.pathname),{timeout:300000});
 await page.waitForFunction(()=>typeof window.getSupabaseClient==='function',null,{timeout:20000});
 const identity=await page.evaluate(async()=>{
  const db=await window.getSupabaseClient();
  const [{data:u,error:e},{data:s}]=await Promise.all([db.auth.getUser(),db.auth.getSession()]);
  return {id:u?.user?.id||null,session:s?.session?.access_token||null,error:e?.message||null};
 });
 assert(identity.id&&identity.session,'Real password-authenticated member session required');
 if(expectedUser)assert.equal(identity.id,expectedUser,'Signed-in user does not match declared QA account');
 const auth=async path=>{
  const response=await fetch(base+path,{headers:{authorization:'Bearer '+identity.session},cache:'no-store'});
  return {status:response.status,data:await safeJson(response)};
 };
 const {status,data}=await auth('/api/chart-tier-access');
 if(expectedRole==='REVOKED'){
  assert([401,403].includes(status)||data?.eligible===false,'Revoked account must not have Chart access');
  console.log('PASS revoked-member denial with genuine sign-in');
 }else{
  assert.equal(status,200,'Chart entitlement API did not return a real verified grant');
  assert.equal(data?.ok,true);
  assert.equal(data?.eligible,true);
  assert.equal(data?.tier,expected,'Authoritative tier mismatch');
  const allowed=['STANDARD',...(ranks[expected]>=1?['ADVANCED']:[]),
   ...(ranks[expected]>=2?['PROFESSIONAL']:[])];
  assert.deepEqual(data.allowed,allowed,'Server tier list exceeds expected permission');
  if(['OWNER','ADMIN','MODERATOR'].includes(expectedRole))
   assert.equal(data.staffChartRole,expectedRole,'Staff role is not server verified');
  if(expectedRole==='FREE')assert.equal(data.staffChartRole,null,'Free QA user is staff');
  const first=await auth('/api/chart-workspace');
  assert.equal(first.status,200,'Member workspace GET inaccessible');
  assert.equal(first.data?.ok,true);
  assert.equal(first.data?.tier,expected);
  const projected=first.data?.workspace||{};
  assert(Object.hasOwn(ranks,projected.selected),'Workspace projection missing');
  assert(ranks[projected.selected]<=ranks[expected],'Saved workspace exposes higher tier');
  await page.goto(base+'/simulator.html',{waitUntil:'domcontentloaded'});
  await page.waitForFunction(()=>window.CrownlightChartTiers?.getStatus?.().verified===true,null,{timeout:30000});
  const client=await page.evaluate(()=>window.CrownlightChartTiers.getStatus());
  assert.equal(client.tier,expected,'Chart UI not synchronized with authoritative server');
  assert.deepEqual(client.allowed,allowed);
  await page.locator('#sim-mode-csv').click();
  await page.locator('#sim-load-fictional').click();
  await page.waitForFunction(()=>window.CrownlightChartTiers.getRevealedBars().length>=2,null,{timeout:30000});
  for(const target of ['STANDARD','ADVANCED','PROFESSIONAL']){
   await page.evaluate(tier=>window.CrownlightChartTiers.choose(tier),target);
   if(ranks[target]>ranks[expected]){
    await page.waitForTimeout(450);
    const after=await page.evaluate(()=>window.CrownlightChartTiers.getStatus().selected);
    assert.notEqual(after,target,'Locked Chart tier was selectable');
   }else{
    await page.waitForFunction(t=>window.CrownlightChartTiers.getStatus().selected===t,target,{timeout:25000});
   }
  }
  const second=await auth('/api/chart-workspace');
  assert.equal(second.status,200);
  assert.deepEqual(second.data?.workspace,first.data?.workspace,
   'Read-only browser journey unexpectedly changed the saved workspace');
  assert.equal(second.data?.updatedAt,first.data?.updatedAt,'Read-only workspace revision changed');
  console.log('PASS actual signed-in tier, UI tool lock, fictional candles and private workspace read/reopen without modifications');
  console.log('NOTE: requires separate second-account test for cross-member isolation and separate authorized QA write for revision CAS');
 }
 console.log('RESULT '+JSON.stringify({
  result:'AUTHENTICATED_READ_ONLY_PASS',expectedTier:expected,
  expectedRole:expectedRole||'UNSPECIFIED',
  expectedAccountMatch:!!expectedUser,
  sourceSha:process.env.GITHUB_SHA||'LOCAL_WORKTREE_REQUIRE_GIT_SHA',
  dateUtc:new Date().toISOString(),commercialPaymentTest:false,
  captchaBypassed:false,workspaceWritePerformed:false,
  scope:'Current user; no cross-account or payment lifecycle acceptance'
 }));
}finally{
 try{await page.evaluate(async()=>{const db=await window.getSupabaseClient?.();await db?.auth.signOut?.()})}catch{}
 await context.close();
 await browser.close();
}