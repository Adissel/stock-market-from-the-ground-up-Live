import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const base=new URL('../data/',import.meta.url);
const read=name=>JSON.parse(readFileSync(new URL(name,base),'utf8'));
const report=read('talia-foundation-mega80-research-20261103-v1.json');
const guides=[23,24,29,30].flatMap(n=>read('talia-foundation-explanations-batch'+n+'-v1.json').guides);
const byCode=new Map(guides.map(g=>[g.code,g]));
test('80 Mega80 source pointers retain exact equality and independent holds',()=>{
 assert.deepEqual(report.candidateSourceReconciliation.lessonIds,[565,566,570,577,578,580,581,586,588,589,598]);
 assert.equal(report.metrics.independentApprovals,0);
 assert.equal(report.metrics.rightsCleared,0);
 assert.equal(report.records.length,80);
 assert.equal(report.candidateSourceReconciliation.sourceVerification,'CANDIDATE ONLY');
 for(const row of report.records){
  const g=byCode.get(row.topicId);
  assert.ok(g,'Missing canonical topic '+row.topicId);
  assert.deepEqual(row.candidateSources,g.sourceUrls,'Source drift at '+row.lessonId);
  assert.equal(g.independentEditorialApproved,false);
  assert.equal(g.sourceResearchTriage.independentPublicationApproved,false);
  assert.equal(g.sourceResearchTriage.sourceRedistributionRightsCleared,false);
  for(const source of row.candidateSources){
   const u=new URL(source);
   assert.equal(u.protocol,'https:');
   assert.equal(u.username,'');assert.equal(u.password,'');
  }
 }
});
