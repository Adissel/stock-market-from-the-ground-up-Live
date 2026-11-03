/* Synthetic membership version and Admin interaction acceptance. No real users, charges, writes, or model calls. */
import test from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import {readFileSync} from 'node:fs';
import {onRequest as memberEndpoint} from '../functions/api/member-learning-engine-versions.js';
import {onRequest as adminEndpoint} from '../functions/api/admin-learning-engine-versions.js';
const env={SUPABASE_URL:'https://synthetic.supabase.co',SUPABASE_PUBLISHABLE_KEY:'sb_publishable_mock',SUPABASE_SECRET_KEY:'sb_secret_mock'};
const source=p=>readFileSync(new URL('../'+p,import.meta.url),'utf8');
const basic={learning:'LEARNING_V33_FREEZE_20261101',lab:'LAB_V32_FREEZE_20261101',tutor:'TALIA_FREEZE_20261101'};
const modern={learning:'LEARNING_V33_CURRENT',lab:'LAB_V32_CURRENT',tutor:'TALIA_CURRENT'};
const mappings={
 FREE:'FOUNDATION',FOUNDING_14:'FOUNDATION',PICK_WHAT_YOU_WANT:'FOUNDATION',
 FOUNDING_30:'ADVANCED',FOUNDING_60:'PROFESSIONAL',FULL_MONTHLY:'PROFESSIONAL',
 LIFETIME:'ENTERPRISE',ONDEMAND_MONTHLY:'PRODUCT_DEPENDENT'
};
const codes=['FREE','FOUNDING_14','PICK_WHAT_YOU_WANT','FOUNDING_30','FOUNDING_60','FULL_MONTHLY','LIFETIME','ONDEMAND_MONTHLY','FULL_ANNUAL','FOUNDING_ANNUAL','FOUNDING_MONTHLY'];
const plans=()=>codes.map((code,i)=>({plan_code:code,name:code,active:true,public_visible:true,sort_order:i,
 metadata:{
  ...(['FREE','FOUNDING_14','PICK_WHAT_YOU_WANT'].includes(code)?{learning_engines_v1:{...basic,revision:1}}:{}),
  ...(mappings[code]?{talia_market_tutor_v1:{tier:mappings[code],revision:1}}:{})
 }}));
