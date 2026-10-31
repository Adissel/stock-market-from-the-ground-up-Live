/* Lab and Boot Camp earning amount disclosures on their catalog cards.
 * Planned amounts are NOT advertised as currently earnable until activated.
 */
(()=>{'use strict';
const page=location.pathname.split('/').pop();
if(!['labs.html','bootcamp-academy.html'].includes(page))return;
const stamp=(parent,amount,enabled)=>{
 if(!parent||parent.querySelector('[data-learning-lumens-badge]'))return;
 const span=document.createElement('span');span.dataset.learningLumensBadge='1';
 span.className='gu-learning-lumens-amount';
 span.textContent=enabled?'Earn '+amount+' Lumens on verified completion':
  'Planned reward: '+amount+' Lumens · not yet earnable';
 span.setAttribute('aria-label',span.textContent);
 parent.append(span);
};
const run=async()=>{
 let data;
 try{const r=await fetch('/api/learning-reward-preview',{cache:'no-store'});
  if(!r.ok)return;data=await r.json();if(data.ok!==true)return;
 }catch{return}
 const render=()=>{
  for(const card of document.querySelectorAll('.academy-program[id^="academy-program-"]')){
   const code=card.id.slice('academy-program-'.length),value=data.bootcamps?.[code];
   if(!Number.isSafeInteger(value)||value<1)continue;
   stamp(card.querySelector('.academy-program-compact-link')||card,value,data.enabled===true);
  }
  for(const card of document.querySelectorAll('.lab-card[id^="row-"]')){
   if(!Number.isSafeInteger(data.lab)||data.lab<1)continue;
   stamp(card.querySelector('.lab-card-heading')||card,data.lab,data.enabled===true);
  }
 };
 render();
 const root=document.querySelector('#academy-programs')||document.querySelector('#lab-body');
 if(!root)return;
 let queued=false;
 new MutationObserver(()=>{if(queued)return;queued=true;queueMicrotask(()=>{queued=false;render()})})
  .observe(root,{childList:true});
};
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>{void run()},{once:true});
else void run();
})();