import test from 'node:test';
import assert from 'node:assert/strict';
import {normalizeWorkspace,workspacePayloadWithinLimit,onRequest} from '../functions/api/chart-workspace.js';

/** Twenty behavioral test executions, not string-match checks.
 * Private member state is never written to production here.
 */
const standard={tier:'STANDARD',allowed:['STANDARD']};
const advanced={tier:'ADVANCED',allowed:['STANDARD','ADVANCED']};
const professional={tier:'PROFESSIONAL',allowed:['STANDARD','ADVANCED','PROFESSIONAL']};
const project=input=>normalizeWorkspace(input,professional);
test('01 boundary accepts exactly 16000 ASCII UTF-8 bytes',()=>assert.equal(workspacePayloadWithinLimit('a'.repeat(16000)),true));
test('02 rejects an ASCII request above 16 KiB',()=>assert.equal(workspacePayloadWithinLimit('a'.repeat(16001)),false));
test('03 accepts 15999 UTF-8 bytes of three-byte characters',()=>assert.equal(workspacePayloadWithinLimit('界'.repeat(5333)),true));
test('04 rejects UTF-8 multibyte payload whose JS length is deceptively smaller',()=>assert.equal(workspacePayloadWithinLimit('界'.repeat(5334)),false));
test('05 rejects nonstring request body and wrong HTTP method',async()=>{
 assert.equal(workspacePayloadWithinLimit(null),false);
 const r=await onRequest({request:new Request('https://app.test/api/chart-workspace',{method:'DELETE'}),env:{}});
 assert.equal(r.status,405);
});
test('06 Standard denies a stored Professional studio choice',()=>assert.equal(normalizeWorkspace({selected:'PROFESSIONAL'},standard).selected,'STANDARD'));
test('07 Advanced restores former Professional content only into allowed viewer',()=>{
 const x=normalizeWorkspace({selected:'PROFESSIONAL',studies:['EMA','RSI']},advanced);
 assert.equal(x.selected,'ADVANCED');assert.deepEqual(x.studies,['EMA','RSI']);
});
test('08 verified Professional keeps the Professional choice',()=>assert.equal(project({selected:'PROFESSIONAL'}).selected,'PROFESSIONAL'));
test('09 unknown arbitrary tier names never grant advanced features',()=>{
 const x=project({selected:'ADMIN_OVERRIDE'});
 assert.equal(x.selected,'STANDARD');assert.equal(x.layout,'SIDE_BY_SIDE');
});
test('10 Professional supports Price Focus layout',()=>assert.equal(project({selected:'PROFESSIONAL',layout:'PRICE_FOCUS'}).layout,'PRICE_FOCUS'));
test('11 Standard and Advanced reject Professional-only layout',()=>{
 for(const tier of [standard,advanced])assert.equal(normalizeWorkspace({selected:tier.tier,layout:'STACKED'},tier).layout,'SIDE_BY_SIDE');
});
test('12 Professional permits the lower bound of panel resize',()=>assert.equal(project({selected:'PROFESSIONAL',panelRatio:25}).panelRatio,25));
test('13 Professional rejects a panel resize outside approved bounds',()=>{
 for(const ratio of [24,76,-100,45.5,'50'])assert.equal(project({selected:'PROFESSIONAL',panelRatio:ratio}).panelRatio,50);
});
test('14 duplicate and injected indicators are discarded',()=>{
 assert.deepEqual(project({studies:['EMA','EMA','RSI','INVALID','<script>']}).studies,['EMA','RSI']);
});
test('15 injected drawing types are discarded',()=>{
 const x=project({drawings:[{name:'script',points:[{timestamp:1790000000000,value:2}]}]});
 assert.deepEqual(x.drawings,[]);
});
test('16 drawing coordinates must have safe positive time and price',()=>{
 const x=project({drawings:[{name:'segment',points:[{timestamp:0,value:10},{timestamp:1790000000000,value:-4},{timestamp:1790000000000,value:12},{timestamp:1790000060000,value:Infinity}]}]});
 assert.equal(x.drawings.length,1);assert.deepEqual(x.drawings[0].points,[{timestamp:1790000000000,value:12}]);
});
test('17 valid drawing points are bounded to six',()=>{
 const points=Array.from({length:8},(_,i)=>({timestamp:1790000000000+i*60000,value:i+1}));
 assert.equal(project({drawings:[{name:'segment',points}]}).drawings[0].points.length,6);
});
test('18 untrusted dataset drawing context cannot inject HTML',()=>{
 assert.equal(project({drawingContext:'AAPL<svg onload=alert(1)>'}).drawingContext,null);
 assert.equal(project({drawingContext:'DIS:2024-05-07:5m'}).drawingContext,'DIS:2024-05-07:5m');
});
test('19 workspace never stores private credentials or OHLCV payloads',()=>{
 const x=project({selected:'PROFESSIONAL',access_token:'secret',apiKey:'secret',credentials:'secret',bars:[{close:123}],order:'BUY'});
 for(const k of ['access_token','apiKey','credentials','bars','order'])assert.equal(Object.hasOwn(x,k),false);
});
test('20 malformed appearance and ECharts study preferences are sanitized',()=>{
 const x=project({appearance:{bullish:'#abcdef',bearish:'javascript:alert(1)',barSpacing:99,rightBuffer:-3},
 echartsPreferences:{apiKey:'secret',bars:[{close:1}],enabled:{macd:true,inject:true},colors:{macd:'#Ab12Cd',inject:'red'}}});
 assert.equal(x.appearance.bullish,'#abcdef');assert.equal(x.appearance.bearish,'#ff5f86');
 assert.equal(x.appearance.barSpacing,10);assert.equal(x.appearance.rightBuffer,16);
 assert.deepEqual(x.echartsPreferences.enabled,{macd:true});assert.deepEqual(x.echartsPreferences.colors,{macd:'#ab12cd'});
 assert.equal(Object.hasOwn(x.echartsPreferences,'apiKey'),false);
});
