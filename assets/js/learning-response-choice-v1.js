/* Shared public formative response choices for Labs and Boot Camps.
 * Method checks are NOT case-specific grades, assessment keys, mastery evidence,
 * or substitutes for numerical/equation and chart-based exercises.
 * Keep structured questions local; no networking or learner data leaves the page.
 */
(function(root){'use strict';
 const clean=s=>String(s||'').replace(/\s+/g,' ').trim().slice(0,220);
 const DOMAIN={
  candle:'Inspect completed OHLC values, calculate the real body and full range, then explain what those observations cannot predict.',
  vwap:'Use observed prices and their share volumes, calculate total traded value divided by shares, and check the limits of the result.',
  risk:'Inspect entry, stop, risk per share, share quantity and the conditions that would make the hypothetical trade inappropriate.',
  indicator:'Inspect indicator inputs, timeframe and completed candles; compare the indicator with price evidence rather than forecasting certainty.',
  tape:'Distinguish displayed quotes from executed trades; verify time, venue, size and what is not observable.',
  filings:'Verify the issuer, filing type, reporting period, source, units and denominator before drawing a conclusion.',
  scanner:'Check the scan inputs and data coverage, then independently verify the candidate evidence and possible false positives.',
  research:'Verify the actual source and timeframe, apply the stated method, and identify uncertainty or an alternative explanation.'
 };
 const FALSE_A='Assume one indicator, result or simulated observation proves the next market outcome.';
 const FALSE_B='Skip source, units, timing and alternative explanations because a result looks plausible.';
 function domain(topic='',kind=''){
  const s=(String(topic)+' '+String(kind)).toLowerCase();
  if(/vwap|volume.weighted/.test(s))return'vwap';
  if(/candle|ohlc|real body|wick/.test(s))return'candle';
  if(/risk|stop.loss|position.siz/.test(s))return'risk';
  if(/ema|moving average|technical indicator|relative strength|macd|rsi/.test(s))return'indicator';
  if(/tape|order book|order flow|market microstructure|bid.ask/.test(s))return'tape';
  if(/filing|10-k|10-q|sec |financial statement|issuer/.test(s))return'filings';
  if(/scan|filter|watchlist|candidate/.test(s))return'scanner';
  return'research';
 }
 function build({prompt='',topic='',kind='',seed=0}={}){
  const question=clean(prompt);const family=domain(topic,kind);
  let correct=DOMAIN[family];
  const phrase=question.toLowerCase();
  if(/what changed|change (?:one|an|the)|experiment|input changed|observed difference/.test(phrase))
   correct='Change one input, observe the resulting calculation or chart difference, and keep future data concealed.';
  else if(/new case|different case|unfamiliar|transfer|another case/.test(phrase))
   correct='Use the new case’s own observed data and limits; do not reuse the earlier answer or inspect unseen results.';
  else if(/mistake|error|limitation|uncertain|correct the reasoning|missing fact|invalidate/.test(phrase))
   correct='Identify the unsupported assumption, correct it using the visible evidence, and state what remains unknown.';
  else if(/predict|expect|future|next candle|later evidence/.test(phrase))
   correct='Make only a conditional expectation from observed evidence and check it later; do not claim certainty.';
  const options=[
   {code:'EVIDENCE',label:correct,correct:true},
   {code:'FORECAST',label:FALSE_A,correct:false},
   {code:'OMIT_SOURCE',label:FALSE_B,correct:false}
  ];
  const offset=Math.abs(Number.isFinite(Number(seed))?Math.trunc(Number(seed)):0)%3;
  return Object.freeze({family,prompt:question,
   options:Object.freeze(options.slice(offset).concat(options.slice(0,offset)).map(x=>Object.freeze(x))),
   correctCode:'EVIDENCE',
   explanation:'This checks the evidence-handling method only. Apply the lesson’s actual chart, numeric calculation and independent decision to demonstrate the specific skill; no grade or mastery is awarded.'
  });
 }
 function evaluate(spec,code){
  if(!spec||!Array.isArray(spec.options))return {accepted:false,reason:'Missing evidence choice.'};
  const option=spec.options.find(x=>x.code===code);
  if(!option)return {accepted:false,reason:'Choose an evidence-handling response.'};
  return option.correct?{accepted:true,answer:option.label,feedback:spec.explanation}:
   {accepted:false,reason:'Not yet. Select the response that uses observable evidence and acknowledges limitations. You can retry without credits.'};
 }
 root.GroundUpLearningResponseChoiceV1=Object.freeze({build,evaluate,domain});
})(typeof window!=='undefined'?window:globalThis);
