import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {originalGuides,answerFromGuide} from '../functions/_lib/original-competency-tutor-v014100.js';
const get=p=>readFileSync(new URL('../'+p,import.meta.url),'utf8');
const batches=[1,2,3,4].map(n=>JSON.parse(get('data/talia-foundation-explanations-batch0'+n+'-v1.json')));
const core=JSON.parse(get('data/competency-study-guides-v01499.json')).guides;
const sourceAssets=(maxBatch=4)=>({fetch:async request=>{
 const filename=new URL(request.url).pathname.split('/').at(-1);
 if(filename==='competency-study-guides-v01499.json')return new Response(get('data/'+filename),{status:200});
 const n=Number((/batch0([1-4])/.exec(filename)||[])[1]);
 return n&&n<=maxBatch?new Response(get('data/'+filename),{status:200}):new Response('not found',{status:404});
}});
test('80 unique Foundation drafts preserve 30 official competency IDs and non-approved status',()=>{
 const all=batches.flatMap(x=>x.guides);
 assert.equal(all.length,80);assert.equal(core.length,30);
 assert.equal(new Set(all.map(x=>x.code)).size,80);
 assert.equal(new Set(all.map(x=>x.title.toLowerCase())).size,80);
 assert.equal(batches[3].batch,4);assert.equal(batches[3].count,20);assert.equal(batches[3].goal,600);
 const official=new Set(core.map(x=>x.code));
 for(const g of all){
  assert.equal(g.foundationTopic,true);
  assert.equal(g.officialCompetency,false);
  assert.equal(g.independentEditorialApproved,false);
  assert.equal(g.status,'original_source_authored_ungraded_pending_independent_editorial_review');
  assert.ok(!official.has(g.code));
  assert.match(g.workedCase,/^FICTIONAL:/);
  assert.equal(g.sourceUrls.length,1);
  for(const field of ['title','concept','procedure','workedCase','limit','invalidation','commonError','selfCheck','reviewExplanation','transferQuestion'])
   assert.ok(typeof g[field]==='string'&&g[field].length>=28,g.code+' '+field);
 }
});
test('All 80 exact-title lookups use the existing Tutor public-source contract without private scores',async()=>{
 const env={ASSETS:sourceAssets()},req=new Request('https://tutor.example/api/market-tutor-v01492');
 for(const g of batches.flatMap(x=>x.guides)){
  const matches=await originalGuides(env,req,'Explain '+g.title);
  assert.equal(matches[0]?.code,g.code,'Exact match for '+g.code);
 }
 for(const g of batches[3].guides){
  const explain=answerFromGuide(g,'explain','','Explain '+g.title);
  assert.ok(explain.includes(g.workedCase));
  assert.ok(explain.includes(g.transferQuestion));
  const correction=answerFromGuide(g,'explain','','Explain the common mistake: '+g.title);
  assert.ok(correction.includes(g.commonError));
  const question=answerFromGuide(g,'question','','Explain '+g.title);
  const review=answerFromGuide(g,'review','I am uncertain','Explain '+g.title);
  assert.doesNotMatch(question,/Original fictional worked explanation/);
  assert.doesNotMatch(review,/Original fictional worked explanation/);
  assert.match(review,/No rubric was scored/);
 }
});
test('Missing fourth asset does not disable 60 previous lessons or 30 canonical source competencies',async()=>{
 const env={ASSETS:sourceAssets(3)},req=new Request('https://tutor.example/api/market-tutor-v01492');
 for(const b of batches.slice(0,3)){
  const g=b.guides[0],results=await originalGuides(env,req,'Explain '+g.title);
  assert.equal(results[0]?.code,g.code);
 }
 const last=batches[3].guides[0];
 const attempted=await originalGuides(env,req,'Explain '+last.title);
 assert.notEqual(attempted[0]?.code,last.code);
 assert.equal(core.length,30);
});
