/* Market Tutor source version selects a frozen/public or current client; same protected backend. */
(()=>{'use strict';
async function mount(){
 let selected='TALIA_FREEZE_20261101';
 try{
  const sb=await window.getSupabaseClient(),{data}=await sb.auth.getSession();
  const r=await fetch('/api/member-learning-engine-versions',{cache:'no-store',headers:data?.session?.access_token?{authorization:'Bearer '+data.session.access_token}:{}});
  const j=await r.json();if(r.ok&&j?.ok){
   selected=j.versions.tutor;
   const edition=j.tutorEdition;
   if(edition){
    const label=document.getElementById('tutor-membership-edition');
    const display={FOUNDATION:'Foundation (Basic)',ADVANCED:'Advanced',
     PROFESSIONAL:'Professional',ENTERPRISE:'Enterprise',
     PRODUCT_DEPENDENT:'On-Demand entitlement',UNASSIGNED:'Unassigned'};
    if(label)label.textContent='Membership Tutor edition: '+(display[edition.configured]||'Unassigned')+
      (edition.effective===edition.configured?' · Source-grounded teaching available':
       ' · Enhanced features pending separate release and entitlement verification');
    document.body.dataset.taliaEdition=edition.effective;
   }
  }
 }catch{}
 const s=document.createElement('script');
 s.src=selected==='TALIA_CURRENT'?'/assets/js/market-tutor.js':'/assets/learning-versions/20261101-free-v33-v32/js/market-tutor.js';
 s.onerror=()=>{const note=document.getElementById('tutor-status');if(note)note.textContent='Tutor could not load. Please reload.'};
 document.head.appendChild(s);
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',mount,{once:true});else void mount();
})();
