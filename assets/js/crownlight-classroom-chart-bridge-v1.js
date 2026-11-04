/* Shared Labs/Boot Camps use the Experience B ECharts component.
 * No private case OHLCV or protected assessment is passed into this optional
 * teaching fixture. Standard-only chart permissions cannot be elevated here.
 */
(()=>{'use strict';
 const init=()=>{
  const lab=!!document.getElementById('cl-lab-classroom-chart');
  const context=lab?'lab':'bootcamp';
  const details=document.getElementById(lab?'cl-lab-classroom-chart':'cl-bootcamp-classroom-chart');
  const target=document.getElementById(lab?'cl-lab-classroom-chart-host':'cl-bootcamp-classroom-chart-host');
  const status=document.getElementById(lab?'cl-lab-classroom-chart-status':'cl-bootcamp-classroom-chart-status');
  if(!details||!target||!status)return;
  const gate=document.getElementById(lab?'lab-player-content':'academy-workspace');
  const assessment=document.getElementById('academy-official-assessment');
  const modes=document.getElementById('player-mode-select');
  let session=null,disposed=false,mounting=false,epoch=0;
  const permitted=()=>{
   if(!gate||gate.hidden||!gate.isConnected||!details.isConnected)return false;
   if(lab&&['blind','assessment'].includes(modes?.value||''))return false;
   if(!lab&&assessment&&!assessment.hidden)return false;
   return true;
  };
  const dispose=()=>{
   epoch++;session?.dispose?.();session=null;target.replaceChildren();
  };
  const sync=()=>{
   if(disposed)return;
   if(!details.open){dispose();return}
   if(!permitted()){
    dispose();details.open=false;
    status.textContent=lab?
     'Open an authorized Lab in Guided or Practice mode before using supplemental simulated chart practice.':
     'Protected assessments and unavailable study days cannot mount the supplemental chart.';
    return;
   }
   if(session||mounting)return;
   const token=++epoch;mounting=true;
   // Reuse the identical EChart/IndicatorDock/right-click implementations that
   // power Experience B. This module performs no account or entitlement fetch.
   import('/assets/js/prototype-experiences-v1.bundle.js').then(module=>{
    if(disposed||token!==epoch||!details.open||!permitted())return;
    if(typeof module.mountClassicClassroomChart!=='function')
     throw Error('Shared technical chart is unavailable');
    session=module.mountClassicClassroomChart(target,{mode:context,memberSafe:true});
    status.textContent='Shared ECharts ready · pan, zoom, 16-study catalog with Standard locks, candle appearance and timeframes. This chart does not change lesson progress.';
   }).catch(()=>{
    if(token===epoch)status.textContent='Supplemental chart unavailable. Your lesson, assessments and saved progress are unchanged.';
   }).finally(()=>{mounting=false});
  };
  details.addEventListener('toggle',sync);
  if(modes)modes.addEventListener('change',sync);
  const watch=new MutationObserver(()=>{if((session||mounting)&&!permitted())sync()});
  if(gate)watch.observe(gate,{attributes:true,attributeFilter:['hidden']});
  if(assessment)watch.observe(assessment,{attributes:true,attributeFilter:['hidden']});
  const root=document.getElementById(lab?'lab-player-gate':'academy-workspace');
  if(root&&root!==gate)watch.observe(root,{attributes:true,attributeFilter:['hidden']});
  window.addEventListener('pagehide',()=>{disposed=true;watch.disconnect();dispose()},{once:true});
 };
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});
 else init();
})();
