import test from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import {readFileSync} from 'node:fs';
const read=p=>readFileSync(p,'utf8');
const context={};
vm.runInNewContext(read('assets/js/learning-response-choice-v1.js'),context,{timeout:2000});
const api=context.GroundUpLearningResponseChoiceV1;
test('shared formative response choices are scenario-aware, numeric-safe and never a private grade',()=>{
 assert.equal(typeof api?.build,'function');
 for(const [topic,family,keyword] of [
  ['VWAP Volume-Weighted Average Price','vwap','share'],
  ['Candlestick OHLC','candle','OHLC'],
  ['Risk and Stop Placement','risk','stop'],
  ['Technical Indicators EMA','indicator','indicator'],
  ['Reading the Tape','tape','quotes'],
  ['SEC filings 10-Q','filings','filing'],
  ['Scanner filters','scanner','scan'],
  ['Research source validation','research','source']]){
  const p=api.build({prompt:'How do you use evidence correctly?',topic,seed:2});
  assert.equal(p.family,family,topic);
  assert.equal(p.options.length,3);
  const correct=p.options.find(x=>x.code==='EVIDENCE');
  assert.ok(correct.label.toLowerCase().includes(keyword.toLowerCase()),topic);
  assert.equal(api.evaluate(p,'EVIDENCE').accepted,true);
  for(const wrong of ['FORECAST','OMIT_SOURCE',''])assert.equal(api.evaluate(p,wrong).accepted,false);
  assert.match(p.explanation,/no grade or mastery/i);
 }
});
test('formative positions rotate; unsupported future claims are always incorrect',()=>{
 const a=api.build({topic:'VWAP',seed:0}),b=api.build({topic:'VWAP',seed:1}),c=api.build({topic:'VWAP',seed:2});
 assert.notEqual(a.options[0].code,b.options[0].code);
 assert.notEqual(b.options[0].code,c.options[0].code);
 for(const p of [a,b,c])assert.equal(p.options.find(x=>x.code==='FORECAST').correct,false);
});
test('method scenarios distinguish experiments, limitations, transfer, and prediction without lookahead',()=>{
 for(const [prompt,fragment] of [
  ['After the experiment, what changed?','Change one input'],
  ['What mistake and limitation did you find?','unsupported assumption'],
  ['Transfer to a new case','new case'],
  ['Predict the next candle','conditional expectation']]){
  const p=api.build({prompt,topic:'Candlestick'});
  assert.ok(p.options.find(o=>o.correct).label.includes(fragment),prompt);
 }
});
test('all shared Lab stages use selected methods or numeric fields; generic typed-essay gates are removed',()=>{
 const engine=read('assets/js/lab-engine-v32-universal.js');
 const instructor=read('assets/js/lab-v33-instructor.js');
 for(const token of ['function evidenceDecision(',"input.type='radio'",'Lock my conditional prediction',
  'Check my practice decision','Check my review decision','Check my transfer decision'])
  assert.ok(engine.includes(token),token);
 assert.doesNotMatch(engine,/Explain your reasoning in at least 20 characters|Write at least 15 characters to explain what you learned|Include at least 25 characters of evidence and reasoning/);
 for(const token of ["numericAnswer.type='number'","choicePanel=el('fieldset'",'configureResponse(','Optional written reasoning',
  'evidenceAPI?.evaluate?.(activeSpec,activeCode)'])
  assert.ok(instructor.includes(token),token);
 assert.doesNotMatch(instructor,/Explain your reasoning using at least 20 characters|Please explain the observation in your own words before continuing/);
 assert.match(instructor,/onUnderstandingPassed\?\.\(\)/);
});
test('Boot Camps retain real calculation checks and protected official assessments',()=>{
 const guided=read('assets/js/academy-guided-v1.js');
 const academy=read('assets/js/bootcamp-academy-v014168.js');
 const protectedUI=read('assets/js/academy-protected-assessment-v1.js');
 for(const token of ['methodDecision(','formativeSelections','advancedSelections',"input.type='number'",'numericInputs.map','reviewedFormative.size!==12'])
  assert.ok(guided.includes(token),token);
 assert.doesNotMatch(guided,/reveal.disabled=response.value.trim\(\).length<20|if\(response.value.trim\(\).length<20\)return/);
 assert.match(guided,/No Lumens charged/);
 assert.match(guided,/Formative only\. Never unlock a Lab, give a grade/);
 for(const token of ['function evidenceDecision(',"node('fieldset')",'Check my evidence decision','Optional written reasoning','Optional observation notes'])
  assert.ok(academy.includes(token),token);
 assert.doesNotMatch(academy,/if\(answer.value.trim\(\).length<40\)return|if\(field.value.trim\(\).length<25\)/);
 assert.match(protectedUI,/radio.type='radio'/);
 assert.match(protectedUI,/request\(\{caseCode:assessment.caseCode,answers\}\)/);
 assert.doesNotMatch(guided,/api\/grade|service_role|privateAnswerKey/i);
});
test('both classroom routes load the shared method helper and accessible CSS before instructor scripts',()=>{
 for(const page of ['lab-player.html','bootcamp-academy.html']){
  const html=read(page),helper=html.indexOf('learning-response-choice-v1.js'),instructor=html.indexOf('lab-v33-instructor.js');
  assert.ok(helper>0&&instructor>helper,page);
  assert.ok(html.includes('learning-interactive-choice-v1.css'),page);
 }
 const style=read('assets/css/learning-interactive-choice-v1.css');
 for(const token of ['focus-visible','min-width:0','max-width:650px','prefers-reduced-motion'])assert.ok(style.includes(token),token);
});
