/* Noncommercial read-only QA: PostgreSQL helper EXECUTE and protected ledger
 * negatives using a real designated existing GoTrue member and the anon role.
 * This never redeems a valid key, changes an entitlement, or submits a payment.
 */
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const config=readFileSync('config.js','utf8');
const base=config.match(/SUPABASE_URL:\s*'([^']+)'/)?.[1];
const publicKey=config.match(/SUPABASE_ANON_KEY:\s*'([^']+)'/)?.[1];
const email=process.env.LAB_QA_EMAIL||'';
const password=process.env.LAB_QA_PASSWORD||'';
const designated='f42f9301-18e6-43a3-8531-32d371fd22c1';
assert(base&&/^https:\/\/.+\.supabase\.co$/.test(base),'Valid public Supabase URL required');
assert(publicKey,'Public Supabase key required');
if(!email||!password)throw Error('BLOCKED: preapproved genuine noncommercial QA secret missing');
async function request(url,opts={}){
 const r=await fetch(url,{...opts,cache:'no-store',signal:AbortSignal.timeout(25000)});
 // Deliberately never read potentially confidential result bodies for negative RPCs.
 await r.body?.cancel().catch(()=>{});
 return r.status;
}
const signin=await fetch(base+'/auth/v1/token?grant_type=password',{
 method:'POST',headers:{apikey:publicKey,'content-type':'application/json'},
 body:JSON.stringify({email,password}),signal:AbortSignal.timeout(25000)
});
if(!signin.ok)throw Error('BLOCKED: preapproved existing GoTrue QA sign-in denied HTTP '+signin.status);
const body=await signin.json();
assert.equal(body.user?.id,designated,'Unexpected account: do not use a customer session');
assert(typeof body.access_token==='string'&&body.access_token.length>30,'Missing genuine token');
const roles=[
 {name:'anon',headers:{apikey:publicKey,'content-type':'application/json'}},
 {name:'authenticated',headers:{apikey:publicKey,authorization:'Bearer '+body.access_token,'content-type':'application/json'}}
];
const fake='SMFGU-ROLE-DENIAL-SYNTHETIC-20261031';
const forbidden=[
 {name:'apply_book_key_for_user',payload:{target_user:designated,target_book_key_id:0}},
 {name:'prepare_book_key_claim',payload:{candidate:fake}},
 {name:'email_is_available',payload:{candidate:fake}},
 {name:'username_is_available',payload:{candidate:fake}}
];
let denied=0;
for(const role of roles){
 for(const fn of forbidden){
  const status=await request(base+'/rest/v1/rpc/'+fn.name,{
   method:'POST',headers:role.headers,body:JSON.stringify(fn.payload)
  });
  assert([401,403,404].includes(status),
   'SECURITY REGRESSION: '+role.name+' may invoke '+fn.name+' HTTP '+status);
  denied++;
 }
 const status=await request(base+'/rest/v1/book_key_member_attempts_v1?select=attempts&limit=1',{
  headers:role.headers
 });
 assert([401,403,404].includes(status),
  'SECURITY REGRESSION: '+role.name+' can read protected attempt ledger HTTP '+status);
 denied++;
}
const anonRedeem=await request(base+'/rest/v1/rpc/redeem_book_key',{
 method:'POST',headers:roles[0].headers,body:JSON.stringify({candidate:fake})
});
assert([401,403,404].includes(anonRedeem),
 'SECURITY REGRESSION: anonymous user can call member redemption RPC HTTP '+anonRedeem);
denied++;
console.log('PASS genuine designated GoTrue QA role-bound privilege negatives: '+denied+
 ' denied anon/authenticated helper RPC and private-ledger probes; no real code, entitlement or payment write.');
console.log('RESULT '+JSON.stringify({kind:'LiveBookKeyRoleBoundaryQA',distinctRoles:2,denied,
 actualQAAccount:true,validCodeRedeemed:false,memberAttemptCounterModified:false,
 entitlementsChanged:false,livePayments:false}));
