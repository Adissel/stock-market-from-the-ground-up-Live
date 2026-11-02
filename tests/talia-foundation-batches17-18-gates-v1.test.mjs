import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const source=n=>JSON.parse(readFileSync(new URL('../data/talia-foundation-explanations-batch'+n+'-v1.json',import.meta.url),'utf8'));
const x=source('17'),y=source('18'),records=[...x.guides,...y.guides];
test('40 ungraded explanations have source identities and instructional fields',()=>{
 assert.equal(x.count,20);assert.equal(y.count,20);assert.equal(records.length,40);
 assert.equal(new Set(records.map(g=>g.code)).size,40);
 assert.equal(new Set(records.map(g=>g.title.toLowerCase())).size,40);
 for(const g of records){
  assert.match(g.code,/^TALIA_TOPIC_[A-Z0-9_]+$/);
  for(const k of ['title','concept','procedure','workedCase','limit','invalidation','commonError','selfCheck','reviewExplanation','transferQuestion'])
   assert.ok(typeof g[k]==='string'&&g[k].length>(k==='title'?14:19),g.code+': '+k);
  assert.match(g.workedCase,/^FICTIONAL:/);
  assert.match(g.transferQuestion,/^FICTIONAL/);
  assert.equal(g.foundationTopic,true);
  assert.equal(g.officialCompetency,false);
  assert.equal(g.independentEditorialApproved,false);
  assert.equal(g.editorSourceReview.independentPublicationAccepted,false);
 }
});
test('new lessons registered for production asset retrieval and coverage',()=>{
 const code=readFileSync(new URL('../functions/_lib/original-competency-tutor-v014100.js',import.meta.url),'utf8');
 const build=readFileSync(new URL('../scripts/build-pages.sh',import.meta.url),'utf8');
 const coverage=readFileSync(new URL('../scripts/talia-foundation-coverage-v1.mjs',import.meta.url),'utf8');
 const workflow=readFileSync(new URL('../.github/workflows/learning-tutor-v01492.yml',import.meta.url),'utf8');
 for(const n of ['17','18']){
  const file='talia-foundation-explanations-batch'+n+'-v1.json';
  assert.ok(code.includes(file));assert.ok(build.includes(file));assert.ok(coverage.includes(file));
  assert.ok(workflow.includes('data/'+file));
 }
});
test('independently specified fictional computation checks',()=>{
 const close=(a,b)=>assert.ok(Math.abs(a-b)<1e-9,String(a)+' != '+b);
 close((10+12+14)/3,12);
 close((20+30+40)/3,30);
 close(2/(9+1),.2);
 close(.2*105+.8*100,101);
 close((10+12+14)/3,12);
 close(.5*16+.5*12,14);
 close(Math.max(106-104,Math.abs(106-100),Math.abs(104-100)),6);
 close((4*2+10)/3,6);
 close(10+2*Math.sqrt(8/3),13.265986323710904);
 close(Math.max(13,11,12),13);
 close((10*100+12*300)/400,11.5);
 close((10*10+12*30)/40,11.5);
 close(100-100/(1+5),83.33333333333333);
 close(1.4-1.1,.3);
 close((12-10)/(15-10)*100,40);
 close((1200-1000)/1000,.2);
 close((50.25-50)/50*10000,50);
 close(.8*2*50,80);
 close(Math.floor(100/(.6*2)),83);
 close((20.1-20)/20*10000,50);
 close(120000/80000,1.5);
 close((50.6-50)/50, .012);
 close((30.3-30)/30,.01);
 close(Math.abs(10.6-10)/(11-9),.3);
 close((12-Math.max(10,11))/(12-9),1/3);
 close((Math.min(10,11)-9)/(12-9),1/3);
 close(10000/.5,20000);
 close((30-29)*40,40);
 close((3000-1000)/(3000+1000),.5);
 close(300/500,.6);
 close((50+100+150+100)/4,100);
});
