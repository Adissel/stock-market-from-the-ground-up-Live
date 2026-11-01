/* Section C: real Chromium indicator overlays, member-only revealed rows, no lookahead.
 * No network feed, server records, grades, trading orders or payment interaction. */
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {chromium} from 'playwright';
const source=p=>readFileSync(p,'utf8');
const browser=await chromium.launch({headless:true,args:['--no-sandbox']});
const origin='https://section-c-offline.test';
const start=Date.UTC(2024,4,7,13,30);
const bars=Array.from({length:225},(_,i)=>{
 const close=100+i*.045+Math.sin(i*.21)*.6;
 const open=close+(i%2===0?-.18:.14);
 return {timestamp:start+i*60000,open,high:Math.max(close,open)+.25,
  low:Math.min(close,open)-.29,close,volume:1000+i%17*39};
});
const near=(actual,expected,what)=>{
 assert(Number.isFinite(actual)&&Math.abs(actual-expected)<1e-7,what+' '+actual+' vs '+expected);
};
try{
 const page=await browser.newPage({viewport:{width:1100,height:780}});
 const errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.route('**/*',route=>{
  const u=new URL(route.request().url());
  if(u.pathname==='/assets/vendor/echarts/6.1.0/echarts.min.js')
   return route.fulfill({status:200,contentType:'application/javascript',
    body:source('node_modules/echarts/dist/echarts.min.js')});
  if(u.pathname==='/')return route.fulfill({status:200,contentType:'text/html',
   body:'<!doctype html><html><body><div id="slot"></div></body></html>'});
  return route.abort();
 });
 await page.goto(origin+'/');
 for(const path of ['assets/js/crownlight-indicator-math-v2.js',
   'assets/js/crownlight-echarts-loader-v1.js','assets/js/crownlight-echarts-studio-v1.js'])
  await page.addScriptTag({content:source(path)});
 assert.equal(await page.evaluate(async data=>
  window.CrownlightEChartsStudio.mount(document.querySelector('#slot'),data,'FICTION','1-minute'),bars),true);
 const read=()=>page.evaluate(()=>{
  const chart=window.echarts.getInstanceByDom(document.querySelector('[data-cl-echarts-chart]'));
  const o=chart.getOption();
  return {series:o.series.map(x=>({name:x.name,data:x.data})),
   rows:document.querySelectorAll('[data-cl-echarts-rows] tr').length,
   status:window.CrownlightEChartsStudio.getStatus()};
 });
 let initial=await read();
 assert.equal(initial.status.barCount,225);
 assert.equal(initial.rows,30,'Accessible table only contains latest 30 revealed observations');
 assert.deepEqual(initial.series.slice(0,2).map(x=>x.name),['Revealed OHLC','Observed volume']);
 const by=name=>initial.series.find(x=>x.name===name)?.data;
 assert(by('EMA 9'),'EMA 9 must use real shared math');
 assert(by('EMA 20'),'EMA 20 must use real shared math');
 assert(by('Session VWAP (HLC3 bar proxy)'),'VWAP must accurately disclose HLC3 proxy');
 assert(by('Volume SMA 20'),'Volume SMA must be visible on the volume axis');
 assert.equal(by('EMA 9')[7],null,'EMA9 seed unavailable before nine completed candles');
 assert.equal(by('EMA 20')[18],null,'EMA20 seed unavailable before twenty completed candles');
 const expected=await page.evaluate(data=>{
  const m=window.CrownlightIndicatorMath,close=data.map(b=>b.close);
  return {ema9:m.ema(close,9),ema20:m.ema(close,20),
   proxy:m.vwapProxy(data.map(b=>({...b,time:new Date(b.timestamp)}))),
   volume:m.sma(data.map(b=>b.volume),20)};
 },bars);
 near(by('EMA 9')[200],expected.ema9[200],'EMA9 current');
 near(by('EMA 20')[200],expected.ema20[200],'EMA20 current');
 near(by('Session VWAP (HLC3 bar proxy)')[200],expected.proxy[200],'VWAP proxy current');
 near(by('Volume SMA 20')[200],expected.volume[200],'Volume SMA current');
 await page.locator('[data-study="ema200"]').check();
 await page.locator('[data-study="bb20"]').check();
 await page.locator('[data-study="structure"]').check();
 initial=await read();
 assert.equal(initial.series.find(x=>x.name==='EMA 200').data[198],null);
 assert(Number.isFinite(initial.series.find(x=>x.name==='EMA 200').data[199]));
 assert(initial.series.some(x=>x.name==='Bollinger upper'));

 // Gate 3: three independent, chronologically linked mathematical panels.
 await page.locator('[data-study="rsi14"]').check();
 await page.locator('[data-study="macd"]').check();
 await page.locator('[data-study="atr14"]').check();
 const panels=await page.evaluate(()=>{
  const el=document.querySelector('[data-cl-echarts-chart]');
  const o=window.echarts.getInstanceByDom(el).getOption();
  return {axes:o.xAxis.length,grids:o.grid.length,
   series:o.series.map(x=>({name:x.name,data:x.data,xAxisIndex:x.xAxisIndex,yAxisIndex:x.yAxisIndex})),
   zoom:o.dataZoom.map(z=>z.xAxisIndex),link:o.axisPointer?.[0]?.link,
   height:el.getBoundingClientRect().height};
 });
 assert.equal(panels.grids,5,'Price/volume and RSI, MACD, ATR panes must remain independently scaled');
 assert.equal(panels.axes,5,'All five time axes must be coupled');
 assert(panels.link.some(x=>x.xAxisIndex==='all'),'Time-axis pointer must link every pane');
 for(const name of ['Wilder RSI 14','MACD 12/26','MACD signal 9','MACD histogram','Wilder ATR 14']){
  assert(panels.series.some(x=>x.name===name),name+' pane missing');
 }
 assert.equal(panels.series.find(x=>x.name==='Wilder RSI 14').yAxisIndex,2);
 assert.equal(panels.series.find(x=>x.name==='MACD 12/26').yAxisIndex,3);
 assert.equal(panels.series.find(x=>x.name==='Wilder ATR 14').yAxisIndex,4);
 assert(panels.zoom.every(z=>z.length===5),'Synchronized zoom must affect all panes');
 const panelExpected=await page.evaluate(data=>{
  const math=window.CrownlightIndicatorMath;
  const completed=data.map(b=>({...b,time:new Date(b.timestamp)}));
  return {rsi:math.rsi(completed,14),macd:math.macd(completed,12,26,9),atr:math.atr(completed,14)};
 },bars);
 const panelBy=name=>panels.series.find(x=>x.name===name)?.data;
 near(panelBy('Wilder RSI 14')[200],panelExpected.rsi[200],'RSI 14 pane');
 near(panelBy('MACD 12/26')[200],panelExpected.macd.line[200],'MACD pane');
 near(panelBy('MACD signal 9')[200],panelExpected.macd.signal[200],'MACD signal pane');
 near(panelBy('MACD histogram')[200],panelExpected.macd.histogram[200],'MACD histogram pane');
 near(panelBy('Wilder ATR 14')[200],panelExpected.atr[200],'ATR pane');
 await page.locator('[data-pane-height="macd"]').fill('230');
 const resized=await page.evaluate(()=>{
  const g=document.querySelector('[data-cl-echarts-chart]'),
   o=window.echarts.getInstanceByDom(g).getOption();
  return {height:g.getBoundingClientRect().height,macd:o.grid[3].height};
 });
 assert.equal(resized.macd,230,'MACD pane must resize without changing math');
 assert(resized.height>panels.height);
 const table=page.locator('.cl-echarts-numeric-table');
 await table.locator('summary').click();
 assert(await table.locator('table caption').textContent());
 assert.equal(await table.locator('tbody tr').count(),30);
 await page.locator('input[aria-label="EMA 9 line color"]').evaluate(el=>{
  el.value='#ffcc00';el.dispatchEvent(new Event('input',{bubbles:true}));
 });
 await page.locator('select[aria-label="Indicator line style"]').selectOption('dashed');
 const style=await page.evaluate(()=>{
  const e=window.echarts.getInstanceByDom(document.querySelector('[data-cl-echarts-chart]'));
  const x=e.getOption().series.find(x=>x.name==='EMA 9');
  return x.lineStyle;
 });
 assert.equal(style.color,'#ffcc00');assert.equal(style.type,'dashed');
 await page.evaluate(data=>window.CrownlightEChartsStudio.update(data,'FICTION','1-minute'),bars.slice(0,50));
 const prefix=await read();
 assert.equal(prefix.status.barCount,50);
 assert.equal(prefix.series[0].data.length,50,'No future candle can remain after replay rewind');
 assert(prefix.series.find(x=>x.name==='EMA 200').data.every(x=>x===null),'Do not fabricate 200-bar warmup');
 for(let i=0;i<50;i++){
  const a=prefix.series.find(x=>x.name==='EMA 9').data[i],b=expected.ema9[i];
  assert(a===null&&b===null||Number.isFinite(a)&&Math.abs(a-b)<1e-7,'No-lookahead EMA9 at '+i);
 }
 assert.equal(await page.locator('[data-cl-echarts-rows] tr').count(),30);
 await page.evaluate(()=>window.dispatchEvent(new CustomEvent('crownlight:member-changed')));
 assert.equal(await page.locator('[data-cl-echarts-rows] tr').count(),0);
 assert.equal(await page.evaluate(()=>window.CrownlightEChartsStudio.getStatus().barCount),0);
 assert.deepEqual(errors,[]);
 await page.close();
 console.log('PASS Section C ECharts: original shared math overlays, EMA200 warmup, user styles, accessible table, revealed-only replay and account scrub');
}finally{await browser.close()}
