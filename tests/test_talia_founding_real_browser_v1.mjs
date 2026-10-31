/* Genuine Founder Tutor browser acceptance: encrypted per-plan QA login,
 * real Supabase session and RLS-restricted member-owned entitlement evidence.
 * Never grant a plan, create a paid Founder, bypass CAPTCHA, pay, turn on AI,
 * or record member private notes. Missing accounts/secrets = BLOCKED, not pass.
 */
import assert from 'node:assert/strict';
import {chromium} from 'playwright';
const site='https://stock-market-from-the-ground-up-d1r.pages.dev';
const tiers=['FOUNDING_14','FOUNDING_30','FOUNDING_60'];
const fixtures=tiers.map(plan=>({plan,
 email:process.env[plan+'_QA_EMAIL']||'',
 password:process.env[plan+'_QA_PASSWORD']||'',
 expectedId:process.env[plan+'_QA_USER_ID']||''}));
const blocked=fixtures.filter(x=>!x.email||!x.password||
 !/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(x.expectedId));
if(blocked.length)throw Error('BLOCKED: three separately identified, encrypted Founding QA credentials and UUIDs are required; missing '+blocked.map(x=>x.plan).join(', '));
const browser=await chromium.launch({headless:true,args:['--no-sandbox','--disable-dev-shm-usage']});
let passes=0;
const check=(bool,message)=>{assert(bool,message);passes++;console.log('PASS '+message)};
const now=Date.now(),inPeriod=(row,start,end)=>!row||((!row[start]||Date.parse(row[start])<=now)&&(!row[end]||Date.parse(row[end])>now));
try{
 for(const fixture of fixtures){
  const context=await browser.newContext({serviceWorkers:'block',viewport:{width:1280,height:800}});
  try{
   const page=await context.newPage();
   const guardResponse=await page.request.get(site+'/api/auth-guard-v0135',{timeout:30000});
   assert.equal(guardResponse.status(),200,'CAPTCHA status unavailable');
   const guard=await guardResponse.json();
   assert.equal(guard.enabled,false,'BLOCKED: CAPTCHA is enabled; never bypass');
   await page.goto(site+'/signin.html?next=%2Fdashboard.html',{waitUntil:'domcontentloaded',timeout:30000});
   await page.locator('#login-identifier').fill(fixture.email);
   await page.locator('#login-password').fill(fixture.password);
   await page.locator('.auth-card button[type="submit"]').click();
   await page.waitForURL(u=>new URL(u).pathname==='/dashboard.html',{timeout:30000});
   const proof=await page.evaluate(async plan=>{
    const sb=await window.getSupabaseClient();
    const result=await sb.auth.getUser(),user=result.data?.user;
    if(result.error||!user?.id)throw Error('Authenticated identity missing');
    const [grants,subs,founder]=await Promise.all([
     sb.from('user_plan_grants').select('plan_code,status,starts_at,ends_at,source,metadata').eq('user_id',user.id).eq('plan_code',plan),
     sb.from('site_subscriptions').select('plan_code,status,current_period_start,current_period_end').eq('user_id',user.id).eq('plan_code',plan),
     sb.rpc('gu_founder_my_status_v014174')
    ]);
    if(grants.error||subs.error||founder.error)throw Error('Own-plan evidence unavailable; fail closed');
    return {id:user.id,appMetadata:{
      qaOnly:user.app_metadata?.smfgu_qa_only===true,
      noncommercial:user.app_metadata?.noncommercial===true,
      target:user.app_metadata?.qa_target_plan||null
     },grants:grants.data||[],subscriptions:subs.data||[],founder:founder.data||null};
   },fixture.plan);
   check(proof.id===fixture.expectedId,fixture.plan+': exact authenticated QA user');
   const activeGrant=proof.grants.some(row=>
    row.status==='active'&&inPeriod(row,'starts_at','ends_at'));
   const activePaid=proof.subscriptions.some(row=>
    ['active','trialing'].includes(row.status)&&inPeriod(row,'current_period_start','current_period_end'));
   check(activeGrant||activePaid,fixture.plan+': actual current RLS-owned Founding entitlement');
   if(activeGrant&&!activePaid)check(proof.appMetadata.qaOnly&&proof.appMetadata.noncommercial&&
    proof.appMetadata.target===fixture.plan,
    fixture.plan+': explicit noncommercial QA marker without fabricated paid subscription');
   if(activePaid)check(proof.founder?.eligible===true&&proof.founder.currentPlan===fixture.plan,
    fixture.plan+': actual paid-cycle founder RPC aligns with subscription');
   const actor=await page.evaluate(async()=>{const sb=await window.getSupabaseClient();return (await sb.auth.getSession()).data.session?.access_token||''});
   check(actor.length>50,fixture.plan+': real JWT session');
   const headers={authorization:'Bearer '+actor};
   const accessRes=await page.request.get(site+'/api/member-tool-access?tool=MARKET_TUTOR',{headers,timeout:30000});
   check(accessRes.status()===200&&(await accessRes.json()).authorized===true,
    fixture.plan+': authoritative Market Tutor entitlement');
   const ask=async stage=>{
    const resp=await page.request.post(site+'/api/market-tutor',{
     headers:{...headers,'content-type':'application/json'},
     data:{question:'For canonical Lab DT-C10-L03. Learning Journey stage: '+stage+
      '. Explain the original fictional bid/ask midpoint spread evidence.',
      mode:'explain',allowModel:false,saveHistory:false},timeout:30000
    });
    assert.equal(resp.status(),200,'Source-only Tutor response rejected');
    return await resp.json();
   };
   const learn=await ask('Learn');
   check(learn.generation==='original-competency-guide'&&learn.aiReason==='source_only',
    fixture.plan+': existing public source-only Tutor responded without paid model');
   check(learn.sources?.some(x=>x.referenceUrls?.some(url=>/^https:\/\/(?:www\.)?investor\.gov\//.test(url))),
    fixture.plan+': exact SEC public citation');
   check(learn.graded===false&&learn.masteryAwarded===false&&learn.historySaved!==true,
    fixture.plan+': no independent mastery or private Tutor write');
   const assess=await ask('Assess');
   check(assess.graded===false&&assess.masteryAwarded===false&&
    !JSON.stringify(assess).includes('FICTIONAL snapshot: bid $12.00, ask $12.12'),
    fixture.plan+': hidden case remains withheld in protected Assess');
   await page.goto(site+'/market-tutor.html',{waitUntil:'domcontentloaded',timeout:30000});
   await page.waitForFunction(()=>document.getElementById('tutor-ask')?.disabled===false,
    null,{timeout:30000});
   check(!(await page.locator('#tutor-ai-consent').isChecked()),
    fixture.plan+': optional paid AI remains unchecked');
   await page.locator('#tutor-question').fill('Explain the fictional spread in Lab DT-C10-L03.');
   await page.locator('#tutor-save-history').uncheck();
   await page.locator('#tutor-ask').click();
   await page.locator('#tutor-thread li').first().waitFor({state:'attached',timeout:30000});
   check(/spread|bid|ask/i.test(await page.locator('#tutor-thread').innerText()),
    fixture.plan+': genuine browser displays Tutor answer');
   check((await page.locator('#tutor-thread a[href^="https://www.investor.gov/"]').count())>=1,
    fixture.plan+': safe source link is visible in real UI');
   await page.evaluate(()=>{void window.getSupabaseClient().then(sb=>sb.auth.signOut())});
   await page.goto(site+'/signin.html',{waitUntil:'domcontentloaded',timeout:30000});
   const post=await page.evaluate(async()=>{const sb=await window.getSupabaseClient();return (await sb.auth.getSession()).data?.session||null});
   check(post===null,fixture.plan+': explicit sign-out leaves no session');
  }finally{await context.close()}
 }
 console.log('PASS REAL Founding Tutor source-only QA: '+passes+' browser assertions over three separate, verified current entitlements; noncommercial QA is NOT paid lifecycle acceptance.');
}finally{await browser.close()}
