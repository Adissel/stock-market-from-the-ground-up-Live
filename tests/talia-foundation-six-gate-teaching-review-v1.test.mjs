// SMFGU-TALIA-REVIEW-TEACHING-001 — cumulative Foundation teaching quality.
import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {answerFromGuide} from '../functions/_lib/original-competency-tutor-v014100.js';
const read=p=>JSON.parse(readFileSync(new URL('../data/'+p,import.meta.url),'utf8'));
const guides=read('tutor-indicator-study-v1.json').guides.slice(0,12);
const foundation=[...read('talia-foundation-explanations-batch06-v1.json').guides,...read('talia-foundation-explanations-batch07-v1.json').guides];
test('Gate 4: twelve indicator lessons each teach a distinct real calculation, warmup/input caution and independent interpretation',()=>{
 assert.equal(guides.length,12);
 assert.equal(new Set(guides.map(g=>g.fictionalPrompt)).size,12);
 assert.equal(new Set(guides.map(g=>g.selfCheck)).size,12);
 for(const g of guides){
  assert.match(g.fictionalPrompt,/FICTIONAL:/);
  assert.ok(g.fictionalPrompt.length>150,g.code+' insufficient numerical exercise');
  assert.ok(g.selfCheck.length>55,g.code+' insufficient self-check');
  assert.ok(g.reviewExplanation.length>85,g.code+' insufficient correction');
  assert.match(g.fictionalPrompt,/\$|EMA|MACD|RSI|WMA|efficiency ratio|ratio/i,g.code+' expected mathematical substance');
  assert.doesNotMatch(g.fictionalPrompt,/guaranteed profit|verified historical execution|buy now/i);
  assert.equal(g.officialCompetency,false);
  const out=answerFromGuide(g,'explain','','Explain '+g.title);
  assert.ok(out.includes(g.fictionalPrompt));
  assert.ok(out.includes(g.selfCheck));
  assert.doesNotMatch(answerFromGuide(g,'question','','Explain '+g.title),/Verified fictional calculation exercise:/);
 }
});
test('Gate 5: all 40 source-only Foundation deeper lessons add distinct stepwise teaching, original fictional evidence and transfer',()=>{
 assert.equal(foundation.length,40);
 for(const g of foundation){
  const normal=answerFromGuide(g,'explain','','Explain '+g.title);
  const deep=answerFromGuide(g,'explain','','Teach this in more depth: '+g.title);
  assert.notEqual(deep,normal,g.code+' deeper answer must actually differ');
  assert.match(deep,/Talia Foundation — source-only deeper teaching/);
  assert.match(deep,/1\. Define the principle/);
  assert.match(deep,/8\. Try a genuinely different ungraded scenario/);
  assert.ok(deep.includes(g.workedCase));
  assert.ok(deep.includes(g.transferQuestion));
  assert.ok(deep.includes(g.reviewExplanation));
  assert.match(deep,/No live trading instruction, private answer key, future observation, paid model call or assessment score/);
  assert.ok(deep.includes('\n\n'),'must use rendered paragraphs instead of escaped slash sequences');
  assert.doesNotMatch(deep,/mastery awarded|personalized buy signal|actual market feed/i);
  const misunderstanding=answerFromGuide(g,'explain','','Explain the common mistake: '+g.title);
  assert.match(misunderstanding,/not a claim about what you personally believed/);
  const question=answerFromGuide(g,'question','','Explain '+g.title);
  assert.doesNotMatch(question,/Talia Foundation — source-only deeper teaching/);
  assert.doesNotMatch(question,/Original fictional worked explanation:/);
  const review=answerFromGuide(g,'review','I am uncertain','Explain '+g.title);
  assert.doesNotMatch(review,/Talia Foundation — source-only deeper teaching/);
  assert.match(review,/No rubric was scored and no mastery credit was awarded/);
 }
});
test('Gate 1/2: 40 published-structure draft fields retain no fabricated independent approval',()=>{
 const codes=new Set(),titles=new Set();
 for(const g of foundation){
  assert.ok(!codes.has(g.code));codes.add(g.code);
  assert.ok(!titles.has(g.title.toLowerCase()));titles.add(g.title.toLowerCase());
  for(const key of ['concept','procedure','workedCase','limit','invalidation','commonError','selfCheck','reviewExplanation','transferQuestion'])assert.ok(g[key]?.length>28,g.code+' '+key);
  assert.match(g.workedCase,/^FICTIONAL:/);
  assert.equal(g.independentEditorialApproved,false);
  assert.equal(g.officialCompetency,false);
  assert.equal(g.status,'original_source_authored_ungraded_pending_independent_editorial_review');
  assert.match(g.sourceUrls[0],/^https:\/\//);
 }
 assert.equal(codes.size,40);
});
