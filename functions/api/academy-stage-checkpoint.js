/* SMFGU Academy stage checkpoints v1: private study draft, NEVER a grade.
 * Dedicated storage contract; original 30-day and Academy reflections untouched.
 */
import {toolAccess} from './member-tool-access.js';
import {academyBetaCourse} from '../_lib/academy-three-camps-beta-access-v1.js';
import {academyByCode} from '../_lib/bootcamp-academy-v014168.js';
const HEAD={'content-type':'application/json; charset=utf-8',
 'cache-control':'private, no-store','x-content-type-options':'nosniff'};
const reply=(value,status=200)=>new Response(JSON.stringify(value),{status,headers:HEAD});
const error=(message,status=400)=>Object.assign(new Error(message),{status});
const BETA=new Set(['tape10','indicators10','filings7']);
const FIELDS=['observations','prediction','practice','transfer','reflection'];
const FLAGS=['predictionLocked','practiceResolved','practiceAssisted','transferResolved','selfReview'];
const COUNTERS=['practiceCount','transferCount'];
function accessible(code,env,userId){
 return code!=='free5'&&Object.hasOwn(academyByCode,code)&&
  (!BETA.has(code)||env?.ACADEMY_THREE_CAMPS_ENABLED==='true'||academyBetaCourse(env,code,userId));
}
function validDay(code,day){
 return Number.isSafeInteger(day)&&day>=1&&day<=(academyByCode[code]?.days||0);
}
function origin(request){
 const expected=new URL(request.url).origin;
 const o=request.headers.get('origin');
 if(o&&o!==expected)throw error('Cross-origin stage writes denied.',403);
 const site=request.headers.get('sec-fetch-site');
 if(site&&!['same-origin','none'].includes(site))throw error('Cross-site stage writes denied.',403);
}
function normalized(snapshot){
 if(!snapshot||typeof snapshot!=='object'||Array.isArray(snapshot)||
   snapshot.version!==1||snapshot.mode!=='guided'||
   !Number.isSafeInteger(snapshot.stage)||snapshot.stage<0||snapshot.stage>8)
  throw error('Invalid ungraded Academy checkpoint.');
 const allowed=new Set(['version','mode','stage','learnerReplies',...FIELDS,...FLAGS,...COUNTERS]);
 if(Object.keys(snapshot).some(key=>!allowed.has(key)))
  throw error('Unexpected checkpoint field. No grade, secret or entitlement can be stored.');
 const out={version:1,mode:'guided',stage:snapshot.stage};
 for(const key of FIELDS){
  if(typeof snapshot[key]!=='string'||snapshot[key].length>1500)
   throw error('Checkpoint text exceeds the instructional limit.');
  out[key]=snapshot[key];
 }
 for(const key of FLAGS){
  if(typeof snapshot[key]!=='boolean')throw error('Invalid instructional checkpoint flag.');
  out[key]=snapshot[key];
 }
 for(const key of COUNTERS){
  if(!Number.isSafeInteger(snapshot[key])||snapshot[key]<0||snapshot[key]>999)
   throw error('Invalid instructional retry counter.');
  out[key]=snapshot[key];
 }
 if(!Array.isArray(snapshot.learnerReplies)||snapshot.learnerReplies.length>9)
  throw error('Invalid instructional reply collection.');
 const seen=new Set();
 out.learnerReplies=snapshot.learnerReplies.map(pair=>{
  if(!Array.isArray(pair)||pair.length!==2||!Number.isSafeInteger(pair[0])||
     pair[0]<0||pair[0]>8||seen.has(pair[0])||
     !Array.isArray(pair[1])||pair[1].length>5||
     pair[1].some(value=>typeof value!=='string'||value.length>500))
   throw error('Invalid instructional reply evidence.');
  seen.add(pair[0]);return [pair[0],pair[1]];
 });
 return out;
}
function dbConfig(env){
 const base=String(env.SUPABASE_URL||'').replace(/\/$/,'');
 const secret=String(env.SUPABASE_SECRET_KEY||'');
 if(!/^https:\/\/[^/]+\.supabase\.co$/.test(base)||!secret)
  throw error('Private Academy stage storage unavailable.',503);
 const headers={apikey:secret,accept:'application/json'};
 if(/^eyJ[A-Za-z0-9_-]+\.eyJ[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+$/.test(secret))
  headers.authorization='Bearer '+secret;
 return {base,headers};
}
async function db(env,path,method='GET',body){
 const c=dbConfig(env),r=await fetch(c.base+'/rest/v1/'+path,{
  method,cache:'no-store',headers:{...c.headers,...(body===undefined?{}:{'content-type':'application/json'})},
  body:body===undefined?undefined:JSON.stringify(body)
 });
 if(!r.ok)throw error('Private Academy stage database rejected the operation.',503);
 try{return await r.json()}catch{throw error('Invalid private Academy stage database response.',503)}
}
async function enrollment(env,userId,code){
 if(code==='foundations30')return; // Original 30-day API owns membership access.
 const rows=await db(env,'gu_bootcamp_academy_enrollments_v014168?select=status,program_version&user_id=eq.'+
  encodeURIComponent(userId)+'&program_code=eq.'+encodeURIComponent(code)+'&limit=1');
 if(!Array.isArray(rows)||rows.length!==1||rows[0].status!=='active'||
  rows[0].program_version!=='0.14.0.168')throw error('Active Academy enrollment required.',403);
}
async function parse(request){
 const declared=Number(request.headers.get('content-length')||0);
 if(!Number.isFinite(declared)||declared>48000)throw error('Stage draft too large.',413);
 const raw=await request.text();
 if(raw.length>48000)throw error('Stage draft too large.',413);
 let data;try{data=JSON.parse(raw)}catch{throw error('Malformed stage draft JSON.')}
 if(!data||typeof data!=='object'||Array.isArray(data))throw error('Invalid stage draft.');
 if(data.action!=='save'||!Number.isSafeInteger(data.expectedRevision)||data.expectedRevision<0)
  throw error('Known stage draft revision required.');
 return {...data,snapshot:normalized(data.snapshot)};
}
export async function onRequest({request,env}){
 try{
  if(!['GET','POST'].includes(request.method))throw error('Method not allowed.',405);
  if(request.method==='POST')origin(request);
  const auth=await toolAccess(env,request,'ONDEMAND_TRAINING');
  const url=new URL(request.url);
  const input=request.method==='POST'?await parse(request):{
   program:url.searchParams.get('program'),day:Number(url.searchParams.get('day'))
  };
  const code=input.program,day=input.day;
  if(!accessible(code,env,auth.userId)||!validDay(code,day))
   throw error('Unknown or unavailable Academy lesson.',404);
  const beta=academyBetaCourse(env,code,auth.userId)&&auth.freeEligible===true;
  if(!auth.userId||(!auth.authorized&&!beta))
   throw error(auth.reason||'Authorized training access required.',403);
  await enrollment(env,auth.userId,code);
  if(request.method==='GET'){
   const rows=await db(env,'gu_academy_stage_checkpoint_v1?select=revision,snapshot,updated_at&user_id=eq.'+
    encodeURIComponent(auth.userId)+'&program_code=eq.'+encodeURIComponent(code)+
    '&day_number=eq.'+day+'&limit=1');
   if(!Array.isArray(rows)||rows.length>1)throw error('Invalid private stage record.',503);
   if(!rows.length)return reply({ok:true,snapshot:null,revision:0});
   const row=rows[0],data=normalized(row.snapshot);
   if(!Number.isSafeInteger(row.revision)||row.revision<1)throw error('Invalid saved stage revision.',503);
   return reply({ok:true,snapshot:data,revision:row.revision,updatedAt:row.updated_at});
  }
  if(!input.snapshot)throw error('Missing ungraded stage checkpoint.');
  const saved=await db(env,'rpc/gu_academy_stage_checkpoint_save_v1','POST',{
   p_user:auth.userId,p_program:code,p_day:day,
   p_snapshot:input.snapshot,p_expected_revision:input.expectedRevision
  });
  if(saved?.conflict===true)return reply({ok:false,error:'Another device or tab saved a newer draft. Reload this lesson before saving again.'},409);
  if(saved?.ok!==true||saved.program!==code||saved.day!==day||
    saved.revision!==input.expectedRevision+1||saved.graded!==false||
    saved.competencyMasteryAwarded!==false)
   throw error('Stage draft was not confirmed saved.',503);
  return reply({ok:true,saved:{rev:saved.revision},
   disclaimer:'Ungraded stage saved privately. Original day reflection and official results unchanged.'});
 }catch(e){
  const status=[400,401,403,404,405,409,413].includes(e.status)?e.status:503;
  return reply({ok:false,error:status===503?'Private Academy stage storage unavailable.':
   e.message||'Stage draft unavailable.'},status);
 }
}
