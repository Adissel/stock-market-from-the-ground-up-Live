/* Noncommercial James_Test sequential Founding 14/30/60 acceptance.
 * Requires a real authenticated session, RLS-owned current QA grant, and
 * original source-based Tutor. Never creates paid Founder seats, Stripe cycles,
 * model charges, protected grades, plan writes, or fake account identities.
 * Each plan is tested in a separate non-overlapping QA window.
 */
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {chromium} from 'playwright';
const config=JSON.parse(readFileSync(new URL('../data/qa/james-founding-sequential-v1.json',import.meta.url),'utf8'));
const plans=['FOUNDING_14','FOUNDING_30','FOUNDING_60'];
assert(config.version===1&&config.sequence>=1&&config.sequence<=3);
assert.equal(config.plan,plans[config.sequence-1]);
assert(config.noncommercial===true&&config.paymentTests===false&&config.protectedAssessmentTests===false);
const expected='f42f9301-18e6-43a3-8531-32d371fd22c1';
assert.equal(config.expectedUserId,expected);
const email=process.env.LAB_QA_EMAIL||'',password=process.env.LAB_QA_PASSWORD||'';
assert(email&&password,'BLOCKED: Existing encrypted James_Test credentials required; no synthetic login');
const origin='https://stock-market-from-the-ground-up-d1r.pages.dev';
const browser=await chromium.launch({headless:true,args:['--no-sandbox','--disable-dev-shm-usage']});
let checks=0;
function check(v,label){assert(v,label);checks++;console.log('PASS '+config.plan+': '+label)}
try{
 const context=await browser.newContext({serviceWorkers:'block',viewport:{width:1280,height:800}});
 const page=await context.newPage();
 const guard=await page.request.get(origin+'/api/auth-guard-v0135',{timeout:30000});
 assert.equal(guard.status(),200);
 const guardData=await guard.json();
 assert.equal(guardData.enabled,false,'BLOCKED: interactive CAPTCHA enabled; no bypass');
 await page.goto(origin+'/signin.html?next=%2Fdashboard.html',{waitUntil:'domcontentloaded',timeout:30000});
 await page.locator('#login-identifier').fill(email);
 await page.locator('#login-password').fill(password);
 await page.locator('.auth-card button[type="submit"]').click();
 await page.waitForURL(u=>new URL(u).pathname==='/dashboard.html',{timeout:30000});
 const auth=await page.evaluate(async()=>{
  const c=await window.getSupabaseClient();
  const x=await c.auth.getUser(),y=await c.auth.getSession();
  if(x.error||y.error)throw Error('Supabase authentication unavailable');
  return {id:x.data?.user?.id,token:y.data?.session?.access_token||''};
 });
 check(auth.id===expected,'genuine expected James_Test Supabase identity');
 check(auth.token.length>50,'authenticated session JWT present');
 const evidence=await page.evaluate(async ({plan,userId})=>{
  const c=await window.getSupabaseClient();
  const [grants,subscriptions,founders]=await Promise.all([
   c.from('user_plan_grants').select('plan_code,status,starts_at,ends_at,source').eq('user_id',userId),
   c.from('site_subscriptions').select('plan_code,status').eq('user_id',userId),
   c.rpc('gu_founder_my_status_v014174')
  ]);
  if(grants.error||subscriptions.error||founders.error)throw Error('Own RLS entitlement records not readable');
  return {grants:grants.data||[],subscriptions:subscriptions.data||[],founder:founders.data||{}};
 },{plan:config.plan,userId:expected});
 const now=Date.now();
 const active=evidence.grants.filter(g=>g.status==='active'&&
  (!g.starts_at||Date.parse(g.starts_at)<=now)&&(!g.ends_at||Date.parse(g.ends_at)>now)&&plans.includes(g.plan_code));
 check(active.length===1&&active[0].plan_code===config.plan,'one and only one current Founding QA plan grant');
 check(active[0].source===config.grantSource,'authorized noncommercial source marker');
 check(active[0].ends_at&&Date.parse(active[0].ends_at)-now<75*60*1000,
  'temporary grant has short expiration, not an indefinite membership');
 check(evidence.subscriptions.every(x=>!plans.includes(x.plan_code)||!['active','trialing'].includes(x.status)),
  'no fabricated paid Founding subscription');
 check(evidence.founder?.eligible!==true,'no fabricated commercial Founder 600 seat');
 const headers={authorization:'Bearer '+auth.token};
 const access=await page.request.get(origin+'/api/member-tool-access?tool=MARKET_TUTOR',{headers,timeout:30000});
 assert.equal(access.status(),200);
 const ent=await access.json();
 check(ent.authorized===true,'server-side Market Tutor entitlement');
 const ask=async stage=>{
  const x=await page.request.post(origin+'/api/market-tutor',{
   headers:{...headers,'content-type':'application/json'},
   data:{question:'Explain Lab DT-C10-L03 Learning Journey stage: '+stage+
    '. Explain bid, ask, midpoint and spread using the original fictional case.',
    mode:'explain',allowModel:false,saveHistory:false},timeout:30000
  });
  const v=await x.json().catch(()=>({}));
  assert.equal(x.status(),200,'Source-only Tutor should succeed in '+stage);
  return v;
 };
 const learn=await ask('Learn');
 check(learn.generation==='original-competency-guide'&&learn.aiReason==='source_only',
  'existing source-only Tutor, no paid AI generation');
 check(learn.graded===false&&learn.masteryAwarded===false&&learn.historySaved!==true,
  'no private Tutor history, protected grading or mastery');
 check(learn.sources?.some(x=>x.referenceUrls?.some(u=>/^https:\/\/(?:www\.)?investor\.gov\//.test(u))),
  'direct original SEC citation');
 const assess=await ask('Assess');
 check(assess.graded===false&&assess.masteryAwarded===false&&
   !JSON.stringify(assess).includes('FICTIONAL snapshot: bid $12.00, ask $12.12'),
  'Assess withholds protected worked case');
 const chart=await page.request.get(origin+'/api/chart-tier-access',{headers,timeout:30000});
 const chartBody=await chart.json().catch(()=>({}));
 console.log('CHART_QA_OBSERVATION '+JSON.stringify({
  expectedCommercialTier:{FOUNDING_14:'STANDARD',FOUNDING_30:'ADVANCED',FOUNDING_60:'PROFESSIONAL'}[config.plan],
  observedTier:chartBody.tier||null,reason:chartBody.reason||null,
  paidTierClaimed:false,qaOnly:true}));
 await page.goto(origin+'/market-tutor.html',{waitUntil:'domcontentloaded',timeout:30000});
 await page.waitForFunction(()=>document.getElementById('tutor-ask')?.disabled===false,null,{timeout:30000});
 check(!(await page.locator('#tutor-ai-consent').isChecked()),'optional paid AI unchecked');
 await page.locator('#tutor-question').fill('Explain the fictional bid and ask spread in Lab DT-C10-L03.');
 await page.locator('#tutor-save-history').uncheck();
 await page.locator('#tutor-ask').click();
 await page.locator('#tutor-thread li').first().waitFor({state:'attached',timeout:25000});
 check(/spread|ask|bid/i.test(await page.locator('#tutor-thread').innerText()),
  'genuine browser displays source-based teaching');
 check(await page.locator('#tutor-thread a[href^="https://www.investor.gov/"]').count()>0,
  'genuine browser displays primary citation link');
 await page.evaluate(()=>{void window.getSupabaseClient().then(c=>c.auth.signOut())});
 await page.goto(origin+'/signin.html',{waitUntil:'domcontentloaded',timeout:30000});
 check(await page.evaluate(async()=>{
  const c=await window.getSupabaseClient();
  return !(await c.auth.getSession()).data?.session;
 }),'real account signed out; no session remains');
 console.log('PASS '+config.plan+' genuine James_Test noncommercial entitlement browser QA: '+checks+
  ' passed checks. NOT a paid subscription/Founders Commons payment lifecycle validation.');
 await context.close();
}finally{await browser.close()}
