/* Advanced instructional layer for original Practicum90 Days 01-20.
 * All evidence is fictional and ungraded; existing lesson/source fields remain authoritative.
 */
import {practicum90LearnBatch01} from './academy-practicum90-learning-batch01-v1.js';
import {practicum90LearnBatch02} from './academy-practicum90-learning-batch02-v1.js';
const bases=[...practicum90LearnBatch01,...practicum90LearnBatch02];
const specs=[
 ['diff',46,19,27,'minutes of quote staleness','At 09:16 a fictional quote last observed at 08:49 is 27 minutes old.'],
 ['pct',14.52,14,3.714285714285714,'percent completed price change','A fictional completed reference changes from 14.00 to 14.52.'],
 ['ratio',11,16,68.75,'percent process-complete records','Eleven of sixteen fictional plans preserve both source and invalidation evidence.'],
 ['ratio',840000,700000,120,'percent float-normalized volume','Fictional completed volume is 840,000 against a dated 700,000-share float estimate.'],
 ['range',32.18,31.46,.72,'completed-candle range','A fictional completed candle has high 32.18 and low 31.46.'],
 ['abs',6.42,6.18,.24,'absolute distance between completed references','Two separately timestamped fictional references are 6.42 and 6.18.'],
 ['pct',9.81,10.25,-4.29268292682927,'percent drawdown from the declared reference','A fictional completed mark of 9.81 is compared with a predeclared 10.25 reference.'],
 ['ratio',7,12,58.333333333333336,'percent observations meeting every rule','Seven of twelve fictional observations satisfy source, spread and cutoff rules.'],
 ['diff',720,665,55,'shares not covered by displayed size','A fictional 720-share proposal is compared with 665 displayed shares across the allowed levels.'],
 ['pct',18.24,18,1.3333333333333286,'percent displacement above a candidate level','A fictional completed close of 18.24 is compared with an 18.00 candidate level.'],
 ['range',4.96,4.51,.45,'completed interval range','A fictional completed interval records high 4.96 and low 4.51.'],
 ['abs',12.08,11.92,.16,'absolute tolerance-zone width','Two independently dated fictional contacts are 12.08 and 11.92.'],
 ['diff',27.35,27.8,-.45,'change between confirmed swing highs','Fictional rule-confirmed swing highs are 27.80 and 27.35.'],
 ['abs',8.66,8.54,.12,'completed candle body','A fictional completed candle opens 8.54 and closes 8.66.'],
 ['pct',15.36,16,-4,'percent distance from former resistance','A fictional completed close of 15.36 is compared with former resistance at 16.00.'],
 ['ratio',1350000,900000,150,'percent float-normalized session volume','Fictional session volume is 1,350,000 against a dated 900,000-share float estimate.'],
 ['pct',5.67,5.85,-3.0769230769230713,'percent completed decline','A fictional completed price of 5.67 is compared with a 5.85 prior completed close.'],
 ['ratio',420000,3500000,12,'percent reported short-interest inventory','Fictional reported short interest is 420,000 against 3,500,000 eligible float units.'],
 ['diff',.38,.21,.17,'difference between two securities movements','A fictional leader moves 0.38 while a separate alleged sympathy moves 0.21.'],
 ['pct',7.28,7,4,'percent completed event-window change','A fictional completed event-window reference changes from 7.00 to 7.28.']
];
const calculate=([op,a,b])=>op==='pct'?(a-b)/b*100:op==='ratio'?a/b*100:
 op==='range'?a-b:op==='abs'?Math.abs(a-b):a-b;

function make(index){
 const day=index+1,base=bases[index],s=specs[index];
 if(!base||base.day!==day)throw Error('Missing Practicum90 base day '+day);
 if(Math.abs(calculate(s)-s[3])>1e-8)throw Error('Practicum90 arithmetic mismatch '+day);
 const [op,a,b,expected,units,evidence]=s;
 const formula=op==='pct'?'(a - b) / b x 100':op==='ratio'?'a / b x 100':
  op==='abs'?'absolute value of (a - b)':'a - b';
 const worked='Substitute a='+a+' and b='+b+' into '+formula+'. The result is '+expected+' '+units+
  '. Show the denominator, sign and units before interpreting the fictional evidence.';
 const rows=[
  ['Declare the evidence cutoff and what remains unknown.',evidence+' No later observation, fill or outcome may be assumed.'],
  ['Explain the core idea from first principles.',base.explanation],
  ['Identify the source category and its limited role.',base.reference.label+' supports the educational method only. '+base.reference.scope],
  ['Execute the research procedure in order.',base.sourceProcedure.join(' ')],
  ['Reproduce every intermediate calculation.',worked],
  ['Interpret the computed quantity without converting it into a prediction.',worked+' '+base.whenNot],
  ['Name a competing explanation for the same observation.','Different timing, liquidity, adjustment policy or measurement rules can coexist with this evidence.'],
  ['Classify and correct the likely misconception.',base.error+' Correct it by returning to the original cutoff and units.'],
  ['Specify an invalidation and a legitimate WAIT decision.','Require a new completed observation that directly addresses the missing evidence; otherwise preserve WAIT or NO TRADE.'],
  ['Explain why guided success is not mastery.','This visible worked answer is ungraded practice, not independent assessment or a credential.'],
  ['Transfer the method to different fictional evidence.',base.transfer+' Recalculate with the new inputs rather than copying this result.'],
  ['Review decision quality independently of later P/L.',base.reviewGuide+' Record adherence before any later fictional result is revealed.']
 ];
 const id='PRACTICUM90-D'+String(day).padStart(2,'0')+'-ADV-';
 return Object.freeze({topicSourceDay:base.topicSourceDay,phase:base.phase,
  formativeQuestions:Object.freeze(rows.map(([prompt,review],i)=>Object.freeze({
   id:id+'Q'+String(i+1).padStart(2,'0'),
   prompt:'Practicum90 day '+day+' - '+base.title+': '+prompt+' FICTIONAL focus: '+evidence,
   review:'Practicum90 day '+day+' guided review: '+review
  }))),
  advancedPracticums:Object.freeze([Object.freeze({
   id:id+'CASE',scenario:'FICTIONAL ADVANCED PRACTICUM: '+evidence,
   task:'Calculate '+formula+', interpret the units, and apply the documented process without hindsight. '+base.selfCheck,
   worked:worked+' '+base.explanation,
   pitfall:'COMMON PROCESS ERROR: '+base.error+' '+base.whenNot,
   transfer:'INDEPENDENT FICTIONAL TRANSFER: '+base.transfer+' State the evidence that would require WAIT or NO TRADE.'
  })]),
  advancedNumericChecks:Object.freeze([Object.freeze({operation:op,a,b,expected,units,
   note:'ORIGINAL FICTIONAL CALCULATION - '+evidence})]),
  instructionalFocus:evidence,
  supplementarySourceStatus:'ORIGINAL_PRACTICUM90_ADVANCED_UNGRADED_SOURCE_READY_ACCEPTANCE_PENDING'});
}
export const practicum90DepthDays01to20=Object.freeze(Object.fromEntries(specs.map((_,i)=>[i+1,make(i)])));
if(Object.keys(practicum90DepthDays01to20).length!==20)throw Error('Incomplete Practicum90 advanced days 01-20');
