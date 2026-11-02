import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const load=n=>JSON.parse(readFileSync(new URL('../data/talia-foundation-explanations-batch'+n+'-v1.json',import.meta.url),'utf8'));
const first=load('15'),second=load('16'),rows=[...first.guides,...second.guides];
test('40 original Foundation lessons: source and ungraded integrity',()=>{
 assert.equal(first.count,20);assert.equal(second.count,20);assert.equal(rows.length,40);
 assert.equal(new Set(rows.map(x=>x.code)).size,40);
 assert.equal(new Set(rows.map(x=>x.title.toLowerCase())).size,40);
 for(const x of rows){
  assert.match(x.code,/^TALIA_TOPIC_[A-Z0-9_]+$/);
  for(const key of ['title','concept','procedure','workedCase','limit','invalidation','commonError','selfCheck','reviewExplanation','transferQuestion'])
    assert.ok(typeof x[key]==='string'&&x[key].length>(key==='title'?15:25),x.code+': '+key);
  assert.match(x.workedCase,/FICTIONAL/);
  assert.match(x.transferQuestion,/FICTIONAL/);
  assert.equal(x.officialCompetency,false);
  assert.equal(x.foundationTopic,true);
  assert.equal(x.independentEditorialApproved,false);
  assert.equal(x.editorSourceReview.independentPublicationAccepted,false);
  assert.ok(x.sourceUrls.every(url=>url.startsWith('https://')));
 }
});
test('existing Tutor and production build both reference the new source batches',()=>{
 const tutor=readFileSync(new URL('../functions/_lib/original-competency-tutor-v014100.js',import.meta.url),'utf8');
 const build=readFileSync(new URL('../scripts/build-pages.sh',import.meta.url),'utf8');
 const workflow=readFileSync(new URL('../.github/workflows/learning-tutor-v01492.yml',import.meta.url),'utf8');
 for(const name of ['talia-foundation-explanations-batch15-v1.json','talia-foundation-explanations-batch16-v1.json']){
  assert.ok(tutor.includes(name));assert.ok(build.includes(name)||build.includes('talia-foundation-explanations-batch{01..30}-v1.json'),'Bash copy range must include '+name);assert.ok(workflow.includes('data/'+name));
 }
});
test('independent fictional arithmetic spot-checks',()=>{
 const near=(a,b)=>assert.ok(Math.abs(a-b)<1e-10,`${a} vs ${b}`);
 near((20.1+20.3)/2,20.2);
 near(((50.1-49.9)/50)*10000,40);
 near((25.08-25)*80,6.4);
 near((10.2-10)*100-4,16);
 near(Math.min(8000,6000)/40000,.15);
 near(.25*.08,.02);
 near((12400-10000-2000)/10000,.04);
 near(560/(560+300),.6511627906976745);
 near(3000/(3000+1000),.75);
 near(250/750,1/3);
 near((40+60+80)/3,60);
 near((300+100)/(150+50),2);
 near(30-28.5,1.5);
 near(31.2-30,1.2);
 near(40*.5+2,22);
 near(Math.floor((505-5)/24),20);
 near(25/(75+25),.25);
 near((10*20+2)/10,20.2);
 near(1000/50000,.02);
 near(1200000*20,24000000);
 near(1.1*1.1-1,.21);
 near(.01*Math.sqrt(252),.15874507866387544);
 near(Math.log(1.1)+Math.log(1.1),Math.log(1.21));
 near(4/Math.sqrt(4),2);
 near((4+0+4)/3,8/3);
 near(2/1,2);
 near(98.5*5000/100,4925);
 near(1000*.06/2,30);
 near(30*.5,15);
 near(980+12,992);
 near(-5*.002,-.01);
 near(.7*2+.3*8,3.8);
 near(50+40-30,60);
 near((1000-600-250)/1000,.15);
 near(5000000/100000000,.05);
 near(365/(1200/300),91.25);
 near(10000*.073*10/365,20);
 near(1/4,.25);
});
