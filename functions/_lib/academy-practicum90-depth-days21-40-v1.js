/* Advanced ungraded instructional layer for Practicum90 D21-D40. */
import {practicum90LearnBatch02} from './academy-practicum90-learning-batch02-v1.js';
import {practicum90Batch03} from './academy-practicum90-batch03-days26-45-v1.js';
const bases=[...practicum90LearnBatch02.slice(15),...practicum90Batch03.slice(0,15)];
const specs=[
 ['diff',11.48,11.12,.36,'completed close-to-close change','A fictional completed close changes from 11.12 to 11.48 while current execution quality remains unobserved.'],
 ['pct',16.28,15.5,5.032258064516127,'percent leader movement','A fictional leader changes from 15.50 to 16.28; a separate security must be evaluated independently.'],
 ['pct',9.37,9.15,2.404371584699458,'percent quote-width proxy','Fictional bid and ask references 9.15 and 9.37 require a stated denominator and cannot guarantee a fill.'],
 ['ratio',22,30,73.33333333333333,'percent source-complete records','Twenty-two of thirty fictional records retain the required dated source and cutoff.'],
 ['range',6.88,6.31,.57,'completed candle range','A fictional completed candle has high 6.88 and low 6.31; intrabar order is unknown.'],
 ['pct',4.82,4.6,4.782608695652183,'percent quote displacement','A fictional completed observation changes from 4.60 to 4.82 without proving tradable depth.'],
 ['pct',13.34,11.6,15.000000000000004,'percent skipped hypothetical move','A fictional price later changes from 11.60 to 13.34 after a valid no-trade decision.'],
 ['pct',25.6,25,2.4,'percent completed follow-through','A fictional completed reference changes from 25.00 to 25.60 after the original decision cutoff.'],
 ['pct',27.12,30,-9.600000000000001,'percent event-window decline','A fictional completed reference falls from 30.00 to 27.12; causality remains unverified.'],
 ['ratio',17,25,68,'percent independently sourced records','Seventeen of twenty-five fictional records contain independently dated primary-source evidence.'],
 ['abs',8.44,8.07,.37,'absolute planned-risk distance','A fictional entry reference 8.44 and invalidation 8.07 define 0.37 per-share planned distance, not a fill.'],
 ['pct',17.06,16.78,1.6686531585220523,'percent quoted spread proxy','Fictional 16.78 and 17.06 quote references produce a width that may change before execution.'],
 ['ratio',19,24,79.16666666666666,'percent checklist-complete observations','Nineteen of twenty-four fictional observations satisfy the predeclared research checklist.'],
 ['ratio',360000,1800000,20,'percent float-normalized volume','Fictional completed volume 360,000 is compared with a dated 1,800,000-share float estimate.'],
 ['diff',145,55,90,'shares remaining after displayed quantity','A fictional 145-share proposal faces only 55 displayed shares at the allowed price.'],
 ['range',12.76,12.21,.55,'completed interval range','A fictional completed interval has high 12.76 and low 12.21.'],
 ['abs',21.18,20.74,.44,'planned risk distance','Fictional entry reference 21.18 and invalidation 20.74 imply 0.44 planned distance before costs.'],
 ['ratio',28,40,70,'percent eligible decisions','Twenty-eight of forty fictional records meet all predeclared evidence requirements.'],
 ['pct',5.58,5.4,3.3333333333333264,'percent completed movement','A fictional completed reference changes from 5.40 to 5.58 without establishing liquidity.'],
 ['diff',74,29,45,'minutes between source cutoff and review','A fictional source cutoff at minute 29 and review at minute 74 are 45 minutes apart.']
];
const calc=s=>s[0]==='pct'?(s[1]-s[2])/s[2]*100:s[0]==='ratio'?s[1]/s[2]*100:
 s[0]==='abs'?Math.abs(s[1]-s[2]):s[1]-s[2];
function build(i){
 const day=i+21,base=bases[i],s=specs[i];if(!base||base.day!==day)throw Error('Missing Practicum90 D'+day);
 if(Math.abs(calc(s)-s[3])>1e-8)throw Error('Bad arithmetic D'+day);
 const [op,a,b,expected,units,evidence]=s,formula=op==='pct'?'(a - b) / b x 100':op==='ratio'?'a / b x 100':op==='abs'?'absolute value of (a - b)':'a - b';
 const worked='Use '+formula+' with a='+a+' and b='+b+' to obtain '+expected+' '+units+'. Preserve sign, denominator, units and cutoff.';
 const rows=[
  ['State the evidence cutoff.',evidence+' Later observations and fills remain unavailable.'],
  ['Explain the governing concept.',base.explanation],
  ['Bound the reference claim.',base.reference.label+' supports method only. '+base.reference.scope],
  ['Execute the procedure sequentially.',base.sourceProcedure.join(' ')],
  ['Show every calculation step.',worked],
  ['Interpret without prediction.',worked+' '+base.whenNot],
  ['Offer a competing explanation.','Timing, measurement convention, liquidity or adjustment policy may produce the same observation.'],
  ['Correct the common misconception.',base.error+' Return to the actual source, units and decision cutoff.'],
  ['Write invalidation and WAIT rules.','Require directly relevant completed evidence; otherwise retain WAIT or NO TRADE.'],
  ['Separate guided work from mastery.','A visible solution is practice, not an independent grade or credential.'],
  ['Transfer to different evidence.',base.transfer+' Recalculate rather than copying this outcome.'],
  ['Review process before outcome.',base.reviewGuide+' Score rule adherence only after preserving the original decision.']
 ];
 const prefix='PRACTICUM90-D'+String(day).padStart(2,'0')+'-ADV-';
 return Object.freeze({topicSourceDay:base.topicSourceDay,phase:base.phase,
  formativeQuestions:Object.freeze(rows.map(([prompt,review],q)=>Object.freeze({id:prefix+'Q'+String(q+1).padStart(2,'0'),prompt:'Practicum90 day '+day+' - '+base.title+': '+prompt+' FICTIONAL focus: '+evidence,review:'Practicum90 day '+day+' guided review: '+review}))),
  advancedPracticums:Object.freeze([Object.freeze({id:prefix+'CASE',scenario:'FICTIONAL ADVANCED PRACTICUM: '+evidence,task:'Calculate '+formula+' and apply the original procedure without hindsight. '+base.selfCheck,worked:worked+' '+base.explanation,pitfall:'COMMON PROCESS ERROR: '+base.error+' '+base.whenNot,transfer:'INDEPENDENT FICTIONAL TRANSFER: '+base.transfer+' State the evidence needed to proceed.'})]),
  advancedNumericChecks:Object.freeze([Object.freeze({operation:op,a,b,expected,units,note:'ORIGINAL FICTIONAL CALCULATION - '+evidence})]),instructionalFocus:evidence,
  supplementarySourceStatus:'ORIGINAL_PRACTICUM90_ADVANCED_UNGRADED_SOURCE_READY_ACCEPTANCE_PENDING'});
}
export const practicum90DepthDays21to40=Object.freeze(Object.fromEntries(specs.map((_,i)=>[i+21,build(i)])));
if(Object.keys(practicum90DepthDays21to40).length!==20)throw Error('Incomplete Practicum90 D21-D40');
