import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {originalGuides,answerFromGuide} from '../functions/_lib/original-competency-tutor-v014100.js';
const read=p=>readFileSync(new URL('../'+p,import.meta.url),'utf8');
const content=JSON.parse(read('data/talia-foundation-explanations-batch01-v1.json'));
const core=JSON.parse(read('data/competency-study-guides-v01499.json'));
const indicators=JSON.parse(read('data/tutor-indicator-study-v1.json'));
const expansion=JSON.parse(read('data/tutor-indicator-expansion-v1.json'));
test('Twenty original distinct Foundation explanations retain official competency identity and independent assessment boundary',()=>{
 assert.equal(content.kind,'talia_foundation_supplemental_explanations_v1');
 assert.equal(content.count,20);assert.equal(content.goal,600);
 assert.equal(core.guides.length,30);assert.equal(indicators.guides.length,61);
 assert.equal(expansion.guides.length,12);assert.equal(content.guides.length,20);
 const all=[...core.guides,...indicators.guides,...expansion.guides,...content.guides];
 assert.equal(new Set(all.map(x=>x.code)).size,all.length,'No official indicator or supplemental code collisions');
 assert.equal(new Set(content.guides.map(x=>x.title.toLowerCase())).size,20);
 for(const g of content.guides){
  assert.match(g.code,/^TALIA_TOPIC_[A-Z0-9_]+$/);
  assert.equal(g.foundationTopic,true);
  assert.equal(g.officialCompetency,false);
  assert.equal(g.independentEditorialApproved,false);
  assert.ok(g.workedCase.startsWith('FICTIONAL:'));
  for(const key of ['concept','procedure','workedCase','limit','commonError','invalidation','selfCheck','reviewExplanation','transferQuestion']){
   assert.ok(g[key]?.length>=28,g.code+' missing '+key);
  }
  const explain=answerFromGuide(g,'explain','','Explain '+g.title);
  const selfCheck=answerFromGuide(g,'question','','Explain '+g.title);
  const review=answerFromGuide(g,'review','My proposed reasoning was uncertain','Explain '+g.title);
  assert.ok(explain.includes(g.workedCase));
  assert.ok(explain.includes(g.transferQuestion));
  assert.match(explain,/Original ungraded Foundation explanation/);
  assert.doesNotMatch(selfCheck,/Original fictional worked explanation/);
  assert.doesNotMatch(review,/Original fictional worked explanation/);
  assert.match(review,/No rubric was scored/);
  assert.doesNotMatch(explain,/mastery awarded|guaranteed profit|verified live transaction/i);
 }
});
test('Supplementary Foundation topics are retrievable in the existing source-only Tutor without changing grade IDs',async()=>{
 const assets={fetch:async request=>{
  const filename=new URL(request.url).pathname.split('/').pop();
  const permitted=new Set(['competency-study-guides-v01499.json','talia-foundation-explanations-batch01-v1.json']);
  if(!permitted.has(filename))return new Response('missing',{status:404});
  const name='data/'+filename;
  return new Response(read(name),{status:200,headers:{'content-type':'application/json'}});
 }};
 const request=new Request('https://member.example/api/market-tutor-v01492');
 for(const g of content.guides){
  const matches=await originalGuides({ASSETS:assets},request,'Explain '+g.title);
  assert.equal(matches[0]?.code,g.code,g.title+' precise topic retrieval');
 }
 const api=read('functions/api/market-tutor-v01492.js');
 assert.match(api,/guide\.foundationTopic===true\?\{text:null,reason:'foundation_supplementary_source_only'/);
 assert.match(api,/Original supplementary Foundation topic \(ungraded\)/);
});
