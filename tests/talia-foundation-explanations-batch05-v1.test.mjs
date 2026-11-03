import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {originalGuides,answerFromGuide} from '../functions/_lib/original-competency-tutor-v014100.js';
const read=p=>readFileSync(new URL('../'+p,import.meta.url),'utf8');
const batch=[1,2,3,4,5].map(i=>JSON.parse(read('data/talia-foundation-explanations-batch0'+i+'-v1.json')));
const canon=JSON.parse(read('data/competency-study-guides-v01499.json')).guides;
const guides=[...batch.flatMap(x=>x.guides)];
const fakeAssets=(max=5)=>({fetch:async request=>{
 const name=new URL(request.url).pathname.split('/').at(-1);
 if(name==='competency-study-guides-v01499.json')return new Response(read('data/'+name),{status:200});
 const number=Number((/batch0([1-5])/.exec(name)||[])[1]);
 return number>0&&number<=max?new Response(read('data/'+name),{status:200}):new Response('missing',{status:404});
}});
test('Fifth batch delivers exactly 100 distinct Foundation topics without diluting official grading',()=>{
 assert.equal(guides.length,100);assert.equal(canon.length,30);
 assert.equal(new Set(guides.map(x=>x.code)).size,100);
 assert.equal(new Set(guides.map(x=>x.title.toLowerCase())).size,100);
 assert.equal(batch[4].count,20);assert.equal(batch[4].goal,600);
 assert.equal(batch[4].existingOfficialCompetenciesPreserved,30);
 const official=new Set(canon.map(x=>x.code));
 for(const g of guides){
  assert.equal(g.foundationTopic,true);assert.equal(g.officialCompetency,false);
  assert.equal(g.supplemental,true);assert.equal(g.independentEditorialApproved,false);
  assert.ok(!official.has(g.code));
  assert.match(g.workedCase,/^FICTIONAL:/);
  assert.ok(g.sourceUrls.length>=1&&g.sourceUrls.length<=2,g.code+' citation count');
  assert.ok(g.sourceUrls.every(u=>u.startsWith('https://')),g.code+' source scheme');
  for(const name of ['title','concept','procedure','workedCase','limit','invalidation','commonError','selfCheck','reviewExplanation','transferQuestion'])
   assert.ok(typeof g[name]==='string'&&g[name].length>=28,g.code+' '+name);
 }
});
test('All 100 exact requested lesson titles resolve in the existing source-only Tutor',async()=>{
 const env={ASSETS:fakeAssets()},request=new Request('https://tutor.example/api/market-tutor-v01492');
 for(const g of guides){
  const found=await originalGuides(env,request,'Explain '+g.title);
  assert.equal(found[0]?.code,g.code,'title lookup '+g.title);
 }
 for(const g of batch[4].guides){
  assert.ok(answerFromGuide(g,'explain','','Explain '+g.title).includes(g.workedCase));
  assert.ok(answerFromGuide(g,'explain','','Explain '+g.title).includes(g.transferQuestion));
  assert.ok(answerFromGuide(g,'explain','','Explain the common mistake: '+g.title).includes(g.commonError));
  assert.doesNotMatch(answerFromGuide(g,'question','','Explain '+g.title),/Original fictional worked explanation/);
  assert.doesNotMatch(answerFromGuide(g,'review','Uncertain','Explain '+g.title),/Original fictional worked explanation/);
 }
});
test('Optional fifth asset missing does not disable the earlier eighty',async()=>{
 const env={ASSETS:fakeAssets(4)},request=new Request('https://tutor.example/api/market-tutor-v01492');
 for(const group of batch.slice(0,4)){
  const item=group.guides[0],found=await originalGuides(env,request,'Explain '+item.title);
  assert.equal(found[0]?.code,item.code);
 }
 const newOne=batch[4].guides[0],found=await originalGuides(env,request,'Explain '+newOne.title);
 assert.notEqual(found[0]?.code,newOne.code);
});
test('Source references are specifically recognized primary research hosts, not redistribution authorization',()=>{
 const approved=new Set(['www.investor.gov','investor.gov','pages.stern.nyu.edu','www.optionseducation.org','optionseducation.org','www.bls.gov','fred.stlouisfed.org']);
 for(const g of batch[4].guides){
  const u=new URL(g.sourceUrls[0]);assert.equal(u.protocol,'https:');assert.ok(approved.has(u.hostname),u.hostname);
  assert.match(g.sourceRightsStatus,/not_third_party_content_republication/);
 }
});
