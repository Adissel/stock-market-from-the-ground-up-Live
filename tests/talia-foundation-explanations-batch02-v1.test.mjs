import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {originalGuides,answerFromGuide} from '../functions/_lib/original-competency-tutor-v014100.js';
const read=p=>readFileSync(new URL('../'+p,import.meta.url),'utf8');
const one=JSON.parse(read('data/talia-foundation-explanations-batch01-v1.json'));
const two=JSON.parse(read('data/talia-foundation-explanations-batch02-v1.json'));
const core=JSON.parse(read('data/competency-study-guides-v01499.json'));
const getAssets=(allowNew=true)=>({fetch:async request=>{
 const file=new URL(request.url).pathname.split('/').at(-1);
 if(!['competency-study-guides-v01499.json','talia-foundation-explanations-batch01-v1.json',...(allowNew?['talia-foundation-explanations-batch02-v1.json']:[])].includes(file))
  return new Response('unavailable',{status:404});
 return new Response(read('data/'+file),{status:200,headers:{'content-type':'application/json'}});
}});
test('Batch 02 contributes twenty nonduplicate author-written topics toward 600 without creating new graded competencies',()=>{
 assert.equal(one.count,20);assert.equal(two.count,20);
 assert.equal(one.goal,600);assert.equal(two.goal,600);assert.equal(core.guides.length,30);
 const all=[...one.guides,...two.guides];
 assert.equal(all.length,40);
 assert.equal(new Set(all.map(x=>x.code)).size,40);
 assert.equal(new Set(all.map(x=>x.title.toLowerCase())).size,40);
 for(const g of two.guides){
  assert.equal(g.foundationTopic,true);
  assert.equal(g.officialCompetency,false);
  assert.equal(g.independentEditorialApproved,false);
  assert.match(g.workedCase,/^FICTIONAL:/);
  assert.ok(g.sourceUrls.every(u=>u.startsWith('https://')));
  for(const key of ['concept','procedure','workedCase','limit','invalidation','commonError','selfCheck','reviewExplanation','transferQuestion'])
   assert.ok(typeof g[key]==='string'&&g[key].length>=28,g.code+' '+key);
  const explained=answerFromGuide(g,'explain','','Explain '+g.title);
  assert.match(explained,/Original ungraded Foundation explanation/);
  assert.ok(explained.includes(g.transferQuestion));
  const question=answerFromGuide(g,'question','','Explain '+g.title);
  const review=answerFromGuide(g,'review','I was uncertain about inputs','Explain '+g.title);
  assert.doesNotMatch(question,/Original fictional worked explanation/);
  assert.doesNotMatch(review,/Original fictional worked explanation/);
  assert.match(review,/No rubric was scored/);
 }
});
test('Existing authenticated Tutor guide loader finds all forty new Foundation titles through public assets',async()=>{
 const env={ASSETS:getAssets()};
 const req=new Request('https://tutor.test/api/market-tutor-v01492');
 for(const g of [...one.guides,...two.guides]){
  const match=await originalGuides(env,req,'Explain '+g.title);
  assert.equal(match[0]?.code,g.code,'Topic source lookup: '+g.title);
 }
 const actual=await originalGuides(env,req,'Explain EMA 200 availability after a full observation window');
 assert.match(answerFromGuide(actual[0],'explain','','Try another worked example: '+actual[0].title),/Additional original, fictional/);
});
test('Optional failure of second topic asset preserves first twenty and official thirty',async()=>{
 const env={ASSETS:getAssets(false)},req=new Request('https://tutor.test/api/market-tutor-v01492');
 const old=await originalGuides(env,req,'Explain '+one.guides[0].title);
 const newTopic=await originalGuides(env,req,'Explain '+two.guides[0].title);
 assert.equal(old[0]?.code,one.guides[0].code);
 assert.notEqual(newTopic[0]?.code,two.guides[0].code);
 const allCode=new Set(core.guides.map(g=>g.code));
 assert.equal(allCode.size,30);
 const api=read('functions/api/market-tutor-v01492.js');
 assert.match(api,/guide\.foundationTopic===true\?\{text:null,reason:'foundation_supplementary_source_only'/);
});

test('Six Batch02 source-specific pointers stay scoped and publication-locked',()=>{
 const expected=new Map([["TALIA_TOPIC_EMA9_ALPHA","https://chartschool.stockcharts.com/table-of-contents/technical-indicators-and-overlays/technical-overlays/moving-averages-simple-and-exponential"],["TALIA_TOPIC_EMA20_CLOSE_CONFIRMATION","https://chartschool.stockcharts.com/table-of-contents/technical-indicators-and-overlays/technical-overlays/moving-averages-simple-and-exponential"],["TALIA_TOPIC_EMA200_WARMUP","https://chartschool.stockcharts.com/table-of-contents/technical-indicators-and-overlays/technical-overlays/moving-averages-simple-and-exponential"],["TALIA_TOPIC_POPULATION_SAMPLE_SD","https://chartschool.stockcharts.com/table-of-contents/technical-indicators-and-overlays/technical-indicators/standard-deviation-volatility"],["TALIA_TOPIC_DAILY_ANNUAL_VOL","https://rpc.cfainstitute.org/blogs/enterprising-investor/2023/is-the-60-40-portfolio-still-relevant"],["TALIA_TOPIC_RUNNING_MAX_DRAWDOWN","https://chartschool.stockcharts.com/table-of-contents/technical-indicators-and-overlays/technical-indicators/ulcer-index"]]);
 assert.equal(expected.size,6);
 for(const [code,url] of expected){
  const g=two.guides.find(x=>x.code===code);
  assert.equal(g.sourceUrls[0],url,code);
  assert.ok(g.sourceResearchTriage?.supportedScope?.length>35);
  assert.ok(g.sourceResearchTriage?.remainingLimitations?.length>35);
  assert.equal(g.sourceResearchTriage.independentMathApproved,false);
  assert.equal(g.sourceResearchTriage.independentPublicationApproved,false);
  assert.equal(g.sourceResearchTriage.thirdPartyRightsApproved,false);
  assert.equal(g.independentEditorialApproved,false);
  assert.equal(g.editorSourceReview.independentPublicationAccepted,false);
 }
 assert.equal(two.guides.filter(g=>g.sourceUrls.some(u=>u==='https://chartschool.stockcharts.com/table-of-contents/technical-indicators-and-overlays/technical-indicators')).length,0);
 const std=two.guides.find(g=>g.code==='TALIA_TOPIC_POPULATION_SAMPLE_SD');
 assert.equal(std.sourceUrls.length,2);
 assert.ok(std.sourceUrls[1].startsWith('https://www.itl.nist.gov/'));
 const ema=2/(9+1)*10.5+(1-2/(9+1))*10;
 assert.ok(Math.abs(ema-10.1)<1e-12);
 assert.ok(Math.abs(Math.sqrt(2/3)-0.816496580927726)<1e-10);
 assert.ok(Math.abs(Math.sqrt(2/(3-1))-1)<1e-12);
 assert.ok(Math.abs(Math.sqrt(252)*.01-.15874507866387544)<1e-9);
});

test('Batch02 multi-reference evidence loads, while untrusted source host fails closed',async()=>{
 const env={ASSETS:getAssets()};
 const req=new Request('https://tutor.test/api/market-tutor-v01492');
 const match=await originalGuides(env,req,'Explain Population versus sample standard deviation denominators');
 assert.equal(match[0]?.code,'TALIA_TOPIC_POPULATION_SAMPLE_SD');
 const bad={...two,guides:two.guides.map((g,i)=>i===0?{...g,sourceUrls:['https://untrusted.example/target']}:g)};
 const hostileAssets={fetch:async request=>{
  const file=new URL(request.url).pathname.split('/').at(-1);
  if(file==='talia-foundation-explanations-batch02-v1.json')
    return Response.json(bad);
  if(file==='competency-study-guides-v01499.json'||file==='talia-foundation-explanations-batch01-v1.json')
    return Response.json(JSON.parse(read('data/'+file)));
  return new Response('missing',{status:404});
 }};
 const denied=await originalGuides({ASSETS:hostileAssets},req,'Explain '+two.guides[0].title);
 assert.notEqual(denied[0]?.code,two.guides[0].code);
});
