/* Nonapproving complete-source regression for 90 fictional Practicum90 days.
 * Does NOT confer private grading, human independent review or live stock-data rights.
 */
import assert from 'node:assert/strict';
import {execFileSync} from 'node:child_process';
import {readFileSync} from 'node:fs';
import {academyPrograms} from '../functions/_lib/bootcamp-academy-v014168.js';
import {practicum90LearnBatch01} from '../functions/_lib/academy-practicum90-learning-batch01-v1.js';
import {practicum90LearnBatch02} from '../functions/_lib/academy-practicum90-learning-batch02-v1.js';
import {practicum90Batch03} from '../functions/_lib/academy-practicum90-batch03-days26-45-v1.js';
import {practicum90Batch04} from '../functions/_lib/academy-practicum90-batch04-days46-65-v1.js';
import {practicum90Batch05} from '../functions/_lib/academy-practicum90-batch05-days66-90-v1.js';
const all=[...practicum90LearnBatch01,...practicum90LearnBatch02,...practicum90Batch03,...practicum90Batch04,...practicum90Batch05];
const program=academyPrograms.find(p=>p.code==='practicum90');
assert(program&&program.curriculum.length===90,'Original 90-day course must be unchanged');
assert.equal(all.length,90);
const examples=new Set(),transfers=new Set(),refs=new Set(),phases={learn:0,practice:0,transfer:0};
for(let i=0;i<90;i++){
 const lesson=all[i],day=program.curriculum[i];
 const source=((i%30)+1),phase=i<30?'learn':i<60?'practice':'transfer';
 assert.equal(day.day,i+1,'Canonical day identifier');
 assert.equal(day.sourceDay,source,'Canonical thirty-source mapping');
 assert.equal(day.phase,phase,'Correct learning phase');
 if(i<80){
  for(const [key,value] of Object.entries(lesson))
   assert.strictEqual(day.lesson[key],value,'Frozen original Practicum90 field '+key+' day '+day.day);
  assert.equal(day.lesson.supplementarySourceStatus,
   'ORIGINAL_PRACTICUM90_ADVANCED_UNGRADED_SOURCE_READY_ACCEPTANCE_PENDING');
 }else assert.strictEqual(day.lesson,lesson,'One canonical source package per day');
 assert.equal(day.officiallyGraded,false,'No unapproved grading');
 assert.equal(day.masteryAwarded,false,'No unapproved mastery');
 assert.equal(lesson.day,i+1);
 assert.equal(lesson.topicSourceDay,source);
 assert.equal(lesson.status,'ORIGINAL_UNGRADED_EDITORIAL_AND_PROTECTED_REVIEW_PENDING');
 assert(typeof lesson.title==='string'&&lesson.title.length>30);
 for(const field of ['explanation','workedExample','transfer','reviewGuide','error','selfCheck','whenNot']){
  assert(typeof lesson[field]==='string'&&lesson[field].length>=40,'Missing '+field+' day '+day.day);
 }
 assert(lesson.workedExample.startsWith('FICTIONAL:'),'No real market record without verification');
 assert(lesson.sourceProcedure.length>=3);
 assert(lesson.transfer.includes('FRESH FICTIONAL'),'Distinct transfer form');
 assert(lesson.reference?.url?.startsWith('https://'),'Reference URL category missing');
 assert(!examples.has(lesson.workedExample),'Duplicated worked case at '+day.day);examples.add(lesson.workedExample);
 assert(!transfers.has(lesson.transfer),'Duplicated transfer case at '+day.day);transfers.add(lesson.transfer);
 assert(!Object.hasOwn(lesson,'correctOption'),'Private assessment answer key may not leak in lesson');
 refs.add(lesson.reference.url);phases[phase]++;
}
assert.deepEqual(phases,{learn:30,practice:30,transfer:30});
assert.equal(examples.size,90);assert.equal(transfers.size,90);
assert(refs.size>=2,'Source categories need diversity');
const near=(a,b,topic)=>assert(Math.abs(a-b)<.00001,topic+': '+a+' expected '+b);
near((4.60-4.40)/4.50*100,4.4444444444,'D26 spread');
near((11.50-10)/10*100,15,'D27 skipped hypothetical');
near((25.75-25)/25*100,3,'D28 followthrough');
near((30-28.20)/30*100,6,'D29 event');
near(20/25*100,80,'D30 source records');
near(20/30*100,66.6666666667,'additional independent complete fraction');
near((16.92-16.72)/16.82*100,1.1890606421,'D32 spread');
near(400000/1600000,.25,'D34 turnover');
near(110-25-55,30,'D36 visible depth');
near(Math.floor(64/(18-17.60)),160,'D40 risk');
near(Math.floor(1440/18),80,'D40 notional');
near(70*(6.20-6),14,'D41 confirmed exit');
near((35*4.70+65*4.74)/100,4.726,'D42 frozen avg');
near((20.20-17)*55,176,'D47 short gross loss');
near((3.52-3.20)/3.36*100,9.5238095238,'D52 sympathy spread');
near((10.30-10.02)/10.16*100,2.7559055118,'D53 quote spread');
near(24/30*100,80,'D60 source completeness');
near((29.80-29.20)/29.50*100,2.0338983051,'D62 spread');
near(1250000/500000,2.5,'D64 float turnover');
near(40*18.25+35*18.30,1370.5,'D66 quote model');
near(Math.floor(56/.35),160,'D70 risk');
near(Math.floor(1260/21),60,'D70 notional');
near((60*8.12+40*8.20)/100,8.152,'D72 static snapshot');
near((10.60-10.10)/10.35*100,4.8309178744,'D75 spread');
near(15/19*100,78.9473684211,'D79 selection');
near((22-20)/20*100,10,'D82 leader');
near((16.22-15.90)/16.06*100,1.9925280199,'D83 spread');
near(43/50*100,86,'D90 sources');
near(31/50*100,62,'D90 intersection');
execFileSync(process.execPath,['scripts/bootcamp-247-editorial-preflight-v1.mjs'],{stdio:'inherit'});
const manifest=JSON.parse(readFileSync('artifacts/bootcamp-247-batch-manifest.json','utf8'));
assert.equal(manifest.registeredDays,247);
assert.equal(manifest.parentDaysNewlyAuthored,225);
assert.equal(manifest.authoredTotal,247);
assert.equal(manifest.parentDaysStillNeedingLesson,0);
assert.equal(manifest.approvedByThisScript,0);
assert.equal(manifest.protectedAssessmentsApprovedByThisScript,0);
console.log('PASS: 90/90 original Practicum source cases, 247/247 original seven-camp source authoring; 0 independent editorial or official protected grading acceptance.');
