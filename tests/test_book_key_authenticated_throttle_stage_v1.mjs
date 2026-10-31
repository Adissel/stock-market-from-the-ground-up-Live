import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {execFileSync} from 'node:child_process';
const sql=readFileSync('supabase/migrations/20261031_book_key_member_only_throttle_v1.sql','utf8');
const front=readFileSync('assets/js/signup.js','utf8');
const html=readFileSync('create-account.html','utf8');
const settings=readFileSync('assets/js/settings.js','utf8');
const settingHtml=readFileSync('settings.html','utf8');
assert(!front.includes('prepareBookKeyClaim('),'Anonymous Book Key candidate lookup present');
assert(!front.includes('prepare_book_key_claim'),'Pre-signup code oracle call present');
assert(!html.includes('id="signup-book-key"'),'Pre-signup Book Key input should no longer probe codes');
assert(html.includes('settings.html'),'Post-signin redemption path must be visible');
assert(front.includes("bookClaimToken:claimToken"),'Preserve legacy server signup compatibility field as null');
assert(front.includes('const claimToken=null'),'No automatic Book Key claim token may be created');
assert(settings.includes("rpc('redeem_book_key'"),'Existing signed-in customer redemption pathway must be retained');
assert(settings.includes("result.status==='rate_limited'"),'Too-many-attempts status must have accessible UI feedback');
assert(settingHtml.includes('20261031-bookkey-throttle1'),'Browser must fetch updated Settings implementation');
assert(sql.includes('create table if not exists public.book_key_member_attempts_v1'));
assert(sql.includes('alter table public.book_key_member_attempts_v1 enable row level security'));
assert(sql.includes('actor uuid := auth.uid()'));
assert(sql.includes('on conflict(user_id)'),'Concurrent submissions must serialize per real authenticated user');
assert(sql.includes("encode(extensions.digest(normalized,'sha256'),'hex')"),
 'Hash function must be schema qualified because SECURITY DEFINER uses an empty search_path');

assert(sql.includes('attempts < 5'),'Per-member five-attempt window must be present');
assert(sql.includes("interval '60 minutes'"));
assert(sql.includes('return jsonb_build_object(\'status\',\'rate_limited\''),'Throttled client response missing');
assert(sql.includes('revoke all on function public.prepare_book_key_claim(text) from public,anon,authenticated'),
 'Anonymous direct claim token oracle must be revoked after UI rollout');
assert(sql.includes('grant execute on function public.redeem_book_key(text) to authenticated,service_role'));
assert(!sql.includes('drop table public.book_keys'),'Existing Book Keys must not be deleted');
execFileSync(process.execPath,['--check','assets/js/signup.js'],{stdio:'inherit'});
execFileSync(process.execPath,['--check','assets/js/settings.js'],{stdio:'inherit'});
console.log('PASS source-only: signup unaffected, postverification Book Key Settings, authenticated rate limiter staging, no anonymous token probe. LIVE DB MIGRATION NOT APPLIED BY THIS TEST.');
