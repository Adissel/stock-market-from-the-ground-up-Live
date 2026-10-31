import assert from 'node:assert/strict';
import {academyPrograms} from '../functions/_lib/bootcamp-academy-v014168.js';
const get=(code,day)=>{
 const p=academyPrograms.find(p=>p.code===code);
 assert(p,'Missing canonical program '+code);
 const d=p.curriculum.find(x=>x.day===day);
 assert(d?.lesson,'Missing day lesson '+code+':'+day);
 assert.equal(d.officiallyGraded,false);
 assert.equal(d.masteryAwarded,false);
 return d.lesson;
};
const watch=get('watchlist7',3);
assert.match(watch.workedExample,/FICTIONAL unsourced training issuer release/i);
assert.match(watch.workedExample,/not actual issuer publication evidence/i);
assert.match(watch.workedExample,/separately documented public-availability cutoff/i);
assert.match(watch.reviewGuide,/proposal/i);
const scan=get('scanners10',7);
assert.match(scan.workedExample,/FICTIONAL DATA ONLY/);
assert.match(scan.workedExample,/first-publication evidence/i);
assert.match(scan.workedExample,/EDGAR acceptance timestamp alone does not prove first public availability/i);
const support=get('foundations30',9);
assert.match(support.workedExample,/FICTIONAL OHLC, NOT LICENSED HISTORICAL MARKET DATA/);
assert.match(support.workedExample,/predeclared decision pause|declared decision pause/i);
assert.match(support.reviewGuide,/first observable time/i);
const daily=get('foundations30',14);
assert.match(daily.workedExample,/FICTIONAL SESSION OBSERVATION, NOT A HISTORICAL QUOTE/);
assert.match(daily.workedExample,/provider delivery time/i);
assert.match(daily.reviewGuide,/early-close holiday/i);
const all=[watch,scan,support,daily];
assert(all.every(l=>l.reference?.url?.startsWith('https://')));
for(const x of all){
 assert(x.reviewState!=='reviewed','Fictional source clarification is not editorial approval');
}
console.log('PASS 4 first42 material source-defect lessons: fictional claims labeled, direct event/feed-proof requirements, no official grading.');
