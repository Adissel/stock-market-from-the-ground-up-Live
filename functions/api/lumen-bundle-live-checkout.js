/* LIVE Lumen cash bundles: new paid credits reach ONLY the signed Stripe webhook
 * and service-only real wallet ledger. Never use TEST shadow-credit fulfillment. */
import {config,user,stripe,db,reply,uuid} from '../_lib/book-stripe-live-v1.js';
const SKUS=new Set(['SPARKS_25','SPARKS_55','SPARKS_90','SPARKS_125','SPARKS_275']);
const problem=(message,status=503)=>Object.assign(Error(message),{status});
const enabled=e=>e.GU_LUMEN_BUNDLE_LIVE_CHECKOUT_ENABLED==='true'&&
 e.GU_PAYMENT_LIVE_LAUNCH_APPROVED==='true'&&e.GU58_LIVE_WEBHOOK_ENABLED==='true'&&
 e.GU58_LIVE_FULFILLMENT_APPROVED==='true'&&e.GU58_LIVE_DB_CONTRACT_APPROVED==='true';
const serviceHeaders=c=>({apikey:c.service,...(c.service.startsWith('eyJ')?{authorization:'Bearer '+c.service}:{})});
async function rows(c,path){
 const r=await fetch(c.base+'/rest/v1/'+path,{headers:serviceHeaders(c),cache:'no-store'});
 if(!r.ok)throw problem('Lumen catalog is unavailable');
 const data=await r.json().catch(()=>null);
 if(!Array.isArray(data))throw problem('Lumen catalog did not return verified rows');
 return data;
}
async function offers(c){
 const data=await rows(c,'gu_lumen_live_offers_v1?select=sku,quantity,amount_cents,stripe_product_id,stripe_price_id,sale_ready&order=quantity.asc&limit=10');
 if(data.length!==5||new Set(data.map(x=>x.sku)).size!==5||
    data.some(x=>!SKUS.has(x.sku)||!Number.isInteger(x.quantity)||!Number.isInteger(x.amount_cents)))
  throw problem('The LIVE Lumen catalog is incomplete');
 return data;
}
async function modeLive(c){
 const x=await rows(c,'gu39_sandbox_settings?select=enabled&id=eq.true&limit=1');
 return x.length===1&&x[0].enabled===false;
}
async function verifyStripe(c,offer){
 const [account,price,product]=await Promise.all([
  stripe(c,'account'),stripe(c,'prices/'+encodeURIComponent(offer.stripe_price_id)),
  stripe(c,'products/'+encodeURIComponent(offer.stripe_product_id))
 ]);
 if(account.id!==c.account||price.id!==offer.stripe_price_id||
   price.product!==offer.stripe_product_id||price.livemode!==true||price.type!=='one_time'||
   price.recurring!==null||price.active!==true||price.unit_amount!==offer.amount_cents||
   price.currency!=='usd'||product.id!==offer.stripe_product_id||
   product.livemode!==true||product.active!==true||
   product.metadata?.site_sku!==offer.sku||
   product.metadata?.quantity!==String(offer.quantity)||
   product.metadata?.nonexpiring!=='true'||
   product.metadata?.site_checkout_enabled!=='true'||
   product.metadata?.launch_state!=='founding_beta_live')
  throw problem('LIVE Stripe product, price, or authorized merchant mismatch');
}
export async function onRequestGet({env}){
 try{
  const c=config(env),pack=await offers(c),allowed=enabled(env)&&await modeLive(c);
  return reply({ok:true,livePayments:true,checkoutEnabled:allowed&&pack.some(x=>x.sale_ready),
   offers:pack.map(x=>({sku:x.sku,quantity:x.quantity,amountCents:x.amount_cents,checkoutEnabled:allowed&&x.sale_ready})),
   notice:'Only a signed, verified LIVE Stripe payment may add non-expiring purchased Lumens to the member wallet.'});
 }catch{return reply({ok:true,livePayments:false,checkoutEnabled:false,offers:[],
   notice:'LIVE Lumen purchase availability could not be verified.'});}
}
export async function onRequestPost({request,env}){
 try{
  if(request.headers.get('origin')!==new URL(request.url).origin)throw problem('Same-origin checkout required',403);
  if(!enabled(env))throw problem('LIVE Lumen purchases are not released',423);
  const declared=request.headers.get('content-length');
  if(declared!==null&&(!/^[0-9]+$/.test(declared)||Number(declared)>768))throw problem('Payload too large',413);
  const raw=await request.text();
  if(raw.length>768)throw problem('Payload too large',413);
  let data;try{data=JSON.parse(raw)}catch{throw problem('Invalid request JSON',400)}
  if(!data||Array.isArray(data)||Object.keys(data).sort().join(',')!=='requestId,sku'||
     !SKUS.has(data.sku)||!uuid(data.requestId))throw problem('Invalid bundle request',400);
  const c=config(env),member=await user(c,request);
  if(!await modeLive(c))throw problem('TEST mode is enabled or unavailable',423);
  const offer=(await offers(c)).find(x=>x.sku===data.sku&&x.sale_ready===true);
  if(!offer)throw problem('Bundle has not been released',423);
  await verifyStripe(c,offer);
  const reserve=await db(c,'gu_lumen_live_reserve_v1',{p_user:member.id,p_sku:offer.sku,p_request:data.requestId});
  if(reserve?.ok!==true||!uuid(reserve.id)||reserve.priceId!==offer.stripe_price_id||
      reserve.productId!==offer.stripe_product_id||reserve.quantity!==offer.quantity||
      reserve.amountCents!==offer.amount_cents)throw problem('Verified purchase reservation rejected');
  if(reserve.existing&&reserve.status==='bound'&&/^cs_live_[A-Za-z0-9_]+$/.test(reserve.session||'')){
   const existing=await stripe(c,'checkout/sessions/'+encodeURIComponent(reserve.session));
   if(existing.id===reserve.session&&existing.livemode===true&&existing.mode==='payment'&&
      existing.status==='open'&&existing.amount_subtotal===offer.amount_cents&&
      existing.client_reference_id===reserve.id&&
      existing.metadata?.gu_lumen_live_id===reserve.id&&
      existing.metadata?.gu_lumen_live_user===member.id&&
      existing.metadata?.gu_lumen_live_sku===offer.sku&&
      existing.url?.startsWith('https://checkout.stripe.com/'))
    return reply({ok:true,url:existing.url,restored:true});
  }
  if(reserve.status!=='prepared')throw problem('Earlier checkout must be reconciled first',409);
  const body=new URLSearchParams();
  body.set('mode','payment');body.set('line_items[0][price]',offer.stripe_price_id);
  body.set('line_items[0][quantity]','1');body.set('client_reference_id',reserve.id);
  for(const [k,v] of Object.entries({gu_lumen_live_id:reserve.id,gu_lumen_live_user:member.id,gu_lumen_live_sku:offer.sku})){
   body.set('metadata['+k+']',v);body.set('payment_intent_data[metadata]['+k+']',v);
  }
  body.set('success_url',new URL('/store-sparks.html?lumen_purchase=processing',request.url).href);
  body.set('cancel_url',new URL('/store-sparks.html?lumen_purchase=cancelled',request.url).href);
  const checkout=await stripe(c,'checkout/sessions',{method:'POST',
   headers:{'content-type':'application/x-www-form-urlencoded','Idempotency-Key':'gu-lumen-live-'+reserve.id},
   body:body.toString()});
  if(!/^cs_live_[A-Za-z0-9_]+$/.test(checkout.id||'')||checkout.livemode!==true||
     checkout.mode!=='payment'||checkout.status!=='open'||checkout.payment_status!=='unpaid'||
     checkout.currency!=='usd'||checkout.amount_subtotal!==offer.amount_cents||
     checkout.client_reference_id!==reserve.id||
     checkout.metadata?.gu_lumen_live_id!==reserve.id||
     checkout.metadata?.gu_lumen_live_user!==member.id||
     checkout.metadata?.gu_lumen_live_sku!==offer.sku||
     !checkout.url?.startsWith('https://checkout.stripe.com/'))
    throw problem('LIVE Stripe Checkout session failed strict verification');
  const bind=await db(c,'gu_lumen_live_bind_v1',{p_id:reserve.id,p_user:member.id,p_session:checkout.id});
  if(bind?.ok!==true)throw problem('Paid checkout reservation was not bound');
  return reply({ok:true,url:checkout.url,quantity:offer.quantity,amountCents:offer.amount_cents,
   notice:'Purchased Lumens are credited only after a signed, verified LIVE Stripe payment.'});
 }catch(e){
  const status=[400,401,403,409,413,423].includes(e?.status)?e.status:503;
  return reply({ok:false,error:status===401?'Sign in to purchase Lumens.':
   status===403?'This purchase is not authorized.':status===400?'Invalid bundle request.':
   status===409?'Earlier purchase requires reconciliation.':status===423?'LIVE Lumen bundles are not released.':
   'LIVE Lumen bundle checkout is temporarily unavailable.'},status);
 }
}
