/* Original SEC event-time research assessment for Crownlight Scanner.
 * Consumes only already-authorized normalized SEC API response; no network
 * fetch, no first-public-dissemination or trade claims.
 */
(function(root){
'use strict';
const TYPES=Object.freeze(['8-K','8-K/A','10-K','10-K/A','10-Q','10-Q/A','S-1','S-1/A','424B2','424B3','424B4','424B5','4','4/A','3','5','SC 13D','SC 13G','DEF 14A','6-K','20-F']);
const TYPE_SET=new Set(TYPES);
const SYMBOL=/^[A-Z][A-Z0-9.-]{0,11}$/;
const DATE=/^\d{4}-\d{2}-\d{2}$/;
const TIME=/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d+)?(?:Z|[+-]\d{2}:\d{2})$/;
const safeTime=x=>typeof x==='string'&&TIME.test(x)&&Number.isFinite(Date.parse(x))?Date.parse(x):null;
function safeFilingUrl(value,cik,accession){
 if(typeof value!=='string'||value.length>450||typeof accession!=='string'||!/^\d{10}-\d{2}-\d{6}$/.test(accession))return false;
 try{
  const url=new URL(value),prefix='/Archives/edgar/data/'+String(cik)+'/'+accession.replaceAll('-','')+'/';
  const rest=url.pathname.slice(prefix.length);
  return url.protocol==='https:'&&url.hostname==='www.sec.gov'&&
    !url.username&&!url.password&&!url.port&&!url.search&&!url.hash&&
    url.pathname.startsWith(prefix)&&rest.length>0&&!rest.includes('..')&&/^[\w/.-]+$/.test(rest);
 }catch{return false}
}
function assess(response,symbol,at,config={}){
 const ticker=String(symbol||'').trim().toUpperCase(),now=safeTime(at);
 if(!SYMBOL.test(ticker)||now===null)throw Error('Valid ticker and exact evaluation time required.');
 if(!config||typeof config!=='object'||Array.isArray(config))throw Error('Invalid SEC research options.');
 const hours=config.windowHours===undefined?24:config.windowHours;
 if(![24,72].includes(hours))throw Error('Only 24h and 72h retrospective windows supported.');
 const forms=config.forms===undefined?['8-K','8-K/A','10-Q','10-K']:config.forms;
 if(!Array.isArray(forms)||forms.length<1||forms.length>12||new Set(forms).size!==forms.length||
  forms.some(f=>!TYPE_SET.has(f)))throw Error('Select valid unique SEC filing types.');
 const unavailable=reason=>({symbol:ticker,match:'UNAVAILABLE',reason,windowHours:hours,
  acceptedFilings:[],excluded:{unknownTime:0,outsideWindow:0,future:0,invalid:0},
  firstPublicDisseminationKnown:false,historicalTradeDecisionEligible:false,liveQuote:false,tradeSignal:false,source:'SEC_EDGAR'});
 if(!response||response.ok!==true||response.identityStatus!=='MATCHED')return unavailable('SEC_ISSUER_NOT_CONFIRMED');
 if(response.authorizedSource!==true||response.source!=='SEC_EDGAR_PRIMARY'||
    String(response.symbol||'').toUpperCase()!==ticker||
    !Number.isSafeInteger(Number(response.cik))||Number(response.cik)<=0||
    Number(response.cik)>=10000000000||!Array.isArray(response.filings)||response.filings.length>60)
  return unavailable('SEC_PROVENANCE_OR_IDENTITY_INVALID');
 const observed=safeTime(response.observedAt);
 if(observed===null||observed>now)return unavailable('SEC_OBSERVATION_AFTER_DECISION_CUTOFF');
 const acceptedFilings=[],excluded={unknownTime:0,outsideWindow:0,future:0,invalid:0};
 const start=now-hours*3600000,cik=Number(response.cik),seen=new Set();
 for(const f of response.filings){
  if(!f||typeof f!=='object'||!forms.includes(f.form))continue;
  if(!safeFilingUrl(f.sourceUrl,cik,f.accession)||!DATE.test(f.filedDate||'')){
   excluded.invalid++;continue;
  }
  if(seen.has(f.accession))continue;seen.add(f.accession);
  const accepted=safeTime(f.acceptedAt);
  if(accepted===null){excluded.unknownTime++;continue;}
  if(accepted>now){excluded.future++;continue;}
  if(accepted<start){excluded.outsideWindow++;continue;}
  acceptedFilings.push({form:f.form,accession:f.accession,filedDate:f.filedDate,
   acceptedAt:new Date(accepted).toISOString(),sourceUrl:f.sourceUrl,
   publicationTimeKnown:false,historicalReplayEligible:false});
 }
 acceptedFilings.sort((a,b)=>b.acceptedAt.localeCompare(a.acceptedAt)||a.accession.localeCompare(b.accession));
 return {symbol:ticker,cik,match:acceptedFilings.length?'SEC_ACCEPTED_IN_WINDOW':
  excluded.unknownTime||excluded.invalid?'INSUFFICIENT_EVENT_TIME':'NO_SEC_ACCEPTANCE_IN_WINDOW',
  windowHours:hours,asOf:new Date(now).toISOString(),acceptedFilings,excluded,
  firstPublicDisseminationKnown:false,historicalTradeDecisionEligible:false,
  liveQuote:false,tradeSignal:false,source:'SEC_EDGAR_PRIMARY',
  interpretation:'SEC acceptance is not first public dissemination, a market catalyst confirmation, or a trading opportunity.'};
}
root.CrownlightSecEvidenceV1=Object.freeze({TYPES,assess,safeFilingUrl});
})(globalThis);
