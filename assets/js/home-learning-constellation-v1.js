/* Homepage Constellation: explicit compact presentation, fresh resources and
 * canonical-footer placement. The public map uses simulated educational
 * examples only and never changes the protected Prototype Center. */
(()=>{'use strict';
 const section=document.getElementById('learning-constellation');
 const host=document.getElementById('pt-experiences-root');
 if(!section||!host)return;
 const version='20261105-compact2';
 let started=false,dispose=null,observer=null;
 const ensureStyles=()=>{
  if(document.querySelector('link[data-gu-constellation-compact-v2]'))return;
  const link=document.createElement('link');
  link.rel='stylesheet';
  link.href='/assets/css/home-constellation-compact-v2.css?v='+version;
  link.dataset.guConstellationCompactV2='1';
  document.head.append(link);
 };
 const repairFooter=()=>{
  const main=section.closest('main');
  if(!main)return;
  // If a page-style rewrite moves a real website footer into the study map,
  // retain the footer but restore it to its correct position after main.
  for(const footer of [...host.querySelectorAll('footer.footer')]){
   main.after(footer);
  }
  // Never show duplicated legal/site-footer grids inside the teaching map.
  for(const stray of [...host.querySelectorAll('.gu-legal-footer-grid,.gu-footer-bottom')]){
   if(stray.closest('footer.footer'))continue;
   stray.remove();
  }
  // Source order must remain header -> main -> canonical global footer.
  for(const footer of [...document.querySelectorAll('body > footer.footer')]){
   if(footer.compareDocumentPosition(main)&Node.DOCUMENT_POSITION_FOLLOWING)main.after(footer);
  }
 };
 async function mount(){
  if(started)return;started=true;
  ensureStyles();
  try{
   const module=await import('/assets/js/prototype-learning-constellation-v1.js?v='+version);
   if(!host.isConnected)return;
   if(typeof module.mountLearningConstellation!=='function')throw Error('Map renderer unavailable');
   dispose=module.mountLearningConstellation(host,{publicPreview:true});
   const root=host.querySelector('.lc-app');
   if(root){
    root.dataset.guConstellationHomeCompact='v2';
    const sub=root.querySelector('.lc-map-head > div > span');
    if(sub)sub.textContent='Select a node to study the evidence.';
   }
   repairFooter();
   observer=new MutationObserver(()=>repairFooter());
   observer.observe(host,{childList:true,subtree:true});
  }catch(error){
   const message=document.createElement('p');
   message.className='gu-home-galaxy-loading';
   message.setAttribute('role','status');
   message.textContent='The interactive Learning Constellation is temporarily unavailable.';
   const link=document.createElement('a');
   link.href='/learn.html';link.textContent=' Explore the Learning System';
   message.append(link);host.replaceChildren(message);
   console.error('Public constellation initialization failed',error);
  }
 }
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',mount,{once:true});
 else void mount();
 window.addEventListener('pagehide',()=>{observer?.disconnect();if(dispose){dispose();dispose=null}},{once:true});
})();
