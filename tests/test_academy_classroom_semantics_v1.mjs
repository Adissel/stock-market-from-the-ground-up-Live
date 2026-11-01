/* Static accessibility semantics preflight for the public Academy classroom.
 * Non-browser assertions do NOT claim a full WCAG/screen-reader audit.
 */
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const html=readFileSync('bootcamp-academy.html','utf8');
const required=[
 /<section id="academy-workspace"[^>]+aria-labelledby="academy-course-title"/,
 /<aside class="gu-bc-index"[^>]+aria-labelledby="academy-index-title"/,
 /<nav id="academy-days"[^>]+aria-label="Select a lesson"/,
 /<article class="gu-bc-lesson[^"]*"[^>]+aria-labelledby="academy-day-title"/,
 /<h3 id="academy-day-title"/,
 /<details class="academy-classroom-briefing"><summary>/,
 /role="progressbar"[^>]+aria-label="Boot Camp learning progress"/,
 /<label for="academy-reflection">/,
 /<textarea id="academy-reflection"/,
 /id="academy-save-status" role="status" aria-live="polite"/,
 /<nav class="gu-bc-pager" aria-label="Academy day navigation"/,
 /id="academy-official-assessment"[^>]+hidden/
];
for(const rule of required)assert(rule.test(html),'Academy accessible markup contract failed: '+rule);
const ids=[...html.matchAll(/\bid="([^"]+)"/g)].map(m=>m[1]);
assert.equal(new Set(ids).size,ids.length,'Duplicate HTML ids break labels and accessibility');
const css=readFileSync('assets/css/teaching-full-width-v1.css','utf8');
assert(html.includes('teaching-full-width-v1.css?v=20261031-mobile2'),
 'Academy must load current responsive stylesheet on mobile');
assert(css.includes('Academy mobile containment: preserve readable header'),
 'Mobile classroom containment rules are missing');
assert(css.includes('flex-wrap:wrap!important')&&css.includes('overflow-wrap:anywhere!important'),
 'Academy mobile header must wrap text and controls, not merely hide overflow');
assert(css.includes('390px authenticated browser finding: injected search'),
 'Site-wide injected search and notification controls must not expand Academy mobile layout');
assert(css.includes('max-width:96px!important')&&css.includes('width:44px!important'),
 'Search and notifications must remain accessible compact mobile controls');
assert(css.includes('.academy-guided-ten,.academy-guided-grid'),
 'Mobile classroom learning grid lacks intrinsic-size containment');
console.log('PASS Academy static accessibility: semantic lesson nav, labeled headings, disclosure, reflection, live status and progress bar; protected grading hidden.');
console.log('NOT ACCEPTED: actual keyboard traversal, axe/AT screen-reader audit, mobile viewport, native CAPTCHA login or real blind grade.');
