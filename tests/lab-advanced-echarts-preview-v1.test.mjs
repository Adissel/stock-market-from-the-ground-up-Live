import test from 'node:test';
import assert from 'node:assert/strict';
import {createRequire} from 'node:module';
import {readFileSync} from 'node:fs';
const require=createRequire(import.meta.url);
const m=require('../assets/js/lab-advanced-echarts-preview-v1.js');
test('Staff preview slices fictional timeline at the selected bar, no look-ahead in output',()=>{
 const series=m.prepare(m.original,4);
 assert.equal(series.count,5);assert.equal(series.candle.length,5);
 assert.equal(series.labels.at(-1),'F05');assert.deepEqual(series.ema9,[null,null,null,null,null]);
 assert.equal(series.closes.length,5);assert.equal(series.volume.length,5);
 assert.equal(series.total,12);assert.equal(series.provenance,'fictional_constructed_no_feed');
 assert.equal(m.prepare(m.original,8).ema9.filter(x=>x!==null).length,1);
});
test('Unknown real/historical data and invalid OHLC/cursor fail closed',()=>{
 assert.equal(m.prepare(m.original,4,'historical_authorized'),null);
 assert.equal(m.prepare(m.original,-1),null);
 assert.equal(m.prepare(m.original,12),null);
 assert.equal(m.prepare([[10,10,12,11,3],[10,11,9,12,3],[11,12,10,13,3]],2),null);
});
test('Two original ECharts instances share synchronization and accessible table',()=>{
 const js=readFileSync('assets/js/lab-advanced-echarts-preview-v1.js','utf8');
 const html=readFileSync('prototype.html','utf8');
 assert.match(js,/e\.connect\(charts\)/);
 assert.match(js,/dispose\(\)/);
 assert.match(js,/ResizeObserver/);
 assert.match(js,/pt-advanced-series-table/);
 assert.match(html,/data-route-access="staff"/);
 assert.match(html,/pt-lab-advanced-preview/);
 assert.match(html,/pt-advanced-prev/);
 assert.match(html,/pt-advanced-next/);
 assert(!/fetch\(/.test(js));assert(!/localStorage/.test(js));
});
