/* Tutor Foundation 600-program, editorial draft batch 03.
 * Unscored source content must remain distinct from 30 protected competencies.
 */
import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {originalGuides,answerFromGuide} from '../functions/_lib/original-competency-tutor-v014100.js';
const read=p=>readFileSync(new URL('../'+p,import.meta.url),'utf8');
const first=JSON.parse(read('data/talia-foundation-explanations-batch01-v1.json'));
const second=JSON.parse(read('data/talia-foundation-explanations-batch02-v1.json'));
const third=JSON.parse(read('data/talia-foundation-explanations-batch03-v1.json'));
const core=JSON.parse(read('data/competency-study-guides-v01499.json')).guides;
const indicator=JSON.parse(read('data/tutor-indicator-study-v1.json')).guides;
const extended=JSON.parse(read('data/tutor-indicator-expansion-v1.json')).guides;
const permitted=['competency-study-guides-v01499.json','talia-foundation-explanations-batch01-v1.json','talia-foundation-explanations-batch02-v1.json','talia-foundation-explanations-batch03-v1.json'];
function assets(includeThird=true){
 return {fetch:async request=>{
  const name=new URL(request.url).pathname.split('/').at(-1);
  if(!permitted.includes(name)||(name.includes('batch03')&&!includeThird))return new Response('Not found',{status:404});
  return new Response(read('data/'+name),{status:200,headers:{'content-type':'application/json'}});
 }};
}
test('The third batch brings 600-program to 60 distinct source-authored teaching candidates, not graded completions',()=>{
 const all=[...first.guides,...second.guides,...third.guides];
 assert.equal(first.guides.length,20);assert.equal(second.guides.length,20);assert.equal(third.guides.length,20);
 assert.equal(third.count,20);assert.equal(third.goal,600);assert.equal(third.batch,3);
 assert.equal(all.length,60);assert.equal(new Set(all.map(x=>x.code)).size,60);
 assert.equal(new Set(all.map(x=>x.title.toLowerCase())).size,60);
 assert.equal(core.length,30);assert.equal(indicator.length+extended.length,73);
 const ids=new Set([...core,...indicator,...extended].map(g=>g.code));
 for(const g of all){
  assert.ok(!ids.has(g.code),'Accidental assessed or indicator overwrite: '+g.code);
  assert.equal(g.foundationTopic,true);assert.equal(g.supplemental,true);
  assert.equal(g.officialCompetency,false);assert.equal(g.independentEditorialApproved,false);
  assert.match(g.status,/pending_independent_editorial_review/);
  assert.ok(g.workedCase.startsWith('FICTIONAL:'));
  for(const field of ['title','concept','procedure','workedCase','limit','invalidation','commonError','selfCheck','reviewExplanation','transferQuestion']){
   assert.ok(typeof g[field]==='string'&&g[field].length>=28,g.code+' '+field);
  }
 }
});
test('All twenty new topics deliver first principles, misconception, fictional example, independent transfer, and secure grading separation',()=>{
 for(const g of third.guides){
  const regular=answerFromGuide(g,'explain','','Explain '+g.title);
  const deep=answerFromGuide(g,'explain','','Teach this in more depth: '+g.title);
  const question=answerFromGuide(g,'question','','Explain '+g.title);
  const review=answerFromGuide(g,'review','Uncertain about the calculation','Explain '+g.title);
  const wrong=answerFromGuide(g,'explain','','Explain the common mistake: '+g.title);
  for(const text of [regular,deep]){assert.ok(text.includes(g.workedCase));assert.ok(text.includes(g.transferQuestion));}
  assert.ok(wrong.includes(g.commonError));assert.match(wrong,/not a claim about what you personally believed/);
  assert.doesNotMatch(question,/Original fictional worked explanation/);
  assert.doesNotMatch(review,/Original fictional worked explanation/);
  assert.match(review,/No rubric was scored/);
  assert.doesNotMatch(regular,/guaranteed profit|enter the actual trade now|mastery awarded/i);
 }
});
test('All sixty exact-title matches resolve through the existing source-only Tutor without grades',async()=>{
 const env={ASSETS:assets()},request=new Request('https://example.test/api/market-tutor-v01492');
 for(const g of [...first.guides,...second.guides,...third.guides]){
  const result=await originalGuides(env,request,'Explain '+g.title);
  assert.equal(result[0]?.code,g.code,'Exact source guide lookup: '+g.title);
 }
});
test('Unavailable optional batch 03 does not disable previous forty official-safe explanations',async()=>{
 const env={ASSETS:assets(false)},request=new Request('https://example.test/api/market-tutor-v01492');
 for(const g of [first.guides[0],second.guides[0]]){
  const result=await originalGuides(env,request,'Explain '+g.title);
  assert.equal(result[0]?.code,g.code);
 }
 const thirdResult=await originalGuides(env,request,'Explain '+third.guides[0].title);
 assert.notEqual(thirdResult[0]?.code,third.guides[0].code);
});
