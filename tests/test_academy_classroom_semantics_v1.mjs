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
console.log('PASS Academy static accessibility: semantic lesson nav, labeled headings, disclosure, reflection, live status and progress bar; protected grading hidden.');
console.log('NOT ACCEPTED: actual keyboard traversal, axe/AT screen-reader audit, mobile viewport, native CAPTCHA login or real blind grade.');
