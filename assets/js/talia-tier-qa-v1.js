/* Staff-only Tutor edition preview. A preview never changes member grants,
 * real Tutor API behavior, billing or an external model/provider configuration. */
(()=>{'use strict';
 const root=document.getElementById('talia-tier-qa');
 if(!root)return;
 const workspace=document.getElementById('tp-workspace');
 const status=root.querySelector('[data-tqa-status]');
 const results=root.querySelector('[data-tqa-results]');
 const buttons=[...root.querySelectorAll('[data-tqa-tier]')];
 let generation=0,pending=null,identity=null;
 const el=(tag,value,className)=>{
  const item=document.createElement(tag);
  item.textContent=String(value??'');
  if(className)item.className=className;
  return item;
 };
 const clear=message=>{
  generation++;pending?.abort();pending=null;
  results.replaceChildren();
  status.textContent=message;
  for(const b of buttons)b.setAttribute('aria-pressed','false');
 };
 const nested=(title,data)=>{
  const d=document.createElement('details');
  const summary=el('summary',title);
  const pre=el('pre',JSON.stringify(data,null,2),'tqa-json');
  d.append(summary,pre);
  return d;
 };
 const render=data=>{
  results.replaceChildren();
  const info=el('p','Source-only simulated specimen. No authenticated premium member runtime is activated.','tqa-boundary');
  results.append(info);
  for(const feature of data.features||[]){
   const card=document.createElement('section');
   card.className='tqa-feature';
   card.append(el('h4',feature.id+' — '+feature.title),nested('Inspect technical evidence and limitations',feature.result));
   results.append(card);
  }
 };
 async function select(tier){
  if(workspace?.hidden){clear('Owner or Administrator access required.');return;}
  const mine=++generation;pending?.abort();
  const controller=new AbortController();pending=controller;
  results.replaceChildren();
  status.textContent='Validating staff authorization and loading '+tier+' source evidence…';
  for(const b of buttons)b.setAttribute('aria-pressed',String(b.dataset.tqaTier===tier));
  try{
   if(!['FOUNDATION','ADVANCED','PROFESSIONAL','ENTERPRISE'].includes(tier))throw Error('Unsupported QA tier.');
   const client=await window.getSupabaseClient();
   const a=await client.auth.getSession(),u=await client.auth.getUser();
   const token=a?.data?.session?.access_token,uid=u?.data?.user?.id;
   if(!token||!uid||a.data.session.user?.id!==uid)throw Error('Staff session unavailable.');
   if(identity&&identity!==uid)throw Error('Account changed; reload before testing.');
   identity=uid;
   const r=await fetch('/api/talia-tier-qa-v1?tier='+encodeURIComponent(tier),{
    cache:'no-store',credentials:'same-origin',signal:controller.signal,
    headers:{authorization:'Bearer '+token,accept:'application/json'}
   });
   const data=await r.json().catch(()=>null);
   const after=await client.auth.getSession();
   if(mine!==generation||workspace?.hidden)return;
   if(!r.ok||data?.ok!==true||data.tier!==tier)throw Error('Tier QA unavailable or access denied.');
   if(after.data?.session?.user?.id!==uid||after.data?.session?.access_token!==token)throw Error('Session changed during tier QA.');
   if(data.premiumMemberFeatureReleased!==false||data.authenticMemberTierAccepted!==false||data.scope!=='STAFF_TEST_ONLY')
    throw Error('Untrusted QA capability response.');
   status.textContent=tier+' · '+data.featureCount+' source evidence positions · member release still OFF';
   render(data);
  }catch(e){
   if(mine!==generation||e?.name==='AbortError')return;
   clear(e?.message||'Tier preview unavailable.');
  }finally{if(pending===controller)pending=null;}
 }
 for(const b of buttons)b.addEventListener('click',()=>void select(b.dataset.tqaTier));
 document.addEventListener('visibilitychange',()=>{if(document.hidden)clear('Revalidate the authorized staff session before selecting a tier.');});
 window.addEventListener('pagehide',()=>clear('Staff QA closed.'),{once:true});
 window.addEventListener('focus',()=>{if(workspace?.hidden)clear('Staff access must be verified before selecting a tier.');});
 status.textContent='Select a tier after your authorized Owner/Admin session is verified.';
})();
