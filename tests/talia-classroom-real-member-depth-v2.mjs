/* Genuine signed-in James_Test Talia curriculum acceptance: immutable deployment SHA,
 * current server-held entitlement, all six topics and five ungraded teaching steps.
 * Read-only: NO plan mutation, payments, AI calls, assessments or conversation writes.
 */
import assert from 'node:assert/strict';
import {chromium} from 'playwright';
const ORIGIN=String(process.env.TALIA_QA_ORIGIN||'https://stock-market-from-the-ground-up-d1r.pages.dev').replace(/\/$/,'');
const SHA=String(process.env.TALIA_QA_EXPECTED_SHA||process.env.GITHUB_SHA||'').toLowerCase();
const EMAIL=process.env.LAB_QA_EMAIL||'',PASS=process.env.LAB_QA_PASSWORD||'';
const USER='f42f9301-18e6-43a3-8531-32d371fd22c1';
const DEPTHS=['FOUNDATION','ADVANCED','PROFESSIONAL','ENTERPRISE'];
const TOPICS=['candlesticks','vwap','ema','scanner','volume','structure'];
const PHASES=['explain','demonstrate','practice','correct','transfer'];
// Production account QA uses temporary, explicitly noncommercial owner-granted plan rows.
const QA_REF='SMFGU-FOUNDING-ACCEPTANCE-20261105';
const PLAN_CEILING=Object.freeze({FREE:'FOUNDATION',FOUNDING_14:'FOUNDATION',FOUNDING_30:'ADVANCED',FOUNDING_60:'PROFESSIONAL'});
const mark=(name)=>console.log('PASS '+name);
assert(EMAIL&&PASS,'BLOCKED: encrypted James_Test identity required; no fabricated credentials');
assert(/^[0-9a-f]{40}$/.test(SHA),'BLOCKED: exact release SHA required');
assert(ORIGIN.startsWith('https://'),'Only live HTTPS classroom may be accepted');
let deployed=false,lastSeen='unavailable';
for(let attempt=1;attempt<=4;attempt++){
 try{
  const response=await fetch(ORIGIN+'/release-manifest.json?acceptance='+SHA+'&attempt='+attempt,{
   cache:'no-store',signal:AbortSignal.timeout(20000)});
  if(response.ok){
   const manifest=await response.json();
   lastSeen=String(manifest?.gitCommit||'missing');
   if(lastSeen===SHA){deployed=true;break;}
  }else lastSeen='HTTP '+response.status;
 }catch{lastSeen='manifest unavailable';}
 if(attempt<4){
  console.log('DEPLOYMENT_PENDING '+attempt+'/4; recheck after 90 seconds; target '+SHA.slice(0,8));
  await new Promise(resolve=>setTimeout(resolve,90000));
 }
}
assert.equal(deployed,true,'BLOCKED: exact production SHA not deployed after four checks; last observed '+lastSeen.slice(0,8));
mark('Exact source commit is currently deployed to the tested origin');
const guestResponse=await fetch(ORIGIN+'/api/talia-classroom-curriculum-v1',{cache:'no-store'});
assert.equal(guestResponse.status,401,'Anonymous classroom catalog must be denied');
mark('Guest cannot read the member classroom catalog');
const browser=await chromium.launch({headless:true,args:['--no-sandbox','--disable-dev-shm-usage']});
try{
 const ctx=await browser.newContext({serviceWorkers:'block',viewport:{width:1366,height:850}});
 try{
  const page=await ctx.newPage();
  const guardResponse=await page.request.get(ORIGIN+'/api/auth-guard-v0135',{timeout:20000});
  assert.equal(guardResponse.status(),200,'Cannot read CAPTCHA policy');
  const guard=await guardResponse.json();
  assert.equal(guard.enabled,false,'BLOCKED: CAPTCHA enabled; never bypass');
  await page.goto(ORIGIN+'/signin.html?next=%2Fdashboard.html',{waitUntil:'domcontentloaded',timeout:30000});
  await page.locator('#login-identifier').fill(EMAIL);
  await page.locator('#login-password').fill(PASS);
  await page.locator('.auth-card button[type="submit"]').click();
  await page.waitForURL(u=>new URL(u).pathname==='/dashboard.html',{timeout:30000});
  assert.equal(new URL(page.url()).origin,ORIGIN,'Sign-in redirected to another origin; same-origin browser QA cannot share its session. Use the canonical production host.');
  const member=await page.evaluate(async()=>{
   const sb=await window.getSupabaseClient(),session=(await sb.auth.getSession()).data?.session;
   return {id:session?.user?.id||'',token:session?.access_token||''};
  });
  assert.equal(member.id,USER,'Refuse QA using a different signed-in account');
  assert(member.token.length>50,'Member session unavailable');
  mark('Real James_Test website sign-in and exact identity');
  const qaGrants=await page.evaluate(async()=>{
   const sb=await window.getSupabaseClient(),session=(await sb.auth.getSession()).data?.session;
   const query=await sb.from('user_plan_grants').select('plan_code,status,starts_at,ends_at,source,source_reference')
    .eq('user_id',session.user.id);
   return {rows:query.data||[],error:query.error?.message||''};
  });
  assert.equal(qaGrants.error,'','Member must read only own plan grants under RLS');
  const now=Date.now(),active=qaGrants.rows.filter(g=>
   ['active','trialing'].includes(g.status)&&Date.parse(g.starts_at)<=now&&
   (g.ends_at===null||Date.parse(g.ends_at)>now));
  assert.equal(active.filter(g=>g.source_reference!==QA_REF).length,0,
   'Refuse acceptance while James_Test has non-QA active plan grants');
  assert(active.length<=1,'Only one owner-issued noncommercial Founder QA grant may be active');
  const verifiedPlan=active[0]?.plan_code||'FREE';
  assert(Object.hasOwn(PLAN_CEILING,verifiedPlan),'Unexpected member plan');
  if(active.length){
   assert.equal(active[0].source,'qa_owner_noncommercial_20261105','Refuse unapproved paid-like grant source');
  }
  mark('Actual member-owned RLS plan state '+verifiedPlan+'; no purchase or fulfillment');
  const headers={authorization:'Bearer '+member.token};
  const catalogResponse=await page.request.get(ORIGIN+'/api/talia-classroom-curriculum-v1',{headers,timeout:25000});
  assert.equal(catalogResponse.status(),200,'Authenticated member lesson catalog unavailable');
  const catalog=await catalogResponse.json();
  assert.equal(catalog.ok,true);
  assert.deepEqual(catalog.lessons?.map(x=>x.id),TOPICS);
  assert.deepEqual(catalog.phases,PHASES);
  assert(DEPTHS.includes(catalog.maximumDepth));
  assert.deepEqual(catalog.allowedDepths,DEPTHS.slice(0,DEPTHS.indexOf(catalog.maximumDepth)+1));
  assert.equal(catalog.maximumDepth,PLAN_CEILING[verifiedPlan],
   'Tutor teaching depth must equal the Owner-approved member plan ceiling');
  assert.equal(catalog.premiumFeaturesReleased,false);
  // Knowledge Database authorization is verified in its own independent workflow.
  // Tutor acceptance must not depend on article publication or article entitlements.
  mark('Live member entitlement and six original lesson topics/five steps');
  let samples=0;
  for(const depth of catalog.allowedDepths){
   for(const topic of TOPICS){
    for(const phase of PHASES){
     const result=await page.request.post(ORIGIN+'/api/talia-classroom-curriculum-v1',{
      headers:{...headers,'content-type':'application/json'},data:{topic,depth,phase},timeout:25000});
     assert.equal(result.status(),200,depth+' '+topic+' '+phase);
     const answer=await result.json();
     assert.equal(answer.ok,true);
     assert.equal(answer.depth,depth);
     assert.equal(answer.topic,topic);
     assert.equal(answer.phase,phase);
     assert(answer.answer.length>90);
     assert.equal(answer.graded,false);
     assert.equal(answer.masteryAwarded,false);
     assert.equal(answer.hasFutureBars,false);
     assert.equal(answer.memberRecordWritten,false);
     assert.equal(answer.historySaved,false);
     assert.equal(answer.aiReason,'original_source_only');
     samples++;
    }
   }
  }
  mark(samples+' genuine authenticated, ungraded teaching API responses at current authorized depths');
  for(const forbidden of DEPTHS.slice(DEPTHS.indexOf(catalog.maximumDepth)+1)){
   const result=await page.request.post(ORIGIN+'/api/talia-classroom-curriculum-v1',{
    headers:{...headers,'content-type':'application/json'},
    data:{topic:'vwap',depth:forbidden,phase:'explain'},timeout:25000});
   assert.equal(result.status(),403,'Over-tier depth must be denied '+forbidden);
  }
  const forged=await page.request.post(ORIGIN+'/api/talia-classroom-curriculum-v1',{
   headers:{...headers,'content-type':'application/json'},
   data:{topic:'vwap',depth:'FOUNDATION',phase:'explain',entitlement:'ENTERPRISE'},timeout:25000});
  assert.equal(forged.status(),400,'Member cannot forge server entitlement');
  mark('Over-tier requests and client-forged entitlement denied');
  const classroomHttp=[],classroomErrors=[];
  page.on('response',res=>{
   try{
    const pathname=new URL(res.url()).pathname;
    if(['/api/member-tool-access','/api/talia-classroom-curriculum-v1','/assets/js/talia-classroom-v1.bundle.js'].includes(pathname))
     classroomHttp.push({path:pathname,status:res.status()});
   }catch{}
  });
  page.on('pageerror',err=>classroomErrors.push({name:err.name,
   type:/module|import|syntax/i.test(String(err.message))?'module_or_syntax':
    /getSupabaseClient|auth|session/i.test(String(err.message))?'auth_init':'runtime'}));
  await page.goto(ORIGIN+'/talia-classroom.html',{waitUntil:'domcontentloaded',timeout:35000});
  try{await page.locator('#tc-teaching-topic').waitFor({state:'visible',timeout:20000});}
  catch(err){
   const diagnostic=await page.evaluate(async()=>{
    const root=document.getElementById('talia-classroom-root');
    let session=false;
    try{const sb=await window.getSupabaseClient?.();session=!!(await sb?.auth.getSession()).data?.session?.access_token}catch{}
    return {path:location.pathname,rootPresent:!!root,rootChildCount:root?.children.length||0,
     selectorPresent:!!document.querySelector('#tc-teaching-topic'),
     renderedMain:!!root?.querySelector('.tc-main'),
     memberSignInPrompt:!!root?.querySelector('a[href*="signin.html"]'),
     loaderVisible:!!root?.textContent?.includes('Loading the verified member learning workspace'),
     sessionPresent:session,bundlePresent:!!document.querySelector('script[src*="talia-classroom-v1.bundle.js"]')};
   }).catch(()=>({diagnostic:'unavailable'}));
   console.log('TALIA_CLASSROOM_SAFE_UI_DIAGNOSTIC '+JSON.stringify({
    ...diagnostic,http:classroomHttp,errors:classroomErrors}));
   throw err;
  }
  await page.waitForFunction(()=>!!document.querySelector('#tc-teaching-depth')&&!document.querySelector('#tc-teaching-depth').disabled,null,{timeout:35000});
  const controls=await page.evaluate(()=>{
   const depth=document.querySelector('#tc-teaching-depth');
   return {topics:[...document.querySelector('#tc-teaching-topic').options].map(x=>x.value),
    depthOptions:[...depth.options].map(x=>({name:x.value,disabled:x.disabled}))};
  });
  assert.deepEqual(controls.topics,TOPICS);
  for(const option of controls.depthOptions)assert.equal(option.disabled,!catalog.allowedDepths.includes(option.name),option.name+' UI authorization');
  mark('Rendered lesson/topic selector mirrors server-authorized depths');
  for(const topic of TOPICS){
   await page.locator('#tc-teaching-topic').selectOption(topic);
   await page.locator('#tc-teaching-depth').selectOption('FOUNDATION');
   const before=await page.locator('.tc-transcript li').count();
   await page.getByRole('button',{name:'Start teaching'}).click();
   await page.waitForFunction(expected=>document.querySelectorAll('.tc-transcript li').length>=expected,before+2,{timeout:25000});
   const text=await page.locator('.tc-transcript li').last().textContent();
   assert(text.length>80,topic+' rendered lesson too short');
  }
  mark('Six genuine interactive browser lesson selections and rendered Talia responses');
  // Ungraded notebook: local working is compared with the correct original VWAP case,
  // without a grade, member-history save, or additional paid model request.
  await page.locator('#tc-teaching-topic').selectOption('vwap');
  await page.getByRole('button',{name:'Start teaching'}).click();
  await page.locator('.tc-teaching-steps').getByRole('button',{name:'Practice'}).click();
  await page.locator('#tc-practice-notes').fill('I computed total dollars $4,600 and 400 shares; $4,600 / 400 = $11.50 per share.');
  await page.getByRole('button',{name:'Compare with worked check'}).click();
  await page.waitForFunction(()=>[...document.querySelectorAll('.tc-transcript li')].some(x=>x.textContent?.includes('exact trade-print VWAP = $4,600 / 400 = $11.50')),{},{timeout:25000});
  assert.match(await page.locator('.tc-teaching-progress').innerText(),/Viewed [1-5] of 5/);
  mark('Member browser displayed local ungraded notes and the exact VWAP worked correction');
  if(catalog.allowedDepths.length>1){
   const higher=catalog.allowedDepths.at(-1);
   await page.locator('#tc-teaching-depth').selectOption(higher);
   await page.locator('#tc-teaching-depth').selectOption('FOUNDATION');
   const after=await page.locator('#tc-teaching-depth').inputValue();
   assert.equal(after,'FOUNDATION');
   mark('Higher-level member switches to Foundation without downgrading their entitlement');
  }
  await page.setViewportSize({width:390,height:844});
  assert.equal(await page.locator('#tc-teaching-topic').isVisible(),true);
  assert.equal(await page.locator('#tc-teaching-depth').isVisible(),true);
  mark('Mobile lesson and depth controls remain visible');
  await page.evaluate(async()=>{
   const sb=await window.getSupabaseClient();
   const result=await sb.auth.signOut({scope:'local'});
   if(result.error)throw Error('Local sign-out could not be completed.');
  });
  await page.waitForFunction(async()=>{
   const sb=await window.getSupabaseClient();
   return !(await sb.auth.getSession()).data?.session;
  },null,{timeout:15000});
  await page.goto(ORIGIN+'/signin.html',{waitUntil:'domcontentloaded',timeout:30000});
  const sessionRemains=await page.evaluate(async()=>{
   const sb=await window.getSupabaseClient();
   return !!(await sb.auth.getSession()).data?.session;
  });
  assert.equal(sessionRemains,false,'Member session must not persist after awaited local sign-out');
  mark('After sign-out no member session persists');
  console.log('PASS AUTHENTICATED CLASSROOM QA '+samples+' read-only lessons. QA_PLAN='+verifiedPlan+' MAXIMUM_DEPTH='+catalog.maximumDepth+'. Only this real signed-in member state was accepted; independent identities remain a separate privacy gate.');
 }finally{await ctx.close()}
}finally{await browser.close()}
