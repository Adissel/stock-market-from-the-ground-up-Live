import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const read=p=>readFileSync(p,'utf8');
test('01 Teaching buttons have neutral labels',()=>{
 const c=read('assets/js/academy-guided-v1.js');
 for(const text of ['Explain This Concept','Teach This in More Depth'])assert.ok(c.includes(text));
 assert.doesNotMatch(c,/Explain This Concept [—-] Free|Teach This in More Depth [—-] Free/);
});
test('02 Founding prices and durations retain approved terms',()=>{
 const t=JSON.parse(read('data/founding600-terms-v014170.json'));
 for(const [code,price,days] of [['FOUNDING_14',2299,14],['FOUNDING_30',4999,30],['FOUNDING_60',5999,60]]){
  assert.equal(t.plans[code].recurringCents,price);
  assert.equal(t.plans[code].billingIntervalDays,days);
 }
});
test('03 Founding discounts retain approved percentages',()=>{
 const p=JSON.parse(read('data/founding600-terms-v014170.json')).plans;
 assert.deepEqual([p.FOUNDING_14.foundingDiscountBps,p.FOUNDING_30.foundingDiscountBps,p.FOUNDING_60.foundingDiscountBps],[500,1000,1500]);
});
test('04 No unverified founding checkout is offered',()=>{
 const t=JSON.parse(read('data/founding600-terms-v014170.json'));
 assert.equal(t.checkoutEnabled,false);
 const store=read('assets/js/store.js');
 assert.ok(store.includes('checkoutEnabled&&Number(p.priceCents)>0'));
});
test('05 Private tool catalog respects publication controls',()=>{
 const backend=read('functions/api/storefront-public-catalog.js');
 assert.ok(backend.includes('public_visible'));
 assert.ok(backend.includes('active'));
});
test('06 Unapproved monthly replay price is not advertised',()=>{
 const store=read('assets/js/store.js');
 const membership=read('membership.html');
 assert.doesNotMatch(store,/Historical Replay Learning — \$19\.99\/month/);
 assert.doesNotMatch(membership,/replay-only-membership/);
});
test('07 Studio lock describes access conditions in accessible name and hover',()=>{
 const studio=read('assets/js/crownlight-chart-tiers-v1.js');
 assert.ok(studio.includes("button.setAttribute('aria-label','Locked: '+names[tier]+'. '+requirements[tier]"));
 assert.ok(studio.includes("button.title=requirements[tier]"));
});
test('08 Wallet uses current member-visible Lumens branding',()=>{
 for(const path of ['store.html','dashboard.html','assets/js/crownlight-chart-tiers-v1.js']){
  assert.match(read(path),/Lumens/);
 }
});
test('09 Public chart identifies simulated data and never claims a live feed',()=>{
 const p=read('src/experience/HomeMarketTerminal.tsx');
 assert.ok(p.includes('Simulated market'));
 assert.ok(p.includes('Simulated candles'));
 assert.ok(p.includes('Simulated B'));
 assert.ok(p.includes('No live or licensed market feed'));
 assert.ok(p.includes('/practice-data-policy.html'));
 assert.doesNotMatch(p,/service_role|\bfetch\(/);
});
test('10 Dashboard chart displays real member statistics',()=>{
 const p=read('src/experience/MemberProgressVisual.tsx');
 for(const key of ['labs-completed','labs-in-progress','labs-not-started','toLocaleString'])assert.ok(p.includes(key));
 assert.doesNotMatch(p,/\bfetch\(/);
});
