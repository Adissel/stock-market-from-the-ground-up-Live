import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {onRequestGet,onRequestPost} from '../functions/api/lumen-bundle-live-checkout.js';
const root=new URL('../',import.meta.url),read=p=>readFileSync(new URL(p,root),'utf8');
const mockEnv={SUPABASE_URL:'https://oxihglyfgzywsupnyicb.supabase.co',
 SUPABASE_PUBLISHABLE_KEY:'sb_publishable_qa',SUPABASE_SECRET_KEY:'sb_secret_qa',
 GU58_STRIPE_LIVE_SECRET_KEY:'sk_live_qa_is_not_real',STRIPE_LIVE_ACCOUNT_ID:'acct_1OxhOiJL0O4GGVBH',
 GU_PAYMENT_LIVE_LAUNCH_APPROVED:'true',GU58_LIVE_WEBHOOK_ENABLED:'true',
 GU58_LIVE_FULFILLMENT_APPROVED:'true',GU58_LIVE_DB_CONTRACT_APPROVED:'true'};
const request=(body,origin='https://example.com')=>new Request('https://example.com/api/lumen-bundle-live-checkout',
 {method:'POST',headers:{origin,'content-type':'application/json',authorization:'Bearer mock'},body:JSON.stringify(body)});
test('unapproved LIVE Lumen purchases never invoke Supabase or Stripe',async()=>{
 const old=globalThis.fetch;let calls=0;globalThis.fetch=async()=>{calls++;throw Error('Unexpected provider I/O')};
 try{
  const r=await onRequestPost({request:request({sku:'SPARKS_25',requestId:'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa'}),env:mockEnv});
  assert.equal(r.status,423);assert.equal(calls,0);
  const cross=await onRequestPost({request:request({sku:'SPARKS_25',requestId:'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa'},'https://evil.example'),env:mockEnv});
  assert.equal(cross.status,403);assert.equal(calls,0);
 }finally{globalThis.fetch=old}
});
test('GET shows only bounded, unreleased first-party bundles; no Stripe creation',async()=>{
 const old=globalThis.fetch,paths=[];
 globalThis.fetch=async url=>{
  const path=new URL(String(url)).pathname;paths.push(path);
  if(path.includes('gu_lumen_live_offers_v1'))
   return new Response(JSON.stringify([25,55,90,125,275].map((qty,i)=>({
    sku:'SPARKS_'+qty,quantity:qty,amount_cents:[500,1000,1500,2000,4000][i],sale_ready:false
   }))),{status:200});
  if(path.includes('gu39_sandbox_settings'))return new Response(JSON.stringify([{enabled:false}]),{status:200});
  throw Error('Unexpected API request on GET');
 };
 try{
  const r=await onRequestGet({env:mockEnv});const data=await r.json();
  assert.equal(r.status,200);assert.equal(data.ok,true);
  assert.equal(data.checkoutEnabled,false);assert.equal(data.offers.length,5);
  assert(data.offers.every(x=>x.checkoutEnabled===false));
  assert.deepEqual(paths,['/rest/v1/gu_lumen_live_offers_v1']);
 }finally{globalThis.fetch=old}
});
test('source contract preserves five LIVE-only products, member-bound guard and real-wallet webhook',()=>{
 const source=read('functions/api/lumen-bundle-live-checkout.js'),
  migration=read('supabase/migrations/20261105021500_gu_lumen_live_checkout_v1.sql'),
  middleware=read('functions/_middleware.js'),
  client=read('assets/js/store-sparks-shop-v014296.js'),
  html=read('store-sparks.html'),
  webhook=read('functions/api/stripe-live-webhook-v01458.js');
 for(const qty of [25,55,90,125,275]){
  assert(source.includes('SPARKS_'+qty));
  assert(migration.includes("'SPARKS_"+qty+"'"));
 }
 assert(source.includes('gu_lumen_live_reserve_v1')&&source.includes('gu_lumen_live_bind_v1'));
 assert(source.includes('verifyStripe(c,offer)'));
 assert(source.includes("GU_LUMEN_BUNDLE_LIVE_CHECKOUT_ENABLED==='true'"));
 assert(migration.includes("current_user <> 'service_role'"));
 assert(migration.includes('sale_ready boolean NOT NULL DEFAULT false'));
 assert(migration.includes('REVOKE ALL ON FUNCTION public.gu_lumen_live_reserve_v1'));
 assert(middleware.includes("'/api/lumen-bundle-live-checkout'"));
 assert(webhook.includes('lumenLivePaymentProof')&&webhook.includes('gu_lumen_live_apply_v1'));
 assert(webhook.includes("type==='charge.refunded'")&&webhook.includes("type==='charge.dispute.created'"));
 assert(!source.includes('gu_lumen_bundle_test_apply_v1'));
 assert(html.includes('store-sparks-shop-v014296.js'));
 assert(client.includes('window.getSupabaseClient()'));
 assert(client.includes("target.origin!=='https://checkout.stripe.com'"));
});
