/* Batch 02 standalone content and calculation regression. Internal source QA only. */
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const read=p=>JSON.parse(readFileSync(new URL('../'+p,import.meta.url),'utf8'));
const labs=read('data/lab-teaching-bridges-v014168.json');
const m=read('docs/learning/SMFGU-LAB-BATCH02-20261101.json');
const source=read('docs/research/master/master-source-registry-v1.json');
assert.equal(Object.keys(labs.entries).length,419);
assert.equal(m.entries.length,20);
assert.equal(new Set(m.entries.map(x=>x.id)).size,20);
const ids=new Set(source.sources.map(x=>x.id));
for(const [i,x] of m.entries.entries()){
 assert(ids.has(x.sourceId));
 const r=labs.entries[x.id];assert(r&&r.title===x.title);
 assert.match(r.instructionSource,/^ORIGINAL_SUBJECT_SPECIFIC_BATCH02_/);
 assert.match(r.sourceStatus,/PENDING/);
 const tabs=['understand','recognize','apply','mistake','limits'];
 for(const k of tabs){assert.equal(r.tabs[k].length,2,x.id+' '+k);assert(r.tabs[k].every(v=>v.length>70),x.id+' '+k+' shallow content');}
 assert.match(r.tabs.understand[1],/FICTIONAL/);
 assert.match(r.tabs.apply[0],/FICTIONAL/);
 assert(r.tabs.limits[1].includes(x.sourceId));
 assert.equal(r.transfer.graded,false);
 assert.equal(r.transfer.requiresNewEvidence,true);
 assert.equal(r.transfer.noLookahead,true);
 assert(r.transfer.prompt.length>70);
 assert.equal(x.protectedGrade,false);
 const c=x.numericalCheck,a=c.values,actual=c.operation==='subtract'?a[0]-a[1]:c.operation==='divide'?a[0]/a[1]:NaN;
 assert(Number.isFinite(actual)&&Math.abs(actual-c.expected)<1e-9,x.id+' numerical mismatch');
}
assert.equal(m.independentGradedAssessmentAccepted,false);
assert.equal(m.rightsReviewedForCommercialHistoricalData,false);
console.log('PASS 20/20 second-batch canonical Labs, original calculations and future-bar protections; no protected grading or market-data reuse approved.');
