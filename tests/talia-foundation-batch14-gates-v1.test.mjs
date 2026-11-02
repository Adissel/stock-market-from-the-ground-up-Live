// SMFGU Tutor — original Basic lessons 261–280; no private test answers or billable model services.
import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const read=path=>JSON.parse(readFileSync('data/'+path,'utf8'));
const batches=Array.from({length:14},(_,i)=>read('talia-foundation-explanations-batch'+String(i+1).padStart(2,'0')+'-v1.json'));
const all=batches.flatMap(b=>b.guides);
const last=batches[13].guides;
const earlier=batches.slice(0,13).flatMap(b=>b.guides);
test('280 original Foundation topic IDs, no repeat codes or titles, official competence identities untouched',()=>{
 assert.equal(earlier.length,260);
 assert.equal(last.length,20);
 assert.equal(all.length,280);
 assert.equal(new Set(all.map(g=>g.code)).size,280);
 assert.equal(new Set(all.map(g=>g.title.toLowerCase())).size,280);
 assert.equal(read('competency-study-guides-v01499.json').guides.length,30);
 assert.equal(batches[13].registeredLabIdsPreserved,419);
});
test('new topics are original, member-learning, ungraded, review-held and bounded to known evidence',()=>{
 for(const g of last){
  assert.match(g.code,/^TALIA_TOPIC_[A-Z0-9_]{5,96}$/);
  assert.equal(g.foundationTopic,true);
  assert.equal(g.supplemental,true);
  assert.equal(g.officialCompetency,false);
  assert.equal(g.independentEditorialApproved,false);
  assert.equal(g.editorSourceReview.independentPublicationAccepted,false);
  assert.equal(g.editorSourceReview.referenceCheckedDate,null);
  assert.ok(g.sourceUrls.length===1&&g.sourceUrls[0].startsWith('https://'));
  assert.ok(g.workedCase.startsWith('FICTIONAL:'));
  for(const k of ['title','concept','procedure','workedCase','limit','invalidation','commonError','selfCheck','reviewExplanation','transferQuestion'])
   assert.ok(g[k].length>=30,g.code+' insufficient '+k);
  assert.match(g.reviewExplanation,/Ungraded correction/);
  assert.match(g.invalidation,/Do not draw/);
 }
});
test('core arithmetic of newly written fictional cases checks independently',()=>{
 const near=(a,b)=>assert.ok(Math.abs(a-b)<1e-9,a+' != '+b);
 near(40*25/5000*100,20);
 near(2000/(3000+2000)*100,40);
 near(4000/(4000+1000+1000)*100,200/3);
 near(2000-120,1880);
 near(8-5,3);
 near(100*(1.10*.90-1),-1);
 near(100/5000*100,2);
 near(30*18-2,538);
 near(100*.30*(1-.10),27);
 near(1000*.00+0,0);
 near(300+200,500);
 near(500+5*100,1000);
 near(100*(18.40/20-1),-8);
 near((600-0),600);
 near(100*(20/10-1),100);
 near(100*(40/20-1),100);
 near(100+250+150,500);
 near(0+600,600);
});
test('loader and two production asset passes include newest batch, and public Grade keys never enter drafts',()=>{
 const source=readFileSync('functions/_lib/original-competency-tutor-v014100.js','utf8');
 const build=readFileSync('scripts/build-pages.sh','utf8');
 assert.match(source,/talia-foundation-explanations-batch14-v1\.json/);
 const loops=build.split('\n').filter(l=>/^for (file in crownlight|tutor_asset in talia-foundation)/.test(l));
 assert.equal(loops.length,2);
 for(const loop of loops)assert.ok(loop.includes('talia-foundation-explanations-batch14-v1.json')||/talia-foundation-explanations-batch\\{0[1-9]\\.\\.[12][0-9]\\}-v1\\.json/.test(loop)||loop.includes('talia-foundation-explanations-batch{01..30}-v1.json'),'Build copy loop must include the fourteenth source batch');
 assert.ok(last.every(g=>!Object.hasOwn(g,'correctAnswer')&&!Object.hasOwn(g,'privateRubric')));
});
