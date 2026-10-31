/* Authorized noncommercial QA on live Supabase Book Key anti-abuse.
 * Operates only on known QA user. Exactly six guaranteed-nonexistent
 * synthetic code attempts, verified absent from catalog before script use.
 * No customer codes, valid redemptions, payments, entitlements or wallets.
 * After test the QA account will have a one-hour Book Key attempt cooldown.
 */
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const src=readFileSync('config.js','utf8');
const supabase=src.match(/SUPABASE_URL:\s*'([^']+)'/)?.[1];
const key=src.match(/SUPABASE_ANON_KEY:\s*'([^']+)'/)?.[1];
const email=process.env.LAB_QA_EMAIL,password=process.env.LAB_QA_PASSWORD;
if(!supabase||!key||!email||!password)throw Error('BLOCKED: genuine signed-in QA credentials unavailable');
const req=async(path,opts={})=>{
 const r=await fetch(path,{...opts,cache:'no-store',signal:AbortSignal.timeout(30000)});
 return {status:r.status,body:await r.json().catch(()=>({}))};
};
const go=await req(supabase+'/auth/v1/token?grant_type=password',{
 method:'POST',headers:{apikey:key,'content-type':'application/json'},
 body:JSON.stringify({email,password})
});
if(go.status!==200||!go.body.access_token||!go.body.user?.id)
 throw Error('BLOCKED: real Supabase QA sign-in not accepted; no CAPTCHA bypass allowed');
assert.equal(go.body.user.id,'f42f9301-18e6-43a3-8531-32d371fd22c1','Not the frozen QA account');
const verify=await req(supabase+'/auth/v1/user',{headers:{apikey:key,authorization:'Bearer '+go.body.access_token}});
assert.equal(verify.status,200);
assert.equal(verify.body.id,go.body.user.id);
const guestHeaders={apikey:key,'content-type':'application/json'};
for(const endpoint of ['prepare_book_key_claim','username_is_available','email_is_available']){
 const guest=await req(supabase+'/rest/v1/rpc/'+endpoint,{
  method:'POST',headers:guestHeaders,body:JSON.stringify({candidate:'SMFGU-QA-UNREGISTERED-NAME-20261031'})
 });
 assert([401,403,404].includes(guest.status),
  'Public restricted RPC must refuse anonymous access to '+endpoint+' HTTP='+guest.status);
}
const direct=await req(supabase+'/rest/v1/book_key_member_attempts_v1?select=attempts&limit=1',{
 headers:{apikey:key,authorization:'Bearer '+go.body.access_token}
});
assert([401,403,404].includes(direct.status),'Member cannot read the private Book Key limit ledger');
const candidate='SMFGU-QA-INVALID-CODE-20261031-NO-REDEEM';
let invalid=0,throttled=0;
for(let i=1;i<=6;i++){
 const reply=await req(supabase+'/rest/v1/rpc/redeem_book_key',{
  method:'POST',
  headers:{apikey:key,authorization:'Bearer '+go.body.access_token,'content-type':'application/json'},
  body:JSON.stringify({candidate})
 });
 assert.equal(reply.status,200,'QA Book Key RPC HTTP '+i);
 if(i<=5){assert.equal(reply.body.status,'invalid','Invalid QA code must never grant an entitlement');invalid++;}
 else{assert.equal(reply.body.status,'rate_limited','Sixth genuine authenticated attempt must be blocked');throttled++;}
}
assert.equal(invalid,5);assert.equal(throttled,1);
console.log('PASS Book Key security: anonymous preclaim/identity RPC denied; authenticated private throttle table denied; real QA five invalid attempts then sixth rate_limited; zero valid redemptions, charges or rewards.');
console.log('RESULT '+JSON.stringify({kind:'GenuineMemberBookKeyAbuseQA',validUsers:1,invalid:5,rateLimited:1,
 privateLedgerDenied:true,anonymousLookupDenied:3,validClaims:0,entitlementsChanged:0,liveCharges:0}));
