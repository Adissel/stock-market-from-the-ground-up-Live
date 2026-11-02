import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const ledger=JSON.parse(readFileSync('data/learning-lab-engine-feature-audit-v1.json','utf8'));
const bridges=Object.values(JSON.parse(readFileSync('data/lab-teaching-bridges-v014168.json','utf8')).entries);
const open=['LE-BAS-06','LE-BAS-07','LE-BAS-08','LA-BAS-06','LA-BAS-07','LA-BAS-08'];
test('Basic outstanding criteria remain independently tracked',()=>{
 for(const id of open){
  const f=ledger.features.find(x=>x.id===id);
  assert.ok(f,id);
  assert.equal(f.source_status,'partial',id);
  assert.equal(f.real_member_accepted,false,id);
 }
});
test('Canonical bridge count and editorial status remain visible',()=>{
 assert.equal(bridges.length,419);
 for(const x of bridges){
  assert.ok(x.instructionSource,x.labId);
  assert.equal(x.provenance?.independentEditorialAcceptance ?? false,false,x.labId);
  assert.equal(x.transfer?.graded ?? false,false,x.labId);
  assert.equal(x.transfer?.noLookahead,true,x.labId);
 }
});
test('Basic Academy account isolation remains a source gate',()=>{
 const s=readFileSync('assets/js/bootcamp-academy-v014168.js','utf8');
 assert.match(s,/dayMember===userId&&daySession===sessionSerial/);
 assert.match(s,/progressStore:enrolled&&progressAvailable/);
});

test('Basic indicator lessons retain canonical ATR and Bollinger bindings with editorial review pending',()=>{
 const entries=JSON.parse(readFileSync('data/lab-teaching-bridges-v014168.json','utf8')).entries;
 for(const [id,study] of [['DT-C19-L03','atr'],['F3-C07-L04','bollinger']]){
  const row=entries[id];assert.ok(row,id);
  assert.equal(row.indicatorLesson.studyId,study,id);
  assert.match(row.indicatorLesson.mappingStatus,/EDITORIAL_REVIEW_PENDING/,id);
  assert.equal(row.indicatorLesson.officialGrade,false,id);
 }
});
test('Basic chart workbench cannot bypass the canonical topic mapping and includes accessible evidence',()=>{
 const s=readFileSync('assets/js/learning-quant-studies-ui-v1.js','utf8');
 assert.match(s,/selected!==studyId/);
 assert.match(s,/table\.append\(thead,tbody\)/);
 assert.match(s,/th\.setAttribute\('scope','row'\)/);
 assert.match(s,/Independent transfer results/);
});
test('Basic progress save requires authenticated enrollment and current session',()=>{
 const s=readFileSync('assets/js/bootcamp-academy-v014168.js','utf8');
 assert.match(s,/progressStore:enrolled&&progressAvailable/);
 assert.match(s,/dayMember===userId&&daySession===sessionSerial/);
 assert.match(s,/progress\.clear\(\);for\(const x of data\.progress\)progress\.set\(x\.day,x\)/);
});
