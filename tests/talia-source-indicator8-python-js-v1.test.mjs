import test from 'node:test';
import assert from 'node:assert/strict';
import {spawnSync} from 'node:child_process';
import {elderRayExample,vortexExample,volumeIndexExample,ulcerExample,easeOfMovementExample,choppinessExample,fisherNormalizedExample} from '../functions/_lib/talia-indicator-worked-v1.js';

const bars=[{high:10.2,low:9.8,close:10},{high:10.5,low:9.9,close:10.3},{high:10.8,low:10.1,close:10.7}];
const closes=[10,11,10.5,12],volumes=[100,80,120,90];
function check(actual,expected,path='fixture'){
 if(typeof expected==='number'){
  assert.ok(Number.isFinite(actual),path+' nonfinite');
  assert.ok(Math.abs(actual-expected)<=1e-9*Math.max(1,Math.abs(expected)),path+': '+actual+' != '+expected);
 }else if(Array.isArray(expected)){
  assert.ok(Array.isArray(actual),path);
  assert.equal(actual.length,expected.length,path);
  expected.forEach((v,i)=>check(actual[i],v,path+'['+i+']'));
 }else if(expected&&typeof expected==='object'){
  assert.deepEqual(Object.keys(actual).sort(),Object.keys(expected).sort(),path);
  for(const key of Object.keys(expected))check(actual[key],expected[key],path+'.'+key);
 }else assert.equal(actual,expected,path);
}
test('Python independent reference equals original JavaScript teaching arithmetic for all 8 supported subjects',()=>{
 const p=spawnSync(process.platform==='win32'?'python':'python3',['scripts/qa/talia_source_indicator8_python_v1.py'],{encoding:'utf8',timeout:10000});
 assert.equal(p.status,0,p.stderr);
 const expected=JSON.parse(p.stdout);
 const observed={
  elder:elderRayExample(10.5,9.6,10),
  vortex:vortexExample(bars,2),
  NVI:volumeIndexExample(closes,volumes,'NVI',1000),
  PVI:volumeIndexExample(closes,volumes,'PVI',1000),
  ulcer:ulcerExample([-10,-5,0]),
  emv:easeOfMovementExample(10.2,9.8,10.7,10.1,1200,10000),
  chop:choppinessExample(bars,2),
  fisher:fisherNormalizedExample(.5)
 };
 assert.equal(Object.keys(observed).length,8);
 for(const [key,value] of Object.entries(expected))check(observed[key],value,key);
});
test('invalid and future-insufficient inputs do not produce a false numerical result',()=>{
 assert.equal(elderRayExample(1,2,1),null);
 assert.equal(vortexExample(bars.slice(0,2),2),null);
 assert.equal(choppinessExample(bars.slice(0,2),2),null);
 assert.equal(volumeIndexExample([1,2],[20],'NVI'),null);
 assert.equal(ulcerExample([-5,4]),null);
 assert.equal(easeOfMovementExample(1,2,2,1,100),null);
 assert.equal(fisherNormalizedExample(1),null);
 assert.equal(fisherNormalizedExample(-1),null);
});
