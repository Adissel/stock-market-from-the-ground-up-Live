import test from 'node:test';import assert from 'node:assert/strict';
import{readFileSync}from'node:fs';import{createRequire}from'node:module';
createRequire(import.meta.url)('../assets/js/crownlight-learning-echarts-v1.js');
const engine=globalThis.CrownlightLearningEChartsV1;
test('Two-case ECharts comparison uses original fictional calculations',()=>{
 const c=engine.compareMetrics('candle',{o:31,h:32.5,l:30.5,c:32},100);
 assert.equal(c.source,'fictional_constructed_no_feed');assert.equal(c.original.percent,50);
 assert(Math.abs(c.independent.percent-100*.6/1.4)<.00001);
 const v=engine.compareMetrics('vwap',null,100);
 assert(Math.abs(v.original.price-2600/300)<.00000001);
 assert.equal(v.independent.price,8.2);assert.equal(v.independent.totalShares,200);
 assert.equal(engine.compareMetrics('unrecognized'),null);
});
test('ECharts comparison preserves keyboard interaction and text fallback',()=>{
 const source=readFileSync('assets/js/crownlight-learning-echarts-v1.js','utf8');
 assert.match(source,/Compare fictional cases/);assert.match(source,/aria-pressed/);
 assert.match(source,/New total/);assert.match(source,/New Close/);
 assert.match(source,/accessible data/);assert.match(source,/ResizeObserver/);
 assert.match(readFileSync('assets/css/crownlight-learning-echarts-v1.css','utf8'),/focus-visible/);
});
