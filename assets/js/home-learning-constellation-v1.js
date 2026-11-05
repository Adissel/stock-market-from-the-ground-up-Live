/* Homepage Constellation: explicit compact presentation, fresh resources and
 * canonical-footer placement. The public map uses simulated educational
 * examples only and never changes the protected Prototype Center. */
(()=>{'use strict';
 const section=document.getElementById('learning-constellation');
 const host=document.getElementById('pt-experiences-root');
 if(!section||!host)return;
 const version='20261105-compact3';
 let started=false,dispose=null,observer=null;
 const ensureStyles=()=>{
  if(document.querySelector('link[data-gu-constellation-compact-v3]'))return;
  const link=document.createElement('link');
  link.rel='stylesheet';
  link.href='/assets/css/home-constellation-compact-v3.css?v='+version;
  link.dataset.guConstellationCompactV3='1';
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
    root.dataset.guConstellationHomeCompact='v3';
    const sub=root.querySelector('.lc-map-head > div > span');
    if(sub)sub.textContent='Select a node to study the evidence.';
   }
   // Public homepage editorial presentation only; protected Prototype Center keeps
   // its complete curriculum notes, full labels and original controls.
   root.querySelector('.lc-guard')?.remove();
   root.querySelector('.lc-detail .lc-detail-note')?.remove();
   root.querySelector('.lc-map-tip')?.remove();
   const hero=root.querySelector('.lc-head p');
   if(hero)hero.textContent='Explore how nine learning stages, 419 Labs, ten authored Boot Camp paths and 73 Talia teaching guides connect. Some paths are draft beta.';
   const tutorMetric=root.querySelector('[data-lc="tutor-num"]')?.nextElementSibling;
   if(tutorMetric)tutorMetric.textContent='TALIA TEACHING GUIDES';
   const tutorTab=root.querySelector('[data-mode="tutor"] span');
   if(tutorTab)tutorTab.textContent='TALIA GUIDES';
   const campMetric=root.querySelector('.lc-metrics > div:nth-child(2) span');
   if(campMetric)campMetric.textContent='AUTHORED CAMP PATHS';
   const mapText=root.querySelector('.lc-map-head > div:first-child span');
   const modeCopy={
    journey:'Nine approved learning stages.',
    labs:'Research topics linked to 419 Labs.',
    academy:'Ten authored paths; some are beta-only.',
    tutor:'73 teaching guides, not 73 trading signals.'
   };
   function polish(){
    const active=root.querySelector('.lc-tabs [data-mode].is-active')?.dataset.mode||'journey';
    if(mapText)mapText.textContent=modeCopy[active]||modeCopy.journey;
    const title=root.querySelector('[data-lc="aside-title"]');
    if(title&&active==='tutor')title.textContent='Talia Guides';
    const status=root.querySelector('[data-lc="status"]');
    if(status&&active==='tutor')status.textContent=status.textContent.replace('Indicator Intelligence','Talia Guides');
    const buttons={
     focus:['Focus','Focus selected node'],
     'stars-toggle':['Stars','Toggle starfield'],
     interaction:[root.querySelector('[data-lc="interaction"]')?.getAttribute('aria-pressed')==='true'?'Orbit':'Pan','Toggle orbit or pan'],
     flatten:[root.querySelector('[data-lc="flatten"]')?.getAttribute('aria-pressed')==='true'?'3D':'2D','Toggle 2D or 3D view'],
     reset:['Reset','Reset view']
    };
    for(const [name,[short,accessible]] of Object.entries(buttons)){
     const button=root.querySelector('[data-lc="'+name+'"]');
     if(!button)continue;
     if(button.textContent!==short)button.textContent=short;
     button.setAttribute('aria-label',accessible);
     button.title=accessible;
    }
   }
   root.addEventListener('click',event=>{
    if(event.target.closest('[data-lc="focus"],[data-lc="stars-toggle"],[data-lc="interaction"],[data-lc="flatten"],[data-lc="reset"],[data-mode]'))queueMicrotask(polish);
   });
   polish();
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
