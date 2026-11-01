/* SMFGU-TALIA-FOUNDATION-QUANT-001: original deterministic, ungraded educational arithmetic.
 * Cloudflare-compatible JS, immutable hypothetical inputs; no market feed,
 * model inference, trade routing, private Lab answers, or member persistence.
 */
const finite=n=>typeof n==='number'&&Number.isFinite(n);
const valid=(n,label)=>{if(!finite(n))throw new RangeError(label+' must be finite');return n};
export function smaSeededEma(prices,period){
 if(!Array.isArray(prices)||!Number.isInteger(period)||period<2||period>500)return null;
 if(prices.length<period||prices.some(v=>!finite(v)))return null;
 const alpha=2/(period+1);
 let current=prices.slice(0,period).reduce((a,b)=>a+b,0)/period;
 const sequence=Array(period-1).fill(null).concat([current]);
 for(let i=period;i<prices.length;i++){
  current=alpha*prices[i]+(1-alpha)*current;sequence.push(current);
 }
 return {alpha,seed:sequence[period-1],value:current,series:sequence,completedCloses:prices.length,period};
}
export function trueRange(previousClose,high,low){
 for(const [v,n] of [[previousClose,'previousClose'],[high,'high'],[low,'low']])valid(v,n);
 if(high<low)throw new RangeError('high must be >= low');
 return Math.max(high-low,Math.abs(high-previousClose),Math.abs(low-previousClose));
}
export function standardDeviations(values){
 if(!Array.isArray(values)||values.length<2||values.some(x=>!finite(x)))return null;
 const mean=values.reduce((a,b)=>a+b,0)/values.length;
 const squared=values.reduce((sum,x)=>sum+(x-mean)**2,0);
 return {mean,population:Math.sqrt(squared/values.length),sample:Math.sqrt(squared/(values.length-1)),n:values.length};
}
export function hypotheticalExpectancy(winProbability,gain,loss,cost=0){
 for(const [n,key] of [[winProbability,'win probability'],[gain,'gain'],[loss,'loss'],[cost,'cost']])valid(n,key);
 if(winProbability<0||winProbability>1||gain<0||loss<0||cost<0)throw new RangeError('invalid hypothetical scenario');
 return winProbability*gain-(1-winProbability)*loss-cost;
}
export function fixedPayoffBreakEven(win,loss,cost=0){
 for(const [n,key] of [[win,'win'],[loss,'loss'],[cost,'cost']])valid(n,key);
 if(win<=0||loss<0||cost<0||win+loss<=0)return null;
 const result=(loss+cost)/(win+loss);
 return result>=0&&result<=1?result:null;
}
export function optionPremiumNotional(pricePerShare,multiplier=100,contracts=1){
 for(const [n,key] of [[pricePerShare,'premium'],[multiplier,'multiplier'],[contracts,'contracts']])valid(n,key);
 if(pricePerShare<0||multiplier<=0||!Number.isInteger(contracts)||contracts<1)return null;
 return pricePerShare*multiplier*contracts;
}
export function optionDecomposition(type,spot,strike,premium){
 for(const [n,key] of [[spot,'spot'],[strike,'strike'],[premium,'premium']])valid(n,key);
 if(!['call','put'].includes(type)||spot<0||strike<0||premium<0)return null;
 const intrinsic=type==='call'?Math.max(spot-strike,0):Math.max(strike-spot,0);
 // Deliberately do not fabricate a negative "time value" when quotes are inconsistent.
 return premium+1e-9<intrinsic?null:{intrinsic,extrinsic:Math.max(0,premium-intrinsic)};
}
const money=v=>'$'+v.toFixed(2),num=v=>v.toFixed(4);
const cases=Object.freeze({
 TALIA_TOPIC_EMA9_ALPHA:[
  {period:9,prices:[...Array(9).fill(10),10.5]},
  {period:9,prices:[...Array(9).fill(20),19.5]}
 ],
 TALIA_TOPIC_EMA200_WARMUP:[
  {period:200,prices:[...Array(200).fill(20),21]},
  {period:200,prices:[...Array(200).fill(10),9]}
 ],
 TALIA_TOPIC_TRUE_RANGE_GAP:[
  {previous:10,high:10.8,low:10.6},
  {previous:10,high:9.5,low:9.2}
 ],
 TALIA_TOPIC_POPULATION_SAMPLE_SD:[
  {values:[1,0,-1]},
  {values:[2,2,5]}
 ],
 TALIA_TOPIC_TWO_OUTCOME_EXPECTANCY:[
  {p:0.4,win:30,loss:10,cost:0},
  {p:0.4,win:30,loss:25,cost:0}
 ],
 TALIA_TOPIC_COST_AWARE_BREAK_EVEN:[
  {win:20,loss:10,cost:2},
  {win:40,loss:20,cost:4}
 ],
 TALIA_TOPIC_OPTION_MULTIPLIER_PREMIUM:[
  {price:2.5,contracts:1,multiplier:100},
  {price:1.35,contracts:2,multiplier:100}
 ],
 TALIA_TOPIC_CALL_PREMIUM_COMPONENTS:[
  {type:'call',spot:55,strike:50,premium:7},
  {type:'call',spot:55,strike:60,premium:1}
 ],
 TALIA_TOPIC_PUT_PREMIUM_COMPONENTS:[
  {type:'put',spot:37,strike:40,premium:4.25},
  {type:'put',spot:47,strike:45,premium:0.8}
 ]
});
export const FOUNDATION_QUANT_TOPICS=Object.freeze(Object.keys(cases));
export function foundationQuantTeaching(code,question=''){
 const list=cases[String(code||'')];if(!list)return null;
 const another=/\b(?:another|different|new case|try again)\b/i.test(String(question));
 const x=list[another?1:0],lines=['Additional original, fictional, independently calculated mathematics (ungraded).'];
 if('period'in x){
  const result=smaSeededEma(x.prices,x.period),alpha=result.alpha;
  lines.push('Input: '+x.prices.length+' completed synthetic closes; period='+x.period+'.',
   'First valid SMA seed from '+x.period+' closes = '+money(result.seed)+'.',
   'Alpha=2/('+x.period+'+1)='+num(alpha)+'.',
   'Next completed close '+money(x.prices.at(-1))+' gives EMA='+money(result.value)+' (unrounded '+num(result.value)+').',
   'Incomplete history: only '+(x.period-1)+' completed closes would produce no valid EMA under this seed convention.');
 }else if('previous'in x){
  const result=trueRange(x.previous,x.high,x.low);
  lines.push('Prior completed close '+money(x.previous)+'; current high '+money(x.high)+' and low '+money(x.low)+'.',
   'Three candidate distances: '+money(x.high-x.low)+', '+money(Math.abs(x.high-x.previous))+', '+money(Math.abs(x.low-x.previous))+'.',
   'True range = maximum = '+money(result)+', not a full ATR series.');
 }else if('values'in x){
  const sd=standardDeviations(x.values);
  lines.push('Fictional percent observations: '+x.values.join('%, ')+'%; mean='+num(sd.mean)+' percentage points.',
   'Population standard deviation='+num(sd.population)+' percentage points (denominator n='+sd.n+').',
   'Sample standard deviation='+num(sd.sample)+' percentage points (denominator n-1='+(sd.n-1)+').');
 }else if('p'in x){
  lines.push('Assumed probability '+num(x.p)+'; win '+money(x.win)+'; loss magnitude '+money(x.loss)+'; cost '+money(x.cost)+'.',
   'Expected per-attempt price-only result = '+num(x.p)+'×'+money(x.win)+' − '+num(1-x.p)+'×'+money(x.loss)+' − '+money(x.cost)+' = '+money(hypotheticalExpectancy(x.p,x.win,x.loss,x.cost))+'.');
 }else if('win'in x){
  const value=fixedPayoffBreakEven(x.win,x.loss,x.cost);
  lines.push('Hypothetical fixed win='+money(x.win)+', loss magnitude='+money(x.loss)+', cost='+money(x.cost)+'.',
   'Break-even win fraction = (loss + cost)/(win + loss) = '+(100*value).toFixed(2)+'% under only these assumed outcomes.');
 }else if('price'in x){
  lines.push('Premium '+money(x.price)+' per share × '+x.multiplier+' shares per ordinary hypothetical contract × '+x.contracts+' contracts.',
   'Gross premium = '+money(optionPremiumNotional(x.price,x.multiplier,x.contracts))+' before execution costs; actual deliverables must be checked.');
 }else if('type'in x){
  const value=optionDecomposition(x.type,x.spot,x.strike,x.premium);
  lines.push('Hypothetical '+x.type+' spot='+money(x.spot)+', strike='+money(x.strike)+', option premium='+money(x.premium)+' per share.',
   'Intrinsic=max('+(x.type==='call'?'spot−strike':'strike−spot')+', 0)='+money(value.intrinsic)+'.',
   'Remaining extrinsic premium='+money(x.premium)+'−'+money(value.intrinsic)+'='+money(value.extrinsic)+'.');
 }
 lines.push('Boundary: only declared completed fictional evidence; no model inference, live quote, trade advice, historical claim or protected grade.');
 return lines.join('\n\n');
}
