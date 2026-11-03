/* Enterprise Learning/Lab read-only fictional two-case source workbench.
 * A positive current signed-in member entitlement and release flag are
 * required BEFORE reading or evaluating any submitted case.
 */
import {authorizeEditionRequest} from './learning-lab-edition-exercise.js';
import {compareOriginalFictionalCases}
 from '../_lib/learning-lab-enterprise-case-workbench-v1.js';
const H={'content-type':'application/json; charset=utf-8','cache-control':'private, no-store',
 'vary':'Authorization','x-content-type-options':'nosniff'};
const respond=(body,status=200)=>new Response(JSON.stringify(body),{status,headers:H});
const fail=(message,status)=>Object.assign(new Error(message),{status});
const MAX=64000;
export async function onRequest({request,env}){
 try{
  if(request.method!=='POST')return respond({ok:false,error:'Method not allowed.'},405);
  const origin=request.headers.get('origin'),site=request.headers.get('sec-fetch-site');
  if(origin&&origin!==new URL(request.url).origin)throw fail('Cross-origin denied.',403);
  if(site&&!['same-origin','none'].includes(site))throw fail('Cross-site denied.',403);
  const declared=Number(request.headers.get('content-length')||0);
  if(declared>MAX)throw fail('Case comparison too large.',413);
  const raw=await request.text();
  if(raw.length>MAX)throw fail('Case comparison too large.',413);
  let body;try{body=JSON.parse(raw)}catch{throw fail('Invalid fictional case payload.',400)}
  if(!body||typeof body!=='object'||Array.isArray(body)||
     !['learning','lab'].includes(body.family)||!Array.isArray(body.cases))
   throw fail('Unsupported research case or engine.',400);
  await authorizeEditionRequest({request,env,family:body.family,edition:'ENTERPRISE'});
  const result=compareOriginalFictionalCases({cases:body.cases,embargo:body.embargo??2});
  if(!result)throw fail('Completed fictional cases or chronology invalid.',400);
  return respond({ok:true,family:body.family,edition:'ENTERPRISE',result,
   memberRecordsModified:false,externalFeedUsed:false,
   officialGrade:false,masteryAwarded:false});
 }catch(e){
  const status=[400,401,403,405,413].includes(e?.status)?e.status:503;
  return respond({ok:false,error:status===503?'Enterprise case comparison unavailable.':
   e.message||'Enterprise case comparison denied.'},status);
 }
}
