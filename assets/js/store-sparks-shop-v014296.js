/* Member Lumen bundle storefront: all checkout authority stays server-side. */
(async function(){
 const host=document.getElementById('spark-shop-packages'),status=document.getElementById('spark-shop-status');
 if(!host||!status)return;
 const el=(tag,value,cls)=>{const n=document.createElement(tag);if(value!==null)n.textContent=value;if(cls)n.className=cls;return n};
 const money=c=>(c/100).toLocaleString('en-US',{style:'currency',currency:'USD'});
 host.replaceChildren();
 try{
  const response=await fetch('/api/lumen-bundle-live-checkout',{cache:'no-store'});
  if(!response.ok)throw Error('Purchase catalog unavailable');
  const data=await response.json();
  if(data.ok!==true||!Array.isArray(data.offers))throw Error('Purchase catalog not verified');
  const active=data.checkoutEnabled===true;
  for(const offer of data.offers){
   if(!/^SPARKS_(25|55|90|125|275)$/.test(offer.sku)||
      !Number.isInteger(offer.quantity)||!Number.isInteger(offer.amountCents))continue;
   const ready=active&&offer.checkoutEnabled===true;
   const card=el('article',null,'spark-card');
   card.append(el('span',ready?'LIVE bundle':'Not yet released','spark-tag'),
    el('h2','Crownlight Lumens — '+offer.quantity+' Credits'),
    el('p','Non-expiring purchased Lumens'),
    el('div',money(offer.amountCents),'spark-cost'));
   const button=el('button',ready?'Buy '+offer.quantity+' Lumens':'Purchase not yet available','btn');
   button.type='button';button.disabled=!ready;
   button.setAttribute('aria-label','Buy '+offer.quantity+' Lumens for '+money(offer.amountCents));
   card.append(button,el('p',ready?
    'Secured by Stripe; credits post only after signed payment confirmation.':
    'Availability has not been verified. This card will not start a charge.','small'));
   host.append(card);
   if(!ready)continue;
   button.addEventListener('click',async()=>{
    if(!window.confirm('Buy '+offer.quantity+' non-expiring Crownlight Lumens for '+money(offer.amountCents)+'? Credits are non-cash and cannot be used as trading funds.'))return;
    button.disabled=true;status.textContent='Checking sign-in and preparing verified LIVE checkout…';
    try{
     const sb=await window.getSupabaseClient(),session=(await sb.auth.getSession()).data?.session;
     if(!session?.access_token)throw Error('Sign in before purchasing Lumens.');
     const res=await fetch('/api/lumen-bundle-live-checkout',{
      method:'POST',headers:{'content-type':'application/json',authorization:'Bearer '+session.access_token},
      body:JSON.stringify({sku:offer.sku,requestId:crypto.randomUUID()}),cache:'no-store'
     });
     const out=await res.json().catch(()=>null);
     if(!res.ok||out?.ok!==true||!out.url)throw Error(out?.error||'LIVE purchase is unavailable.');
     const target=new URL(out.url);
     if(target.origin!=='https://checkout.stripe.com')throw Error('Checkout destination failed verification.');
     window.location.assign(target.href);
    }catch(error){status.textContent=String(error?.message||'Checkout could not be verified.');button.disabled=false}
   });
  }
  status.textContent=host.children.length?
   active?'Only server-confirmed LIVE bundles offer checkout; sign-in and terms apply.':
   'Bundles are listed for planning; new cash purchases remain unavailable until verified.':
   'No member Lumen packages are currently approved.';
 }catch{
  status.textContent='Could not verify Lumen purchase availability. No payment was initiated.';
 }
})();