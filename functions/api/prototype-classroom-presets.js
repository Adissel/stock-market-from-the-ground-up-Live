/* Classroom preset service V1 — Owner/Admin protected read and draft writes only.
 * The live Lab/Boot Camp engines NEVER read these draft records. No publish route,
 * entitlement mutation, grade data, or payment data here.
 */
import {verifyPrototypeStaff,serviceKey} from './prototype-training-cases.js';
const noStore={'content-type':'application/json; charset=utf-8','cache-control':'private, no-store, max-age=0','x-content-type-options':'nosniff','x-robots-tag':'noindex, nofollow','vary':'Authorization'};
const reply=(status,body)=>new Response(JSON.stringify(body),{status,headers:noStore});
const validCode=s=>typeof s==='string'&&/^[A-Z0-9_]{3,48}$/.test(s);
const validPreset=s=>typeof s==='string'&&/^[a-z0-9-]{3,48}$/.test(s);
const allowedKeys=new Set(['id','label','layout','density','tutor','detail','barWidth','wickWidth','chartHeight','grid','labels','highContrast','showVolume','teachingNotes']);
const oneOf=(x,items)=>items.includes(x);
export function validateClassroomDraft(c){
 if(!c||Array.isArray(c)||typeof c!=='object')return false;
 const keys=Object.keys(c);
 if(keys.length!==14||keys.some(k=>!allowedKeys.has(k)))return false;
 if(!validPreset(c.id)||typeof c.label!=='string'||c.label.length<3||c.label.length>100)return false;
 if(!oneOf(c.layout,['Balanced','Reading-first','Chart-first'])||
    !oneOf(c.density,['Comfortable','Compact'])||
    !oneOf(c.tutor,['Right','Bottom'])||
    !oneOf(c.detail,['Clean','Analytical','Technical','Instructional','Expert']))return false;
 for(const [k,min,max] of [['barWidth',6,36],['wickWidth',1,5],['chartHeight',260,680]]){
  if(typeof c[k]!=='number'||!Number.isFinite(c[k])||c[k]<min||c[k]>max)return false;
 }
 for(const k of ['grid','labels','highContrast','showVolume','teachingNotes'])if(typeof c[k]!=='boolean')return false;
 return JSON.stringify(c).length<=4096;
}
const encoding=x=>encodeURIComponent(x);
export async function onRequest({request,env}){
 if(!['GET','PUT'].includes(request.method))return reply(405,{ok:false,error:'Method not allowed'});
 try{
  const who=await verifyPrototypeStaff(request,env);
  if(who.status!==200)return reply(who.status,{ok:false,error:'Staff authorization required'});
  const base=String(env.SUPABASE_URL||'').replace(/\/$/,'');
  const headers={...serviceKey(env.SUPABASE_SECRET_KEY),accept:'application/json','content-type':'application/json'};
  const fetchTable=async path=>{
   const res=await fetch(base+'/rest/v1/'+path,{headers,cache:'no-store'});
   if(!res.ok)throw Error('Classroom registry read unavailable');
   const rows=await res.json();if(!Array.isArray(rows))throw Error('Invalid registry response');
   return rows;
  };
  if(request.method==='GET'){
   const [presets,memberships,layouts,history]=await Promise.all([
    fetchTable('cl_classroom_presets?select=preset_code,label,config,active&active=eq.true&order=preset_code'),
    fetchTable('cl_classroom_membership_codes?select=plan_code,display_name,default_preset_code,active&active=eq.true&order=plan_code'),
    fetchTable('cl_classroom_layouts?select=plan_code,channel,version,preset_code,config,updated_at&order=plan_code,channel'),
    fetchTable('cl_classroom_layout_history?select=plan_code,channel,version,preset_code,config,actor_user_id,recorded_at&order=recorded_at.desc&limit=100')
   ]);
   return reply(200,{ok:true,registry:'classroom-v1',presets,memberships,layouts,history,
    isDraftOnly:true,memberFacingEnabled:false});
  }
  const raw=await request.text();
  if(raw.length>8192)return reply(413,{ok:false,error:'Payload too large'});
  let data;try{data=JSON.parse(raw)}catch{return reply(400,{ok:false,error:'Invalid JSON'})}
  const restoring=data?.action==='restoreDraft';
  if(!data||!['saveDraft','restoreDraft'].includes(data.action)||!validCode(data.planCode)||!Number.isInteger(data.expectedVersion)||
    data.expectedVersion<1||data.expectedVersion>2147483645||
    (restoring?(!Number.isInteger(data.targetVersion)||data.targetVersion<1||data.targetVersion>=data.expectedVersion):
     !validateClassroomDraft(data.config))){
   return reply(400,{ok:false,error:'Invalid draft revision request'});
  }
  // Restoration is always a new audited DRAFT revision. The browser cannot
  // provide a prior configuration or bypass the protected server history.
  let proposed=data.config;
  if(restoring){
   const savedHistory=await fetchTable('cl_classroom_layout_history?select=plan_code,channel,version,preset_code,config&plan_code=eq.'+
    encoding(data.planCode)+'&channel=eq.draft&version=eq.'+data.targetVersion+'&limit=1');
   if(savedHistory.length!==1||!validateClassroomDraft(savedHistory[0].config)||
      savedHistory[0].preset_code!==savedHistory[0].config.id)
    return reply(422,{ok:false,error:'Requested historical draft not available'});
   proposed=savedHistory[0].config;
  }
  const [member,preset]=await Promise.all([
    fetchTable('cl_classroom_membership_codes?select=plan_code&plan_code=eq.'+encoding(data.planCode)+'&active=eq.true&limit=1'),
    fetchTable('cl_classroom_presets?select=preset_code,label&preset_code=eq.'+encoding(proposed.id)+'&active=eq.true&limit=1')
  ]);
  if(member.length!==1||preset.length!==1)return reply(422,{ok:false,error:'Membership or preset is not registered'});
  // Correct human-visible preset title from registered immutable catalogue.
  const config={...proposed,label:preset[0].label};
  const where='cl_classroom_layouts?plan_code=eq.'+encoding(data.planCode)+'&channel=eq.draft&version=eq.'+data.expectedVersion+'&select=plan_code,channel,version,preset_code,config,updated_at';
  const result=await fetch(base+'/rest/v1/'+where,{method:'PATCH',headers:{...headers,prefer:'return=representation'},body:JSON.stringify({
   config,preset_code:config.id,editor_user_id:who.userId,version:data.expectedVersion+1,updated_at:new Date().toISOString()
  }),cache:'no-store'});
  if(!result.ok)return reply(503,{ok:false,error:'Preset write unavailable'});
  const rows=await result.json();
  if(!Array.isArray(rows))throw Error('Unexpected write response');
  if(rows.length===0)return reply(409,{ok:false,error:'Draft version changed: reload before saving'});
  if(rows.length!==1)return reply(503,{ok:false,error:'Unexpected draft update count'});
  return reply(200,{ok:true,saved:rows[0],revisionCaptured:true,published:false,restoredFromVersion:restoring?data.targetVersion:null});
 }catch{return reply(503,{ok:false,error:'Classroom registry unavailable; no change confirmed'})}
}
