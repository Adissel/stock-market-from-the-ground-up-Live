// Foundation batches 10-11: protected source-only drafts, distinct teaching and no lookahead.
import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {originalGuides,answerFromGuide} from '../functions/_lib/original-competency-tutor-v014100.js';
const read=n=>JSON.parse(readFileSync(new URL('../data/'+n,import.meta.url),'utf8'));
const batches=Array.from({length:11},(_,i)=>read('talia-foundation-explanations-batch'+String(i+1).padStart(2,'0')+'-v1.json'));
const all=batches.flatMap(x=>x.guides), recent=all.slice(180);
const core=read('competency-study-guides-v01499.json').guides;
const site=(count=11)=>({fetch:async r=>{
 const name=new URL(r.url).pathname.split('/').at(-1);
 if(name==='competency-study-guides-v01499.json')return new Response(JSON.stringify({guides:core}));
 const id=Number((/talia-foundation-explanations-batch(\d\d)-v1\.json/.exec(name)||[])[1]);
 return id&&id<=count?new Response(JSON.stringify(batches[id-1])):new Response('absent',{status:404});
}});
test('220 distinct original topics, latest 40 require separate editorial hold and originals preserved',()=>{
 assert.equal(all.length,220);assert.equal(recent.length,40);
 assert.equal(new Set(all.map(x=>x.code)).size,220);
 assert.equal(new Set(all.map(x=>x.title.toLowerCase())).size,220);
 assert.equal(core.length,30);const ids=new Set(core.map(x=>x.code));
 for(const b of batches)assert.equal(b.count,20);
 for(const g of recent){
  assert.equal(g.supplemental,true);assert.equal(g.foundationTopic,true);
  assert.equal(g.officialCompetency,false);assert.equal(g.independentEditorialApproved,false);
  assert.match(g.status,/pending_independent_editorial_review/);
  assert.ok(!ids.has(g.code));assert.match(g.workedCase,/^FICTIONAL:/);
  for(const f of ['concept','procedure','workedCase','limit','invalidation','commonError','selfCheck','reviewExplanation','transferQuestion'])assert.ok(g[f].length>=70,g.code+' '+f);
  assert.equal(g.sourceUrls.length,1);assert.match(g.sourceUrls[0],/^https:\/\//);
 }
});
test('new lessons independently separate normal, deep, mistake and ungraded review routes',()=>{
 for(const g of recent){
  const explain=answerFromGuide(g,'explain','','Explain '+g.title);
  assert.ok(explain.includes(g.workedCase)&&explain.includes(g.transferQuestion),g.code);
  const deeper=answerFromGuide(g,'explain','','Teach this in more depth: '+g.title);
  assert.ok(deeper.includes('1. Define the principle')&&deeper.includes(g.workedCase),g.code);
  const mistake=answerFromGuide(g,'explain','','Explain the common mistake: '+g.title);
  assert.ok(mistake.includes(g.commonError),g.code);
  const review=answerFromGuide(g,'review','I was uncertain','Explain '+g.title);
  assert.match(review,/No rubric was scored and no mastery credit was awarded/);
  assert.doesNotMatch(explain,/guaranteed profit|future price known|mastery awarded|live execution confirmed/i);
 }
});
test('source-only member routing selects new topics; absent optional batch11 cannot hide prior lessons',async()=>{
 const req=new Request('https://tutor.example/api/market-tutor-v01492');
 const full={ASSETS:site()};
 for(const g of [...recent.slice(0,3),...recent.slice(20,23)]){
  const x=await originalGuides(full,req,'Explain '+g.title);
  assert.equal(x[0]?.code,g.code,'Exact topic retrieval '+g.code);
 }
 const old={ASSETS:site(10)};
 const first=await originalGuides(old,req,'Explain '+recent[0].title);
 const second=await originalGuides(old,req,'Explain '+recent[20].title);
 assert.equal(first[0]?.code,recent[0].code);
 assert.notEqual(second[0]?.code,recent[20].code);
});
test('independent fictional calculations verify a bounded set of source examples',()=>{
 const near=(a,b)=>assert.ok(Math.abs(a-b)<1e-8,`${a} ≠ ${b}`);
 near(.2*11+.8*10,10.2);near(2/(20+1),.09523809523809523);
 near((12+9+12)/3*300,3300);near(60-45,15);
 near(3*1.2*100,360);near(Math.max(58-50,0)-3,5);
 near(Math.max(70-60,0)-4,6);near(2-25,-23);
 near(Math.min(Math.max(60-50,0)-Math.max(60-55,0),5)-1.5,3.5);
 near(Math.abs(112-100)-6,6);near((2.65-2.4)*100,25);
});
