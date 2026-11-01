/* Owner-only audited version assignments. Presentation versions NEVER create entitlements. */
import {authorizeLearningPlanOwner} from './plan-controls.js';
const H={'content-type':'application/json; charset=utf-8','cache-control':'private, no-store','x-content-type-options':'nosniff'};
const out=(obj,status=200)=>new Response(JSON.stringify(obj),{status,headers:H});
const err=(msg,status=400)=>Object.assign(new Error(msg),{status});
const allowed=Object.freeze({
 learning:['LEARNING_V33_FREEZE_20261101','LEARNING_V33_CURRENT'],
 lab:['LAB_V32_FREEZE_20261101','LAB_V32_CURRENT'],
 tutor:['TALIA_FREEZE_20261101','TALIA_CURRENT']
});
const defaults=code=>['FREE','PICK_WHAT_YOU_WANT'].includes(code)
 ?{learning:allowed.learning[0],lab:allowed.lab[0],tutor:allowed.tutor[0]}
 :{learning:allowed.learning[1],lab:allowed.lab[1],tutor:allowed.tutor[1]};
function config(env){const base=String(env.SUPABASE_URL||'').replace(/\/$/,''),secret=String(env.SUPABASE_SECRET_KEY||'');if(!/^https:\/\//.test(base)||!secret)throw err('Administrative database unavailable',503);return{base,secret}}
async function db(env,path,body){const c=config(env),r=await fetch(c.base+'/rest/v1/'+path,{method:body?'POST':'GET',cache:'no-store',headers:{apikey:c.secret,...(/^eyJ[A-Za-z0-9_-]+\.eyJ[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+$/.test(c.secret)?{authorization:'Bearer '+c.secret}:{}),accept:'application/json',...(body?{'content-type':'application/json'}:{})},body:body?JSON.stringify(body):undefined});const j=await r.json().catch(()=>null);if(!r.ok)throw err(r.status===404?'Engine assignment migration not installed':'Version database request failed',503);return j}
export async function onRequest({request,env}){
 try{
  const actor=await authorizeLearningPlanOwner(env,request);
  if(request.method==='GET'){
   const plans=await db(env,'platform_plans?select=plan_code,name,active,public_visible,metadata&order=sort_order.asc');
   return out({ok:true,versions:allowed,assignments:plans.map(p=>{
    const stored=p.metadata?.learning_engines_v1;
    const d=defaults(p.plan_code);
    return{planCode:p.plan_code,name:p.name,active:p.active,publicVisible:p.public_visible,
     learning:allowed.learning.includes(stored?.learning)?stored.learning:d.learning,
     lab:allowed.lab.includes(stored?.lab)?stored.lab:d.lab,
     tutor:allowed.tutor.includes(stored?.tutor)?stored.tutor:d.tutor,
     revision:Number.isSafeInteger(stored?.revision)?stored.revision:0,
     persisted:!!stored,updatedAt:stored?.updated_at||null};
   })});
  }
  if(request.method!=='POST')return out({ok:false,error:'Method not allowed'},405);
  const b=await request.json().catch(()=>null);
  if(!b||JSON.stringify(b).length>1200)throw err('Invalid version assignment');
  const planCode=String(b.planCode||'').trim().toUpperCase();
  if(!/^[A-Z][A-Z0-9_]{1,63}$/.test(planCode))throw err('Invalid membership code');
  for(const key of ['learning','lab','tutor'])
   if(!allowed[key].includes(b[key]))throw err('Unsupported '+key+' version: cannot assign an undeployed engine');
  if(!Number.isSafeInteger(b.revision)||b.revision<0)throw err('Invalid revision');
  const result=await db(env,'rpc/gu_owner_assign_learning_engines_v1',{
   p_actor:actor,p_code:planCode,p_learning:b.learning,p_lab:b.lab,p_tutor:b.tutor,p_expected_revision:b.revision
  });
  if(!result||result.learning!==b.learning||result.lab!==b.lab||result.tutor!==b.tutor)
   throw err('Assignment was not confirmed',503);
  return out({ok:true,planCode,assignment:result,notice:'Audited engine assignment saved. Content and billing entitlements are unchanged.'});
 }catch(e){return out({ok:false,error:e.message||'Engine version controls unavailable'},e.status||503)}
}
