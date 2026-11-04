import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';import {Script} from 'node:vm';import {academyPrograms} from '../functions/_lib/bootcamp-academy-v014168.js';
import {onRequest as academyRequest} from '../functions/api/bootcamp-academy.js';
const read=p=>readFileSync(new URL('../'+p,import.meta.url),'utf8');
assert.deepEqual(academyPrograms.map(p=>p.days),[5,7,10,30,45,60,90,10,10,7]);
assert.equal(academyPrograms.reduce((v,p)=>v+p.curriculum.length,0),274);
for(const code of ['tape10','indicators10','filings7']){
 const program=academyPrograms.find(p=>p.code===code);
 assert(program);
 assert.equal(new Set(program.curriculum.map(d=>d.title)).size,program.days);
 assert.equal(program.status,'owner_approved_27_day_invite_beta_instruction_20261031',
  'Owner must affirm editorial Beta instruction separately from graded case review: '+code);
 for(const day of program.curriculum){
  assert.equal(day.sourceStatus,'owner_approved_invite_beta_instruction_20261031');
  assert.equal(day.officiallyGraded,false,'Owner instruction signoff cannot award grades');
  assert.equal(day.masteryAwarded,false,'Owner instruction signoff cannot award mastery');
 }
 for(const day of program.curriculum)assert(day.lesson?.worked&&day.lesson?.source?.url&&day.lesson?.transfer);
 const benchmark=program.curriculum[0].lesson.formativeQuestions;
 assert.equal(benchmark.length,12,'Twelve individual formative questions for reference day '+code);
 assert.equal(new Set(benchmark.map(q=>q.prompt)).size,12,'No repeated formative prompts for '+code);
 for(const question of benchmark)assert(question.prompt.length>=30&&question.review.length>=30,
  'Question and corrective explanation independently written for '+code);
 const dayTwo=program.curriculum[1].lesson.formativeQuestions;
 assert.equal(dayTwo.length,12,'Twelve original formative questions on day two for '+code);
 assert.equal(new Set(dayTwo.map(q=>q.prompt)).size,12,'Unique formative prompts on day two for '+code);
 for(const question of dayTwo)assert(question.prompt.length>=30&&question.review.length>=30);
 const authoredDays=program.days;
 for(const [index,day] of program.curriculum.slice(0,authoredDays).entries()){
  assert.equal(day.lesson.formativeQuestions.length,12,'12 independent lesson prompts: '+code+'/'+(index+1));
  assert.equal(new Set(day.lesson.formativeQuestions.map(q=>q.prompt)).size,12,'Within-day duplicate prompt');
  for(const q of day.lesson.formativeQuestions)
   assert(q.prompt.length>=30&&q.review.length>=30&&q.id.startsWith(code+'-D'+String(index+1).padStart(2,'0')));
 }
 assert.equal(new Set(program.curriculum.slice(0,authoredDays).flatMap(day=>day.lesson.formativeQuestions.map(q=>q.prompt))).size,authoredDays*12,
  'The authored days must not recycle prompts');
 assert.equal(program.curriculum.flatMap(day=>day.lesson.formativeQuestions).length,program.days*12,
  'Every day has exactly twelve individually authored formative question/feedback pairs');
 const advanced=program.curriculum.flatMap(day=>day.lesson.advancedPracticums);
 assert.equal(advanced.length,code==='filings7'?13:16,'All individually authored advanced case items mapped into '+code);
 assert.equal(new Set(advanced.map(item=>item.id)).size,advanced.length,'No advanced case ID may repeat');
 for(const [i,day] of program.curriculum.entries()){
  const exercises=day.lesson.advancedPracticums;
  assert.equal(exercises.length,i<6?2:1,'Day-specific advanced lesson allocation: '+code+' day '+(i+1));
  assert.equal(exercises.every(item=>item.id.startsWith(code+'-D'+String(i+1).padStart(2,'0'))),true);
  for(const ex of exercises){
   for(const key of ['scenario','task','worked','pitfall','transfer'])
    assert(typeof ex[key]==='string'&&ex[key].length>=(['scenario','task'].includes(key)?50:70),
     'Advanced exercise requires nontrivial evidence, calculations, and transfer for '+key+': '+ex.id);
  }
 }
}
const upgradedRisk60=academyPrograms.find(p=>p.code==='risk60');
assert(upgradedRisk60,'Original Risk60 remains a canonical existing course');
for(const i of Array.from({length:20},(_,i)=>i)){
 const day=upgradedRisk60.curriculum[i],pack=day.lesson;
 assert.equal(day.sourceDay,[1,2,3,4,6,8,10,11,12,13,16,17,19,20,23,24,25,26,27,30][i],'Risk60 must preserve original parent-source mapping');
 assert.equal(pack.formativeQuestions.length,12,'Original Risk60 deep teaching must carry twelve individually authored questions');
 assert.equal(new Set(pack.formativeQuestions.map(q=>q.id)).size,12);
 assert.equal(pack.advancedPracticums.length,1,'Every original Risk60 upgraded day requires a distinct worked case');
 assert(pack.advancedPracticums[0].worked.length>=70);
 assert.equal(day.officiallyGraded,false,'A teaching upgrade cannot change private grading');
 assert.equal(day.masteryAwarded,false);
}
assert.equal(new Set(upgradedRisk60.curriculum.slice(0,20).flatMap(d=>d.lesson.formativeQuestions.map(q=>q.prompt))).size,240,
 'Risk60 twenty-day deep teaching prompts must not repeat');
