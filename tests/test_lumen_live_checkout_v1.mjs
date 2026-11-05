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


test('signed-in LIVE checkout reserves and binds an unpaid Stripe Session without issuing wallet credits',async()=>{
 const old=globalThis.fetch,member='aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa',
  intent='bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb',rid='cccccccc-cccc-4ccc-8ccc-cccccccccccc',
  product='prod_VZOxFX6Ng4rSM2',priceId='price_1UYG9YJL0O4GGVBHyNaAzubj';
 const calls=[],env={...mockEnv,GU_LUMEN_BUNDLE_LIVE_CHECKOUT_ENABLED:'true'};
 const reply=(data,status=200)=>new Response(JSON.stringify(data),{status,headers:{'content-type':'application/json'}});
 const packs=[25,55,90,125,275].map((qty,i)=>({sku:'SPARKS_'+qty,quantity:qty,
  amount_cents:[500,1000,1500,2000,4000][i],sale_ready:true,
  stripe_product_id:i===0?product:'prod_mock_'+i,stripe_price_id:i===0?priceId:'price_mock_'+i}));
 globalThis.fetch=async(input,opts={})=>{
  const u=new URL(String(input)),path=u.pathname;calls.push({path,method:opts.method||'GET'});
  if(path==='/auth/v1/user')return reply({id:member});
  if(path==='/rest/v1/profiles')return reply([{account_kind:'member',deleted_at:null}]);
  if(path==='/rest/v1/admin_user_flags'||path==='/rest/v1/admin_user_roles')return reply([]);
  if(path==='/rest/v1/account_private_identity')return reply([{age_eligible:true,date_of_birth:'1990-01-01'}]);
  if(path==='/rest/v1/gu39_sandbox_settings')return reply([{enabled:false}]);
  if(path==='/rest/v1/gu_lumen_live_offers_v1')return reply(packs);
  if(u.host==='api.stripe.com'&&path==='/v1/account')return reply({id:env.STRIPE_LIVE_ACCOUNT_ID});
  if(u.host==='api.stripe.com'&&path==='/v1/prices/'+priceId)return reply({id:priceId,product,livemode:true,type:'one_time',
   recurring:null,active:true,unit_amount:500,currency:'usd'});
  if(u.host==='api.stripe.com'&&path==='/v1/products/'+product)return reply({id:product,active:true,livemode:true,
   metadata:{site_sku:'SPARKS_25',quantity:'25',nonexpiring:'true',site_checkout_enabled:'true',launch_state:'founding_beta_live'}});
  if(path==='/rest/v1/rpc/gu_lumen_live_reserve_v1'){
   assert.equal(opts.method,'POST');const args=JSON.parse(opts.body);
   assert.deepEqual(args,{p_user:member,p_sku:'SPARKS_25',p_request:rid});
   return reply({ok:true,id:intent,priceId,productId:product,quantity:25,amountCents:500,existing:false,status:'prepared'});
  }
  if(u.host==='api.stripe.com'&&path==='/v1/checkout/sessions'){
   assert.equal(opts.method,'POST');
   const form=new URLSearchParams(opts.body);
   assert.equal(form.get('line_items[0][price]'),priceId);
   assert.equal(form.get('metadata[gu_lumen_live_id]'),intent);
   assert.equal(form.get('metadata[gu_lumen_live_user]'),member);
   assert.equal(form.get('metadata[gu_lumen_live_sku]'),'SPARKS_25');
   assert.equal(form.get('payment_intent_data[metadata][gu_lumen_live_id]'),intent);
   assert.equal(form.get('payment_intent_data[metadata][gu_lumen_live_user]'),member);
   assert.equal(form.get('payment_intent_data[metadata][gu_lumen_live_sku]'),'SPARKS_25');
   assert.equal(opts.headers['Idempotency-Key'],'gu-lumen-live-'+intent);
   return reply({id:'cs_live_example123456',livemode:true,mode:'payment',status:'open',payment_status:'unpaid',
    amount_subtotal:500,currency:'usd',client_reference_id:intent,
    metadata:{gu_lumen_live_id:intent,gu_lumen_live_user:member,gu_lumen_live_sku:'SPARKS_25'},
    url:'https://checkout.stripe.com/c/pay/cs_live_example123456'});
  }
  if(path==='/rest/v1/rpc/gu_lumen_live_bind_v1'){
   assert.deepEqual(JSON.parse(opts.body),{p_id:intent,p_user:member,p_session:'cs_live_example123456'});
   return reply({ok:true});
  }
  throw Error('Unexpected LIVE provider path '+u.toString());
 };
 try{
  const r=await onRequestPost({request:request({sku:'SPARKS_25',requestId:rid}),env});
  assert.equal(r.status,200);const data=await r.json();
  assert.equal(data.ok,true);assert.equal(data.amountCents,500);assert.equal(data.quantity,25);
  assert(data.url.startsWith('https://checkout.stripe.com/'));
  assert.equal(calls.filter(x=>x.path==='/v1/checkout/sessions').length,1);
  assert.equal(calls.filter(x=>x.path==='/rest/v1/rpc/gu_lumen_live_reserve_v1').length,1);
  assert.equal(calls.filter(x=>x.path==='/rest/v1/rpc/gu_lumen_live_bind_v1').length,1);
  assert.equal(calls.some(x=>x.path.includes('gu_lumen_live_apply_v1')),false,'Only verified webhook may credit real wallet');
 }finally{globalThis.fetch=old}
});
