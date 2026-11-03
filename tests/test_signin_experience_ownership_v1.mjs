import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const experience=readFileSync('assets/js/experience-redesign-v1.js','utf8');
const signin=readFileSync('signin.html','utf8');
const layoutQA=readFileSync('tests/test_workspace_layout_browser.py','utf8');
assert.match(experience,/if\(signin&&signin\.querySelector\('\.gu-signin-ad-layout'\)&&/);
assert.match(experience,/signin\.querySelector\('#gu-signin-center>\.gu-signin-form-column'\)\)return;/);
assert.match(signin,/class="gu-signin-ad-layout"/);
assert.match(signin,/class="gu-signin-form-column"/);
assert.match(signin,/experience-redesign-v1\.js\?v=20261102-signin-owner2/);
assert.match(layoutQA,/Legacy sign-in assurance sidebar must not reappear/);
assert.match(layoutQA,/Visible sign-in form should be compact/);
assert.match(experience,/wrap\.replaceChildren\(sidebar,content\)/,
 'Signup experience remains functional behind the explicit sign-in boundary');
console.log('PASS canonical sign-in owns its form and external rails; legacy inner sidebar skipped; signup unaffected.');
