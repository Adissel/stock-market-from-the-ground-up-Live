/* Real Lightweight Charts Chromium + fixture-authenticated workspace lifecycle.
 * NO external account, payment, market-data network, or production writes.
 */
import assert from 'node:assert/strict';
import {readFileSync,existsSync} from 'node:fs';
import {join,dirname,extname} from 'node:path';
import {fileURLToPath} from 'node:url';
import {chromium} from 'playwright';
const root=join(dirname(fileURLToPath(import.meta.url)),'..');
const engine=join(root,'node_modules/lightweight-charts/dist/lightweight-charts.standalone.production.js');
assert(existsSync(engine),'The pinned, real Lightweight Charts package must be installed');
const origin='https://member-chart-prefs-v16-fixture.test';
const members=['aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa','bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb'];
const records=new Map(),events=[];
const now=Date.parse('2024-05-07T13:30:00Z');
const candles=Array.from({length:225},(_,i)=>({
 time:new Date(now+i*60000).toISOString(),
 open:100+i*.04,high:100+i*.04+.3,low:100+i*.04-.24,
 close:100+i*.04+(i%4===0?0:i%2===0?.13:-.11),volume:1000+i*11
}));
const pageHtml='<!doctype html><html lang="en"><head><meta charset="utf-8">'+
 '<meta name="viewport" content="width=device-width,initial-scale=1"><style>'+
 'body{margin:0;background:#071522;color:white;font-family:system-ui;}'+
 '.sim-chart-panel{max-width:1160px;margin:0 auto;}'+
 '#sim-chart{width:100%;height:510px;}'+
 '.crownlight-plot{height:620px;min-height:400px}'+
 '</style></head><body><section id="cl-chart-tier-switcher"></section>'+
 '<section class="sim-chart-panel"><canvas id="sim-chart"></canvas></section></body></html>';
