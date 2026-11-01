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

test('Advanced preview never plots share volume and USD close on one numerical axis',()=>{
 const js=readFileSync('assets/js/lab-advanced-echarts-preview-v1.js','utf8');
 assert.match(js,/name:'Fictional volume',type:'bar',data:data\.volume/);
 assert.match(js,/name:'Close \(USD\)',type:'line',data:data\.closes,yAxisIndex:1/);
 assert.match(js,/\{name:'Shares',type:'value',min:0/);
 assert.match(js,/\{name:'USD',type:'value',scale:true,position:'right'/);
 assert.doesNotMatch(js,/data:data\.closes,yAxisIndex:0/);
});

test('Full 419-Lab/61-indicator registry is preserved; only approved topical Labs receive new numerical aid',()=>{
 const registry=JSON.parse(readFileSync('data/competency-lab-paths-v01499.json','utf8')).byLab;
 const catalog=JSON.parse(readFileSync('data/tutor-indicator-study-v1.json','utf8'));
 const math=require('../assets/js/learning-indicators-v1.js');
 assert.equal(Object.keys(registry).length,419);
 assert.equal(catalog.guides.length,61);
 for(const code of ['STUDY_RSI','STUDY_MACD','STUDY_ATR','STUDY_BOLLINGER_BANDS'])
  assert(catalog.guides.some(x=>x.code===code));
 for(const [labId,id] of Object.entries(math.approved)){
  assert(registry[labId],'Canonical Lab not found '+labId);
  assert.equal(math.select({labId,topic:id==='rsi'?'RSI independent interpretation':'MACD interpretation'}),id);
 }
 assert.equal(math.select({labId:'F1-C01-L01',topic:'RSI'}),null);
});

test('Future malformed or changed bars cannot influence an earlier replay frame',()=>{
 const changed=m.original.map(b=>[...b]);
 changed[5]=[Number.POSITIVE_INFINITY,19,18,20,600];
 for(let cursor=0;cursor<=4;cursor++){
  const before=m.prepare(m.original,cursor);
  const after=m.prepare(changed,cursor);
  assert.deepEqual(after,before,'future observation cannot change replay frame '+cursor);
 }
 assert.equal(m.prepare(changed,5),null,'invalid bar is rejected once it becomes visible');
 const different=m.original.map(b=>[...b]);
 different[11]=[20.5,20.4,19.9,20.7,980];
 assert.deepEqual(m.prepare(different,8),m.prepare(m.original,8));
 assert.notDeepEqual(m.prepare(different,11),m.prepare(m.original,11));
});
