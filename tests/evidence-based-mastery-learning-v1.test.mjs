import test from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import {readFileSync} from 'node:fs';
const read=path=>readFileSync(path,'utf8');
const lab=read('assets/js/lab-engine-v32-universal.js');
const guided=read('assets/js/academy-guided-v1.js');
const boot=read('assets/js/bootcamp-academy-v014168.js');
const policy=JSON.parse(read('data/evidence-based-mastery-learning-standard-v1.json'));

test('approved nine-stage engine stays frozen; new quality standard is observational and ungraded',()=>{
 assert.equal(policy.status,'IMPLEMENTATION_BASELINE_UNGRADED');
 assert.deepEqual(policy.baseline.officialStages,['Start','Learn','Experiment','Predict','Practice','Assess','Review','Transfer','Results']);
 assert.deepEqual(policy.learningDimensions,['Knowledge','Recognition','Decision-making','Process']);
 for(const token of ["'Start','Learn','Experiment','Predict','Practice','Assess','Review','Transfer','Results'",'Independent competency mastery'])assert.ok(lab.includes(token),token);
 assert.match(guided,/Formative only\. Never unlock a Lab, give a grade/);
 assert.doesNotMatch(guided,/service_role|privateAnswerKey|\/api\/grade/i);
 assert.match(lab,/server-graded question bank after editorial acceptance/);
});

test('canonical Lab catalog contains 419 mapped IDs without changing access or entitlements',()=>{
 const map=JSON.parse(read('data/competency-lab-paths-v01499.json'));
 assert.equal(map.totalCanonicalLabs,419);
 assert.equal(Object.keys(map.byLab).length,419);
 assert.equal(new Set(Object.keys(map.byLab)).size,419);
 assert.match(lab,/bridgeData\.canonicalLabCount!==419/);
 assert.doesNotMatch(policy.remarks,/guaranteed mastery|automatically pass/i);
});

test('Boot Camp academy retains 274 authored positions and the separate five-day Free start',()=>{
 const match=/const expected=new Map\(\[([\s\S]*?)\]\);/.exec(boot);
 assert.ok(match,'Expected Boot Camp canonical-day register');
 const entries=[...match[1].matchAll(/\['([a-z0-9]+)',(\d+)\]/g)].map(m=>[m[1],Number(m[2])]);
 assert.equal(entries.find(x=>x[0]==='free5')?.[1],5);
 assert.equal(entries.filter(x=>x[0]!=='free5').reduce((n,x)=>n+x[1],0),274);
 assert.equal(entries.filter(x=>x[0]!=='free5').length,10);
});

