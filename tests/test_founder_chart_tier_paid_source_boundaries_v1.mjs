/* Source-level safety regression: no synthetic QA Founder seat, payment or mastery. */
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const source=readFileSync(new URL('../functions/api/chart-tier-access.js',import.meta.url),'utf8');
for(const [plan,tier] of [['FOUNDING_14','STANDARD'],['FOUNDING_30','ADVANCED'],['FOUNDING_60','PROFESSIONAL']]){
 assert(source.includes(plan+':\''+tier+'\''),'Founding commercial plan tier mapping '+plan);
}
assert(source.includes("if(founder.length===1&&founder[0].revoked_at==null)"),'Commercial Founder requires nonrevoked founder record');
assert(source.includes("x.reversed_at==null"),'Reversed provider cycle cannot authorize Studio');
assert(source.includes("Number.isFinite(start)&&start<=now&&Number.isFinite(end)&&end>now"),'Billing cycle must be current');
assert(source.includes("consider(x.plan_code,'Verified active '+x.plan_code+' paid term')"),'Paid access must cite verified term');
assert(source.includes("['PICK_WHAT_YOU_WANT','ONDEMAND_MONTHLY','FULL_MONTHLY','FULL_ANNUAL','LIFETIME'].includes(g.plan_code)"),'Unpaid Founding plan grants cannot impersonate a paid Founder cycle');
assert(source.includes("chartQA[0].scope==='CHART_STUDIO_ONLY'"),'QA entitlement must be chart-only');
assert(source.includes("chartQA[0].revoked_at===null"),'Revoked chart QA cannot authorize premium');
assert(source.includes("Date.parse(chartQA[0].ends_at)-Date.parse(chartQA[0].starts_at)<=14*86400000"),'QA permission must be short-lived');
assert(source.includes("reason='Temporary noncommercial Chart Studio testing — chart-only'"),'Explicit QA entitlement must not be mislabeled paid');
assert(source.includes("if(free.userId==='f42f9301-18e6-43a3-8531-32d371fd22c1')"),'Restrictive testing is for the exact configured QA identity');
assert(source.includes("tier=ceiling.ceiling;reason='Temporary restrictive Chart Studio QA ceiling'"),'Restrictive ceiling must take precedence over independently held passes');
assert(source.includes("allowed:['STANDARD',...(rank[tier]>=1?['ADVANCED']:[])"),'Allowed engines must be computed from authorized tier');
console.log('PASS Founder Chart Studio paid-cycle and chart-only QA boundaries: 13 checks; no fabricated Founder entitlement.');
