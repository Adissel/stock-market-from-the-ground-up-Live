/* Authentic member-specific Talia premium BETA panel. Reuses the existing
 * authenticated source-only Tutor endpoint; never talks to a model provider,
 * persists member grades or trusts client-supplied tier or learning evidence.
 */
(()=>{'use strict';
 const root=document.getElementById('talia-member-beta');
 if(!root)return;
 const status=root.querySelector('[data-tmb-status]');
 const features=root.querySelector('[data-tmb-features]');
 const answer=root.querySelector('[data-tmb-answer]');
 const personalize=root.querySelector('[data-tmb-personalize]');
 const topic=root.querySelector('[data-tmb-topic]');
 const reasoning=root.querySelector('[data-tmb-reasoning]');
 const actions=[...root.querySelectorAll('[data-tmb-tier]')];
 let serial=0,controller=null,identity=null,booted=false,activeTier='FOUNDATION';
 const node=(tag,text,cls)=>{const n=document.createElement(tag);n.textContent=String(text??'');if(cls)n.className=cls;return n};
 const stop=()=>{serial++;controller?.abort();controller=null;root.hidden=true;features.replaceChildren();
  answer.replaceChildren();status.textContent='Verifying your private Tutor beta access.';for(const b of actions)b.setAttribute('aria-pressed','false');};
 async function auth(){
  const client=await window.getSupabaseClient();
  const [s,u]=await Promise.all([client.auth.getSession(),client.auth.getUser()]);
  const token=s?.data?.session?.access_token,uid=u?.data?.user?.id;
  if(!uid||!token||uid!==s.data.session.user?.id)throw Error('Session unavailable');
  if(identity&&identity!==uid){stop();identity=null;throw Error('Account changed; reload required');}
  identity=uid;return{client,token,uid};
 }
 async function verifiedRequest(url,options){
  const {client,token,uid}=await auth();
  const response=await fetch(url,{cache:'no-store',credentials:'same-origin',
   headers:{authorization:'Bearer '+token,accept:'application/json',...(options?.headers||{})},
   ...options});
  const result=await response.json().catch(()=>null);
  const updated=(await client.auth.getSession()).data?.session;
  if(!updated||updated.user?.id!==uid||updated.access_token!==token)throw Error('Session changed; results concealed.');
  return {response,result};
 }
 const extractPrompt=f=>[f.coachingPrompt,f.lessonPrompt,f.studyPrompt,f.nextPrompt,f.prompt].find(x=>typeof x==='string'&&x.length>12&&x.length<=450)||null;
 function render(data){
  features.replaceChildren();answer.replaceChildren();
  const items=data.features?.A01?.availableTopics;
  personalize.hidden=!Array.isArray(items);
  if(Array.isArray(items)){
   const selected=topic.value;
   topic.replaceChildren(node('option','Recommended focus'));
   topic.firstChild.value='';
   for(const item of items){if(!item||typeof item.code!=='string')continue;
    const opt=node('option',item.name+' · '+item.evidenceStatus);opt.value=item.code;topic.append(opt);}
   if(items.some(x=>x.code===selected))topic.value=selected;
  }
  if(!Object.keys(data.features||{}).length){features.append(node('p','The existing authenticated Foundation classroom remains your baseline. Enhanced premium beta features have not been selected.'));return}
  for(const [id,feature] of Object.entries(data.features)){
   const card=node('section','','tmb-feature');
   card.append(node('h3',id+' — '+String(feature.capability||'Teaching capability')));
   const dl=document.createElement('dl');
   for(const [key,val] of Object.entries(feature)){
    if(['capability','coachingPrompt','lessonPrompt','studyPrompt','nextPrompt'].includes(key))continue;
    if(typeof val==='object'&&val!==null)continue;
    const row=document.createElement('div');row.append(node('dt',key.replace(/([A-Z])/g,' $1')),
     node('dd',typeof val==='boolean'?(val?'Yes':'No'):String(val??'Not recorded')));dl.append(row);
   }
   card.append(dl);
   const list=Object.entries(feature).find(([key,x])=>key!=='availableTopics'&&Array.isArray(x)&&x.length&&x.length<=40)?.[1];
   if(list){const pre=node('pre',JSON.stringify(list,null,2),'tmb-data');card.append(pre);}
   const prompt=extractPrompt(feature);
   if(prompt){
    const button=node('button','Ask Talia to teach this evidence','tmb-teach');
    button.type='button';button.addEventListener('click',()=>void teach(prompt,id));
    card.append(button);
   }
   features.append(card);
  }
 }
 async function load(tier,initial=false,requestedTopic=''){
  const mine=++serial;controller?.abort();controller=new AbortController();
  activeTier=tier;
  status.textContent='Loading '+tier+' with your authenticated learning records…';
  for(const b of actions)b.setAttribute('aria-pressed',String(b.dataset.tmbTier===tier));
  try{
   const {response,result}=await verifiedRequest('/api/talia-premium-member-v1?tier='+encodeURIComponent(tier)+(requestedTopic?'&topic='+encodeURIComponent(requestedTopic):''),
    {signal:controller.signal});
   if(mine!==serial)return;
   if(!response.ok||result?.ok!==true||result.scope!=='AUTHENTICATED_MEMBER_BETA'||result.tier!==tier)
    throw Error('This edition is not available to the current authorized beta account.');
   root.hidden=false;booted=true;
   status.textContent='Member-verified '+tier+' · '+result.planCode+' · source-grounded beta · no paid AI';
   render(result);
  }catch(e){
   if(mine!==serial||e?.name==='AbortError')return;
   if(initial){stop();return}
   features.replaceChildren();answer.replaceChildren();
   status.textContent=e?.message||'Cannot verify premium runtime access.';
  }
 }
 async function teach(prompt,featureId){
  if(!booted||!root||root.hidden)return;
  const mine=++serial;controller?.abort();controller=new AbortController();
  answer.replaceChildren();
  const reflection=String(reasoning?.value||'').trim().slice(0,1800);
  const mode=featureId==='A02'&&reflection.length>=12?'review':'explain';
  answer.append(node('p','Requesting ungraded '+(mode==='review'?'feedback':'instruction')+' from the existing member Tutor engine…'));
  try{
   const {response,result}=await verifiedRequest('/api/market-tutor',{
    method:'POST',signal:controller.signal,
    headers:{'content-type':'application/json'},
    body:JSON.stringify({question:prompt.slice(0,450),mode,learnerAnswer:mode==='review'?reflection:'',
     requestId:crypto.randomUUID(),allowModel:false,saveHistory:false})
   });
   if(mine!==serial)return;
   if(!response.ok||result?.ok!==true||typeof result.answer!=='string')
    throw Error('Tutor could not provide a reviewed explanation.');
   answer.replaceChildren(node('h3','Talia · ungraded source-grounded instruction'),
    node('p',result.answer.slice(0,7000)));
  }catch(e){if(mine!==serial||e?.name==='AbortError')return;
   answer.replaceChildren(node('p',e?.message||'Teaching unavailable.'));}
 }
 for(const b of actions)b.addEventListener('click',()=>{topic.value='';reasoning.value='';void load(b.dataset.tmbTier)});
 topic.addEventListener('change',()=>void load(activeTier,false,topic.value));
 document.addEventListener('DOMContentLoaded',()=>void load('FOUNDATION',true),{once:true});
 if(document.readyState!=='loading')void load('FOUNDATION',true);
 window.addEventListener('pagehide',stop,{once:true});
 document.addEventListener('visibilitychange',()=>{if(document.hidden)stop();else void load(activeTier,true,topic.value)});
 window.addEventListener('focus',()=>{if(booted)void load(activeTier,true,topic.value)});
})();
