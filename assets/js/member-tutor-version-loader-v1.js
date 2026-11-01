/* Talia member-only edition loader. No client-provided membership claim or API key is trusted. */
(()=>{'use strict';
const blocked=message=>{
 const host=document.getElementById('tutor-status');
 if(host)host.textContent=message;
 const ask=document.getElementById('tutor-ask');
 if(ask)ask.disabled=true;
};
async function mount(){
 let selected='TALIA_FREEZE_20261101';
 let access=null;
 try{
  const sb=await window.getSupabaseClient();
  access=(await sb.auth.getSession()).data?.session?.access_token||null;
  if(!access){
   // The generic site auth guard also handles this page, but fail closed here
   // before either the frozen or current public JavaScript can be mounted.
   const next='/market-tutor.html'+location.search;
   location.replace('/signin.html?next='+encodeURIComponent(next));
   return;
  }
  const check=await fetch('/api/member-tool-access?tool=MARKET_TUTOR',{
   cache:'no-store',headers:{authorization:'Bearer '+access}});
  const entitlement=await check.json().catch(()=>null);
  if(!check.ok||entitlement?.ok!==true||
     (entitlement.authorized!==true&&entitlement.freeEligible!==true)){
   blocked('Talia Market Tutor requires an eligible active membership. Your account was not authorized.');
   return;
  }
  const r=await fetch('/api/member-learning-engine-versions',{
   cache:'no-store',headers:{authorization:'Bearer '+access}});
  const j=await r.json().catch(()=>null);
  if(r.ok&&j?.ok){
   selected=j.versions?.tutor;
   const edition=j.tutorEdition;
   if(edition){
    const label=document.getElementById('tutor-membership-edition');
    const display={FOUNDATION:'Talia Market Tutor v0.14.0.149 (Basic)',ADVANCED:'Advanced',
     PROFESSIONAL:'Professional',ENTERPRISE:'Enterprise',
     PRODUCT_DEPENDENT:'On-Demand entitlement',UNASSIGNED:'Unassigned'};
    if(label)label.textContent='Membership Tutor edition: '+(display[edition.configured]||'Unassigned')+
      (edition.effective===edition.configured?' · Source-grounded teaching available':
       ' · Enhanced features pending separate release and entitlement verification');
    document.body.dataset.taliaEdition=edition.effective;
   }
  }
 }catch{
  blocked('Member authorization could not be verified. No Tutor session was opened.');
  return;
 }
 const script=document.createElement('script');
 script.src=selected==='TALIA_CURRENT'?'/assets/js/market-tutor.js':
  '/assets/learning-versions/20261101-free-v33-v32/js/market-tutor.js';
 script.onerror=()=>blocked('Tutor could not load. Please reload.');
 document.head.appendChild(script);
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',mount,{once:true});
else void mount();
})();