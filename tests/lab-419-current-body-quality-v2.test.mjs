import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const file=path=>JSON.parse(readFileSync(new URL('../'+path,import.meta.url),'utf8'));
const data=file('data/lab-419-current-body-quality-evidence-v4.json'),master=file('data/lab-teaching-bridges-v014168.json');
const originals=Object.values(master.entries||{});
const boiler='Before practicing, understand what the visible observation does and does not establish.';
const heuristic=/\$\s*\d[\d,.]*|\d+(?:\.\d+)?\s*%/;
test('Master data source really contains the current 419-Lab schema',()=>{
 assert.equal(originals.length,419);assert.equal(master.canonicalLabCount,419);
 assert.equal(master.officialCompetencyCount,30);
 assert.equal(data.summary.count,419);
 assert.equal(data.sourceApprovalStatus,master.approvalStatus);
});
for(const [i,row] of originals.entries()){
 test('Current direct-source integrity '+(i+1)+' '+row.labId,()=>{
  const q=data.records[i];const t=row.transfer||{};
  const paragraphs=Object.values(row.tabs||{}).flat().filter(x=>typeof x==='string');
  assert.equal(q.labId,row.labId);assert.equal(q.title,row.title);
  assert.equal(q.tabsComplete,['understand','recognize','apply','mistake','limits'].every(k=>Array.isArray(row.tabs?.[k])&&row.tabs[k].length>=3));
  assert.deepEqual(q.tabParagraphs,['understand','recognize','apply','mistake','limits'].map(k=>row.tabs?.[k]?.length||0));
  assert.equal(q.transferPromptLength,t.prompt?.length||0);
  assert.equal(q.transferPresent,typeof t.prompt==='string'&&t.prompt.trim().length>0);
  assert.equal(q.transferNoLookahead,t.noLookahead===true);
  assert.equal(q.transferNewEvidence,t.requiresNewEvidence===true);
  assert.equal(q.transferUngraded,t.graded===false);
  assert.equal(q.legacyBoilerplateRetained,paragraphs.some(x=>x.includes(boiler)));
  assert.equal(q.numericSignalDetected,paragraphs.some(x=>heuristic.test(x)));
  assert.equal(q.sourceClaimAccepted,false);assert.equal(q.rightsAccepted,false);
  assert.equal(q.memberAccepted,false);assert.equal(q.gradedReleased,false);
 });
}
test('Summary and older snapshot differences are computed rather than invented',()=>{
 const q=data.records;
 for(const [field,fn] of Object.entries({completeTabs:x=>x.tabsComplete,transferPresent:x=>x.transferPresent,transferPromptOver45:x=>x.transferPromptLength>45,transferRequiresNew:x=>x.transferNewEvidence,transferNoLookahead:x=>x.transferNoLookahead,transferUngraded:x=>x.transferUngraded,previousTemplateSentence:x=>x.legacyBoilerplateRetained,numericalSignal:x=>x.numericSignalDetected})){
  assert.equal(data.summary[field],q.filter(fn).length,field);
 }
 assert.equal(data.summary.sourceClaimAccepted,0);
 assert.equal(data.summary.shortTransferCases.length,q.filter(x=>x.transferPromptLength<=45).length);
 assert.equal(data.sourceFile,'data/lab-teaching-bridges-v014168.json');
});
