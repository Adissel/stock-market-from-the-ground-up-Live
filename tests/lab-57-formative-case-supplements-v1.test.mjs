// Existing 50 authored cases + 7 new P0/transfer fictional supplements.
// Source/UI correctness does not equal genuine member, compliance or editorial approval.
import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {runInNewContext} from 'node:vm';
const read=p=>readFileSync(new URL('../'+p,import.meta.url),'utf8');
const data=JSON.parse(read('data/lab-57-formative-case-supplements-v1.json'));
const core=JSON.parse(read('data/lab-teaching-bridges-v014168.json'));
const engine=read('assets/js/lab-engine-v32-universal.js');
const html=read('lab-player.html');
const css=read('assets/css/lab-v33-instructor.css');
const script=read('assets/js/lab-57-formative-case-supplements-v1.js');
const refs=new Map(data.records.map(x=>[x.labId,x]));
const root={};const document={createElement(tag){return{tagName:tag,textContent:'',dataset:{},children:[],append(...nodes){this.children.push(...nodes)}}}};
runInNewContext(script,{globalThis:root,document});
const live=root.CrownlightLabFormativeBatch57V1;
const first=Object.values(core.entries).slice(0,50);
const p0=new Set(['F2-C10-L01','DT-C04-L01','DT-C04-L02','DT-C04-L03','DT-C50-L01','DT-C50-L02','TAPE-C17-L02']);
test('57 distinct canonical cases with protected nonrelease counts and seven visible P0 holds',()=>{
 assert.equal(data.records.length,57);assert.equal(refs.size,57);assert.equal(live.count,57);
 assert.deepEqual(data.records.slice(0,50).map(x=>x.labId),first.map(x=>x.labId));
 assert.equal(data.existingAuthoredSourceMapped,50);assert.equal(data.newOriginalSupplements,7);
 assert.deepEqual(new Set(Object.keys(data.warnings)),p0);
 assert.equal(data.protected.memberProgressUnchanged,true);
 assert.equal(data.protected.protectedAssessmentUnchanged,true);
 assert.equal(data.protected.paidGrantsUnchanged,true);
 assert.equal(data.protected.marketFeedsUnchanged,true);
});
for(const [i,x] of data.records.entries()){
 test('Fictional case '+(i+1)+' '+x.labId+' source and topic contract',()=>{
  const actual=core.entries[x.labId];assert.ok(actual);assert.equal(x.canonicalTitle,actual.title);
  assert.equal(x.fictionalOnly,true);assert.equal(x.ungraded,true);assert.equal(x.noLookahead,true);
  assert.equal(x.independentSourceClaimAccepted,false);assert.equal(x.genuineMemberAccepted,false);
  assert.equal(x.thirdPartyMediaRightsApproved,false);
  assert.ok(data.sourceReferences[x.sourceId]);
  for(const field of ['scenario','reasoning','counterexample','freshTransfer'])assert.ok(x[field].length>45,x.labId+' weak '+field);
  assert.equal(live.get(x.labId).labId,x.labId);
  if(i<50){
   assert.equal(x.scenario,actual.tabs.understand[1]);
   assert.equal(x.reasoning,actual.tabs.apply[1]);
   assert.equal(x.counterexample,actual.tabs.mistake[0]);
   assert.equal(x.freshTransfer,actual.transfer.prompt);
   assert.equal(x.caseOrigin,'EXISTING_AUTHORED_SOURCE_EXPOSED_AS_ACCESSIBLE_OPTIONAL_PRACTICE');
  }else assert.equal(x.caseOrigin,'NEW_ORIGINAL_FICTIONAL_P0_OR_TRANSFER_SUPPLEMENT');
 });
}
for(const id of p0){
 test('P0 '+id+' visible review hold in Learn and Transfer but hidden from protected stages',()=>{
  for(const stage of [1,7]){
   const host=document.createElement('section');assert.equal(live.mount({target:host,labId:id,stage,mode:'guided'}),true);
   assert.ok(host.children.some(x=>x.tagName==='p'&&/review|hold|caution|exception/i.test(x.textContent)),id);
   const detail=host.children.find(x=>x.tagName==='details');assert.ok(detail);
   assert.equal(detail.dataset.labId,id);assert.ok(detail.children.some(x=>x.tagName==='summary'));
  }
  for(const stage of [0,2,3,4,5,6,8]){
   const host=document.createElement('section');assert.equal(live.mount({target:host,labId:id,stage,mode:'guided'}),false);
   assert.equal(host.children.length,0);
  }
 });
}
test('No direct mount during assessment or blind/practice denial; no HTML injection',()=>{
 for(const mode of ['blind','assessment','unknown','']){
  const host=document.createElement('div');assert.equal(live.mount({target:host,labId:'F1-C02-L01',stage:1,mode}),false);
  assert.equal(host.children.length,0);
 }
 assert.equal(live.get('NEVER_A_REAL_LAB'),null);
 assert.equal(script.includes('innerHTML'),false);assert.equal(script.includes('eval('),false);
 assert.ok(engine.includes("root.CrownlightLabFormativeBatch57V1?.mount?.({target:body,labId,stage:1,mode})"));
 assert.ok(engine.includes("root.CrownlightLabFormativeBatch57V1?.mount?.({target:body,labId,stage:7,mode})"));
 assert.ok(html.indexOf('lab-57-formative-case-supplements-v1.js')<html.indexOf('lab-engine-v32-universal.js'));
 assert.match(css,/gu-lab-formative-57 summary:focus-visible/);
});
test('FINRA transition is date-scoped and GRML is private single-venue only',()=>{
 assert.match(data.warnings['DT-C04-L01'],/June 4, 2026/);
 assert.match(data.warnings['DT-C04-L01'],/October 20, 2027/);
 for(const id of ['DT-C50-L01','DT-C50-L02'])assert.match(data.warnings[id],/IEX/i);
 assert.ok(data.sourceReferences.FINRA.url.startsWith('https://syndication.finra.org/'));
 assert.equal(data.sourceReferences.IEX.url,null);
 assert.match(data.sourceReferences.IEX.internalReviewPath,/^docs\/research\//);
});
