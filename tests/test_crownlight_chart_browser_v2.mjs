/* Actual no-cost Chromium smoke test: real pinned chart package, fictional data only. */
import assert from 'node:assert/strict';
import {readFileSync,existsSync,mkdirSync} from 'node:fs';
import {join,dirname,extname,resolve,sep} from 'node:path';
import {fileURLToPath} from 'node:url';
import {chromium} from 'playwright';
const root=resolve(dirname(fileURLToPath(import.meta.url)),'..');
const lib=join(root,'node_modules/lightweight-charts/dist/lightweight-charts.standalone.production.js');
assert(existsSync(lib),'Pinned real chart library must be installed');
const origin='https://crownlight-fixture.test';
const fixture=[
'<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">',
'<link rel="stylesheet" href="/assets/css/crownlight-chart-studio-v2.css">',
'<link rel="stylesheet" href="/assets/css/crownlight-chart-context-menu-v1.css">',
'<style>*{box-sizing:border-box}body{margin:0;padding:12px;background:#060b17;color:#fff;font-family:system-ui}.sim-chart-panel{max-width:1500px;margin:auto;min-width:0}.sim-chart-head{display:flex;justify-content:space-between;gap:1rem}.sim-chart-panel canvas{display:block;width:100%;height:auto;max-height:560px;background:#071522;border:1px solid #294760;border-radius:10px;margin-top:10px}button{cursor:pointer}</style>',
'</head><body><section class="sim-chart-panel journal-card"><div class="sim-chart-head"><div><strong id="sim-symbol-line">FICTIONAL AAPL</strong><h2 id="sim-bar-time">2026-10-22</h2></div><strong id="sim-last-price">101.00</strong></div><canvas id="sim-chart" aria-label="Legacy fallback"></canvas></section>',
'<section class="crownlight-live-control"><button id="cl-live-start">Live IEX</button><button id="cl-live-demo">Fictional formation</button><button id="cl-live-stop" disabled>Stop</button><p id="cl-live-status" role="status"></p></section>',
'<section id="crownlight-live-stage" class="crownlight-live-stage" hidden><div id="cl-live-playfield"><span id="cl-live-symbol"></span><strong id="cl-live-bar"></strong><strong id="cl-live-last"></strong><div id="cl-live-ohlcv"></div><div id="cl-live-plot" class="cl-live-plot"></div><span id="cl-live-ticks"></span><p id="cl-live-meta"></p></div></section>',
'<script src="/chart-engine.js"></script><script src="/assets/js/crownlight-indicator-math-v2.js"></script><script src="/assets/js/crownlight-chart-context-menu-v1.js"></script><script src="/assets/js/crownlight-chart-studio-v2.js"></script><script src="/assets/js/crownlight-live-aggregator-v1.js"></script><script src="/assets/js/crownlight-live-formation-v1.js"></script>',
'</body></html>'
].join('');
const bars=Array.from({length:65},(_,i)=>({
 time:new Date(Date.parse('2026-10-22T13:30:00Z')+i*60000).toISOString(),
 open:100+i*.08,close:100+i*.08+(i%2===0?.12:-.09),
 high:100+i*.08+.31,low:100+i*.08-.28,volume:1000+i*13,tradeCount:11+i,providerVwap:100+i*.08+.01
}));
const browser=await chromium.launch({headless:true,args:['--no-sandbox','--disable-dev-shm-usage']});
try{
 for(const width of [390,768,1440]){
  const context=await browser.newContext({viewport:{width,height:900},locale:'en-US',serviceWorkers:'block',reducedMotion:'reduce'});
  const page=await context.newPage(),errors=[];
  page.on('pageerror',e=>errors.push(e.message));
  page.on('console',m=>{if(m.type()==='error')errors.push(m.text())});
  await page.route('**/*',async route=>{
   const url=new URL(route.request().url());
   if(url.origin!==origin)return route.abort();
   if(url.pathname==='/fixture.html')return route.fulfill({status:200,contentType:'text/html',body:fixture});
   const p=url.pathname==='/chart-engine.js'?lib:join(root,url.pathname.slice(1));
   if(!p.startsWith(root+sep)||!existsSync(p))return route.fulfill({status:404,body:''});
   const type=extname(p)==='.js'?'application/javascript':extname(p)==='.css'?'text/css':'text/plain';
   return route.fulfill({status:200,contentType:type,body:readFileSync(p)});
  });
  try{
   await page.goto(origin+'/fixture.html',{waitUntil:'load'});
   const result=await page.evaluate(data=>{
    window.simTest={user:{id:'fixture-member-111'},candles:data.map(x=>({...x,time:new Date(x.time)})),index:24,
      sourceProvider:'fictional',sourceName:'LOCAL FICTIONAL CHART FIXTURE',originalFictional:true,position:null,
      sourceNote:'No actual market prices or credentials are used'};
    return window.CrownlightStudio.render(window.simTest);
   },bars);
   assert.equal(result,true,'Real chart must mount, not fallback to legacy canvas');
   assert.equal(await page.locator('.crownlight-shell').count(),1);
   assert.equal(await page.locator('#sim-chart').isVisible(),false);
   assert((await page.locator('.crownlight-plot canvas').count())>0,'Actual candlestick chart must render');
   const before=await page.evaluate(()=>window.CrownlightStudio.getStatus().spacing);
   await page.locator('[data-cl="zoom-in"]').click();
   await page.waitForTimeout(250);
   const after=await page.evaluate(()=>window.CrownlightStudio.getStatus().spacing);
   assert(Number.isFinite(before)&&Number.isFinite(after)&&after>before,'Real chart zoom changes candle spacing (before='+before+', after='+after+')');
   await page.locator('.crownlight-plot').hover({position:{x:100,y:150}});
   const wheelBefore=await page.evaluate(()=>window.CrownlightStudio.getStatus().spacing);
   await page.mouse.wheel(0,-210);
   await page.waitForTimeout(250);
   const wheelAfter=await page.evaluate(()=>window.CrownlightStudio.getStatus().spacing);
   assert(Number.isFinite(wheelBefore)&&Number.isFinite(wheelAfter)&&wheelAfter>wheelBefore,
     'Mouse-wheel zoom must change the REAL chart candle spacing (before='+wheelBefore+', after='+wheelAfter+')');
   // Reproduce the original complaint against the actual chart canvas:
   // a held-button pan must move the logical range, but motion after release
   // (including a moving mouse) must never continue scrolling the chart.
   if(width===1440){
    await page.evaluate(()=>{window.simTest.index=64;window.CrownlightStudio.render(window.simTest)});
    for(let i=0;i<7;i++)await page.locator('[data-cl="zoom-in"]').click();
    await page.waitForTimeout(450);
    const getRange=()=>page.evaluate(()=>window.CrownlightStudio.getStatus().visibleLogicalRange);
    const ready=await getRange();
    assert(ready&&Number.isFinite(ready.from)&&Number.isFinite(ready.to),'Real chart must expose finite viewport positions');
    assert(ready.to-ready.from<65,'Desktop test must display fewer than the 65 completed candles to permit real panning');
    const plot=await page.locator('.crownlight-plot').boundingBox();
    assert(plot&&plot.width>500&&plot.height>200,'Drag target must be the visible rendered chart');
    await page.mouse.move(plot.x+plot.width*.35,plot.y+plot.height*.44);
    await page.mouse.down();
    await page.mouse.move(plot.x+plot.width*.76,plot.y+plot.height*.44,{steps:20});
    await page.mouse.up();
    await page.mouse.move(8,8);
    await page.waitForTimeout(150);
    const released=await getRange();
    assert(Math.abs(released.from-ready.from)>1,'Held left-button drag must actually pan the chart');
    // Returning to the chart without holding a button cannot keep dragging.
    await page.mouse.move(plot.x+plot.width*.40,plot.y+plot.height*.44,{steps:15});
    await page.waitForTimeout(480);
    const stationary=await getRange();
    assert(Math.abs(stationary.from-released.from)<.05&&Math.abs(stationary.to-released.to)<.05,
      'After mouseup, horizontal movement and settling must not move the chart or require a second click');
    assert.equal(await page.evaluate(()=>window.CrownlightStudio.getStatus().revealed),65);
    // Dedicated buttons must work from keyboard, remain on the currently
    // revealed dataset, and permit movement in both directions.
    const rangeBeforeButtons=await getRange();
    const earlier=page.getByRole('button',{name:'Pan chart to earlier revealed candles'});
    const later=page.getByRole('button',{name:'Pan chart toward latest revealed candle'});
    assert.equal(await earlier.getAttribute('type'),'button');
    await earlier.focus();await page.keyboard.press('Enter');
    await page.waitForTimeout(180);
    const rangeEarlier=await getRange();
    assert(rangeEarlier.from<=rangeBeforeButtons.from+.05,'Earlier button never moves forward');
    assert(rangeEarlier.from>=Math.min(-1,rangeBeforeButtons.from)-.1,
      'Earlier button cannot pan beyond the existing sparse-context margin');
    await later.focus();await page.keyboard.press('Space');
    await page.waitForTimeout(180);
    const rangeLater=await getRange();
    assert(rangeLater.from>rangeEarlier.from+.05,'Space key moves toward later completed candles');
    const maxTo=65-1+16;
    // The viewport may include only a configurable blank right margin;
    // it must not add any future values to the revealed data source.
    assert(rangeLater.to<=maxTo+.1,'Explicit pan cannot exceed the configured empty right buffer');
    assert.equal(await page.evaluate(()=>window.CrownlightStudio.getStatus().revealed),65,
      'Navigation does not change replay progression or grant mastery');
    await page.locator('[data-cl="reset"]').click();
    await page.waitForFunction(()=>{
      const range=window.CrownlightStudio.getStatus().visibleLogicalRange;
      return range&&range.from<=0&&range.to>=64;
    },null,{timeout:2000});
    const fitted=await getRange();
    assert(fitted.from<=0&&fitted.to>=64,
      'Fit must include every completed candle while preserving sparse-data spacing: '+JSON.stringify(fitted));
    console.log('PASS actual held-button chart pan, release-to-stop, and keyboard accessible Earlier/Later in pinned Chromium');
   }
   if(width===390){
    // Keyboard-only OHLCV traversal must never disclose candle 26 while the
    // source offers 65 bars but the member has revealed only 25.
    const first=page.getByRole('button',{name:'Inspect previous completed candle'});
    const next=page.getByRole('button',{name:'Inspect next completed candle'});
    await first.focus();await page.keyboard.press('Enter');
    let text=await page.locator('[data-cl="candle-reader"]').innerText();
    assert.match(text,/Completed candle 24 of 25/);
    assert.match(text,/Open .* high .* low .* close .* volume /);
    await next.focus();await page.keyboard.press('Space');
    text=await page.locator('[data-cl="candle-reader"]').innerText();
    assert.match(text,/Completed candle 25 of 25/);
    for(let i=0;i<4;i++)await next.click();
    assert.match(await page.locator('[data-cl="candle-reader"]').innerText(),/Completed candle 25 of 25/,'Candle reader cannot traverse unrevealed OHLCV');
    assert.equal(await page.evaluate(()=>window.CrownlightStudio.getStatus().revealed),25);
    assert.equal(await page.locator('[data-cl="candle-reader"]').getAttribute('aria-live'),'polite');
   }
   await page.locator('[data-cl="source"]').click();
   assert.match(await page.locator('.crownlight-source').innerText(),width===1440?/Revealed bars\s*65/:/Revealed bars\s*25/);
   const facts=await page.locator('.crownlight-source').innerText();
   assert.match(facts,/Not certified by this chart/,'Provider and licensing must not be asserted by client flags');
   assert.doesNotMatch(facts,/Published historical dataset, server-enforced authorization/);
   if(width===390){
    await page.evaluate(()=>{window.simTest.isServerReplay=true;window.CrownlightStudio.render(window.simTest)});
    const serverFlagFacts=await page.locator('.crownlight-source').innerText();
    assert.match(serverFlagFacts,/Chart-accessible bars\s*25 completed bars shown/,'Future-buffer count must not leak from a client replay flag');
    assert.match(serverFlagFacts,/absence of buffered future data/,'Client replay flag is never proof of server protections');
    assert.doesNotMatch(serverFlagFacts,/65 revealed observations only/);
    await page.evaluate(()=>{window.simTest.isServerReplay=false;window.CrownlightStudio.render(window.simTest)});
   }
   await page.locator('[data-cl="coach"]').click();
   assert.match(await page.locator('.crownlight-coach').innerText(),/Real body/);
   if(width===390){
    await page.locator('.crownlight-plot').click({button:'right',position:{x:90,y:165}});
    const menu=page.locator('.cl-context-menu');await menu.waitFor({state:'visible'});
    // Regression: the old popup was clipped by .sim-chart-panel overflow:hidden.
    assert.equal(await menu.evaluate(el=>el.parentElement===document.body),true,
     'The popup must be attached outside the clipped chart panel');
    const popup=await menu.boundingBox();
    assert(popup&&popup.width>180&&popup.height>90,'Right-click popup must have measurable dimensions');
    const visibleViewport=await page.evaluate(()=>({width:innerWidth,height:innerHeight}));
    assert(popup.x>=0&&popup.x+popup.width<=visibleViewport.width+1,
     'Right-click popup must fit horizontally in the visible viewport');
    assert(popup.y>=0&&popup.y<visibleViewport.height,
     'Right-click popup must appear at a visible viewport coordinate');
    assert.equal(await menu.locator('.cl-context-catalog').isVisible(),true,
     'Right click must open the indicator catalog immediately');
    await menu.getByRole('menuitem',{name:/Indicators · all supported studies/}).hover();
    const all=menu.locator('.cl-context-catalog');
    assert.equal(await all.locator('[data-indicator]').count(),17,'All catalog studies visible');
    assert.equal(await all.locator('[data-indicator="RSI"]').getAttribute('aria-disabled'),'true',
     'RSI must be locked for unverified Advanced entitlement');
    await all.locator('[data-indicator="EMA"]').hover();
    assert.equal(await menu.getByRole('menuitem',{name:'EMA 200'}).count(),1);
    await page.keyboard.press('Escape');await menu.waitFor({state:'hidden'});
    await page.locator('[data-cl="context-menu"]').click();
    assert.equal(await menu.isVisible(),true,'Mobile/header menu opens independently of right-click');
    await page.keyboard.press('Escape');
   }
   await page.locator('[data-cl="studies"]').click();
   const dialog=page.locator('.crownlight-dialog');await dialog.waitFor({state:'visible'});
   assert.equal(await dialog.locator('.crownlight-study-row').count(),3);
   assert.equal(await dialog.locator('#cl-new-study option[value="RSI"]').isDisabled(),true,
    'Unverified fixture must not enable restricted RSI');
   await dialog.locator('#cl-new-study').selectOption('EMA');
   await dialog.locator('[data-add]').click();
   assert.equal(await dialog.locator('.crownlight-study-row').count(),4);
   await dialog.locator('[data-close]').click();
   await page.evaluate(w=>{window.simTest.index=w===1440?64:25;window.CrownlightStudio.render(window.simTest)},width);
   assert.equal(await page.evaluate(()=>window.CrownlightStudio.getStatus().revealed),width===1440?65:26);
   await page.locator('[data-cl="source"]').click();await page.locator('[data-cl="source"]').click();
   assert.match(await page.locator('.crownlight-source').innerText(),width===1440?/Revealed bars\s*65/:/Revealed bars\s*26/);
   await page.locator('[data-cl="fullscreen"]').click();assert.equal(await page.locator('.crownlight-expanded').count(),1);
   await page.locator('[data-cl="fullscreen"]').click();assert.equal(await page.locator('.crownlight-expanded').count(),0);

   await page.evaluate(()=>window.CrownlightLive.initialize({canLive:false,getSymbol:()=> 'AAPL',getSession:async()=>null}));
   assert.equal(await page.locator('#cl-live-start').isDisabled(),true,'No connected stream without premium permission');
   await page.locator('#cl-live-demo').click();
   await page.waitForFunction(()=>Number(document.querySelector('#cl-live-ticks')?.textContent||0)>=3,{timeout:10000});
   assert.match(await page.locator('#cl-live-status').innerText(),/FICTIONAL FORMATION/);
   assert.match(await page.locator('#cl-live-ohlcv').innerText(),/O .* H .* L .* C .* Vol /);
   assert((await page.locator('#cl-live-plot canvas').count())>0,'Real chart shows fictional evolving candle');
   await page.locator('#cl-live-stop').click();
   assert.equal(await page.locator('#crownlight-live-stage').isVisible(),false,'Stop restores historical practice');
   assert((await page.evaluate(()=>document.documentElement.scrollWidth-window.innerWidth))<=3,'Viewport horizontal overflow');
   assert.deepEqual(errors,[],'Browser errors at '+width+'px');
   mkdirSync(join(root,'artifacts'),{recursive:true});
   await page.screenshot({path:join(root,'artifacts/crownlight-'+width+'px.png'),fullPage:true});
   await page.evaluate(()=>window.CrownlightStudio.clearMemberState());
   assert.equal(await page.evaluate(()=>window.CrownlightStudio.getStatus().revealed),0,'Chart observations must be scrubbed on session loss');
   assert.equal(await page.locator('.crownlight-source').isVisible(),false,'Private source details hidden on session loss');
   assert.equal(await page.locator('.crownlight-coach').isVisible(),false,'Private Talia notes hidden on session loss');
   assert.equal(await page.locator('[data-cl="candle-reader"]').innerText(),'','A11y candle readout scrubbed on sign-out');
   console.log('PASS real Chromium '+width+'px: canvas, zoom/wheel, indicators, coaching, source, replay and responsive width');
  }finally{await context.close()}
 }
}finally{await browser.close()}
