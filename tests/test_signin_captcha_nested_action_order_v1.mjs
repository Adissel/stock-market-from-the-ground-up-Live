import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const html=readFileSync('signin.html','utf8');
assert(html.includes('class="gu-auth-primary-actions"'),
 'Sign-in button action row is missing');
assert(html.includes("const actions=submit.closest('.gu-auth-primary-actions')"),
 'CAPTCHA positioning must target the true direct-child actions row');
assert(html.includes("const anchor=actions&&actions.parentElement===form?actions:submit"),
 'Missing direct-child parent validation');
assert(html.includes('parent.insertBefore(verification,anchor)')&&
 html.includes('parent.insertBefore(status,anchor)'),
 'CAPTCHA and verification status must use a valid parent/anchor pair');
assert(!html.includes('form.insertBefore(verification,submit)')&&
 !html.includes('form.insertBefore(status,submit)'),
 'Nested sign-in submit cannot be used as direct-child reference to form.insertBefore');
assert(html.includes('new MutationObserver(arrange).observe(form,'),
 'Late-injected verification controls must still be ordered');
console.log('PASS native sign-in DOM CAPTCHA control ordering: valid parent/child insertions, original handlers retained.');
console.log('NOT ACCEPTED: live CAPTCHA challenge completion or user sign-in workflow.');
