/* Admin Control Center > Products & Prices > Memberships: engine versions. Owner only. */
(()=>{'use strict';
const root=()=>document.getElementById('admin-learning-engine-assignments');
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
let active=false,working=false;
const editionLabels={
 FOUNDATION:'Foundation (Basic) — included',
 ADVANCED:'Advanced — planned entitlement; features not released',
 PROFESSIONAL:'Professional — planned entitlement; features not released',
 ENTERPRISE:'Enterprise — planned entitlement; features not released',
 PRODUCT_DEPENDENT:'Based on verified On-Demand product access',
 UNASSIGNED:'Legacy / unassigned — no implicit upgrade'
};

const labels={
 LEARNING_V33_FREEZE_20261101:'Learning v3.3 · Frozen Free baseline (2026-11-01)',
 LEARNING_V33_CURRENT:'Learning v3.3 · Current deployment',
 LAB_V32_FREEZE_20261101:'Lab v3.2 · Frozen Free baseline (2026-11-01)',
 LAB_V32_CURRENT:'Lab v3.2 · Current deployment',
 TALIA_FREEZE_20261101:'Talia Mercer · Frozen Free baseline (2026-11-01)',
 TALIA_CURRENT:'Talia Mercer · Current deployment'
};
async function token(){
 const sb=await window.getSupabaseClient(),{data}=await sb.auth.getSession();
 if(!data?.session?.access_token)throw Error('Sign in with your Owner account.');
 return data.session.access_token;
}
async function call(body){
 const r=await fetch('/api/admin-learning-engine-versions',{method:body?'POST':'GET',
  cache:'no-store',headers:{authorization:'Bearer '+await token(),...(body?{'content-type':'application/json'}:{})},
  ...(body?{body:JSON.stringify(body)}:{})});
 const data=await r.json().catch(()=>({}));
 if(!r.ok||!data.ok)throw Error(data.error||'Version service unavailable');
 return data;
}
const options=(values,selected)=>values.map(v=>'<option value="'+esc(v)+'"'+(v===selected?' selected':'')+'>'+esc(labels[v]||v)+'</option>').join('');
function rows(data){
 const fields=['learning','lab','tutor'];
 return data.assignments.map(a=>'<tr data-engine-plan="'+esc(a.planCode)+'"><th scope="row">'+esc(a.name)+
 '<small><code>'+esc(a.planCode)+'</code> · '+(a.active?'Active':'Archived')+'</small></th>'+
 fields.map(f=>'<td><label class="visually-hidden" for="engine-'+esc(f)+'-'+esc(a.planCode)+'">'+esc(a.name)+' '+f+'</label>'+
 '<select id="engine-'+esc(f)+'-'+esc(a.planCode)+'" data-engine-field="'+f+'">'+options(data.versions[f],a[f])+'</select></td>').join('')+
 '<td><label class="visually-hidden" for="talia-edition-'+esc(a.planCode)+'">'+esc(a.name)+' Talia membership edition</label>'+
 '<select id="talia-edition-'+esc(a.planCode)+'" data-talia-edition>'+
 (a.tutorEdition==='UNASSIGNED'?'<option value="UNASSIGNED" selected>Unassigned — choose an edition</option>':'')+
 data.tutorEditions.filter(t=>t!=='PRODUCT_DEPENDENT'||a.planCode==='ONDEMAND_MONTHLY').map(t=>
 '<option value="'+esc(t)+'"'+(t===a.tutorEdition?' selected':'')+'>'+esc(editionLabels[t])+'</option>').join('')+
 '</select><small>'+(a.tutorEditionPersisted?'Stored · revision '+a.tutorEditionRevision:
 'Owner policy default; save to persist')+'</small>'+
 '<button class="btn secondary" type="button" data-talia-save="'+esc(a.planCode)+
 '" data-revision="'+a.tutorEditionRevision+'">Save Tutor Edition</button></td>'+
 '<td><button class="btn secondary" type="button" data-engine-save="'+esc(a.planCode)+'" data-revision="'+a.revision+'">Save assignment</button>'+
 '<small>'+(a.persisted?'Stored revision '+a.revision:'Proposed default; not yet persisted')+'</small></td></tr>').join('');
}
function status(s,bad=false){const node=root()?.querySelector('[data-engine-status]');if(node){node.textContent=s;node.setAttribute('role',bad?'alert':'status')}}
async function load(){
 if(working||!root()||!document.getElementById('admin-app')||document.getElementById('admin-app').hidden)return;
 const node=root();working=true;status('Verifying Owner version assignments…');
 try{
  const data=await call();
  node.querySelector('[data-engine-table]').innerHTML='<div class="product-catalog-table-wrap"><table class="product-catalog-table"><thead><tr><th>Membership</th><th>Learning Engine</th><th>Shared Lab Engine</th><th>Talia source</th><th>Talia membership edition</th><th>Engine source action</th></tr></thead><tbody>'+rows(data)+'</tbody></table></div>';
  status('Verified '+data.assignments.length+' membership records. FREE, FOUNDING_14 and PICK_WHAT_YOU_WANT default to the frozen baseline. Edition labels do not activate unreleased tools or paid AI. Each membership has its own Tutor edition selector.');
 }catch(e){status(e.message,true)}
 finally{working=false}
}
document.addEventListener('click',async ev=>{
 const tutorButton=ev.target.closest?.('[data-talia-save]');
 const node=root();
 if(tutorButton&&node&&node.contains(tutorButton)){
  if(active)return;
  const row=tutorButton.closest('[data-engine-plan]');
  const planCode=tutorButton.dataset.taliaSave;
  const edition=row?.querySelector('[data-talia-edition]')?.value;
  if(!edition||edition==='UNASSIGNED'){status('Select a released or planned edition before saving.',true);return}
  if(!confirm('Assign Talia Market Tutor '+edition+' to '+planCode+'? This stores the membership edition but does not activate unfinished capabilities, charge anyone, or change existing member rights.'))return;
  active=true;tutorButton.disabled=true;status('Saving Tutor membership edition…');
  try{
   const result=await call({action:'setTutorEdition',planCode,tutorEdition:edition,
    tutorEditionRevision:Number(tutorButton.dataset.revision)});
   await load();status(result.notice||'Talia edition saved.');
  }catch(e){status(e.message,true)}
  finally{active=false;tutorButton.disabled=false}
  return;
 }
 const button=ev.target.closest?.('[data-engine-save]');
 if(!button||!node||!node.contains(button)||active)return;
 const row=button.closest('[data-engine-plan]'),planCode=button.dataset.engineSave;
 const body={planCode,revision:Number(button.dataset.revision)};
 for(const key of ['learning','lab','tutor'])body[key]=row.querySelector('[data-engine-field="'+key+'"]').value;
 if(!confirm('Save these three learning-engine versions for '+planCode+'? This changes presentation only, not entitlements, prices, grades, or existing member progress.'))return;
 active=true;button.disabled=true;status('Saving authenticated version assignment…');
 try{const r=await call(body);status(r.notice||'Saved.');await load()}
 catch(e){status(e.message,true)}
 finally{active=false;button.disabled=false}
});
window.GroundUpAdminLearningEngines={load};
})();
