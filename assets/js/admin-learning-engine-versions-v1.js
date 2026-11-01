/* Admin Control Center > Products & Prices > Memberships: engine versions. Owner only. */
(()=>{'use strict';
const root=()=>document.getElementById('admin-learning-engine-assignments');
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
let active=false,working=false;
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
 '<td><button class="btn secondary" type="button" data-engine-save="'+esc(a.planCode)+'" data-revision="'+a.revision+'">Save assignment</button>'+
 '<small>'+(a.persisted?'Stored revision '+a.revision:'Proposed default; not yet persisted')+'</small></td></tr>').join('');
}
function status(s,bad=false){const node=root()?.querySelector('[data-engine-status]');if(node){node.textContent=s;node.setAttribute('role',bad?'alert':'status')}}
async function load(){
 if(working||!root()||!document.getElementById('admin-app')||document.getElementById('admin-app').hidden)return;
 const node=root();working=true;status('Verifying Owner version assignments…');
 try{
  const data=await call();
  node.querySelector('[data-engine-table]').innerHTML='<div class="product-catalog-table-wrap"><table class="product-catalog-table"><thead><tr><th>Membership</th><th>Learning Engine</th><th>Shared Lab Engine</th><th>Tutor</th><th>Owner action</th></tr></thead><tbody>'+rows(data)+'</tbody></table></div>';
  status('Verified '+data.assignments.length+' membership records. FREE and PICK_WHAT_YOU_WANT default to the frozen baseline. Changing versions never changes paid rights.');
 }catch(e){status(e.message,true)}
 finally{working=false}
}
document.addEventListener('click',async ev=>{
 const button=ev.target.closest?.('[data-engine-save]'),node=root();
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
