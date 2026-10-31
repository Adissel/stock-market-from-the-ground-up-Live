/* Real production member QA in free GitHub Actions Chromium.
 * Uses existing encrypted credentials for a genuine GoTrue-issued session;
 * sets that valid session in the browser. This DOES NOT verify the human CAPTCHA
 * login screen. Never logs credentials/tokens, writes workspaces or spends Lumens.
 */
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {chromium} from 'playwright';
const origin='https://stock-market-from-the-ground-up-d1r.pages.dev';
const userId='f42f9301-18e6-43a3-8531-32d371fd22c1';
const email=process.env.LAB_QA_EMAIL||'',password=process.env.LAB_QA_PASSWORD||'';
if(!email||!password)throw Error('BLOCKED: QA secrets absent');
const config=readFileSync('config.js','utf8');
const supabaseUrl=config.match(/SUPABASE_URL:\s*'([^']+)'/)?.[1];
const pub=config.match(/SUPABASE_ANON_KEY:\s*'([^']+)'/)?.[1];
assert(supabaseUrl&&pub,'Public Supabase project configuration unavailable');
const response=await fetch(supabaseUrl+'/auth/v1/token?grant_type=password',{
 method:'POST',headers:{apikey:pub,'content-type':'application/json'},
 body:JSON.stringify({email,password}),signal:AbortSignal.timeout(25000)
});
const login=await response.json().catch(()=>({}));
if(!response.ok||!login?.access_token||!login?.refresh_token)
 throw Error('BLOCKED: real QA GoTrue credential grant denied, HTTP '+response.status);
