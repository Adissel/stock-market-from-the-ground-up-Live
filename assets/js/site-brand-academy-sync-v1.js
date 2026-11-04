/* Crownlight approved website header identity — runtime resilience.
 * Normalizes only the header's brand anchor. Never touches route navigation,
 * account session, Owner presentation state, page copy or access controls.
 */
(()=>{
 'use strict';
 const title='THE STOCK MARKET';
 const gold='FROM THE GROUND UP';
 const subtitle='LEARNING ACADEMY';
 const render=()=>{
  for(const header of document.querySelectorAll('.site-header')){
   const anchor=header.querySelector('a.brand');
   if(!anchor)continue;
   const text=anchor.textContent||'';
   if(!/THE\s+STOCK\s+MARKET/i.test(text)||!/FROM\s+THE\s+GROUND\s+UP/i.test(text))continue;
   anchor.classList.add('gu-academy-brand');
   const currentTitle=anchor.querySelector('.gu-academy-brand-title');
   const currentSubtitle=anchor.querySelector('.gu-academy-brand-subtitle');
   if(currentTitle&&currentSubtitle&&
     currentTitle.textContent.replace(/\s+/g,' ').trim()===title+' '+gold&&
     currentSubtitle.textContent.trim().toUpperCase()===subtitle)return;
   const heading=document.createElement('span');
   heading.className='gu-academy-brand-title';
   heading.append(document.createTextNode(title+' '));
   const highlight=document.createElement('span');
   highlight.textContent=gold;
   heading.append(highlight);
   const tagline=document.createElement('span');
   tagline.className='gu-academy-brand-subtitle';
   tagline.textContent=subtitle;
   anchor.replaceChildren(heading,tagline);
  }
 };
 let pending=false;
 const schedule=()=>{
  if(pending)return;
  pending=true;
  queueMicrotask(()=>{pending=false;render()});
 };
 const start=()=>{
  render();
  // Some member pages replace the header after sign-in and owner style updates.
  // Observe only the existing header: any resulting no-op render is idempotent.
  const header=document.querySelector('.site-header');
  if(header)new MutationObserver(schedule).observe(header,{subtree:true,childList:true,characterData:true});
 };
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});
 else start();
})();
