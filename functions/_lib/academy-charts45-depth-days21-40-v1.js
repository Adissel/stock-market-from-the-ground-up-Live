/* Original advanced Charts45 D21–D40, strictly fictional, ungraded source.
 * Reuse the existing fifteen canonical Charts45 topics and three phases.
 * No learning records, official grading, cash entitlements or licensed feeds.
 */
import {chartCaseBySourcePhase} from './academy-charts45-batch04-v1.js';
const sourceDays=[5,9,13,14,15,16,18,20,21,22,23,26,27,28,29];
const specs=[
 ['pct',9.12,9.6,-5,'percent decline between complete observations','A fictional panic-dip example falls from 9.60 to 9.12 between completed observations; no rebound is assumed.'],
 ['diff',11.15,11.6,-.45,'change versus prior daily close','A fictional first-red-day recheck compares the completed 11.15 close with 11.60 prior reference; premarket trades cannot replace the daily close.'],
 ['ratio',1250000,10000000,12.5,'percent reported short interest','Fictional short interest 1,250,000 shares against 10,000,000 reported eligible float units is inventory, not today’s short-volume fraction.'],
 ['pct',6.15,6,2.5,'percent one-ticker price movement','Fictional 6.15 versus 6.00 belongs to one instrument and cannot by itself establish a shared sector catalyst.'],
 ['diff',.62,.28,.34,'dollar gap between separate observations','Fictional leader 0.62 and sympathy 0.28 dollar changes are not evidence of a guaranteed causal relationship.'],
 ['diff',7.65,7.5,.15,'distance beyond prospective trigger','Fictional 7.65 close over a 7.50 criterion is one observation, not proof that an unobserved next candle will continue.'],
 ['diff',8.94,9.1,-.16,'distance from prospective invalidation','Fictional watchlist note identified 9.10 as a prospective threshold, while a later completed observation is 8.94.'],
 ['ratio',18,120,15,'percent of proposed quantity displayed','Fictional proposed size 120 versus 18 displayed ask shares shows limited contemporaneous coverage and cannot prove an executable full fill.'],
 ['pct',8.54,8.75,-2.4,'percent observed event-window change','Fictional event-window prices 8.75 and 8.54 show a negative completed change without attributing causality to an unverified headline.'],
 ['diff',1000,935,65,'minutes until a hypothetical scheduled event','Fictional pre-event note at 15:35 and scheduled release at 16:40 are 65 minutes apart; the actual release is unavailable at the note cutoff.'],
 ['range',20.25,18.75,1.5,'completed-candle price range','A different fictional candle shows high 20.25 and low 18.75; its wick order and next completed bar remain unknown.'],
 ['abs',5.04,4.96,.08,'absolute difference between region contacts','Fictional independently dated touches 5.04 and 4.96 define a candidate tolerance zone, not a rigid guaranteed support line.'],
 ['diff',14.45,14.9,-.45,'movement in confirmed swing highs','Fictional rule-confirmed highs 14.90 and 14.45 provide one lower-high comparison, not evidence of an assured downtrend.'],
 ['diff',3.9,3.85,.05,'completed daily-candle body','Fictional completed daily close 3.90 and open 3.85 can be classified green only after the market session is complete.'],
 ['pct',12,12.5,-4,'percent move from prior breakout reference','Fictional close 12.00 relative to former 12.50 resistance can be compared without labeling a guaranteed failed breakout.'],
 ['pct',2.76,3,-8,'percent hypothetical high-velocity decline','Fictional completed prices 3.00 and 2.76 form an eight-percent decline; speed alone does not establish a bottom or tradable liquidity.'],
 ['pct',7.71,7.85,-1.7834394904458595,'percent below documented prior close','Fictional day closes at 7.71 relative to prior-session 7.85; retain the reference and never use future adjustments unknowingly.'],
 ['ratio',900000,6000000,15,'percent inventory-to-eligible-float','Fictional short interest 900,000 shares and eligible float 6,000,000 define an inventory ratio, not an intraday short-sale-volume rate.'],
 ['pct',4.72,4.8,-1.666666666666668,'percent single-security movement','Fictional single-stock price 4.72 relative to 4.80 does not establish a decline throughout an alleged sector.'],
 ['diff',.42,.17,.25,'difference between leader and sympathy moves','Fictional leader 0.42-dollar move and another stock’s 0.17-dollar move cannot establish a quote-by-quote transmission mechanism.']
];
const compute=({op,a,b})=>op==='pct'?(a-b)/b*100:op==='ratio'?a/b*100:op==='abs'?Math.abs(a-b):a-b;
function create(index){
 const day=index+21,sourceDay=sourceDays[(day-1)%15],phase=Math.floor((day-1)/15);
 const base=chartCaseBySourcePhase[sourceDay]?.[phase];
 if(!base)throw Error('Charts45 missing approved source for day '+day);
 const [op,a,b,expected,units,evidence]=specs[index];
 const check=Object.freeze({operation:op,a,b,expected,units,
  note:'ORIGINAL FICTIONAL CALCULATION — '+evidence});
 if(Math.abs(compute({op,a,b})-expected)>1e-7)throw Error('Incorrect Charts45 worked arithmetic '+day);
 const numericalGuide='With fictional inputs a='+a+' and b='+b+', '+op+
  ' gives '+expected+' '+units+'. Report the unit and denominator; no market fill or predictive result is established.';
 const questions=[
  ['Name the completed observation and exact information cutoff.',
   'A bounded description must begin with the fictional completed evidence: '+evidence],
  ['Explain the foundational concept before invoking a trading setup.',
   'The established first-principles lesson states: '+base.explanation],
  ['Distinguish the cited definition from unverifiable market performance.',
   'The original reference '+base.reference.label+' supports educational terminology only. '+base.reference.scope],
  ['Reproduce the step-by-step method without looking at future bars.',
   'Perform the actual documented steps in order: '+base.sourceProcedure.join(' ')],
  ['Independently recompute the new numeric example and give its units.',
   numericalGuide],
  ['State what the quantity measures and what it cannot predict.',
   numericalGuide+' '+base.whenNot],
  ['Describe a plausible alternative explanation for the observed evidence.',
   'A different order, context, session or data adjustment can coexist with the evidence. '+base.workedExample],
  ['Find and explain the most important common interpretation error.',
   'The original authored counterexample is: '+base.error+' Do not let an assumed later outcome retroactively validate the mistake.'],
  ['Specify a prospective invalidation before any result is revealed.',
   'Use the exact fictional focus '+evidence+' to precommit a falsifiable condition, preserving a WAIT or NO TRADE alternative.'],
  ['Explain why a correct worked answer is not independent mastery.',
   'A revealed, ungraded teaching explanation does not issue private assessment grades. '+base.why],
  ['Transfer the same method to an unfamiliar scenario without copying the old outcome.',
   'The existing independent transfer asks: '+base.transfer+' Preserve source timestamps and comparable units.'],
  ['Complete a process review that separates the decision from later outcomes.',
   'The expected review method is: '+base.reviewGuide+' Grade, credential, brokerage execution and verified historical performance remain unavailable.']
 ];
 const formativeQuestions=Object.freeze(questions.map(([prompt,review],i)=>Object.freeze({
  id:'CHARTS45-D'+String(day).padStart(2,'0')+'-ADV-Q'+String(i+1).padStart(2,'0'),
  prompt:'Charts45 day '+day+' — '+base.title+': '+prompt+' FICTIONAL focus: '+evidence,
  review:'Charts45 day '+day+': '+review
 })));
 const advancedPracticums=Object.freeze([Object.freeze({
  id:'CHARTS45-D'+String(day).padStart(2,'0')+'-ADV-CASE',
  scenario:'FICTIONAL ADVANCED CHART CASE: '+base.workedExample+' New independent evidence: '+evidence,
  task:'Recompute a='+a+', b='+b+' using '+op+' and interpret the result within source, timeframe and NO TRADE limitations. '+base.selfCheck,
  worked:numericalGuide+' '+base.explanation+' Recheck each observation without using a later unseen price.',
  pitfall:'The original misconception is: '+base.error+' '+base.whenNot+' No real prices or brokerage execution have been verified.',
  transfer:'FRESH FICTIONAL TRANSFER — '+base.transfer+' State which new facts are needed before any hypothetical trading conclusion.'
 })]);
 return Object.freeze({topicSourceDay:sourceDay,phase:base.phase,
  formativeQuestions,advancedPracticums,advancedNumericChecks:Object.freeze([check]),
  instructionalFocus:evidence,supplementarySourceStatus:'ORIGINAL_CHARTS45_ADVANCED_UNGRADED_SOURCE_READY_ACCEPTANCE_PENDING'});
}
export const charts45DepthDays21to40=Object.freeze(Object.fromEntries(
 specs.map((_,i)=>[i+21,create(i)])));
if(Object.keys(charts45DepthDays21to40).length!==20)throw Error('Incomplete Charts45 source-days 21–40');
