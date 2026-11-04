/* Real offline Chromium coverage of the exact React/ECharts homepage code.
 * Local fictional chart fixture only: no member credentials, charges, or network data.
 */
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {build} from 'esbuild';
import {chromium} from 'playwright';
const js=(await build({entryPoints:['src/experience/HomeMarketTerminal.tsx'],bundle:true,write:false,format:'iife',platform:'browser',target:'es2022',define:{'process.env.NODE_ENV':'"production"'}})).outputFiles[0].text;
const echarts=readFileSync('node_modules/echarts/dist/echarts.min.js','utf8');
const css=readFileSync('assets/css/home-market-terminal-v1.css','utf8');
const html='<!doctype html><html lang="en"><head><meta name="viewport" content="width=device-width,initial-scale=1"><link rel="stylesheet" href="/styles.css"><script src="/echarts.js"></script></head><body style="background:#0b1222;margin:0"><main><div class="sm-v5-chart"></div></main><script src="/home.js"></script></body></html>';
const browser=await chromium.launch({headless:true});
try{
 const page=await browser.newPage({viewport:{width:960,height:720}});
 const errors=[];
 page.on('pageerror',error=>errors.push(error.message));
 await page.route('https://crownlight-home-fixture.test/**',async route=>{
  const path=new URL(route.request().url()).pathname;
  if(path==='/')return route.fulfill({status:200,contentType:'text/html',body:html});
  if(path==='/echarts.js')return route.fulfill({status:200,contentType:'application/javascript',body:echarts});
  if(path==='/home.js')return route.fulfill({status:200,contentType:'application/javascript',body:js});
  if(path==='/styles.css')return route.fulfill({status:200,contentType:'text/css',body:css});
  if(path==='/assets/js/crownlight-echarts-loader-v1.js')return route.fulfill({status:200,contentType:'application/javascript',body:'window.CrownlightECharts={load:async()=>window.echarts};'});
  return route.fulfill({status:404,body:'fixture resource not found'});
 });
 await page.goto('https://crownlight-home-fixture.test/',{waitUntil:'domcontentloaded'});
 const plot=page.locator('.cl-react-plot');
 await plot.waitFor({state:'visible',timeout:12000});
 await page.waitForFunction(()=>document.querySelector('.cl-react-plot canvas')!==null,{timeout:12000});
 assert.equal(errors.length,0,'No React or ECharts page errors');
 const rect=await plot.boundingBox();assert(rect,'Real chart is sized');
 const initialAxis=await page.evaluate(()=>{
  const chart=window.echarts.getInstanceByDom(document.querySelector('.cl-react-plot'));
  const option=chart.getOption();
  return {slots:option.xAxis[0].data.length,observed:option.series[0].data.filter(Array.isArray).length};
 });
 assert(initialAxis.observed>=105&&initialAxis.observed<=107,'The public market wall opens with simulated observed context');
 assert(initialAxis.slots>=110,'Desktop opens with over 100 compact simulated bars, not empty space');
 // Inspect the observed chart through actual ECharts coordinates, not a synthetic DOM tooltip.
 const location=await page.evaluate(()=>{
  const host=document.querySelector('.cl-react-plot');
  const instance=window.echarts?.getInstanceByDom(host);
  const series=instance?.getOption()?.series?.[0]?.data?.[0];
  if(!instance||!Array.isArray(series)||series.length<4)return null;
  const index=0,close=Number(series[1]);
  if(!Number.isFinite(close))return null;
  const x=instance.convertToPixel({xAxisIndex:0},index);
  const y=instance.convertToPixel({yAxisIndex:0},close);
  return Number.isFinite(x)&&Number.isFinite(y)?{x,y}:null;
 });
 assert(location,'An actual revealed forming candle must have plot coordinates');
 await page.mouse.move(rect.x+location.x,rect.y+location.y);
 await page.locator('.cl-market-tooltip').waitFor({state:'visible',timeout:2400});
 const tooltip=await page.locator('.cl-market-tooltip').isVisible();
 assert(tooltip,'Real mouse hover over the observed candle must show its OHLCV tooltip');
 const value=await page.locator('.cl-market-tooltip').innerText();
 for(const text of ['Open','High','Low','Close','Volume','Simulated'])assert(value.includes(text),text+' is visible on hover');
 assert(!/\d+\.\d{3,}/.test(value),'Tooltip must not expose unrounded values');
 await plot.focus();await page.keyboard.press('Home');
 await page.waitForFunction(()=>document.querySelector('.cl-react-bottom [role="status"]')?.textContent?.includes('Simulated B01'));
 await page.keyboard.press('ArrowRight');
 await page.waitForFunction(()=>document.querySelector('.cl-react-plot')?.getAttribute('role')==='region');
 // Older bars are genuine observed simulated context; right-arrow can inspect B02.
 // No unobserved future index is exposed through the ECharts series.

 // Verify real browser movement, pause isolation and correct aggregated timeframe controls.
 const progress=page.loc // The homepage has exactly one visible control, with twelve truthful chart presentations.
 const selects=page.locator('.cl-react-toolbar select');
 assert.equal(await selects.count(),1,'Only Chart Type may be changed on the public home');
 const options=await selects.first().locator('option').allTextContents();
 assert.equal(options.length,12,'Twelve mainstream OHLCV chart presentations');
 assert.equal(await page.locator('.cl-react-toolbar button').count(),0,'No homepage playback buttons');
 for(const type of ['hollow','heikin','ohlc','hlc','line','area','baseline','step','columns','dots','range','candles']){
  await selects.first().selectOption(type);
  await page.waitForFunction(()=>!!window.echarts?.getInstanceByDom(document.querySelector('.cl-react-plot')));
  assert.equal(errors.length,0,'No chart error when switching to '+type);
 }
 const progress=page.locator('.cl-react-progress');
 await progress.waitFor({state:'attached'});
 assert.match(await progress.innerText(),/0.1×–0.4× PLAYBACK/,'Automatic speed range is disclosed');
 await page.setViewportSize({width:390,height:800});
 const b=await selects.first().boundingBox();
 assert(b&&b.x>=0&&b.x+b.width<=392,'Mobile chart-type control remains inside viewport');
 assert.equal(await page.locator('.cl-react-toolbar select').count(),1,'No additional mobile controls');
 OHLCV, keyboard candle inspection, mobile chart control bounds');
}finally{await browser.close()}
