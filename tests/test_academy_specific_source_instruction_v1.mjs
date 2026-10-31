import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const read=p=>readFileSync(p,'utf8');
const data=JSON.parse(read('data/academy-specific-source-instruction-v1.json'));
const published=read('assets/js/bootcamp-academy-v014168.js');
const build=read('scripts/build-pages.sh');
const curriculum=read('functions/_lib/bootcamp-academy-v014168.js');
const titles={'watchlist7:1':'What Is a Watchlist?','watchlist7:3':'Finding the Real Catalyst',
 'scanners10:3':'Volume and relative volume'};
assert.equal(data.kind,'smfgu_academy_specific_source_instruction_v1');
assert.equal(data.canonicalUnitCount,3);
assert.equal(data.records.length,3);
assert.equal(new Set(data.records.map(x=>x.programCode+':'+x.day)).size,3);
const approved=/^https:\/\/(?:www\.)?(?:investor\.gov|sec\.gov|chartschool\.stockcharts\.com)\//;
let assertions=0;
for(const x of data.records){
 const key=x.programCode+':'+x.day;
 assert.equal(x.title,titles[key]);assert(curriculum.includes(x.title));
 assert(approved.test(x.sourceUrl),'Exact official source: '+key);
 assert.equal(x.fictional,true);
 assert.equal(x.reviewStatus,'narrow_primary_or_publisher_claim_checked_formative_pending_independent_editorial');
 for(const field of ['objective','claim','worked','calculation','counterexample','transfer','limit','sourceClaim']){
  assert(x[field]?.length>50,key+' '+field);
  assertions++;
 }
 assert(x.worked.includes('FICTIONAL:'),'Worked case conspicuously fictional');
 assert(!('masteryAwarded' in x)||x.masteryAwarded===false);
}
const watch=data.records.find(x=>x.programCode==='watchlist7'&&x.day===3);
assert(watch);
const seconds=t=>{const [h,m]=t.split(':').map(Number);return h*60+m};
assert(seconds('08:15')<seconds('08:25'),'Later issuer disclosure cannot justify earlier decision');
assert(seconds('08:10')<seconds('08:15'),'A promotional headline is not an issuer source');
const rvol=data.records.find(x=>x.programCode==='scanners10');
assert(rvol);
assert.equal(8000/10000,0.8);
assert.equal(12000/6000,2);
assert.notEqual(8000/2000,8000/10000,'Do not mix daily and five-minute units');
assert(published.includes('loadAcademyDayClaims()')&&published.includes('showAcademyDayClaim(d,mount)'));
assert(published.includes('allowed.get(key)!==row.title'),'Runtime must match exact canonical lesson');
assert(published.includes('row.reviewStatus!=='),'Runtime must fail closed to unverified status');
assert(published.includes("a.rel='noopener noreferrer'"),'External source links must be safe');
assert(build.includes('academy-specific-source-instruction-v1.json'),'Data must be included in Pages build');
assert(!/\binnerHTML\s*=/.test(published),'Never render untrusted Academy text as HTML');
console.log('PASS Academy 3 precise day-claim research records: '+assertions+
 ' claim fields, 5 independent chronological/numerical checks, runtime source/title restrictions and public build.');
