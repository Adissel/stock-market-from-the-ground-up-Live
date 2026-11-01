// Talia Foundation 241–260: original fictional instruction, protected ungraded source-only path.
import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {originalGuides,answerFromGuide} from '../functions/_lib/original-competency-tutor-v014100.js';
const rd=p=>JSON.parse(readFileSync(new URL('../data/'+p,import.meta.url),'utf8'));
const batches=Array.from({length:13},(_,i)=>rd('talia-foundation-explanations-batch'+String(i+1).padStart(2,'0')+'-v1.json'));
const all=batches.flatMap(x=>x.guides),prior=all.slice(0,240),latest=all.slice(240);
const official=rd('competency-study-guides-v01499.json').guides;
const site=(count=13)=>({fetch:async request=>{
 const pathname=new URL(request.url).pathname,f=pathname.split('/').at(-1);
 if(f==='competency-study-guides-v01499.json')return new Response(JSON.stringify({guides:official}));
 const m=/^talia-foundation-explanations-batch(\d\d)-v1\.json$/.exec(f),n=m?Number(m[1]):0;
 return n>0&&n<=count?new Response(JSON.stringify(batches[n-1])):new Response('Not Found',{status:404});
}});
test('260 authored topics, exactly 20 new original ungraded sources, 30 official guides preserved',()=>{
 assert.equal(all.length,260);assert.equal(prior.length,240);assert.equal(latest.length,20);
 assert.equal(new Set(all.map(g=>g.code)).size,260);
 assert.equal(new Set(all.map(g=>g.title.toLowerCase())).size,260);
 assert.equal(official.length,30);
 for(const g of latest){
  assert.equal(g.foundationTopic,true);assert.equal(g.supplemental,true);
  assert.equal(g.officialCompetency,false);assert.equal(g.independentEditorialApproved,false);
  assert.match(g.status,/pending_independent_editorial_review/);
  assert.match(g.workedCase,/^FICTIONAL:/);
  assert.ok(g.sourceUrls.length===1&&g.sourceUrls[0].startsWith('https://'));
  for(const k of ['concept','procedure','workedCase','limit','invalidation','commonError','selfCheck','reviewExplanation','transferQuestion'])
   assert.ok(g[k].length>=70,g.code+' '+k);
 }
});
test('every new topic remains source-only with unique worked case, correction and transfer',()=>{
 for(const g of latest){
  const explanation=answerFromGuide(g,'explain','','Explain '+g.title);
  const deep=answerFromGuide(g,'explain','','Teach this in more depth: '+g.title);
  const misconception=answerFromGuide(g,'explain','','Explain the common mistake: '+g.title);
  const review=answerFromGuide(g,'review','Learner has not evaluated their assumptions','Review '+g.title);
  assert.ok(explanation.includes(g.workedCase)&&explanation.includes(g.transferQuestion),g.code);
  assert.ok(deep.includes(g.workedCase)&&deep.includes('1. Define the principle'),g.code);
  assert.ok(misconception.includes(g.commonError),g.code);
  assert.match(review,/No rubric was scored and no mastery credit was awarded/);
  assert.doesNotMatch(explanation,/guaranteed profit|live broker order executed|mastery awarded/i);
 }
});
test('source-only loader recognizes batch13 by each exact lesson title; missing optional batch leaves older lessons intact',async()=>{
 const request=new Request('https://tutor.test/api/market-tutor-v01492');
 const allSite={ASSETS:site(13)},missingSite={ASSETS:site(12)};
 for(const g of latest){
  const selected=await originalGuides(allSite,request,'Explain '+g.title);
  assert.equal(selected[0]?.code,g.code,g.code+' is not addressable');
 }
 const earlier=await originalGuides(missingSite,request,'Explain '+prior.at(-1).title);
 const absent=await originalGuides(missingSite,request,'Explain '+latest[0].title);
 assert.equal(earlier[0]?.code,prior.at(-1).code);
 assert.notEqual(absent[0]?.code,latest[0].code);
});
test('independent arithmetic checks cover major fictional examples without future or private evidence',()=>{
 const near=(a,b)=>assert.ok(Math.abs(a-b)<1e-7,a+' != '+b);
 near(600*12+400*12.5,12200);near(5e6*20,1e8);near(10e6-2e6,8e6);
 near(100*(10.10-10.00)/((10.10+10.00)/2),100*.1/10.05);
 near(100*.01/5,.2);near(100*.01/50,.02);near(10000*(50.25/50-1),50);
 near((20*10+30*11)/50,10.6);near(Math.floor(500/12.30),40);near(40*12.30,492);
 near(25/40,.625);near(40*100,80*50);near(120*2,12*20);
 near(100*(42/(80/2)-1),5);near(100*(10.70-10.50),20);
 near((40*10+60*10.20)/100,10.12);
 near(100*Math.abs(20.8-20)/(21-19.5),100*.8/1.5);
 near(11.2-Math.max(10,10.6),.6);near(Math.min(10,10.6)-9.8,.2);
 near(100*(51.2/50-1),2.4);near(5000/4000,1.25);
 assert.match(latest.find(g=>g.code.endsWith('BAR_AVAILABILITY_BOUNDARY')).workedCase,/09:31/);
 assert.equal(latest.filter(g=>g.independentEditorialApproved===true).length,0);
});
