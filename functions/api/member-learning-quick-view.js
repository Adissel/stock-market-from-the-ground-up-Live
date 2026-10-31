/* Read-only member learning overview: server-stored progress, no client-computed awards.
 * A saved guided Lab stage or Boot Camp reflection is NOT an independently graded achievement.
 */
import {memberIdentity} from './member-tool-access.js';
const H={'content-type':'application/json; charset=utf-8','cache-control':'private, no-store','x-content-type-options':'nosniff'};
const send=(x,s=200)=>new Response(JSON.stringify(x),{status:s,headers:H});
const DAYS=Object.freeze({truth5:['Truth Behind the Ticker',5],watchlist7:['Watchlist',7],scanners10:['Scanners',10],
 foundations30:['Trading Foundations',30],charts45:['Chart Reading',45],risk60:['Risk and Execution',60],
 practicum90:['Advanced Practicum',90],tape10:['Reading the Tape',10],
 indicators10:['Technical Indicators',10],filings7:['SEC Filings',7],free5:['Free Foundations',5]});
const check=n=>Number.isSafeInteger(n)&&n>=0&&n<=100;
const headers=secret=>({apikey:secret,accept:'application/json',
 ...(/^eyJ[A-Za-z0-9_-]+\.eyJ[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+$/.test(secret)?{authorization:'Bearer '+secret}:{})});
async function read(c,path){
 const r=await fetch(c.base+'/rest/v1/'+path,{headers:headers(c.secret),cache:'no-store'});
 if(!r.ok)throw Error('Learning data unavailable');
 return r.json();
}
export async function onRequest({request,env}){
 if(request.method!=='GET')return send({ok:false,error:'Method not allowed'},405);
 try{
  const {userId,config}=await memberIdentity(env,request);
  const uid=encodeURIComponent(userId);
  const [profiles,flags,academy,labs,registry]=await Promise.all([
   read(config,'profiles?select=account_kind,deleted_at&id=eq.'+uid+'&limit=1'),
   read(config,'admin_user_flags?select=status&user_id=eq.'+uid+'&limit=20'),
   read(config,'gu_bootcamp_academy_progress_v014168?select=program_code,day_number,status,updated_at&user_id=eq.'+uid+'&limit=300'),
   read(config,'site_lab_progress?select=lab_id,status,responses,updated_at&user_id=eq.'+uid+'&limit=650'),
   read(config,'platform_labs?select=lab_id,title,active,registry_visible&active=eq.true&registry_visible=eq.true&limit=500')
  ]);
  if(profiles.length!==1||profiles[0].account_kind!=='member'||profiles[0].deleted_at!==null||
    flags.some(x=>['suspended','restricted'].includes(String(x.status||'').toLowerCase())))
   return send({ok:false,error:'Member access unavailable'},403);
  if(!Array.isArray(academy)||!Array.isArray(labs)||!Array.isArray(registry))
   throw Error('Incomplete progress');
  const names=new Map(registry.map(x=>[x.lab_id,x.title]));
  const grouped=new Map();
  for(const x of academy){
   if(!Object.hasOwn(DAYS,x.program_code))continue;
   const g=grouped.get(x.program_code)||{saved:new Set(),started:new Set(),updatedAt:''};
   if(Number.isSafeInteger(x.day_number)&&x.day_number>=1&&x.day_number<=DAYS[x.program_code][1]){
    g.started.add(x.day_number);
    if(x.status==='reflection_saved')g.saved.add(x.day_number);
    if(typeof x.updated_at==='string'&&x.updated_at>g.updatedAt)g.updatedAt=x.updated_at;
   }
   grouped.set(x.program_code,g);
  }
  const list=[];
  for(const [code,g] of grouped){
   const [name,total]=DAYS[code];
   if(!g.started.size||g.saved.size===total)continue;
   const percentage=Math.floor(g.saved.size/total*100);
   list.push({type:'bootcamp',id:code,name,percent:percentage,step:g.saved.size,total,
    metric:'Saved daily reflections (ungraded)',updatedAt:g.updatedAt,
    href:'/bootcamp-academy.html?program='+encodeURIComponent(code),potentialLumens:null});
  }
  for(const row of labs){
   if(!names.has(row.lab_id)||row.status==='completed')continue;
   const journey=row.responses?.learning_journey_v33;
   const stage=journey?.modes?.guided?.stage;
   if(!Number.isSafeInteger(stage)||stage<1||stage>9)continue;
   const pct=Math.floor((stage-1)/9*100);
   if(!check(pct))continue;
   list.push({type:'lab',id:row.lab_id,name:String(names.get(row.lab_id)).slice(0,120),
    percent:pct,step:stage,total:9,metric:'Guided stage reached (not graded)',
    updatedAt:typeof row.updated_at==='string'?row.updated_at:'',
    href:'/labs.html?lab='+encodeURIComponent(row.lab_id),potentialLumens:null});
  }
  list.sort((a,b)=>b.percent-a.percent||b.updatedAt.localeCompare(a.updatedAt)||a.id.localeCompare(b.id));
  return send({ok:true,rankingBasis:'Recorded study progress; not mastery or Lumen eligibility',
   awardAmountsPublished:false,items:list.slice(0,5),startedCount:list.length});
 }catch(e){
  return send({ok:false,error:e?.status===401?'Sign-in required':'Learning progress unavailable'},
   e?.status===401?401:503);
 }
}
