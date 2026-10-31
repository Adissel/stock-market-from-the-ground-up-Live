import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {execFileSync} from 'node:child_process';
const src=readFileSync('assets/js/signup.js','utf8');
const html=readFileSync('create-account.html','utf8');
const endpoint=readFileSync('functions/api/account.js','utf8');
for(const forbidden of [
 "sb.rpc('username_is_available'",
 "sb.rpc('email_is_available'",
 "Username already in use. Sign in or reset your password.",
 "Email already in use. Sign in or reset your password."
]) assert(!src.includes(forbidden),'Public per-keystroke identifier probe/response must be absent');
assert.match(src,/validUsername\(username\)/);
assert.match(src,/validEmail\(email\)/);
assert.match(src,/fetch\('\/api\/account\?action=signup'/);
assert.match(src,/captchaToken}/);
assert.match(src,/bookClaimToken:claimToken/);
assert.match(src,/prepareBookKeyClaim\(bookKey\)/,
 'Keep existing optional Book Key flow unchanged until its independently tested protected replacement is deployed');
assert.match(html,/signup\.js\?v=20261031-privacy1/,'Registration page needs cache-busted privacy-safe client');
assert.match(endpoint,/rpc\/username_is_available/,'Trusted signup handler retains unique-username enforcement');
assert.match(endpoint,/auth\/v1\/signup/,'Supabase Auth remains authoritative');
execFileSync(process.execPath,['--check','assets/js/signup.js'],{stdio:'inherit'});
console.log('PASS signup browser: no username/email enumeration RPC; format-only hints; private server registration, CAPTCHA, Book Key intact. DB public RPC exposure still requires remediation.');
