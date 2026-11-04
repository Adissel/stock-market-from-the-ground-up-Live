/* Homepage reuses the same dimensional Learning Constellation as the
 * Owner Prototype Center, with a public-safe presentation, simulated educational examples and no staff UI. */
(()=>{'use strict';
 const host=document.getElementById('pt-experiences-root');
 if(!host||!document.getElementById('learning-constellation'))return;
 let started=false,dispose=null;
 async function mount(){
  if(started)return;started=true;
  try{
   const module=await import('/assets/js/prototype-learning-constellation-v1.js?v=20261104-homegalaxy1');
   if(!host.isConnected)return;
   if(typeof module.mountLearningConstellation!=='function')throw Error('Map renderer unavailable');
   dispose=module.mountLearningConstellation(host,{publicPreview:true});
  }catch(error){
   const message=document.createElement('p');
   message.className='gu-home-galaxy-loading';
   message.setAttribute('role','status');
   message.textContent='The interactive Learning Constellation is temporarily unavailable.';
   const link=document.createElement('a');link.href='/learn.html';link.textContent=' Explore the Learning System';
   message.append(link);host.replaceChildren(message);
   console.error('Public constellation initialization failed',error);
  }
 }
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',mount,{once:true});
 else void mount();
 window.addEventListener('pagehide',()=>{if(dispose){dispose();dispose=null}},{once:true});
})();