assert.equal(login.user?.id,userId,'Wrong QA identity');
const browser=await chromium.launch({headless:true,args:['--no-sandbox']});
let browserWrites=0;
const automaticApiWrites=[];
try{
 const context=await browser.newContext({viewport:{width:1440,height:900},serviceWorkers:'block'});
 const page=await context.newPage();
 page.on('request',request=>{
  try{
   const u=new URL(request.url());
   if(u.origin===origin&&u.pathname.startsWith('/api/')&&
      !['GET','HEAD','OPTIONS'].includes(request.method())){
    automaticApiWrites.push(request.method()+' '+u.pathname);
    if(/^\/api\/(?:chart-workspace|chart-mixed-test|chart-cash-upgrade|member-sparks|stripe|founding600-checkout|alpaca-paper|watchlist-journal-transfer)/.test(u.pathname))browserWrites++;
   }
  }catch{}
 });
 const errors=[];
 page.on('pageerror',err=>errors.push(String(err.message).slice(0,140)));
 await page.goto(origin+'/index.html',{waitUntil:'domcontentloaded',timeout:30000});
 await page.waitForFunction(()=>typeof window.getSupabaseClient==='function',null,{timeout:20000});
 const established=await page.evaluate(async tokens=>{
  const sb=await window.getSupabaseClient();
  const {data,error}=await sb.auth.setSession(tokens);
  return {ok:!error&&!!data?.session?.access_token,id:data?.user?.id||null};
 },{access_token:login.access_token,refresh_token:login.refresh_token});
 assert(established.ok&&established.id===userId,'Real QA session was not established in Chromium');
 await page.goto(origin+'/simulator.html?studio=ADVANCED',{waitUntil:'domcontentloaded',timeout:30000});
 async function verify(label){
  await page.waitForFunction(()=>window.CrownlightChartTiers?.getStatus?.().verified===true,null,{timeout:35000});
  await page.waitForFunction(()=>window.CrownlightWorkspaceV2?.getStatus?.().memberVerified===true,null,{timeout:35000});
  await page.waitForFunction(()=>window.CrownlightChartTiers.getStatus().selected==='ADVANCED',null,{timeout:25000});
  const state=await page.evaluate(()=>({
   chart:window.CrownlightChartTiers.getStatus(),
   workspace:window.CrownlightWorkspaceV2.getStatus()
  }));
  assert.equal(state.chart.tier,'ADVANCED',label+' actual server tier');
  assert.deepEqual(state.chart.allowed,['STANDARD','ADVANCED'],label+' allowed tiers');
  assert.equal(state.chart.selected,'ADVANCED',label+' automatically selected current entitlement');
  assert.equal(state.workspace.selected,'ADVANCED',label+' restored former Professional workspace as Advanced');
  assert(state.workspace.revision,label+' existing saved workspace revision');
  assert.equal(await page.locator('input[data-cl-studies]').inputValue(),'EMA, RSI',label+' studies restored');
  assert.equal(await page.locator('input[data-cl-sync]').isChecked(),false,label+' synchronization preference restored');
  assert.equal(await page.locator('select[data-cl-layout]').isDisabled(),true,label+' Professional layout disabled');
  assert.equal(await page.locator('select[data-cl-layout]').inputValue(),'SIDE_BY_SIDE',label+' no premium layout revealed');
  return {tier:state.chart.tier,selected:state.chart.selected,workspaceRevision:state.workspace.revision};
 }
 const first=await verify('Initial visit');
 await page.evaluate(()=>window.CrownlightChartTiers.choose('PROFESSIONAL'));
 assert.equal(await page.evaluate(()=>window.CrownlightChartTiers.getStatus().selected),
  'ADVANCED','Forbidden Professional Studio selection must not mount');
 // Chart visualization is tested with first-party fictional data, never provider bars.
 const source=page.locator('#sim-mode-csv');
 const load=page.locator('#sim-load-fictional');
 assert(await source.count()&&await load.count(),'Existing fictional chart controls unavailable');
 await source.click();
 if(await load.isVisible()){
  await load.click();
 }else{
  // The production layout can hide legacy controls when Enhanced Studio
  // is selected. Exercise the exact first-party handler without claiming
  // the legacy load button was visually clickable.
  console.log('WARN Legacy fictional-load button hidden in Advanced workspace; checking engine with first-party DOM action. Visible starter path remains unaccepted.');
  await page.evaluate(()=>{
   const button=document.getElementById('sim-load-fictional');
   if(!button||button.disabled||typeof button.onclick!=='function')
    throw Error('Existing first-party fictional starter action is not initialized');
   button.click();
  });
 }
 await page.waitForFunction(()=>window.CrownlightChartTiers?.getRevealedBars?.().length>=2,null,{timeout:30000});
 await page.waitForFunction(()=>window.CrownlightChartTiers?.getInstances?.().some(x=>x.chart?.getDataList?.().length>=2),
  null,{timeout:30000});
 const rendered=await page.evaluate(()=>{
  const c=window.CrownlightChartTiers;
  return {bars:c.getRevealedBars().length,charts:c.getInstances().length,
   candleBars:c.getInstances()[0]?.chart?.getDataList?.().length||0};
 });
 assert(rendered.candleBars>=2&&rendered.charts===1,
  'Advanced one-pane fictional chart must render without Professional multi-chart');
 await page.reload({waitUntil:'domcontentloaded'});
 const second=await verify('Reload');
 assert.equal(second.workspaceRevision,first.workspaceRevision,'Saved workspace was unexpectedly mutated');
 assert.equal(browserWrites,0,'Browser must never mutate private workspace, payment, Lumens or orders');
 if(automaticApiWrites.length)console.log('INFO Normal site background API methods (no protected payment/workspace/Lumens routes): '+JSON.stringify([...new Set(automaticApiWrites)]));
 assert.equal(errors.length,0,'Unhandled browser errors: '+JSON.stringify(errors.slice(0,3)));
 console.log('PASS REAL AUTHENTICATED CHROMIUM James_Test Advanced tier, real KLine candles, Professional lock, saved EMA+RSI restored across reload, no writes');
 console.log('RESULT '+JSON.stringify({scope:'PRODUCTION_BROWSER_GOTRUE_SESSION',mode:'ACTUAL_BROWSER_NOT_LOGIN_FORM',
  tier:'ADVANCED',workspaceRestored:true,savedProfessionalProtected:true,fictionalChart:rendered,
  providerCharges:0,browserApiWrites:browserWrites,loginCaptchaUiAccepted:false,checkedUtc:new Date().toISOString()}));
 await context.close();
}finally{await browser.close()}
