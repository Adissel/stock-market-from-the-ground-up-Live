/* Isolated James_Test payment-verification boundary.
 * Synthetic event only. No production credentials, Stripe writes, or database mutations.
 * A $0 verification-only LIVE checkout must be HMAC-verified and ACKNOWLEDGED
 * without acquiring a GU58/Founding/GU72 membership entitlement.
 */
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {webcrypto} from 'node:crypto';
if (!globalThis.crypto) globalThis.crypto = webcrypto;
const source=readFileSync(new URL('../functions/api/stripe-live-webhook-v01458.js',import.meta.url),'utf8');
const handler=await import('data:text/javascript;base64,'+Buffer.from(source).toString('base64'));
const guard=readFileSync(new URL('../scripts/_lib/live-build-guard.sh',import.meta.url),'utf8');
assert.match(guard,/GU72_ZERO_MONTHLY_FULFILLMENT_ENABLED GU72_ZERO_MONTHLY_QA_ENABLED/);
const sid='cs_live_jamesSyntheticZeroA123', uid='11111111-1111-4111-8111-111111111111';
const secret='whsec_synthetic123456', account='acct_synthetic12345';
const origin='https://synthetic.example';
const env={
 SUPABASE_URL:'https://aaaaaaaaaaaaaaaaaaaa.supabase.co',
 SUPABASE_SECRET_KEY:'sb_secret_synthetic',
 GU58_STRIPE_LIVE_SECRET_KEY:'sk_live_synthetic',
 GU58_STRIPE_LIVE_WEBHOOK_SECRET:secret,
 GU58_STRIPE_LIVE_ACCOUNT_ID:account,
 GU58_LIVE_WEBHOOK_ENABLED:'true',
 GU58_LIVE_FULFILLMENT_APPROVED:'true',
 GU58_LIVE_DB_CONTRACT_APPROVED:'true',
 GU71_ZERO_LIVE_QA_ENABLED:'true',
 GU72_ZERO_MONTHLY_QA_ENABLED:'false',
 GU72_ZERO_MONTHLY_FULFILLMENT_ENABLED:'false',
 GU72_ZERO_MONTHLY_STORE_OFFER_ENABLED:'false'
};
const session={
 id:sid,livemode:true,status:'complete',payment_status:'paid',
 mode:'payment',currency:'usd',amount_total:0,amount_subtotal:0,
 payment_intent:null,subscription:null,
 client_reference_id:uid,
 metadata:{smfgu_qa_account:'James_Test',smfgu_zero_live_qa:'true',
 smfgu_qa_scope:'checkout_webhook_no_entitlement'}
};
const event={
 id:'evt_jamesSyntheticZeroA123',livemode:true,
 type:'checkout.session.completed',created:Math.floor(Date.now()/1000),
 data:{object:{id:sid,metadata:session.metadata}}
};
const calls={providerReads:0,providerWrites:0,dbReads:0,dbWrites:0};
const originalFetch=globalThis.fetch;
globalThis.fetch=async(url,opts={})=>{
 const u=String(url),method=opts.method||'GET';
 if(u.includes('.supabase.co')){
  if(method==='GET')calls.dbReads++;else calls.dbWrites++;
  throw Error('This verification-only event must not touch the database: '+u);
 }
 if(method!=='GET'){calls.providerWrites++;throw Error('No provider writes allowed');}
 calls.providerReads++;
 if(u.endsWith('/v1/account'))return new Response(JSON.stringify({id:account}),{status:200});
 if(u.endsWith('/v1/checkout/sessions/'+sid))
  return new Response(JSON.stringify(session),{status:200});
 throw Error('Unexpected provider path '+u);
};
async function send(obj=event,valid=true,environment=env){
 const raw=JSON.stringify(obj),stamp=String(Math.floor(Date.now()/1000));
 const key=await crypto.subtle.importKey('raw',new TextEncoder().encode(secret),
  {name:'HMAC',hash:'SHA-256'},false,['sign']);
 const sig=Buffer.from(await crypto.subtle.sign('HMAC',key,
  new TextEncoder().encode(stamp+'.'+raw))).toString('hex');
 return handler.onRequestPost({env:environment,request:new Request(
  origin+'/api/stripe-live-webhook',{
   method:'POST',body:raw,headers:{
    'stripe-signature':'t='+stamp+',v1='+(valid?sig:'0'.repeat(64))
   }
  })});
}
try{
 let response=await send();
 assert.equal(response.status,200,'Signed zero-dollar verification event should ACK');
 assert.equal(await response.text(),'ignored','Verification event must not fulfill');
 assert.equal(calls.dbReads,0);
 assert.equal(calls.dbWrites,0);
 assert.equal(calls.providerWrites,0);
 response=await send();
 assert.equal(response.status,200,'Idempotent repeated verification event must ACK');
 assert.equal(await response.text(),'ignored');
 assert.equal(calls.dbWrites,0);
 response=await send(event,false);
 assert.equal(response.status,401,'Bad signature must fail');
 assert.equal(calls.dbWrites,0);
 const incompletePaidMetadata={...event,id:'evt_jamesSyntheticPartial123',
  data:{object:{id:sid,metadata:{...session.metadata,gu58_member:uid}}}};
 response=await send(incompletePaidMetadata);
 assert.equal(response.status,200,'Provider source-of-truth must ignore forged event object tags');
 assert.equal(await response.text(),'ignored');
 assert.equal(calls.dbWrites,0);
 response=await send(event,true,{...env,GU58_LIVE_WEBHOOK_ENABLED:'false'});
 assert.equal(response.status,503,'Disabled fulfillment gate must fail closed');
 assert.equal(calls.dbWrites,0);
 console.log('PASS: 5 signed/invalid/replay/configuration cases; zero charge and zero entitlement writes.');
}finally{
 globalThis.fetch=originalFetch;
}
