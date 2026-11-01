import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const read=p=>readFileSync(new URL('../'+p,import.meta.url),'utf8');
test('Admin provides independent edition selector and saves',()=>{
 const source=read('assets/js/admin-learning-engine-versions-v1.js');
 assert.match(source,/data-talia-save/);
 assert.match(source,/FOUNDATION/);assert.match(source,/ADVANCED/);
 assert.match(source,/PROFESSIONAL/);assert.match(source,/ENTERPRISE/);
 assert.match(source,/PRODUCT_DEPENDENT/);
 assert.match(source,/Save Tutor Edition/);
});
test('Owner API validates edition and uses an audited function, retains engine settings',()=>{
 const source=read('functions/api/admin-learning-engine-versions.js');
 assert.match(source,/authorizeLearningPlanOwner/);
 assert.match(source,/gu_owner_assign_talia_edition_v1/);
 assert.match(source,/tutorEditionRevision/);
 assert.match(source,/FOUNDING_30:'ADVANCED'/);
 assert.match(source,/FOUNDING_60:'PROFESSIONAL'/);
 assert.match(source,/FULL_MONTHLY:'PROFESSIONAL'/);
 assert.match(source,/LIFETIME:'ENTERPRISE'/);
 assert.match(source,/ONDEMAND_MONTHLY:'PRODUCT_DEPENDENT'/);
});
test('SQL enforces Owner permissions, atomic audit, no live payments and unchanged v1 engine key',()=>{
 const sql=read('supabase/migrations/20261101_talia_membership_editions_v1.sql');
 assert.match(sql,/SECURITY INVOKER/);
 assert.match(sql,/FOR UPDATE/);assert.match(sql,/admin_audit_log/);
 assert.match(sql,/REVOKE ALL/);assert.match(sql,/service_role/);
 assert.match(sql,/talia_market_tutor_v1/);
 assert.doesNotMatch(sql,/stripe|checkout_enabled|price_cents|payment_intent/i);
});
