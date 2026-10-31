/* Reference-batch deep-instruction, calculation, and source-boundary gate.
 * Assert fictional arithmetic only; official protected answer keys not accessed.
 */
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {execFileSync} from 'node:child_process';
import {academyPrograms} from '../functions/_lib/bootcamp-academy-v014168.js';
import {FIRST22_REFERENCE,first22DayLessons,approvedB01Supplements} from '../functions/_lib/academy-first22-teaching-v1.js';
const codes=['truth5','watchlist7','scanners10','foundations30','charts45','risk60','practicum90'];
assert.deepEqual(Object.entries(FIRST22_REFERENCE),[['truth5',5],['watchlist7',7],['scanners10',10]]);
assert.equal(first22DayLessons.watchlist7.length,7);
assert.equal(first22DayLessons.scanners10.length,10);
const b01=academyPrograms.find(p=>p.code==='truth5');
assert.equal(b01.curriculum.length,5);
assert.equal(Object.keys(approvedB01Supplements).join(','),'1,3,4');
for(const [i,d] of b01.curriculum.entries()){
 assert(d.lesson.explanation&&d.lesson.sourceProcedure.length>=4&&d.lesson.investigation,'Frozen B01 source lesson missing day '+(i+1));
 assert.deepEqual(d.approvedSupplement||null,approvedB01Supplements[i+1]||null);
}
const links=new Set([
 'https://www.investor.gov/introduction-investing/getting-started/researching-investments',
 'https://www.sec.gov/search-filings',
 'https://www.investor.gov/protect-your-investments/fraud/how-avoid-fraud/what-you-can-do-avoid-investment-fraud',
 'https://www.investor.gov/introduction-investing/investing-basics/how-stock-markets-work/types-orders',
 'https://www.investor.gov/introduction-investing/investing-basics/how-stock-markets-work/executing-order'
]);
const digest=new Set(),all=[];
for(const code of ['watchlist7','scanners10']){
 const p=academyPrograms.find(p=>p.code===code);
 for(const [i,d] of p.curriculum.entries()){
  const x=d.lesson;
  assert(x,'Unlinked authored lesson '+code+':'+(i+1));
  for(const field of ['explanation','workedExample','error','reviewGuide','transfer','investigation','selfCheck','whenNot'])
   assert(typeof x[field]==='string'&&x[field].length>45,code+':'+(i+1)+' incomplete '+field);
  assert(x.sourceProcedure.length>=3,code+':'+(i+1)+' missing method');
  assert(links.has(x.reference.url),'Unreviewed/unsupported website on source reference');
  assert(/fictional/i.test(x.workedExample),'Data provenance omitted');
  assert(x.status==='ORIGINAL_UNGRADED_EDITORIAL_AND_PROTECTED_REVIEW_PENDING');
  assert(d.officiallyGraded===false&&d.masteryAwarded===false);
  assert(!digest.has(x.investigation),'Duplicate transfer scenario');
  digest.add(x.investigation);
  for(const v of x.numericChecks){
   const [a,b]=v.inputs;
   let actual;
   switch(v.operation){
    case 'subtract': actual=a-b;break;
    case 'average': actual=v.inputs.reduce((t,z)=>t+z,0)/v.inputs.length;break;
    case 'ratio': actual=a/b;break;
    case 'ratioPercent': actual=a/b*100;break;
    case 'sum': actual=v.inputs.reduce((t,z)=>t+z,0);break;
    default:throw Error('Unknown arithmetic operation '+v.operation);
   }
   assert(v.inputs.every(Number.isFinite)&&Number.isFinite(actual)&&Number.isFinite(v.expected));
   if(['ratio','ratioPercent'].includes(v.operation))assert.notEqual(b,0,'Zero denominator must be blocked');
   assert(Math.abs(actual-v.expected)<=Math.max(0.000001,v.tolerance),code+':'+(i+1)+' invalid '+v.operation+' ('+actual+' expected '+v.expected+')');
  }
  all.push(d);
 }
}
assert.equal(all.length,17);
assert.equal(academyPrograms.filter(p=>codes.includes(p.code)).reduce((n,p)=>n+p.curriculum.length,0),247);
execFileSync(process.execPath,['scripts/bootcamp-247-editorial-preflight-v1.mjs'],{stdio:'inherit'});
const manifest=JSON.parse(fs.readFileSync('artifacts/bootcamp-247-batch-manifest.json','utf8'));
assert.equal(manifest.registeredDays,247);assert.equal(manifest.parentDerivedQueue,225);
assert.equal(manifest.approvedByThisScript,0);assert.equal(manifest.protectedAssessmentsApprovedByThisScript,0);
assert.equal(Object.keys(manifest.batches).length,13);
const guidance=fs.readFileSync('assets/js/academy-guided-v1.js','utf8');
assert(guidance.includes('ORIGINAL_UNGRADED_EDITORIAL_AND_PROTECTED_REVIEW_PENDING'));
assert(guidance.includes('lesson.numericChecks'));
const ui=fs.readFileSync('assets/js/bootcamp-academy-v014168.js','utf8');
assert(ui.includes('Approved supplemental practice'));
assert(ui.includes('Public reference — scoped evidence'));
console.log('PASS first-22 teaching coverage, source scopes, original unique transfer cases, fictional arithmetic, protected grading and B01 freeze.');
