/* Original advanced Charts45 D01–D20, strictly fictional, ungraded source.
 * Reuse the existing fifteen canonical Charts45 topics and three phases.
 * No learning records, official grading, cash entitlements or licensed feeds.
 */
import {chartCaseBySourcePhase} from './academy-charts45-batch04-v1.js';
const sourceDays=[5,9,13,14,15,16,18,20,21,22,23,26,27,28,29];
const specs=[
 ['range',11,9.5,1.5,'price range','Completed candle H 11.00 and L 9.50; intrabar order is unknown.'],
 ['abs',10.03,9.98,.05,'dollars between contacts','Two completed support-zone contacts 10.03 and 9.98 are not a price guarantee.'],
 ['diff',7.4,7.1,.3,'swing-low change','Two rule-confirmed swing lows 7.10 and 7.40 do not predict a next high.'],
 ['diff',4.9,4.7,.2,'daily green body','A completed daily close 4.90 exceeds open 4.70; confirmation requires final session close.'],
 ['diff',12.5,12,.5,'price above a prior level','A completed 12.50 close is above prior 12.00; future acceptance is unknown.'],
 ['pct',4.8,5,-4,'percent change','A fast move from 5.00 to 4.80 does not prove an imminent reversal.'],
 ['pct',4.8,5,-4,'percent below prior close','A 4.80 session close after prior 5.00 requires matching session boundaries.'],
 ['ratio',800000,8000000,10,'percent of stated float','Short interest inventory 800000 shares against 8000000 float is not short-sale volume.'],
 ['pct',12.5,10,25,'single-symbol percent change','One ticker changing from 10.00 to 12.50 does not prove a sector-wide move.'],
 ['diff',.8,.3,.5,'difference between dollar moves','Leader 0.80 move and sympathy 0.30 move are observations, not a causal link.'],
 ['diff',15.2,15,.2,'distance over an invalidation level','A move from a 15.00 hypothesis to 15.20 alone cannot prove setup expectancy.'],
 ['diff',10,9.8,.2,'distance from written watchlist threshold','A 10.00 quote after a 9.80 written threshold is not a verified trade.'],
 ['ratio',15,100,15,'percent displayed order coverage','A proposed 100-share fill versus displayed 15-share depth is inconsistent without new evidence.'],
 ['pct',10.5,10,5,'observed price percent change','Post-news completed prices 10.00 and 10.50 do not establish causal attribution.'],
 ['diff',990,955,35,'minutes of prospective separation','An earnings event at 16:30 follows a 15:55 note by 35 minutes; the future filing is not available.'],
 ['range',12.8,11.7,1.1,'independent candle range','A fresh completed candle H 12.80 L 11.70 must be recomputed without borrowing prior answers.'],
 ['abs',7.2,7.18,.02,'support breach magnitude','A hypothetical support 7.20 and completed low 7.18 require a predeclared tolerance.'],
 ['diff',8.6,8.8,-.2,'change in confirmed swing highs','A later confirmed high 8.60 below 8.80 shows one measurement, not a future trend.'],
 ['diff',7.5,7.5,0,'daily doji body','Equal opening and closing prices 7.50 cannot satisfy a strictly green-day definition.'],
 ['diff',9.6,10,-.4,'distance below former resistance','A completed 9.60 observation below old 10.00 resistance does not prove a guaranteed breakout failure.']
];
const compute=({op,a,b})=>op==='pct'?(a-b)/b*100:op==='ratio'?a/b*100:op==='abs'?Math.abs(a-b):a-b;
function create(index){
 const day=index+1,sourceDay=sourceDays[index%15],phase=Math.floor(index/15);
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
  formativeQuestions,advancedPracticums,numericChecks:Object.freeze([check]),
  instructionalFocus:evidence,supplementarySourceStatus:'ORIGINAL_CHARTS45_ADVANCED_UNGRADED_SOURCE_READY_ACCEPTANCE_PENDING'});
}
export const charts45DepthDays01to20=Object.freeze(Object.fromEntries(
 specs.map((_,i)=>[i+1,create(i)])));
if(Object.keys(charts45DepthDays01to20).length!==20)throw Error('Incomplete Charts45 source-days 1–20');