const response=(data,status=200)=>new Response(JSON.stringify(data),{status,headers:{'content-type':'application/json'}});
function stub({role='OWNER',restricted=false,subscription=null,planGrant=null}={}){
 const original=globalThis.fetch,records=plans(),audits=[],calls=[];
 globalThis.fetch=async(url,opts={})=>{
  const u=new URL(String(url)),path=u.pathname,method=opts.method||'GET';
  calls.push({path,method});
  if(path==='/auth/v1/user')return response({id:'11111111-1111-4111-8111-111111111111'});
  if(path.endsWith('/profiles'))return response([{account_kind:'member',deleted_at:null}]);
  if(path.endsWith('/admin_user_roles'))return response(role==='OWNER'?[{role_code:'OWNER',expires_at:null}]:[]);
  if(path.endsWith('/admin_user_flags'))return response(restricted?[{status:'restricted'}]:[]);
  if(path.endsWith('/site_subscriptions'))return response(subscription?[subscription]:[]);
  if(path.endsWith('/user_plan_grants'))return response(planGrant?[planGrant]:[]);
  if(path.endsWith('/platform_plans')){
   const query=/plan_code=eq\.([A-Z_0-9]+)/.exec(u.search);
   return response(query?records.filter(x=>x.plan_code===query[1]):records);
  }
  if(path.endsWith('/rpc/gu_owner_assign_talia_edition_v1')){
   const payload=JSON.parse(opts.body),plan=records.find(p=>p.plan_code===payload.p_code);
   if(!plan)return response({message:'Unknown plan'},400);
   const old=plan.metadata.talia_market_tutor_v1||{},revision=old.revision||0;
   if(revision!==payload.p_expected_revision)return response({message:'Revision conflict'},409);
   const next={tier:payload.p_tier,revision:revision+1,release_state:'assigned_not_feature_release'};
   plan.metadata.talia_market_tutor_v1=next;audits.push({action:'talia_market_tutor.edition_assigned',planCode:payload.p_code});
   return response(next);
  }
  throw Error('Unmocked URL '+String(url));
 };
 return{records,audits,calls,restore:()=>{globalThis.fetch=original}};
}
const authorization={'authorization':'Bearer synthetic'};
const req=(path,opts={})=>new Request('https://synthetic.test'+path,{...opts,headers:{...authorization,...opts.headers}});
test('All eleven plan rows have explicit or unresolved Tutor mapping; only Basic members frozen',async()=>{
 const setup=stub();
 try{
  const owner=await adminEndpoint({request:req('/api/admin-learning-engine-versions'),env});
  assert.equal(owner.status,200);
  const rows=(await owner.json()).assignments;
  assert.equal(rows.length,11);
  for(const row of rows){
   assert.equal(row.tutorEdition,mappings[row.planCode]||'UNASSIGNED',row.planCode);
   const shouldBeBasic=['FREE','FOUNDING_14','PICK_WHAT_YOU_WANT'].includes(row.planCode);
   assert.equal(row.learning,shouldBeBasic?basic.learning:modern.learning,row.planCode);
   assert.equal(row.lab,shouldBeBasic?basic.lab:modern.lab,row.planCode);
  }
  assert.equal(setup.audits.length,0);
 }finally{setup.restore()}
});
test('Owner may save and reread one Tutor edition; stale update cannot overwrite or audit',async()=>{
 const setup=stub();
 try{
  const headers={'content-type':'application/json'};
  const submit=(tier,revision)=>adminEndpoint({request:req('/api/admin-learning-engine-versions',{
   method:'POST',headers,body:JSON.stringify({action:'setTutorEdition',planCode:'FOUNDING_30',
    tutorEdition:tier,tutorEditionRevision:revision})}),env});
  let resp=await submit('PROFESSIONAL',1);
  assert.equal(resp.status,200);
  assert.deepEqual((await resp.json()).tutorEdition,{tier:'PROFESSIONAL',revision:2,release_state:'assigned_not_feature_release'});
  resp=await adminEndpoint({request:req('/api/admin-learning-engine-versions'),env});
  const updated=(await resp.json()).assignments.find(x=>x.planCode==='FOUNDING_30');
  assert.equal(updated.tutorEdition,'PROFESSIONAL');
  assert.equal(updated.tutorEditionRevision,2);
  resp=await submit('ENTERPRISE',1);
  assert.notEqual(resp.status,200);
  assert.equal(setup.records.find(p=>p.plan_code==='FOUNDING_30').metadata.talia_market_tutor_v1.tier,'PROFESSIONAL');
  assert.equal(setup.audits.length,1);
  resp=await submit('PRODUCT_DEPENDENT',2);
  assert.equal(resp.status,400);
  assert.equal(setup.audits.length,1);
 }finally{setup.restore()}
});
test('Moderator and restricted accounts cannot change Tutor editions',async()=>{
 for(const config of [{role:'MODERATOR'},{restricted:true}]){
  const setup=stub(config);
  try{
   const r=await adminEndpoint({request:req('/api/admin-learning-engine-versions',{
    method:'POST',headers:{'content-type':'application/json'},
    body:JSON.stringify({action:'setTutorEdition',planCode:'FREE',tutorEdition:'ADVANCED',tutorEditionRevision:1})
   }),env});
   assert.equal(r.status,403);
   assert.equal(setup.audits.length,0);
  }finally{setup.restore()}
 }
});
test('Subscription transitions preserve basic source, never release unbuilt premium Tutor',async()=>{
 const rows=[
 ['FOUNDING_14','FOUNDATION',basic],['FOUNDING_30','ADVANCED',modern],
 ['FOUNDING_60','PROFESSIONAL',modern],['FULL_MONTHLY','PROFESSIONAL',modern],
 ['LIFETIME','ENTERPRISE',modern],['ONDEMAND_MONTHLY','PRODUCT_DEPENDENT',modern],
 ['PICK_WHAT_YOU_WANT','FOUNDATION',basic]
 ];
 for(const [code,tier,expected] of rows){
  const setup=stub({subscription:{plan_code:code,status:'active',current_period_end:'2099-01-01T00:00:00Z'}});
  try{
   const r=await memberEndpoint({request:req('/api/member-learning-engine-versions'),env});
   assert.equal(r.status,200,code);
   const data=await r.json();assert.equal(data.planCode,code);
   assert.deepEqual(data.versions,expected,code);
   assert.equal(data.tutorEdition.configured,tier,code);
   assert.equal(data.tutorEdition.effective,'FOUNDATION','Unreleased premium edition must remain disabled');
   assert.equal(data.tutorEdition.premiumFeaturesAvailable,false);
   assert(setup.calls.every(c=>c.method==='GET'));
  }finally{setup.restore()}
 }
 const revoked=stub({subscription:{plan_code:'FOUNDING_60',status:'canceled',current_period_end:'2026-01-01T00:00:00Z'}});
 try{
  const response=await memberEndpoint({request:req('/api/member-learning-engine-versions'),env}),json=await response.json();
  assert.equal(json.planCode,'FREE');assert.deepEqual(json.versions,basic);
  assert.equal(json.tutorEdition.configured,'FOUNDATION');
 }finally{revoked.restore()}
});
test('Owner Memberships UI renders all plans and issues only the selected Tutor edition save',async()=>{
 const emitted=[],state={data:null};
 const statusNode={textContent:'',setAttribute(){}},tableNode={innerHTML:''},appNode={hidden:false};
 const btn={dataset:{taliaSave:'FOUNDING_30',revision:'1'},disabled:false,
  closest(selector){return selector==='[data-engine-plan]'?row:null;}};
 const row={querySelector(selector){return selector==='[data-talia-edition]'?{value:'ADVANCED'}:null}};
 const panel={contains:()=>true,querySelector(selector){return selector==='[data-engine-status]'?statusNode:selector==='[data-engine-table]'?tableNode:null}};
 let onClick;
 const document={getElementById(id){return id==='admin-learning-engine-assignments'?panel:id==='admin-app'?appNode:null},
  addEventListener(type,fn){if(type==='click')onClick=fn;}};
 const window={getSupabaseClient:async()=>({auth:{getSession:async()=>({data:{session:{access_token:'synthetic'}}})}})};
 const fetch=async(url,opts)=>{
  const body=opts.body?JSON.parse(opts.body):null;
  emitted.push({method:opts.method,url,body});
  if(!body)return response({ok:true,versions:{learning:[basic.learning,modern.learning],lab:[basic.lab,modern.lab],
   tutor:[basic.tutor,modern.tutor]},tutorEditions:['FOUNDATION','ADVANCED','PROFESSIONAL','ENTERPRISE','PRODUCT_DEPENDENT'],
   assignments:plans().map(p=>({planCode:p.plan_code,name:p.name,active:p.active,
    learning:p.metadata.learning_engines_v1?.learning||modern.learning,
    lab:p.metadata.learning_engines_v1?.lab||modern.lab,
    tutor:p.metadata.learning_engines_v1?.tutor||modern.tutor,
    tutorEdition:p.metadata.talia_market_tutor_v1?.tier||'UNASSIGNED',
    tutorEditionRevision:1,revision:1,persisted:true,tutorEditionPersisted:true}))});
  state.data=body;
  return response({ok:true,notice:'Saved',tutorEdition:{tier:body.tutorEdition,revision:2}});
 };
 vm.runInNewContext(source('assets/js/admin-learning-engine-versions-v1.js'),
  {document,window,fetch,confirm:()=>true,console});
 assert.equal(typeof window.GroundUpAdminLearningEngines?.load,'function');
 await window.GroundUpAdminLearningEngines.load();
 assert.match(tableNode.innerHTML,/talia-edition-FOUNDING_30/);
 assert.match(tableNode.innerHTML,/Talia Market Tutor v0\.14\.0\.149 \(Basic\)/);
 assert.match(tableNode.innerHTML,/LIFETIME/);
 await onClick({target:{closest(selector){return selector==='[data-talia-save]'?btn:null;}}});
 assert.equal(state.data.planCode,'FOUNDING_30');
 assert.equal(state.data.action,'setTutorEdition');
 assert.equal(state.data.tutorEdition,'ADVANCED');
 assert.equal(state.data.tutorEditionRevision,1);
 assert.equal(emitted.filter(x=>x.method==='POST').length,1);
 assert.equal(btn.disabled,false);
});
