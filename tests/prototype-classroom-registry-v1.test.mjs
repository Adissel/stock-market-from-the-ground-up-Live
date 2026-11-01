import assert from 'node:assert/strict';
import {onRequest,validateClassroomDraft} from '../functions/api/prototype-classroom-presets.js';
import fs from 'node:fs';
const source=fs.readFileSync('assets/js/prototype-membership-builder-v1.js','utf8');
const seed=source.match(/const definitions=\[([\s\S]*?)\];/)?.[1]||'';
const ids=Array.from(seed.matchAll(/\['([a-z0-9-]+)'/g),m=>m[1]);
assert.equal(ids.length,20);
const preset=ids.map(id=>({preset_code:id,label:id,config:{id},active:true}));
const plans=['FREE','PICK_WHAT_YOU_WANT','FOUNDING_14','FOUNDING_30','FOUNDING_60','FULL_MONTHLY','FULL_ANNUAL','LIFETIME','ONDEMAND_MONTHLY'];
let layouts=plans.map(code=>({plan_code:code,channel:'draft',version:1,preset_code:ids[0],config:{id:ids[0]}}));
const config={id:'analysis-desk',label:'Analysis Desk',layout:'Chart-first',density:'Comfortable',tutor:'Right',detail:'Technical',barWidth:16,wickWidth:2,chartHeight:450,grid:true,labels:true,highContrast:false,showVolume:true,teachingNotes:true};
assert.equal(validateClassroomDraft(config),true);
assert.equal(validateClassroomDraft({...config,isAdmin:true}),false);
assert.equal(validateClassroomDraft({...config,barWidth:100}),false);
assert.equal(validateClassroomDraft({...config,grid:'false'}),false);
for(const layout of layouts)layout.config={...config,id:ids[0],label:ids[0]};
const history=layouts.map(x=>({...x,config:{...x.config}}));
let role='OWNER';
const oldFetch=globalThis.fetch;
const ok=value=>new Response(JSON.stringify(value),{status:200,headers:{'content-type':'application/json'}});
globalThis.fetch=async(url,opt={})=>{
 const path=String(url);
 if(path.includes('/auth/v1/user'))return ok({id:'00000000-0000-4000-8000-000000000007'});
 if(path.includes('admin_user_roles'))return ok([{role_code:role,expires_at:null}]);
 if(path.includes('profiles?'))return ok([{account_kind:'member',deleted_at:null}]);
 if(path.includes('admin_user_flags'))return ok([{status:'active'}]);
 if(path.includes('admin_role_permissions'))return ok([{permission_code:'control_panel.access'}]);
 if(path.includes('cl_classroom_presets?'))return ok(path.includes('preset_code=eq.')?[{preset_code:'analysis-desk',label:'Analysis Desk'}]:preset);
 if(path.includes('cl_classroom_membership_codes?'))return ok(path.includes('plan_code=eq.')?[{plan_code:'FREE'}]:plans.map(plan_code=>({plan_code,active:true})));
 if(path.includes('cl_classroom_layout_history?')){
  const plan=/plan_code=eq\.([A-Z0-9_]+)/.exec(path)?.[1],v=/version=eq\.(\d+)/.exec(path)?.[1];
  return ok(history.filter(x=>(!plan||x.plan_code===plan)&&(!v||x.version===Number(v))));
 }
 if(path.includes('cl_classroom_layouts?')){
  if(opt.method==='PATCH'){
   const expected=Number(/version=eq\.(\d+)/.exec(path)?.[1]);
   const row=layouts.find(x=>x.plan_code==='FREE');
   if(row.version!==expected)return ok([]);
   const update=JSON.parse(opt.body);Object.assign(row,update);
   history.unshift({...row,config:{...row.config}});
   return ok([row]);
  }
  return ok(layouts);
 }
 throw Error('Unexpected synthetic endpoint '+path);
};
const env={SUPABASE_URL:'https://abcdefghijklmnopqrst.supabase.co',SUPABASE_PUBLISHABLE_KEY:'SYNTHETIC_PUBLIC',SUPABASE_SECRET_KEY:'sb_secret_synthetic'};
async function call(method='GET',payload,authorized=true){
 const req=new Request('https://example.test/api/prototype-classroom-presets',{method,headers:authorized?{authorization:'Bearer test-jwt'}:{},...(payload?{body:JSON.stringify(payload)}:{})});
 const res=await onRequest({request:req,env});return {status:res.status,data:await res.json(),headers:res.headers};
}
try{
 assert.equal((await call('GET',null,false)).status,401);
 role='MODERATOR';assert.equal((await call()).status,403);
 role='OWNER';let result=await call();assert.equal(result.status,200);
 assert.equal(result.data.presets.length,20);assert.equal(result.data.memberships.length,9);
 assert.equal(result.data.isDraftOnly,true);
 assert.ok(result.data.memberships.some(p=>p.plan_code==='PICK_WHAT_YOU_WANT'));
 const pickMigration=fs.readFileSync('supabase/migrations/20261101_cl_classroom_pick_what_you_want_v1.sql','utf8');
 assert.match(pickMigration,/INSERT INTO public\.cl_classroom_membership_codes/);
 assert.match(pickMigration,/INSERT INTO public\.cl_classroom_layouts/);
 assert.match(pickMigration,/ON CONFLICT \(plan_code,channel\) DO NOTHING/);
 assert.doesNotMatch(pickMigration,/UPDATE public\.(?:site_subscriptions|platform_plans)|stripe|checkout_enabled|price_cents|wallet/i);
assert.equal(result.data.memberFacingEnabled,false);
 result=await call('PUT',{action:'saveDraft',planCode:'FREE',expectedVersion:1,config});assert.equal(result.status,200);assert.equal(result.data.saved.version,2);
 assert.equal(result.data.published,false);
 result=await call('PUT',{action:'saveDraft',planCode:'FREE',expectedVersion:1,config});assert.equal(result.status,409);
 result=await call('PUT',{action:'restoreDraft',planCode:'FREE',expectedVersion:2,targetVersion:1});
 assert.equal(result.status,200);assert.equal(result.data.saved.version,3);
 assert.equal(result.data.restoredFromVersion,1);
 assert.equal(result.data.published,false);
 assert.equal(result.data.saved.config.id,ids[0]);
 assert.equal(history.filter(x=>x.plan_code==='FREE').length,3,'Restoration appends history instead of overwriting it');
 result=await call('PUT',{action:'restoreDraft',planCode:'FREE',expectedVersion:2,targetVersion:1});assert.equal(result.status,409);
 result=await call('PUT',{action:'restoreDraft',planCode:'FREE',expectedVersion:3,targetVersion:3});assert.equal(result.status,400);
 result=await call('PUT',{action:'restoreDraft',planCode:'FREE',expectedVersion:3,targetVersion:0});assert.equal(result.status,400);
 result=await call('PUT',{action:'publish',planCode:'FREE',expectedVersion:3,config});assert.equal(result.status,400,'no member-facing publish API yet');
 role='FREE';assert.equal((await call('PUT',{action:'saveDraft',planCode:'FREE',expectedVersion:3,config})).status,403);
 assert.equal((await call('PUT',{action:'restoreDraft',planCode:'FREE',expectedVersion:3,targetVersion:1})).status,403);
 const ui=fs.readFileSync('assets/js/prototype-preset-sync-v1.js','utf8');
 assert.match(ui,/Compare with earlier draft/);
 assert.match(ui,/Restore selected revision/);
 assert.match(ui,/A NEW audited draft revision/);
 console.log('PASS 20 presets, 9 plan drafts, guarded save and rollback, immutable revisions, conflicts, no publish and denied roles.');
}finally{globalThis.fetch=oldFetch}
