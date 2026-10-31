/* Production genuine Free-member Tutor read-only browser acceptance.
 * Uses ONLY existing encrypted GitHub Actions QA credentials. A real sign-in
 * is mandatory; if CAPTCHA is enabled, STOP (never bypass). No payments,
 * model generation, Journal history, account changes or entitlement writes.
 */
import assert from 'node:assert/strict';
import {chromium} from 'playwright';
const site='https://stock-market-from-the-ground-up-d1r.pages.dev';
const email=process.env.LAB_QA_EMAIL||'',password=process.env.LAB_QA_PASSWORD||'';
const expectedUser='f42f9301-18e6-43a3-8531-32d371fd22c1';
const passed=[];
const assertCheck=(statement,message)=>{assert(statement,message);passed.push(message);console.log('PASS '+message);};
assert(email&&password,'BLOCKED: existing encrypted James_Test QA credentials are required; no fake authentication');
const browser=await chromium.launch({headless:true,args:['--no-sandbox','--disable-dev-shm-usage']});
try{
 const context=await browser.newContext({serviceWorkers:'block',viewport:{width:1280,height:800}});
 const page=await context.newPage();
 const signin=await page.goto(site+'/signin.html',{waitUntil:'domcontentloaded',timeout:30000});
 assert.equal(signin.status(),200,'Sign-in route must be available');
 const gate=await page.request.get(site+'/api/auth-guard-v0135',{timeout:20000});
 assert.equal(gate.status(),200,'CAPTCHA gate status must be independently available');
 const guard=await gate.json();
 assert.equal(guard.enabled,false,'BLOCKED: CAPTCHA enabled. Never bypass human challenge');
 await page.locator('#login-identifier').fill(email);
 await page.locator('#login-password').fill(password);
 await page.locator('.auth-card button[type="submit"]').click();
 await page.waitForURL(url=>new URL(url).pathname==='/dashboard.html',{timeout:30000});
 const actor=await page.evaluate(async()=>{
  const client=await window.getSupabaseClient(),{data,error}=await client.auth.getSession();
  if(error)throw Error('Session unavailable');
  return {id:data?.session?.user?.id||'',token:data?.session?.access_token||''};
 });
 assert.equal(actor.id,expectedUser,'Unexpected signed-in identity: refuse Tutor QA');
 assert(actor.token.length>50,'Verified JWT required');
 assertCheck(true,'Real authenticated pre-existing Free QA member logged in');
 const headers={authorization:'Bearer '+actor.token};
 const configResponse=await page.request.get(site+'/api/member-tool-access?tool=MARKET_TUTOR',{headers,timeout:30000});
 assert.equal(configResponse.status(),200);
 const config=await configResponse.json();
 assertCheck(config.authorized===true&&config.freeEligible===true,
  'Authoritative production Free member tool authorization true');
 const ask=async stage=>{
  const r=await page.request.post(site+'/api/market-tutor',{
   headers:{...headers,'content-type':'application/json'},
   data:{question:'For canonical Lab DT-C10-L03. Learning Journey stage: '+stage+
     '. Explain the original fictional bid, ask, midpoint and spread evidence.',
     mode:'explain',allowModel:false,saveHistory:false},
   timeout:30000
  });
  const value=await r.json().catch(()=>({}));
  assert.equal(r.status(),200,'Source-only Tutor response at '+stage+' must work');
  return value;
 };
 const learn=await ask('Learn');
 assertCheck(learn.generation==='original-competency-guide','Only the approved source-based Tutor responds');
 assertCheck(learn.graded===false&&learn.masteryAwarded===false,
  'Real Free teaching awards no grades or mastery');
 assertCheck(learn.historySaved!==true,'Read-only QA must not save Tutor history');
 assertCheck(learn.labContext?.labId==='DT-C10-L03','Correct canonical Lab identity');
 const sources=learn.sources||[];
 assertCheck(sources.some(x=>(x.referenceUrls||[]).some(u=>
   /^https:\/\/(?:www\.)?investor\.gov\//i.test(u))),
  'Exact public educational source citation returned to Free member');
 const assess=await ask('Assess');
 assertCheck(assess.graded===false&&assess.masteryAwarded===false,
  'Protected Assess never grades or awards mastery');
 assertCheck(assess.labContext?.claimEvidence===undefined,
  'Raw public worked-case evidence object is not exposed in Assess');
 assertCheck(!JSON.stringify(assess).includes('FICTIONAL snapshot: bid $12.00, ask $12.12'),
  'Protected Assess omits source-specific worked calculation');
 const denied=await page.request.post(site+'/api/market-tutor',{
  headers:{'content-type':'application/json'},
  data:{question:'What is VWAP?',allowModel:false,saveHistory:false},
  timeout:30000
 });
 assertCheck(denied.status()===401,'Unauthenticated endpoint remains inaccessible');
 // Test the actual member-facing Tutor controls, not only authenticated APIs.
 // AI stays unchecked; private history is explicitly disabled for this QA.
 await page.goto(site+'/market-tutor.html',{waitUntil:'domcontentloaded',timeout:30000});
 await page.locator('#tutor-question').fill(
  'For Lab DT-C10-L03 Learning Journey stage: Learn, explain the fictional bid, ask and spread calculation.');
 await page.locator('#tutor-mode').selectOption('explain');
 await page.locator('#tutor-save-history').uncheck();
 assertCheck(!(await page.locator('#tutor-ai-consent').isChecked()),
  'Live Tutor composer keeps optional AI off by default');
 await page.locator('#tutor-ask').click();
 try{
  await page.locator('#tutor-thread li').first().waitFor({state:'attached',timeout:20000});
 }catch(err){
  const diagnostic=await page.evaluate(()=>({
   status:String(document.getElementById('tutor-status')?.textContent||'').slice(0,350),
   threadCount:document.querySelectorAll('#tutor-thread li').length,
   askDisabled:document.getElementById('tutor-ask')?.disabled===true,
   pathname:location.pathname
  })).catch(()=>({status:'navigation occurred'}));
  console.log('TUTOR_UI_SAFE_DIAGNOSTIC '+JSON.stringify(diagnostic));
  throw err;
 }
 const rendered=await page.locator('#tutor-thread').innerText();
 assertCheck(/bid|ask|spread/i.test(rendered),
  'Free member sees the actual rendered source-grounded answer');
 assertCheck((await page.locator('#tutor-thread a[href^="https://www.investor.gov/"]').count())>=1,
  'Actual Tutor conversation contains a direct safe primary-source citation');
 // Logout after QA; no mutation of member entitlements, payment or records.
 // Sign-out may synchronously navigate away; start it without keeping the
 // original page's evaluate promise alive across that navigation.
 await page.evaluate(()=>{
  void window.getSupabaseClient().then(client=>client.auth.signOut());
 });
 await page.goto(site+'/signin.html',{waitUntil:'domcontentloaded',timeout:30000});
 const afterLogout=await page.evaluate(async()=>{
  const client=await window.getSupabaseClient();
  return (await client.auth.getSession()).data?.session||null;
 });
 assertCheck(afterLogout===null,'Real QA session terminated and signed-out state verified');
 console.log('PASS Talia REAL Free member authenticated read-only acceptance: '+passed.length+
  ' checks. Founder/member role acceptance remains a separate credential-dependent gate.');
 await context.close();
}finally{await browser.close()}
