/* The 600-seat commercial limit and old F600 identifiers are internal.
 * Member product labeling uses Founding Members and existing Commons.
 * This source-contract test never alters subscriptions or payments.
 */
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const read=path=>readFileSync(path,'utf8');
const pages=['founding600.html','store.html','market-commons.html','founders-commons.html',
 'dashboard.html','founder-learning-studio.html'];
for(const path of pages){
 const source=read(path);
 assert.doesNotMatch(source,/Founding\s+600|The\s+Founding\s+600/i,
  'Internal cohort name must not appear to members on '+path);
 assert.doesNotMatch(source,/\b600\s+(?:places|founding places|founder seats|shared places)\b/i,
  'Internal total cap must not be shown on '+path);
}
const store=read('store.html');
const inventory=read('assets/js/store-inventory-v014174.js');
for(const path of ['assets/js/store.js','assets/js/store-inventory-ui-v014174.js',
 'assets/js/store-product-detail-v01484.js']){
 assert.doesNotMatch(read(path),/Founding 600 member (?:evaluation|testing)/,
  'Store member-facing beta copy must use the approved Founding Members name: '+path);
}
const checkoutPage=read('founding600.html');
const commons=read('founders-commons.html');
const dashboard=read('dashboard.html');
const accountAdmin=read('assets/js/account-management-entitlements-v01478.js');
const build=read('scripts/build-pages.sh');
assert(!build.includes("'capacity':terms['capacity']"), 'Public Pages projection must not disclose the internal shared 600-seat limit');
assert(build.includes("public={'plans':"), 'Public founding projection must include only approved presentation fields');
assert(!read('assets/js/store.js').includes('terms.capacity'), 'Store must not refer to a private-only seat count');
assert(!read('functions/api/founding600-checkout.js').includes('capacity:600'), 'Public checkout status must not disclose the seat limit');
assert(store.includes('Founding Members'));
assert(inventory.includes('Founding Members — Standard 30 Days'));
assert(inventory.includes('Founding Members — Extended 60 Days'));
assert(checkoutPage.includes('Founding Members | The Stock Market'));
assert(commons.includes('FOUNDING MEMBERS'));
assert(dashboard.includes('href="founders-commons.html"'));
assert(!dashboard.includes('id="member-beta-workspace"'));
assert(accountAdmin.includes('Beta Testing Access'),'Temporary nonpaid grants are NOT founding memberships');
assert(accountAdmin.includes('F600_GUIDED_QA_V1:'),'Internal QA audit marker must remain compatible with current RPC');
const forward=read('supabase/migrations/20261026_founder_members_public_copy_alignment.sql');
const rollback=read('supabase/rollbacks/20261026_founder_members_public_copy_alignment_ROLLBACK.sql');
assert(forward.includes('Founding Members Standard'));
assert(forward.includes('Founding Members Extended'));
assert(forward.includes('Founding Members — Standard 30 Days'));
assert(forward.includes('Founding Members — Extended 60 Days'));
assert.match(forward,/BEGIN;[\s\S]*COMMIT;/);
assert(forward.includes('FOR UPDATE'));
assert(forward.includes('admin_audit_log'));
assert(forward.includes('enrollment_enabled=false AND billing_enabled=false AND fulfillment_enabled=false'));
assert(forward.includes('price_cents<>4999'));
assert(forward.includes('price_cents<>5999'));
assert(forward.includes('purchase_discount_bps<>1000'));
assert(forward.includes('purchase_discount_bps<>1500'));
assert(rollback.includes('Controlled rollback'));
for(const p of pages)assert(!read(p).includes('member-beta-workspace.js'));
const internal=JSON.parse(read('data/founding600-terms-v014170.json'));
assert.equal(internal.capacity,600,'Founder seat limit unchanged internally');
assert.deepEqual([internal.plans.FOUNDING_30.recurringCents,internal.plans.FOUNDING_60.recurringCents],[4999,5999]);
assert.deepEqual([internal.plans.FOUNDING_30.foundingDiscountBps,internal.plans.FOUNDING_60.foundingDiscountBps],[1000,1500]);
const publicMembershipPage=read('membership.html');
assert.doesNotMatch(publicMembershipPage,/replay-only-membership|Historical Replay Learning — Monthly/,
 'Unpublished standalone memberships must not appear in the public offer comparison');
const membershipMatrix=read('assets/js/membership-platform.js');
assert(membershipMatrix.includes("['FREE','FOUNDING_14','FOUNDING_30','FOUNDING_60']"),
 'The public matrix must show only approved membership tiers');
assert(membershipMatrix.includes("See plan access details"),
 'Missing legacy plan-tool associations cannot be shown as negative founding entitlements');
assert(membershipMatrix.includes('See founding terms'),
 'Founding book companion benefits cannot be inferred from the generic matrix');
assert.equal(internal.plans.FOUNDING_14.recurringCents,2299);
assert.equal(internal.plans.FOUNDING_14.foundingDiscountBps,500);
console.log('PASS Founder UI: Founding Members brand, single existing Commons, protected legacy QA marker, frozen internal 600 cap and $49.99/$59.99 10/15% commercial terms.');
