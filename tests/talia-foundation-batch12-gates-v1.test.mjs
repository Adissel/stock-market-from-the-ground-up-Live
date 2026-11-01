// Talia Foundation explanation batch 12 — 20 original risk and performance teaching drafts.
import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {originalGuides,answerFromGuide} from '../functions/_lib/original-competency-tutor-v014100.js';
const read=name=>JSON.parse(readFileSync(new URL('../data/'+name,import.meta.url),'utf8'));
const batches=Array.from({length:12},(_,i)=>read('talia-foundation-explanations-batch'+String(i+1).padStart(2,'0')+'-v1.json'));
const old=batches.slice(0,-1).flatMap(x=>x.guides),all=batches.flatMap(x=>x.guides),next=batches.at(-1).guides;
const core=read('competency-study-guides-v01499.json').guides;
const site=(count=12)=>({fetch:async req=>{
 const f=new URL(req.url).pathname.split('/').at(-1);
 if(f==='competency-study-guides-v01499.json')return new Response(JSON.stringify({guides:core}));
 const match=/^talia-foundation-explanations-batch(\d\d)-v1\.json$/.exec(f);
 const i=match?Number(match[1]):0;
 return i>0&&i<=count?new Response(JSON.stringify(batches[i-1])):new Response('Not Found',{status:404});
}});
test('240 distinct source-authored ungraded topics; canonical competencies unchanged',()=>{
 assert.equal(old.length,220);assert.equal(next.length,20);assert.equal(all.length,240);
 assert.deepEqual(batches.map(x=>x.guides.length),Array(12).fill(20));
 assert.equal(new Set(all.map(x=>x.code)).size,240);
 assert.equal(new Set(all.map(x=>x.title.trim().toLowerCase())).size,240);
 assert.equal(core.length,30);const coreIds=new Set(core.map(g=>g.code));
 for(const g of next){
  assert.ok(!coreIds.has(g.code));assert.equal(g.foundationTopic,true);
  assert.equal(g.supplemental,true);assert.equal(g.officialCompetency,false);
  assert.equal(g.independentEditorialApproved,false);
  assert.match(g.status,/pending_independent_editorial_review/);
  assert.match(g.workedCase,/^FICTIONAL:/);
  assert.equal(g.sourceUrls.length,1);assert.match(g.sourceUrls[0],/^https:\/\//);
  for(const key of ['concept','procedure','workedCase','limit','invalidation','commonError','selfCheck','reviewExplanation','transferQuestion'])assert.ok(g[key].length>=70,`${g.code} ${key}`);
 }
});
test('no private rubric, mastery grant, future-bar or claimed brokerage execution on newest lessons',()=>{
 for(const g of next){
  const explain=answerFromGuide(g,'explain','','Explain '+g.title);
  const deeper=answerFromGuide(g,'explain','','Teach this in more depth: '+g.title);
  const mistake=answerFromGuide(g,'explain','','Explain the common mistake: '+g.title);
  const review=answerFromGuide(g,'review','Uncertain response','Explain '+g.title);
  assert.ok(explain.includes(g.workedCase)&&explain.includes(g.transferQuestion),g.code);
  assert.ok(deeper.includes('1. Define the principle')&&deeper.includes(g.workedCase),g.code);
  assert.ok(mistake.includes(g.commonError));
  assert.match(review,/No rubric was scored and no mastery credit was awarded/);
  assert.doesNotMatch(explain,/guaranteed profit|mastery awarded|live execution confirmed/i);
 }
});
test('source-only lookup finds new topic by exact name and survives missing optional batch',async()=>{
 const request=new Request('https://tutor.example/api/market-tutor-v01492');
 const complete={ASSETS:site(12)},absent={ASSETS:site(11)};
 for(const g of [next[0],next[9],next[19]]){
  const selected=await originalGuides(complete,request,'Explain '+g.title);
  assert.equal(selected[0]?.code,g.code);
 }
 const lastOld=await originalGuides(absent,request,'Explain '+old.at(-1).title);
 const missing=await originalGuides(absent,request,'Explain '+next[0].title);
 assert.equal(lastOld[0]?.code,old.at(-1).code);
 assert.notEqual(missing[0]?.code,next[0].code);
});
test('separately calculated fictional risk cases match published worked examples',()=>{
 const near=(a,b)=>assert.ok(Math.abs(a-b)<1e-8,`${a} != ${b}`);
 near((9.90-10.10)*100,-20);
 near((18.6-20)*50,-70);
 near((50-49)*50,50);
 near(Math.floor(75/1.4),53);near(53*1.4,74.2);
 near(100*40/8000,.5);
 near(60*40,2400);near(60*(40-39),60);
 near(15000/10000,1.5);near(3/2,1.5);
 near(100*(.4*12-.6*6)/100,1.2);
 near(8/(12+8),.4);near(.9*1.1,.99);
 near(100*(10000-8500)/10000,15);
 near(100*8/20,40);near(60-8,52);
 near(100*(1.4-1)/1,40);near(50+40,90);
 near(10000*4/2000,20);
});
