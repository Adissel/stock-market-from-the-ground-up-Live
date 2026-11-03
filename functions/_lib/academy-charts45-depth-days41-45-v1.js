/* Original advanced Charts45 D41-D45, fictional and ungraded.
 * Completes the final five canonical chart-study days without changing the
 * protected assessment, membership, grading or historical-data boundaries.
 */
import {chartCaseBySourcePhase} from './academy-charts45-batch04-v1.js';

const specs=[
 {day:41,sourceDay:23,op:'range',a:13.84,b:12.96,expected:.88,units:'completed-candle range',
  evidence:'A fictional completed candle has a 13.84 high and 12.96 low. Its 0.88 range describes dispersion inside that candle, not the direction of the next candle.'},
 {day:42,sourceDay:26,op:'pct',a:5.18,b:5,expected:3.6,units:'percent displacement from the prior completed close',
  evidence:'A fictional completed close of 5.18 is compared with a separately recorded 5.00 prior close. The 3.6% displacement does not prove that a candidate support region will hold.'},
 {day:43,sourceDay:27,op:'diff',a:18.35,b:18.72,expected:-.37,units:'change between confirmed swing highs',
  evidence:'Two rule-confirmed fictional swing highs are 18.72 and 18.35. The -0.37 comparison identifies a lower high but cannot establish an uninterrupted future downtrend.'},
 {day:44,sourceDay:28,op:'abs',a:7.44,b:7.31,expected:.13,units:'absolute completed daily-body size',
  evidence:'A fictional completed daily candle opens at 7.31 and closes at 7.44. Its 0.13 body must be kept separate from the full high-low range and any unfinished after-hours move.'},
 {day:45,sourceDay:29,op:'pct',a:9.54,b:9.9,expected:-3.6363636363636376,units:'percent distance from the former breakout reference',
  evidence:'A fictional completed close of 9.54 is compared with former resistance at 9.90. The -3.6364% result is evidence for review, not automatic proof of a failed breakout or a short entry.'}
];
const compute=s=>s.op==='pct'?(s.a-s.b)/s.b*100:s.op==='range'?s.a-s.b:
 s.op==='abs'?Math.abs(s.a-s.b):s.a-s.b;

function build(s){
 const phase=2,base=chartCaseBySourcePhase[s.sourceDay]?.[phase];
 if(!base)throw Error('Charts45 missing canonical source for day '+s.day);
 if(Math.abs(compute(s)-s.expected)>1e-9)throw Error('Charts45 D'+s.day+' arithmetic mismatch');
 const formula=s.op==='pct'?'(a - b) / b x 100':s.op==='abs'?'absolute value of (a - b)':'a - b';
 const worked='Using only completed fictional observations, '+formula+' with a='+s.a+
  ' and b='+s.b+' equals '+s.expected+' '+s.units+'. The denominator, sign and units remain visible.';
 const prompts=[
  ['Identify the information cutoff before interpreting the chart.',s.evidence],
  ['Explain the first-principles chart concept in plain language.',base.explanation],
  ['State what the cited educational reference can and cannot establish.',base.reference.label+' supports terminology and method; '+base.reference.scope],
  ['Walk through the observation procedure in the correct order.',base.sourceProcedure.join(' ')],
  ['Recompute the fictional quantity with every intermediate operation visible.',worked],
  ['Interpret the sign and units without predicting the next candle.',worked+' '+base.whenNot],
  ['Give an alternative explanation consistent with the same completed evidence.','Session context, liquidity, adjustment policy or a different confirmation rule may explain the same observation. '+base.workedExample],
  ['Diagnose the most likely trading misconception.',base.error+' A later outcome cannot retroactively repair an unsupported decision.'],
  ['Write a prospective invalidation and a WAIT condition.','Use this bounded evidence: '+s.evidence+' Require a new completed observation before changing the decision.'],
  ['Explain why seeing the worked answer is not mastery.','This is guided, ungraded instruction. Repeating '+s.expected+' does not demonstrate independent transfer or authorize a grade.'],
  ['Transfer the method to different evidence.','FRESH FICTIONAL TRANSFER: '+base.transfer+' Use new numbers, preserve the new cutoff and show the denominator.'],
  ['Review process quality separately from profit or loss.',base.reviewGuide+' Record whether the rule was followed before considering any later fictional result.']
 ];
 const prefix='CHARTS45-D'+s.day+'-ADV-';
 return Object.freeze({topicSourceDay:s.sourceDay,phase:base.phase,
  formativeQuestions:Object.freeze(prompts.map(([prompt,review],i)=>Object.freeze({
   id:prefix+'Q'+String(i+1).padStart(2,'0'),
   prompt:'Charts45 day '+s.day+' - '+base.title+': '+prompt+' FICTIONAL evidence: '+s.evidence,
   review:'Charts45 day '+s.day+' guided review: '+review
  }))),
  advancedPracticums:Object.freeze([Object.freeze({
   id:prefix+'CASE',scenario:'FICTIONAL ADVANCED CHART CASE: '+s.evidence,
   task:'Calculate '+formula+', label the result, then apply the canonical procedure without using future bars. '+base.selfCheck,
   worked:worked+' '+base.explanation,
   pitfall:'COMMON MISCONCEPTION: '+base.error+' '+base.whenNot,
   transfer:'INDEPENDENT FICTIONAL TRANSFER: '+base.transfer+' Use different evidence and state what would force NO TRADE.'
  })]),
  advancedNumericChecks:Object.freeze([Object.freeze({operation:s.op,a:s.a,b:s.b,expected:s.expected,units:s.units,
   note:'ORIGINAL FICTIONAL CALCULATION - '+s.evidence})]),
  instructionalFocus:s.evidence,
  supplementarySourceStatus:'ORIGINAL_CHARTS45_ADVANCED_UNGRADED_SOURCE_READY_ACCEPTANCE_PENDING'});
}

export const charts45DepthDays41to45=Object.freeze(Object.fromEntries(specs.map(s=>[s.day,build(s)])));
if(Object.keys(charts45DepthDays41to45).length!==5)throw Error('Incomplete Charts45 source-days 41-45');
