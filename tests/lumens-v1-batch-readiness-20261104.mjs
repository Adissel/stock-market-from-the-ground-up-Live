/* Lumens V1 main-only release batch. No network, member credentials, grants or charges.
 * A source review is NOT a real independent learning acceptance or OAT signoff.
 */
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const read=p=>readFileSync(p,'utf8');
const batch=read('docs/qa/2026-11-04_LUMENS_V1_CONSOLIDATED_60_GATE_RELEASE_BATCH.md');
const policy=read('docs/qa/2026-11-02_LUMENS_V1_SCOPE_REBASE_V2_BACKLOG.md');
const final=read('docs/qa/2026-11-04_LUMENS_V1_FULL_RELEASE_BATCH_AND_SIGNOFF.md');
const workflow=read('.github/workflows/lumens-v1-consolidated-batch-20261104.yml');
const build=read('scripts/build-pages.sh');
const award=read('functions/_lib/lumen-learning-award-policy-v1.js');
const gift=read('functions/_lib/lumen-member-gifting-policy-v1.js');
const giftApi=read('functions/api/member-lumen-gifts.js');
const preview=read('functions/api/learning-reward-preview.js');
const rows=[...batch.matchAll(/^\| ([A-J]0[1-6]) \| ([^|]+) \| (SOURCE|VERIFIED|OPEN) \|$/gm)]
 .map(x=>({id:x[1],description:x[2].trim(),status:x[3]}));
assert.equal(rows.length,60,'The controlling release register must have exactly 60 unique QA gates');
assert.equal(new Set(rows.map(x=>x.id)).size,60,'Duplicate gate ID');
for(const prefix of 'ABCDEFGHIJ'){
 assert.equal(rows.filter(x=>x.id.startsWith(prefix)).length,6,'Each stream requires six gates');
 for(let j=1;j<=6;j++)
  assert(rows.some(x=>x.id===prefix+String(j).padStart(2,'0')),'Missing '+prefix+j);
}
const counts={VERIFIED:0,SOURCE:0,OPEN:0};
for(const row of rows){counts[row.status]++;assert(row.description.length>=12,'Untitled release gate '+row.id)}
assert.match(policy,/\*\*9\*\*\s*\|\s*\*\*11\*\*\s*\|\s*\*\*81\.8%\*\*/,'Controlling V1 denominator changed without scope approval');
assert.match(policy,/Independent|independent/i,'Protected review cannot be waived');
assert.match(policy,/V2 gifting|V2 backlog/i,'Do not fold gifting into V1');
assert.match(award,/enabled:false/,'Learning rewards stay OFF until independent academic approval');
assert.match(gift,/enabled:false/,'V2 gifting stays OFF');
assert.match(gift,/V2_DEFERRED/,'V2 gifting is not in the first release');
assert.match(giftApi,/giftingPolicy\.enabled!==true\|\|giftingPolicy\.releasePhase!=='V2_RELEASED'/,
 'Gifting must be hard-stopped in code regardless of database flags');
assert.match(preview,/cache-control':'no-store'/,'Reward publication preview must not be cached');
assert.match(workflow,/consolidated-no-money-regression/);
assert.match(workflow,/james-wallet-browser-live-smoke/,'Keep real browser QA, not a synthetic JWT');
assert.match(build,/node tests\/lumens-v1-consolidated-20261104\.mjs/,'Mandatory site build must run Lumens release tests');
assert.match(build,/node tests\/lumens-v1-batch-readiness-20261104\.mjs/,'Site build must verify full release register');
assert.match(final,/full V1.*NO-GO/i,'Do not silently mark release complete');
assert.match(final,/Google Drive location/);
assert.match(final,/Document ID/);
assert.match(final,/independent reviewer/i);
assert.match(final,/LAB_QA_EMAIL/);
const missing=rows.filter(x=>x.status!=='VERIFIED').map(x=>x.id);
const audited={version:'1.0',milestones:{accepted:9,total:11,percent:81.8},
 gates:{total:60,...counts},sourceOnly:true,fullReleaseAccepted:false,
 pendingGateIds:missing};
const request=String(process.env.LUMENS_V1_RELEASE_SIGNOFF||'').toUpperCase();
if(request==='GO')throw Error('RELEASE_HOLD: source-only execution cannot grant academic, authenticated or legal signoff');
console.log('LUMENS_V1_BATCH_EVIDENCE '+JSON.stringify(audited));
console.log('PASS: 60-gate register, 11-milestone baseline, independent release hard stops, mandatory build CI');
console.log('RELEASE_HOLD: '+counts.OPEN+' gates OPEN and '+counts.SOURCE+' gates SOURCE; genuine external acceptance remains required.');
