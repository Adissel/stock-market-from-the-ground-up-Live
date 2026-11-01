import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {originalGuides,answerFromGuide} from '../functions/_lib/original-competency-tutor-v014100.js';
const load=p=>JSON.parse(readFileSync(new URL('../data/'+p,import.meta.url),'utf8'));
const all=Array.from({length:9},(_,i)=>load('talia-foundation-explanations-batch0'+(i+1)+'-v1.json'));
const old=all.slice(0,7).flatMap(x=>x.guides);
const newer=all.slice(7).flatMap(x=>x.guides);
const fn=(max=9)=>({fetch:async request=>{
 const name=new URL(request.url).pathname.split('/').at(-1);
 if(name==='competency-study-guides-v01499.json')return new Response(readFileSync(new URL('../data/'+name,import.meta.url),'utf8'));
 const i=Number((/batch0([1-9])/.exec(name)||[])[1]);
 return i&&i<=max?new Response(readFileSync(new URL('../data/'+name,import.meta.url),'utf8')):new Response('not found',{status:404});
}});
test('Authoring must be 180 unique original source-only ungraded topics',()=>{
 assert.deepEqual(all.map(x=>x.guides.length),Array(9).fill(20));
 assert.equal(newer.length,40);assert.equal(old.length,140);
 const combined=[...old,...newer];
 assert.equal(new Set(combined.map(x=>x.code)).size,180);
 assert.equal(new Set(combined.map(x=>x.title.trim().toLowerCase())).size,180);
 const official=load('competency-study-guides-v01499.json').guides;
 const officialIds=new Set(official.map(x=>x.code));
 assert.equal(official.length,30);
 for(const g of newer){
  assert.equal(g.supplemental,true);assert.equal(g.foundationTopic,true);
  assert.equal(g.officialCompetency,false);assert.equal(g.independentEditorialApproved,false);
  assert.ok(!officialIds.has(g.code));assert.match(g.code,/^TALIA_TOPIC_[A-Z0-9_]+$/);
  assert.match(g.workedCase,/^FICTIONAL:/);
  for(const k of ['concept','procedure','workedCase','limit','invalidation','commonError','selfCheck','reviewExplanation','transferQuestion'])assert.ok(g[k]?.length>=70,g.code+' '+k);
  assert.equal(g.sourceUrls.length,1);assert.match(g.sourceUrls[0],/^https:\/\//);
  assert.match(g.status,/pending_independent_editorial_review/);
 }
});
test('Source-only Tutor keeps explanatory and assessment contexts separate for all 40',()=>{
 for(const g of newer){
  const explain=answerFromGuide(g,'explain','','Explain '+g.title);
  assert.ok(explain.includes(g.workedCase));
  assert.ok(explain.includes(g.transferQuestion));
  const deep=answerFromGuide(g,'explain','','Teach this in more depth: '+g.title);
  assert.ok(deep.includes('1. Define the principle'),g.code);
  assert.ok(deep.includes(g.workedCase));
  assert.notEqual(deep,explain);
  const mistake=answerFromGuide(g,'explain','','Explain the common mistake: '+g.title);
  assert.ok(mistake.includes(g.commonError));
  assert.match(mistake,/not a claim about what you personally believed/);
  const question=answerFromGuide(g,'question','','Explain '+g.title);
  assert.ok(!question.includes('Original fictional worked explanation:'),g.code);
  const review=answerFromGuide(g,'review','I was uncertain','Explain '+g.title);
  assert.match(review,/No rubric was scored and no mastery credit was awarded/);
  assert.doesNotMatch(explain,/guaranteed profit|mastery awarded|live execution confirmed/i);
 }
});
test('Authenticated source guide lookup reuses old lessons and exposes new topics without duplication',async()=>{
 const env={ASSETS:fn()},request=new Request('https://tutor.example/api/market-tutor-v01492');
 for(const g of [old[0],old.at(-1),...newer]){
  const selected=await originalGuides(env,request,'Explain '+g.title);
  assert.equal(selected[0]?.code,g.code,'Expected exact title retrieval: '+g.code);
 }
});
test('Missing ninth batch does not block earlier topics or the eighth optional batch',async()=>{
 const env={ASSETS:fn(8)},request=new Request('https://tutor.example/api/market-tutor-v01492');
 const [before,new8,new9]=await Promise.all([
  originalGuides(env,request,'Explain '+old[1].title),
  originalGuides(env,request,'Explain '+newer[0].title),
  originalGuides(env,request,'Explain '+newer[39].title)]);
 assert.equal(before[0]?.code,old[1].code);
 assert.equal(new8[0]?.code,newer[0].code);
 assert.notEqual(new9[0]?.code,newer[39].code);
});
