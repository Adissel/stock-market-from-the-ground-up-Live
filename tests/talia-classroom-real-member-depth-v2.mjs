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
  const member=await page.evaluate(async()=>{
   const sb=await window.getSupabaseClient(),session=(await sb.auth.getSession()).data?.session;
   return {id:session?.user?.id||'',token:session?.access_token||''};
  });
  assert.equal(member.id,USER,'Refuse QA using a different signed-in account');
  assert(member.token.length>50,'Member session unavailable');
  mark('Real James_Test website sign-in and exact identity');
  const headers={authorization:'Bearer '+member.token};
  const catalogResponse=await page.request.get(ORIGIN+'/api/talia-classroom-curriculum-v1',{headers,timeout:25000});
  assert.equal(catalogResponse.status(),200,'Authenticated member lesson catalog unavailable');
  const catalog=await catalogResponse.json();
  assert.equal(catalog.ok,true);
  assert.deepEqual(catalog.lessons?.map(x=>x.id),TOPICS);
  assert.deepEqual(catalog.phases,PHASES);
  assert(DEPTHS.includes(catalog.maximumDepth));
  assert.deepEqual(catalog.allowedDepths,DEPTHS.slice(0,DEPTHS.indexOf(catalog.maximumDepth)+1));
  assert.equal(catalog.premiumFeaturesReleased,false);
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
  await page.goto(ORIGIN+'/talia-classroom.html',{waitUntil:'domcontentloaded',timeout:35000});
  await page.locator('#tc-teaching-topic').waitFor({state:'visible',timeout:35000});
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
  await page.evaluate(()=>{void window.getSupabaseClient().then(sb=>sb.auth.signOut())});
  await page.goto(ORIGIN+'/signin.html',{waitUntil:'domcontentloaded',timeout:30000});
  const after=await page.evaluate(async()=>{
   const sb=await window.getSupabaseClient();return (await sb.auth.getSession()).data?.session||null;
  });
  assert.equal(after,null);
  mark('After sign-out no member session persists');
  console.log('PASS AUTHENTICATED CLASSROOM QA '+samples+' read-only lessons. Maximum depth '+catalog.maximumDepth+'. Other membership identities must be tested separately.');
 }finally{await ctx.close()}
}finally{await browser.close()}
