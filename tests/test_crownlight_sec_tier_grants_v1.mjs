import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {activeSecTier,tierAtLeast,SEC_TIERS} from '../functions/_lib/sec-scanner-tier-v1.js';
const SQL=readFileSync('supabase/migrations/20261103_sec_scanner_tier_grants_v1.sql','utf8');

test('SEC tiers are an ordered restricted set, Professional is not accidentally granted',()=>{
 assert.deepEqual(SEC_TIERS,['BASIC','PLUS','ADVANCED']);
 for(const [t,result] of [['BASIC',false],['PLUS',false],['ADVANCED',true]])
  assert.equal(tierAtLeast(t,'ADVANCED'),result);
 assert.equal(tierAtLeast('ADVANCED','PLUS'),true);
 assert.equal(tierAtLeast('PLUS','BASIC'),true);
 assert.equal(tierAtLeast('PROFESSIONAL','BASIC'),false);
 assert.equal(tierAtLeast('__proto__','BASIC'),false);
 assert.equal(tierAtLeast('BASIC','__proto__'),false);
});

test('missing, revoked and expired tier grants safely fall back to BASIC',()=>{
 const now=Date.parse('2026-11-03T18:00:00Z');
 assert.equal(activeSecTier([],now),'BASIC');
 const good={tier:'ADVANCED',status:'active',version:1,expires_at:null};
 assert.equal(activeSecTier([good],now),'ADVANCED');
 assert.equal(activeSecTier([{...good,expires_at:'2026-11-03T18:00:01Z'}],now),'ADVANCED');
 assert.equal(activeSecTier([{...good,expires_at:'2026-11-03T18:00:00Z'}],now),'BASIC');
 assert.equal(activeSecTier([{...good,status:'revoked'}],now),'BASIC');
 assert.equal(activeSecTier([{...good,tier:'PLUS'}],now),'PLUS');
});
test('malformed tier data and multi-grant ambiguity fail closed',()=>{
 const good={tier:'PLUS',status:'active',version:1,expires_at:null};
 for(const input of [null,{},[good,good],[{...good,tier:'PROFESSIONAL'}],
  [{...good,status:'unknown'}],[{...good,version:0}],
  [{...good,expires_at:'NOT_DATE'}]])
  assert.throws(()=>activeSecTier(input),/unavailable|invalid/i);
});

test('SEC tier grant migration has RLS, service-only rights, version locking and immutable audit',()=>{
 for(const name of ['gu_sec_scanner_tier_grants_v1','gu_sec_scanner_tier_audit_v1','gu_sec_scanner_set_tier_v1'])
  assert.ok(SQL.includes(name),name);
 assert.match(SQL,/enable row level security/ig);
 assert.match(SQL,/revoke all on function public\.gu_sec_scanner_set_tier_v1\(/);
 assert.match(SQL,/from public,anon,authenticated/);
 assert.match(SQL,/to service_role/);
 assert.match(SQL,/role_code='OWNER'/);
 assert.match(SQL,/pg_advisory_xact_lock/);
 assert.match(SQL,/STALE_SEC_TIER_REVISION/);
 assert.match(SQL,/previous_value,next_value,expected_version,change_reason/);
 assert.doesNotMatch(SQL,/drop table|truncate|alter table public\.platform_|delete from public\.user_plan/i);
});
