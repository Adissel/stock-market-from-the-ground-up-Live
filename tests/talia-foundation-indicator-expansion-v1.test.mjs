import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {originalGuides,answerFromGuide} from '../functions/_lib/original-competency-tutor-v014100.js';
const load=name=>JSON.parse(readFileSync(new URL('../data/'+name,import.meta.url),'utf8'));
const old=load('tutor-indicator-study-v1.json'),extension=load('tutor-indicator-expansion-v1.json'),competencies=load('competency-study-guides-v01499.json');
test('Foundation adds 12 source-informed indicator briefs without changing official 30 or original 61',()=>{
 assert.equal(competencies.guides.length,30);
 assert.equal(old.guides.length,61);
 assert.equal(extension.kind,'original_public_tutor_master_study');
 assert.equal(extension.group,'indicators_extension');
 assert.equal(extension.count,12);
 assert.equal(extension.guides.length,12);
 const codes=[...old.guides,...extension.guides].map(g=>g.code);
 assert.equal(new Set(codes).size,73,'new indicator IDs must be distinct from existing 61');
 const titles=[...old.guides,...extension.guides].map(g=>g.title.toLowerCase());
 assert.equal(new Set(titles).size,73,'do not count a renamed legacy indicator as a new study');
 for(const g of extension.guides){
  assert.equal(g.kind,'indicator');assert.equal(g.masterStudy,true);
  assert.equal(g.officialCompetency,false);assert.equal(g.supplemental,true);
  assert.match(g.teachingStatus,/pending_independent_editorial_qa/);
  assert.ok(g.fictionalPrompt.startsWith('FICTIONAL:'));
  assert.ok(g.formula.length>=20&&g.procedure.length>=100&&g.limit.length>=45);
  assert.ok(g.sourceUrls.every(u=>u.startsWith('https://chartschool.stockcharts.com/')));
  assert.match(answerFromGuide(g,'explain','','Explain '+g.title),/HOW it works or is defined/);
  assert.match(answerFromGuide(g,'question','','Explain '+g.title),/Ungraded understanding check/);
  assert.doesNotMatch(answerFromGuide(g,'review','My written note',''),/mastery awarded|official grade awarded/i);
 }
});
test('New indicator briefs are retrieved by the existing Tutor route without protected keys or AI',async()=>{
 const assets={fetch:async request=>{
  const path=new URL(request.url).pathname;
  const allowed=new Set(['competency-study-guides-v01499.json','tutor-indicator-study-v1.json','tutor-indicator-expansion-v1.json']);
  const name=path.split('/').pop();
  if(!allowed.has(name))return new Response('Not found',{status:404});
  return new Response(JSON.stringify(load(name)),{status:200,headers:{'content-type':'application/json'}});
 }};
 const env={ASSETS:assets},request=new Request('https://test.example/api/market-tutor-v01492');
 for(const g of extension.guides){
  const matches=await originalGuides(env,request,'Explain '+g.title);
  assert.equal(matches[0]?.code,g.code,'Source retrieval for '+g.title);
  assert.equal(matches[0]?.officialCompetency,false);
 }
});
