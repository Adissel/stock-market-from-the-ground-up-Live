/* SMFGU-ENGINE-QUANT-001: original fictional EMA and risk-method instruction.
 * Approved formula concepts, not copied platform code, private rubrics,
 * real market data, portfolio advice, official grades or mastery.
 */
(function(root){'use strict';
const VERSION='smfgu.learning.quantitative.formative.v1';
const money=v=>'$'+Number(v).toFixed(2);
const definitions=Object.freeze({
 ema:Object.freeze({code:'EMA_CONTEXT',label:'EMA: seeding, weighting and completed prices',units:'USD/share',
  intro:'An exponential moving average gives the most recent completed close more weight. This particular original teaching case uses a three-close SMA seed, not a claim of thinkorswim platform equality.',
  input:['seed','alpha','ema'],keys:['SMA seed for first 3 closes','Smoothing multiplier','EMA after close 4'],
  initial:Object.freeze({closes:Object.freeze([10,12,14,16]),period:3}),
  transfer:Object.freeze({closes:Object.freeze([20,22,24,26]),period:3}),
  limitation:'SMA-seeded EMA and first-price or prefetched EMA may differ, especially early in a series. Historical charts require source/provenance and full warmup.'}),
 risk:Object.freeze({code:'RISK_PER_SHARE',label:'Risk per share: entry and stop distance',units:'USD/share',
  intro:'The planned per-share difference is absolute entry minus stop. It does not guarantee execution at the stop or cap actual losses.',
  input:['entry','stop','distance'],keys:['Assumed entry (USD/share)','Assumed stop (USD/share)','Absolute stop distance (USD/share)'],
  initial:Object.freeze({entry:42,stop:40.5}),
  transfer:Object.freeze({entry:30,stop:28.75}),
  limitation:'Gaps, volatility, slippage, fees and unfilled stop-limit orders can cause actual outcomes to differ materially from this planned arithmetic.'}),
 sizing:Object.freeze({code:'POSITION_SIZING',label:'Position size: risk and buying power',units:'whole shares',
  intro:'The simplified whole-share ceiling is the smaller of the risk-budget limit and cash purchasing-power limit. It is not a trade recommendation.',
  input:['riskShares','cashShares','finalShares'],keys:['Risk-budget share ceiling','Buying-power share ceiling','Permitted whole-share count'],
  initial:Object.freeze({entry:42,stop:40.5,riskBudget:150,availableCash:3000}),
  transfer:Object.freeze({entry:27,stop:25,riskBudget:70,availableCash:1200}),
  limitation:'Buying-power, margin, fees, liquidity and possible slippage can further reduce permissible size. A stop does not guarantee maximum loss.'})
});
function calculate(id,data){
 if(id==='ema'){
  const p=data?.period,c=data?.closes;
  if(!Number.isInteger(p)||p<2||p>100||!Array.isArray(c)||c.length<p+1||c.length>500||
    !c.every(v=>Number.isFinite(v)&&v>=0))return null;
  const seed=c.slice(0,p).reduce((a,b)=>a+b,0)/p,alpha=2/(p+1);
  let prev=seed;const history=c.map((_,i)=>i===p-1?seed:null);
  for(let i=p;i<c.length;i++){prev=alpha*c[i]+(1-alpha)*prev;history[i]=prev;}
  return Object.freeze({values:Object.freeze([seed,alpha,prev]),history:Object.freeze(history),closes:Object.freeze(c.slice()),
   formula:'EMA(t) = α × Close(t) + (1 − α) × EMA(t−1); α = 2 / (period+1)',initialization:'SMA seed on first '+p+' completed closes'});
 }
 if(id==='risk'){
  const e=data?.entry,s=data?.stop;if(!Number.isFinite(e)||!Number.isFinite(s)||e<=0||s<=0||e===s)return null;
  const d=Math.abs(e-s);
  return Object.freeze({values:Object.freeze([e,s,d]),distance:d,formula:'Risk per share = |planned entry − planned stop|'});
 }
 if(id==='sizing'){
  const r=calculate('risk',data),b=data?.riskBudget,c=data?.availableCash,e=data?.entry;
  if(!r||!Number.isFinite(b)||!Number.isFinite(c)||b<=0||c<=0||e<=0)return null;
  const byRisk=Math.floor((b+1e-9)/r.distance),byCash=Math.floor((c+1e-9)/e);
  const shares=Math.max(0,Math.min(byRisk,byCash));
  return Object.freeze({values:Object.freeze([byRisk,byCash,shares]),riskPerShare:r.distance,
   nominalRisk:shares*r.distance,buyingPowerUsed:shares*e,
   formula:'Shares = max(0, min(floor(risk budget / |entry − stop|), floor(available cash / entry)))'});
 }
 return null;
}
const patterns=Object.freeze({
 ema:['ema_seed_mismatch','ema_multiplier_mismatch','ema_update_mismatch'],
 risk:['risk_entry_mismatch','risk_stop_mismatch','risk_distance_mismatch'],
 sizing:['risk_budget_ceiling_mismatch','buying_power_ceiling_mismatch','share_cap_mismatch']
});
function select({competencies,topic,primaryCode}={}){
 const codes=Array.isArray(competencies)?competencies:[];
 const title=typeof topic==='string'?topic:'';
 const check=[
  ['ema',/\bEMA\b|exponential moving average/i],
  ['risk',/\brisk per share\b|\bstop distance\b/i],
  ['sizing',/position siz|share.count|risk budget/i]
 ];
 for(const [id,re] of check){
  const code=definitions[id].code;
  if(re.test(title)&&codes.includes(code)&&primaryCode===code)return id;
 }
 return null;
}
function assess({studyId,inputs,mode,stage,provenance}={}){
 const def=definitions[studyId],invalid=reason=>Object.freeze({status:'insufficient_evidence',reason,officialGrade:false,masteryAwarded:false});
 if(!def||!['guided','practice'].includes(mode)||stage!=='practice'||provenance!=='fictional_authored'||
    !Array.isArray(inputs)||inputs.length!==3)return invalid('An approved, fictional Guided/Practice method is required.');
 const calc=calculate(studyId,def.initial);
 if(!calc)return invalid('The authored calculation is unavailable.');
 const observations=[];
 for(let i=0;i<3;i++){
  const text=String(inputs[i]??'').trim();
  if(text.length>24||!/^[-+]?(?:\d+(?:\.\d+)?|\.\d+)$/.test(text))return invalid('Enter three finite numbers using decimal notation.');
  const actual=Number(text);if(!Number.isFinite(actual))return invalid('Non-finite numerical input is not allowed.');
  const expected=calc.values[i],tolerance=studyId==='ema'&&i===1?.0001:studyId==='ema'?.011:studyId==='risk'?.011:.00001;
  observations.push(Object.freeze({label:def.keys[i],actual,expected,matched:Math.abs(actual-expected)<=tolerance}));
 }
 const missed=observations.findIndex(s=>!s.matched);
 const independent=calculate(studyId,def.transfer);
 return Object.freeze({schema:VERSION,studyId,sourceType:'fictional_authored',status:missed<0?'method_steps_matched':'observed_step_mismatch',
  code:missed<0?'none':patterns[studyId][missed],observedStepMismatch:missed>=0,verifiedCause:false,
  observations:Object.freeze(observations),prerequisite:missed<0?'Proceed to the independent new case.':
   'Recalculate '+def.keys[missed].toLowerCase()+' using the explicitly declared inputs, seed and units.',
  correction:def.intro+' Formula: '+calc.formula,
  transfer:Object.freeze({id:'original-fictional-'+studyId+'-transfer',inputs:def.transfer,units:def.units}),
  limitation:def.limitation+' A wrong number alone does not establish the learner’s intent.',
  officialGrade:false,masteryAwarded:false,memberRecordWritten:false,entitlementGranted:false,paidInference:false});
}
function checkTransfer({studyId,submitted,mode}={}){
 const def=definitions[studyId];
 const invalid=Object.freeze({accepted:false,correct:false,officialGrade:false,masteryAwarded:false,
  message:'No eligible ungraded independent exercise or finite numerical response.'});
 if(!def||!['guided','practice'].includes(mode)||!/^[-+]?(?:\d+(?:\.\d+)?|\.\d+)$/.test(String(submitted??'').trim()))return invalid;
 const value=Number(submitted),actual=calculate(studyId,def.transfer);
 if(!Number.isFinite(value)||!actual)return invalid;
 const target=actual.values[2],tolerance=studyId==='ema'?.011:studyId==='risk'?.011:0;
 const correct=Math.abs(value-target)<=tolerance;
 return Object.freeze({accepted:true,correct,expectedUnits:def.units,officialGrade:false,masteryAwarded:false,
  message:correct?'Correct independent fictional calculation. No grade or mastery awarded.':
   'Recheck the new fictional inputs and method. This exercise remains ungraded.'});
}
const api=Object.freeze({schema:VERSION,definitions,calculate,select,assess,checkTransfer});
root.GroundUpLearningQuantStudiesV1=api;
if(typeof module!=='undefined'&&module.exports)module.exports=api;
})(typeof window!=='undefined'?window:globalThis);
