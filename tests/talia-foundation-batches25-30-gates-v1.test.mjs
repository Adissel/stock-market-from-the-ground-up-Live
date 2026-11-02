import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';

const root=new URL('../',import.meta.url);
const read=n=>JSON.parse(readFileSync(new URL(`data/talia-foundation-explanations-batch${n}-v1.json`,root),'utf8'));
const newBatches=['25','26','27','28','29','30'].map(read);
const newRecords=newBatches.flatMap(batch=>batch.guides);
const allRecords=Array.from({length:30},(_,index)=>read(String(index+1).padStart(2,'0'))).flatMap(batch=>batch.guides);

test('Foundation explanations 481-600 are 120 distinct complete ungraded records',()=>{
 assert.deepEqual(newBatches.map(batch=>batch.guides.length),[20,20,20,20,20,20]);
 assert.equal(new Set(newRecords.map(record=>record.code)).size,120);
 assert.equal(new Set(newRecords.map(record=>record.title.toLowerCase())).size,120);
 assert.equal(new Set(newRecords.map(record=>record.workedCase.toLowerCase())).size,120);
 assert.equal(new Set(newRecords.map(record=>record.transferQuestion.toLowerCase())).size,120);
 for(const record of newRecords){
  assert.match(record.code,/^TALIA_TOPIC_[A-Z0-9_]+$/);
  assert.ok(typeof record.title==='string'&&record.title.length>=4,record.code+' title');
  for(const field of ['concept','prerequisites','procedure','workedCase','limit','invalidation','commonError','selfCheck','reviewExplanation','transferQuestion'])
   assert.ok(typeof record[field]==='string'&&record[field].length>=15,record.code+' '+field);
  assert.match(record.workedCase,/FICTIONAL/i);
  assert.match(record.transferQuestion,/FICTIONAL/i);
  assert.match(record.reviewExplanation,/Ungraded Talia walkthrough:/);
  assert.ok(Array.isArray(record.sourceUrls)&&record.sourceUrls.length>0,record.code+' sources');
  assert.equal(record.supplemental,true);
  assert.equal(record.foundationTopic,true);
  assert.equal(record.officialCompetency,false);
  assert.equal(record.independentEditorialApproved,false);
  assert.match(record.status,/pending_independent_editorial_review/);
  assert.match(record.sourceRightsStatus,/not_verified/);
  assert.equal(record.editorSourceReview.independentPublicationAccepted,false);
 }
});

test('the complete Foundation explanation target is exactly 600 unique source drafts',()=>{
 assert.equal(allRecords.length,600);
 assert.equal(new Set(allRecords.map(record=>record.code)).size,600);
 assert.equal(new Set(allRecords.map(record=>record.title.toLowerCase())).size,600);
 assert.equal(allRecords.filter(record=>record.independentEditorialApproved===true).length,0);
});

test('Tutor loader, coverage, build and workflow reference all six final batches',()=>{
 const files=['functions/_lib/original-competency-tutor-v014100.js','scripts/build-pages.sh','scripts/talia-foundation-coverage-v1.mjs','.github/workflows/learning-tutor-v01492.yml'];
 for(const file of files){
  const source=readFileSync(new URL(file,root),'utf8');
  for(const batch of ['25','26','27','28','29','30'])assert.ok(source.includes(`batch${batch}-v1.json`)||source.includes('batch{01..30}-v1.json'),file+' '+batch);
 }
});
