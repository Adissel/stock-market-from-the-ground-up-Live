/* SMFGU-VIS-CONTRACT-001: independent no-charge unit acceptance. */
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import vm from 'node:vm';
const source=readFileSync('assets/js/crownlight-visual-kit-v1.js','utf8');
assert.doesNotMatch(source,/\bfetch\s*\(|\blocalStorage\b|\bsessionStorage\b|\bXMLHttpRequest\b/);
const window={};
vm.runInNewContext(source,{window,globalThis:window},{timeout:1000});
const kit=window.CrownlightVisualKitV1;
assert.equal(kit.version,'1.0.0');
assert(Object.isFrozen(kit));
const js=v=>JSON.parse(JSON.stringify(v));
const progress=kit.barOptions({kind:'progress',sourceLabel:'Already authorized five-day evidence',
 reducedMotion:true,items:[{label:'Day 1',value:1,capacity:1},{label:'Day 2',value:0,capacity:1}]});
assert.equal(progress.animation,false);
assert.deepEqual(js(progress.series[0].data),[1,1]);
assert.deepEqual(js(progress.series[1].data),[1,0]);
assert.equal(progress.xAxis.max,1);
assert.match(progress.aria.description,/Not an assessment or mastery result/);
assert.match(progress.tooltip.formatter([{dataIndex:1}]),/Day 2: 0 \/ 1/);
const counts=kit.barOptions({kind:'counts',sourceLabel:'Authorized Admin snapshot',
 items:[{label:'Members',value:0},{label:'Records',value:5000}]});
assert.deepEqual(js(counts.series[0].data),[0,5000]);
assert.match(counts.tooltip.formatter([{dataIndex:1}]),/5,000 records/);
assert.match(counts.aria.description,/Not percentages of a shared total/);
for(const input of [
 null,{}, {kind:'grade',sourceLabel:'source',items:[{label:'A',value:1}]},
 {kind:'counts',sourceLabel:'',items:[{label:'A',value:1}]},
 {kind:'counts',sourceLabel:'source',items:[]},
 {kind:'counts',sourceLabel:'source',items:[{label:'A',value:-1}]},
 {kind:'counts',sourceLabel:'source',items:[{label:'A',value:0.5}]},
 {kind:'counts',sourceLabel:'source',items:[{label:'A',value:Infinity}]},
 {kind:'counts',sourceLabel:'source',items:[{label:'A',value:1,capacity:2}]},
 {kind:'counts',sourceLabel:'source',items:[{label:'A',value:0},{label:'A',value:1}]},
 {kind:'progress',sourceLabel:'source',items:[{label:'A',value:2,capacity:1}]},
 {kind:'progress',sourceLabel:'source',items:[{label:'A',value:0,capacity:-1}]},
 {kind:'progress',sourceLabel:'source',items:[{label:'A',value:0.1,capacity:1}]},
 {kind:'progress',sourceLabel:'source',items:[{label:'A',value:1}]},
 {kind:'counts',sourceLabel:'source',items:Array.from({length:25},(_,i)=>({label:'A'+i,value:i}))}
])assert.equal(kit.barOptions(input),null,'Reject invalid chart data');
const line=kit.indicatorSeries({label:'Verified reference study',
 sourceLabel:'Fictional finished bars',visibleThroughBar:4,
 points:[{bar:0,value:null},{bar:1,value:null},{bar:2,value:3.2},
 {bar:3,value:-1.25},{bar:4,value:0},{bar:5,value:987654321}]});
assert.deepEqual(js(line.data),[[0,null],[1,null],[2,3.2],[3,-1.25],[4,0]]);
assert.equal(line.connectNulls,false);
assert.equal(line.sampling,'none');
assert.doesNotMatch(JSON.stringify(line),/987654321/);
for(const input of [
 {label:'A',sourceLabel:'example',visibleThroughBar:0,points:[{bar:1,value:2}]},
 {label:'A',sourceLabel:'example',visibleThroughBar:-1,points:[{bar:0,value:2}]},
 {label:'A',sourceLabel:'example',visibleThroughBar:0,points:[{bar:0,value:NaN}]},
 {label:'A',sourceLabel:'example',visibleThroughBar:1,points:[{bar:1,value:2},{bar:0,value:1}]},
 {label:'A',sourceLabel:'example',visibleThroughBar:1,points:[{bar:0,value:1},{bar:0,value:2}]},
 {label:'A',sourceLabel:'',visibleThroughBar:1,points:[{bar:0,value:1}]},
 {label:'A',sourceLabel:'example',visibleThroughBar:0,points:[]}
])assert.equal(kit.indicatorSeries(input),null,'Reject invalid indicator inputs');
console.log('PASS visualization kit: counts, zero values, progress bounds, accessible descriptions, reduced motion, missing warm-ups, no-lookahead');
