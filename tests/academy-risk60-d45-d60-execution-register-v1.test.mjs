import test from 'node:test';
import assert from 'node:assert/strict';
import {academyPrograms} from '../functions/_lib/bootcamp-academy-v014168.js';
import {risk60DeepDays45to52V1} from '../functions/_lib/academy-risk60-advanced-depth-days45-52-v1.js';
import {risk60DeepDays53to60V1} from '../functions/_lib/academy-risk60-advanced-depth-days53-60-v1.js';
import {risk60TransferBatch03} from '../functions/_lib/academy-risk60-transfer-batch03-v1.js';
import {risk60SourceDays} from '../functions/_lib/academy-risk60-learning-batch01-v1.js';

const program=academyPrograms.find(item=>item.code==='risk60');
const authored={...risk60DeepDays45to52V1,...risk60DeepDays53to60V1};
const operations={
 difference:v=>v[0]-v[1],product:v=>v[0]*v[1],ratio:v=>v[0]/v[1],percent:v=>100*v[0]/v[1],
 returnPct:v=>100*(v[1]-v[0])/v[0],spreadPct:v=>100*(v[1]-v[0])/((v[0]+v[1])/2),
 weighted2:v=>(v[0]*v[1]+v[2]*v[3])/(v[0]+v[2]),floorDiv:v=>Math.floor(v[0]/v[1]),
 sum:v=>v.reduce((a,b)=>a+b,0),min:v=>Math.min(...v),power:v=>v[0]**v[1],
 weightedQty3:v=>(v[0]*v[1]+v[2]*v[3]+v[4]*v[5])/(v[0]+v[2]+v[4]),
 weightedProbability3:v=>v[0]*v[1]+v[2]*v[3]+v[4]*v[5]
};
const prompts=new Set(),reviews=new Set(),transfers=new Set(),numericSignatures=new Set();

for(let day=45;day<=60;day++)test(`RC12-D${day}: advanced source, math, runtime identity and grading boundary`,()=>{
 const source=authored[day],runtime=program.curriculum[day-1],lesson=runtime.lesson;
 assert.ok(source&&lesson);
 assert.strictEqual(lesson,risk60TransferBatch03[day-41]);
 assert.equal(runtime.programCode,'risk60');assert.equal(runtime.day,day);assert.equal(lesson.day,day);
 assert.equal(lesson.topicSourceDay,risk60SourceDays[day-41]);
 assert.equal(Object.hasOwn(source,'topicSourceDay'),false);
 assert.equal(lesson.instructionalFocus,source.instructionalFocus);
 assert.equal(lesson.formativeQuestions.length,12);assert.equal(lesson.advancedPracticums.length,1);
 assert.equal(runtime.officiallyGraded,false);assert.equal(runtime.masteryAwarded,false);
 assert.equal(lesson.status,'ORIGINAL_UNGRADED_EDITORIAL_AND_PROTECTED_REVIEW_PENDING');
 assert.ok(lesson.reference.url.startsWith('https://'));
 for(const [index,item] of lesson.formativeQuestions.entries()){
  assert.equal(item.id,`risk60-D${String(day).padStart(2,'0')}-Q${String(index+1).padStart(2,'0')}`);
  assert.ok(item.prompt.length>=35&&item.review.length>=45);assert.equal(item.graded,false);
  assert.equal(prompts.has(item.prompt),false);assert.equal(reviews.has(item.review),false);
  prompts.add(item.prompt);reviews.add(item.review);
 }
 const practicum=lesson.advancedPracticums[0];
 for(const field of ['scenario','task','worked','pitfall','transfer'])assert.ok(practicum[field].length>=95);
 assert.equal(transfers.has(practicum.transfer),false);transfers.add(practicum.transfer);
 const {operation,inputs,expected}=lesson.numericCheck;
 assert.ok(operations[operation]&&inputs.every(Number.isFinite)&&Number.isFinite(expected),`D${day} numeric contract`);
 assert.ok(Math.abs(operations[operation](inputs)-expected)<1e-8,`D${day} numeric result`);
 const signature=JSON.stringify({operation,inputs,expected});assert.equal(numericSignatures.has(signature),false);numericSignatures.add(signature);
 for(const hidden of ['answerKey','correctAnswer','correctOption','grader','masteryScore'])assert.equal(Object.hasOwn(lesson,hidden),false);
});

test('RC12 D45-D60 aggregate uniqueness and source-only boundary',()=>{
 assert.equal(Object.keys(authored).length,16);assert.equal(prompts.size,192);assert.equal(reviews.size,192);
 assert.equal(transfers.size,16);assert.equal(numericSignatures.size,16);
});
