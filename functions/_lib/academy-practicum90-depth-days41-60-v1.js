/* Advanced, fictional and ungraded Practicum90 instructional layer D41-D60. */
import {practicum90Batch03} from './academy-practicum90-batch03-days26-45-v1.js';
import {practicum90Batch04} from './academy-practicum90-batch04-days46-65-v1.js';
const bases=[...practicum90Batch03.slice(15),...practicum90Batch04.slice(0,15)];
const specs=[
 ['diff',6.28,6.04,.24,'confirmed exit distance','A fictional confirmed exit at 6.28 is compared with a 6.04 entry reference.'],
 ['ratio',47,100,47,'percent order quantity at the first price','Forty-seven of 100 fictional shares are available at the first permitted price.'],
 ['abs',14.92,14.51,.41,'planned risk distance','A fictional entry reference 14.92 and invalidation 14.51 define 0.41 planned distance.'],
 ['pct',8.16,8.5,-4.0000000000000036,'percent completed decline','A fictional completed observation falls from 8.50 to 8.16.'],
 ['ratio',13,18,72.22222222222221,'percent source-complete records','Thirteen of eighteen fictional records preserve every required source field.'],
 ['pct',19.62,18,9,'percent completed rise','A fictional completed reference rises from 18.00 to 19.62 after the decision cutoff.'],
 ['diff',20.8,23.4,-2.6,'adverse short price movement','A fictional short reference 20.80 is compared with a later completed 23.40 mark.'],
 ['ratio',31,40,77.5,'percent rules-complete cases','Thirty-one of forty fictional cases meet every predeclared process rule.'],
 ['range',7.73,7.08,.65,'completed candle range','A fictional completed candle has high 7.73 and low 7.08.'],
 ['abs',11.36,10.94,.42,'candidate invalidation distance','Fictional reference 11.36 and invalidation 10.94 define 0.42 before costs.'],
 ['pct',5.46,5.2,5,'percent completed movement','A fictional completed reference changes from 5.20 to 5.46.'],
 ['pct',3.68,3.32,10.843373493975894,'percent separation between securities','Two fictional securities at 3.68 and 3.32 require independent evidence despite their separation.'],
 ['pct',10.44,10.12,3.1620553359683724,'percent quote-width proxy','Fictional quote references 10.12 and 10.44 do not guarantee execution.'],
 ['ratio',27,36,75,'percent documented decisions','Twenty-seven of thirty-six fictional decisions retain their original evidence cutoff.'],
 ['diff',930000,745000,185000,'volume above dated float estimate','Fictional completed volume 930,000 exceeds a dated 745,000-share float estimate by 185,000.'],
 ['abs',16.84,16.27,.57,'planned risk distance','A fictional entry reference 16.84 and invalidation 16.27 define 0.57.'],
 ['ratio',34,50,68,'percent independently reviewed records','Thirty-four of fifty fictional records have an independent process review.'],
 ['range',24.16,23.42,.74,'completed interval range','A fictional completed interval has high 24.16 and low 23.42.'],
 ['pct',6.89,7.25,-4.965517241379308,'percent completed drawdown','A fictional completed mark 6.89 is compared with a 7.25 declared reference.'],
 ['ratio',21,30,70,'percent source-complete decisions','Twenty-one of thirty fictional decisions preserve source, cutoff and invalidation.']
];
const calc=s=>s[0]==='pct'?(s[1]-s[2])/s[2]*100:s[0]==='ratio'?s[1]/s[2]*100:s[0]==='abs'?Math.abs(s[1]-s[2]):s[1]-s[2];
function build(i){
 const day=i+41,base=bases[i],s=specs[i];if(!base||base.day!==day)throw Error('Missing Practicum90 D'+day);if(Math.abs(calc(s)-s[3])>1e-8)throw Error('Arithmetic D'+day);
 const [op,a,b,expected,units,evidence]=s,formula=op==='pct'?'(a - b) / b x 100':op==='ratio'?'a / b x 100':op==='abs'?'absolute value of (a - b)':'a - b';
 const worked='Substitute a='+a+' and b='+b+' into '+formula+' to obtain '+expected+' '+units+'. Preserve cutoff, denominator, sign and unit.';
 const rows=[['Declare the decision cutoff.',evidence+' No later observation or fill is available.'],['Explain the concept from first principles.',base.explanation],['Bound the cited source.',base.reference.label+' supports method only. '+base.reference.scope],['Perform the procedure in order.',base.sourceProcedure.join(' ')],['Show the arithmetic.',worked],['Interpret without prediction.',worked+' '+base.whenNot],['Give a competing explanation.','Timing, liquidity, adjustment or measurement conventions may fit the same evidence.'],['Correct the misconception.',base.error+' Return to the original evidence and units.'],['Write invalidation and WAIT criteria.','Require directly relevant completed evidence or preserve WAIT/NO TRADE.'],['Separate practice from mastery.','A guided solution is not an independent grade, credential or trading result.'],['Transfer to new evidence.',base.transfer+' Recalculate from its different inputs.'],['Review process before outcome.',base.reviewGuide+' Preserve the original decision before later evidence.']];
 const prefix='PRACTICUM90-D'+String(day).padStart(2,'0')+'-ADV-';
 return Object.freeze({topicSourceDay:base.topicSourceDay,phase:base.phase,formativeQuestions:Object.freeze(rows.map(([prompt,review],q)=>Object.freeze({id:prefix+'Q'+String(q+1).padStart(2,'0'),prompt:'Practicum90 day '+day+' - '+base.title+': '+prompt+' FICTIONAL focus: '+evidence,review:'Practicum90 day '+day+' guided review: '+review}))),advancedPracticums:Object.freeze([Object.freeze({id:prefix+'CASE',scenario:'FICTIONAL ADVANCED PRACTICUM: '+evidence,task:'Calculate '+formula+' and apply the original method without hindsight. '+base.selfCheck,worked:worked+' '+base.explanation,pitfall:'COMMON PROCESS ERROR: '+base.error+' '+base.whenNot,transfer:'INDEPENDENT FICTIONAL TRANSFER: '+base.transfer+' State the evidence required to proceed.'})]),advancedNumericChecks:Object.freeze([Object.freeze({operation:op,a,b,expected,units,note:'ORIGINAL FICTIONAL CALCULATION - '+evidence})]),instructionalFocus:evidence,supplementarySourceStatus:'ORIGINAL_PRACTICUM90_ADVANCED_UNGRADED_SOURCE_READY_ACCEPTANCE_PENDING'});
}
export const practicum90DepthDays41to60=Object.freeze(Object.fromEntries(specs.map((_,i)=>[i+41,build(i)])));
if(Object.keys(practicum90DepthDays41to60).length!==20)throw Error('Incomplete Practicum90 D41-D60');
