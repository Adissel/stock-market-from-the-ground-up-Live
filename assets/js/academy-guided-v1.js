/* Boot Camp guided learning: 274 study days, 10 course IDs.
 * Formative only. Never unlock a Lab, give a grade, fabricate historical replay,
 * deduct Lumens, or modify the existing authenticated progress APIs.
 */
(function(root){'use strict';
const active=new WeakMap();
const STEPS=['Start','Learn','Calculate / Analyze','Experiment','Predict','Replay / Practice','Assess','Review & Retry','Transfer Challenge','Results'];
// Suggested active work, not minimum dwell time. Work is self-paced.
const STANDARD_MINUTES=Object.freeze([2,5,6,3,3,4,3,3,4,2]);
const REFERENCE_MINUTES=Object.freeze([2,4,5,3,3,4,14,3,5,2]);
const el=(tag,content,cl)=>{const x=document.createElement(tag);if(content!==undefined)x.textContent=String(content);if(cl)x.className=cl;return x};
const clean=s=>String(s||'').slice(0,1400);
// Pure reporting helper: observations are not credits, mastery, or assessments.
function summarizeEvidence(records,interactions=0){
 const valid=[...records.values()].filter(row=>row?.correct===true);
 const dimensions=[['Knowledge',2],['Recognition',4],['Decision-making',6],['Process and transfer',8]].map(([name,index])=>{
  const row=records.get(index);
  const status=!row?.correct?'Not yet demonstrated in this session':
    row.assisted?'Observed with teaching assistance':
    row.attempts>1?'Observed after corrective retry':'Observed on first unassisted method check';
  return {name,status};
 });
 return Object.freeze({
  checked:valid.length,
  firstTry:valid.filter(row=>row.attempts===1&&!row.assisted).length,
  corrected:valid.filter(row=>row.attempts>1).length,
  assisted:valid.filter(row=>row.assisted).length,
  numeric:valid.filter(row=>row.numeric).length,
  interactions:Number.isSafeInteger(interactions)&&interactions>=0?interactions:0,
  dimensions
 });
}

// This check measures an evidence-handling decision, not answer-key mastery.
function methodDecision({question,topic,kind,seed=0,initial='',onSelect=()=>{}}={}){
 const api=root.GroundUpLearningResponseChoiceV1;
 const spec=api?.build?.({prompt:question,topic,kind,seed})||null;
 const group=el('fieldset',undefined,'academy-guided-method-check');
 group.append(el('legend','Choose the defensible evidence-handling method'));
 let selected=initial;
 if(spec){
  for(const option of spec.options){
   const label=el('label',undefined,'academy-guided-choice'),input=el('input');
   input.type='radio';input.name='academy-guided-method-'+String(seed)+'-'+String(topic).slice(0,20);
   input.value=option.code;input.checked=selected===option.code;
   input.addEventListener('change',()=>{selected=option.code;onSelect(selected)});
   label.append(input,document.createTextNode(option.label));group.append(label);
  }
 }else group.append(el('p','Interactive evidence check is unavailable. No grading or progress has been recorded.'));
 return {element:group,check:()=>api?.evaluate?.(spec,selected)||{accepted:false,reason:'Interactive evidence check unavailable.'}};
}
function classify(d){
 const s=(d.title+' '+d.objective).toLowerCase();
 return /vwap|volume.weighted/.test(s)?'vwap':
  (d.programCode==='scanners10'||/stock scanner|scanner filters|scanner universe|scanner results/.test(s))?'scanner':
  /candle|chart|volume|indicator|ema|price action|breakout|level|pattern|pullback|timeframe/.test(s)?'candle':
  /risk|sizing|spread|percent|quantity/.test(s)?'risk':'research';
}
function guidance(d,kind){
 const terms={
  vwap:['Price is dollars per share; volume is shares traded.','Weighted price = sum of price × shares divided by total shares.','Simulated: 200 × $8 + 100 × $10 = $2,600; 300 shares; VWAP ≈ $8.67/share.'],
  candle:['OHLC means open, high, low and close for a defined interval.','Real body = |close − open|; full range = high − low.','Simulated: $31 open, $32 close, $32.50 high, $30.50 low: body $1, range $2, body is 50% of range.'],
  scanner:['A scanner is a reproducible filter, not a prediction or trade recommendation.','Define the eligible universe, session, timestamp and price/volume conditions before comparing results.','Simulated scanner: a $4.00 reference price rises to $4.40; price change is $0.40 or 10%, but liquidity and catalyst evidence are still unknown.'],
  risk:['Plan the maximum risk before share quantity.','Planned risk per share = |entry − stop|; whole shares = floor(risk budget ÷ risk per share).','Simulated: $20 entry, $19.60 stop, $40 planned risk → 100 shares, excluding slippage, gaps and fees.'],
  research:['Identify the original publisher, evidence and measured period.','Distinguish the source timestamp from a later interpretation of the event.','Simulated: a viral claim about a contract is unverified until a dated original issuer record supports its actual wording.']
 };
 return terms[kind].concat(['The day-specific objective: '+clean(d.objective),
  'Required observation: '+clean(d.observe),
  'Practice: '+clean(d.practice),
  'Limitations: '+clean(d.limitation||d.caution)]);
}
function plan(d){
 if(d.lesson?.evidenceType==='FICTIONAL_EDUCATIONAL_DATA_NO_HISTORICAL_LICENSE'){
  const l=d.lesson;
  return {kind:classify(d),limitation:clean(d.limitation),stages:[
   ['Start',[l.title,l.terms,'Talia introduces the skill and the evidence boundary.']],
   ['Learn',[l.teach,'Source for definitions: '+l.source.url]],
   ['Calculate / Analyze',[l.worked,l.method]],
   ['Experiment',[l.experiment,'Record what changed and what stayed uncertain.']],
   ['Predict',[l.predict,'Commit to a provisional answer before revealing the review.']],
   ['Replay / Practice',[l.replay,'The example is simulated. No historical feed is implied.']],
   ['Assess',[l.transfer,'Use a new case and keep the first response in your private reflection. This is formative, not an official grade.']],
   ['Review & Retry',[l.review,'Revise the method after checking the source and the unknowns.']],
   ['Transfer Challenge',[l.transfer,'A different case requires fresh evidence and a no-trade option.']],
   ['Results',['Save the private reflection using the course controls.','Owner editorial approval: released for invited instructional Beta. Protected graded assessments remain under separate technical/editorial review.']]
  ],checks:{2:{question:'Which method applies to this lesson?',correct:clean(l.method)},
   4:{question:'What should you examine before seeing the later evidence?',correct:clean(l.predict)},
   5:{question:'What is the replay procedure?',correct:clean(l.replay)},
   6:{question:'How should this skill transfer?',correct:clean(l.transfer)},
   8:{question:'What is the independent transfer task?',correct:clean(l.transfer)}}};
 }
 // Reference-batch lessons use their actual authored evidence and mistakes
 // instead of displaying the same generic calculator for unrelated subjects.
 if(d.lesson?.status==='ORIGINAL_UNGRADED_EDITORIAL_AND_PROTECTED_REVIEW_PENDING'){
  const lesson=d.lesson,kind=classify(d),steps=lesson.sourceProcedure||[],limits=clean(lesson.whenNot),
   source=lesson.reference||{},numeric=lesson.numericChecks||[];
  const stages=[
   ['Start',[clean(d.title),clean(d.objective),clean(lesson.why)]],
   ['Learn',[clean(lesson.explanation),'Evidence reference: '+clean(source.label||'Original primary sources still required.'),'Reference scope: '+clean(source.scope)]],
   ['Calculate / Analyze',[clean(lesson.workedExample),...steps.map(clean),'The example is simulated and explicitly ungraded.']],
   ['Experiment',['Change one simulated input or source-quality condition, then reassess the conclusion.',clean(d.practice),clean(lesson.error)]],
   ['Predict',[clean(d.observe),'Predict what evidence would be necessary at the frozen observation time, not a future market price.']],
   ['Replay / Practice',[clean(lesson.investigation),'Freeze the current evidence; do not use a later publication or future candle in this decision.']],
   ['Assess',[clean(lesson.selfCheck),clean(lesson.transfer),'First response is instructional only. The protected assessor still controls any official grade.']],
   ['Review & Retry',[clean(lesson.reviewGuide),'Specific misconception: '+clean(lesson.error),'Retry the reasoning using a new original evidence case.']],
   ['Transfer Challenge',[clean(lesson.investigation),clean(lesson.transfer),limits]],
   ['Results',['Use the existing Save Reflection service to preserve study notes.','No score, independent grading or historical replay certification is claimed.','Editorial status: Not Yet Approved.']]
  ];
  const checks={
   2:{question:'Which study procedure uses the actual evidence correctly?',correct:clean(steps[0]||d.practice)},
   4:{question:'What is the required current observation?',correct:clean(d.observe)},
   5:{question:'Which practice uses the actual lesson method?',correct:clean(steps[1]||d.practice)},
   6:{question:'In an unfamiliar case, what is the defensible verification step?',correct:clean(steps[0]||d.practice)},
   8:{question:'How should an unfamiliar case be investigated?',correct:clean(lesson.transfer)}
  };
  if(numeric.length){
   checks[2]={numeric:true,question:'Independently calculate the following simulated quantities (use the units shown).',
    labels:numeric.map((c,i)=>(i+1)+'. '+clean(c.operation)+' ('+clean(c.unit)+')'),
    expected:numeric.map(c=>c.expected),
    tolerance:numeric.map(c=>c.tolerance),
    hints:numeric.map(c=>'Recompute '+clean(c.operation)+' from '+c.inputs.join(', ')+' using the stated operation and units.')};
  }
  return {kind,stages,checks,limitation:limits};
 }
 const kind=classify(d),teach=guidance(d,kind),method=clean((Array.isArray(d.method)?d.method[0]:d.method)||d.practice);
 const limitation=clean(d.limitation||d.caution||'An observation cannot guarantee a future market outcome.');
 const stages=[
  ['Start',[d.title,d.objective,'Talia teaches from first principles before requesting independent work.']],
  ['Learn',teach.slice(0,2).concat(['Today: '+clean(d.observe)])],
  ['Calculate / Analyze',teach.slice(1,3).concat(['Apply the method to: '+clean(d.title)])],
  ['Experiment',['Use the simulated ECharts chart when a chart is relevant.','For a research subject, inspect the source-and-evidence checklist.',clean(d.practice)]],
  ['Predict',[clean(d.observe),'Identify one fact you would need before claiming a likely outcome. Later market bars are never revealed by this module.']],
  ['Replay / Practice',[method,clean(d.practice),'Only synthetic simulated chart data are displayed. No future historical bar is supplied.']],
  ['Assess',['Independent formative question using a different decision situation.','The first selection is held until submission. It is not the official protected Lab assessment.']],
  ['Review & Retry',teach.concat([limitation,'Incorrect answers receive additional teaching and free retries.'])],
  ['Transfer Challenge',[clean(d.lesson?.transfer||d.practice),'Different cases require new evidence and a documented invalidation.']],
  ['Results',['Your saved private Boot Camp reflection is managed by the existing member service.','This ungraded in-browser journey does not itself persist assessment attempts.','Official competency mastery: Not Yet Assessed.']]
 ];
 const checks={
  2:{question:'Which procedure applies to today’s study skill?',correct:method},
  4:{question:'Before later evidence is available, what should you examine?',correct:clean(d.observe)},
  5:{question:'Which action is aligned with the current day’s guided practice?',correct:clean(d.practice)},
  6:{question:'A new unfamiliar case has incomplete evidence. What should you do?',correct:'Apply the method, record what remains unknown and withhold unsupported claims.'},
  8:{question:'How should you transfer the skill to a different case?',correct:'Recheck the new evidence, its limitations and the NO TRADE conditions before deciding.'}
 };
 if(kind==='vwap')checks[2]={numeric:true,question:'Calculate simulated traded dollars, shares and VWAP.',labels:['Total traded dollars ($)','Total shares','VWAP ($/share)'],expected:[2600,300,8.67],hints:['Multiply $8 × 200 and $10 × 100, then add dollar totals.','Add 200 and 100 shares.','Divide $2,600 by 300 shares; round to cents.']};
 if(kind==='candle')checks[2]={numeric:true,question:'Calculate simulated body, range and body percentage.',labels:['Real body ($)','Full range ($)','Body / range (%)'],expected:[1,2,50],hints:['Body = |$32 close − $31 open|.','Range = $32.50 high − $30.50 low.','Divide $1 body by $2 range, then multiply by 100.']};
 if(kind==='scanner'){
  if(d.programCode==='scanners10'&&d.day===2)
   checks[2]={numeric:true,question:'Compare a new scanner price move: $4.00 to $4.40.',labels:['Dollar price change ($)','Price change (%)'],expected:[.4,10],hints:['Subtract the $4.00 starting price from the $4.40 completed price.','Divide the dollar change by the $4.00 starting price and multiply by 100.']};
  if(d.programCode==='scanners10'&&d.day===3)
   checks[2]={numeric:true,question:'Calculate relative volume for matched simulated 5-minute intervals: current 6,000 shares; comparable baseline 3,000.',labels:['Volume difference (shares)','Relative volume (multiple)'],expected:[3000,2],hints:['Subtract the comparable 3,000-share baseline from the 6,000-share observation.','Divide the 6,000 current shares by the matched 3,000 baseline.']};
  if(d.programCode==='scanners10'&&d.day===6)
   checks[2]={numeric:true,question:'Calculate a displayed spread for a simulated bid of $10.00 and ask of $10.06.',labels:['Displayed spread ($)','Spread as percent of bid (%)'],expected:[.06,.6],hints:['Ask minus bid is the displayed spread.','Divide displayed spread by the $10.00 bid and multiply by 100. No fill is guaranteed.']};
 }
 if(kind==='risk')checks[2]={numeric:true,question:'Calculate simulated risk per share and share quantity.',labels:['Risk per share ($)','Whole shares for $40 planned risk'],expected:[.4,100],hints:['Use $20 entry − $19.60 planned stop.','Divide $40 by $0.40/share. Actual loss can exceed planned loss.']};
 return {kind,stages,checks,limitation};
}
function mount(host,{day,programCode,tutorRequest=null,memberFirstName=''}={}){
 if(!host||!day||!Number.isSafeInteger(day.day))return null;
 active.get(host)?.dispose();
 const cfg=plan(day);const isNewCourse=day.lesson?.evidenceType==='FICTIONAL_EDUCATIONAL_DATA_NO_HISTORICAL_LICENSE';
 const authoredFormative=Array.isArray(day.lesson?.formativeQuestions)&&day.lesson.formativeQuestions.length===12;
 const advancedCases=Array.isArray(day.lesson?.advancedPracticums)?day.lesson.advancedPracticums:[];
 const hasAdvancedPackage=isNewCourse||(authoredFormative&&advancedCases.length>0);
 const plannedMinutes=authoredFormative?REFERENCE_MINUTES:STANDARD_MINUTES;
 let stage=0,furthest=0,autoplay=false,timer=0,disposed=false,
   answer=-1,misses=0,selectedOptions=[],numericInputs=[],chart=null;const completed=new Set(),checkEvidence=new Map(),assistanceByStage=new Set(),interactionStages=new Set();
 const formativeDrafts=new Map(),reviewedFormative=new Set(),advancedDrafts=new Map(),reviewedAdvanced=new Set();
 const formativeSelections=new Map(),advancedSelections=new Map();
 const firstName=String(memberFirstName||'').trim().replace(/[^\p{L}\p{M}\s'\-]/gu,'').slice(0,32);
 const shell=el('section',undefined,'academy-guided-ten'),head=el('div',undefined,'academy-guided-head'),
   nav=el('ol',undefined,'academy-guided-nav'),meter=el('progress'),play=el('button','Play guided teaching','btn secondary'),
   status=el('p','Optional automatic narration pauses when a question appears.'),
   grid=el('div',undefined,'academy-guided-grid'),evidence=el('section',undefined,'academy-guided-evidence'),
   instructor=el('section',undefined,'academy-guided-talia'),visual=el('div',undefined,'academy-guided-chart'),
   controls=el('div',undefined,'academy-guided-controls'),previous=el('button','Previous','btn secondary'),
   next=el('button','Next','btn'),explain=el('button','Explain This Concept','btn secondary'),
   depth=el('button','Teach This in More Depth','btn secondary'),
   feedback=el('p');feedback.className='academy-guided-feedback';feedback.setAttribute('role','status');feedback.setAttribute('aria-live','polite');
 const tutorButton=el('button','Ask Market Tutor — optional','btn secondary'),tutorPanel=el('section',undefined,'academy-guided-tutor-response'),tutorOutput=el('p');
 tutorOutput.setAttribute('role','status');tutorOutput.setAttribute('aria-live','polite');
 tutorPanel.append(el('h4','Market Tutor · general educational explanation'),tutorOutput);tutorPanel.hidden=true;
 let tutorAbort=null,tutorSerial=0;
 function cancelTutor(){tutorSerial++;tutorAbort?.abort();tutorAbort=null;tutorButton.disabled=false;tutorPanel.hidden=true;tutorOutput.textContent=''}
 meter.max=10;meter.value=0;meter.setAttribute('aria-label','Completed formative steps');
 status.setAttribute('role','status');
 head.append(el('h3',firstName?'Talia · '+firstName+'\'s ten-stage Boot Camp journey':'Talia · Ten-stage Boot Camp journey'));
 {
  const itinerary=el('details');itinerary.className='academy-active-itinerary';
  itinerary.append(el('summary','Suggested active-learning itinerary — '+plannedMinutes.reduce((a,b)=>a+b,0)+' minutes (self-paced)'));
  const schedule=el('ol');STEPS.forEach((name,i)=>schedule.append(el('li',name+' — '+plannedMinutes[i]+' min of active work')));
  itinerary.append(schedule,el('p',hasAdvancedPackage?
   '45-minute suggested practice plan. This day has 12 individual formative questions and advanced reasoning cases; there is no time gate, and thorough work may take longer.':
   '35-minute suggested ten-stage practice plan for this existing Boot Camp day. The deeper 12-question and advanced-case editorial standard is still being strengthened across the original courses. This is a plan, not verified seat time.'));
  head.append(itinerary);
 }
 head.append(meter,play,status,nav);
 evidence.append(el('h4','Simulated ECharts & evidence'),visual);
 // Interaction logs are local observations, never independent grades.
 visual.addEventListener('input',event=>{if(event.target?.matches?.('input[type="range"]'))interactionStages.add(stage)});
 visual.addEventListener('click',event=>{if(event.target?.closest?.('.gu-echarts-compare-button'))interactionStages.add(stage)});
 instructor.append(el('h4','Talia Mercer — Guided instructor'));
 controls.append(previous,next,explain,depth);
 if(typeof tutorRequest==='function')controls.append(tutorButton);
 grid.append(evidence,instructor);
 shell.append(head,grid,controls,feedback,tutorPanel,el('p','Free explanations and retries. No Lumens charged. Simulated teaching evidence only; protected replay, grading and access remain unchanged.'));
 host.replaceChildren(shell);
 function stop(){if(timer){clearTimeout(timer);timer=0}}
 function narration(){
  stop();if(disposed||!autoplay)return;
  if(cfg.checks[stage]&&!completed.has(stage)){status.textContent='Paused at checkpoint: submit an instructional answer to continue.';return}
  if(stage===9){autoplay=false;play.textContent='Replay guided teaching';status.textContent='Learning report reached.';return}
  status.textContent='Talia is presenting stage '+(stage+1)+'.';
  timer=setTimeout(()=>{timer=0;if(autoplay&&!disposed){completed.add(stage);stage++;furthest=Math.max(furthest,stage);answer=-1;misses=0;render();narration()}},2400);
 }
 function render(){
  if(disposed)return;
  cancelTutor();
  tutorButton.disabled=![0,1,2,7,8,9].includes(stage);
  nav.replaceChildren();STEPS.forEach((s,i)=>{
   const li=el('li',undefined,i===stage?'current':completed.has(i)?'complete':'future'),
    b=el('button',(i+1)+'. '+s);b.type='button';b.disabled=i>furthest;
   b.setAttribute('aria-current',stage===i?'step':'false');b.onclick=()=>{stop();stage=i;answer=-1;misses=0;feedback.textContent='';render();narration()};
   li.append(b);nav.append(li);
  });
  meter.value=completed.size;
  evidence.querySelector('h4').textContent='Evidence & ECharts · '+STEPS[stage];
  if(chart){chart.dispose?.();chart=null}
  visual.replaceChildren();
  if(day.lesson?.evidenceType==='FICTIONAL_EDUCATIONAL_DATA_NO_HISTORICAL_LICENSE'&&
      root.GroundUpAcademyEvidenceV1?.mount){
   chart=root.GroundUpAcademyEvidenceV1.mount(visual,{day,stage});
  }else if(cfg.kind==='candle'||cfg.kind==='vwap'){
   if(stage>0&&stage<9&&root.CrownlightLearningEChartsV1?.mount)
    chart=root.CrownlightLearningEChartsV1.mount(visual,{kind:cfg.kind==='vwap'?'vwap':'candle',interactive:true});
   else visual.append(el('p','Simulated chart becomes available during the instructional stages.'));
   visual.append(el('p','These synthetic prices are general calculation demonstrations, not an actual replay or proof for this study day.'));
  }else{
   const ul=el('ul');for(const value of [day.objective,day.observe,day.practice,day.limitation||day.caution].filter(Boolean))ul.append(el('li',clean(value)));
   visual.append(el('h5','Evidence checklist'),ul);
   const panel=el('section');panel.className='academy-guided-method-lab';
   if(cfg.kind==='risk'){
    panel.append(el('h5','Interactive risk-sizing experiment'));
    panel.append(el('p','Simulated entry $20, planned stop $19.60. Excludes slippage, gaps and transaction costs.'));
    const label=el('label','Change planned risk budget in dollars');
    const control=el('input');control.type='range';control.min='20';control.max='200';control.step='10';control.value='40';
    const result=el('output');result.setAttribute('role','status');
    const update=()=>{const budget=Number(control.value);result.textContent='$'+budget+' budget ÷ $0.40 planned risk/share = '+Math.floor(budget/.4)+' whole shares (simulated teaching example only).'};
    control.addEventListener('input',()=>{interactionStages.add(stage);update()});
    label.append(control);panel.append(label,result);update();
   }else if(cfg.kind==='scanner'){
    panel.append(el('h5','Interactive scanner-filter experiment'));
    panel.append(el('p','Simulated data only. Change one condition and observe what the scan can establish; this is not a live scanner, trading signal, or member-grade assessment.'));
    const n=day.day,numberExercise={2:['Price at the latest completed observation ($)','4','3.6','4.8','0.1'],
     3:['Current five-minute share volume','6000','1000','10000','500'],
     6:['Displayed ask against $10.00 bid ($)','10.06','10.00','10.20','0.01']}[n];
    if(numberExercise){
     const [title,initial,min,max,step]=numberExercise;
     const label=el('label',title),input=el('input');input.type='range';
     input.min=min;input.max=max;input.step=step;input.value=initial;
     const outcome=el('output');outcome.setAttribute('role','status');
     const update=()=>{
      const value=Number(input.value);
      outcome.textContent=n===2?'Simulated $4.00 baseline: $'+(value-4).toFixed(2)+' change ('+((value/4-1)*100).toFixed(1)+'%). Verify liquidity and timestamp.':
       n===3?'Compared with 3,000 shares in a matched interval: '+(value/3000).toFixed(2)+'× relative volume; confirm the baseline.' :
       'Displayed bid $10.00, ask $'+value.toFixed(2)+': spread $'+(value-10).toFixed(2)+'; fillability is unknown.';
     };
     input.addEventListener('input',()=>{interactionStages.add(stage);update()});
     label.append(input);panel.append(label,outcome);update();
    }else{
     const choice=el('fieldset');choice.append(el('legend','Compare two scanner source conditions'));
     const feedback=el('p','Select a condition to examine the evidence boundary.');feedback.setAttribute('role','status');
     for(const [code,label,reason] of [
      ['incomplete','Scan includes mixed sessions, stale quotes or an unspecified universe','The hit list is not comparable. Record source coverage and time boundaries before interpreting it.'],
      ['defined','Scan specifies eligible symbols, time window, source and filters','The scan is repeatable, but an individual candidate still requires issuer, liquidity and risk checks.']
     ]){
      const wrap=el('label'),input=el('input');input.type='radio';
      input.name='academy-scanner-evidence-'+String(programCode||day.programCode)+'-'+day.day+'-'+stage;
      input.value=code;input.addEventListener('change',()=>{interactionStages.add(stage);feedback.textContent=reason});
      wrap.append(input,document.createTextNode(label));choice.append(wrap);
     }
     panel.append(choice,feedback);
    }
   }else{
    panel.append(el('h5','Interactive source-evidence experiment'));
    panel.append(el('p','Simulated claim: a company has announced a new contract. Compare available evidence, not future price outcomes.'));
    const choice=el('fieldset');choice.append(el('legend','Which evidence is available?'));
    const outcome=el('p','Select a source condition to examine the defensible conclusion.');outcome.setAttribute('role','status');
    for(const [key,label,conclusion] of [
     ['none','Unattributed repost with no original issuer document','Unverified: locate a dated original document before asserting the contract is confirmed.'],
     ['primary','Dated original issuer document with disclosed terms','Source exists: check the actual wording, date and scope; this does not establish any future price direction.']
    ]){
     const wrap=el('label'),input=el('input');input.type='radio';
     input.name='academy-source-case-'+String(programCode||day.programCode)+'-'+day.day+'-'+stage;
     input.value=key;
     input.addEventListener('change',()=>{interactionStages.add(stage);outcome.textContent=conclusion});
     wrap.append(input,document.createTextNode(label));choice.append(wrap);
    }
    panel.append(choice,outcome);
   }
   visual.append(panel);
  }
  instructor.querySelectorAll('.academy-guided-content').forEach(x=>x.remove());
  const content=el('div',undefined,'academy-guided-content');
  content.append(el('h4',(stage+1)+'. '+cfg.stages[stage][0]));
  for(const text of cfg.stages[stage][1])content.append(el('p',clean(text)));
  const check=cfg.checks[stage];selectedOptions=[];numericInputs=[];
  content.append(el('p','Suggested active work at this step: '+plannedMinutes[stage]+' minutes. Pause as needed; there is no time gate.'));
  if(hasAdvancedPackage&&advancedCases.length&&(stage===2||stage===8)){
   const advanced=stage===2?advancedCases[0]:advancedCases[advancedCases.length>1?1:0];
   const transferOnly=stage===8&&advancedCases.length===1;
   const exerciseId=advanced.id+(transferOnly?'-transfer':'');
   const practicum=el('section');practicum.className='academy-advanced-practicum';
   practicum.append(el('h5','Advanced application · '+advanced.id+(transferOnly?' · independent transfer':'')));
   practicum.append(el('p','Simulated evidence: '+clean(advanced.scenario)));
   practicum.append(el('p','Your task: '+clean(transferOnly?advanced.transfer:advanced.task)));
   const teaching=el('p');teaching.setAttribute('role','status');teaching.setAttribute('aria-live','polite');
   const choice=methodDecision({question:clean(transferOnly?advanced.transfer:advanced.task),
    topic:day.title,kind:cfg.kind,seed:day.day*13+stage,
    initial:advancedSelections.get(exerciseId)||'',
    onSelect:code=>{
     advancedSelections.set(exerciseId,code);
     if(reviewedAdvanced.delete(exerciseId))teaching.textContent='The selection changed; review this case again.';
    }});
   const reveal=el('button','Check my decision and review the worked case','btn secondary');
   reveal.type='button';
   if(reviewedAdvanced.has(exerciseId)){
    teaching.textContent='Worked analysis: '+clean(advanced.worked)+' Common mistake: '+clean(advanced.pitfall)+
     ' Independent transfer: '+clean(advanced.transfer);
   }
   reveal.addEventListener('click',()=>{
    const checked=choice.check();
    if(!checked.accepted){teaching.textContent=checked.reason;return;}
    reviewedAdvanced.add(exerciseId);
    teaching.textContent='Evidence-method check complete (ungraded). '+checked.feedback+' Worked analysis: '+
     clean(advanced.worked)+' Common mistake: '+clean(advanced.pitfall)+
     ' Independent transfer: '+clean(advanced.transfer);
   });
   const optional=el('details');optional.append(el('summary','Optional written reasoning — not required'));
   const response=el('textarea');response.rows=3;response.maxLength=1200;
   response.setAttribute('aria-label','Optional advanced case reasoning');
   response.value=advancedDrafts.get(exerciseId)||'';
   response.addEventListener('input',()=>advancedDrafts.set(exerciseId,response.value));
   optional.append(response);
   practicum.append(choice.element,reveal,teaching,optional);
   content.append(practicum);
  }
  if(stage===6&&hasAdvancedPackage){
   const quiz=el('section');quiz.className='academy-formative-reference';
   if(authoredFormative){
    quiz.append(el('h5','Talia’s 12 authored formative practice questions'));
    quiz.append(el('p','For each authored prompt, choose an evidence-handling method, then review Talia’s day-specific correction. Numeric and case-specific graded assessments remain separate. Optional written notes are never required for progression.'));
    const progress=el('p',reviewedFormative.size+' of 12 formative method checks reviewed');
    progress.setAttribute('role','status');progress.className='academy-formative-progress';quiz.append(progress);
    day.lesson.formativeQuestions.forEach((item,index)=>{
     const block=el('details');block.className='academy-formative-question';
     block.append(el('summary',(index+1)+'. '+clean(item.prompt)));
     const correction=el('p');correction.setAttribute('role','status');correction.hidden=true;
     const choice=methodDecision({question:item.prompt,topic:day.title,kind:cfg.kind,
      seed:day.day*17+index,initial:formativeSelections.get(item.id)||'',
      onSelect:code=>{
       formativeSelections.set(item.id,code);
       if(reviewedFormative.delete(item.id))correction.hidden=true;
       progress.textContent=reviewedFormative.size+' of 12 formative method checks reviewed';
      }});
     const reveal=el('button','Check method and review Talia’s explanation','btn secondary');reveal.type='button';
     if(reviewedFormative.has(item.id)){
      correction.textContent='Teaching feedback: '+clean(item.review);correction.hidden=false;
     }
     reveal.addEventListener('click',()=>{
      const checked=choice.check();
      if(!checked.accepted){correction.textContent=checked.reason;correction.hidden=false;return;}
      reviewedFormative.add(item.id);
      correction.textContent='Evidence-method check complete, ungraded. '+checked.feedback+
       ' Day-specific teaching feedback: '+clean(item.review);
      correction.hidden=false;
      progress.textContent=reviewedFormative.size+' of 12 formative method checks reviewed';
     });
     const optional=el('details');optional.append(el('summary','Optional written reasoning'));
     const response=el('textarea');response.rows=2;response.maxLength=1200;
     response.setAttribute('aria-label','Optional formative notes for question '+(index+1));
     response.value=formativeDrafts.get(item.id)||'';
     response.addEventListener('input',()=>formativeDrafts.set(item.id,response.value));
     optional.append(response);
     block.append(choice.element,reveal,correction,optional);quiz.append(block);
    });
   }else{
    quiz.append(el('p','Full 12-question individual authorship and editorial review remain pending for this study day. Existing guided checkpoints are provisional.'));
   }
   content.append(quiz);
  }
  if(check){
   content.append(el('h5',check.question));
   if(check.numeric){
    const group=el('div',undefined,'academy-guided-numeric');
    check.labels.forEach(label=>{
     const wrap=el('label',label),input=el('input');
     input.type='number';input.step='any';input.inputMode='decimal';
     input.setAttribute('aria-label',label);input.oninput=()=>{feedback.textContent=''};
     wrap.append(input);group.append(wrap);numericInputs.push(input);
    });
    content.append(group,el('p','Calculate each quantity separately. Retries are free.'));
   }else{
   const choices=[{t:check.correct,ok:true},
     {t:'Assume a chart or scanner result proves the outcome without checking evidence.',ok:false},
     {t:'Ignore timestamps, source limitations and the possibility of NO TRADE.',ok:false}];
   const shift=(day.day+stage)%3;selectedOptions=choices.slice(shift).concat(choices.slice(0,shift));
   const fieldset=el('fieldset');fieldset.append(el('legend','Select the most defensible action'));
   selectedOptions.forEach((choice,i)=>{
    const label=el('label',undefined,'academy-guided-choice'),input=el('input');
    input.type='radio';input.name='academy-guided-'+(programCode||day.programCode)+'-'+day.day+'-'+stage;
    input.checked=answer===i;input.onchange=()=>{answer=i;feedback.textContent=''};
    label.append(input,document.createTextNode(choice.t));fieldset.append(label);
   });
   content.append(fieldset);
   }
  }
  if(stage===6)content.append(el('p','First formative selection is preserved until submitted. No grade or Lumens are awarded. No official competency or independent mastery is awarded.'));
  if(stage===9){
   content.append(el('p','Formative stages completed: '+completed.size+' of 9. Save your own notes using the existing course reflection controls. Official competency remains Not Yet Assessed.'));
   const mastery=summarizeEvidence(checkEvidence,interactionStages.size);
   const report=el('section');report.className='academy-guided-evidence-report';
   report.append(el('h5','What your practice demonstrated — this session'));
   const facts=el('dl');for(const [label,value] of [
    ['Completed, checked method/numeric decisions',mastery.checked],
    ['Correct first attempt without stage-specific help',mastery.firstTry],
    ['Corrected after feedback',mastery.corrected],
    ['Correct with stage-specific teaching assistance',mastery.assisted],
    ['Completed numeric/equation checkpoints',mastery.numeric],
    ['Stages with recorded simulated visual interactions',mastery.interactions]
   ]){
    const row=el('div');row.append(el('dt',label),el('dd',value));facts.append(row);
   }
   report.append(facts);
   const dimensions=el('dl');dimensions.className='academy-guided-mastery-dimensions';
   for(const {name,status} of mastery.dimensions){
    const row=el('div');row.append(el('dt',name),el('dd',status));dimensions.append(row);
   }
   report.append(el('h5','Four competency dimensions · observational evidence only'),dimensions,
     el('p','Method-choice checks are not independent competency validation. Confirm transfer on a genuinely unfamiliar case and retention in a later review. Results are not saved by this guided widget. No member grades are written.'));
   report.append(el('p','This is practice evidence only, not a grade or a declaration of skill mastery. A correct method choice alone does not prove concept understanding. Protected independent assessment and source-reviewed case acceptance remain separate.'));
   content.append(report);
  }
  instructor.append(content);previous.disabled=stage===0;next.disabled=stage===9;
  next.textContent=check?'Close & Next — Submit answer':'Next lesson step';
 }
 function advance(){completed.add(stage);furthest=Math.max(furthest,stage+1);stage=Math.min(9,stage+1);answer=-1;misses=0;feedback.textContent='';render();narration()}
 next.onclick=()=>{
  if(hasAdvancedPackage&&(stage===2||stage===8)&&advancedCases.length){
   const practice=stage===2?advancedCases[0]:advancedCases[advancedCases.length>1?1:0];
   const id=practice.id+(stage===8&&advancedCases.length===1?'-transfer':'');
   if(!reviewedAdvanced.has(id)){
    feedback.textContent='Choose an evidence-handling decision and review the worked case before continuing. No written response is required.';
    return;
   }
  }
  if(hasAdvancedPackage&&stage===6&&authoredFormative&&reviewedFormative.size!==12){
   feedback.textContent='Review all twelve evidence-method checks before proceeding ('+
    reviewedFormative.size+' of 12 reviewed). Your answers are local; save a reflection separately.';
   return;
  }
  const q=cfg.checks[stage];
  if(q&&!completed.has(stage)){
   const recordAttempt=(correct,numeric)=>{
    const prior=checkEvidence.get(stage)||{attempts:0};
    checkEvidence.set(stage,{attempts:prior.attempts+1,correct,numeric,assisted:prior.assisted||assistanceByStage.has(stage)});
   };
   if(q.numeric){
    const values=numericInputs.map(x=>x.value.trim());
    const empty=values.findIndex(v=>v===''||!Number.isFinite(Number(v)));
    if(empty>=0){feedback.textContent='Enter a valid number for '+q.labels[empty]+'.';return}
    const wrong=values.findIndex((v,i)=>Math.abs(Number(v)-q.expected[i])>(q.tolerance?.[i]??(q.labels[i].includes('VWAP')?.0051:.011)));
    recordAttempt(wrong<0,true);
    if(wrong>=0){misses++;feedback.textContent=(misses===1?'Not yet. ':'Work through the intermediate step. ')+q.hints[wrong]+' Correct the entry and retry for free.';return}
   }else{
    if(answer<0){feedback.textContent='Choose an answer before submitting. You can retry for free.';return}
    recordAttempt(selectedOptions[answer].ok,false);
    if(!selectedOptions[answer].ok){
     misses++;feedback.textContent=misses===1?'Not yet. Compare the response with Talia’s evidence and method. Try again.':
      'Additional instruction: '+clean(q.correct)+' Review the evidence and retry without Lumens.';return;
    }
   }
  }
  advance();
 };
 previous.onclick=()=>{if(stage>0){stop();stage--;answer=-1;misses=0;render();narration()}};
 explain.onclick=()=>{assistanceByStage.add(stage);feedback.textContent='Talia explains: '+cfg.stages[stage][1].join(' ')+' A worked answer alone does not establish mastery.'};
 depth.onclick=()=>{
  assistanceByStage.add(stage);
  const advanced=advancedCases[stage===8&&advancedCases.length>1?1:0];
  feedback.textContent=advanced&&(stage===2||stage===8)?
   'Advanced teaching: '+clean(advanced.worked)+' Misconception: '+clean(advanced.pitfall):
   'Teach in more depth: '+guidance(day,cfg.kind).join(' ')+' Review the limitation: '+cfg.limitation;
 };
 tutorButton.onclick=async()=>{
  if(disposed||tutorButton.disabled||typeof tutorRequest!=='function')return;
  assistanceByStage.add(stage);
  const serial=++tutorSerial,controller=new AbortController();tutorAbort=controller;tutorButton.disabled=true;
  tutorPanel.hidden=false;tutorOutput.textContent='Requesting a source-grounded educational explanation…';
  try{const result=await tutorRequest({signal:controller.signal,stage:STEPS[stage],reason:'new-example'});
   if(!disposed&&!controller.signal.aborted&&serial===tutorSerial)tutorOutput.textContent=String(result?.answer||'No explanation returned.');
  }catch(error){if(!disposed&&!controller.signal.aborted&&serial===tutorSerial)
    tutorOutput.textContent=String(error?.message||'Tutor unavailable. Use the free lesson explanations.');}
  finally{if(!disposed&&serial===tutorSerial){tutorAbort=null;tutorButton.disabled=false}}
 };
 play.onclick=()=>{if(stage===9){stage=0;furthest=0;completed.clear();checkEvidence.clear();assistanceByStage.clear();interactionStages.clear();reviewedFormative.clear();reviewedAdvanced.clear();formativeDrafts.clear();advancedDrafts.clear();render()}
  autoplay=!autoplay;play.textContent=autoplay?'Pause guided teaching':'Play guided teaching';
  if(autoplay)narration();else{stop();status.textContent='Automatic teaching paused.'}};
 render();const session={dispose(){disposed=true;stop();cancelTutor();chart?.dispose?.();if(active.get(host)===session)active.delete(host);host.replaceChildren()}};active.set(host,session);return session;
}
root.GroundUpAcademyGuidedV1=Object.freeze({mount,plan,STEPS,summarizeEvidence});
})(typeof window!=='undefined'?window:globalThis);
