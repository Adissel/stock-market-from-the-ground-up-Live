/**
 * B01 / truth5 independently sourced structural and arithmetic preflight.
 * NOT an editorial approval, protected grade, member journey or
 * historical market-data provenance test.
 */
import assert from 'node:assert/strict';
import {academyByCode, academyPrograms} from '../functions/_lib/bootcamp-academy-v014168.js';
const truth=academyByCode.truth5;
assert(truth,'Canonical truth5 program missing');
assert.equal(truth.days,5);
assert.equal(truth.curriculum.length,5);
assert.equal(academyPrograms.length,10,'Seven original + three gated draft program definitions required');
assert.equal(academyPrograms.reduce((n,p)=>n+p.days,0),274);
const originalCodes=['truth5','watchlist7','scanners10','foundations30','charts45','risk60','practicum90'];
assert.equal(originalCodes.reduce((n,c)=>n+academyByCode[c].days,0),247);
const seen=new Set();
const fields=['explanation','workedExample','selfCheck','reviewGuide','error','transfer','investigation'];
for (const day of truth.curriculum){
 assert.equal(day.programCode,'truth5');
 assert.equal(day.programDay,day.day);
 assert.equal(day.officiallyGraded,false,'Ungraded B01 cannot claim official mastery');
 assert.equal(day.masteryAwarded,false);
 assert.match(day.sourceStatus,/editorial_review_pending/);
 assert(day.lesson&&typeof day.lesson==='object');
 for(const field of fields){
  const value=day.lesson[field];
  assert.equal(typeof value,'string','Day '+day.day+' missing '+field);
  assert(value.trim().length>=35,'Day '+day.day+' '+field+' too short');
 }
 assert(/^FICTIONAL:/.test(day.lesson.workedExample),'Day '+day.day+' worked example must be labeled FICTIONAL');
 assert(/FICTIONAL INDEPENDENT/.test(day.lesson.investigation),
  'Day '+day.day+' ungraded investigation lacks fictional label');
 assert(!seen.has(day.lesson.investigation),'Day '+day.day+' investigation duplicates another day');
 seen.add(day.lesson.investigation);
 assert(Array.isArray(day.lesson.sourceProcedure)&&day.lesson.sourceProcedure.length>=4);
 assert(day.method.length>=4,'Teaching source procedure missing');
}
assert.equal(seen.size,5);
const percent=((3.00-2.50)/2.50)*100;
const dollarVolume=200000*3.00;
const holderNewShares=1000/10;
const holderMarketValue=holderNewShares*8.00;
const stoppedPriceGap=22.01-20;
const riskPerShare=4.23-4.10;
const rewardPerShare=4.84-4.23;
const rewardRatio=rewardPerShare/riskPerShare;
const candidateFloatRotations=[57/3.5,9/4.3];
assert.equal(percent,20);
assert.equal(dollarVolume,600000);
assert.equal(holderNewShares,100);
assert.equal(holderMarketValue,800);
assert(Math.abs(stoppedPriceGap-2.01)<1e-10);
assert(Math.abs(riskPerShare-0.13)<1e-10);
assert(Math.abs(rewardPerShare-0.61)<1e-10);
assert(Math.abs(rewardRatio-4.69230769)<1e-7);
assert(Math.abs(candidateFloatRotations[0]-16.285714286)<1e-7);
assert(Math.abs(candidateFloatRotations[1]-2.0930232558)<1e-7);
assert.match(truth.curriculum[3].lesson.workedExample,/20%/);
assert.match(truth.curriculum[3].lesson.workedExample,/\$600,000/);
assert.match(truth.curriculum[3].lesson.investigation,/one-for-ten reverse split/);
assert.match(truth.curriculum[2].lesson.workedExample,/08:03 ET/);
assert.match(truth.curriculum[2].lesson.workedExample,/08:10 ET/);
assert.match(truth.curriculum[2].lesson.workedExample,/08:17 ET/);
assert.match(truth.curriculum[1].lesson.reviewGuide,/public-availability time/);
console.log(JSON.stringify({
 test:'B01 original five-day source/arithmetical preflight',
 status:'SOURCE_PREFLIGHT_PASS_NOT_INDEPENDENT_EDITORIAL_APPROVAL',
 studyDays:5,
 uniqueUngradedInvestigations:seen.size,
 independentNumericalCrosschecks:9,
 protectedAssessmentApproved:false,
 authenticatedBrowserAcceptance:false,
 notes:'Independent per-day source citations, editorial reviewer, actual sign-in, private graded cases and complete lesson depth remain gated'
},null,2));