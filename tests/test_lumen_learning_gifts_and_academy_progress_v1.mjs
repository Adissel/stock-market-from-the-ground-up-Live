import assert from 'node:assert/strict';
import fs from 'node:fs';
import {awardPolicy,rewardPreview,validRewardDefinition} from '../functions/_lib/lumen-learning-award-policy-v1.js';
import {giftingPolicy,validateGiftAmount,giftAvailability} from '../functions/_lib/lumen-member-gifting-policy-v1.js';
assert.equal(awardPolicy.enabled,false);
assert.equal(rewardPreview({}).lumens,null);
assert.equal(rewardPreview({scopeType:'canonical_lab',scopeId:'F1-C02-L01',amount:30,
 approved:true,approvedRevision:'v99',serverEvidenceRequired:true}).published,false);
assert.equal(validRewardDefinition({scopeType:'academy_program',scopeId:'truth5',amount:50,
 approved:true,approvedRevision:'v99',serverEvidenceRequired:true}),true);
assert.equal(giftingPolicy.enabled,false);
assert.equal(giftAvailability().enabled,false);
for(const n of [0,9,201,12.1,-10,NaN,Infinity,'100'])assert.equal(validateGiftAmount(n),false);
for(const n of [10,100,200])assert.equal(validateGiftAmount(n),true);
const nav=fs.readFileSync('dashboard.html','utf8');
const js=fs.readFileSync('assets/js/member-academy-progress-top5-v1.js','utf8');
assert.match(nav,/data-academy-study-progress/);
assert.match(js,/reflection_saved/);
assert.match(js,/ungraded/);
assert.doesNotMatch(js,/\.insert\s*\(|\.update\s*\(|awardLumens|transferLumens/);
console.log('PASS: learning reward and member gifting are fail closed; progress is ungraded.');
