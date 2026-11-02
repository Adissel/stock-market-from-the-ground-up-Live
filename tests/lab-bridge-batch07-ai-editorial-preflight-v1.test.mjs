import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';

const read=p=>JSON.parse(readFileSync(new URL('../'+p,import.meta.url),'utf8'));
const report=read('docs/learning/SMFGU-LAB-BATCH07-AI-EDITORIAL-PREFLIGHT-20261102.json');
const bridge=read('data/lab-teaching-bridges-v014168.json');
const rows=Object.values(bridge.entries).filter(x=>x.instructionSource==='ORIGINAL_SUBJECT_SPECIFIC_BATCH07_20261102');

test('Batch07 has one individual AI editorial preflight per authored bridge',()=>{
 assert.equal(report.reviewKind,'AI_ASSISTED_INTERNAL_PREFLIGHT');
 assert.equal(report.reviews.length,20);
 assert.equal(new Set(report.reviews.map(x=>x.labId)).size,20);
 assert.deepEqual(new Set(report.reviews.map(x=>x.labId)),new Set(rows.map(x=>x.labId)));
 for(const row of report.reviews){
  assert.equal(row.outcome,'AI_PREFLIGHT_PASS');
  assert.ok(row.note.length>=80,`${row.labId} needs an individual review note`);
  for(const key of ['formulaAccuracy','topicConsistency','misconceptionCorrection','transferIndependent'])
   assert.equal(row[key],true,`${row.labId} ${key}`);
 }
});

test('AI preflight cannot masquerade as human, member, rights, or release acceptance',()=>{
 assert.equal(report.independentHumanEditorialAcceptance,false);
 assert.equal(report.authenticatedMemberAcceptance,false);
 assert.equal(report.publicationRightsApproved,false);
 assert.equal(report.commonChecks.independentEditorialDecision,'OPEN');
 assert.equal(report.commonChecks.authenticatedScreenReaderAcceptance,'OPEN');
 for(const row of rows){
  assert.equal(row.provenance.editorialAcceptance,false);
  assert.equal(row.provenance.memberAcceptance,false);
  assert.equal(row.provenance.publicationRights,'NOT_APPROVED');
 }
});

test('preflight covers the controlling editorial dimensions and distinct evidence',()=>{
 for(const dimension of ['formula_accuracy','originality_and_scenario_distinction','canonical_topic_consistency',
  'educational_clarity','practical_misconception_and_correction','explanation_correctness',
  'transfer_task_independence','research_provenance_boundaries','accessible_text_alternative'])
  assert.ok(report.rubric.includes(dimension),dimension);
 assert.equal(new Set(rows.map(x=>x.tabs.recognize[1])).size,20);
 assert.equal(new Set(rows.map(x=>x.transfer.prompt)).size,20);
});
