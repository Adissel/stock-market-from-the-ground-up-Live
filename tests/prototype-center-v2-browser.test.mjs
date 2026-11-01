/* Synthetic Prototype Center Chromium browser acceptance; no LIVE sign-ins or payment calls. */
import assert from 'node:assert/strict';
import {chromium} from 'playwright';
import AxeBuilder from '@axe-core/playwright';
import {onRequest as accessLauncher} from '../functions/_middleware.js';
import {readFileSync} from 'node:fs';
const protectedHtml=readFileSync('prototype.html','utf8');
const BASE=process.env.PT_BROWSER_BASE||'http://127.0.0.1:8768';
const fakeCases=[
 {id:'CL-PROTO-VWAP-01',topic:'VWAP reclaim',name:'Fictional VWAP calculation',type:'FICTIONAL',objective:'Calculate the OHLCV typical-price weighted proxy, not trade-print VWAP.',note:'Synthetic example only.',candles:[
 {time:'09:30',open:10,high:10.4,low:9.8,close:10.2,volume:1000},{time:'09:31',open:10.2,high:10.5,low:10.1,close:10.4,volume:1500},
 {time:'09:32',open:10.4,high:10.4,low:10,close:10.1,volume:2000},{time:'09:33',open:10.1,high:10.6,low:10.1,close:10.5,volume:2500}
 ],question:'What is the typical price of the first candle?',instructor:'Compare the candle close to VWAP and check later confirmation.'},
 {id:'CL-PROTO-BREAKOUT-02',topic:'Breakout',name:'Fictional breakout rejection',type:'FICTIONAL',objective:'Compare breakout and failed breakout.',note:'Synthetic only.',candles:[
 {time:'09:30',open:20,high:20.3,low:19.9,close:20.2,volume:1200},{time:'09:31',open:20.2,high:20.35,low:20.05,close:20.25,volume:900},
 {time:'09:32',open:20.25,high:20.6,low:20.1,close:20.15,volume:2200},{time:'09:33',open:20.15,high:20.25,low:19.8,close:19.9,volume:1800}
 ],question:'How many dollars per share did the third candle reject from its $20.60 high to its $20.15 close?',instructor:'Observe the wick rejection.'},
 {id:'CL-PROTO-RISK-03',topic:'Risk planning',name:'Fictional risk/reward',type:'FICTIONAL',objective:'Compute dollar risk per share.',note:'Synthetic only.',candles:[
 {time:'09:30',open:15,high:15.15,low:14.85,close:15.05,volume:800},{time:'09:31',open:15.05,high:15.3,low:15,close:15.25,volume:1200},
 {time:'09:32',open:15.25,high:15.45,low:15.1,close:15.3,volume:1400},{time:'09:33',open:15.3,high:15.55,low:15.15,close:15.5,volume:1700}
 ],question:'What is per-share risk for entry $15.25 and stop $15.00?',instructor:'Risk is $0.25 per share.'}
];
const browser=await chromium.launch({headless:true,args:['--no-sandbox']});
async function session(role,viewport){
 let currentRole=role;
 const context=await browser.newContext({viewport,serviceWorkers:'block'});
 await context.route(/\/prototype\.html(?:\?.*)?$/,async route=>{
  const response=await accessLauncher({request:new Request(route.request().url()),env:{},next:async()=>{throw Error('Public static prototype must not be returned')}});
  await route.fulfill({status:response.status,contentType:'text/html',headers:Object.fromEntries(response.headers),body:await response.text()});
 });
 await context.route('**/api/prototype-document',route=>{
  if(currentRole==='OWNER'||currentRole==='ADMIN')
   return route.fulfill({status:200,contentType:'text/html',body:protectedHtml,headers:{'cache-control':'private, no-store'}});
  return route.fulfill({status:403,contentType:'application/json',body:JSON.stringify({ok:false,error:'Denied'})});
 });
 await context.route('**/assets/js/supabase-client.js',route=>route.fulfill({status:200,contentType:'application/javascript',body:`
window.getSupabaseClient=async()=>({auth:{
 getSession:async()=>({data:{session:{access_token:'qa-test-token',user:{id:'qa-user'}}}}),
 getUser:async()=>({data:{user:{id:'qa-user'}},error:null}),
 onAuthStateChange:()=>({data:{subscription:{unsubscribe(){}}}})
}});
`}));
 await context.route('**/api/admin?action=context',route=>route.fulfill({status:200,contentType:'application/json',body:JSON.stringify({ok:true,roles:[currentRole],permissions:currentRole==='OWNER'||currentRole==='ADMIN'?['control_panel.access']:[]})}));
 await context.route('**/api/bootcamp-academy?action=catalog',route=>route.fulfill({
  status:200,contentType:'application/json',body:JSON.stringify({ok:true,version:'synthetic-browser-contract',
   programs:[['free5',5],['truth5',5],['watchlist7',7],['scanners10',10],['foundations30',30],
    ['charts45',45],['risk60',60],['practicum90',90],['tape10',10],['indicators10',10],['filings7',7]]
    .map(([code,days])=>({code,name:code+' synthetic QA catalog reference',days,route:'bootcamp-academy.html?program='+code}))})
 }));
 await context.route('**/api/prototype-training-cases',route=>route.fulfill({status:currentRole==='OWNER'||currentRole==='ADMIN'?200:403,contentType:'application/json',body:JSON.stringify({ok:currentRole==='OWNER'||currentRole==='ADMIN',source:'FICTIONAL_PROTOTYPE',gradingEnabled:false,privateAnswerKeysIncluded:false,cases:fakeCases})}));
 const versions=Object.fromEntries(['FREE','FOUNDING_14','FOUNDING_30','FOUNDING_60','FULL_MONTHLY','FULL_ANNUAL','LIFETIME','ONDEMAND_MONTHLY'].map(x=>[x,1]));
 await context.route('**/api/prototype-classroom-presets',async route=>{
  if(currentRole!=='OWNER'&&currentRole!=='ADMIN')return route.fulfill({status:403,contentType:'application/json',body:'{"ok":false}'});
  if(route.request().method()==='GET')return route.fulfill({status:200,contentType:'application/json',body:JSON.stringify({
   ok:true,isDraftOnly:true,memberFacingEnabled:false,presets:Array.from({length:20},(_,i)=>({preset_code:'preset-'+i})),
   memberships:Object.keys(versions).map(plan_code=>({plan_code})),layouts:Object.keys(versions).map(plan_code=>({plan_code,channel:'draft',version:versions[plan_code],preset_code:'foundation-focus',config:{id:'foundation-focus'}})),history:[]
  })});
  const input=route.request().postDataJSON(),version=versions[input.planCode];
  if(input.expectedVersion!==version)return route.fulfill({status:409,contentType:'application/json',body:'{"ok":false,"error":"Version conflict"}'});
  versions[input.planCode]++;
  return route.fulfill({status:200,contentType:'application/json',body:JSON.stringify({ok:true,saved:{plan_code:input.planCode,version:versions[input.planCode]},revisionCaptured:true,published:false})});
 });

 const page=await context.newPage();return{context,page,revoke:()=>{currentRole='MODERATOR'}};
}
try{
 for(const role of ['MODERATOR','SHOWCASE_VIEWER','FREE']){
  const {context,page}=await session(role,{width:1100,height:750});
  await page.goto(BASE+'/prototype.html?view=classic',{waitUntil:'domcontentloaded'});
  await page.waitForFunction(()=>document.getElementById('prototype-access-status')?.textContent?.includes('access denied'),null,{timeout:12000});
  assert.equal(await page.locator('#pt-app').count(),0,role+' must not receive protected application HTML');
  await context.close();
 }
 for(const [role,viewport] of [['OWNER',{width:1280,height:900}],['ADMIN',{width:768,height:900}],['OWNER',{width:390,height:844}]]){
  const {context,page,revoke}=await session(role,viewport);
  const exceptions=[];page.on('pageerror',error=>exceptions.push(error.message));
  await page.goto(BASE+'/prototype.html?view=classic',{waitUntil:'domcontentloaded'});
  await page.locator('#pt-app').waitFor({state:'visible',timeout:16000});
  await page.locator('#pt-command-deck .pt-command-link').first().waitFor({state:'visible',timeout:20000});
  assert.equal(await page.locator('#pt-command-deck .pt-command-link').count(),6,'React command deck must appear at authorized entry');
  assert.equal(await page.locator('#pt-experience').isVisible(),true,'Interactive chart must be visible on the primary page');
  assert.equal(await page.locator('#pt-experience #pt-chart').count(),1,'The ECharts canvas must be prominent, not buried beneath editing controls');
  const screenOrder=await page.evaluate(()=>({preview:document.getElementById('pt-experience').getBoundingClientRect().top,
    designer:document.getElementById('pt-designer').getBoundingClientRect().top}));
  assert.ok(screenOrder.preview<screenOrder.designer,'Chart and live lesson must precede the long editor');

  // Actual staff-only source inspector: public 419 Labs / 73 research briefs /
  // 16 calculated studies, plus a deterministic local Academy catalog fixture.
  if(role==='OWNER'){
   await page.locator('#pt-curriculum-parity > summary').click();
   await page.locator('#pt-parity-body .pt-parity-totals').waitFor({state:'visible',timeout:18000});
   assert.match(await page.locator('.pt-parity-totals').innerText(),/419 canonical Lab pathways/);
   assert.match(await page.locator('.pt-parity-totals').innerText(),/73 indicator teaching guides/);
   assert.equal(await page.locator('.pt-parity-list button[data-key]').count(),30,'First page of canonical Labs');
   await page.locator('.pt-parity-load-more').click();
   assert.equal(await page.locator('.pt-parity-list button[data-key]').count(),60,'Second page of canonical Labs is visible');
   await page.locator('#pt-parity-search').fill('F1-C02-L01');
   assert.match(await page.locator('.pt-parity-inspector').innerText(),/Basic Historical Replay Setup/);
   assert.equal(await page.locator('.pt-parity-inspector details').count(),5,'Current Lab preview must expose all five original teaching facets');
   assert.equal(await page.locator('.pt-parity-inspector details').first().evaluate(el=>el.open),true,'Understand facet opens first for a new learner');
   assert.match(await page.locator('.pt-parity-inspector').innerText(),/ungra(ded|ded)/i);
   await page.locator('[data-parity-tab="guides"]').click();
   assert.equal(await page.locator('.pt-parity-list button[data-key]').count(),30,'Initial indicator page');
   await page.locator('.pt-parity-load-more').click();
   assert.equal(await page.locator('.pt-parity-list button[data-key]').count(),60,'All but one indicator');
   await page.locator('.pt-parity-load-more').click();
   assert.equal(await page.locator('.pt-parity-list button[data-key]').count(),73,'All 73 authored indicator guides are inspectable');
   await page.locator('#pt-parity-family').selectOption('Trend');
   assert.equal(await page.locator('.pt-parity-list button[data-key]').count(),17,'All 17 Trend studies can be individually inspected');
   await page.locator('#pt-parity-family').selectOption('ALL');
   await page.locator('#pt-parity-search').fill('STUDY_ELDER_RAY');
    assert.match(await page.locator('.pt-parity-inspector').innerText(),/Elder-Ray Bull and Bear Power/);
    assert.match(await page.locator('.pt-parity-inspector').innerText(),/Interpretation-only scenario/);
    await page.locator('#pt-parity-search').fill('STUDY_EMA');
   assert.match(await page.locator('.pt-parity-inspector').innerText(),/Exponential Moving Average/i);
   assert.match(await page.locator('.pt-parity-inspector').innerText(),/Limitations/i);
   assert.match(await page.locator('.pt-parity-inspector').innerText(),/Ungraded self-check/i);
   assert.match(await page.locator('.pt-parity-inspector').innerText(),/Ungraded review explanation/i);
   assert.match(await page.locator('.pt-parity-inspector').innerText(),/Calculation acceptance/i);
   const studySources=page.locator('.pt-parity-inspector .pt-parity-sources a');
   assert.ok(await studySources.count()>0,'Every authored study preview must show public source links');
   const unsafeSources=await studySources.evaluateAll(links=>links.filter(a=>
     !a.href.startsWith('https://')||a.getAttribute('rel')!=='noopener noreferrer'||a.target!=='_blank').length);
   assert.equal(unsafeSources,0,'Source references must open safely and never invoke an internal action');
   await page.locator('[data-parity-tab="computed"]').click();
   await page.locator('#pt-parity-search').fill('VWAP');
   assert.match(await page.locator('.pt-parity-inspector').innerText(),/NOT transaction VWAP/i);
   await page.locator('[data-parity-tab="academy"]').click();
   await page.locator('#pt-parity-search').fill('risk60');
   assert.match(await page.locator('.pt-parity-inspector').innerText(),/60 study days/);
   assert.match(await page.locator('.pt-parity-inspector').innerText(),/No individually source-documented instructional-day example/);
   await page.locator('#pt-parity-search').fill('free5');
   assert.equal(await page.locator('.pt-parity-inspector .pt-parity-lesson').count(),5,'Five authentic Free evidence lessons available');
   await page.locator('.pt-parity-inspector .pt-parity-lesson').first().locator('summary').click();
   assert.match(await page.locator('.pt-parity-inspector').innerText(),/100 \/ 1,000,000|100 shares out of 1,000,000/);
   await page.locator('#pt-parity-search').fill('watchlist7');
   assert.equal(await page.locator('.pt-parity-inspector .pt-parity-lesson').count(),2,'Two supported Watchlist day examples; no invented remaining days');
   await page.locator('#pt-parity-search').fill('scanners10');
   assert.equal(await page.locator('.pt-parity-inspector .pt-parity-lesson').count(),1,'One supported Scanner source-backed case');
   await page.locator('#pt-curriculum-parity > summary').click();
   assert.equal(await page.locator('#pt-curriculum-parity').evaluate(el=>el.open),false);
  }


  await page.locator('[data-prototype-case]').waitFor({state:'visible',timeout:14000});
  assert.equal(await page.locator('#pt-nav button').count(),23);
  assert.equal(await page.locator('#pt-membership option').count(),9,'all approved membership products including Pick What You Want should be previewable');
  await page.locator('#pt-membership').selectOption('LIFETIME');
  await page.locator('#pt-nav button:has-text("Classroom Builder")').click();
  await page.locator('select[aria-label="Classroom preset — 20 available"]').waitFor({state:'visible'});
  assert.equal(await page.locator('select[aria-label="Classroom preset — 20 available"] option').count(),20);
  await page.locator('select[aria-label="Classroom preset — 20 available"]').selectOption('candle-anatomy');
  await page.locator('select[aria-label="Bar detail"]').selectOption('Expert');
  assert.match(await page.locator('#pt-bar-inspector').textContent(),/Upper wick/);
  await page.locator('#pt-save').click();
  await page.locator('#pt-membership').selectOption('FULL_ANNUAL');
  assert.match(await page.locator('#pt-content').textContent(),/Study Academy/);
  await page.locator('select[aria-label="Classroom preset — 20 available"]').selectOption('presentation');
  await page.locator('#pt-membership').selectOption('LIFETIME');
  assert.equal(await page.locator('select[aria-label="Classroom preset — 20 available"]').inputValue(),'candle-anatomy','presets must remain separate by membership');
  await page.locator('#pt-membership').selectOption('ONDEMAND_MONTHLY');
  assert.match(await page.locator('#pt-content').textContent(),/Replay Classroom/);
  await page.locator('#pt-membership').selectOption('FREE');
  await page.locator('#pt-remote-controls').waitFor({state:'visible'});
  await page.locator('#pt-remote-controls button:has-text("Save server draft")').click();
  await page.waitForFunction(()=>document.querySelector('#pt-remote-controls')?.textContent?.includes('Draft v2 saved'),null,{timeout:12000});


  await page.waitForFunction(()=>document.querySelector('#pt-chart-status')?.textContent?.startsWith('Interactive'),null,{timeout:20000});
  assert.match(await page.locator('#pt-metric-close').textContent(),/[0-9]/,'Price strip reflects synthetic source');
  assert.equal(await page.locator('#pt-chart-proxy').getAttribute('aria-pressed'),'false');
  await page.locator('#pt-chart-proxy').click();
  assert.equal(await page.locator('#pt-chart-proxy').getAttribute('aria-pressed'),'true');
  await page.locator('#pt-chart-proxy').click();
  await page.locator('#pt-chart-volume').click();
  assert.equal(await page.locator('#pt-chart-volume').getAttribute('aria-pressed'),'false');
  await page.locator('#pt-chart-volume').click();
  await page.locator('#pt-chart-grid').click();
  assert.equal(await page.locator('#pt-chart-grid').getAttribute('aria-pressed'),'false');
  await page.locator('#pt-chart-grid').click();
  await page.locator('#pt-chart-reset').click();
  await page.locator('#pt-command-deck .pt-command-view:has-text("Chart focus")').click();
  assert.equal(await page.locator('#pt-experience').getAttribute('data-view'),'focus-chart');
  await page.locator('#pt-command-deck .pt-command-view:has-text("Lesson focus")').click();
  assert.equal(await page.locator('#pt-experience').getAttribute('data-view'),'focus-lesson');
  await page.locator('#pt-command-deck .pt-command-view:has-text("Split")').click();
  assert.equal(await page.locator('#pt-experience').getAttribute('data-view'),'analysis');

  await page.locator('[data-prototype-case] button:has-text("Reveal next candle")').click();
  assert.match(await page.locator('[data-prototype-case]').textContent(),/Visible 3 of 4 candles/);
  // The staff-only 3D workbench is dynamically mounted and remains fictional/read-only.
  await page.locator('#pt-command-deck button:has-text("3D / WebGL")').click();
  assert.equal(await page.locator('#pt-title').textContent(),'3D Experiments','React quick navigation must drive JavaScript workspace behavior');
  await page.locator('#pt-three-count').waitFor({state:'visible',timeout:20000});
  await page.locator('#pt-three-camera').selectOption('orthographic');
  assert.equal(await page.locator('#pt-three-camera').inputValue(),'orthographic');
  await page.locator('#pt-three-count').focus();
  for(let i=0;i<4;i++)await page.keyboard.press('ArrowLeft');
  assert.match(await page.locator('#pt-three-lab').textContent(),/8 of 16/);
  await page.locator('#pt-three-lab summary').click();
  assert.equal(await page.locator('#pt-three-lab tbody tr').count(),8);
  await page.locator('#pt-three-lab button:has-text("Reset 3D view")').click();
  await page.locator('#pt-nav button:has-text("Boot Camp Classroom")').click();
  await page.locator('[data-prototype-case]').waitFor({state:'visible'});
  await page.locator('#pt-nav button:has-text("Interactive Labs")').click();
  await page.locator('[data-prototype-case]').waitFor({state:'visible'});
  assert.match(await page.locator('[data-prototype-case]').textContent(),/Ungraded guided check/);
  await page.locator('[data-prototype-case] select[aria-label="Choose fictional instructional case"]').selectOption('1');
  assert.match(await page.locator('[data-prototype-case]').textContent(),/Visible 2 of 4 candles/);
  assert.equal(await page.locator('[data-prototype-case] .pt-table tr').count(),3,
   'The visual table must display only two completed candles plus its heading');
  assert.doesNotMatch(await page.locator('[data-prototype-case]').textContent(),/\$20\.60 − \$20\.15/,
   'Future breakout values must not appear in the guided calculation');
  assert.equal(await page.locator('[data-prototype-case] input[aria-label="Your guided calculation"]').isDisabled(),true,
   'A question requiring candle three must be locked before reveal');
  await page.locator('[data-prototype-case] button:has-text("Reveal next candle")').click();
  assert.equal(await page.locator('[data-prototype-case] .pt-table tr').count(),4,
   'Revealing candle three exposes exactly three bars and the heading');
  assert.match(await page.locator('[data-prototype-case]').textContent(),/Rejection distance/);
  await page.locator('[data-prototype-case] input[aria-label="Your guided calculation"]').fill('0.45');
  await page.locator('[data-prototype-case] button:has-text("Check calculation")').click();
  assert.match(await page.locator('[data-prototype-case]').textContent(),/Correct to the nearest cent/);
  await page.locator('[data-prototype-case] select[aria-label="Choose fictional instructional case"]').selectOption('2');
  assert.match(await page.locator('[data-prototype-case]').textContent(),/planned long-trade risk\/reward/);
  assert.doesNotMatch(await page.locator('[data-prototype-case]').textContent(),/VWAP to bar/);
  await page.locator('[data-prototype-case] input[aria-label="Your guided calculation"]').fill('0.25');
  await page.locator('[data-prototype-case] button:has-text("Check calculation")').click();
  assert.match(await page.locator('[data-prototype-case]').textContent(),/Correct to the nearest cent/);
  await page.locator('#pt-nav button:has-text("Chart Studio")').click();
  await page.locator('[data-prototype-case]').waitFor({state:'visible'});
  await page.locator('#pt-content button:has-text("Professional")').click();
  assert.match(await page.locator('#pt-content').textContent(),/Professional/);
  await page.locator('#pt-nav button:has-text("Historical Replay")').click();
  await page.locator('[data-prototype-case]').waitFor({state:'visible'});
  assert.match(await page.locator('[data-prototype-case]').textContent(),/Visible 2 of 4 candles/);
  await page.locator('[data-prototype-case] button:has-text("Reveal next candle")').click();
  assert.match(await page.locator('[data-prototype-case]').textContent(),/Visible 3 of 4 candles/);
  await page.locator('#pt-nav button:has-text("Talia Tutor")').click();
  await page.locator('[data-prototype-case]').waitFor({state:'visible'});
  assert.match(await page.locator('[data-prototype-case]').textContent(),/Talia explanation/);
  await page.locator('#pt-nav button:has-text("Admin Control Panel")').click();
  assert.match(await page.locator('#pt-content').textContent(),/Security & Governance/);
  await page.locator('#pt-nav button:has-text("Classroom Builder")').click();
  await page.locator('.pt-options button:has-text("Chart-first")').click();
  assert.equal(await page.locator('.pt-classroom').getAttribute('data-layout'),'Chart-first');
  await page.locator('#pt-device').selectOption('mobile');
  assert.equal(await page.locator('#pt-content').getAttribute('data-device'),'mobile');
  const bounds=await page.evaluate(()=>({body:document.documentElement.scrollWidth,width:document.documentElement.clientWidth}));
  assert.ok(bounds.body<=bounds.width+12,'no significant horizontal overflow at '+viewport.width+': '+JSON.stringify(bounds));
  await page.locator('#pt-search').focus();
  await page.keyboard.type('Talia');
  assert.equal(await page.locator('#pt-nav button').count(),1,'navigation search must filter list');
  await page.keyboard.press('Tab');
  assert.equal(await page.evaluate(()=>document.activeElement?.tagName),'BUTTON','keyboard must reach the filtered navigation button');
  await page.keyboard.press('Enter');
  assert.match(await page.locator('#pt-title').textContent(),/Talia Tutor/,'keyboard Enter activates workspace');
  await page.locator('#pt-search').fill('');
  assert.equal(await page.locator('#pt-nav button').count(),23);
  await page.locator('#pt-nav button:has-text("Classroom Builder")').click();
  await page.locator('[data-prototype-case]').waitFor({state:'visible'});
  const axeReport=await new AxeBuilder({page}).include('#pt-root').withTags(['wcag2a','wcag2aa','wcag21aa','wcag22aa']).analyze();
  assert.deepEqual(axeReport.violations.map(v=>({id:v.id,impact:v.impact,nodes:v.nodes.map(n=>n.target)})),[],
   'automated accessibility violations at '+viewport.width+'px');
  await page.emulateMedia({reducedMotion:'reduce'});
  const preference=await page.evaluate(()=>matchMedia('(prefers-reduced-motion: reduce)').matches);
  assert.equal(preference,true,'reduced-motion user preference available');
  assert.deepEqual(exceptions,[],'browser JavaScript exceptions');
  if(role==='OWNER'&&viewport.width===1280){
   const uninterrupted=await page.evaluate(()=>{
    window.scrollTo({top:350,behavior:'instant'});
    const before=window.scrollY;
    window.dispatchEvent(new Event('focus'));
    return {before,after:window.scrollY,visible:!document.getElementById('pt-app').hidden};
   });
   assert(uninterrupted.before>=50,'Long Owner classroom should permit scroll retention test');
   assert(uninterrupted.visible,'Returning to the Prototype tab must not hide the current classroom');
   assert.equal(uninterrupted.after,uninterrupted.before,'Focus refresh must not reset document scroll');
   await page.waitForTimeout(250);
   assert.equal(await page.locator('#pt-app').isVisible(),true,'Successful background role check retains workspace');
   const afterFocus=await page.evaluate(()=>window.scrollY);
   assert.equal(afterFocus,uninterrupted.before,'Successful background verification must retain scroll position');
   const afterVisibility=await page.evaluate(()=>{
     document.dispatchEvent(new Event('visibilitychange'));
     return {visible:!document.getElementById('pt-app').hidden,scroll:window.scrollY};
   });
   assert(afterVisibility.visible,'Visibilitychange must not blank the authorized classroom');
   assert.equal(afterVisibility.scroll,uninterrupted.before);
   await page.waitForTimeout(250);
   assert.equal(await page.locator('#pt-app').isVisible(),true);

   revoke();await page.evaluate(()=>window.dispatchEvent(new Event('focus')));
   await page.waitForFunction(()=>document.querySelector('#pt-gate')?.textContent?.includes('no longer has Prototype Center permissions'),null,{timeout:12000});
   assert.equal(await page.locator('#pt-app').isVisible(),false,'role revocation must immediately hide the workbench');
  }
  await context.close();
  console.log('PASS role '+role+' at '+viewport.width+'px: navigation, protected case, layout, replay and responsive shell');
 }
}finally{await browser.close()}
