/* Talia Knowledge Classroom guided instruction: complements existing authorized Knowledge article.
 * Uses the approved 3x3 nine-stage navigation and original ungraded activities.
 * Does not write grades, progress, Lumens, or protected assessment data.
 */
(function(root){
'use strict';
const STAGES=Object.freeze(['Start','Learn','Experiment','Predict','Practice','Assess','Review','Transfer','Results']);
const by=(x)=>document.createElement(x);
const text=(tag,s,cls)=>{const e=by(tag);e.textContent=String(s??'');if(cls)e.className=cls;return e;};
const div=(cls)=>{const e=by('div');e.className=cls;return e;};
const btn=(label,click,disabled=false)=>{const e=text('button',label);e.type='button';e.disabled=disabled;e.addEventListener('click',click);return e;};
function solve(c){
 const x=c.values;
 switch(c.kind){
  case 'spread': return x.ask-x.bid;
  case 'midpoint': return (x.ask+x.bid)/2;
  case 'ladderCost': return x.q1*x.p1+x.q2*x.p2;
  case 'percent': return (x.end-x.start)/x.start*100;
  case 'recovery': return x.loss/(100-x.loss)*100;
  case 'marketCap': return x.sharesMillion*x.price;
  case 'dca': return x.amount/x.p1+x.amount/x.p2;
  case 'netProfit': return x.qty*(x.sell-x.buy)-x.entryFee-x.exitFee;
  case 'ema': {const a=2/(x.period+1);return a*x.close+(1-a)*x.previous;}
  case 'vwap': return (x.q1*x.p1+x.q2*x.p2)/(x.q1+x.q2);
  case 'atr': {const tr=Math.max(x.high-x.low,Math.abs(x.high-x.priorClose),Math.abs(x.low-x.priorClose));return ((x.period-1)*x.previousAtr+tr)/x.period;}
  case 'bollingerUpper': {const avg=x.closes.reduce((s,v)=>s+v,0)/x.closes.length;const sd=Math.sqrt(x.closes.reduce((s,v)=>s+(v-avg)**2,0)/x.closes.length);return avg+x.factor*sd;}
  case 'rsi': return 100-100/(1+x.gain/x.loss);
  case 'equity': return x.assets-x.liabilities;
  case 'fractional': return x.qty*x.price;
  case 'choice': return c.correct;
  default:throw Error('Unrecognized educational calculation');
 }
}
function validCase(c){
 if(!c||typeof c.prompt!=='string'||typeof c.why!=='string')return false;
 if(c.kind==='choice')return Array.isArray(c.options)&&c.options.length>=2&&Number.isInteger(c.correct)&&c.correct>=0&&c.correct<c.options.length;
 try{return typeof solve(c)==='number'&&Number.isFinite(solve(c));}catch{return false;}
}
const numberLabel=x=>Number(x.toFixed(4)).toLocaleString('en-US',{maximumFractionDigits:4});
function expected(c){const v=solve(c);return c.kind==='choice'?c.options[v]:numberLabel(v)+' '+c.unit;}
function matches(c,value){
 if(c.kind==='choice')return Number(value)===solve(c);
 if(typeof value!=='string'||!value.trim()||!Number.isFinite(Number(value)))return false;
 const n=Number(value),target=solve(c);
 return Math.abs(n-target)<=Math.max(0.011,Math.abs(target)*0.00001);
}
function renderEvidence(panel,c){
 const evidence=div('tkdb-evidence');evidence.append(text('h4','Original fictional evidence'));
 for(const [name,value] of Object.entries(c.values||{})){
  const row=div('tkdb-evidence-item');
  row.append(text('span',name.replace(/([A-Z])/g,' $1').replace(/^./,s=>s.toUpperCase())),
   text('strong',Array.isArray(value)?value.join(', '):numberLabel(value)));
  evidence.append(row);
 }
 panel.append(evidence);
}
function mount({article,element}={}){
 if(!article||!element||!root.CrownlightKdbWave1)return false;
 const lesson=root.CrownlightKdbWave1[article.slug];
 // Never mount to a public catalog or unverified/locked article.
 if(!lesson||!article.id||!article.body_markdown||!Array.isArray(article.access_plans)){
  element.hidden=true;element.replaceChildren();return false;
 }
 if(lesson.title!==article.title||lesson.cases.length!==3||!lesson.cases.every(validCase)){
  element.hidden=true;element.replaceChildren();return false;
 }
 const state={step:0,max:0,attempts:[null,null,null],notes:{predict:'',assess:''}};
 const go=(idx)=>{if(idx>=0&&idx<STAGES.length&&idx<=state.max){state.step=idx;render();}};
 function canAdvance(){
  if(state.step===2)return Boolean(state.attempts[0]);
  if(state.step===3)return state.notes.predict.trim().length>=12;
  if(state.step===4)return Boolean(state.attempts[1]);
  if(state.step===5)return state.notes.assess.trim().length>=12;
  if(state.step===7)return Boolean(state.attempts[2]);
  return true;
 }
 function moveNext(){
  if(!canAdvance())return;
  if(state.step<8){state.max=Math.max(state.max,state.step+1);state.step++;render();}
 }
 element.hidden=false;element.replaceChildren();
 const heading=text('h2','Study with Talia · '+lesson.title);
 const intro=text('p','Interactive guided lesson · Original fictional observations · Independent practice · Not an official graded assessment','tkdb-lead');
 const nav=by('nav');nav.className='tkdb-stages';nav.setAttribute('aria-label','Nine learning stages');
 const body=div('tkdb-stage-content');
 const live=text('p','','tkdb-live');live.setAttribute('role','status');live.setAttribute('aria-live','polite');
 const controls=div('tkdb-actions');
 element.append(heading,intro,nav,body,live,controls);
 function renderCase(idx,headingText){
  const c=lesson.cases[idx];
  body.append(text('h3',headingText),text('p',c.prompt));
  renderEvidence(body,c);
  const existing=state.attempts[idx];
  const label=by('label');label.className='tkdb-answer-label';
  label.append(text('span',c.kind==='choice'?'Choose the defensible interpretation':'Enter your calculation ('+c.unit+')'));
  const input=c.kind==='choice'?by('select'):by('input');
  input.id='tkdb-case-'+idx;
  if(c.kind==='choice'){
   input.append(Object.assign(by('option'),{value:'',textContent:'Choose an explanation'}));
   c.options.forEach((o,i)=>input.append(Object.assign(by('option'),{value:String(i),textContent:o})));
  }else{
   input.type='number';input.step='any';input.inputMode='decimal';input.autocomplete='off';
   input.placeholder='Enter a signed number if needed';
  }
  if(existing)input.value=existing.value;
  label.append(input);body.append(label);
  const feedback=div('tkdb-feedback');feedback.setAttribute('role','status');feedback.setAttribute('aria-live','polite');
  if(existing)feedback.textContent=(existing.correct?'Reasoning matches this fictional case. ':'Review the calculation or assumptions. ')+c.why;
  body.append(feedback);
  body.append(btn(existing?'Retry with a revised answer':'Check my reasoning',()=>{
   const raw=input.value;
   if(!raw.trim()){feedback.textContent='Enter a response before reviewing your reasoning.';return;}
   const correct=matches(c,raw);
   const prior=state.attempts[idx];
   state.attempts[idx]={value:raw,correct,tries:(prior?.tries||0)+1};
   feedback.textContent=(correct?'Reasoning matches this fictional case. ':'A correction is needed. ')+c.why;
   live.textContent='Ungraded activity checked. '+(correct?'Calculation/selection matches the example.':'Read Talia’s explanation and try again.');
   controls.replaceChildren(btn('Previous stage',()=>go(state.step-1),state.step===0),btn('Continue to '+STAGES[state.step+1],moveNext,!canAdvance()));
  }));
  body.append(text('p','You may retry without penalty. These questions do not change Academy assessment results or member progress.','tkdb-muted'));
 }
 function noteStage(key,prompt){
  body.append(text('h3',key==='predict'?'Make a conditional prediction':'Independent reasoning checkpoint'),text('p',prompt));
  const label=by('label');label.className='tkdb-answer-label';label.append(text('span','Explain using observable evidence and one limitation'));
  const field=by('textarea');field.rows=4;field.maxLength=900;field.value=state.notes[key]||'';field.setAttribute('aria-label','Your '+key+' reasoning');label.append(field);body.append(label);
  field.addEventListener('input',()=>{state.notes[key]=field.value;const next=controls.lastElementChild;if(next&&next.tagName==='BUTTON')next.disabled=!canAdvance();});
  body.append(text('p','This reflection is ungraded. No AI assessor or automated score is assigned.','tkdb-muted'));
 }
 function render(){
  nav.replaceChildren();
  STAGES.forEach((s,i)=>{
   const b=btn(String(i+1)+'. '+s,()=>go(i),i>state.max);if(i===state.step)b.setAttribute('aria-current','step');
   nav.append(b);
  });
  body.replaceChildren();live.textContent='Stage '+(state.step+1)+' of 9: '+STAGES[state.step];
  switch(state.step){
   case 0:
    body.append(text('h3','Your learning objective'),text('p',lesson.concept),
     text('p','You will investigate one guided example, state what is uncertain, practice on an independent case, review your reasoning and transfer the method to fresh evidence.'));
    break;
   case 1:{
    body.append(text('h3','Understand the method'),text('p',lesson.concept),text('p',lesson.teach),
     text('h4','Common mistake'),text('p',lesson.mistake),text('h4','Limitations'),text('p',lesson.limit));
    const link=by('a');link.href=lesson.source;link.target='_blank';link.rel='noopener noreferrer';link.textContent='Read supporting SEC or technical reference';
    body.append(link);
    break;
   }
   case 2:renderCase(0,'Experiment · Calculate or interpret visible evidence');break;
   case 3:noteStage('predict',lesson.predict+' Write what evidence would support or invalidate your explanation.');break;
   case 4:renderCase(1,'Practice · A different fictional case');break;
   case 5:
    body.append(text('p','This is an ungraded learning self-check, not the protected Academy Assess stage. Protected keys, scoring and credentials remain elsewhere.'));
    noteStage('assess',lesson.assess);break;
   case 6:{
    body.append(text('h3','Review your reasoning'));
    for(const idx of [0,1]){
     const c=lesson.cases[idx],a=state.attempts[idx];
     body.append(text('h4',idx===0?'Experiment review':'Practice review'),
      text('p','Your last response: '+(a?.value??'Not attempted')),
      text('p','Original worked explanation: '+c.why));
    }
    body.append(text('h4','Your independent self-check'),text('p',state.notes.assess||'No reflection submitted'),
     text('h4','Check the misconception'),text('p',lesson.mistake),
     text('h4','Evidence limit'),text('p',lesson.limit));
    break;
   }
   case 7:renderCase(2,'Transfer · New evidence, same underlying method');break;
   case 8:{
    const done=state.attempts.filter(Boolean);
    body.append(text('h3','Learning report · Browser session only'),
     text('p','You attempted '+done.length+' of 3 original fictional activities, with '+done.reduce((n,x)=>n+x.tries,0)+' total submissions.'),
     text('p','This is not an official grade, mastery determination or persisted learning-progress record.'),
     text('h4','What you practiced'),text('p',lesson.concept),
     text('h4','What remains uncertain'),text('p',lesson.limit));
    const tutor=by('a');tutor.href='/talia-classroom.html?q='+encodeURIComponent('Talia, explain '+lesson.title+' and help me identify another fictional example.');tutor.textContent='Continue the discussion in Talia Classroom';body.append(tutor);
    const restart=btn('Repeat this lesson with a clean browser-only record',()=>{state.step=0;state.max=0;state.attempts=[null,null,null];state.notes={predict:'',assess:''};render();});
    body.append(restart);
    break;
   }
  }
  controls.replaceChildren(btn('Previous stage',()=>go(state.step-1),state.step===0));
  if(state.step<8)controls.append(btn('Continue to '+STAGES[state.step+1],moveNext,!canAdvance()));
 }
 render();return true;
}
root.CrownlightKnowledgeLesson=Object.freeze({mount,solve,matches,stages:STAGES});
})(window);
