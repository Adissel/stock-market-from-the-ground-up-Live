/* An authenticated, topic-only adapter for the EXISTING Market Tutor service.
 * Do not forward lesson body, member answers, grades, rubrics or replay data.
 */
(function(root){'use strict';
const TOPICS=Object.freeze([
 [/vwap|volume.weighted/i,'VWAP mathematics and source limitations'],
 [/\bema\b|moving.average|rsi|macd|bollinger|\batr\b/i,'technical indicators and calculation limitations'],
 [/candl|wick|ohlc/i,'candlestick anatomy and completed OHLC observations'],
 [/level.?(?:ii|2)|time.and.sales|order.flow|\btape\b/i,'time and sales, order books, and bid ask uncertainty'],
 [/risk|position siz|stop.loss|slippage|execution/i,'risk per share, position sizing and execution uncertainty'],
 [/sec|edgar|10.k|10.q|filing|disclosure/i,'company disclosures and primary source verification'],
 [/scanner|watchlist|catalyst|research/i,'research watchlists, scanners and source verification'],
 [/breakout|trend|pullback|support|resistance|chart/i,'chart structure, trends and confirmation limitations'],
 [/volume|liquid|market/i,'trading volume, liquidity and uncertainty']
]);
function topicFor(day){
 const s=String(day?.title||'').slice(0,130)+' '+String(day?.objective||'').slice(0,130);
 return TOPICS.find(([r])=>r.test(s))?.[1]||'observed market evidence, uncertainty and no-trade decisions';
}
function create({client,userId,day,isCurrent}={}){
 if(!client?.auth?.getSession||!userId||!day||typeof isCurrent!=='function')return null;
 const topic=topicFor(day);
 return async ({signal,stage='Learn',reason='explanation'}={})=>{
  const validStages=new Set(['Start','Learn','Calculate / Analyze','Experiment','Predict',
   'Replay / Practice','Assess','Review & Retry','Transfer Challenge','Results',
   'Practice','Review','Transfer']);
  const safeStage=validStages.has(stage)?stage:'Learn';
  const safeReason=['explanation','misconception','new-example','prerequisite'].includes(reason)?reason:'explanation';
  if(!isCurrent())throw Error('The learning session changed. Open the current lesson again.');
  const session=(await client.auth.getSession())?.data?.session;
  if(!session?.access_token||session.user?.id!==userId||!isCurrent())
   throw Error('Sign in with the current member account to ask Market Tutor.');
  if(signal?.aborted)throw Error('Tutor request cancelled.');
  // A click is intentional; the API separately checks entitlements, profile
  // opt-in and AI quota. Source-grounded teaching is the safe default.
  const body={
   question:'Teach the general topic of '+topic+' for the '+safeStage+
    ' learning stage. Educational need: '+safeReason+
    '. Explain from first principles, show a new original fictional worked example, identify a likely misunderstanding, describe evidence limits, and pose an ungraded transfer question. Never infer the learner\'s actual answer or grade.',
   mode:'explain',allowModel:session.user?.user_metadata?.market_tutor_ai_enabled===true,
   requestId:crypto.randomUUID(),saveHistory:false
  };
  const response=await fetch('/api/market-tutor',{method:'POST',cache:'no-store',credentials:'same-origin',signal,
   headers:{authorization:'Bearer '+session.access_token,'content-type':'application/json'},body:JSON.stringify(body)});
  const result=await response.json().catch(()=>null);
  if(!isCurrent()||signal?.aborted)throw Error('The learning session changed; this Tutor reply was discarded.');
  if(!response.ok||result?.ok!==true)throw Error(response.status===403?
   'Market Tutor requires eligible access. Local Talia explanations and retries remain free.':
   response.status===401?'Your sign-in session expired.':
   response.status===429?'Market Tutor limit reached. Use the free lesson explanations.':
   'Market Tutor is unavailable. Your local lesson guidance remains accessible.');
  if(typeof result.answer!=='string'||!result.answer.trim())throw Error('No Tutor explanation returned.');
  return {answer:result.answer.slice(0,7000),generation:String(result.generation||'source-grounded')};
 };
}
root.GroundUpAcademyTutorBridgeV1=Object.freeze({create,topicFor});
})(typeof window!=='undefined'?window:globalThis);
