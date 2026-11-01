import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {answerFromGuide} from '../functions/_lib/original-competency-tutor-v014100.js';
const guides=JSON.parse(readFileSync('data/talia-foundation-explanations-batch06-v1.json','utf8')).guides;
const get=code=>guides.find(g=>g.code===code);
test('repurchase historical rule and EDGAR acceptance timing never silently imply present disclosure or known future facts',()=>{
 const rep=get('TALIA_TOPIC_CASH_DIVIDEND_VS_BUYBACK');
 const time=get('TALIA_TOPIC_FISCAL_YEAR_END_VS_KNOWN_DATE');
 assert.ok(rep&&time);
 for(const question of ['Explain concept','Explain the common mistake']){
  const a=answerFromGuide(rep,'explain','',question);
  const b=answerFromGuide(time,'explain','',question);
  assert.match(a,/vacated effective December 19, 2023/i);
  assert.match(a,/sec.gov\/rules-regulations\/2024\/03\/s7-21-21/);
  assert.match(b,/acceptance is not the precise first public availability/i);
  assert.match(b,/sec.gov\/about\/webmaster-frequently-asked-questions/);
  assert.doesNotMatch(a+b,/official mastery awarded|guaranteed profitable trade/i);
 }
});
