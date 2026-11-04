// Source-evidence acceptance register: 64 actual Learning/Lab requirements.
// This is an automated inventory integrity gate, NOT genuine member,
// independent editorial, rights, accessibility or premium-release acceptance.
import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync,existsSync} from 'node:fs';
import {join} from 'node:path';
import {fileURLToPath} from 'node:url';

const root=fileURLToPath(new URL('../',import.meta.url));
const source=JSON.parse(readFileSync(new URL('../data/learning-lab-engine-feature-audit-v1.json',import.meta.url),'utf8'));
const features=source.features;
const register=readFileSync(new URL('../docs/qa/2026-11-03_LEARNING_LAB_64_FEATURE_ACCEPTANCE_REGISTER_V1.md',import.meta.url),'utf8');
const states=new Set(['integrated','partial','prototype','not_implemented']);
const tiers=['BASIC','ADVANCED','PROFESSIONAL','ENTERPRISE'];
const keyPrefix={learning:'LE',lab:'LA'};
const tierPrefix={BASIC:'BAS',ADVANCED:'ADV',PROFESSIONAL:'PRO',ENTERPRISE:'ENT'};
const sourceStates=['integrated','partial','prototype','not_implemented'];

test('Canonical feature ledger has 64 distinct requirements across eight engine and tier combinations',()=>{
 assert.equal(features.length,64);
 assert.equal(new Set(features.map(x=>x.id)).size,64);
 assert.equal(source.definition.includes('not a release')||source.definition.includes('Not a release'),true);
 assert.equal(source.status,'SOURCE_EVIDENCE_ONLY_NO_PREMIUM_RELEASE');
 assert.equal(source.frozen.learningBasic,'v3.3');
 assert.equal(source.frozen.labBasic,'v3.2');
 assert.equal(source.frozen.labIds,419);
 assert.equal(source.frozen.competencies,30);
 assert.equal(source.frozen.premiumFeaturesReleased,false);
 assert.equal(source.frozen.addonCheckout,false);
 assert.equal(source.owner_signoff_BASIC.approved_count,16);
 assert.equal(source.owner_signoff_BASIC.release_verification_status,'INDEPENDENT_EVIDENCE_RECONCILIATION_NOT_COMPLETED');
});

for(const engine of ['learning','lab']){
 for(const edition of tiers){
  const key=engine+'_'+edition;
  test('Eight feature slots and accurate calculated counts: '+key,()=>{
   const rows=features.filter(x=>x.engine===engine&&x.edition===edition);
   assert.equal(rows.length,8);
   for(const [i,feature] of rows.entries())
    assert.equal(feature.id,keyPrefix[engine]+'-'+tierPrefix[edition]+'-'+String(i+1).padStart(2,'0'));
   const summary=source.counts[key];
   assert.equal(summary.total,8);
   for(const state of sourceStates){
    const count=rows.filter(f=>f.source_status===state).length;
    assert.equal(summary[state],count,key+' '+state+' summary does not match source records');
   }
   const integrated=rows.filter(f=>f.source_status==='integrated').length;
   assert.equal(summary.integrated_percent,100*integrated/8);
   assert.equal(summary.released_features,0,'No premium publication inferred from source coverage');
   assert.ok(Number.isSafeInteger(summary.automation_file_references));
  });
 }
}

for(const [index,feature] of features.entries()){
 test('Feature '+String(index+1).padStart(2,'0')+'/64 '+feature.id+' evidence and release hold',()=>{
  assert.equal(typeof feature.title,'string');
  assert.ok(feature.title.length>=8,feature.id+' missing specific title');
  assert.ok(states.has(feature.source_status),feature.id+' invalid source state');
  assert.ok(typeof feature.acceptance_criterion==='string'&&feature.acceptance_criterion.length>20);
  assert.ok(typeof feature.unresolved==='string'&&feature.unresolved.length>15);
  assert.equal(typeof feature.real_member_accepted,'boolean',feature.id+' member evidence flag');
  assert.equal(typeof feature.independent_release_accepted,'boolean',feature.id+' release evidence flag');
  if(feature.real_member_accepted)assert.ok(Array.isArray(feature.member_acceptance_evidence)&&feature.member_acceptance_evidence.length>0,feature.id+' member evidence reference missing');
  if(feature.independent_release_accepted){
   assert.ok(feature.real_member_accepted&&feature.source_status==='integrated',feature.id+' release requires full evidence');
   assert.ok(Array.isArray(feature.release_acceptance_evidence)&&feature.release_acceptance_evidence.length>0,feature.id+' release evidence reference missing');
  }
  if(feature.source_status==='not_implemented'&&feature.id.endsWith('-08')&&feature.edition==='ENTERPRISE'){
   assert.equal(feature.evidence_file,null,'Unreleased Enterprise final approval must not invent an evidence artifact');
   assert.equal(feature.existing_test_file,null,'Unreleased Enterprise final approval must not invent a test artifact');
  }else{
   assert.ok(feature.evidence_file&&existsSync(join(root,feature.evidence_file)),feature.id+' source evidence missing');
   assert.ok(feature.existing_test_file&&existsSync(join(root,feature.existing_test_file)),feature.id+' executable reference missing');
  }
  if(feature.source_status==='integrated')assert.ok(feature.evidence_file&&feature.existing_test_file,feature.id+' source integration needs files and tests');
  const row=register.split('\n').find(line=>line.startsWith('| '+feature.id+' | '));
  assert.ok(row,feature.id+' absent from the controlled 64-item acceptance register');
  assert.ok(row.includes('| '+feature.source_status+' |'),feature.id+' documented source state has drifted');
  if(feature.evidence_file)assert.ok(row.includes(feature.evidence_file),feature.id+' evidence pointer omitted from register');
  if(feature.existing_test_file)assert.ok(row.includes(feature.existing_test_file),feature.id+' test pointer omitted from register');
 });
}

test('Source coverage is not accepted integration or website completion',()=>{
 const counts=features.reduce((m,f)=>(m[f.source_status]=(m[f.source_status]||0)+1,m),{});
 const computed=Object.fromEntries(sourceStates.map(status=>[status,Object.values(source.counts).reduce((sum,row)=>sum+row[status],0)]));
 assert.deepEqual(counts,computed);
 assert.equal(features.filter(f=>f.source_status!=='not_implemented').length,features.length-counts.not_implemented);
 assert.equal(features.filter(f=>f.real_member_accepted).length,source.features.filter(f=>f.real_member_accepted===true).length);
 assert.equal(features.filter(f=>f.independent_release_accepted).length,source.features.filter(f=>f.independent_release_accepted===true).length);
 assert.match(register,/Source.*coverage/i);
 assert.match(register,/not the full website completion percentage/i);
});

test('All six independent acceptance gaps remain visible to release governance',()=>{
 const ids=features.filter(f=>f.edition!=='BASIC'&&f.id.endsWith('-08')&&!f.independent_release_accepted).map(f=>f.id).sort();
 assert.ok(ids.length<=6,'At most six edition-specific final release gates');
 for(const id of ids)assert.ok(register.includes(id),'Independent release gap omitted: '+id);
 assert.match(register,/genuine two-account/);
 assert.match(register,/screen-reader/);
 assert.match(register,/source-rights/);
 assert.match(register,/grading.*hold/i);
});
