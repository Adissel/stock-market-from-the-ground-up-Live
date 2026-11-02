import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const read=n=>JSON.parse(readFileSync(new URL('../data/talia-foundation-explanations-batch'+n+'-v1.json',import.meta.url),'utf8'));
const batches=[read('19'),read('20')],records=batches.flatMap(b=>b.guides);
test('Foundation 361-400: unique complete ungraded source identities',()=>{
 assert.deepEqual(batches.map(b=>b.guides.length),[20,20]);
 assert.equal(new Set(records.map(x=>x.code)).size,40);
 assert.equal(new Set(records.map(x=>x.title.toLowerCase())).size,40);
 for(const x of records){
  assert.match(x.code,/^TALIA_TOPIC_[A-Z0-9_]+$/);
  for(const field of ['title','concept','procedure','workedCase','limit','invalidation','commonError','selfCheck','reviewExplanation','transferQuestion'])
   assert.ok(typeof x[field]==='string'&&x[field].length>=15,x.code+' '+field);
  assert.match(x.workedCase,/FICTIONAL/);
  assert.equal(x.officialCompetency,false);assert.equal(x.independentEditorialApproved,false);
  assert.equal(x.editorSourceReview.independentPublicationAccepted,false);
 }
});
test('Production Tutor and build references stay synchronized',()=>{
 const files=['functions/_lib/original-competency-tutor-v014100.js','scripts/build-pages.sh','scripts/talia-foundation-coverage-v1.mjs','.github/workflows/learning-tutor-v01492.yml'];
 for(const file of files){
  const source=readFileSync(new URL('../'+file,import.meta.url),'utf8');
  for(const n of ['19','20'])assert.ok(source.includes('talia-foundation-explanations-batch'+n+'-v1.json'),file+' '+n);
 }
});
test('Selected fictional financial statements and point-in-time arithmetic',()=>{
 const close=(a,b)=>assert.ok(Math.abs(a-b)<=1e-9*Math.max(1,Math.abs(b)),String(a)+' != '+b);
 close(10000-6000,4000);
 close(20000-1500,18500);
 close(10*8,80);
 close((12000-2000)/5,2000);
 close(10000-1500*3,5500);
 close(4000-1500,2500);
 close(30000-18000,12000);
 close((5000+2000+3000)/8000,1.25);
 close(100000-65000,35000);
 close(900000/300000,3);
 close(18/6,3);
 close(50000-15000,35000);
 close(75000/50000,1.5);
 close(600-100,500);
 close(1200000/600000,2);
 close(2+3+2+4,11);
 close((120-100)/100,.2);
 close(500000/100000,5);
 close(100/1250,.08);
 close((.3-0)/.1,3);
 close((100000-30000)/100000,.7);
 close((20*10+21*90)/100,20.9);
 close((10.3-(10+10.1)/2),.25);
 close(300-200,100);
 close(20/100,.2);
 close((15-8-10),-3);
 close(20/Math.sqrt(25),4);
 close((1000-800)/800,.25);
});
