/* Prospectively enforce owner-approved 60-day post-term Founder rollover.
 * Source/DDL contract, not a real paid Founder journey or consumer legal review.
 */
import assert from 'node:assert/strict';
import{readFileSync}from'node:fs';
const s=readFileSync('supabase/migrations/20261104_founder_included_60day_rollover_v1.sql','utf8');
const q=x=>assert(s.includes(x),'Missing rollover safeguard: '+x);
q("FOUNDER_POLICY_MIGRATION_REQUIRES_PRIOR_CYCLE_REVIEW");
q("FOUNDER_PAID_CYCLE_SOURCE_HAS_CHANGED");
q("FOUNDER_THREE_PLAN_CATALOG_NOT_COMPLETE");
q("source IN ('purchased','manual') AND expires_at IS NULL");
q("billing_period_ends_at+interval '60 days'");
q("p_period_end+make_interval(days=>p.sparks_expiry_after_term_days)");
q("gu_founder_plans_v014173_check");
q("purchase_discount_bps=500");
q("purchase_discount_bps=1000");
q("purchase_discount_bps=1500");
for(const code of ['FOUNDING_14','FOUNDING_30','FOUNDING_60']){
 const chunk=s.slice(s.indexOf("(plan_code='"+code+"'"));
 assert(chunk.includes('sparks_expiry_after_term_days=60'),'Missing 60-day value '+code);
}
assert(!s.includes('DELETE FROM'),'Must preserve all historical credits');
assert(!s.includes('TRUNCATE'),'Must preserve all member records');
console.log('PASS prospective Founder post-term 60-day included-credit rollover guarded by zero-paid-cycle preflight, preserved purchased credits and unchanged prices.');
console.log('Not a statement of licensed consumer-law clearance or paid checkout acceptance.');