const read=uid=>records.get(uid)||{revision:null,settings:{
 version:2,selected:'STANDARD',sync:true,layout:'SIDE_BY_SIDE',studies:[],drawings:[],
 drawingContext:null,drawingSets:[],appearance:null,chartStudies:null
}};
const save=(uid,payload)=>{
 const old=read(uid);
 if(payload.expectedUpdatedAt!==old.revision)return {status:409,json:{ok:false,error:'WORKSPACE_CHANGED'}};
 const revision='2026-11-01T16:00:'+String(events.length).padStart(2,'0')+'.000Z';
 const settings={...payload};delete settings.expectedUpdatedAt;
 records.set(uid,{revision,settings});
 events.push({uid,settings,revision});
 return {status:200,json:{ok:true,tier:'STANDARD',workspace:settings,updatedAt:revision}};
};
let browser;
try{
 browser=await chromium.launch({headless:true,args:['--no-sandbox']});
 async function openMember(uid){
  const context=await browser.newContext({viewport:{width:1200,height:950},serviceWorkers:'block'});
  const page=await context.newPage(),failures=[];
  page.on('pageerror',error=>failures.push(error.message));
  await page.route('**/*',async route=>{
   const request=route.request(),url=new URL(request.url());
   if(url.origin!==origin)return route.abort();
   if(url.pathname==='/workspace')return route.fulfill({contentType:'text/html',body:pageHtml});
   if(url.pathname==='/api/chart-workspace'){
    assert.equal(request.headers().authorization,'Bearer fixture_'+uid,'Member-bound token required');
    const data=request.method()==='GET'?read(uid):null;
    if(data)return route.fulfill({json:{ok:true,tier:'STANDARD',workspace:data.settings,updatedAt:data.revision}});
    if(request.method()!=='PUT')return route.fulfill({status:405});
    const result=save(uid,request.postDataJSON());
    return route.fulfill(result);
   }
   const local=url.pathname==='/chart-engine.js'?engine:join(root,url.pathname.slice(1));
   if(!local.startsWith(root+'/')||!existsSync(local))return route.fulfill({status:404,body:'Missing test asset'});
   return route.fulfill({body:readFileSync(local),contentType:extname(local)==='.js'?'text/javascript':'text/plain'});
  });
  await page.goto(origin+'/workspace');
  await page.evaluate(({uid,candles})=>{
   window.getSupabaseClient=async()=>({auth:{getSession:async()=>({data:{
    session:{user:{id:uid},access_token:'fixture_'+uid}}})}});
   window.CrownlightChartTiers={
    getStatus:()=>({verified:true,selected:'STANDARD',allowed:['STANDARD']}),
    getInstances:()=>[],getRevealedBars:()=>[],balancePanels(){},addStudy:()=>true
   };
   window.simTest={user:{id:uid},candles:candles.map(b=>({...b,time:new Date(b.time)})),
    index:24,sourceProvider:'fictional',sourceName:'ORIGINAL FICTIONAL TEST',originalFictional:true,
    isServerReplay:true,sourceNote:'Synthetic data; no real market prices.',position:null};
   window.revealed=[];
   window.addEventListener('crownlight:revealed-bars',e=>window.revealed.push(e.detail));
  },{uid,candles});
  await page.addScriptTag({path:engine});
  await page.addScriptTag({path:'assets/js/crownlight-indicator-math-v2.js'});
  await page.addScriptTag({path:'assets/js/crownlight-chart-studio-v2.js'});
  assert.equal(await page.evaluate(()=>window.CrownlightStudio.render(window.simTest)),true);
  await page.addScriptTag({path:'assets/js/crownlight-workspace-v2.js'});
  await page.evaluate(()=>dispatchEvent(new CustomEvent('crownlight:tier-permission')));
  await page.waitForFunction(()=>window.CrownlightWorkspaceV2?.getStatus().memberVerified,{timeout:20000});
  assert((await page.locator('.crownlight-plot canvas').count())>0,'Real chart should be rendered');
  return {context,page,failures};
 }
 const a=await openMember(members[0]);
 assert.deepEqual(await a.page.evaluate(()=>window.revealed.at(-1).bars.length),25,
  'No-lookahead: only first 25 completed fictional candles can enter the chart adapter');
 await a.page.locator('[data-cl="appearance"]').click();
 const dialog=a.page.locator('.crownlight-dialog');
 await dialog.locator('[aria-label="Bullish candles color"]').fill('#17ae67');
 await dialog.locator('[aria-label="Bearish candles color"]').fill('#c33b65');
 await dialog.locator('[aria-label="Doji candles color"]').fill('#e7aa32');
 await dialog.locator('[aria-label="Chart grid color"]').fill('#667788');
 await dialog.locator('[aria-label="Candle spacing"]').fill('14');
 await dialog.locator('[aria-label="Candle spacing"]').press('Tab');
 await dialog.locator('[aria-label="Empty right buffer"]').fill('23');
 await dialog.locator('[aria-label="Empty right buffer"]').press('Tab');
 await dialog.getByRole('button',{name:'Done'}).click();
 await a.page.locator('[data-cl="studies"]').click();
 await a.page.locator('[aria-label="Exponential Moving Average line style"]').first().selectOption('dashed');
 await a.page.locator('[aria-label="Exponential Moving Average period"]').first().fill('200');
 await a.page.locator('[aria-label="Exponential Moving Average period"]').first().press('Tab');
 await a.page.locator('.crownlight-dialog [data-close]').click();
 let before=await a.page.evaluate(()=>window.CrownlightStudio.getWorkspacePreferences());
 assert.equal(before.appearance.bullish,'#17ae67');
 assert.equal(before.appearance.rightBuffer,23);
 assert.equal(before.appearance.barSpacing,14);
 assert.equal(before.chartStudies[0].lineStyle,'dashed');
 assert.equal(before.chartStudies[0].period,200);
 await a.page.locator('[data-cl-save]').click();
 await a.page.waitForFunction(()=>window.CrownlightWorkspaceV2.getStatus().revision!==null);
 assert.equal(records.get(members[0]).settings.appearance.bullish,'#17ae67');
 assert.equal(records.get(members[0]).settings.chartStudies[0].period,200);
 // Independent context = no shared localStorage, proving backend rather than browser cache restoration.
 const b=await openMember(members[0]);
 await b.page.waitForFunction(()=>window.CrownlightStudio.getWorkspacePreferences()?.appearance.bullish==='#17ae67');
 let restored=await b.page.evaluate(()=>window.CrownlightStudio.getWorkspacePreferences());
 assert.equal(restored.appearance.grid,'#667788');
 assert.equal(restored.appearance.rightBuffer,23);
 assert.equal(restored.chartStudies[0].lineStyle,'dashed');
 assert.equal(restored.chartStudies[0].period,200);
 assert.deepEqual(await b.page.evaluate(()=>window.revealed.at(-1).bars.length),25);
 // A second member must never see the first member's saved colors/studies.
 const other=await openMember(members[1]);
 const otherPrefs=await other.page.evaluate(()=>window.CrownlightStudio.getWorkspacePreferences());
 assert.notEqual(otherPrefs.appearance.bullish,'#17ae67');
 assert.equal(records.has(members[1]),false,'No write is necessary for a different member');
 // CAS: one browser edits newer revision; stale tab cannot overwrite it.
 const savedRevision=await b.page.evaluate(()=>window.CrownlightWorkspaceV2.getStatus().revision);
 await b.page.locator('[data-cl-save]').click();
 await b.page.waitForFunction(previous=>window.CrownlightWorkspaceV2.getStatus().revision!==previous,savedRevision);
 await a.page.locator('[data-cl-save]').click();
 await a.page.waitForFunction(()=>document.querySelector('.cl-workspace-status')?.textContent.includes('Another tab saved newer'));
 assert.equal(records.get(members[0]).settings.appearance.bullish,'#17ae67');
 // The chart can reveal one more completed candle without exposing future candles.
 await b.page.evaluate(()=>{window.simTest.index=25;window.CrownlightStudio.render(window.simTest)});
 assert.deepEqual(await b.page.evaluate(()=>window.revealed.at(-1).bars.length),26);
 for(const fixture of [a,b,other]){
  assert.deepEqual(fixture.failures,[],'No browser page errors: '+fixture.failures.join('; '));
  await fixture.context.close();
 }
 assert.equal(events.length,2,'Exactly two valid writes and no third write after stale tab conflict');
 console.log('PASS Chart V16 REAL Chromium + MOCKED member sessions: appearance controls, EMA 200 and dashed style, two independent browser storage contexts, separate member isolation, 409 CAS, 25/26 no-lookahead');
}finally{await browser?.close()}
