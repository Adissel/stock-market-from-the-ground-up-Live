/* Crownlight Prototype V2 — single reusable instructor case component.
 * Authenticated, server-verified fictional case data; no private graded keys, scores or writes.
 */
(()=>{'use strict';
const h=(tag,text,cls)=>{const el=document.createElement(tag);if(text!==undefined)el.textContent=String(text);if(cls)el.className=cls;return el;};
const state={cache:null,pending:null,selected:0,revealed:2,caseChange:0,active:0,notice:'',answer:'',tab:null};
const eligible=new Set(['classroom','labs','bootcamps','studio','replay','talia','admin']);
const fmt=n=>Number(n).toFixed(2);
function data(){return state.cache?.cases?.[state.selected]||null}
function sampleCandles(){const x=data();if(!x||!eligible.has(state.tab))return null;const count=state.tab==='replay'?state.revealed:x.candles.length;
 return x.candles.slice(0,count).map(d=>({t:d.time,open:d.open,close:d.close,low:d.low,high:d.high,volume:d.volume}));}
function setActiveTab(tab){if(tab==='replay'&&state.tab!==tab)state.revealed=2;state.tab=eligible.has(tab)?tab:null;}
function reset(){state.cache=null;state.pending=null;state.selected=0;state.revealed=2;state.active++;state.tab=null;}
function event(){window.dispatchEvent(new Event('crownlight:prototype-case-change'));}
function button(title,fn){const e=h('button',title);e.type='button';e.addEventListener('click',fn);return e;}
function row(k,v){const tr=h('tr');tr.append(h('th',k),h('td',v));return tr;}
function setNotice(message){state.notice=message;}
function calc(x,limit){let sumPV=0,sumV=0;return x.candles.slice(0,limit).map((c,i)=>{
 const typical=(c.high+c.low+c.close)/3;
 sumPV+=typical*c.volume;sumV+=c.volume;
 return {bar:i+1,time:c.time,typical,weighted:typical*c.volume,cumulativeVolume:sumV,vwap:sumPV/sumV,close:c.close};
});}
function makeTable(x,limit){
 const table=h('table',undefined,'pt-table');const risk=x.id.endsWith('RISK-03');
 const thead=h('tr');(risk?['Time','Open','High','Low','Close','Volume']:['Time','High','Low','Close','Volume','Typical-price proxy','Cumulative proxy']).forEach(key=>thead.append(h('th',key)));table.append(thead);
 const points=calc(x,limit);
 for(let i=0;i<limit;i++){
  const c=x.candles[i],item=points[i],tr=h('tr');
  (risk?[c.time,'$'+fmt(c.open),'$'+fmt(c.high),'$'+fmt(c.low),'$'+fmt(c.close),c.volume.toLocaleString()]:[c.time,'$'+fmt(c.high),'$'+fmt(c.low),'$'+fmt(c.close),c.volume.toLocaleString(),'$'+fmt(item.typical),'$'+fmt(item.vwap)]).forEach(v=>tr.append(h('td',v)));
  table.append(tr);
 }
 return table;
}
function build(root,tab,mode){
 const x=data();if(!x){root.append(h('p','No authorized fictional cases available.'));return;}
 root.replaceChildren();
 const heading=h('h3','Protected instructional-case workbench');root.append(heading);
 root.append(h('p','Role-gated API · FICTIONAL DATA · no real member records · no private answer keys · no official grading','pt-note'));
 const label=h('label','Case study');const select=h('select');select.setAttribute('aria-label','Choose fictional instructional case');
 for(const [i,item] of state.cache.cases.entries()){
  const option=h('option',item.topic+' — '+item.name);option.value=String(i);select.append(option);
 }select.value=String(state.selected);
 select.addEventListener('change',()=>{state.selected=Number(select.value);state.revealed=2;state.answer='';setNotice('Case changed. No member progress recorded.');build(root,tab,mode);event();});
 label.append(select);root.append(label);
 root.append(h('h4',x.name),h('p',x.objective),h('p',x.note));
 if(tab==='bootcamps'){
  root.append(h('p','Boot Camp presentation: link the nine-stage shared classroom to an approved study-day record. This exercise is not mapped to an official study day.'));
 }else if(tab==='labs'||tab==='classroom'){
  root.append(h('p','Lab presentation: guided example and independent assessment are separate. This example is ungraded, and private assessment cases are never included.'));
 }else if(tab==='studio'){
  root.append(h('p','Chart Studio presentation: the chart below can follow this synthetic case. Technical indicators and synchronized layouts remain separate acceptance items.'));
 }else if(tab==='talia'){
  root.append(h('p','Talia Mercer teaching preview: direct price evidence, measured quantities and limitations accompany any explanation.'));
 }else if(tab==='admin'){
  root.append(h('p','Admin editorial control: source type, mathematical steps and independent-assessment boundaries can be reviewed without changing real lessons.'));
 }
 const nav=h('div',undefined,'pt-row');
 const prev=button('Previous candle',()=>{state.revealed=Math.max(1,state.revealed-1);build(root,tab,mode);event()});
 const next=button('Reveal next candle',()=>{state.revealed=Math.min(x.candles.length,state.revealed+1);build(root,tab,mode);event()});
 prev.disabled=state.revealed<=1;next.disabled=state.revealed>=x.candles.length;
 nav.append(prev,next,h('span','Visible '+state.revealed+' of '+x.candles.length+' candles'));
 root.append(nav);
 const limit=tab==='replay'?state.revealed:x.candles.length;
 const tableScroller=h('div',undefined,'pt-table-scroll');tableScroller.setAttribute('role','region');tableScroller.setAttribute('aria-label','Fictional candle calculations (horizontally scrollable on small screens)');tableScroller.tabIndex=0;tableScroller.append(makeTable(x,limit));root.append(tableScroller);
 const formula=h('div',undefined,'pt-stage');
 const risk=x.id.endsWith('RISK-03'),breakout=x.id.endsWith('BREAKOUT-02');
 formula.append(h('strong',risk?'Worked calculation — planned long-trade risk/reward':breakout?'Worked calculation — breakout rejection':'Worked calculation — OHLCV typical-price VWAP proxy'));
 if(risk){
  formula.append(h('p','Hypothetical entry $15.25 − stop $15.00 = $0.25 risk per share. Target $15.75 − entry $15.25 = $0.50 potential reward per share. Planned reward/risk = $0.50 ÷ $0.25 = 2:1, before spread, fees and slippage.'));
 }else if(breakout){
  formula.append(h('p','The third candle traded up to $20.60 but closed at $20.15. Rejection distance = $20.60 − $20.15 = $0.45/share; a wick is not proof of a specific subsequent outcome.'));
 }else{
  const rows=calc(x,limit),last=rows[rows.length-1];
  formula.append(h('p','Typical price = (High + Low + Close) ÷ 3. Cumulative bar proxy = Σ(Typical price × bar volume) ÷ Σ(bar volume). This is an OHLCV approximation, not true trade-print VWAP.'));
  if(last)formula.append(h('p','After '+limit+' fictional bar(s), cumulative volume = '+last.cumulativeVolume.toLocaleString()+' shares and proxy ≈ $'+fmt(last.vwap)+'.'));
 }
 root.append(formula);
 const question=h('div',undefined,'pt-card');
 question.append(h('h4','Ungraded guided check'),h('p',x.question));
 const input=h('input');input.type='number';input.step='0.01';input.placeholder='Enter dollar value';input.setAttribute('aria-label','Your guided calculation');input.value=state.answer;input.addEventListener('input',()=>{state.answer=input.value});
 const feedback=h('p',state.notice,'pt-note');feedback.setAttribute('role','status');
 question.append(input,button('Check calculation',()=>{
  const entered=Number(input.value),expected=x.id.endsWith('RISK-03')?0.25:
   x.id.endsWith('BREAKOUT-02')?0.45:(x.candles[0].high+x.candles[0].low+x.candles[0].close)/3;
  if(!input.value.trim()||!Number.isFinite(entered)){feedback.textContent='Enter a numeric value in dollars; this is an ungraded teaching check.';return;}
  const advice=x.id.endsWith('RISK-03')?'Subtract the $15.00 stop from the $15.25 entry.':x.id.endsWith('BREAKOUT-02')?'Subtract the $20.15 close from the $20.60 high.':'For the first candle, add $10.40, $9.80, and $10.20, then divide by three.';
  feedback.textContent=Math.abs(entered-expected)<=0.011?'Correct to the nearest cent. '+advice:'Not yet. '+advice+' Guided retries are ungraded and do not affect progress.';
 }));
 question.append(feedback);root.append(question);
 const instruct=h('section',undefined,'pt-card');instruct.append(h('h4','Talia explanation'),h('p',x.instructor),h('p','This is instructional scenario analysis, not a trading signal or investment recommendation.'));root.append(instruct);
 const quality=h('div',undefined,'pt-card');
 quality.append(h('strong','Editorial protection'));
 quality.append(h('p','Fictional provenance verified in case metadata. Independent answer keys: excluded. Member identity and grade writes: unavailable. Visual replay is bounded by the selected candle count.'));
 root.append(quality);
}
async function fetchData(){
 if(state.cache)return state.cache;
 if(state.pending)return state.pending;
 state.pending=(async()=>{
  const sb=await window.getSupabaseClient?.();if(!sb)throw Error('Sign-in service unavailable');
  const {data:{session}}=await sb.auth.getSession();
  if(!session?.access_token)throw Error('Session expired. Reauthenticate.');
  const res=await fetch('/api/prototype-training-cases',{method:'GET',headers:{authorization:'Bearer '+session.access_token,accept:'application/json'},cache:'no-store',credentials:'same-origin'});
  if(!res.ok)throw Error('Instruction API access denied or unavailable ('+res.status+').');
  const payload=await res.json();
  if(!payload?.ok||payload.source!=='FICTIONAL_PROTOTYPE'||payload.privateAnswerKeysIncluded!==false||payload.gradingEnabled!==false||!Array.isArray(payload.cases)||payload.cases.length!==3)
   throw Error('Instruction contract validation failed.');
  for(const c of payload.cases)if(!Array.isArray(c.candles)||c.candles.length!==4||c.type!=='FICTIONAL'||c.candles.some(k=>!Number.isFinite(k.high)||!Number.isFinite(k.low)||!Number.isFinite(k.close)||!Number.isInteger(k.volume)||k.volume<=0||k.low>Math.min(k.open,k.close)||k.high<Math.max(k.open,k.close)))throw Error('Invalid fictional teaching data.');
  state.cache=payload;return payload;
 })();
 try{return await state.pending}finally{state.pending=null;}
}
async function mount(root,tab,mode){
 if(!eligible.has(tab))return;
 const epoch=++state.active;state.tab=tab;
 const panel=h('section',undefined,'pt-card');panel.dataset.prototypeCase='true';
 root.prepend(panel);panel.append(h('p','Loading three role-protected fictional instructional cases…'));
 try{await fetchData();if(epoch!==state.active||!panel.isConnected)return;build(panel,tab,mode);event();}
 catch(error){if(epoch!==state.active||!panel.isConnected)return;panel.replaceChildren(h('p','Instructional case unavailable: '+(error?.message||'Authorization required.')));}
}
window.CrownlightPrototypeTeaching=Object.freeze({mount,getChartCandles:sampleCandles,setActiveTab,reset});
})();
