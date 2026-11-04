/* Shared Lab/Boot Camp optional chart: independent fictional evidence only.
 * This module has no write APIs, no account state and no access overrides.
 * Protected learning content still comes from the existing Lab/Academy engines.
 */
(()=>{'use strict';
 const init=()=>{
  const lab=!!document.getElementById('cl-lab-classroom-chart');
  const key=lab?'lab':'bootcamp';
  const details=document.getElementById(lab?'cl-lab-classroom-chart':'cl-bootcamp-classroom-chart');
  const target=document.getElementById(lab?'cl-lab-classroom-chart-host':'cl-bootcamp-classroom-chart-host');
  const status=document.getElementById(lab?'cl-lab-classroom-chart-status':'cl-bootcamp-classroom-chart-status');
  if(!details||!target||!status)return;
  const gate=document.getElementById(lab?'lab-player-content':'academy-workspace');
  const assessment=document.getElementById('academy-official-assessment');
  const modes=document.getElementById('player-mode-select');
  let session=null,disposed=false;
  const permitted=()=>{
   if(!gate||gate.hidden||!gate.isConnected||!details.isConnected)return false;
   if(lab&&['blind','assessment'].includes(modes?.value||''))return false;
   if(!lab&&assessment&&!assessment.hidden)return false;
   return true;
  };
  const dispose=()=>{
   session?.dispose?.();
   session=null;
   target.replaceChildren();
  };
  const sync=()=>{
   if(disposed)return;
   if(!details.open){dispose();return}
   if(!permitted()){
    dispose();
    details.open=false;
    status.textContent=lab?
     'Open an authorized Lab in Guided or Practice mode before using supplemental fictional chart practice.':
     'Protected assessments and unavailable study days cannot mount a supplemental chart.';
    return;
   }
   if(session)return;
   const mount=window.CrownlightHomeMarketTerminal?.mountInto;
   if(typeof mount!=='function'){
    status.textContent='The locally hosted chart component is temporarily unavailable. Your lesson and progress are unaffected.';
    return;
   }
   session=mount(target,{context:key,startPaused:true,checkpointLocked:false});
   status.textContent=session?
    'Independent fictional chart ready · 1/3/5-minute playback, historical-bar proxy, volume, pan and zoom. No lesson progress or grade is modified.':
    'Chart could not initialize. Your authorized lesson remains available.';
  };
  details.addEventListener('toggle',sync);
  if(modes)modes.addEventListener('change',sync);
  const watch=new MutationObserver(()=>{if(session&&!permitted())sync()});
  if(gate)watch.observe(gate,{attributes:true,attributeFilter:['hidden']});
  if(assessment)watch.observe(assessment,{attributes:true,attributeFilter:['hidden']});
  // Current-account and route changes may remove the authorized lesson.
  const root=document.getElementById(lab?'lab-player-gate':'academy-workspace');
  if(root&&root!==gate)watch.observe(root,{attributes:true,attributeFilter:['hidden']});
  window.addEventListener('pagehide',()=>{
   disposed=true;watch.disconnect();dispose();
  },{once:true});
 };
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
})();
