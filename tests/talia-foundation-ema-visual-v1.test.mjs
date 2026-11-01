import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import vm from 'node:vm';
const read=p=>readFileSync(new URL('../'+p,import.meta.url),'utf8');
const source=read('assets/js/talia-foundation-ema-visual-v1.js');
const indicatorSource=read('assets/js/crownlight-indicator-math-v2.js');
const html=read('market-tutor.html');
test('Foundation visualization uses the current trusted Crownlight EMA calculations at exact warmup boundaries',()=>{
 const document={readyState:'loading',addEventListener:()=>{}};
 const win={addEventListener:()=>{}};
 const context=vm.createContext({window:win,document,console});
 vm.runInContext(indicatorSource,context);
 vm.runInContext(source,context);
 const app=win.TaliaFoundationEMA;
 assert.ok(app&&typeof app.snapshot==='function');
 for(const count of [1,8,9,19,20,199,200,201,210]){
  const result=app.snapshot(count);
  assert.equal(result.count,count);
  assert.equal(result.closes.length,count);
  for(const p of [9,20,200]){
   assert.equal(result.studies[p].length,count);
   const final=result.studies[p][count-1];
   if(count<p)assert.equal(final,null,'no '+p+' bar EMA before warmup');
   else{
    assert.ok(Number.isFinite(final));
    const expected=win.CrownlightIndicatorMath.ema(result.closes,p)[count-1];
    assert.equal(final,expected,'Parities at '+count+' completed closes and EMA'+p);
   }
  }
 }
 assert.equal(app.fictionalCompletedCloses(211).length,0);
 assert.equal(app.snapshot(8).studies[200][7],null);
});
test('Chart is an optional same-origin ECharts 6.1 visual with accessible table, slider, fictional labels and no future data',()=>{
 assert.match(html,/id="talia-foundation-ema-chart"/);
 assert.match(html,/id="talia-ema-completed" type="range" min="1" max="210"/);
 assert.match(html,/id="talia-ema-readout"/);
 assert.match(html,/talia-foundation-ema-visual-v1\.js/);
 assert.match(source,/root\.CrownlightECharts\?\.load\(\)/);
 assert.match(source,/const closes=fictionalCompletedCloses\(count\)/);
 assert.match(source,/math\.ema\(closes,period\)/);
 assert.match(source,/table\.replaceChildren\(\)/);
 assert.match(source,/chart drawing is unavailable|Chart drawing is unavailable/);
 assert.match(source,/No market feed, private history, grading/);
 assert.doesNotMatch(source,/localStorage|fetch\(|Stripe|supabase|XMLHttpRequest/);
 assert.match(read('assets/js/crownlight-echarts-loader-v1.js'),/\/assets\/vendor\/echarts\/6\.1\.0\/echarts\.min\.js/);
});
