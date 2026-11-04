/* SMFGU-TALIA-V4-OAT-001. Authentic browser acceptance on exact immutable Pages deployment.
   No purchased credits, payments, grading, Tutor POST, or protected content writes.
   A CAPTCHA-on window blocks automated password sign-in; never bypass it. */
import assert from 'node:assert/strict';
import {mkdirSync,writeFileSync} from 'node:fs';
import {chromium} from 'playwright';
import {createHmac} from 'node:crypto';

// The build writes its Cloudflare commit SHA to public/release-manifest.json.
// Verify the production domain before AND after browser acceptance: a green
// browser run on an older deployment must never certify another main commit.
const ORIGIN=String(process.env.V4_ACCEPTANCE_ORIGIN||'https://stock-market-from-the-ground-up-d1r.pages.dev').replace(/\/$/,'');
const RUN_SHA=String(process.env.GITHUB_SHA||'').trim().toLowerCase();
const SHA=String(process.env.V4_PINNED_DEPLOYMENT_SHA||process.env.V4_ACCEPTANCE_SHA||RUN_SHA).trim().toLowerCase();
const PINNED=SHA!==RUN_SHA;
const requireExactDeployment=async()=>{
 if(!/^[0-9a-f]{40}$/.test(SHA))throw Error('BLOCKED: pinned deployment SHA is missing or malformed');
 const url=ORIGIN+'/release-manifest.json?release_verification='+SHA;
 const response=await fetch(url,{cache:'no-store',signal:AbortSignal.timeout(25000)});
 if(!response.ok)throw Error('BLOCKED: production release manifest unavailable: HTTP '+response.status);
 const manifest=await response.json();
 if(manifest?.gitCommit!==SHA)throw Error('BLOCKED: immutable Cloudflare SHA mismatch: expected '+SHA+' observed '+String(manifest?.gitCommit||'missing'));
 return SHA;
};
const EXPECTED_ID='f42f9301-18e6-43a3-8531-32d371fd22c1'; // Existing James_Test QA identity
const DIR=process.env.QA_ARTIFACT_DIR||'artifacts/talia-v4-oat';
mkdirSync(DIR,{recursive:true});
const output={id:'SMFGU-TALIA-V4-OAT-001',releaseSha:SHA,testRunnerSha:RUN_SHA,pinnedDeployment:PINNED,productionSignoff:false,origin:ORIGIN,checks:[],twoAccount:'NOT_TESTED',staff:'NOT_TESTED',noPayments:true,noProtectedWrites:true,completed:false};
const mark=(name,result,detail='')=>{output.checks.push({name,result,detail});console.log(result+' '+name+(detail?' '+detail:''))};
const fail=(code,msg)=>{const e=new Error(code+': '+msg);e.code=code;throw e};
const wait=(ms)=>new Promise(resolve=>setTimeout(resolve,ms));
const dataFor=async page=>page.evaluate(()=>{
 const el=document.querySelector('.tc-chart');
 const inst=el&&window.echarts?.getInstanceByDom?.(el);
 if(!inst)return null;
 const option=inst.getOption();
 const bars=option.series?.find(s=>s.type==='candlestick')?.data||[];
 const z=option.dataZoom?.[0];
 return {barCount:bars.length,series:option.series?.map(s=>String(s.name||''))||[],start:Number(z?.start??0),end:Number(z?.end??100),ema200:option.series?.find(s=>s.name==='EMA 200')?.data||null};
});
let browser;
try{
 assert(ORIGIN.startsWith('https://'),'Production acceptance URL must use HTTPS');
 // Pin an already-successful immutable Pages deployment. This permits genuine
 // interactive QA while other teams commit, without certifying moving production.
 // A different manifest SHA is always a hard failure.
 let deployed=false;
 for(let attempt=1;attempt<=(PINNED?1:4);attempt++){
  try{await requireExactDeployment();deployed=true;break;}
  catch(err){
   if(attempt===(PINNED?1:4))throw err;
   console.log('DEPLOYMENT_PENDING: exact SHA not yet active ('+attempt+'/4); recheck after 90s');
   await wait(90000);
  }
 }
 assert(deployed,'Exact deployment verification did not pass');
 mark('Verified immutable deployment source SHA','PASS','Pages manifest equals pinned source commit '+SHA.slice(0,8));
 for(const path of ['/talia-classroom.html','/talia-tutor-prototype.html','/assets/css/talia-terminal-v4.css?v=20261102','/assets/js/talia-classroom-v1.bundle.js?v=20261104-student-desk2']){
  const res=await fetch(ORIGIN+path,{signal:AbortSignal.timeout(25000)});
  assert.equal(res.status,200,'Release asset status '+res.status+' for '+path);
  const body=await res.text();
  assert(body.length>100,'Release asset empty '+path);
  if(path.endsWith('.html'))assert(body.includes('talia-terminal-v4.css'),'V4 stylesheet not linked '+path);
  if(path.includes('.bundle.js'))assert(body.includes('Load 200 candles for EMA 200'),'V4 bundle not included in immutable deployment');
 }
 mark('Exact deployed V4 assets','PASS','Two routes and versioned CSS/JS returned HTTP 200');
 browser=await chromium.launch({headless:true,args:['--no-sandbox','--disable-dev-shm-usage']});
 const guest=await browser.newContext({viewport:{width:1440,height:900},serviceWorkers:'block'});
 const anonymous=await guest.newPage();
 await anonymous.goto(ORIGIN+'/talia-classroom.html',{waitUntil:'domcontentloaded',timeout:35000});
 await wait(2500); // Allow redirect and React auth bootstrap to settle.
 const guestAccess=await anonymous.request.get(ORIGIN+'/api/member-tool-access?tool=MARKET_TUTOR',{timeout:20000});
 const guestResult=await guestAccess.json().catch(()=>({}));
 assert([401,403].includes(guestAccess.status())||(guestAccess.status()===200&&guestResult?.authorized!==true&&guestResult?.freeEligible!==true),'Unauthenticated Tutor API must not authorize guest');
 assert.equal(await anonymous.locator('.tp-chart-tools').count(),0,'Guest gained member-only chart controls');
 assert.equal(await anonymous.locator('.tc-chart canvas').count(),0,'Guest rendered a protected member chart');
 mark('Anonymous classroom lock','PASS','Server denies guest Tutor access; chart controls and plot are absent');
 const adminGuest=await anonymous.request.get(ORIGIN+'/api/admin?action=context',{timeout:20000});
 assert([401,403].includes(adminGuest.status()),'Guest accessed Admin context');
 mark('Anonymous staff route denial','PASS','Admin API rejected anonymous request');
 await guest.close();
 const email=process.env.LAB_QA_EMAIL||'',pwd=process.env.LAB_QA_PASSWORD||'';
 if(!email||!pwd)fail('BLOCKED_QA_CREDENTIALS','Existing encrypted James_Test browser QA credentials not supplied');
 const guardRequest=await fetch(ORIGIN+'/api/auth-guard-v0135',{signal:AbortSignal.timeout(20000)});
 if(!guardRequest.ok)fail('BLOCKED_AUTH_GUARD','Cannot determine live CAPTCHA policy');
 const guard=await guardRequest.json();
 if(guard?.ok!==true||guard?.enabled!==false)fail('BLOCKED_CAPTCHA','Owner-controlled CAPTCHA-off testing window is not active; never bypass CAPTCHA');
 const ctx=await browser.newContext({viewport:{width:1440,height:900},serviceWorkers:'block'});
 const page=await ctx.newPage();
 await page.goto(ORIGIN+'/signin.html?next=%2Fdashboard.html',{waitUntil:'domcontentloaded',timeout:35000});
 await page.locator('#login-identifier').fill(email);
 await page.locator('#login-password').fill(pwd);
 await page.locator('.auth-card button[type="submit"]').click();
 await page.waitForURL(u=>u.pathname==='/dashboard.html',{timeout:30000});
 const session=await page.evaluate(async()=>{
   const sb=await window.getSupabaseClient();
   const [{data:u},{data:s}]=await Promise.all([sb.auth.getUser(),sb.auth.getSession()]);
   return {id:u?.user?.id||null,hasSession:!!s?.session?.access_token};
 });
 assert(session.hasSession&&session.id===EXPECTED_ID,'James_Test browser identity does not match expected QA identity');
 mark('James_Test real browser sign-in','PASS','Verified Supabase identity and website login');
 await page.goto(ORIGIN+'/talia-classroom.html',{waitUntil:'domcontentloaded',timeout:35000});
 let accessProbe={route:new URL(page.url()).pathname,session:false,toolHttp:0,toolOk:false,authorized:false,freeEligible:false,rootPresent:false};
 let navigationsDuringProbe=0;
 for(let attempt=0;attempt<7;attempt++){
  await wait(1100);
  try{
   const candidate=await page.evaluate(async()=>{
    const result={route:location.pathname,session:false,toolHttp:0,toolOk:false,authorized:false,freeEligible:false,rootPresent:!!document.getElementById('talia-classroom-root')};
    try{
     const client=await window.getSupabaseClient?.();
     const {data}=await client.auth.getSession();
     result.session=!!data?.session?.access_token;
     if(result.session){
      const response=await fetch('/api/member-tool-access?tool=MARKET_TUTOR',{cache:'no-store',headers:{authorization:'Bearer '+data.session.access_token}});
      const j=await response.json().catch(()=>({}));
      result.toolHttp=response.status;result.toolOk=j?.ok===true;result.authorized=j?.authorized===true;result.freeEligible=j?.freeEligible===true;
     }
    }catch{}
    return result;
   });
   accessProbe=candidate;
   if(accessProbe.session&&accessProbe.toolOk)break;
  }catch(error){
   const msg=String(error?.message||'');
   if(/Execution context was destroyed|navigation/i.test(msg)){navigationsDuringProbe++;continue}
   throw error;
  }
 }
 accessProbe.route=new URL(page.url()).pathname;
 console.log('TALIA_NAVIGATION_RETRIES '+navigationsDuringProbe);
 console.log('TALIA_SAFE_ACCESS_PROBE '+JSON.stringify(accessProbe));
 if(!accessProbe.session)fail('BLOCKED_CLASSROOM_SESSION','Verified member session not preserved after opening classroom');
 if(!accessProbe.toolOk||(!accessProbe.authorized&&!accessProbe.freeEligible))fail('BLOCKED_TUTOR_ACCESS','No positive Tutor entitlement from server; HTTP '+accessProbe.toolHttp);
 try{await page.locator('.tp-chart-tools').waitFor({state:'visible',timeout:15000});}
 catch{
  const diag=await page.evaluate(()=>({route:location.pathname,hasRoot:!!document.getElementById('talia-classroom-root'),hasChartPanel:!!document.querySelector('.tc-chart-panel'),hasChartCanvas:!!document.querySelector('.tc-chart canvas'),hasEChartsLoader:!!window.CrownlightECharts}));
  console.error('TALIA_SAFE_RENDER_DIAGNOSTIC '+JSON.stringify(diag));
  await page.screenshot({path:DIR+'/render-blocker.png',fullPage:false}).catch(()=>{});
  fail('BLOCKED_CHART_RENDER','Authorized member but V4 chart controls not visible after 15 seconds');
 }
 await page.waitForFunction(()=>{const el=document.querySelector('.tc-chart');return !!(el&&window.echarts?.getInstanceByDom?.(el))},null,{timeout:30000});
 let state=await dataFor(page);
 assert.equal(state.barCount,7,'Seven completed base candles required initially');
 mark('Authenticated workstation renders','PASS','Seven initial fictional candles and professional controls');
 await page.getByLabel('Compare EMA 9 / 20 / 200 + VWAP').check();
 await page.getByRole('button',{name:/Load 200 candles for EMA 200/}).click();
 await page.waitForFunction(()=>document.querySelector('.tc-chart')&&window.echarts?.getInstanceByDom?.(document.querySelector('.tc-chart'))?.getOption()?.series?.find(s=>s.type==='candlestick')?.data?.length===200,null,{timeout:25000});
 state=await dataFor(page);
 assert.equal(state.barCount,200);
 for(const study of ['EMA 9','EMA 20','EMA 200','VWAP proxy'])assert(state.series.includes(study),'Missing expected rendered indicator: '+study);
 assert(state.ema200&&state.ema200.length===200&&state.ema200[199]!=null,'EMA 200 warmup did not complete');
 mark('EMA 9/20/200 and VWAP','PASS','200 observations and simultaneous named ECharts series');
 const interval=page.getByLabel('Completed interval');
 await interval.selectOption('3'); await page.waitForFunction(()=>window.echarts?.getInstanceByDom?.(document.querySelector('.tc-chart'))?.getOption()?.series?.find(s=>s.type==='candlestick')?.data?.length===66,null,{timeout:15000});
 const threeMin=await dataFor(page);
 assert.equal(threeMin.barCount,66);
 assert(threeMin.ema200?.every(x=>x==null),'EMA 200 must remain unavailable with 66 completed three-minute bars');
 await interval.selectOption('5'); await page.waitForFunction(()=>window.echarts?.getInstanceByDom?.(document.querySelector('.tc-chart'))?.getOption()?.series?.find(s=>s.type==='candlestick')?.data?.length===40,null,{timeout:15000});
 const fiveMin=await dataFor(page);
 assert.equal(fiveMin.barCount,40);
 assert(fiveMin.ema200?.every(x=>x==null),'EMA 200 must remain unavailable with 40 completed five-minute bars');
 await interval.selectOption('1'); await page.waitForFunction(()=>window.echarts?.getInstanceByDom?.(document.querySelector('.tc-chart'))?.getOption()?.series?.find(s=>s.type==='candlestick')?.data?.length===200,null,{timeout:15000});
 mark('One-, three-, five-minute aggregation','PASS','200 / 66 / 40 completed displayed bars');
 mark('No-lookahead indicator warmup','PASS','EMA 200 correctly unavailable on 66 three-minute and 40 five-minute candles');
 const visibleSource=await page.locator('.tc-chart').getAttribute('aria-label');
 assert(visibleSource?.includes('200 complete 1-minute'),'Chart aria-label must identify the completed timeframe and count');
 const bufferControl=page.getByLabel('Right buffer');
 await bufferControl.selectOption('3');
 const chartAxis=await page.evaluate(()=>{
  const inst=window.echarts?.getInstanceByDom?.(document.querySelector('.tc-chart'));
  return inst?.getOption()?.xAxis?.[0]?.data||[];
 });
 assert.equal(chartAxis.length,203,'Three blank right-buffer positions should not insert extra price candles');
 assert(chartAxis.slice(-3).every(x=>String(x).startsWith('Buffer ')),'Right buffer must be visibly distinguishable from actual candles');
 assert.equal((await dataFor(page)).barCount,200,'Right buffer must not add future candlesticks');
 await bufferControl.selectOption('0');
 mark('Chart aria-label and future-data boundary','PASS','Accessible 1-minute label, three empty buffer positions, and no future candles');
 await page.getByRole('button',{name:'Pan to older completed candles'}).click();await wait(350);
 const left=await dataFor(page);assert(left.start<80,'Pan left did not move available viewport');
 await page.getByRole('button',{name:'Pan to newer completed candles'}).click();await wait(350);
 const right=await dataFor(page);assert(right.start>left.start,'Pan right did not move available viewport');
 mark('Pan left and right','PASS','ECharts viewport changes in both directions');
 const plot=page.locator('.tc-chart');
 await plot.hover();
 const preWheel=await dataFor(page);
 await page.mouse.wheel(0,-320);
 await wait(400);
 const postWheel=await dataFor(page);
 assert(postWheel.end-postWheel.start<preWheel.end-preWheel.start-.05,'Mouse-wheel zoom did not reduce the visible chart window');
 mark('Mouse-wheel chart zoom','PASS','ECharts visible-window width decreased');
 const bounds=await plot.boundingBox();assert(bounds,'Chart bounding box unavailable');
 const x=bounds.x+bounds.width*.52,y=bounds.y+bounds.height*.45;
 const beforeDrag=await dataFor(page);
 await page.mouse.move(x,y);await page.mouse.down();await page.mouse.move(x+65,y+12,{steps:5});await page.mouse.up();await wait(350);
 const released=await dataFor(page);
 assert(Math.abs(released.start-beforeDrag.start)>.05||Math.abs(released.end-beforeDrag.end)>.05,'Actual pointer drag did not pan the chart');
 await page.mouse.move(x+115,y+30,{steps:5});await wait(350);
 const hovering=await dataFor(page);
 assert(Math.abs(released.start-hovering.start)<0.15&&Math.abs(released.end-hovering.end)<0.15,'Chart viewport kept panning after pointer release');
 mark('Pointer drag release','PASS','Viewport stays stable when moving mouse after releasing drag');
 await plot.screenshot({path:DIR+'/chart-desktop.png'});
 await page.getByRole('button',{name:'Teach this chart'}).click();
 const selectedQuestion=await page.locator('#tc-question').inputValue();
 assert(selectedQuestion.includes('200 revealed one-minute bars')&&!selectedQuestion.includes('unrevealed'), 'Selected chart context must reflect precisely revealed observations');
 mark('Talia chart-context preparation','PASS','200 revealed base candles passed into the ungraded Tutor question');
 const audit=page.locator('.tp-candle-audit');
 await audit.locator('summary').click();
 assert.equal(await audit.locator('tbody tr').count(),200,'Accessible historical ledger must include exactly the revealed prefix');
 mark('Accessible completed-candle ledger','PASS','200 revealed candles available in an HTML table for nonvisual inspection');
 const chartControls=page.locator('.tp-chart-tools');
 assert(await chartControls.getByLabel('Completed interval').isVisible());
 const pan=page.getByRole('button',{name:'Pan to older completed candles'});await pan.focus();assert(await pan.evaluate(el=>document.activeElement===el));
 await pan.press('Enter');
 mark('Keyboard control navigation','PASS','Focus, named controls, and Enter activation');
 await page.setViewportSize({width:390,height:844});
 await page.emulateMedia({reducedMotion:'reduce'});
 await page.locator('.tp-chart-tools').waitFor({state:'visible'});
 assert((await page.locator('.tc-chart').boundingBox())?.width<=390,'Chart overflow at mobile viewport');
 await page.locator('.tc-chart-panel').screenshot({path:DIR+'/chart-mobile.png'});
 mark('Responsive / reduced-motion surface','PASS','Mobile plot remains within 390px viewport; reduced motion requested');
 await page.setViewportSize({width:1440,height:900});
 // Ordinary QA members must NEVER be able to reach the Owner/Admin prototype.
 // Staff-positive acceptance is an independent identity/entitlement test.
 const memberToken=await page.evaluate(async()=>{
  const sb=await window.getSupabaseClient();
  const {data}=await sb.auth.getSession();
  return data?.session?.access_token||null;
 });
 assert(memberToken,'Member token unavailable before staff negative-path check');
 const memberStaff=await page.request.get(ORIGIN+'/api/admin?action=context',{
  headers:{authorization:'Bearer '+memberToken},timeout:20000
 });
 const memberStaffJson=await memberStaff.json().catch(()=>({}));
 const memberHasStaffRights=memberStaffJson?.ok===true&&
  Array.isArray(memberStaffJson?.roles)&&
  memberStaffJson.roles.some(role=>['OWNER','ADMIN','TECH_ADMIN'].includes(role))&&
  Array.isArray(memberStaffJson?.permissions)&&memberStaffJson.permissions.includes('control_panel.access');
 assert(!memberHasStaffRights,'Designated ordinary QA member unexpectedly has staff permissions');
 await page.goto(ORIGIN+'/talia-tutor-prototype.html',{waitUntil:'domcontentloaded',timeout:35000});
 await page.waitForFunction(()=>{
  const a=document.getElementById('tp-auth'),w=document.getElementById('tp-workspace');
  return !!a&&!!w&&!a.hidden&&w.hidden&&
   /staff|owner|administrator|authorized|permission|sign in|session/i.test(a.textContent||'');
 },null,{timeout:20000});
 assert.equal(await page.locator('#tp-workspace').isVisible(),false,
  'Ordinary member opened the restricted staff workspace');
 // The status label may briefly reflect a session revalidation cycle.
 // Verify the authorization outcome, not brittle exact UI copy: staff
 // success must never appear and the protected workspace must stay hidden.
 assert(!(await page.locator('#tp-connection').innerText()).includes('Authorized staff session'),
  'Ordinary member saw a false authorized-staff status');
 mark('Ordinary member prototype deny','PASS',
  'Authenticated member lacks Owner/Admin rights; prototype workspace remains hidden');
 const staffEmail=process.env.CROWN_QA_STAFF_EMAIL||'',staffPassword=process.env.CROWN_QA_STAFF_PASSWORD||'';
 if(!staffEmail||!staffPassword){
  output.staff='BLOCKED_AUTHORIZED_STAFF_CREDENTIALS';
  mark('Owner/Admin prototype positive','BLOCKED',
   'No genuine authorized staff QA credentials; member was not elevated or impersonated');
 }else{
  const sc=await browser.newContext({viewport:{width:1440,height:900},serviceWorkers:'block'});
  try{
   const sp=await sc.newPage();
   await sp.goto(ORIGIN+'/signin.html?next=%2Fdashboard.html',{waitUntil:'domcontentloaded',timeout:35000});
   await sp.locator('#login-identifier').fill(staffEmail);
   await sp.locator('#login-password').fill(staffPassword);
   await sp.locator('.auth-card button[type="submit"]').click();
   await sp.waitForURL(u=>u.pathname==='/dashboard.html',{timeout:30000});
   const verified=await sp.evaluate(async()=>{
    const sb=await window.getSupabaseClient();
    const [{data:u},{data:s}]=await Promise.all([sb.auth.getUser(),sb.auth.getSession()]);
    return {id:u?.user?.id||null,token:s?.session?.access_token||null};
   });
   assert(verified.id&&verified.id!==EXPECTED_ID&&verified.token,
    'Positive staff QA must use a genuinely distinct authenticated identity');
   const staffResponse=await sp.request.get(ORIGIN+'/api/admin?action=context',{
    headers:{authorization:'Bearer '+verified.token},timeout:20000
   });
   assert.equal(staffResponse.status(),200,'Real staff session denied by admin context API');
   const staff=await staffResponse.json();
   assert(staff?.ok===true&&Array.isArray(staff.roles)&&
    staff.roles.some(role=>['OWNER','ADMIN','TECH_ADMIN'].includes(role))&&
    Array.isArray(staff.permissions)&&staff.permissions.includes('control_panel.access'),
    'Authenticated account lacks legitimate staff role and control-panel permission');
   await sp.goto(ORIGIN+'/talia-tutor-prototype.html',{waitUntil:'domcontentloaded',timeout:35000});
   await sp.locator('#tp-workspace').waitFor({state:'visible',timeout:30000});
   assert((await sp.locator('#tp-connection').innerText()).includes('Authorized staff session'),
    'Positive staff session not confirmed in UI');
   await sp.locator('.tp-chart-tools').waitFor({state:'visible',timeout:30000});
   output.staff='PASS';
   mark('Owner/Admin prototype positive','PASS',
    'Distinct authenticated staff identity, permission API and real prototype toolbar verified');
  }finally{await sc.close()}
 }
 // Reuse the independently authenticated second noncommercial member account
 // already established by Academy privacy QA; no synthetic session or paid grant.
 const directSecondary=!!(process.env.CROWN_QA_FREE_EMAIL&&process.env.CROWN_QA_FREE_PASSWORD);
 const explicitSecondary=!!(process.env.LAB_QA_SECOND_EMAIL&&process.env.LAB_QA_SECOND_PASSWORD);
 const secondEmail=directSecondary?process.env.CROWN_QA_FREE_EMAIL:
  explicitSecondary?process.env.LAB_QA_SECOND_EMAIL:
  'stockmarketfromthegroundup+smfgu-qa2v1@gmail.com';
 const secondPwd=directSecondary?process.env.CROWN_QA_FREE_PASSWORD:
  explicitSecondary?process.env.LAB_QA_SECOND_PASSWORD:
  (pwd?createHmac('sha256',pwd).update('smfgu:isolated-second-qa:2026-10-31:v1').digest('hex')+'Qa2!':'');
 if(!secondEmail||!secondPwd){
  output.twoAccount='BLOCKED_SECOND_ACCOUNT_SECRETS';
  mark('Cross-member Tutor privacy','BLOCKED','Independent QA_Secondary credentials were not configured; no impersonation attempted');
 }else{
  const second=await browser.newContext({viewport:{width:1280,height:900},serviceWorkers:'block'});
  const p2=await second.newPage();
  await p2.goto(ORIGIN+'/signin.html?next=%2Fdashboard.html',{waitUntil:'domcontentloaded',timeout:35000});
  await p2.locator('#login-identifier').fill(secondEmail);
  await p2.locator('#login-password').fill(secondPwd);
  await p2.locator('.auth-card button[type="submit"]').click();
  await p2.waitForURL(u=>u.pathname==='/dashboard.html',{timeout:30000});
  const other=await p2.evaluate(async()=>{const sb=await window.getSupabaseClient();const {data:s}=await sb.auth.getSession();return {id:s.session?.user?.id||null,token:s.session?.access_token||null}});
  assert(other.id&&other.id!==EXPECTED_ID,'Second member identity equals James_Test');
  const owned=await p2.request.get(ORIGIN+'/api/member-tutor-history',{headers:{authorization:'Bearer '+other.token}});
  const forged=await p2.request.get(ORIGIN+'/api/member-tutor-history?user_id='+EXPECTED_ID,{headers:{authorization:'Bearer '+other.token}});
  assert.equal(owned.status(),forged.status(),'Client-provided member override changes authorization status');
  if(owned.status()===200){
    const a=await owned.json(),b=await forged.json();
    assert(a?.ok===true&&b?.ok===true&&Array.isArray(a.history)&&Array.isArray(b.history),'Tutor history must be a real member-owned array');
    assert.deepEqual(a.history,b.history,'Client user_id changed member-owned history');
  }else assert([401,403].includes(owned.status()),'Unexpected second-account Tutor history status');
  output.twoAccount='PASS';
  mark('Cross-member Tutor privacy','PASS','Two real independent Auth users; forged history owner query had no effect');
  await second.close();
 }
 await ctx.close();
 await requireExactDeployment(); // Catch production drift while browser QA was running.
 mark('Verified immutable SHA after browser','PASS','Pinned Pages deployment has not changed');
 output.completed=output.checks.every(c=>c.result==='PASS')&&output.twoAccount==='PASS'&&output.staff==='PASS';
 if(!output.completed)fail('RELEASE_HOLD','Browser and privacy gates require complete verified PASS');
}catch(err){
 output.failureCode=String(err?.code||'ACCEPTANCE_FAILURE').slice(0,80);
 output.failureMessage=String(err?.message||'unknown').replace(/Bearer\s+\S+/gi,'Bearer [REDACTED]').slice(0,450);
 console.error('RELEASE NOT ACCEPTED',output.failureCode,output.failureMessage);
 process.exitCode=1;
}finally{
 writeFileSync(DIR+'/results.json',JSON.stringify(output,null,2)+'\n');
 try{await browser?.close()}catch{}
 console.log('ACCEPTANCE_RESULT '+JSON.stringify({releaseSha:SHA,pinnedDeployment:PINNED,productionSignoff:false,completed:output.completed,passed:output.checks.filter(x=>x.result==='PASS').length,blocked:output.checks.filter(x=>x.result==='BLOCKED').length,failureCode:output.failureCode||null,twoAccount:output.twoAccount,staff:output.staff}));
}
