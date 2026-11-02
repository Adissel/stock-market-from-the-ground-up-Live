import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {answerFromGuide} from '../functions/_lib/original-competency-tutor-v014100.js';
const read=p=>JSON.parse(readFileSync('data/'+p,'utf8'));
const b13=read('talia-foundation-explanations-batch13-v1.json').guides;
const b14=read('talia-foundation-explanations-batch14-v1.json').guides;
const b06=read('talia-foundation-explanations-batch06-v1.json').guides;
const b07=read('talia-foundation-explanations-batch07-v1.json').guides;
const cases=read('talia-tutor-evaluation40-v1.json').scenarios;
const lookup=new Map([...b13,...b14].map(g=>[g.code,g]));
const special=new Map([...b06,...b07].filter(g=>[
'TALIA_TOPIC_CASH_DIVIDEND_VS_BUYBACK','TALIA_TOPIC_PREFERRED_COMMON_CLAIMS',
'TALIA_TOPIC_BOND_MATURITY_VS_DURATION','TALIA_TOPIC_SQUARED_WEIGHT_CONCENTRATION',
'TALIA_TOPIC_FISCAL_YEAR_END_VS_KNOWN_DATE'].includes(g.code)).map(g=>[g.code,g]));

test('all 45 reviewed guides have unique internal decisions, differentiated feedback and release holds',()=>{
 assert.equal(b13.length+b14.length+special.size,45);
 assert.equal(special.size,5);
 const all=[...b13,...b14,...special.values()];
 assert.equal(new Set(all.map(g=>g.code)).size,45);
 assert.equal(new Set(all.map(g=>g.editorialTrainingReviewV1?.diagnosticQuestion)).size,45);
 for(const g of all){
  assert.equal(g.editorialTrainingReviewV1?.independentPublicationApproved,false,g.code);
  assert.equal(g.editorialTrainingReviewV1?.rightsCleared,false,g.code);
  assert.ok((g.editorialTrainingReviewV1?.correctiveTeaching||g.editorialTrainingReviewV1?.correction||'').length>40,g.code);
  assert.ok(g.editorialTrainingReviewV1?.limitation?.length>20,g.code);
  assert.equal(g.independentEditorialApproved,false,g.code);
  assert.ok(g.transferQuestion?.startsWith('FICTIONAL TRANSFER: '),g.code);
 }
 assert.match(special.get('TALIA_TOPIC_CASH_DIVIDEND_VS_BUYBACK').reviewExplanation,/vacated|December 19, 2023/i);
 assert.match(special.get('TALIA_TOPIC_SQUARED_WEIGHT_CONCENTRATION').reviewExplanation,/sum squared|covariance/i);
 assert.match(special.get('TALIA_TOPIC_FISCAL_YEAR_END_VS_KNOWN_DATE').workedCase,/may occur later/i);
 assert.doesNotMatch(lookup.get('TALIA_TOPIC_BUY_LIMIT_CANNOT_ASSUME_EXECUTION').workedCase,/zero execution is confirmed by that quote alone/i);
});

test('forty scenarios are distinct and balanced exactly ten across each domain',()=>{
 assert.equal(cases.length,40);
 assert.equal(new Set(cases.map(c=>c.id)).size,40);
 assert.equal(new Set(cases.map(c=>c.code)).size,40);
 for(const cat of ['FOUNDATIONAL_CONCEPT','INDICATOR_MATH','MISCONCEPTION_FOLLOWUP','HISTORICAL_RISK_TRANSFER']){
  assert.equal(cases.filter(c=>c.category===cat).length,10,cat);
 }
});

// Every test actually exercises the existing authorized source-only Tutor formatter.
// A passed test proves only this source behavior; it does not create persistent
// multi-turn history, a real authenticated account, replay authorization or grading.
for(const scenario of cases){
 test(scenario.id+' '+scenario.category+' '+scenario.code,()=>{
  const g=lookup.get(scenario.code);
  assert.ok(g,'Missing exact canonical guide');
  assert.equal(g.editorialTrainingReviewV1?.diagnosticQuestion,scenario.prompt);
  const first=answerFromGuide(g,'explain','','Explain '+g.title);
  assert.ok(first.includes(g.concept)&&first.includes(g.workedCase),scenario.id+' original teaching');
  assert.ok(first.includes(scenario.prompt),scenario.id+' diagnostic');
  assert.ok(first.includes(scenario.expectedTransfer),scenario.id+' transfer');
  assert.ok(first.includes('Limits and uncertainty:'),scenario.id+' uncertainty');
  assert.match(first,/ung raded|ungraded/i);
  if(scenario.category==='INDICATOR_MATH'){
   const deep=answerFromGuide(g,'explain','','Walk me through step-by-step in more depth');
   assert.ok(deep.includes(g.workedCase));
   assert.ok(deep.includes(g.transferQuestion));
   assert.ok(deep.includes(g.commonError));
   assert.notEqual(deep,first);
  }
  if(scenario.category==='MISCONCEPTION_FOLLOWUP'){
   const error=answerFromGuide(g,'explain','','Explain the common mistake');
   const response=answerFromGuide(g,'review','I originally assumed that the earlier quote guaranteed my fill.','Review my reasoning');
   assert.ok(error.includes('A common mistake to examine'));
   assert.ok(error.includes(g.commonError));
   assert.ok(error.includes(g.transferQuestion));
   assert.ok(response.includes('Ungraded review criterion'));
   assert.ok(response.includes((g.editorialTrainingReviewV1.correction||g.editorialTrainingReviewV1.correctiveTeaching)));
   assert.ok(error.includes('not a claim about what you personally believed'));
  }
  if(scenario.category==='HISTORICAL_RISK_TRANSFER'){
   assert.ok(first.includes('FICTIONAL:'));
   assert.ok(first.includes(g.limit));
   assert.ok(scenario.expectedLimitation.length>45);
   assert.equal(g.editorialTrainingReviewV1?.independentPublicationApproved,false);
  }
  assert.doesNotMatch(first,/guaranteed profitable trade|mastery credit was awarded|official grade achieved/i);
  console.log('EVAL40 '+scenario.id+' '+(scenario.category==='MISCONCEPTION_FOLLOWUP'||scenario.category==='HISTORICAL_RISK_TRANSFER'?'PARTIAL':'PASS')+
   ' internal_source_only_no_auth_or_live_chart');
 });
}