test('genuine manipulations are present for price-chart, risk-sizing, and source-evidence lessons',()=>{
 new vm.Script(guided,{filename:'academy-guided-v1.js'});
 new vm.Script(lab,{filename:'lab-engine-v32-universal.js'});
 assert.match(guided,/CrownlightLearningEChartsV1\.mount\(visual/);
 assert.match(guided,/Interactive risk-sizing experiment/);
 assert.match(guided,/Interactive source-evidence experiment/);
 assert.match(guided,/control\.addEventListener\('input',\(\)=>\{interactionStages\.add\(stage\);update\(\)\}\)/);
 assert.match(guided,/outcome\.textContent=conclusion/);
 assert.match(lab,/CrownlightLearningEChartsV1\.mount\(visualHost/);
 assert.match(lab,/What your learning activities demonstrated/);
});

test('actual first-try work is distinguished from assistance and corrective retries',()=>{
 const sandbox={};vm.runInNewContext(guided,sandbox,{timeout:1000});
 const api=sandbox.GroundUpAcademyGuidedV1;
 assert.equal(typeof api?.summarizeEvidence,'function');
 const checkpoints=new Map([
  [2,{correct:true,attempts:1,assisted:false,numeric:true}],
  [4,{correct:true,attempts:1,assisted:true,numeric:false}],
  [6,{correct:true,attempts:3,assisted:false,numeric:false}],
  [8,{correct:false,attempts:1,assisted:false,numeric:false}]
 ]);
 const summary=api.summarizeEvidence(checkpoints,3);
 assert.equal(summary.checked,3);
 assert.equal(summary.firstTry,1);
 assert.equal(summary.assisted,1);
 assert.equal(summary.corrected,1);
 assert.equal(summary.numeric,1);
 assert.equal(summary.interactions,3);
 assert.match(summary.dimensions[0].status,/first unassisted/);
 assert.match(summary.dimensions[1].status,/teaching assistance/);
 assert.match(summary.dimensions[2].status,/corrective retry/);
 assert.match(summary.dimensions[3].status,/Not yet demonstrated/);
});

test('unnecessary typed-essay gates remain prohibited; short calculations and optional notes remain',()=>{
 assert.match(guided,/input\.type='number'/);
 assert.match(guided,/Optional written reasoning/);
 assert.match(guided,/assistanceByStage\.add\(stage\)/);
 assert.doesNotMatch(guided,/response\.required\s*=\s*true|textarea\.required\s*=\s*true|response\.value\.trim\(\)\.length<20/);
 assert.match(lab,/function evidenceDecision\(/);
 assert.match(lab,/practiceAssisted/);
 assert.doesNotMatch(lab,/Write at least 15 characters to explain what you learned/);
 assert.match(policy.interactionRequirements.nonNumericAnswer,/no mandatory essay/);
});

test('learning observations do not claim verified retention, independent mastery, or release graded awards',()=>{
 for(const token of ['Not Yet Assessed','Official Boot Camp grading is independent','What your learning activities demonstrated','Review the method with Talia'])assert.ok(lab.includes(token),token);
 assert.match(guided,/No member grades are written/);
 assert.match(guided,/Results are not saved by this guided widget/);
 assert.equal(policy.releaseHolds.length,3);
 assert.match(policy.evidencePolicy.retention,/later spaced recall/);
});

test('Boot Camp reflection notes are optional at every input length; no 40/80-character quota',()=>{
 const source=read('assets/js/bootcamp-academy-v014168.js');
 assert.match(source,/Optional written reasoning — not required for feedback/);
 assert.match(source,/use\.disabled=!answer\.value\.trim\(\)/);
 assert.match(source,/use\.disabled=!value\.trim\(\)/);
 assert.match(source,/if\(!written\)/);
 assert.match(source,/if\(!answer\)/);
 assert.doesNotMatch(source,/answer\.length<40|written\.length<80|\.value\.trim\(\)\.length<80/);
});

test('first 16 corrected Lab transfer cases are distinct evidence-driven exercises without lookahead or grades',()=>{
 const curriculum=JSON.parse(read('data/lab-teaching-bridges-v014168.json'));
 const IDs=["DT-C36-L02","F3-C04-L01","F3-C04-L02","F3-C04-L03","F3-C05-L01","F3-C05-L02","F3-C05-L03","F3-C05-L04","F3-C06-L01","F3-C06-L02","F3-C06-L03","F3-C06-L04","F3-C06-L05","F3-C06-L06","DT-C37-L03","DT-C38-L02"];
 assert.equal(curriculum.canonicalLabCount,419);
 assert.equal(Object.keys(curriculum.entries).length,419);
 assert.equal(new Set(IDs).size,16);
 const prompts=new Set();
 for(const id of IDs){
  const entry=curriculum.entries[id];
  assert.ok(entry,'Unknown canonical Lab '+id);
  const t=entry.transfer;
  assert.equal(t.graded,false,id);
  assert.equal(t.noLookahead,true,id);
  assert.equal(t.requiresNewEvidence,true,id);
  assert.ok(t.prompt.length>=330,'Transfer needs a complete unfamiliar case: '+id);
  assert.match(t.prompt,/completed|cutoff|observation|planned|hypothetical|reference/i,id);
  assert.match(t.prompt,/simulated|fictional/i,id);
  prompts.add(t.prompt);
 }
 assert.equal(prompts.size,16,'No template text repeated between corrected cases');
});
