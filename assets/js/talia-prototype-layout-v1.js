/* Talia prototype layout comparison. No member data, APIs, or persistent storage. */
(()=>{'use strict';
 const root=document.documentElement;
 const buttons=Array.from(document.querySelectorAll('[data-tp-view]'));
 const apply=view=>{
  if(!['split','chart','tutor'].includes(view))return;
  root.dataset.tpView=view;
  buttons.forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.tpView===view)));
  // ECharts observes window resizing; allow layout to settle first.
  window.dispatchEvent(new Event('resize'));
  requestAnimationFrame(()=>window.dispatchEvent(new Event('resize')));
 };
 buttons.forEach(button=>button.addEventListener('click',()=>apply(button.dataset.tpView)));
 apply('split');
})();