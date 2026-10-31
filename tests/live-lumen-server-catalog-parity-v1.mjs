/* Live, noncharging public catalog parity against Supabase-backed Cloudflare.
 * No JWT, passwords, Lumen grants, transfers, grading or writes.
 */
import assert from 'node:assert/strict';
const origin=process.env.SMFGU_QA_ORIGIN||'https://stock-market-from-the-ground-up-d1r.pages.dev';
const r=await fetch(origin+'/api/learning-reward-preview',
 {cache:'no-store',signal:AbortSignal.timeout(20000)});
const d=await r.json().catch(()=>({}));
assert.equal(r.status,200,'Server catalog API must be deployed and healthy');
assert.equal(d.ok,true);
assert.equal(d.catalogSource,'server_authoritative_supabase');
assert.equal(d.revision,'lumen-v1.0');
assert.equal(d.itemCount,429);
assert.equal(d.lab,2);
assert.equal(Object.keys(d.bootcamps||{}).length,10);
assert.deepEqual(d.bootcamps,{
 truth5:15,watchlist7:25,scanners10:35,foundations30:70,
 charts45:95,risk60:130,practicum90:180,
 tape10:35,indicators10:35,filings7:25
});
assert.equal(d.enabled,false,'No learning rewards authorized until protected grading accepted');
assert.equal(d.status,'planned_not_yet_earnable');
assert.match(d.notice,/no learning-completion lumens can currently be earned/i);
const anonymous=await fetch(origin+'/api/member-lumen-gifts',
 {cache:'no-store',signal:AbortSignal.timeout(20000)});
assert([401,403].includes(anonymous.status),'Anonymous gifting API must reject access');
console.log('PASS: 419 canonical Labs + 10 Boot Camps, server-owned Lumen figures, unpublished earning, anonymous gifts denied.');
console.log('No paid charge, graded outcome, wallet credit, gift or other mutation occurred.');
