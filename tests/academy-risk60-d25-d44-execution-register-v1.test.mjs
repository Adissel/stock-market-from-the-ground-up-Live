import test from 'node:test';
import assert from 'node:assert/strict';
import {academyPrograms} from '../functions/_lib/bootcamp-academy-v014168.js';
import {risk60DeepDays25to44V1} from '../functions/_lib/academy-risk60-advanced-depth-days25-44-v1.js';
import {risk60PracticeBatch02} from '../functions/_lib/academy-risk60-practice-batch02-v1.js';
import {risk60TransferBatch03} from '../functions/_lib/academy-risk60-transfer-batch03-v1.js';
import {risk60SourceDays} from '../functions/_lib/academy-risk60-learning-batch01-v1.js';

const program=academyPrograms.find(item=>item.code==='risk60');
const operations={
 difference:values=>values[0]-values[1],product:values=>values[0]*values[1],
 ratio:values=>values[0]/values[1],percent:values=>100*values[0]/values[1],
 returnPct:values=>100*(values[1]-values[0])/values[0],
 spreadPct:values=>100*(values[1]-values[0])/((values[0]+values[1])/2),
 weighted2:values=>(values[0]*values[1]+values[2]*values[3])/(values[0]+values[2]),
 floorDiv:values=>Math.floor(values[0]/values[1])
};

for(let day=25;day<=44;day++)test(`RC11-D${day}: source, math, runtime identity and grading boundary`,()=>{
 const authored=risk60DeepDays25to44V1[day];
 const runtime=program.curriculum[day-1];
 const expectedLesson=day<=40?risk60PracticeBatch02[day-21]:risk60TransferBatch03[day-41];
 const expectedSourceDay=risk60SourceDays[day<=40?day-21:day-41];
 assert.equal(program.curriculum.length,60);
 assert.ok(authored&&runtime?.lesson);
 assert.strictEqual(runtime.lesson,expectedLesson);
 assert.equal(runtime.programCode,'risk60');
 assert.equal(runtime.day,day);
 assert.equal(runtime.lesson.day,day);
 assert.equal(runtime.lesson.topicSourceDay,expectedSourceDay);
 assert.equal(Object.hasOwn(authored,'topicSourceDay'),false);
 assert.equal(runtime.lesson.instructionalFocus,authored.instructionalFocus);
 assert.equal(runtime.lesson.formativeQuestions.length,12);
 assert.equal(new Set(runtime.lesson.formativeQuestions.map(item=>item.prompt)).size,12);
 assert.equal(new Set(runtime.lesson.formativeQuestions.map(item=>item.review)).size,12);
 assert.equal(runtime.lesson.advancedPracticums.length,1);
 assert.ok(runtime.lesson.reference.url.startsWith('https://'));
 assert.equal(runtime.officiallyGraded,false);
 assert.equal(runtime.masteryAwarded,false);
 assert.equal(runtime.lesson.status,'ORIGINAL_UNGRADED_EDITORIAL_AND_PROTECTED_REVIEW_PENDING');
 for(const hidden of ['answerKey','correctAnswer','correctOption','grader','masteryScore'])
  assert.equal(Object.hasOwn(runtime.lesson,hidden),false);
 const {operation,inputs,expected}=runtime.lesson.numericCheck;
 assert.ok(operations[operation]);
 assert.ok(inputs.every(Number.isFinite)&&Number.isFinite(expected));
 assert.ok(Math.abs(operations[operation](inputs)-expected)<1e-8);
});
