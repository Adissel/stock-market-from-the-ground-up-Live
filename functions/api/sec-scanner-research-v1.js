/* Crownlight SEC Scanner: independent tiered, source-verified single issuer route.
 * This route shares the protected original issuer retrieval and SEC budget.
 * The pre-existing Watchlist endpoint remains unchanged for its members.
 */
import {secTierContext,tierAtLeast} from '../_lib/sec-scanner-tier-v1.js';
import {fetchIssuerResearch} from './sec-issuer-research-v1.js';
import {VALID_SYMBOL} from '../_lib/sec-issuer-normalize-v1.js';
const HEAD={'content-type':'application/json; charset=utf-8','cache-control':'private, no-store',
 'x-content-type-options':'nosniff'};
const send=(obj,status=200)=>new Response(JSON.stringify(obj),{status,headers:HEAD});
export async function onRequest({request,env}){
 try{
  if(request.method!=='GET')return send({ok:false,error:'READ_ONLY'},405);
  const u=new URL(request.url),keys=[...u.searchParams.keys()];
  if(keys.some(x=>!['symbol','include'].includes(x))||
     keys.filter(x=>x==='symbol').length!==1||keys.filter(x=>x==='include').length>1)
   return send({ok:false,error:'UNSUPPORTED_QUERY'},400);
  const symbol=String(u.searchParams.get('symbol')||'').trim().toUpperCase();
  const include=u.searchParams.get('include')||'filings';
  if(!VALID_SYMBOL.test(symbol)||!['filings','fundamentals'].includes(include))
   return send({ok:false,error:'INVALID_ISSUER_REQUEST'},400);
  const {actor,tier,capabilities}=await secTierContext(env,request);
  if(include==='fundamentals'&&!tierAtLeast(tier,'ADVANCED'))
   return send({ok:false,error:'SEC_ADVANCED_ENTITLEMENT_REQUIRED'},403);
  const research=await fetchIssuerResearch(actor,env,symbol,include);
  if(research.identityStatus!=='MATCHED')return send({...research,tier,capabilities});
  const filings=Array.isArray(research.filings)?research.filings:[];
  const scoped=filings.map(f=>{
   if(tierAtLeast(tier,'PLUS'))return f;
   const {acceptedAt,publishedAt,publicationTimeKnown,timingLimitation,
    historicalReplayEligible,...base}=f;
   return base;
  });
  return send({...research,filings:scoped,tier,capabilities,
   fundamentals:tierAtLeast(tier,'ADVANCED')?research.fundamentals:null,
   tierPolicy:'SERVER_ENFORCED',marketWideScanner:false,firstPublicDisseminationKnown:false,
   tradeSignal:false,note:'SEC issuer research; acceptance is not first public dissemination. No live scanner or trading recommendation.'});
 }catch(e){
  const status=[400,401,403,404,405,429].includes(e?.status)?e.status:503;
  return send({ok:false,error:status===503?'SEC source or tier verification unavailable.':e.message},status);
 }
}
