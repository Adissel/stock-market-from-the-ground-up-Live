/* Authenticated member Talia lesson catalog and source-only lesson delivery.
 * Distinct from prerelease premium analytics and the existing free-form Tutor.
 */
import {toolAccess} from './member-tool-access.js';
import {verifyTaliaTeachingDepth} from '../_lib/talia-teaching-entitlement-v1.js';
import {TUTOR_LESSONS,TEACHING_DEPTHS,LESSON_PHASES,depthIndex,buildTaliaLesson} from '../_lib/talia-classroom-curriculum-v1.js';
const HEADERS={'content-type':'application/json; charset=utf-8','cache-control':'private, no-store','vary':'Authorization'};
const out=(value,status=200)=>new Response(JSON.stringify(value),{status,headers:HEADERS});
const error=(message,status=400)=>Object.assign(new Error(message),{status});
export async function onRequest({request,env}){
 try{
  if(!['GET','POST'].includes(request.method))return out({ok:false,error:'Method not allowed.'},405);
  const origin=request.headers.get('origin'),url=new URL(request.url);
  if(origin&&origin!==url.origin)throw error('Cross-origin classroom request refused.',403);
  const fetchSite=request.headers.get('sec-fetch-site');
  if(fetchSite&&!['same-origin','none'].includes(fetchSite))
   throw error('Cross-site classroom request refused.',403);
  const access=await toolAccess(env,request,'MARKET_TUTOR');
  if(access.authorized!==true&&access.freeEligible!==true)
   throw error('Eligible member sign-in required.',403);
  const entitlement=await verifyTaliaTeachingDepth(env,access.userId);
  if(request.method==='GET')return out({ok:true,lessons:TUTOR_LESSONS,
   depths:TEACHING_DEPTHS,phases:LESSON_PHASES,...entitlement,
   notice:'Original ungraded teaching. Selection does not unlock premium Tutor analytics, purchases, AI, grades or private market data.'});
  if(!/^application\/json(?:\s*;|\s*$)/i.test(request.headers.get('content-type')||''))
   throw error('Classroom requests require JSON.',415);
  const len=Number(request.headers.get('content-length')||0);
  if(!Number.isSafeInteger(len)||len>2500)throw error('Request too large.',413);
  const raw=await request.text();
  if(new TextEncoder().encode(raw).length>2500)throw error('Request too large.',413);
  let body;try{body=JSON.parse(raw)}catch{throw error('Invalid classroom JSON.')}
  if(!body||typeof body!=='object'||Array.isArray(body)||
     Object.keys(body).some(k=>!['topic','depth','phase','chartContext'].includes(k)))
   throw error('Unsupported classroom request fields.');
  const {topic,depth,phase}=body;
  if(typeof topic!=='string'||typeof depth!=='string'||typeof phase!=='string'||
    !TUTOR_LESSONS.some(t=>t.id===topic)||!TEACHING_DEPTHS.includes(depth)||!LESSON_PHASES.includes(phase))
   throw error('Choose a valid topic, depth and learning step.');
  if(Object.hasOwn(body,'chartContext')&&(!body.chartContext||typeof body.chartContext!=='object'||Array.isArray(body.chartContext)))
   throw error('Chart evidence context must be a validated object.');
  if(Object.hasOwn(body,'chartContext')&&!TUTOR_LESSONS.find(t=>t.id===topic)?.chart)
   throw error('This topic has no synchronized chart lesson.');
  if(depthIndex(depth)>depthIndex(entitlement.maximumDepth))
   return out({ok:false,error:'This teaching depth exceeds the active verified Tutor entitlement.',
    maximumDepth:entitlement.maximumDepth},403);
  const lesson=buildTaliaLesson({topic,depth,phase,...(Object.hasOwn(body,'chartContext')?{chartContext:body.chartContext}:{})});
  return out({ok:true,...lesson,maximumDepth:entitlement.maximumDepth,
   sources:[{id:'CROWN-TALIA-ORIGINAL-LESSON',title:'Original Crownlight classroom teaching material',
    sourceLabel:'Original ungraded educational example. When chart context is present, OHLC and studies are reconstructed from canonical completed fictional replay, not user-provided prices or a licensed feed'}],
   historySaved:false,memberRecordWritten:false,aiReason:'original_source_only',
   notice:'Source-only ungraded instruction. No grades, purchases, paid AI calls, or protected case data.'});
 }catch(e){
  const status=[400,401,403,405,413,415,429].includes(e.status)?e.status:503;
  return out({ok:false,error:status===503?'Classroom membership verification is temporarily unavailable.':String(e.message||'Classroom request unavailable.')},status);
 }
}
