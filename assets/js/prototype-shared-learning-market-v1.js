/* Staff prototype of the exact homepage forming-candle terminal used in Labs
 * and Boot Camp Academy. Auth authority is the existing Prototype Center gate.
 * Never accepts browser-granted roles, reads private member progress, grades,
 * trading accounts, historical market data, or charges any Lumens.
 */
(()=>{'use strict';
 const ready=()=>{
  const get=id=>document.getElementById(id);
  const app=get('pt-app'),details=get('pt-shared-learning-market'),host=get('pt-shared-market-host');
  const status=get('pt-shared-market-status'),lab=get('pt-shared-lab'),boot=get('pt-shared-bootcamp');
  const title=get('pt-shared-stage-title'),lesson=get('pt-shared-lesson-heading');
  const copy=get('pt-shared-lesson-copy'),feedback=get('pt-shared-feedback');
  const question=get('pt-shared-question');
  if(!app||!details||!host||!status||!lab||!boot||!question)return;
  const requested=new URLSearchParams(location.search).get('market');
  let selected=requested==='bootcamp'?'bootcamp':'lab',controller=null,autolaunched=false;
  let checkpoint=false;
  const authorized=()=>app.hidden===false&&details.isConnected&&host.isConnected;
  const dispose=()=>{
   if(controller){controller.dispose();controller=null;}
   host.replaceChildren();checkpoint=false;
  };
  const describe=()=>{
   const isLab=selected==='lab';
   lab.setAttribute('aria-pressed',String(isLab));
   boot.setAttribute('aria-pressed',String(!isLab));
   title.textContent=isLab?'Interactive Lab · Learn and Experiment':'Boot Camp · Day Classroom';
   lesson.textContent=isLab?'Lab · Understanding completed candles':'Boot Camp · Evidence-led market reading';
   copy.textContent=isLab?
     'This is the actual homepage chart mounted in the Lab experience. Watch fictional prices form and change OHLC/Volume, then pause to explain what a completed candle can and cannot prove.':
     'This is the same homepage chart shown on an authenticated Boot Camp study day. Its fictional simulation illustrates a concept, but never replaces day-specific historical evidence or an assessment.';
   feedback.textContent='Select an observation, then check your reasoning. No formal grade or Lumens are used.';
   question.reset();
  };
  const mount=()=>{
   dispose();describe();
   if(!authorized()||!details.open)return;
   const api=window.CrownlightHomeMarketTerminal;
   if(typeof api?.mountInto!=='function'){
    status.textContent='Homepage chart component did not load. The existing Prototype Center remains available.';
    return;
   }
   controller=api.mountInto(host,{context:selected,startPaused:false});
   status.textContent=controller?
     (selected==='lab'?'Live component preview: Lab Learn/Experiment':
     'Live component preview: Boot Camp study day')+
      ' · Original fictional candles · Play/Pause/Replay, 1/3/5m, speed, zoom, pan, indicator and volume':
     'Unable to mount the chart safely; reopen the preview to retry.';
  };
  function select(mode){
   if(mode!=='lab'&&mode!=='bootcamp')return;
   selected=mode;
   if(!authorized())return;
   if(!details.open)details.open=true;
   mount();
  }
  details.addEventListener('toggle',()=>{
   if(!authorized()||!details.open){dispose();return;}
   if(!controller)mount();
  });
  lab.addEventListener('click',()=>select('lab'));
  boot.addEventListener('click',()=>select('bootcamp'));
  get('pt-shared-pause')?.addEventListener('click',()=>{
   if(!authorized()||!details.open||!controller)return;
   checkpoint=true;controller.pause();
   status.textContent='Playback paused for the instructor. Answer the ungraded checkpoint, or choose Resume to continue.';
  });
  get('pt-shared-resume')?.addEventListener('click',()=>{
   if(!authorized()||!details.open||!controller)return;
   checkpoint=false;controller.resume();
   status.textContent='Fictional candle formation resumed in '+(selected==='lab'?'Lab':'Boot Camp')+' preview.';
  });
  get('pt-shared-replay')?.addEventListener('click',()=>{
   if(authorized()&&details.open)mount();
  });
  question.addEventListener('submit',event=>{
   event.preventDefault();
   if(!authorized()||!details.open||!controller)return;
   const value=question.querySelector('input[name="pt-shared-answer"]:checked')?.value;
   if(!value){feedback.textContent='Choose one statement. Use Pause for teaching to inspect the completed candle.';return;}
   controller.pause();checkpoint=true;
   if(value!=='observed'){
    feedback.textContent='Not supported. A completed OHLC candle does not predict the next interval or establish the order of every underlying trade. You can retry without a grade.';
    status.textContent='Replay paused for an ungraded correction.';
    return;
   }
   feedback.textContent='Correct. Open, High, Low and Close describe observed prices for the completed candle. They cannot predict the next candle or reveal transaction order. Explanation and retries are always free.';
   checkpoint=false;controller.resume();
   status.textContent='Correct fictional checkpoint · classroom playback resumed.';
  });
  // Never mount any chart until the existing authenticated Owner/Admin gate
  // has succeeded. Immediately release the React root when the gate hides.
  const monitor=new MutationObserver(()=>{
   if(app.hidden){dispose();return;}
   if(!autolaunched&&(requested==='lab'||requested==='bootcamp')){
    autolaunched=true;selected=requested;
    details.open=true;mount();
    requestAnimationFrame(()=>details.scrollIntoView({block:'start',behavior:'auto'}));
   }
  });
  monitor.observe(app,{attributes:true,attributeFilter:['hidden']});
  if(!app.hidden&&(requested==='lab'||requested==='bootcamp')){
   autolaunched=true;details.open=true;mount();
  }
  window.addEventListener('pagehide',()=>{dispose();monitor.disconnect()},{once:true});
 };
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',ready,{once:true});
 else ready();
})();
