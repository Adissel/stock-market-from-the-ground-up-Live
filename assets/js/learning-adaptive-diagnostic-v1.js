/* SMFGU-ENGINE-ADAPT-001: optional authorized ungraded learning diagnostic.
   No grades, account writes, paid inference, future bars, or new entitlements. */
(function(root){
'use strict';
const skills=Object.freeze({
 terminology:{label:'Understand the terminology',pre:'Define the central term before using it to interpret a chart.',check:'Can I explain the key term and its limitation in my own words?'},
 calculation:{label:'Work through the mathematics',pre:'Name each input, unit, formula and intermediate step before calculating.',check:'Can I reconstruct the method from the stated inputs without guessing?'},
 evidence:{label:'Identify observable evidence',pre:'Separate completed timestamped observations from missing and future data.',check:'Which observations exist at this decision boundary, and what is still unknown?'},
 decision:{label:'Choose an evidence-bound decision',pre:'State the trigger, invalidation and conditions for WATCH or NO TRADE.',check:'Would I make this decision before seeing the next price observation?'}
});
const clean=(v,n=600)=>typeof v==='string'?v.replace(/[\u0000-\u001f\u007f]/g,' ').trim().slice(0,n):'';
const first=(...v)=>v.map(x=>clean(x)).find(Boolean)||'';
function diagnose({lab,need,confidence}={}){
 const skill=skills[need];if(!skill)return null;
 const teaching=lab&&typeof lab.teaching==='object'?lab.teaching||{}:{};
 const title=first(lab?.concept,lab?.title,'this authorized lesson');
 const source=need==='terminology'?first(teaching.what,lab?.goal):
  need==='calculation'?first(teaching.workedExample):
  need==='evidence'?first(teaching.when,teaching.why):
  first(teaching.transfer,teaching.when);
 const missing=need==='calculation'
  ?'No verified numerical worked example is attached to this Lab. Do not invent a formula, prices or source.'
  :'No additional approved source explanation is attached here. Review the authorized lesson and its source disclosures.';
 const next=confidence==='independent'
  ?'Attempt a fresh fictional case independently, then explain which assumptions remain uncertain.'
  :confidence==='learning'
  ?'Retry the method with a different fictional example and explain the correction.'
  :'Review the definitions and the complete guided example before attempting a new case.';
 return Object.freeze({subject:title,need,label:skill.label,prerequisite:skill.pre,
  studyStep:next,sourceExcerpt:source||missing,checkpoint:skill.check,
  caution:'Optional, ungraded self-selected guidance. Never assume unverified historical prices or reveal future replay bars.',
  officialGrade:false,masteryAwarded:false,entitlementGranted:false,paidInference:false,memberRecordWritten:false});
}
function mount({target,lab,mode}={}){
 if(!target||!lab||!['guided','practice'].includes(mode)||typeof target.replaceChildren!=='function')return false;
 const doc=target.ownerDocument||root.document;if(!doc?.createElement)return false;
 const el=(tag,value)=>{const n=doc.createElement(tag);if(value!==undefined)n.textContent=value;return n};
 target.replaceChildren();
 const details=el('details');details.className='gu-adaptive-check';
 details.append(el('summary','Optional learning check · free and ungraded'));
 const wrap=el('div');wrap.className='gu-adaptive-check-body';
 wrap.append(el('p','Choose what you would like to strengthen. Your response stays in this view; it does not affect assessments, learning records or Crownlight Lumens.'));
 const inputs=el('div');inputs.className='gu-adaptive-inputs';
 const labelNeed=el('label','I want help with');const select=el('select');
 select.setAttribute('aria-label','Select the learning skill to review');
 for(const [key,skill] of Object.entries(skills)){const option=el('option',skill.label);option.value=key;select.append(option);}
 labelNeed.append(select);
 const labelConfidence=el('label','My current confidence');const confidence=el('select');
 for(const [key,value] of [['starting','Just beginning'],['learning','Can follow with help'],['independent','Ready for an independent challenge']]){
  const option=el('option',value);option.value=key;confidence.append(option);
 }
 labelConfidence.append(confidence);
 const button=el('button','Show recommended study step');button.type='button';button.className='secondary';
 const result=el('div');result.className='gu-adaptive-result';result.setAttribute('role','status');result.setAttribute('aria-live','polite');
 button.addEventListener('click',()=>{
  const plan=diagnose({lab,need:select.value,confidence:confidence.value});if(!plan)return;
  result.replaceChildren();result.append(el('h3',plan.label+' · '+plan.subject));
  for(const [heading,body] of [['Prerequisite',plan.prerequisite],['Next practice',plan.studyStep],['Available lesson evidence',plan.sourceExcerpt],['Self-check',plan.checkpoint],['Limitations',plan.caution]]){
   const p=el('p');p.append(el('strong',heading+': '),doc.createTextNode(body));result.append(p);
  }
 });
 inputs.append(labelNeed,labelConfidence,button);wrap.append(inputs,result);details.append(wrap);target.append(details);
 return true;
}
const api=Object.freeze({schema:'smfgu.learning.formative.v1',diagnose,mount,skills:Object.freeze(Object.keys(skills))});
root.GroundUpLearningAdaptiveV1=api;
if(typeof module!=='undefined'&&module.exports)module.exports=api;
})(typeof window!=='undefined'?window:globalThis);
