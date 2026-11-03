/* D07 v0.14.0.147: pure bounded Tutor input/security boundary.
 * Validate BEFORE consuming the member's optional source or paid request
 * quotas. Never rely on client-side consent or size controls.
 */
const validId=/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const fail=(message,status=400)=>Object.assign(new Error(message),{status});
export async function parseTutorRequest(request){
 const url=new URL(request.url),origin=request.headers.get('origin');
 if(origin&&origin!==url.origin)throw fail('Cross-origin Tutor submission refused.',403);
 const site=request.headers.get('sec-fetch-site');
 if(site&&!['same-origin','none'].includes(site))
  throw fail('Cross-site Tutor submission refused.',403);
 if(!/^application\/json(?:\s*;|\s*$)/i.test(request.headers.get('content-type')||''))
  throw fail('Tutor requests require JSON content.',415);
 const size=Number(request.headers.get('content-length')||0);
 if(!Number.isSafeInteger(size)||size<0||size>8000)throw fail('Request too large.',413);
 const raw=await request.text();
 if(new TextEncoder().encode(raw).length>8000)throw fail('Request too large.',413);
 let body;try{body=JSON.parse(raw)}catch{throw fail('Invalid JSON.')}
 // A browser cannot assert staff authority, effective editions, grades, source
 // provenance or hidden case data. Retain legacy priorTurns compatibility, but
 // never trust those turns as context (see priorTurnsSupplied below).
 const forbiddenClientClaims=new Set([
  'userId','memberId','accountKind','role','roles','isAdmin','staffOverride',
  'tier','edition','targetEdition','effectiveEdition','membership','entitlement',
  'entitlements','permissions','officialGrade','grade','score','masteryAwarded',
  'progressVerified','completedPrerequisite','answerKey','rubric','privateRubric',
  'assessmentAnswer','futureBars','replayBars','replayCandles','verifiedContext',
  'labTitle','academyTitle','sourceUrls','licensedData','dataRightsApproved'
 ]);
 if(body&&typeof body==='object'&&!Array.isArray(body)&&
    Object.keys(body).some(key=>forbiddenClientClaims.has(key)))
  throw fail('Client authority or protected evidence fields are not permitted.');
 if(!body||typeof body!=='object'||Array.isArray(body)||
    typeof body.question!=='string'||
    (body.mode!==undefined&&typeof body.mode!=='string')||
    (body.learnerAnswer!==undefined&&typeof body.learnerAnswer!=='string')||
    (body.allowModel!==undefined&&typeof body.allowModel!=='boolean')||
    (body.saveHistory!==undefined&&typeof body.saveHistory!=='boolean')||
    (body.formativePractice!==undefined&&(
      !body.formativePractice||typeof body.formativePractice!=='object'||Array.isArray(body.formativePractice)||
      !Object.keys(body.formativePractice).every(k=>['caseId','submitted','labId'].includes(k))||
      !['caseId','submitted'].every(k=>typeof body.formativePractice[k]==='string')||
      (body.formativePractice.labId!==undefined&&typeof body.formativePractice.labId!=='string')||
      !/^(?:canonical_candle_body_pct|canonical_vwap_trade_groups)$/.test(body.formativePractice.caseId)||
      body.formativePractice.submitted.length>24||
      (body.formativePractice.labId!==undefined&&!/^[A-Za-z0-9_-]{3,90}$/.test(body.formativePractice.labId))))||
    (body.conversationId!==undefined&&body.conversationId!==null&&
      (typeof body.conversationId!=='string'||!validId.test(body.conversationId)))||
    (body.requestId!==undefined&&(!validId.test(body.requestId)||typeof body.requestId!=='string')))
  throw fail('Invalid Tutor request fields.');
 const clean=x=>x.replace(/[\u0000-\u001f\u007f]/g,' ').trim();
 const question=clean(body.question),mode=clean(body.mode||'explain'),
  learnerAnswer=clean(body.learnerAnswer||'');
 if(question.length<4||question.length>450||
  !['explain','question','review','practice'].includes(mode)||
  learnerAnswer.length>1800||mode==='review'&&!learnerAnswer)
  throw fail('Tutor question, mode or learner reflection is invalid.');
 return {question,mode,learnerAnswer,
  allowModel:body.allowModel===true,saveHistory:body.saveHistory===true,
  requestId:body.requestId||crypto.randomUUID(),
  conversationId:body.conversationId||null,
  formativePractice:body.formativePractice?{
   caseId:body.formativePractice.caseId,submitted:clean(body.formativePractice.submitted),
   labId:body.formativePractice.labId||'TALIA_CLASSROOM'}:null,
  // Legacy untrusted priorTurns are ignored by the route, NEVER reintroduced
  // into provider input, current source evidence or saved Tutor replies.
  priorTurnsSupplied:body.priorTurns!==undefined};
}