for(const index of [20,21]){
 const d=upgradedRisk60.curriculum[index],lesson=d.lesson;
 assert.equal(d.sourceDay,[1,2][index-20],'Risk60 practice cycle must retain original source-day mapping');
 assert.equal(lesson.formativeQuestions.length,12,'New-case rehearsal must have twelve independent formative prompts');
 assert.equal(lesson.advancedPracticums.length,1,'New-case rehearsal requires one independent advanced practicum');
 assert(lesson.advancedPracticums[0].worked.length>=70,'Practice worked evidence must be substantial');
 assert.equal(d.officiallyGraded,false);
 assert.equal(d.masteryAwarded,false);
}
assert.equal(new Set(upgradedRisk60.curriculum.slice(0,22).flatMap(d=>d.lesson.formativeQuestions.map(q=>q.prompt))).size,264,
 'Risk60 twenty-two-day deep teaching prompts must be distinct');
for(const p of academyPrograms)for(const day of p.curriculum)assert(day.objective&&day.observe&&day.practice&&day.officiallyGraded===false);
const catalogRequest=new Request('https://example.test/api/bootcamp-academy?action=catalog');
const defaultCatalog=await(await academyRequest({request:catalogRequest,env:{}})).json();
assert.equal(defaultCatalog.programs.length,7,'Unassessed courses must remain unreleased');
const flaggedCatalog=await(await academyRequest({request:catalogRequest,env:{ACADEMY_THREE_CAMPS_ENABLED:'true'}})).json();
assert.equal(flaggedCatalog.programs.length,10);
const js=read('assets/js/academy-guided-v1.js');
for(const word of ['Start','Learn','Calculate / Analyze','Experiment','Predict','Replay / Practice','Assess','Review & Retry','Transfer Challenge','Results','Close & Next — Submit answer','No Lumens charged','CrownlightLearningEChartsV1?.mount','Not Yet Assessed','academy-guided-numeric','Total traded dollars ($)','Full range ($)','Risk per share ($)'])assert(js.includes(word),word);
assert(read('assets/js/bootcamp.js').includes("GroundUpAcademyGuidedV1?.mount"));
assert(read('assets/js/bootcamp-academy-v014168.js').includes("GroundUpAcademyGuidedV1?.mount"));
assert(read('bootcamp.html').includes('gu-bc-guided'));
assert(read('bootcamp-academy.html').includes('academy-guided-v1.js'));
assert(read('assets/css/academy-guided-v1.css').includes('grid-template-columns:minmax(0,1.15fr) minmax(0,1fr)'));
assert(js.includes('Owner editorial approval: released for invited instructional Beta.'));
for(const [varName,expected] of [['STANDARD_MINUTES',35],['REFERENCE_MINUTES',45]]){
 const prefix='const '+varName+'=Object.freeze([';
 const start=js.indexOf(prefix);
 assert(start>=0,'Every study day must carry a source-defined active learning schedule: '+varName);
 const end=js.indexOf('])',start+prefix.length);
 assert(end>start,'Time schedule syntax must be complete: '+varName);
 const minutes=js.slice(start+prefix.length,end).split(',').map(Number);
 assert.equal(minutes.length,10,'Ten ten-stage study-time allocations required');
 assert(minutes.every(n=>Number.isInteger(n)&&n>0),'Every stage must have active work');
 assert.equal(minutes.reduce((a,b)=>a+b,0),expected,'Honest suggested study minutes: '+varName);
}
assert(js.includes('35-minute suggested ten-stage practice plan for this existing Boot Camp day.'));
assert(js.includes('45-minute suggested practice plan.'));
assert(js.includes('Suggested active-learning itinerary — '));
assert(js.includes('REFERENCE_MINUTES'));
assert(js.includes("isNewCourse"));
assert(js.includes("Talia’s 12 authored formative practice questions"));
assert(js.includes("Full 12-question individual authorship and editorial review remain pending"));
assert(js.includes("No written response is required."),"Formative evidence decisions cannot require a minimum written response");
assert(js.includes('No grade or Lumens'));
for(const phrase of ['academy-advanced-practicum','Advanced application','Review advanced reasoning',
 'Complete and review all twelve day-specific formative questions','reviewedFormative.size!==12',
 'reviewedAdvanced.has(id)','advancedDrafts.set','Teach in more depth:']){
 assert(js.includes(phrase),'Real guided practice and review UI requirement: '+phrase);
}
assert.doesNotThrow(()=>new Script(js));
console.log('PASS shared guided experience mapped to ten Boot Camps and 274 day records without protected grading');
