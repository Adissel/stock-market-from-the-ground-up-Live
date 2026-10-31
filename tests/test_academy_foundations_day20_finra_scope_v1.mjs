/* Academy Foundations Day 20 — FINRA data coverage and math scope.
 * A matching displayed quotient is not automatically a consolidated-market
 * short-sale percentage or outstanding short-interest count.
 */
import assert from 'node:assert/strict';
import {foundationsBatch02} from '../functions/_lib/academy-foundations-batch02-v1.js';
const d=foundationsBatch02[19];
assert(d&&d.title.includes('20'));
assert.equal(d.reference.url,'https://syndication.finra.org/content/short-interest-what-it-what-it-not');
assert.match(d.explanation,/off.exchange.*not a consolidated all.venue short.sale count/i);
assert.match(d.workedExample,/not a valid market.wide short.sale share unless/i);
assert.match(d.reviewGuide,/eligible venues.*time period match/i);
assert.match(d.selfCheck,/source/i);
const ratio=d.numericChecks.find(x=>x.operation==='ratioPercent');
assert(ratio);
assert.equal(ratio.inputs[0]/ratio.inputs[1]*100,40);
assert.equal(ratio.expected,40);
assert.equal(d.status,'ORIGINAL_UNGRADED_EDITORIAL_AND_PROTECTED_REVIEW_PENDING');
console.log('PASS Day20 venue-comparable denominator guidance and FINRA primary source; fictional quotient 40%, no editorial signoff.');
