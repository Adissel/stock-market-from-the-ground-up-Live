/* SMFGU-TALIA-FOUNDATION-MATH-001 — ungraded mathematical/role boundary acceptance. */
import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {foundationWorkedMath,FOUNDATION_WORKED_MATH_CODES} from '../functions/_lib/tutor-foundation-worked-math-v1.js';
import {answerFromGuide} from '../functions/_lib/original-competency-tutor-v014100.js';
const guides=JSON.parse(readFileSync(new URL('../data/competency-study-guides-v01499.json',import.meta.url),'utf8')).guides;
const read=path=>readFileSync(new URL('../'+path,import.meta.url),'utf8');
const cases=Object.freeze({
 CANDLE_READING:{a:['$0.40','$0.80','Upper wick','lower wick'],b:['$20.40','$20.70','bearish']},
 VWAP_CONTEXT:{a:['$10.34','1,000 shares','bar-volume proxy'],b:['$20.10','$20.30']},
 EMA_CONTEXT:{a:['$11.00','$12.00','0.50'],b:['$19.00','$20.00']},
 RISK_PER_SHARE:{a:['$0.20','10 illustrative shares','$2.00'],b:['$0.25','$25.00']},
 POSITION_SIZING:{a:['$0.20','100 shares','$20.00'],b:['$0.25','200 shares','$50.00']},
 VOLUME_ANALYSIS:{a:['1,500 shares/bar','1.00×'],b:['3,000 shares','2.00×']},
 RISK_REWARD:{a:['$0.20','$0.40','2.00:1'],b:['$0.30','1.50:1']},
 SLIPPAGE_SPREAD:{a:['$0.04','$0.05','$5.00'],b:['$0.06','$0.02','$1.00']},
 FLOAT_SUPPLY:{a:['6,000,000 shares','60.00%','40.00%'],b:['4,000,000 shares','80.00%','25.00%']},
 MFE_MAE_REVIEW:{a:['$0.70','$70.00','$0.15','$15.00'],b:['$0.25','$12.50','$0.40','$20.00']},
 HOD_PM_LEVELS:{a:['$10.50','$10.80','2.86%'],b:['$25.40','$25.10','-1.18%']},
 LEVEL2_READING:{a:['$0.04','0.40%','2.00:1'],b:['$0.10','0.50%','0.25:1']},
 MULTI_TIMEFRAME:{a:['45-minute','9 bars','3 bars'],b:['60-minute','20 bars','6 bars']}
});
test('Thirteen official competencies have independently computed original fictional worked cases',()=>{
 assert.deepEqual([...FOUNDATION_WORKED_MATH_CODES].sort(),Object.keys(cases).sort());
 for(const [code,checks] of Object.entries(cases)){
  const a=foundationWorkedMath(code,'Explain the concept');
  const b=foundationWorkedMath(code,'Try another worked example');
  assert.notEqual(a,b,code+' must have a genuinely distinct scenario');
  for(const field of checks.a)assert.ok(a.includes(field),code+' first scenario missing '+field);
  for(const field of checks.b)assert.ok(b.includes(field),code+' alternate scenario missing '+field);
  for(const text of [a,b]){
   assert.match(text,/Original fictional worked example — ungraded/);
   assert.match(text,/Try independently/);
   assert.match(text,/not a live quote, historical replay/);
   assert.match(text,/Limitation:/);
   assert.doesNotMatch(text,/guaranteed profit|buy now|enter a real|live order|answer_key|mastery awarded/i);
  }
  const guide=guides.find(g=>g.code===code);
  assert.ok(guide,'Use existing authoritative competency '+code);
  const regular=answerFromGuide(guide,'explain','','Explain '+guide.title);
  const deep=answerFromGuide(guide,'explain','','Teach this in more depth: '+guide.title);
  const another=answerFromGuide(guide,'explain','','Try another worked example: '+guide.title);
  assert.ok(regular.includes(a),'Foundation normal explanation includes worked case: '+code);
  assert.ok(deep.includes(a),'Free deeper teaching must retain worked case: '+code);
  assert.ok(another.includes(b),'Try Another must change inputs: '+code);
  assert.doesNotMatch(answerFromGuide(guide,'question','','Explain '+guide.title),/Original fictional worked example/);
  assert.doesNotMatch(answerFromGuide(guide,'review','I was uncertain','Explain '+guide.title),/Original fictional worked example/);
 }
 assert.equal(foundationWorkedMath('UNKNOWN','Explain'),null);
});
test('Member-facing source-only Try Another is functional and cannot silently opt in to inference',()=>{
 const ui=read('assets/js/market-tutor.js'),route=read('functions/api/market-tutor-v01492.js');
 const original=read('functions/_lib/original-competency-tutor-v014100.js');
 assert.match(ui,/Try another worked example \(source-only\)/);
 assert.match(ui,/sourceOnlyAnotherExample\(record\)/);
 assert.match(ui,/consent\.checked=false/);
 assert.match(ui,/tutor-mode'\)\.value='explain'/);
 assert.match(route,/const deepSourceOnly=.*try another/);
 assert.match(route,/deepSourceOnly\?\{text:null,reason:'source_only_deep_teaching'/);
 assert.match(original,/mode==='explain'&&g\?\.officialCompetency!==false/);
 assert.match(original,/foundationWorkedMath\(g\.code,question\)/);
 assert.ok(!read('functions/_lib/tutor-foundation-worked-math-v1.js').includes('fetch('));
});
