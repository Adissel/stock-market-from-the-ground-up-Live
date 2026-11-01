/* Owner/Admin classroom draft server synchronization. No publication or entitlement writes. */
(()=>{'use strict';
let uid='',versions={},history=[],status='Not connected',loading=false;
const node=(tag,text)=>{const x=document.createElement(tag);if(text!==undefined)x.textContent=text;return x;};
let statusNode=null,versionNode=null;
function renderStatus(){
 if(statusNode)statusNode.textContent=status;
 if(versionNode){
  const p=window.CrownlightClassroomMemberships?.membership?.();
  const count=history.filter(x=>x.plan_code===p?.code&&x.channel==='draft').length;
  versionNode.textContent=p?.code?('Membership '+p.code+' · Server draft v'+(versions[p.code]||'—')+' · '+count+' recent revision(s)'):'';
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
  history.unshift({plan_code:membership.code,channel:'draft',version:data.saved.version});
  status='Draft v'+data.saved.version+' saved on server with immutable audit revision. Not published.';
 }catch(e){if(identity===uid)status=(e.status===409?'Version conflict — reload before saving. ':'Draft save failed: ')+e.message;}
 finally{loading=false;renderStatus();}
}
function start(user){
 uid=String(user||'');versions={};history=[];status='Starting secure draft synchronization';
 const container=document.querySelector('#pt-app .pt-controls');
 if(!container||!uid)return;
 document.getElementById('pt-remote-controls')?.remove();
 const controls=node('div');controls.id='pt-remote-controls';controls.className='pt-remote-controls';
 const saveButton=node('button','Save server draft');saveButton.type='button';saveButton.addEventListener('click',()=>void save());
 const refreshButton=node('button','Reload server drafts');refreshButton.type='button';refreshButton.addEventListener('click',()=>void reload());
 statusNode=node('p');statusNode.setAttribute('role','status');statusNode.setAttribute('aria-live','polite');
 versionNode=node('p');versionNode.className='pt-note';
 controls.append(saveButton,refreshButton,statusNode,versionNode);container.after(controls);
 const select=document.getElementById('pt-membership');
 select?.addEventListener('change',renderStatus);
 renderStatus();void reload();
}
function clear(){uid='';versions={};history=[];status='Signed out';document.getElementById('pt-remote-controls')?.remove();statusNode=null;versionNode=null;}
window.CrownlightClassroomPresetSync=Object.freeze({start,clear,reload,save,state:()=>({status,versions:{...versions}})});
})();
