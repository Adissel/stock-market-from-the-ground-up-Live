/* Staff-only Crownlight Experience Suite bootstrap.
 * Only mounts inside an authenticated, role-verified Prototype Center.
 * Navigation states are URLs under the same protected document,
 * not new public routes.
 */
(()=>{'use strict';
 const params=new URLSearchParams(location.search);
 const requested=params.get('experience');
 // Default to the production-style chart prototype; keep explicit classic access.
 const page=params.get('view')==='classic'?null:requested==='map'?'map':['a','b','c'].includes(requested)?requested:'a';
 if(!page)return;
 const protectedApp=document.getElementById('pt-app');
 const host=document.getElementById('pt-experiences-root');
 const parent=document.getElementById('pt-root');
 if(!protectedApp||!host||!parent)return;
 let disposed=null,loading=false,stopped=false;
 const clear=()=>{if(disposed){try{disposed()}catch(e){console.warn('Experience cleanup',e)}disposed=null}host.hidden=true;parent.removeAttribute('data-experience-view')};
 const begin=async()=>{
  if(stopped||protectedApp.hidden||loading||disposed)return;
  loading=true;
  try{
   if(page==='map'){
    const module=await import('/assets/js/prototype-learning-constellation-v1.js');
    if(stopped||protectedApp.hidden)return;
    if(typeof module.mountLearningConstellation!=='function')throw Error('Learning constellation mount export missing');
    disposed=module.mountLearningConstellation(host);
   }else{
    const module=await import('/assets/js/prototype-experiences-v1.bundle.js');
    if(stopped||protectedApp.hidden)return;
    if(typeof module.mountExperienceSuite!=='function')throw Error('React experience mount export missing');
    disposed=module.mountExperienceSuite(host,page);
   }
   host.hidden=false;parent.dataset.experienceView='true';
  }catch(error){
   host.hidden=false;parent.dataset.experienceView='true';
   const p=document.createElement('p');p.setAttribute('role','alert');
   p.textContent='Prototype experience failed to load. Return to the original Prototype Center.';
   host.replaceChildren(p);console.error('Crownlight experience error',error);
  }finally{loading=false}
 };
 const watcher=new MutationObserver(()=>{if(!protectedApp.hidden)void begin();else clear()});
 watcher.observe(protectedApp,{attributes:true,attributeFilter:['hidden']});
 if(!protectedApp.hidden)void begin();
 window.addEventListener('pagehide',()=>{stopped=true;watcher.disconnect();clear()},{once:true});
})();