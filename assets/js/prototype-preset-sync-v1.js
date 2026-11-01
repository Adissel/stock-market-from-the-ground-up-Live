/* Owner/Admin classroom draft server synchronization. No publication or entitlement writes. */
(()=>{'use strict';
let uid='',versions={},history=[],status='Not connected',loading=false;
let revisionsSelect=null,comparisonNode=null,restoreButton=null;
const node=(tag,text)=>{const x=document.createElement(tag);if(text!==undefined)x.textContent=text;return x;};
let statusNode=null,versionNode=null;
function earlierRevisions(plan){
 const active=versions[plan];
 return history.filter(x=>x.plan_code===plan&&x.channel==='draft'&&
  Number.isInteger(x.version)&&x.version<active&&x.config&&typeof x.config==='object')
  .sort((a,b)=>b.version-a.version);
}
function compareSelected(){
 if(!comparisonNode||!revisionsSelect)return;
 const code=window.CrownlightClassroomMemberships?.membership?.()?.code;
 const prior=earlierRevisions(code).find(x=>String(x.version)===revisionsSelect.value);
 if(!prior){comparisonNode.textContent='No earlier draft revisions available for comparison.';return}
 const current=window.CrownlightClassroomMemberships?.selected?.()||{};
 const fields=['id','layout','density','tutor','detail','barWidth','wickWidth','chartHeight','grid','labels','highContrast','showVolume','teachingNotes'];
 const changed=fields.filter(k=>JSON.stringify(current[k])!==JSON.stringify(prior.config[k]));
 comparisonNode.textContent='Current editor compared with draft v'+prior.version+': '+
  (changed.length?changed.map(k=>k+': '+String(prior.config[k])+' → '+String(current[k])).join(' · '):'No differences.');
}
function renderStatus(){
 if(statusNode)statusNode.textContent=status;
 const p=window.CrownlightClassroomMemberships?.membership?.();
 if(versionNode){
  const count=history.filter(x=>x.plan_code===p?.code&&x.channel==='draft').length;
  versionNode.textContent=p?.code?('Membership '+p.code+' · Server draft v'+(versions[p.code]||'—')+' · '+count+' recorded revision(s)'):'';
 }
 if(revisionsSelect){
  const priorValue=revisionsSelect.value,available=earlierRevisions(p?.code);
  revisionsSelect.replaceChildren();
  if(!available.length){const o=node('option','No earlier revisions');o.value='';revisionsSelect.append(o)}
  for(const entry of available){const o=node('option','Draft v'+entry.version);o.value=String(entry.version);revisionsSelect.append(o)}
  revisionsSelect.value=available.some(x=>String(x.version)===priorValue)?priorValue:(available.length?String(available[0].version):'');
  revisionsSelect.disabled=!available.length;
  if(restoreButton)restoreButton.disabled=!available.length||loading;
  compareSelected();
 }
}
async function request(method,body){
 const sb=await window.getSupabaseClient?.();if(!sb?.auth)throw Error('No authenticated client');
 const {data:{session}}=await sb.auth.getSession();
 if(!session?.access_token||session.user?.id!==uid)throw Error('Designer session changed');
 const res=await fetch('/api/prototype-classroom-presets',{method,cache:'no-store',credentials:'same-origin',headers:{
  authorization:'Bearer '+session.access_token,accept:'application/json',...(body?{'content-type':'application/json'}:{})
 },...(body?{body:JSON.stringify(body)}:{})});
 const data=await res.json().catch(()=>({}));
 if(!res.ok||data.ok!==true){const e=new Error(data.error||'Server response unavailable');e.status=res.status;throw e;}
 return data;
}
async function reload(){
 if(!uid||loading)return;loading=true;status='Loading protected server drafts…';renderStatus();
 const identity=uid;
 try{
  const data=await request('GET');
  if(identity!==uid)return;
  const p=window.CrownlightClassroomMemberships;
  if(data.isDraftOnly!==true||!Array.isArray(data.presets)||data.presets.length!==20||
     !Array.isArray(data.memberships)||data.memberships.length<8||!Array.isArray(data.layouts))throw Error('Registry count mismatch');
  versions={};for(const layout of data.layouts)if(layout.channel==='draft'&&Number.isInteger(layout.version))versions[layout.plan_code]=layout.version;
  history=Array.isArray(data.history)?data.history:[];
  p?.applyServerDrafts?.(data.layouts);
  status='Server drafts loaded. No changes are published.';
 }catch(e){if(identity===uid)status='Server synchronization unavailable: '+e.message+'. Local previews remain available.';}
 finally{loading=false;renderStatus();}
}
async function save(){
 if(!uid||loading)return;
 const membership=window.CrownlightClassroomMemberships?.membership?.();
 const config=window.CrownlightClassroomMemberships?.selected?.();
 const version=versions[membership?.code];
 if(!Number.isInteger(version)){status='Reload server drafts before saving';renderStatus();return;}
 loading=true;status='Saving audited draft…';renderStatus();
 const identity=uid;
 try{
  const data=await request('PUT',{action:'saveDraft',planCode:membership.code,expectedVersion:version,config});
  if(identity!==uid)return;
  versions[membership.code]=data.saved.version;
  window.CrownlightClassroomMemberships?.save?.();
  history.unshift({...data.saved,plan_code:membership.code,channel:'draft'});
  status='Draft v'+data.saved.version+' saved on server with immutable audit revision. Not published.';
 }catch(e){if(identity===uid)status=(e.status===409?'Version conflict — reload before saving. ':'Draft save failed: ')+e.message;}
 finally{loading=false;renderStatus();}
}
async function restoreRevision(){
 if(!uid||loading||!revisionsSelect?.value)return;
 const p=window.CrownlightClassroomMemberships?.membership?.();
 const version=versions[p?.code],targetVersion=Number(revisionsSelect.value);
 if(!Number.isInteger(version)||!earlierRevisions(p?.code).some(x=>x.version===targetVersion)){
  status='Reload the history before restoring.';renderStatus();return;
 }
 if(typeof window.confirm!=='function'||!window.confirm('Restore draft v'+targetVersion+
  ' for '+p.code+'? A NEW audited draft revision will be created. No classroom will be published.'))return;
 loading=true;status='Restoring earlier draft as a new version…';renderStatus();
 const identity=uid;
 try{
  const result=await request('PUT',{action:'restoreDraft',planCode:p.code,expectedVersion:version,targetVersion});
  if(identity!==uid)return;
  versions[p.code]=result.saved.version;
  history.unshift({...result.saved,plan_code:p.code,channel:'draft'});
  window.CrownlightClassroomMemberships?.applyServerDrafts?.([result.saved]);
  status='Restored draft v'+targetVersion+' as audited draft v'+result.saved.version+'. Nothing published.';
 }catch(e){
  if(identity===uid)status=(e.status===409?'Version conflict — reload. ':'Restore failed: ')+e.message;
 }finally{loading=false;renderStatus();}
}
function start(user){
 uid=String(user||'');versions={};history=[];status='Starting secure draft synchronization';
 const container=document.querySelector('#pt-app .pt-controls');
 if(!container||!uid)return;
 document.getElementById('pt-remote-controls')?.remove();
 const controls=node('div');controls.id='pt-remote-controls';controls.className='pt-remote-controls';
 const saveButton=node('button','Save server draft');saveButton.type='button';saveButton.addEventListener('click',()=>void save());
 const refreshButton=node('button','Reload server drafts');refreshButton.type='button';refreshButton.addEventListener('click',()=>void reload());
 const revisionLabel=node('label','Compare with earlier draft');
 revisionsSelect=node('select');revisionsSelect.setAttribute('aria-label','Earlier classroom draft revision');
 revisionsSelect.addEventListener('change',compareSelected);revisionLabel.append(revisionsSelect);
 restoreButton=node('button','Restore selected revision');restoreButton.type='button';
 restoreButton.addEventListener('click',()=>void restoreRevision());
 comparisonNode=node('p');comparisonNode.className='pt-note';comparisonNode.setAttribute('aria-live','polite');
 statusNode=node('p');statusNode.setAttribute('role','status');statusNode.setAttribute('aria-live','polite');
 versionNode=node('p');versionNode.className='pt-note';
 controls.append(saveButton,refreshButton,revisionLabel,restoreButton,comparisonNode,statusNode,versionNode);
 const designRemote=document.getElementById('pt-design-remote');
 if(designRemote)designRemote.append(controls);else container.after(controls);
 const select=document.getElementById('pt-membership');
 select?.addEventListener('change',renderStatus);
 renderStatus();void reload();
}
function clear(){uid='';versions={};history=[];status='Signed out';document.getElementById('pt-remote-controls')?.remove();statusNode=null;versionNode=null;revisionsSelect=null;comparisonNode=null;restoreButton=null;}
window.CrownlightClassroomPresetSync=Object.freeze({start,clear,reload,save,state:()=>({status,versions:{...versions}})});
})();
