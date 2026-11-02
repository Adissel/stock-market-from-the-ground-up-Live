/* Genuine pinned Apache ECharts Chromium smoke for chart/Talia visual sync.
 * Browser user session mocked: not a substitute for live member acceptance.
 */
import assert from 'node:assert/strict';
import {readFileSync,existsSync} from 'node:fs';
import {chromium} from 'playwright';
const read=p=>readFileSync(p,'utf8');
const vendor='node_modules/echarts/dist/echarts.min.js';
assert(existsSync(vendor),'Install pinned Apache ECharts 6.1.0 in CI');
const browser=await chromium.launch({headless:true,args:['--no-sandbox','--disable-dev-shm-usage']});
const errors=[];
const host='<section id="crownlight-talia-echarts-visual"><h3>Talia</h3>'+
 '<p data-talia-echarts-status></p>'+
 '<div data-talia-echarts-plot role="img" hidden style="width:100%;height:300px"></div>'+
 '<table><tbody data-talia-echarts-values></tbody></table>'+
 '<div data-talia-echarts-teaching></div></section>';
try{
 for(const width of [390,1200]){
  const page=await browser.newPage({viewport:{width,height:820}});
  page.on('pageerror',e=>errors.push(e.message));
  await page.route('https://talia-echarts-fixture.test/simulator.html',route=>
   route.fulfill({status:200,contentType:'text/html',
    body:'<!doctype html><html><body>'+host+'</body></html>'}));
  await page.route('**/assets/vendor/echarts/6.1.0/echarts.min.js',route=>
   route.fulfill({status:200,contentType:'application/javascript',body:readFileSync(vendor)}));
  await page.goto('https://talia-echarts-fixture.test/simulator.html');
  await page.addStyleTag({content:read('assets/css/crownlight-talia-echarts-bridge-v1.css')});
  await page.evaluate(()=>{
   window.__testUser='member-A';
   window.__testAuth=null;
   window.getSupabaseClient=async()=>({auth:{
    getUser:async()=>window.__testUser?{data:{user:{id:window.__testUser}}}:
     {data:{user:null},error:{message:'signed out'}},
    onAuthStateChange:cb=>(window.__testAuth=cb,{data:{subscription:{unsubscribe(){}}}})
   }});
  });
  for(const file of ['assets/js/crownlight-indicator-math-v2.js',
   'assets/js/crownlight-chart-tutor-v1.js',
   'assets/js/crownlight-echarts-loader-v1.js',
   'assets/js/crownlight-visual-kit-v1.js',
   'assets/js/crownlight-talia-echarts-bridge-v1.js'])
   await page.addScriptTag({content:read(file)});
  await page.evaluate(()=>{
   const base=1710000000000;
   const bars=Array.from({length:25},(_,i)=>({
    timestamp:base+i*60000,open:100+i,high:101.5+i,
    low:99.5+i,close:101+i,volume:100+i
   }));
   document.__bars=bars;
   window.dispatchEvent(new CustomEvent('crownlight:revealed-bars',
    {detail:{source:'fictional',bars}}));
  });
  await page.waitForFunction(()=>window.CrownlightTaliaEChartsBridgeV1?.getStatus().ready===true);
  assert.equal(await page.evaluate(()=>window.CrownlightTaliaEChartsBridgeV1.getStatus().visibleCount),25);
  assert.equal(await page.locator('[data-talia-echarts-values] tr').count(),5);
  assert(await page.locator('[data-talia-echarts-plot] svg').count()>0,'True ECharts SVG must render');
  const chart=await page.evaluate(()=>{
   const c=window.echarts.getInstanceByDom(document.querySelector('[data-talia-echarts-plot]'));
   return {type:c.getOption().series.map(s=>s.type),points:c.getOption().series.map(s=>s.data),
    description:c.getOption().aria[0].description};
  });
  assert.deepEqual(chart.type,['line','line','line']);
  assert(chart.points.every(s=>s.length===25 && s.every(p=>p[0]<=24)));
  assert.match(chart.description,/revealed completed candles only/i);
  assert.match(await page.locator('[data-talia-echarts-teaching]').innerText(),/Talia.*revealed|revealed indicators/i);
  await page.evaluate(()=>{
   window.dispatchEvent(new CustomEvent('crownlight:revealed-bars',{
    detail:{source:'fictional',bars:document.__bars.slice(0,5)}}));
  });
  await page.waitForFunction(()=>window.CrownlightTaliaEChartsBridgeV1.getStatus().visibleCount===5);
  assert.match(await page.locator('[data-talia-echarts-values]').innerText(),/Warm-up \/ unavailable/);
  await page.evaluate(()=>{
   window.__testUser=null;window.__testAuth?.('SIGNED_OUT',{user:null});
  });
  assert.equal(await page.evaluate(()=>window.CrownlightTaliaEChartsBridgeV1.getStatus().visibleCount),0);
  assert.equal(await page.locator('[data-talia-echarts-values] tr').count(),0);
  const overflow=await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth+1);
  assert.equal(overflow,false,'Visual must not overflow viewport');
  await page.close();
 }
 assert.deepEqual(errors,[],'Browser must have no uncaught errors');
 console.log('PASS real ECharts chart-linked Talia 390/1200: 25 visible bars, 5-bar warmup, table, signout, responsive SVG');
}finally{await browser.close()}
